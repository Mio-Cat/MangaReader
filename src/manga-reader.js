import { PageFlip } from '../vendor/page-flip.esm.js';

/*
 * MangaReader —— 漫画双页阅读组件（基于 page-flip 的 3D 翻页）
 *
 * RTL 实现说明：page-flip 无 rtl 选项。对书本容器施加 CSS scaleX(-1) 镜像，
 * 获得正确的日漫几何（封面在右、2|1/4|3 排布、左页向右卷起、纸堆方向），
 * 并把内部 getMousePos 同步镜像。为避免"内容跟着翻"，喂给引擎的每张图
 * 先做一次性水平预镜像（离屏 canvas → blob）：容器镜像 × 图像镜像 = 原图。
 */

export const DEFAULTS = {
  pages: [],             // string[] 内容页图片 url（阅读顺序 p1..pN）
  cover: null,           // 封面 url（可选，作为硬封面单独页）
  back: null,            // 封底 url（可选）
  rtl: true,             // 右起翻阅（日漫）
  spread: 'auto',        // 'double' | 'single' | 'auto'（窄屏自动单页）
  ratio: 0.707,          // 单页宽高比 w/h
  flippingTime: 800,
  maxShadowOpacity: 0.75,
  corner: 'bottom',      // 自动翻页抓手的页角 'top'|'bottom'
  singleBreakpoint: 640, // stage 宽度低于此值时 auto 切单页
  // 控件不再由组件提供：外部 HTML 自行放置工具栏，按钮用 data-act
  // （next/prev/first/last/spread/dir/theme），页码/进度用
  // .mr-page-indicator / .mr-progress（存在即同步），也可用 onPageChange 回调自建。
  hotzones: true,        // 点击屏幕左右 30% 翻页
  keyboard: true,
  wheel: true,
  theme: 'auto',         // 'dark' | 'light' | 'auto'（跟随系统）
  pageThickness: 0.32,   // 书厚像素/页（两侧纸边堆叠效果）
  onStateChange: null,   // (state: 'user_fold'|'fold_corner'|'flipping'|'read') => void
  onPageChange: null,    // ({logical, display, progress}) => void
};

let uid = 0;

export class MangaReader {
  constructor(root, options = {}) {
    this.opts = { ...DEFAULTS, ...options };
    this.root = root;
    this.id = ++uid;
    this.flip = null;
    this.destroyed = false;
    this._activeSingle = null;
    this._wheelLock = 0;
    this._down = null;
    this._foldMove = null;
    this._foldDriven = false;
    this._spineTimer = 0;
    this._mirrorCache = new Map(); // 原 url -> 预镜像 blob url（RTL 用，缓存复用）
    this._prepSeq = 0;

    this._buildShell();
    this._bindGlobalEvents();
    this._boot();
  }

  /* ================= 页序与索引映射 ================= */

  _orderedUrls() {
    const { pages, cover, back } = this.opts;
    const list = [];
    if (cover) list.push(cover);
    list.push(...pages);
    if (back) list.push(back);
    return list;
  }

  /** orderIdx（不含封面偏移）-> 当前跨页可见的逻辑页号列表（1 基） */
  _logicalsAt(c) {
    const total = this.opts.pages.length;
    if (c < 0) return []; // 封面单独页
    const valid = (p) => p >= 1 && p <= total;
    const nums = this._activeSingle ? [c + 1] : [c + 1, c + 2];
    return nums.filter(valid);
  }

  /** 逻辑页号 -> 所在 sheet 的 orderIdx */
  _orderIdxOfLogical(p) { return p - 1; }

  _coverOffset() { return this.opts.cover ? 1 : 0; }
  _sheets() { return this._orderedUrls().length; }

  /* ================= DOM ================= */

  _buildShell() {
    this.root.classList.add('manga-reader');
    this.root.innerHTML = `
      <div class="mr-stage">
        <div class="mr-book-wrap" data-spread="double">
          <div class="mr-edge-band"></div>
          <div class="mr-edge-shade"></div>
        </div>
      </div>
      <div class="mr-spinner"></div>
    `;

    this.stage = this.root.querySelector('.mr-stage');
    this.bookWrap = this.root.querySelector('.mr-book-wrap');
    this.spinner = this.root.querySelector('.mr-spinner');

    // 控制接口：外部自行放置的按钮只要带 data-act（next/prev/first/last/spread/dir/theme）
    // 并挂在 root 内，即由这里的委托点击处理路由到对应公开方法。
    this.root.addEventListener('click', (e) => {
      const act = e.target.closest('[data-act]')?.dataset.act;
      if (!act) return;
      if (act === 'next') this.next();
      else if (act === 'prev') this.prev();
      else if (act === 'first') this.goToPage(0);
      else if (act === 'last') this.goToPage(this.opts.pages.length + 1);
      else if (act === 'spread') this.setSpread(this._activeSingle ? 'double' : 'single');
      else if (act === 'dir') this.toggleDirection();
      else if (act === 'theme') this.toggleTheme();
    });

    if (this.opts.hotzones) this._bindClickZones();

    this._ro = new ResizeObserver(() => this._layout());
    this._ro.observe(this.stage);

    this._applyTheme();
  }

  _applyTheme() {
    const { theme } = this.opts;
    const apply = () => {
      const resolved = theme === 'auto'
        ? (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
        : theme;
      this.root.dataset.theme = resolved;
    };
    apply();
    if (theme === 'auto') {
      this._applyThemeBound = apply;
      this._mq = matchMedia('(prefers-color-scheme: light)');
      this._mq.addEventListener?.('change', apply);
    }
  }

  /**
   * 点击左右区域翻页。不覆盖在画布上（会挡页角拖拽），
   * 改为根节点监听 click，并用手势位移过滤掉拖页产生的伪点击。
   */
  _bindClickZones() {
    this.stage.addEventListener('pointerdown', (e) => {
      this._down = { x: e.clientX, y: e.clientY };
    });
    this.stage.addEventListener('click', (e) => {
      if (!this._down) return;
      const moved = Math.hypot(e.clientX - this._down.x, e.clientY - this._down.y);
      this._down = null;
      if (moved > 10 || !this.flip) return;
      const r = this.stage.getBoundingClientRect();
      const fx = (e.clientX - r.left) / r.width;
      if (fx < 0.32) this.opts.rtl ? this.next() : this.prev();
      else if (fx > 0.68) this.opts.rtl ? this.prev() : this.next();
    });
  }

  _isSingleMode() {
    const { spread, singleBreakpoint } = this.opts;
    if (spread === 'single') return true;
    if (spread === 'double') return false;
    return this.stage.clientWidth < singleBreakpoint;
  }

  /** 按舞台尺寸与单/双页模式计算书本容器像素尺寸 */
  _layout() {
    if (!this.bookWrap) return;
    const single = this._isSingleMode();
    if (single !== this._activeSingle && this._activeSingle !== null && this.flip) {
      this._rebuild(); // 跨断点：重建引擎
      return;
    }
    this._activeSingle = single;
    this._setSize(single);
    this.bookWrap.dataset.spread = single ? 'single' : 'double';
    this.flip?.update();
  }

  /** 舞台内容盒可用尺寸（clientHeight/Width 含 padding，必须按实际 padding 扣减，
   *  否则 wrap 的 max-height:100% 会把高度钳掉、宽高比失真，引擎留白成白条） */
  _availBox() {
    const cs = getComputedStyle(this.stage);
    const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    return {
      w: Math.max(50, this.stage.clientWidth - padX),
      h: Math.max(50, this.stage.clientHeight - padY),
    };
  }

  /** 与引擎完全一致的跨页宽高比（引擎用整数化后的 pageW/1400，不是原始 ratio） */
  _engineSpreadRatio(single) {
    const n = Math.round(1400 * this.opts.ratio) / 1400;
    return single ? n : n * 2;
  }

  /** 令 wrap 宽 = 引擎按高度算出的 block 宽，保证 block 横向铺满画布、无白边距 */
  _setSize(single) {
    const { w: availW, h: availH } = this._availBox();
    const ratio = this._engineSpreadRatio(single);
    let w = Math.floor(Math.min(availW, availH * ratio));
    let h = Math.ceil(w / ratio);
    if (h > availH) { h = availH; w = Math.floor(h * ratio); }
    this.bookWrap.style.width = `${w}px`;
    this.bookWrap.style.height = `${h}px`;
    this._applyThickness(h);
  }

  /** 书厚总宽（两侧纸页条）随页数线性变化：最薄=原值 1/4，最厚=原值 2/3 */
  _applyThickness(bookH) {
    const raw = this.opts.pages.length * this.opts.pageThickness;
    const base = Math.max(3, Math.min(22, raw * (bookH / 1400)));
    const f = Math.min(1, raw / 22); // 22px 为原书厚上限，f=0 最薄、f=1 最厚
    this._thickBase = base * (0.25 + f * (2 / 3 - 0.25));
    this.bookWrap.style.setProperty('--mr-thick', `${this._thickBase.toFixed(1)}px`);
    this._updateThicknessSplit();
  }

  /** 左右纸堆按阅读进度此消彼长（日漫：读过的一侧变厚），翻页期间线性过渡 */
  _updateThicknessSplit() {
    if (!this.bookWrap || !this.flip) return;
    const base = this._thickBase || 0;
    const maxIdx = this._sheets() - 1;
    const p = maxIdx > 0
      ? Math.max(0, Math.min(1, this.flip.getCurrentPageIndex() / maxIdx))
      : 0;
    const [l, r] = this.opts.rtl
      ? [base * (1 - p), base * p]
      : [base * p, base * (1 - p)];
    const ratioL = l + r > 0 ? l / (l + r) : 0.5;
    const ratioR = l + r > 0 ? r / (l + r) : 0.5;
    this.bookWrap.style.setProperty('--mr-thick-l', `${l.toFixed(1)}px`);
    this.bookWrap.style.setProperty('--mr-thick-r', `${r.toFixed(1)}px`);
    // 书口白带：系数随该侧条宽平滑变化——薄端 ≈1.44×（最小可见段不变），
    // 满厚端 =1.20×（条宽上限，如 5.5px 条 → 6.6px 带）；空侧为 0。全比例，无固定 px。
    const bandAt = (s) => base > 0 ? s * (1.44 - 0.24 * (s / base)) : 0;
    this.bookWrap.style.setProperty('--mr-band-l', `${bandAt(l).toFixed(1)}px`);
    this.bookWrap.style.setProperty('--mr-band-r', `${bandAt(r).toFixed(1)}px`);
    // 书厚阴影：恢复原来 1.8% 书宽基准宽，按该侧纸堆占比分配
    const shade = this.bookWrap.clientWidth * 0.018;
    this.bookWrap.style.setProperty('--mr-shade-l', `${(shade * ratioL).toFixed(1)}px`);
    this.bookWrap.style.setProperty('--mr-shade-r', `${(shade * ratioR).toFixed(1)}px`);
  }

  /* ================= 引擎 ================= */

  async _boot() {
    this._showSpinner(true);
    this._layout();
    const list = this._orderedUrls();
    try {
      await Promise.all(list.map((u) => this._preload(u)));
    } catch {
      console.warn('[MangaReader] 部分图片加载失败，仍继续渲染');
    }
    if (this.destroyed) return;
    const urls = await this._prepareUrls(list);
    if (this.destroyed) return;
    this._initFlip(urls);
    this._showSpinner(false);
  }

  /** RTL 下把每张图换成预镜像版本（缓存命中则同步返回） */
  _prepareUrls(list) {
    if (!this.opts.rtl) return Promise.resolve(list.slice());
    return Promise.all(list.map((u) => this._prepareUrl(u)));
  }

  _prepareUrl(url) {
    const hit = this._mirrorCache.get(url);
    if (hit) return Promise.resolve(hit);
    return this._mirrored(url)
      .then((blobUrl) => {
        this._mirrorCache.set(url, blobUrl);
        return blobUrl;
      })
      .catch(() => url); // 镜像失败则退化为原图（内容会被容器翻成镜像，但不阻塞阅读）
  }

  _mirrored(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        const ctx = c.getContext('2d');
        ctx.translate(c.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(img, 0, 0);
        c.toBlob(
          (b) => (b ? resolve(URL.createObjectURL(b)) : reject(new Error('toBlob failed'))),
          'image/jpeg',
          0.92,
        );
      };
      img.onerror = () => reject(new Error('load failed'));
      img.src = url;
    });
  }

  _preload(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  _initFlip(urls) {
    try { this.flip?.destroy(); } catch { /* 旧 canvas 可能已移除 */ }
    this.bookEl = document.createElement('div');
    this.bookEl.className = 'mr-book';
    this.bookWrap.appendChild(this.bookEl);

    const pageH = 1400;
    const pageW = Math.round(pageH * this.opts.ratio);
    const blockW = this.bookWrap.clientWidth;
    const single = this._activeSingle;

    this.flip = new PageFlip(this.bookEl, {
      size: 'stretch',
      width: pageW,          // 单页逻辑宽（决定纸张比例）
      height: pageH,
      minWidth: single ? Math.floor(blockW / 2) + 2 : 0, // 单页：强制命中 portrait 判定
      maxWidth: 100000,
      minHeight: 0, // 库会把 minHeight 写成行内样式，撑破容器，必须为 0
      maxHeight: 100000,
      usePortrait: single,
      showCover: Boolean(this.opts.cover),
      maxShadowOpacity: this.opts.maxShadowOpacity,
      drawShadow: true,
      flippingTime: this.opts.flippingTime,
      mobileScrollSupport: true,
      disableFlipByClick: true, // 点击翻页由组件热区接管（避免与页角拖拽冲突且方向可控）
      startPage: 0,
    });

    this.flip.loadFromImages(urls);
    this._applyRtlMirror();
    // 过渡时长默认 0ms：加载期引擎也会派发 flip/重算，只有真实翻页状态才临时开启
    // （见 _enableEdgeTransition），避免刷新时书口条/白边/阴影出现动画。
    this.bookWrap.style.setProperty('--mr-thick-t', '0ms');

    this.flip.on('flip', () => this._syncUi());
    this.flip.on('changeState', (e) => {
      this.opts.onStateChange?.(e.data);
      this._onFlipState(e.data);
    });

    this._syncUi();
  }

  /**
   * 仅在翻页交互期间开启书口条/白边/阴影的线性过渡：
   * flip 事件在卷页动画结束后才触发宽度更新，因此覆盖
   * “动画时长 + 落位后过渡时长”，之后自动回落到 0ms（加载/缩放即时落位）。
   */
  _enableEdgeTransition() {
    this.bookWrap.style.setProperty('--mr-thick-t', `${this.opts.flippingTime}ms`);
    clearTimeout(this._edgeDurTimer);
    this._edgeDurTimer = setTimeout(() => {
      this.bookWrap?.style.setProperty('--mr-thick-t', '0ms');
    }, this.opts.flippingTime * 2 + 250);
  }

  _rebuild() {
    this._activeSingle = this._isSingleMode();
    const cur = this._currentLogical();
    this._layoutSizesOnly();
    const seq = ++this._prepSeq;
    this._prepareUrls(this._orderedUrls()).then((urls) => {
      if (this.destroyed || seq !== this._prepSeq) return; // 过期的重建请求
      this._initFlip(urls);
      if (cur != null) this.goToPage(cur);
    });
  }

  _layoutSizesOnly() {
    const single = this._activeSingle;
    this._setSize(single);
    this.bookWrap.dataset.spread = single ? 'single' : 'double';
  }

  /** RTL：镜像书本容器并同步镜像指针坐标（详见文件头注释） */
  _applyRtlMirror() {
    const rtl = this.opts.rtl;
    this.bookEl.style.transform = rtl ? 'scaleX(-1)' : '';
    if (!rtl) return;
    const ui = this.flip.ui;
    if (!ui) return;
    ui.getMousePos = function (x, y) {
      const rect = this.distElement.getBoundingClientRect();
      return { x: rect.right - x, y: y - rect.top };
    };
  }

  /* ================= 导航 ================= */
  /* 容器镜像下引擎按 LTR 语义运转：flipNext 视觉上即“左页向右卷起”，        */
  /* 与日漫一致；图像经预镜像后内容保持原样，next/prev 与引擎方向一一对应。   */

  next() {
    if (!this.flip) return;
    this.flip.flipNext(this.opts.corner);
  }

  prev() {
    if (!this.flip) return;
    this.flip.flipPrev(this.opts.corner);
  }

  /** @param {number} logicalPage 1 基页号；0=封面；>N=封底/末尾 */
  goToPage(logicalPage) {
    if (!this.flip) return;
    const total = this.opts.pages.length;
    let idx;
    if (logicalPage <= 0) idx = 0;
    else if (logicalPage > total) idx = this._sheets() - 1;
    else idx = this._orderIdxOfLogical(logicalPage) + this._coverOffset();
    this.flip.turnToPage(idx);
    this._syncUi();
  }

  _currentLogical() {
    if (!this.flip) return null;
    const c = this.flip.getCurrentPageIndex() - this._coverOffset();
    const nums = this._logicalsAt(c);
    return nums.length ? Math.min(...nums) : null;
  }

  setSpread(mode) {
    this.opts.spread = mode;
    this._rebuild();
  }

  toggleTheme() {
    const next = this.root.dataset.theme === 'light' ? 'dark' : 'light';
    this.opts.theme = next;
    this.root.dataset.theme = next;
  }

  toggleDirection() {
    this.opts.rtl = !this.opts.rtl;
    this._rebuild(); // _rebuild 内部会恢复当前页码
  }

  /* ================= UI 同步 ================= */

  _syncUi() {
    if (!this.flip) return;
    this._updateThicknessSplit();
    const idx = this.flip.getCurrentPageIndex();
    const total = this.opts.pages.length;
    const sheets = this._sheets();
    const c = idx - this._coverOffset();
    const nums = this._logicalsAt(c);

    let label;
    if (nums.length === 0) {
      label = idx === 0 ? '封面' : (idx >= sheets - 1 ? '封底' : '-');
    } else if (nums.length === 1) {
      label = `第 ${nums[0]} 页`;
    } else {
      label = `第 ${Math.min(...nums)}-${Math.max(...nums)} 页`;
    }
    // 外部控件可选：约定 .mr-page-indicator / .mr-progress，存在即同步
    const ind = this.root.querySelector('.mr-page-indicator');
    if (ind) ind.textContent = `${label} / 共 ${total} 页`;
    const bar = this.root.querySelector('.mr-progress');
    if (bar) bar.style.width = `${(sheets > 1 ? idx / (sheets - 1) : 0) * 100}%`;
    this.opts.onPageChange?.({
      logical: nums.length ? Math.min(...nums) : null,
      display: label,
      progress: sheets > 1 ? idx / (sheets - 1) : 0,
    });
  }

  /* ================= 全局交互 ================= */

  _bindGlobalEvents() {
    if (this.opts.keyboard) {
      this._onKey = (e) => {
        if (e.key === 'ArrowLeft') this.opts.rtl ? this.next() : this.prev();
        else if (e.key === 'ArrowRight') this.opts.rtl ? this.prev() : this.next();
        else if (e.key === ' ') { e.preventDefault(); this.next(); }
        else return;
      };
      window.addEventListener('keydown', this._onKey);
    }
    if (this.opts.wheel) {
      this._onWheel = (e) => {
        const now = performance.now();
        if (now - this._wheelLock < 600 || Math.abs(e.deltaY) < 8) return;
        this._wheelLock = now;
        if (e.deltaY > 0) this.next(); else this.prev();
      };
      this.stage.addEventListener('wheel', this._onWheel, { passive: true });
    }
  }

  /**
   * 书脊淡出时机：翻页半程（卷起的页面越过中线盖住书脊）才开始淡出。
   * - 手动拖拽(user_fold)：跟踪指针，越过舞台中线即切换（回弹则全程不淡出）
   * - 悬停折角(fold_corner)：页面未越线，保持书脊
   * - 动画(flipping)：拖拽松手后冻结当前状态；程序化触发则延迟 flippingTime/2
   * - 静止(read)：恢复书脊
   */
  _onFlipState(state) {
    if (state === 'user_fold') {
      this._enableEdgeTransition();
      this._foldDriven = true;
      if (!this._foldMove) {
        this._foldMove = (ev) => {
          const rect = this.stage.getBoundingClientRect();
          const px = (ev.clientX - rect.left) / rect.width;
          const sx = this._down ? (this._down.x - rect.left) / rect.width : px;
          const covered = sx < 0.5 ? px >= 0.5 : px <= 0.5;
          this.bookWrap.classList.toggle('mr-flipping', covered);
        };
        window.addEventListener('mousemove', this._foldMove);
        window.addEventListener('touchmove', this._foldMove, { passive: true });
      }
    } else if (state === 'fold_corner') {
      this.bookWrap.classList.remove('mr-flipping');
    } else if (state === 'flipping') {
      this._enableEdgeTransition();
      this._detachFoldMove();
      if (!this._foldDriven) {
        clearTimeout(this._spineTimer);
        this._spineTimer = setTimeout(() => {
          this.bookWrap?.classList.add('mr-flipping');
        }, this.opts.flippingTime / 2);
      }
      this._foldDriven = false;
    } else if (state === 'read') {
      this._detachFoldMove();
      clearTimeout(this._spineTimer);
      this._foldDriven = false;
      this.bookWrap.classList.remove('mr-flipping');
    }
  }

  _detachFoldMove() {
    if (this._foldMove) {
      window.removeEventListener('mousemove', this._foldMove);
      window.removeEventListener('touchmove', this._foldMove);
      this._foldMove = null;
    }
  }

  _showSpinner(v) { this.spinner?.classList.toggle('mr-visible', v); }

  destroy() {
    this.destroyed = true;
    this._detachFoldMove();
    clearTimeout(this._spineTimer);
    clearTimeout(this._edgeDurTimer);
    this._ro?.disconnect();
    this._mq?.removeEventListener?.('change', this._applyThemeBound);
    window.removeEventListener('keydown', this._onKey);
    this.stage?.removeEventListener('wheel', this._onWheel);
    try { this.flip?.destroy(); } catch { /* noop */ }
    this._mirrorCache.forEach((u) => URL.revokeObjectURL(u));
    this._mirrorCache.clear();
    this.root.innerHTML = '';
    this.root.classList.remove('manga-reader');
  }
}
