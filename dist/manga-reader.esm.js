var L=`/* ============ MangaReader \u6F2B\u753B\u53CC\u9875\u9605\u8BFB\u7EC4\u4EF6 ============ */

.manga-reader {
  --mr-desk: radial-gradient(ellipse at 50% 40%, #3b3f4a 0%, #23262e 70%, #171920 100%);
  --mr-accent: #e8a33d;
  --mr-toolbar-bg: rgba(20, 22, 28, 0.85);
  --mr-toolbar-line: rgba(255, 255, 255, 0.06);
  --mr-fg: #cfd3dc;
  --mr-fg-strong: #e6e9f0;
  --mr-fg-dim: #aab0bd;
  --mr-btn-bg: rgba(255, 255, 255, 0.06);
  --mr-btn-line: rgba(255, 255, 255, 0.14);
  --mr-btn-hover: rgba(255, 255, 255, 0.14);
  --mr-chip-bg: rgba(0, 0, 0, 0.35);
  --mr-chip-fg: #fff;
  /* \u4E66\u539A\uFF08--mr-thick \u7531 JS \u6309\u9875\u6570\u5199\u5165\uFF09 */
  --mr-thick: 10px;
  --mr-paper-a: #cfc7b2;
  --mr-paper-b: #efe8d6;
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 420px;
  display: flex;
  flex-direction: column;
  background: var(--mr-desk);
  font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  user-select: none;
  -webkit-user-select: none;
  overflow: hidden;
}

/* ---------- \u4EAE\u8272\u4E3B\u9898 ---------- */
.manga-reader[data-theme="light"] {
  --mr-desk: radial-gradient(ellipse at 50% 38%, #ffffff 0%, #f5f4f1 55%, #e9e8e4 100%);
  --mr-accent: #b97a1e;
  --mr-toolbar-bg: rgba(255, 255, 255, 0.82);
  --mr-toolbar-line: rgba(0, 0, 0, 0.08);
  --mr-fg: #4c4a44;
  --mr-fg-strong: #26251f;
  --mr-fg-dim: #85817a;
  --mr-btn-bg: rgba(0, 0, 0, 0.045);
  --mr-btn-line: rgba(0, 0, 0, 0.14);
  --mr-btn-hover: rgba(0, 0, 0, 0.09);
  --mr-chip-bg: rgba(255, 255, 255, 0.75);
  --mr-chip-fg: #3a382f;
  --mr-paper-a: #b8b09a;
  --mr-paper-b: #ded7c4;
}

/* ---------- \u821E\u53F0 / \u4E66\u672C ---------- */
.mr-stage {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(8px, 2.5vh, 28px) clamp(8px, 3vw, 48px);
  min-height: 0;
}

.mr-book-wrap {
  position: relative;
  max-width: 100%;
  max-height: 100%;
}

/* \u4E66\u539A\uFF1A\u5E73\u88C5\u672C\u2014\u2014\u5DE6\u53F3\u7EB8\u9875\u5806\u53E0\u8FB9\u6309\u9605\u8BFB\u8FDB\u5EA6\u5206\u914D\uFF08--mr-thick-l/r\uFF09\uFF0C\u968F\u7FFB\u9875\u7EBF\u6027\u8FC7\u6E21 */
.mr-book-wrap::before {
  content: "";
  position: absolute;
  z-index: -1;
  top: 2px;
  bottom: 2px;
  left: calc(var(--mr-thick-l, var(--mr-thick)) * -1);
  right: calc(var(--mr-thick-r, var(--mr-thick)) * -1);
  border-radius: 2px;
  background:
    /* \u5DE6\u7EB8\u8FB9\uFF1A\u5916\u4FA7\u6E10\u6697 + \u7AD6\u6761\u7EB9 */
    linear-gradient(to right, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0)),
    repeating-linear-gradient(90deg, var(--mr-paper-a) 0 1px, var(--mr-paper-b) 1px 3px),
    /* \u53F3\u7EB8\u8FB9 */
    linear-gradient(to left, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0)),
    repeating-linear-gradient(90deg, var(--mr-paper-a) 0 1px, var(--mr-paper-b) 1px 3px);
  background-position: left center, left center, right center, right center;
  background-size:
    max(1px, calc(var(--mr-thick-l, var(--mr-thick)) - 2px)) 94%,
    max(1px, calc(var(--mr-thick-l, var(--mr-thick)) - 2px)) 94%,
    max(1px, calc(var(--mr-thick-r, var(--mr-thick)) - 2px)) 94%,
    max(1px, calc(var(--mr-thick-r, var(--mr-thick)) - 2px)) 94%;
  background-repeat: no-repeat;
  transition:
    left var(--mr-thick-t, 0ms) linear,
    right var(--mr-thick-t, 0ms) linear,
    background-size var(--mr-thick-t, 0ms) linear;
}

.mr-book {
  position: relative;
  width: 100%;
  height: 100%;
}

/* \u4E66\u53E3\u5E26\uFF1A\u5B9E\u767D\uFF0C\u7D27\u6328\u4E66\u672C\u5DE6\u53F3\u5916\u7F18\uFF08\u8D1F inset \u5916\u6269\uFF0C\u4E0D\u906E\u9875\u9762\uFF09\uFF0C\u5BBD\u5EA6\u4E0E\u4E66\u539A\u9634\u5F71\u540C\u6B65
   \uFF08\u5171\u7528 --mr-shade-l/r\uFF09\uFF1A\u5B8C\u5168\u7A7A\u7684\u4E00\u4FA7\u4E3A 0\uFF0C\u7FFB\u9875\u65F6\u968F\u7EB8\u5806\u6B64\u6D88\u5F7C\u957F\u3001\u7EBF\u6027\u52A0\u5BBD\u3002
   \u4F4D\u4E8E\u7EB8\u9875\u6761\u7EB9\u4E4B\u4E0A\u3001\u8FB9\u7F18\u9634\u5F71\u4E4B\u4E0B\u3002 */
.mr-edge-band {
  position: absolute;
  top: 0;
  bottom: 0;
  left: calc(var(--mr-shade-l, 0px) * -1);
  right: calc(var(--mr-shade-r, 0px) * -1);
  z-index: 5;
  pointer-events: none;
  background:
    linear-gradient(#fff, #fff) left center / var(--mr-shade-l, 0px) 100% no-repeat,
    linear-gradient(#fff, #fff) right center / var(--mr-shade-r, 0px) 100% no-repeat;
  transition:
    left var(--mr-thick-t, 0ms) linear,
    right var(--mr-thick-t, 0ms) linear,
    background-size var(--mr-thick-t, 0ms) linear;
}

/* \u4E66\u539A\u8FB9\u7F18\u9634\u5F71\uFF1A\u5DE6\u53F3\u5916\u4FA7\u7EB8\u9875\u5806\u7684\u7EBF\u6027\u6295\u5F71\uFF0C\u5916\u7F18\u6700\u6697\u5411\u4E66\u8FB9\u6E10\u9690\u3002
   \u540C\u6837\u8D34\u4E66\u672C\u5916\u4FA7\uFF0C\u4E0D\u906E\u76D6\u9875\u9762\uFF1B\u5BBD\u5EA6\u968F\u5DE6\u53F3\u7EB8\u5806\u6B64\u6D88\u5F7C\u957F\uFF08--mr-shade-l/r\uFF09\u3002 */
.mr-edge-shade {
  position: absolute;
  top: 0;
  bottom: 0;
  left: calc(var(--mr-shade-l, 0px) * -1);
  right: calc(var(--mr-shade-r, 0px) * -1);
  z-index: 6;
  pointer-events: none;
  background:
    linear-gradient(to right, rgba(0, 0, 0, 0.20), rgba(0, 0, 0, 0)) left center / var(--mr-shade-l, 1.8%) 100%,
    linear-gradient(to left, rgba(0, 0, 0, 0.20), rgba(0, 0, 0, 0)) right center / var(--mr-shade-r, 1.8%) 100%;
  background-repeat: no-repeat;
  transition:
    left var(--mr-thick-t, 0ms) linear,
    right var(--mr-thick-t, 0ms) linear,
    background-size var(--mr-thick-t, 0ms) linear;
}

/* \u4E66\u810A\u9634\u5F71\uFF1A\u8DE8\u4E24\u9875\u4E2D\u95F4\u7684\u51F9\u69FD\u6548\u679C */
.mr-book-wrap::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(to right,
    rgba(0, 0, 0, 0) 49.1%, rgba(0, 0, 0, 0.28) 50%, rgba(0, 0, 0, 0) 50.9%);
  opacity: 0;
  transition: opacity 0.45s ease;
}

.mr-book-wrap[data-spread="double"].mr-book-wrap::after {
  opacity: 1;
}

/* \u7FFB\u9875\u4E2D\u9690\u85CF CSS \u4E66\u810A\uFF1A\u5B83\u5728\u753B\u5E03\u4E0A\u5C42\uFF0C\u4F1A\u6D6E\u5728\u5377\u8D77\u7684\u9875\u9762\u4E0A\u663E\u5F97"\u9875\u9762\u900F\u660E"\u3002
   \u52A8\u753B\u671F\u95F4\u7531\u5F15\u64CE\u5185\u7F6E\u7684\u4E66\u810A\u9634\u5F71\u63A5\u7BA1\uFF08\u7ED8\u5236\u5C42\u7EA7\u6B63\u786E\uFF09\u3002 */
.mr-book-wrap[data-spread="double"].mr-book-wrap.mr-flipping::after {
  opacity: 0;
  transition-duration: 0.12s;
}

/* \u5355\u9875\u6A21\u5F0F\uFF1A\u65E0\u8DE8\u9875\u4E66\u5806\u6D88\u957F\uFF0C\u4E66\u53E3\u5E26\u3001\u8FB9\u7F18\u9634\u5F71\u3001\u7EB8\u9875\u6761\u7EB9\u90FD\u4E0D\u9700\u8981
   \uFF08CSS \u4E66\u810A ::after \u5DF2\u7531 data-spread="double" \u95E8\u63A7\u81EA\u52A8\u9690\u85CF\uFF09 */
.mr-book-wrap[data-spread="single"] .mr-edge-band,
.mr-book-wrap[data-spread="single"] .mr-edge-shade {
  display: none;
}

.mr-book-wrap[data-spread="single"]::before {
  display: none;
}

/* page-flip \u7684\u9875\u9762\u5143\u7D20\u57FA\u7840\u6837\u5F0F */
.mr-book .page {
  overflow: hidden;
  background-color: #fdfbf4;
  background-size: cover;
  background-position: center;
}

.mr-page-inner {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mr-page-inner img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  pointer-events: none;
}

/* \u672A\u52A0\u8F7D\u5B8C\u6210\u7684\u5360\u4F4D */
.mr-page-loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9a978c;
  font-size: 14px;
  letter-spacing: 2px;
  background: #fdfbf4;
  z-index: 1;
  transition: opacity 0.25s ease;
}

.mr-page-loaded .mr-page-loading {
  opacity: 0;
  pointer-events: none;
}

/* ---------- \u5DE5\u5177\u680F ---------- */
.mr-toolbar {
  position: relative;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  padding: 10px 14px 12px;
  background: var(--mr-toolbar-bg);
  backdrop-filter: blur(6px);
  border-top: 1px solid var(--mr-toolbar-line);
  color: var(--mr-fg);
  font-size: 13px;
}

.mr-btn {
  appearance: none;
  border: 1px solid var(--mr-btn-line);
  background: var(--mr-btn-bg);
  color: var(--mr-fg-strong);
  border-radius: 7px;
  padding: 5px 12px;
  font-size: 13px;
  line-height: 1.4;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.mr-btn:hover { background: var(--mr-btn-hover); }
.mr-btn.active {
  background: var(--mr-accent);
  border-color: var(--mr-accent);
  color: #201a0d;
  font-weight: 600;
}

.mr-page-indicator {
  min-width: 90px;
  text-align: center;
  font-variant-numeric: tabular-nums;
  letter-spacing: 1px;
  color: var(--mr-fg-dim);
}

.mr-progress {
  position: absolute;
  left: 0;
  top: 0;
  height: 3px;
  background: var(--mr-accent);
  transition: width 0.3s ease;
  z-index: 21;
}

/* ---------- \u52A0\u8F7D\u906E\u7F69 ---------- */
.mr-spinner {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10, 12, 16, 0.55);
  z-index: 40;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.manga-reader[data-theme="light"] .mr-spinner {
  background: rgba(240, 236, 226, 0.6);
}

.mr-spinner.mr-visible {
  opacity: 1;
  pointer-events: auto;
}

.mr-spinner::after {
  content: "";
  width: 38px;
  height: 38px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top-color: var(--mr-accent);
  border-radius: 50%;
  animation: mr-spin 0.8s linear infinite;
}

.manga-reader[data-theme="light"] .mr-spinner::after {
  border-color: rgba(0, 0, 0, 0.12);
  border-top-color: var(--mr-accent);
}

@keyframes mr-spin { to { transform: rotate(360deg); } }

`;var u=class{constructor(t,e){this.state={angle:0,area:[],position:{x:0,y:0},hardAngle:0,hardDrawingAngle:0},this.createdDensity=e,this.nowDrawingDensity=this.createdDensity,this.render=t}setDensity(t){this.createdDensity=t,this.nowDrawingDensity=t}setDrawingDensity(t){this.nowDrawingDensity=t}setPosition(t){this.state.position=t}setAngle(t){this.state.angle=t}setArea(t){this.state.area=t}setHardDrawingAngle(t){this.state.hardDrawingAngle=t}setHardAngle(t){this.state.hardAngle=t,this.state.hardDrawingAngle=t}setOrientation(t){this.orientation=t}getDrawingDensity(){return this.nowDrawingDensity}getDensity(){return this.createdDensity}getHardAngle(){return this.state.hardAngle}},S=class extends u{constructor(t,e,i){super(t,i),this.image=null,this.isLoad=!1,this.loadingAngle=0,this.image=new Image,this.image.src=e}draw(t){let e=this.render.getContext(),i=this.render.convertToGlobal(this.state.position),s=this.render.getRect().pageWidth,r=this.render.getRect().height;e.save(),e.translate(i.x,i.y),e.beginPath();for(let n of this.state.area)n!==null&&(n=this.render.convertToGlobal(n),e.lineTo(n.x-i.x,n.y-i.y));e.rotate(this.state.angle),e.clip(),this.isLoad?e.drawImage(this.image,0,0,s,r):this.drawLoader(e,{x:0,y:0},s,r),e.restore()}simpleDraw(t){let e=this.render.getRect(),i=this.render.getContext(),s=e.pageWidth,r=e.height,n=t===1?e.left+e.pageWidth:e.left,o=e.top;this.isLoad?i.drawImage(this.image,n,o,s,r):this.drawLoader(i,{x:n,y:o},s,r)}drawLoader(t,e,i,s){t.beginPath(),t.strokeStyle="rgb(200, 200, 200)",t.fillStyle="rgb(255, 255, 255)",t.lineWidth=1,t.rect(e.x+1,e.y+1,i-1,s-1),t.stroke(),t.fill();let r={x:e.x+i/2,y:e.y+s/2};t.beginPath(),t.lineWidth=10,t.arc(r.x,r.y,20,this.loadingAngle,3*Math.PI/2+this.loadingAngle),t.stroke(),t.closePath(),this.loadingAngle+=.07,this.loadingAngle>=2*Math.PI&&(this.loadingAngle=0)}load(){this.isLoad||(this.image.onload=()=>{this.isLoad=!0})}newTemporaryCopy(){return this}getTemporaryCopy(){return this}hideTemporaryCopy(){}},m=class{constructor(t,e){this.pages=[],this.currentPageIndex=0,this.currentSpreadIndex=0,this.landscapeSpread=[],this.portraitSpread=[],this.render=e,this.app=t,this.currentPageIndex=0,this.isShowCover=this.app.getSettings().showCover}destroy(){this.pages=[]}createSpread(){this.landscapeSpread=[],this.portraitSpread=[];for(let e=0;e<this.pages.length;e++)this.portraitSpread.push([e]);let t=0;this.isShowCover&&(this.pages[0].setDensity("hard"),this.landscapeSpread.push([t]),t++);for(let e=t;e<this.pages.length;e+=2)e<this.pages.length-1?this.landscapeSpread.push([e,e+1]):(this.landscapeSpread.push([e]),this.pages[e].setDensity("hard"))}getSpread(){return this.render.getOrientation()==="landscape"?this.landscapeSpread:this.portraitSpread}getSpreadIndexByPage(t){let e=this.getSpread();for(let i=0;i<e.length;i++)if(t===e[i][0]||t===e[i][1])return i;return null}getPageCount(){return this.pages.length}getPages(){return this.pages}getPage(t){if(t>=0&&t<this.pages.length)return this.pages[t];throw new Error("Invalid page number")}nextBy(t){let e=this.pages.indexOf(t);return e<this.pages.length-1?this.pages[e+1]:null}prevBy(t){let e=this.pages.indexOf(t);return e>0?this.pages[e-1]:null}getFlippingPage(t){let e=this.currentSpreadIndex;if(this.render.getOrientation()==="portrait")return t===0?this.pages[e].newTemporaryCopy():this.pages[e-1];{let i=t===0?this.getSpread()[e+1]:this.getSpread()[e-1];return i.length===1||t===0?this.pages[i[0]]:this.pages[i[1]]}}getBottomPage(t){let e=this.currentSpreadIndex;if(this.render.getOrientation()==="portrait")return t===0?this.pages[e+1]:this.pages[e-1];{let i=t===0?this.getSpread()[e+1]:this.getSpread()[e-1];return i.length===1?this.pages[i[0]]:t===0?this.pages[i[1]]:this.pages[i[0]]}}showNext(){this.currentSpreadIndex<this.getSpread().length&&(this.currentSpreadIndex++,this.showSpread())}showPrev(){this.currentSpreadIndex>0&&(this.currentSpreadIndex--,this.showSpread())}getCurrentPageIndex(){return this.currentPageIndex}show(t=null){if(t===null&&(t=this.currentPageIndex),t<0||t>=this.pages.length)return;let e=this.getSpreadIndexByPage(t);e!==null&&(this.currentSpreadIndex=e,this.showSpread())}getCurrentSpreadIndex(){return this.currentSpreadIndex}setCurrentSpreadIndex(t){if(!(t>=0&&t<this.getSpread().length))throw new Error("Invalid page");this.currentSpreadIndex=t}showSpread(){let t=this.getSpread()[this.currentSpreadIndex];t.length===2?(this.render.setLeftPage(this.pages[t[0]]),this.render.setRightPage(this.pages[t[1]])):this.render.getOrientation()==="landscape"&&t[0]===this.pages.length-1?(this.render.setLeftPage(this.pages[t[0]]),this.render.setRightPage(null)):(this.render.setLeftPage(null),this.render.setRightPage(this.pages[t[0]])),this.currentPageIndex=t[0],this.app.updatePageIndex(this.currentPageIndex)}},f=class extends m{constructor(t,e,i){super(t,e),this.imagesHref=i}load(){for(let t of this.imagesHref){let e=new S(this.render,t,"soft");e.load(),this.pages.push(e)}this.createSpread()}},p=class h{static GetDistanceBetweenTwoPoint(t,e){return t===null||e===null?1/0:Math.sqrt(Math.pow(e.x-t.x,2)+Math.pow(e.y-t.y,2))}static GetSegmentLength(t){return h.GetDistanceBetweenTwoPoint(t[0],t[1])}static GetAngleBetweenTwoLine(t,e){let i=t[0].y-t[1].y,s=e[0].y-e[1].y,r=t[1].x-t[0].x,n=e[1].x-e[0].x;return Math.acos((i*s+r*n)/(Math.sqrt(i*i+r*r)*Math.sqrt(s*s+n*n)))}static PointInRect(t,e){return e===null?null:e.x>=t.left&&e.x<=t.width+t.left&&e.y>=t.top&&e.y<=t.top+t.height?e:null}static GetRotatedPoint(t,e,i){return{x:t.x*Math.cos(i)+t.y*Math.sin(i)+e.x,y:t.y*Math.cos(i)-t.x*Math.sin(i)+e.y}}static LimitPointToCircle(t,e,i){if(h.GetDistanceBetweenTwoPoint(t,i)<=e)return i;let s=t.x,r=t.y,n=i.x,o=i.y,a=Math.sqrt(Math.pow(e,2)*Math.pow(s-n,2)/(Math.pow(s-n,2)+Math.pow(r-o,2)))+s;i.x<0&&(a*=-1);let l=(a-s)*(r-o)/(s-n)+r;return s-n+r===0&&(l=e),{x:a,y:l}}static GetIntersectBetweenTwoSegment(t,e,i){return h.PointInRect(t,h.GetIntersectBeetwenTwoLine(e,i))}static GetIntersectBeetwenTwoLine(t,e){let i=t[0].y-t[1].y,s=e[0].y-e[1].y,r=t[1].x-t[0].x,n=e[1].x-e[0].x,o=t[0].x*t[1].y-t[1].x*t[0].y,a=e[0].x*e[1].y-e[1].x*e[0].y,l=i*a-s*o,g=r*a-n*o,d=-(o*n-a*r)/(i*n-s*r),c=-(i*a-s*o)/(i*n-s*r);if(isFinite(d)&&isFinite(c))return{x:d,y:c};if(Math.abs(l-g)<.1)throw new Error("Segment included");return null}static GetCordsFromTwoPoint(t,e){let i=Math.abs(t.x-e.x),s=Math.abs(t.y-e.y),r=Math.max(i,s),n=[t];function o(a,l,g,d,c){return l>a?a+c*(g/d):l<a?a-c*(g/d):a}for(let a=1;a<=r;a+=1)n.push({x:o(t.x,e.x,i,r,a),y:o(t.y,e.y,s,r,a)});return n}},_=class h extends u{constructor(t,e,i){super(t,i),this.copiedElement=null,this.temporaryCopy=null,this.isLoad=!1,this.element=e,this.element.classList.add("stf__item"),this.element.classList.add("--"+i)}newTemporaryCopy(){return this.nowDrawingDensity==="hard"?this:(this.temporaryCopy===null&&(this.copiedElement=this.element.cloneNode(!0),this.element.parentElement.appendChild(this.copiedElement),this.temporaryCopy=new h(this.render,this.copiedElement,this.nowDrawingDensity)),this.getTemporaryCopy())}getTemporaryCopy(){return this.temporaryCopy}hideTemporaryCopy(){this.temporaryCopy!==null&&(this.copiedElement.remove(),this.copiedElement=null,this.temporaryCopy=null)}draw(t){let e=t||this.nowDrawingDensity,i=this.render.convertToGlobal(this.state.position),s=this.render.getRect().pageWidth,r=this.render.getRect().height;this.element.classList.remove("--simple");let n=`
            display: block;
            z-index: ${this.element.style.zIndex};
            left: 0;
            top: 0;
            width: ${s}px;
            height: ${r}px;
        `;e==="hard"?this.drawHard(n):this.drawSoft(i,n)}drawHard(t=""){let e=this.render.getRect().left+this.render.getRect().width/2,i=this.state.hardDrawingAngle,s=t+`
                backface-visibility: hidden;
                -webkit-backface-visibility: hidden;
                clip-path: none;
                -webkit-clip-path: none;
            `+(this.orientation===0?`transform-origin: ${this.render.getRect().pageWidth}px 0; 
                   transform: translate3d(0, 0, 0) rotateY(${i}deg);`:`transform-origin: 0 0; 
                   transform: translate3d(${e}px, 0, 0) rotateY(${i}deg);`);this.element.style.cssText=s}drawSoft(t,e=""){let i="polygon( ";for(let r of this.state.area)if(r!==null){let n=this.render.getDirection()===1?{x:-r.x+this.state.position.x,y:r.y-this.state.position.y}:{x:r.x-this.state.position.x,y:r.y-this.state.position.y};n=p.GetRotatedPoint(n,{x:0,y:0},this.state.angle),i+=n.x+"px "+n.y+"px, "}i=i.slice(0,-2),i+=")";let s=e+`transform-origin: 0 0; clip-path: ${i}; -webkit-clip-path: ${i};`+(this.render.isSafari()&&this.state.angle===0?`transform: translate(${t.x}px, ${t.y}px);`:`transform: translate3d(${t.x}px, ${t.y}px, 0) rotate(${this.state.angle}rad);`);this.element.style.cssText=s}simpleDraw(t){let e=this.render.getRect(),i=e.pageWidth,s=e.height,r=t===1?e.left+e.pageWidth:e.left,n=e.top;this.element.classList.add("--simple"),this.element.style.cssText=`
            position: absolute; 
            display: block; 
            height: ${s}px; 
            left: ${r}px; 
            top: ${n}px; 
            width: ${i}px; 
            z-index: ${this.render.getSettings().startZIndex+1};`}getElement(){return this.element}load(){this.isLoad=!0}setOrientation(t){super.setOrientation(t),this.element.classList.remove("--left","--right"),this.element.classList.add(t===1?"--right":"--left")}setDrawingDensity(t){this.element.classList.remove("--soft","--hard"),this.element.classList.add("--"+t),super.setDrawingDensity(t)}},w=class extends m{constructor(t,e,i,s){super(t,e),this.element=i,this.pagesElement=s}load(){for(let t of this.pagesElement){let e=new _(this.render,t,t.dataset.density==="hard"?"hard":"soft");e.load(),this.pages.push(e)}this.createSpread()}},k=class{constructor(t,e,i,s){this.direction=t,this.corner=e,this.topIntersectPoint=null,this.sideIntersectPoint=null,this.bottomIntersectPoint=null,this.pageWidth=parseInt(i,10),this.pageHeight=parseInt(s,10)}calc(t){try{return this.position=this.calcAngleAndPosition(t),this.calculateIntersectPoint(this.position),!0}catch{return!1}}getFlippingClipArea(){let t=[],e=!1;return t.push(this.rect.topLeft),t.push(this.topIntersectPoint),this.sideIntersectPoint===null?e=!0:(t.push(this.sideIntersectPoint),this.bottomIntersectPoint===null&&(e=!1)),t.push(this.bottomIntersectPoint),(e||this.corner==="bottom")&&t.push(this.rect.bottomLeft),t}getBottomClipArea(){let t=[];return t.push(this.topIntersectPoint),this.corner==="top"?t.push({x:this.pageWidth,y:0}):(this.topIntersectPoint!==null&&t.push({x:this.pageWidth,y:0}),t.push({x:this.pageWidth,y:this.pageHeight})),this.sideIntersectPoint!==null?p.GetDistanceBetweenTwoPoint(this.sideIntersectPoint,this.topIntersectPoint)>=10&&t.push(this.sideIntersectPoint):this.corner==="top"&&t.push({x:this.pageWidth,y:this.pageHeight}),t.push(this.bottomIntersectPoint),t.push(this.topIntersectPoint),t}getAngle(){return this.direction===0?-this.angle:this.angle}getRect(){return this.rect}getPosition(){return this.position}getActiveCorner(){return this.direction===0?this.rect.topLeft:this.rect.topRight}getDirection(){return this.direction}getFlippingProgress(){return Math.abs((this.position.x-this.pageWidth)/(2*this.pageWidth)*100)}getCorner(){return this.corner}getBottomPagePosition(){return this.direction===1?{x:this.pageWidth,y:0}:{x:0,y:0}}getShadowStartPoint(){return this.corner==="top"?this.topIntersectPoint:this.sideIntersectPoint!==null?this.sideIntersectPoint:this.topIntersectPoint}getShadowAngle(){let t=p.GetAngleBetweenTwoLine(this.getSegmentToShadowLine(),[{x:0,y:0},{x:this.pageWidth,y:0}]);return this.direction===0?t:Math.PI-t}calcAngleAndPosition(t){let e=t;if(this.updateAngleAndGeometry(e),e=this.corner==="top"?this.checkPositionAtCenterLine(e,{x:0,y:0},{x:0,y:this.pageHeight}):this.checkPositionAtCenterLine(e,{x:0,y:this.pageHeight},{x:0,y:0}),Math.abs(e.x-this.pageWidth)<1&&Math.abs(e.y)<1)throw new Error("Point is too small");return e}updateAngleAndGeometry(t){this.angle=this.calculateAngle(t),this.rect=this.getPageRect(t)}calculateAngle(t){let e=this.pageWidth-t.x+1,i=this.corner==="bottom"?this.pageHeight-t.y:t.y,s=2*Math.acos(e/Math.sqrt(i*i+e*e));i<0&&(s=-s);let r=Math.PI-s;if(!isFinite(s)||r>=0&&r<.003)throw new Error("The G point is too small");return this.corner==="bottom"&&(s=-s),s}getPageRect(t){return this.corner==="top"?this.getRectFromBasePoint([{x:0,y:0},{x:this.pageWidth,y:0},{x:0,y:this.pageHeight},{x:this.pageWidth,y:this.pageHeight}],t):this.getRectFromBasePoint([{x:0,y:-this.pageHeight},{x:this.pageWidth,y:-this.pageHeight},{x:0,y:0},{x:this.pageWidth,y:0}],t)}getRectFromBasePoint(t,e){return{topLeft:this.getRotatedPoint(t[0],e),topRight:this.getRotatedPoint(t[1],e),bottomLeft:this.getRotatedPoint(t[2],e),bottomRight:this.getRotatedPoint(t[3],e)}}getRotatedPoint(t,e){return{x:t.x*Math.cos(this.angle)+t.y*Math.sin(this.angle)+e.x,y:t.y*Math.cos(this.angle)-t.x*Math.sin(this.angle)+e.y}}calculateIntersectPoint(t){let e={left:-1,top:-1,width:this.pageWidth+2,height:this.pageHeight+2};this.corner==="top"?(this.topIntersectPoint=p.GetIntersectBetweenTwoSegment(e,[t,this.rect.topRight],[{x:0,y:0},{x:this.pageWidth,y:0}]),this.sideIntersectPoint=p.GetIntersectBetweenTwoSegment(e,[t,this.rect.bottomLeft],[{x:this.pageWidth,y:0},{x:this.pageWidth,y:this.pageHeight}]),this.bottomIntersectPoint=p.GetIntersectBetweenTwoSegment(e,[this.rect.bottomLeft,this.rect.bottomRight],[{x:0,y:this.pageHeight},{x:this.pageWidth,y:this.pageHeight}])):(this.topIntersectPoint=p.GetIntersectBetweenTwoSegment(e,[this.rect.topLeft,this.rect.topRight],[{x:0,y:0},{x:this.pageWidth,y:0}]),this.sideIntersectPoint=p.GetIntersectBetweenTwoSegment(e,[t,this.rect.topLeft],[{x:this.pageWidth,y:0},{x:this.pageWidth,y:this.pageHeight}]),this.bottomIntersectPoint=p.GetIntersectBetweenTwoSegment(e,[this.rect.bottomLeft,this.rect.bottomRight],[{x:0,y:this.pageHeight},{x:this.pageWidth,y:this.pageHeight}]))}checkPositionAtCenterLine(t,e,i){let s=t,r=p.LimitPointToCircle(e,this.pageWidth,s);s!==r&&(s=r,this.updateAngleAndGeometry(s));let n=Math.sqrt(Math.pow(this.pageWidth,2)+Math.pow(this.pageHeight,2)),o=this.rect.bottomRight,a=this.rect.topLeft;if(this.corner==="bottom"&&(o=this.rect.topRight,a=this.rect.bottomLeft),o.x<=0){let l=p.LimitPointToCircle(i,n,a);l!==s&&(s=l,this.updateAngleAndGeometry(s))}return s}getSegmentToShadowLine(){let t=this.getShadowStartPoint();return[t,t!==this.sideIntersectPoint&&this.sideIntersectPoint!==null?this.sideIntersectPoint:this.bottomIntersectPoint]}},x=class{constructor(t,e){this.flippingPage=null,this.bottomPage=null,this.calc=null,this.state="read",this.render=t,this.app=e}fold(t){this.setState("user_fold"),this.calc===null&&this.start(t),this.do(this.render.convertToPage(t))}flip(t){if(this.app.getSettings().disableFlipByClick&&!this.isPointOnCorners(t)||(this.calc!==null&&this.render.finishAnimation(),!this.start(t)))return;let e=this.getBoundsRect();this.setState("flipping");let i=e.height/10,s=this.calc.getCorner()==="bottom"?e.height-i:i,r=this.calc.getCorner()==="bottom"?e.height:0;this.calc.calc({x:e.pageWidth-i,y:s}),this.animateFlippingTo({x:e.pageWidth-i,y:s},{x:-e.pageWidth,y:r},!0)}start(t){this.reset();let e=this.render.convertToBook(t),i=this.getBoundsRect(),s=this.getDirectionByPoint(e),r=e.y>=i.height/2?"bottom":"top";if(!this.checkDirection(s))return!1;try{if(this.flippingPage=this.app.getPageCollection().getFlippingPage(s),this.bottomPage=this.app.getPageCollection().getBottomPage(s),this.render.getOrientation()==="landscape")if(s===1){let n=this.app.getPageCollection().nextBy(this.flippingPage);n!==null&&this.flippingPage.getDensity()!==n.getDensity()&&(this.flippingPage.setDrawingDensity("hard"),n.setDrawingDensity("hard"))}else{let n=this.app.getPageCollection().prevBy(this.flippingPage);n!==null&&this.flippingPage.getDensity()!==n.getDensity()&&(this.flippingPage.setDrawingDensity("hard"),n.setDrawingDensity("hard"))}return this.render.setDirection(s),this.calc=new k(s,r,i.pageWidth.toString(10),i.height.toString(10)),!0}catch{return!1}}do(t){if(this.calc!==null&&this.calc.calc(t)){let e=this.calc.getFlippingProgress();this.bottomPage.setArea(this.calc.getBottomClipArea()),this.bottomPage.setPosition(this.calc.getBottomPagePosition()),this.bottomPage.setAngle(0),this.bottomPage.setHardAngle(0),this.flippingPage.setArea(this.calc.getFlippingClipArea()),this.flippingPage.setPosition(this.calc.getActiveCorner()),this.flippingPage.setAngle(this.calc.getAngle()),this.calc.getDirection()===0?this.flippingPage.setHardAngle(90*(200-2*e)/100):this.flippingPage.setHardAngle(-90*(200-2*e)/100),this.render.setPageRect(this.calc.getRect()),this.render.setBottomPage(this.bottomPage),this.render.setFlippingPage(this.flippingPage),this.render.setShadowData(this.calc.getShadowStartPoint(),this.calc.getShadowAngle(),e,this.calc.getDirection())}}flipToPage(t,e){let i=this.app.getPageCollection().getCurrentSpreadIndex(),s=this.app.getPageCollection().getSpreadIndexByPage(t);try{s>i&&(this.app.getPageCollection().setCurrentSpreadIndex(s-1),this.flipNext(e)),s<i&&(this.app.getPageCollection().setCurrentSpreadIndex(s+1),this.flipPrev(e))}catch{}}flipNext(t){this.flip({x:this.render.getRect().left+2*this.render.getRect().pageWidth-10,y:t==="top"?1:this.render.getRect().height-2})}flipPrev(t){this.flip({x:10,y:t==="top"?1:this.render.getRect().height-2})}stopMove(){if(this.calc===null)return;let t=this.calc.getPosition(),e=this.getBoundsRect(),i=this.calc.getCorner()==="bottom"?e.height:0;t.x<=0?this.animateFlippingTo(t,{x:-e.pageWidth,y:i},!0):this.animateFlippingTo(t,{x:e.pageWidth,y:i},!1)}showCorner(t){if(!this.checkState("read","fold_corner"))return;let e=this.getBoundsRect(),i=e.pageWidth;if(this.isPointOnCorners(t))if(this.calc===null){if(!this.start(t))return;this.setState("fold_corner"),this.calc.calc({x:i-1,y:1});let s=50,r=this.calc.getCorner()==="bottom"?e.height-1:1,n=this.calc.getCorner()==="bottom"?e.height-s:s;this.animateFlippingTo({x:i-1,y:r},{x:i-s,y:n},!1,!1)}else this.do(this.render.convertToPage(t));else this.setState("read"),this.render.finishAnimation(),this.stopMove()}animateFlippingTo(t,e,i,s=!0){let r=p.GetCordsFromTwoPoint(t,e),n=[];for(let a of r)n.push(()=>this.do(a));let o=this.getAnimationDuration(r.length);this.render.startAnimation(n,o,()=>{this.calc&&(i&&(this.calc.getDirection()===1?this.app.turnToPrevPage():this.app.turnToNextPage()),s&&(this.render.setBottomPage(null),this.render.setFlippingPage(null),this.render.clearShadow(),this.setState("read"),this.reset()))})}getCalculation(){return this.calc}getState(){return this.state}setState(t){this.state!==t&&(this.app.updateState(t),this.state=t)}getDirectionByPoint(t){let e=this.getBoundsRect();if(this.render.getOrientation()==="portrait"){if(t.x-e.pageWidth<=e.width/5)return 1}else if(t.x<e.width/2)return 1;return 0}getAnimationDuration(t){let e=this.app.getSettings().flippingTime;return t>=1e3?e:t/1e3*e}checkDirection(t){return t===0?this.app.getCurrentPageIndex()<this.app.getPageCount()-1:this.app.getCurrentPageIndex()>=1}reset(){this.calc=null,this.flippingPage=null,this.bottomPage=null}getBoundsRect(){return this.render.getRect()}checkState(...t){for(let e of t)if(this.state===e)return!0;return!1}isPointOnCorners(t){let e=this.getBoundsRect(),i=e.pageWidth,s=Math.sqrt(Math.pow(i,2)+Math.pow(e.height,2))/5,r=this.render.convertToBook(t);return r.x>0&&r.y>0&&r.x<e.width&&r.y<e.height&&(r.x<s||r.x>e.width-s)&&(r.y<s||r.y>e.height-s)}},y=class{constructor(t,e){this.leftPage=null,this.rightPage=null,this.flippingPage=null,this.bottomPage=null,this.direction=null,this.orientation=null,this.shadow=null,this.animation=null,this.pageRect=null,this.boundsRect=null,this.timer=0,this.safari=!1,this.setting=e,this.app=t;let i=new RegExp("Version\\/[\\d\\.]+.*Safari/");this.safari=i.exec(window.navigator.userAgent)!==null}render(t){if(this.animation!==null){let e=Math.round((t-this.animation.startedAt)/this.animation.durationFrame);e<this.animation.frames.length?this.animation.frames[e]():(this.animation.onAnimateEnd(),this.animation=null)}this.timer=t,this.drawFrame()}start(){this.update();let t=e=>{this.render(e),requestAnimationFrame(t)};requestAnimationFrame(t)}startAnimation(t,e,i){this.finishAnimation(),this.animation={frames:t,duration:e,durationFrame:e/t.length,onAnimateEnd:i,startedAt:this.timer}}finishAnimation(){this.animation!==null&&(this.animation.frames[this.animation.frames.length-1](),this.animation.onAnimateEnd!==null&&this.animation.onAnimateEnd()),this.animation=null}update(){this.boundsRect=null;let t=this.calculateBoundsRect();this.orientation!==t&&(this.orientation=t,this.app.updateOrientation(t))}calculateBoundsRect(){let t="landscape",e=this.getBlockWidth(),i=e/2,s=this.getBlockHeight()/2,r=this.setting.width/this.setting.height,n=this.setting.width,o=this.setting.height,a=i-n;return this.setting.size==="stretch"?(e<2*this.setting.minWidth&&this.app.getSettings().usePortrait&&(t="portrait"),n=t==="portrait"?this.getBlockWidth():this.getBlockWidth()/2,n>this.setting.maxWidth&&(n=this.setting.maxWidth),o=n/r,o>this.getBlockHeight()&&(o=this.getBlockHeight(),n=o*r),a=t==="portrait"?i-n/2-n:i-n):e<2*n&&this.app.getSettings().usePortrait&&(t="portrait",a=i-n/2-n),this.boundsRect={left:a,top:s-o/2,width:2*n,height:o,pageWidth:n},t}setShadowData(t,e,i,s){if(!this.app.getSettings().drawShadow)return;let r=100*this.getSettings().maxShadowOpacity;this.shadow={pos:t,angle:e,width:3*this.getRect().pageWidth/4*i/100,opacity:(100-i)*r/100/100,direction:s,progress:2*i}}clearShadow(){this.shadow=null}getBlockWidth(){return this.app.getUI().getDistElement().offsetWidth}getBlockHeight(){return this.app.getUI().getDistElement().offsetHeight}getDirection(){return this.direction}getRect(){return this.boundsRect===null&&this.calculateBoundsRect(),this.boundsRect}getSettings(){return this.app.getSettings()}getOrientation(){return this.orientation}setPageRect(t){this.pageRect=t}setDirection(t){this.direction=t}setRightPage(t){t!==null&&t.setOrientation(1),this.rightPage=t}setLeftPage(t){t!==null&&t.setOrientation(0),this.leftPage=t}setBottomPage(t){t!==null&&t.setOrientation(this.direction===1?0:1),this.bottomPage=t}setFlippingPage(t){t!==null&&t.setOrientation(this.direction===0&&this.orientation!=="portrait"?0:1),this.flippingPage=t}convertToBook(t){let e=this.getRect();return{x:t.x-e.left,y:t.y-e.top}}isSafari(){return this.safari}convertToPage(t,e){e||(e=this.direction);let i=this.getRect();return{x:e===0?t.x-i.left-i.width/2:i.width/2-t.x+i.left,y:t.y-i.top}}convertToGlobal(t,e){if(e||(e=this.direction),t==null)return null;let i=this.getRect();return{x:e===0?t.x+i.left+i.width/2:i.width/2-t.x+i.left,y:t.y+i.top}}convertRectToGlobal(t,e){return e||(e=this.direction),{topLeft:this.convertToGlobal(t.topLeft,e),topRight:this.convertToGlobal(t.topRight,e),bottomLeft:this.convertToGlobal(t.bottomLeft,e),bottomRight:this.convertToGlobal(t.bottomRight,e)}}},T=class extends y{constructor(t,e,i){super(t,e),this.canvas=i,this.ctx=i.getContext("2d")}getContext(){return this.ctx}reload(){}drawFrame(){this.clear(),this.orientation!=="portrait"&&this.leftPage!=null&&this.leftPage.simpleDraw(0),this.rightPage!=null&&this.rightPage.simpleDraw(1),this.bottomPage!=null&&this.bottomPage.draw(),this.drawBookShadow(),this.flippingPage!=null&&this.flippingPage.draw(),this.shadow!=null&&(this.drawOuterShadow(),this.drawInnerShadow());let t=this.getRect();this.orientation==="portrait"&&(this.ctx.beginPath(),this.ctx.rect(t.left+t.pageWidth,t.top,t.width,t.height),this.ctx.clip())}drawBookShadow(){let t=this.getRect();this.ctx.save(),this.ctx.beginPath();let e=t.width/20;this.ctx.rect(t.left,t.top,t.width,t.height);let i={x:t.left+t.width/2-e/2,y:0};this.ctx.translate(i.x,i.y);let s=this.ctx.createLinearGradient(0,0,e,0);s.addColorStop(0,"rgba(0, 0, 0, 0)"),s.addColorStop(.4,"rgba(0, 0, 0, 0.2)"),s.addColorStop(.49,"rgba(0, 0, 0, 0.1)"),s.addColorStop(.5,"rgba(0, 0, 0, 0.5)"),s.addColorStop(.51,"rgba(0, 0, 0, 0.4)"),s.addColorStop(1,"rgba(0, 0, 0, 0)"),this.ctx.clip(),this.ctx.fillStyle=s,this.ctx.fillRect(0,0,e,2*t.height),this.ctx.restore()}drawOuterShadow(){let t=this.getRect();this.ctx.save(),this.ctx.beginPath(),this.ctx.rect(t.left,t.top,t.width,t.height);let e=this.convertToGlobal({x:this.shadow.pos.x,y:this.shadow.pos.y});this.ctx.translate(e.x,e.y),this.ctx.rotate(Math.PI+this.shadow.angle+Math.PI/2);let i=this.ctx.createLinearGradient(0,0,this.shadow.width,0);this.shadow.direction===0?(this.ctx.translate(0,-100),i.addColorStop(0,"rgba(0, 0, 0, "+this.shadow.opacity+")"),i.addColorStop(1,"rgba(0, 0, 0, 0)")):(this.ctx.translate(-this.shadow.width,-100),i.addColorStop(0,"rgba(0, 0, 0, 0)"),i.addColorStop(1,"rgba(0, 0, 0, "+this.shadow.opacity+")")),this.ctx.clip(),this.ctx.fillStyle=i,this.ctx.fillRect(0,0,this.shadow.width,2*t.height),this.ctx.restore()}drawInnerShadow(){let t=this.getRect();this.ctx.save(),this.ctx.beginPath();let e=this.convertToGlobal({x:this.shadow.pos.x,y:this.shadow.pos.y}),i=this.convertRectToGlobal(this.pageRect);this.ctx.moveTo(i.topLeft.x,i.topLeft.y),this.ctx.lineTo(i.topRight.x,i.topRight.y),this.ctx.lineTo(i.bottomRight.x,i.bottomRight.y),this.ctx.lineTo(i.bottomLeft.x,i.bottomLeft.y),this.ctx.translate(e.x,e.y),this.ctx.rotate(Math.PI+this.shadow.angle+Math.PI/2);let s=3*this.shadow.width/4,r=this.ctx.createLinearGradient(0,0,s,0);this.shadow.direction===0?(this.ctx.translate(-s,-100),r.addColorStop(1,"rgba(0, 0, 0, "+this.shadow.opacity+")"),r.addColorStop(.9,"rgba(0, 0, 0, 0.05)"),r.addColorStop(.7,"rgba(0, 0, 0, "+this.shadow.opacity+")"),r.addColorStop(0,"rgba(0, 0, 0, 0)")):(this.ctx.translate(0,-100),r.addColorStop(0,"rgba(0, 0, 0, "+this.shadow.opacity+")"),r.addColorStop(.1,"rgba(0, 0, 0, 0.05)"),r.addColorStop(.3,"rgba(0, 0, 0, "+this.shadow.opacity+")"),r.addColorStop(1,"rgba(0, 0, 0, 0)")),this.ctx.clip(),this.ctx.fillStyle=r,this.ctx.fillRect(0,0,s,2*t.height),this.ctx.restore()}clear(){this.ctx.fillStyle="white",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)}},b=class{constructor(t,e,i){this.touchPoint=null,this.swipeTimeout=250,this.onResize=()=>{this.update()},this.onMouseDown=r=>{if(this.checkTarget(r.target)){let n=this.getMousePos(r.clientX,r.clientY);this.app.startUserTouch(n),r.preventDefault()}},this.onTouchStart=r=>{if(this.checkTarget(r.target)&&r.changedTouches.length>0){let n=r.changedTouches[0],o=this.getMousePos(n.clientX,n.clientY);this.touchPoint={point:o,time:Date.now()},setTimeout(()=>{this.touchPoint!==null&&this.app.startUserTouch(o)},this.swipeTimeout),this.app.getSettings().mobileScrollSupport||r.preventDefault()}},this.onMouseUp=r=>{let n=this.getMousePos(r.clientX,r.clientY);this.app.userStop(n)},this.onMouseMove=r=>{let n=this.getMousePos(r.clientX,r.clientY);this.app.userMove(n,!1)},this.onTouchMove=r=>{if(r.changedTouches.length>0){let n=r.changedTouches[0],o=this.getMousePos(n.clientX,n.clientY);this.app.getSettings().mobileScrollSupport?(this.touchPoint!==null&&(Math.abs(this.touchPoint.point.x-o.x)>10||this.app.getState()!=="read")&&r.cancelable&&this.app.userMove(o,!0),this.app.getState()!=="read"&&r.preventDefault()):this.app.userMove(o,!0)}},this.onTouchEnd=r=>{if(r.changedTouches.length>0){let n=r.changedTouches[0],o=this.getMousePos(n.clientX,n.clientY),a=!1;if(this.touchPoint!==null){let l=o.x-this.touchPoint.point.x,g=Math.abs(o.y-this.touchPoint.point.y);Math.abs(l)>this.swipeDistance&&g<2*this.swipeDistance&&Date.now()-this.touchPoint.time<this.swipeTimeout&&(l>0?this.app.flipPrev(this.touchPoint.point.y<this.app.getRender().getRect().height/2?"top":"bottom"):this.app.flipNext(this.touchPoint.point.y<this.app.getRender().getRect().height/2?"top":"bottom"),a=!0),this.touchPoint=null}this.app.userStop(o,a)}},this.parentElement=t,t.classList.add("stf__parent"),t.insertAdjacentHTML("afterbegin",'<div class="stf__wrapper"></div>'),this.wrapper=t.querySelector(".stf__wrapper"),this.app=e;let s=this.app.getSettings().usePortrait?1:2;t.style.minWidth=i.minWidth*s+"px",t.style.minHeight=i.minHeight+"px",i.size==="fixed"&&(t.style.minWidth=i.width*s+"px",t.style.minHeight=i.height+"px"),i.autoSize&&(t.style.width="100%",t.style.maxWidth=2*i.maxWidth+"px"),t.style.display="block",window.addEventListener("resize",this.onResize,!1),this.swipeDistance=i.swipeDistance}destroy(){this.app.getSettings().useMouseEvents&&this.removeHandlers(),this.distElement.remove(),this.wrapper.remove()}getDistElement(){return this.distElement}getWrapper(){return this.wrapper}setOrientationStyle(t){this.wrapper.classList.remove("--portrait","--landscape"),t==="portrait"?(this.app.getSettings().autoSize&&(this.wrapper.style.paddingBottom=this.app.getSettings().height/this.app.getSettings().width*100+"%"),this.wrapper.classList.add("--portrait")):(this.app.getSettings().autoSize&&(this.wrapper.style.paddingBottom=this.app.getSettings().height/(2*this.app.getSettings().width)*100+"%"),this.wrapper.classList.add("--landscape")),this.update()}removeHandlers(){window.removeEventListener("resize",this.onResize),this.distElement.removeEventListener("mousedown",this.onMouseDown),this.distElement.removeEventListener("touchstart",this.onTouchStart),window.removeEventListener("mousemove",this.onMouseMove),window.removeEventListener("touchmove",this.onTouchMove),window.removeEventListener("mouseup",this.onMouseUp),window.removeEventListener("touchend",this.onTouchEnd)}setHandlers(){window.addEventListener("resize",this.onResize,!1),this.app.getSettings().useMouseEvents&&(this.distElement.addEventListener("mousedown",this.onMouseDown),this.distElement.addEventListener("touchstart",this.onTouchStart),window.addEventListener("mousemove",this.onMouseMove),window.addEventListener("touchmove",this.onTouchMove,{passive:!this.app.getSettings().mobileScrollSupport}),window.addEventListener("mouseup",this.onMouseUp),window.addEventListener("touchend",this.onTouchEnd))}getMousePos(t,e){let i=this.distElement.getBoundingClientRect();return{x:t-i.left,y:e-i.top}}checkTarget(t){return!this.app.getSettings().clickEventForward||!["a","button"].includes(t.tagName.toLowerCase())}},C=class extends b{constructor(t,e,i,s){super(t,e,i),this.wrapper.insertAdjacentHTML("afterbegin",'<div class="stf__block"></div>'),this.distElement=t.querySelector(".stf__block"),this.items=s;for(let r of s)this.distElement.appendChild(r);this.setHandlers()}clear(){for(let t of this.items)this.parentElement.appendChild(t)}updateItems(t){this.removeHandlers(),this.distElement.innerHTML="";for(let e of t)this.distElement.appendChild(e);this.items=t,this.setHandlers()}update(){this.app.getRender().update()}},I=class extends b{constructor(t,e,i){super(t,e,i),this.wrapper.innerHTML='<canvas class="stf__canvas"></canvas>',this.canvas=t.querySelectorAll("canvas")[0],this.distElement=this.canvas,this.resizeCanvas(),this.setHandlers()}resizeCanvas(){let t=getComputedStyle(this.canvas),e=parseInt(t.getPropertyValue("width"),10),i=parseInt(t.getPropertyValue("height"),10);this.canvas.width=e,this.canvas.height=i}getCanvas(){return this.canvas}update(){this.resizeCanvas(),this.app.getRender().update()}},R=class extends y{constructor(t,e,i){super(t,e),this.outerShadow=null,this.innerShadow=null,this.hardShadow=null,this.hardInnerShadow=null,this.element=i,this.createShadows()}createShadows(){this.element.insertAdjacentHTML("beforeend",`<div class="stf__outerShadow"></div>
             <div class="stf__innerShadow"></div>
             <div class="stf__hardShadow"></div>
             <div class="stf__hardInnerShadow"></div>`),this.outerShadow=this.element.querySelector(".stf__outerShadow"),this.innerShadow=this.element.querySelector(".stf__innerShadow"),this.hardShadow=this.element.querySelector(".stf__hardShadow"),this.hardInnerShadow=this.element.querySelector(".stf__hardInnerShadow")}clearShadow(){super.clearShadow(),this.outerShadow.style.cssText="display: none",this.innerShadow.style.cssText="display: none",this.hardShadow.style.cssText="display: none",this.hardInnerShadow.style.cssText="display: none"}reload(){this.element.querySelector(".stf__outerShadow")||this.createShadows()}drawHardInnerShadow(){let t=this.getRect(),e=this.shadow.progress>100?200-this.shadow.progress:this.shadow.progress,i=(100-e)*(2.5*t.pageWidth)/100+20;i>t.pageWidth&&(i=t.pageWidth);let s=`
            display: block;
            z-index: ${(this.getSettings().startZIndex+5).toString(10)};
            width: ${i}px;
            height: ${t.height}px;
            background: linear-gradient(to right,
                rgba(0, 0, 0, ${this.shadow.opacity*e/100}) 5%,
                rgba(0, 0, 0, 0) 100%);
            left: ${t.left+t.width/2}px;
            transform-origin: 0 0;
        `;s+=this.getDirection()===0&&this.shadow.progress>100||this.getDirection()===1&&this.shadow.progress<=100?"transform: translate3d(0, 0, 0);":"transform: translate3d(0, 0, 0) rotateY(180deg);",this.hardInnerShadow.style.cssText=s}drawHardOuterShadow(){let t=this.getRect(),e=(100-(this.shadow.progress>100?200-this.shadow.progress:this.shadow.progress))*(2.5*t.pageWidth)/100+20;e>t.pageWidth&&(e=t.pageWidth);let i=`
            display: block;
            z-index: ${(this.getSettings().startZIndex+4).toString(10)};
            width: ${e}px;
            height: ${t.height}px;
            background: linear-gradient(to left, rgba(0, 0, 0, ${this.shadow.opacity}) 5%, rgba(0, 0, 0, 0) 100%);
            left: ${t.left+t.width/2}px;
            transform-origin: 0 0;
        `;i+=this.getDirection()===0&&this.shadow.progress>100||this.getDirection()===1&&this.shadow.progress<=100?"transform: translate3d(0, 0, 0) rotateY(180deg);":"transform: translate3d(0, 0, 0);",this.hardShadow.style.cssText=i}drawInnerShadow(){let t=this.getRect(),e=3*this.shadow.width/4,i=this.getDirection()===0?e:0,s=this.getDirection()===0?"to left":"to right",r=this.convertToGlobal(this.shadow.pos),n=this.shadow.angle+3*Math.PI/2,o=[this.pageRect.topLeft,this.pageRect.topRight,this.pageRect.bottomRight,this.pageRect.bottomLeft],a="polygon( ";for(let g of o){let d=this.getDirection()===1?{x:-g.x+this.shadow.pos.x,y:g.y-this.shadow.pos.y}:{x:g.x-this.shadow.pos.x,y:g.y-this.shadow.pos.y};d=p.GetRotatedPoint(d,{x:i,y:100},n),a+=d.x+"px "+d.y+"px, "}a=a.slice(0,-2),a+=")";let l=`
            display: block;
            z-index: ${(this.getSettings().startZIndex+10).toString(10)};
            width: ${e}px;
            height: ${2*t.height}px;
            background: linear-gradient(${s},
                rgba(0, 0, 0, ${this.shadow.opacity}) 5%,
                rgba(0, 0, 0, 0.05) 15%,
                rgba(0, 0, 0, ${this.shadow.opacity}) 35%,
                rgba(0, 0, 0, 0) 100%);
            transform-origin: ${i}px 100px;
            transform: translate3d(${r.x-i}px, ${r.y-100}px, 0) rotate(${n}rad);
            clip-path: ${a};
            -webkit-clip-path: ${a};
        `;this.innerShadow.style.cssText=l}drawOuterShadow(){let t=this.getRect(),e=this.convertToGlobal({x:this.shadow.pos.x,y:this.shadow.pos.y}),i=this.shadow.angle+3*Math.PI/2,s=this.getDirection()===1?this.shadow.width:0,r=this.getDirection()===0?"to right":"to left",n=[{x:0,y:0},{x:t.pageWidth,y:0},{x:t.pageWidth,y:t.height},{x:0,y:t.height}],o="polygon( ";for(let l of n)if(l!==null){let g=this.getDirection()===1?{x:-l.x+this.shadow.pos.x,y:l.y-this.shadow.pos.y}:{x:l.x-this.shadow.pos.x,y:l.y-this.shadow.pos.y};g=p.GetRotatedPoint(g,{x:s,y:100},i),o+=g.x+"px "+g.y+"px, "}o=o.slice(0,-2),o+=")";let a=`
            display: block;
            z-index: ${(this.getSettings().startZIndex+10).toString(10)};
            width: ${this.shadow.width}px;
            height: ${2*t.height}px;
            background: linear-gradient(${r}, rgba(0, 0, 0, ${this.shadow.opacity}), rgba(0, 0, 0, 0));
            transform-origin: ${s}px 100px;
            transform: translate3d(${e.x-s}px, ${e.y-100}px, 0) rotate(${i}rad);
            clip-path: ${o};
            -webkit-clip-path: ${o};
        `;this.outerShadow.style.cssText=a}drawLeftPage(){this.orientation!=="portrait"&&this.leftPage!==null&&(this.direction===1&&this.flippingPage!==null&&this.flippingPage.getDrawingDensity()==="hard"?(this.leftPage.getElement().style.zIndex=(this.getSettings().startZIndex+5).toString(10),this.leftPage.setHardDrawingAngle(180+this.flippingPage.getHardAngle()),this.leftPage.draw(this.flippingPage.getDrawingDensity())):this.leftPage.simpleDraw(0))}drawRightPage(){this.rightPage!==null&&(this.direction===0&&this.flippingPage!==null&&this.flippingPage.getDrawingDensity()==="hard"?(this.rightPage.getElement().style.zIndex=(this.getSettings().startZIndex+5).toString(10),this.rightPage.setHardDrawingAngle(180+this.flippingPage.getHardAngle()),this.rightPage.draw(this.flippingPage.getDrawingDensity())):this.rightPage.simpleDraw(1))}drawBottomPage(){if(this.bottomPage===null)return;let t=this.flippingPage!=null?this.flippingPage.getDrawingDensity():null;this.orientation==="portrait"&&this.direction===1||(this.bottomPage.getElement().style.zIndex=(this.getSettings().startZIndex+3).toString(10),this.bottomPage.draw(t))}drawFrame(){this.clear(),this.drawLeftPage(),this.drawRightPage(),this.drawBottomPage(),this.flippingPage!=null&&(this.flippingPage.getElement().style.zIndex=(this.getSettings().startZIndex+5).toString(10),this.flippingPage.draw()),this.shadow!=null&&this.flippingPage!==null&&(this.flippingPage.getDrawingDensity()==="soft"?(this.drawOuterShadow(),this.drawInnerShadow()):(this.drawHardOuterShadow(),this.drawHardInnerShadow()))}clear(){for(let t of this.app.getPageCollection().getPages())t!==this.leftPage&&t!==this.rightPage&&t!==this.flippingPage&&t!==this.bottomPage&&(t.getElement().style.cssText="display: none"),t.getTemporaryCopy()!==this.flippingPage&&t.hideTemporaryCopy()}update(){super.update(),this.rightPage!==null&&this.rightPage.setOrientation(1),this.leftPage!==null&&this.leftPage.setOrientation(0)}},M=class{constructor(){this._default={startPage:0,size:"fixed",width:0,height:0,minWidth:0,maxWidth:0,minHeight:0,maxHeight:0,drawShadow:!0,flippingTime:1e3,usePortrait:!0,startZIndex:0,autoSize:!0,maxShadowOpacity:1,showCover:!1,mobileScrollSupport:!0,swipeDistance:30,clickEventForward:!0,useMouseEvents:!0,showPageCorners:!0,disableFlipByClick:!1}}getSettings(t){let e=this._default;if(Object.assign(e,t),e.size!=="stretch"&&e.size!=="fixed")throw new Error('Invalid size type. Available only "fixed" and "stretch" value');if(e.width<=0||e.height<=0)throw new Error("Invalid width or height");if(e.flippingTime<=0)throw new Error("Invalid flipping time");return e.size==="stretch"?(e.minWidth<=0&&(e.minWidth=100),e.maxWidth<e.minWidth&&(e.maxWidth=2e3),e.minHeight<=0&&(e.minHeight=100),e.maxHeight<e.minHeight&&(e.maxHeight=2e3)):(e.minWidth=e.width,e.maxWidth=e.width,e.minHeight=e.height,e.maxHeight=e.height),e}};(function(h,t){t===void 0&&(t={});var e=t.insertAt;if(h&&typeof document<"u"){var i=document.head||document.getElementsByTagName("head")[0],s=document.createElement("style");s.type="text/css",e==="top"&&i.firstChild?i.insertBefore(s,i.firstChild):i.appendChild(s),s.styleSheet?s.styleSheet.cssText=h:s.appendChild(document.createTextNode(h))}})(`.stf__parent {
  position: relative;
  display: block;
  box-sizing: border-box;
  transform: translateZ(0);

  -ms-touch-action: pan-y;
  touch-action: pan-y;
}

.sft__wrapper {
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

.stf__parent canvas {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}

.stf__block {
  position: absolute;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  perspective: 2000px;
}

.stf__item {
  display: none;
  position: absolute;
  transform-style: preserve-3d;
}

.stf__outerShadow {
  position: absolute;
  left: 0;
  top: 0;
}

.stf__innerShadow {
  position: absolute;
  left: 0;
  top: 0;
}

.stf__hardShadow {
  position: absolute;
  left: 0;
  top: 0;
}

.stf__hardInnerShadow {
  position: absolute;
  left: 0;
  top: 0;
}`);var v=class extends class{constructor(){this.events=new Map}on(t,e){return this.events.has(t)?this.events.get(t).push(e):this.events.set(t,[e]),this}off(t){this.events.delete(t)}trigger(t,e,i=null){if(this.events.has(t))for(let s of this.events.get(t))s({data:i,object:e})}}{constructor(t,e){super(),this.isUserTouch=!1,this.isUserMove=!1,this.setting=null,this.pages=null,this.setting=new M().getSettings(e),this.block=t}destroy(){this.ui.destroy(),this.block.remove()}update(){this.render.update(),this.pages.show()}loadFromImages(t){this.ui=new I(this.block,this,this.setting);let e=this.ui.getCanvas();this.render=new T(this,this.setting,e),this.flipController=new x(this.render,this),this.pages=new f(this,this.render,t),this.pages.load(),this.render.start(),this.pages.show(this.setting.startPage),setTimeout(()=>{this.ui.update(),this.trigger("init",this,{page:this.setting.startPage,mode:this.render.getOrientation()})},1)}loadFromHTML(t){this.ui=new C(this.block,this,this.setting,t),this.render=new R(this,this.setting,this.ui.getDistElement()),this.flipController=new x(this.render,this),this.pages=new w(this,this.render,this.ui.getDistElement(),t),this.pages.load(),this.render.start(),this.pages.show(this.setting.startPage),setTimeout(()=>{this.ui.update(),this.trigger("init",this,{page:this.setting.startPage,mode:this.render.getOrientation()})},1)}updateFromImages(t){let e=this.pages.getCurrentPageIndex();this.pages.destroy(),this.pages=new f(this,this.render,t),this.pages.load(),this.pages.show(e),this.trigger("update",this,{page:e,mode:this.render.getOrientation()})}updateFromHtml(t){let e=this.pages.getCurrentPageIndex();this.pages.destroy(),this.pages=new w(this,this.render,this.ui.getDistElement(),t),this.pages.load(),this.ui.updateItems(t),this.render.reload(),this.pages.show(e),this.trigger("update",this,{page:e,mode:this.render.getOrientation()})}clear(){this.pages.destroy(),this.ui.clear()}turnToPrevPage(){this.pages.showPrev()}turnToNextPage(){this.pages.showNext()}turnToPage(t){this.pages.show(t)}flipNext(t="top"){this.flipController.flipNext(t)}flipPrev(t="top"){this.flipController.flipPrev(t)}flip(t,e="top"){this.flipController.flipToPage(t,e)}updateState(t){this.trigger("changeState",this,t)}updatePageIndex(t){this.trigger("flip",this,t)}updateOrientation(t){this.ui.setOrientationStyle(t),this.update(),this.trigger("changeOrientation",this,t)}getPageCount(){return this.pages.getPageCount()}getCurrentPageIndex(){return this.pages.getCurrentPageIndex()}getPage(t){return this.pages.getPage(t)}getRender(){return this.render}getFlipController(){return this.flipController}getOrientation(){return this.render.getOrientation()}getBoundsRect(){return this.render.getRect()}getSettings(){return this.setting}getUI(){return this.ui}getState(){return this.flipController.getState()}getPageCollection(){return this.pages}startUserTouch(t){this.mousePosition=t,this.isUserTouch=!0,this.isUserMove=!1}userMove(t,e){this.isUserTouch||e||!this.setting.showPageCorners?this.isUserTouch&&p.GetDistanceBetweenTwoPoint(this.mousePosition,t)>5&&(this.isUserMove=!0,this.flipController.fold(t)):this.flipController.showCorner(t)}userStop(t,e=!1){this.isUserTouch&&(this.isUserTouch=!1,e||(this.isUserMove?this.flipController.stopMove():this.flipController.flip(t)))}};var D={pages:[],cover:null,back:null,rtl:!0,spread:"auto",ratio:.707,flippingTime:800,maxShadowOpacity:.75,corner:"bottom",singleBreakpoint:640,hotzones:!0,keyboard:!0,wheel:!0,lazyLoad:!0,lazyWindow:5,theme:"auto",pageThickness:.32,onStateChange:null,onPageChange:null},B=0,H="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",P=class{constructor(t,e={}){this.opts={...D,...e},this.root=t,this.id=++B,this.flip=null,this.destroyed=!1,this._activeSingle=null,this._wheelLock=0,this._down=null,this._foldMove=null,this._foldDriven=!1,this._flipState="read",this._spineTimer=0,this._mirrorCache=new Map,this._prepSeq=0,this._baseUrls=null,this._realUrls=null,this._fillPending=new Set,this._lastRtl=null,this._buildShell(),this._bindGlobalEvents(),this._boot()}_orderedUrls(){let{pages:t,cover:e,back:i}=this.opts,s=[];return e&&s.push(e),s.push(...t),i&&s.push(i),s}_logicalsAt(t){let e=this.opts.pages.length;if(t<0)return[];let i=r=>r>=1&&r<=e;return(this._activeSingle?[t+1]:[t+1,t+2]).filter(i)}_orderIdxOfLogical(t){return t-1}_coverOffset(){return this.opts.cover?1:0}_sheets(){return this._orderedUrls().length}_buildShell(){this.root.classList.add("manga-reader"),this.root.innerHTML=`
      <div class="mr-stage">
        <div class="mr-book-wrap" data-spread="double">
          <div class="mr-edge-band"></div>
          <div class="mr-edge-shade"></div>
        </div>
      </div>
      <div class="mr-spinner"></div>
    `,this.stage=this.root.querySelector(".mr-stage"),this.bookWrap=this.root.querySelector(".mr-book-wrap"),this.spinner=this.root.querySelector(".mr-spinner"),this.root.addEventListener("click",t=>{let e=t.target.closest("[data-act]")?.dataset.act;e&&(e==="next"?this.next():e==="prev"?this.prev():e==="first"?this.goToPage(0):e==="last"?this.goToPage(this.opts.pages.length+1):e==="spread"?this.setSpread(this._activeSingle?"double":"single"):e==="dir"?this.toggleDirection():e==="theme"&&this.toggleTheme())}),this.opts.hotzones&&this._bindClickZones(),this._ro=new ResizeObserver(()=>this._layout()),this._ro.observe(this.stage),this._applyTheme()}_applyTheme(){let{theme:t}=this.opts,e=()=>{let i=t==="auto"?matchMedia("(prefers-color-scheme: light)").matches?"light":"dark":t;this.root.dataset.theme=i};e(),t==="auto"&&(this._applyThemeBound=e,this._mq=matchMedia("(prefers-color-scheme: light)"),this._mq.addEventListener?.("change",e))}_bindClickZones(){this.stage.addEventListener("pointerdown",t=>{this._down={x:t.clientX,y:t.clientY}}),this.stage.addEventListener("click",t=>{if(!this._down)return;let e=Math.hypot(t.clientX-this._down.x,t.clientY-this._down.y);if(this._down=null,e>10||!this.flip||this._flipState!=="read")return;let i=this.stage.getBoundingClientRect(),s=(t.clientX-i.left)/i.width;s<.32?this.opts.rtl?this.next():this.prev():s>.68&&(this.opts.rtl?this.prev():this.next())})}_isSingleMode(){let{spread:t,singleBreakpoint:e}=this.opts;return t==="single"?!0:t==="double"?!1:this.stage.clientWidth<e}_layout(){if(!this.bookWrap)return;let t=this._isSingleMode();if(t!==this._activeSingle&&this._activeSingle!==null&&this.flip){this._rebuild();return}this._activeSingle=t,this._setSize(t),this.bookWrap.dataset.spread=t?"single":"double",this.flip?.update()}_availBox(){let t=getComputedStyle(this.stage),e=parseFloat(t.paddingLeft)+parseFloat(t.paddingRight),i=parseFloat(t.paddingTop)+parseFloat(t.paddingBottom);return{w:Math.max(50,this.stage.clientWidth-e),h:Math.max(50,this.stage.clientHeight-i)}}_engineSpreadRatio(t){let e=Math.round(1400*this.opts.ratio)/1400;return t?e:e*2}_setSize(t){let{w:e,h:i}=this._availBox(),s=this._engineSpreadRatio(t),r=Math.floor(Math.min(e,i*s)),n=Math.ceil(r/s);n>i&&(n=i,r=Math.floor(n*s)),this.bookWrap.style.width=`${r}px`,this.bookWrap.style.height=`${n}px`,this._applyThickness(n)}_applyThickness(t){let e=this.opts.pages.length*this.opts.pageThickness,i=Math.max(3,Math.min(22,e*(t/1400))),s=Math.min(1,e/22);this._thickBase=i*(.25+s*(2/3-.25)),this.bookWrap.style.setProperty("--mr-thick",`${this._thickBase.toFixed(1)}px`),this._updateThicknessSplit()}_updateThicknessSplit(){if(!this.bookWrap||!this.flip)return;let t=this._thickBase||0,e=this._sheets()-1,i=e>0?Math.max(0,Math.min(1,this.flip.getCurrentPageIndex()/e)):0,[s,r]=this.opts.rtl?[t*(1-i),t*i]:[t*i,t*(1-i)],n=s+r>0?s/(s+r):.5,o=s+r>0?r/(s+r):.5;this.bookWrap.style.setProperty("--mr-thick-l",`${s.toFixed(1)}px`),this.bookWrap.style.setProperty("--mr-thick-r",`${r.toFixed(1)}px`);let a=g=>t>0?g*(1.44-.24*(g/t)):0;this.bookWrap.style.setProperty("--mr-band-l",`${a(s).toFixed(1)}px`),this.bookWrap.style.setProperty("--mr-band-r",`${a(r).toFixed(1)}px`);let l=this.bookWrap.clientWidth*.018;this.bookWrap.style.setProperty("--mr-shade-l",`${(l*n).toFixed(1)}px`),this.bookWrap.style.setProperty("--mr-shade-r",`${(l*o).toFixed(1)}px`)}async _boot(){if(this._showSpinner(!0),this._layout(),this._baseUrls=this._orderedUrls(),this.opts.lazyLoad){this._realUrls=new Array(this._baseUrls.length).fill(null);try{await Promise.all(this._baseUrls.slice(0,this.opts.lazyWindow+1).map((e,i)=>this._materialize(i)))}catch{console.warn("[MangaReader] \u90E8\u5206\u56FE\u7247\u52A0\u8F7D\u5931\u8D25\uFF0C\u4ECD\u7EE7\u7EED\u6E32\u67D3")}if(this.destroyed)return;this._initFlip(this._engineUrls()),this._showSpinner(!1);return}try{await Promise.all(this._baseUrls.map(e=>this._preload(e)))}catch{console.warn("[MangaReader] \u90E8\u5206\u56FE\u7247\u52A0\u8F7D\u5931\u8D25\uFF0C\u4ECD\u7EE7\u7EED\u6E32\u67D3")}if(this.destroyed)return;let t=await this._prepareUrls(this._baseUrls);this.destroyed||(this._initFlip(t),this._showSpinner(!1))}_engineUrls(){return this._baseUrls.map((t,e)=>this._realUrls[e]||H)}_materialize(t){if(!this._baseUrls||this._realUrls[t]||this._fillPending.has(t))return Promise.resolve();let e=this._baseUrls[t];if(!this.opts.rtl)return this._setReal(t,e),Promise.resolve();let i=this._mirrorCache.get(e);if(i)return this._setReal(t,i),Promise.resolve();this._fillPending.add(t);let s=this.opts.rtl;return this._prepareUrl(e).then(r=>{this.destroyed||this.opts.rtl!==s||this._setReal(t,r)}).finally(()=>this._fillPending.delete(t))}_setReal(t,e){if(this._realUrls[t]=e,!this.flip)return;let i=null;try{i=this.flip.getPage(t)}catch{}let s=i&&i.image;!s||s.getAttribute("src")===e||(i.isLoad=!1,s.addEventListener("load",()=>{this.destroyed||this.flip?.update()},{once:!0}),s.src=e)}_fillWindow(){if(!this.opts.lazyLoad||!this.flip||!this._realUrls)return;let t=this.flip.getCurrentPageIndex(),e=Math.max(0,t-this.opts.lazyWindow),i=Math.min(this._baseUrls.length-1,t+this.opts.lazyWindow);for(let s=e;s<=i;s++)this._materialize(s)}_prepareUrls(t){return this.opts.rtl?Promise.all(t.map(e=>this._prepareUrl(e))):Promise.resolve(t.slice())}_prepareUrl(t){let e=this._mirrorCache.get(t);return e?Promise.resolve(e):this._mirrored(t).then(i=>(this._mirrorCache.set(t,i),i)).catch(()=>t)}_mirrored(t){return new Promise((e,i)=>{let s=new Image;s.onload=()=>{let r=document.createElement("canvas");r.width=s.naturalWidth,r.height=s.naturalHeight;let n=r.getContext("2d");n.translate(r.width,0),n.scale(-1,1),n.drawImage(s,0,0),r.toBlob(o=>o?e(URL.createObjectURL(o)):i(new Error("toBlob failed")),"image/jpeg",.92)},s.onerror=()=>i(new Error("load failed")),s.src=t})}_preload(t){return new Promise((e,i)=>{let s=new Image;s.onload=()=>e(s),s.onerror=i,s.src=t})}_initFlip(t){try{this.flip?.destroy()}catch{}this.bookEl=document.createElement("div"),this.bookEl.className="mr-book",this.bookWrap.appendChild(this.bookEl);let e=1400,i=Math.round(e*this.opts.ratio),s=this.bookWrap.clientWidth,r=this._activeSingle;this.flip=new v(this.bookEl,{size:"stretch",width:i,height:e,minWidth:r?Math.floor(s/2)+2:0,maxWidth:1e5,minHeight:0,maxHeight:1e5,usePortrait:r,showCover:!!this.opts.cover,maxShadowOpacity:this.opts.maxShadowOpacity,drawShadow:!0,flippingTime:this.opts.flippingTime,mobileScrollSupport:!0,disableFlipByClick:!0,startPage:0}),this.flip.loadFromImages(t),this._lastRtl=this.opts.rtl;let n=this.flip.render,o=n.drawBookShadow.bind(n);n.drawBookShadow=()=>{this._activeSingle||o()},this._applyRtlMirror(),this.bookWrap.style.setProperty("--mr-thick-t","0ms"),this.flip.on("flip",()=>this._syncUi()),this.flip.on("changeState",a=>{this.opts.onStateChange?.(a.data),this._onFlipState(a.data)}),this._syncUi()}_enableEdgeTransition(){this.bookWrap.style.setProperty("--mr-thick-t",`${this.opts.flippingTime}ms`),clearTimeout(this._edgeDurTimer),this._edgeDurTimer=setTimeout(()=>{this.bookWrap?.style.setProperty("--mr-thick-t","0ms")},this.opts.flippingTime*2+250)}_rebuild(){this._activeSingle=this._isSingleMode();let t=this._currentLogical();if(this._layoutSizesOnly(),this.opts.lazyLoad){this.opts.rtl!==this._lastRtl&&this._realUrls.fill(null),this._initFlip(this._engineUrls()),t!=null&&this.goToPage(t);return}let e=++this._prepSeq;this._prepareUrls(this._orderedUrls()).then(i=>{this.destroyed||e!==this._prepSeq||(this._initFlip(i),t!=null&&this.goToPage(t))})}_layoutSizesOnly(){let t=this._activeSingle;this._setSize(t),this.bookWrap.dataset.spread=t?"single":"double"}_applyRtlMirror(){let t=this.opts.rtl;if(this.bookEl.style.transform=t?"scaleX(-1)":"",!t)return;let e=this.flip.ui;e&&(e.getMousePos=function(i,s){let r=this.distElement.getBoundingClientRect();return{x:r.right-i,y:s-r.top}})}next(){this.flip&&this.flip.flipNext(this.opts.corner)}prev(){this.flip&&this.flip.flipPrev(this.opts.corner)}goToPage(t){if(!this.flip)return;let e=this.opts.pages.length,i;t<=0?i=0:t>e?i=this._sheets()-1:i=this._orderIdxOfLogical(t)+this._coverOffset(),this.flip.turnToPage(i),this._syncUi()}_currentLogical(){if(!this.flip)return null;let t=this.flip.getCurrentPageIndex()-this._coverOffset(),e=this._logicalsAt(t);return e.length?Math.min(...e):null}setSpread(t){this.opts.spread=t,this._rebuild()}toggleTheme(){let t=this.root.dataset.theme==="light"?"dark":"light";this.opts.theme=t,this.root.dataset.theme=t}toggleDirection(){this.opts.rtl=!this.opts.rtl,this._rebuild()}_syncUi(){if(!this.flip)return;this._updateThicknessSplit();let t=this.flip.getCurrentPageIndex(),e=this.opts.pages.length,i=this._sheets(),s=t-this._coverOffset(),r=this._logicalsAt(s);this._fillWindow();let n;r.length===0?n=t===0?"\u5C01\u9762":t>=i-1?"\u5C01\u5E95":"-":r.length===1?n=`\u7B2C ${r[0]} \u9875`:n=`\u7B2C ${Math.min(...r)}-${Math.max(...r)} \u9875`;let o=this.root.querySelector(".mr-page-indicator");o&&(o.textContent=`${n} / \u5171 ${e} \u9875`);let a=this.root.querySelector(".mr-progress");a&&(a.style.width=`${(i>1?t/(i-1):0)*100}%`),this.opts.onPageChange?.({logical:r.length?Math.min(...r):null,display:n,progress:i>1?t/(i-1):0})}_bindGlobalEvents(){this.opts.keyboard&&(this._onKey=t=>{if(t.key==="ArrowLeft")this.opts.rtl?this.next():this.prev();else if(t.key==="ArrowRight")this.opts.rtl?this.prev():this.next();else if(t.key===" ")t.preventDefault(),this.next();else return},window.addEventListener("keydown",this._onKey)),this.opts.wheel&&(this._onWheel=t=>{let e=performance.now();e-this._wheelLock<600||Math.abs(t.deltaY)<8||(this._wheelLock=e,t.deltaY>0?this.next():this.prev())},this.stage.addEventListener("wheel",this._onWheel,{passive:!0}))}_onFlipState(t){this._flipState=t,t==="user_fold"?(this._enableEdgeTransition(),this._foldDriven=!0,this._foldMove||(this._foldMove=e=>{let i=this.stage.getBoundingClientRect(),s=(e.clientX-i.left)/i.width,n=(this._down?(this._down.x-i.left)/i.width:s)<.5?s>=.5:s<=.5;this.bookWrap.classList.toggle("mr-flipping",n)},window.addEventListener("mousemove",this._foldMove),window.addEventListener("touchmove",this._foldMove,{passive:!0}))):t==="fold_corner"?this.bookWrap.classList.remove("mr-flipping"):t==="flipping"?(this._enableEdgeTransition(),this._detachFoldMove(),this._foldDriven||(clearTimeout(this._spineTimer),this._spineTimer=setTimeout(()=>{this.bookWrap?.classList.add("mr-flipping")},this.opts.flippingTime/2)),this._foldDriven=!1):t==="read"&&(this._detachFoldMove(),clearTimeout(this._spineTimer),this._foldDriven=!1,this.bookWrap.classList.remove("mr-flipping"))}_detachFoldMove(){this._foldMove&&(window.removeEventListener("mousemove",this._foldMove),window.removeEventListener("touchmove",this._foldMove),this._foldMove=null)}_showSpinner(t){this.spinner?.classList.toggle("mr-visible",t)}destroy(){this.destroyed=!0,this._detachFoldMove(),clearTimeout(this._spineTimer),clearTimeout(this._edgeDurTimer),this._ro?.disconnect(),this._mq?.removeEventListener?.("change",this._applyThemeBound),window.removeEventListener("keydown",this._onKey),this.stage?.removeEventListener("wheel",this._onWheel);try{this.flip?.destroy()}catch{}this._mirrorCache.forEach(t=>URL.revokeObjectURL(t)),this._mirrorCache.clear(),this.root.innerHTML="",this.root.classList.remove("manga-reader")}};var A="manga-reader-style";function z(h=document){if(h.getElementById(A))return;let t=h.createElement("style");t.id=A,t.textContent=L,h.head.appendChild(t)}var W=class extends P{constructor(t,e={}){z(t.ownerDocument),super(t,e)}};export{D as DEFAULTS,W as MangaReader,z as injectStyles};
//# sourceMappingURL=manga-reader.esm.js.map
