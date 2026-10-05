# MangaReader — 漫画单/双页 3D 翻页阅读组件

组件基于 [page-flip](https://nodlik.github.io/StPageFlip/) 和原生 HTML/CSS/JS 实现。
模拟真实漫画书阅览效果：双页跨页、书脊阴影、3D 卷页动画（页面拱起 + 光影），可支持日漫右起翻阅。

## 效果预览
![翻页演示](./demo/demo-flip.gif)
## 运行 Demo

```bash
node server.js        # http://localhost:5180
```

> 图源不随仓库分发：可自备漫画页（jpeg/png）放入 `demo/manga/`，demo 会自动按文件名顺序加载。

## 使用

方式一：单文件分发（样式已内联）

```html
<script type="module">
  import { MangaReader } from 'https://cdn.jsdelivr.net/gh/Mio-Cat/MangaReader@main/dist/manga-reader.esm.js';
```

方式二：源码形态（需自行引 CSS）

```html
<link rel="stylesheet" href=".https://cdn.jsdelivr.net/gh/Mio-Cat/MangaReader@main/src/manga-reader.css" />
<script type="module">
  import { MangaReader } from 'https://cdn.jsdelivr.net/gh/Mio-Cat/MangaReader@main/src/manga-reader.js';
```

两种方式的构造用法一致：

```js
  const reader = new MangaReader(document.getElementById('app'), {
    pages: ['p1.jpg', 'p2.jpg', ...],  // 内容页 url（阅读顺序）
    cover: 'cover.jpg',                 // 可选硬封面
    back: 'back.jpg',                   // 可选封底
    rtl: true,                          // 日漫右起（默认）
    spread: 'auto',                     // double | single | auto(窄屏单页)
    ratio: 0.707,                       // 单页宽高比 w/h
    theme: 'auto',                      // dark | light | auto(跟随系统)
    pageThickness: 0.32,                // 书厚像素/页（两侧纸边堆叠）
    lazyLoad: true,                     // 惰性加载（默认开，详见 API 表）
    lazyWindow: 5,                      // 惰性加载窗口半径（两侧各预取张数）
    onPageChange: ({ logical, display, progress }) => console.log(display),
  });
```

## API

| 方法 / 选项 | 说明 |
|---|---|
| `next()` / `prev()` | 带 3D 动画翻到下一页 / 上一页 |
| `goToPage(p)` | 跳页（1 基；0=封面，>N=封底） |
| `setSpread('single' \| 'double')` | 单双页切换 |
| `toggleDirection()` | RTL ⇄ LTR |
| `destroy()` | 销毁实例 |
| `onStateChange(state)` | 翻页状态 `user_fold/fold_corner/flipping/read` |
| `onPageChange(info)` | 页码变化 `{logical, display, progress}` |
| `lazyLoad: true` | 惰性加载：可边看边载入图片，避免首次长时间加载，翻页时自动扩窗 |
| `lazyWindow: 5` | 惰性加载窗口半径（两侧各预取的张数） |

内置交互：拖拽页角（跟手，过半自动完成/回弹）、点击左右 30% 区域、`← →` 方向键、空格、滚轮。

## 外部控件接口

本组件仅提供阅读区和内置交互，控件可通过以下三种驱动方式自行定义：

1. **data-act 委托**：把按钮挂在组件 root 内即可，`data-act` 取
   `next / prev / first / last / spread / dir / theme`，组件监听 root 点击并调用对应方法。
2. **公开方法**：直接调用上表 API。
3. **约定类名**：root 内存在 `.mr-page-indicator`（页码文字）或 `.mr-progress`
   （宽度百分比的进度条）时，组件每次状态变化实时同步其内容；不使用则通过
   `onPageChange` 回调自建。

内置 `.mr-toolbar / .mr-btn / .mr-progress / .mr-page-indicator` 为约定控件样式，可供外部控件复用。

## 日漫 RTL 实现

原 page-flip 无 rtl 选项，组件采用双重镜像：书本容器 `scaleX(-1)` 镜像（并补丁其内部
`getMousePos` 指针坐标）× 每张图像离屏 canvas 水平预镜像。两者相抵后页面内容为原始正像，同时保留镜像带来的日漫几何与动画方向——封面在右、左页向右卷起翻至下一页。
页序保持自然顺序 `[封面, p1..pN, 封底]`，引擎按 LTR 物理模型运转。

## 文件结构

```
README.md
package.json             demo/构建脚本（npm run build 需 esbuild）
server.js                本地预览静态服务器（demo/manga/ 图源 API）
index.html               demo 入口（演示外部工具栏 attachToolbar）

src/manga-reader.js      组件（核心，无样式）
src/manga-reader.css     组件样式（舞台背景/书脊/纸边 + 控件约定样式）
vendor/page-flip.esm.js  page-flip ESM 构建（vendored）

src/bundle.js            打包入口：CSS 内联 + 注入 <style> 的 MangaReader 子类
dist/manga-reader.esm.js 单文件 ESM 分发产物（npm run build 生成，含 .map）

demo/manga/              demo 漫画图源（不入库，自备竖版漫画页 jpeg/png 放入即可）
demo/demo-flip.gif       README 效果预览动图
```
