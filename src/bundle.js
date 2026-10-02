// 单文件分发入口：esbuild 将本文件与 manga-reader.js、vendor/page-flip、
// manga-reader.css 一起打成 dist/manga-reader.esm.js（CSS 运行时自动注入）。
// 开发/源码用法不受影响（仍可直接 import src/manga-reader.js + link css）。
import cssText from './manga-reader.css';
import { MangaReader as Base, DEFAULTS } from './manga-reader.js';

const STYLE_ID = 'manga-reader-style';

export function injectStyles(doc = document) {
  if (doc.getElementById(STYLE_ID)) return;
  const style = doc.createElement('style');
  style.id = STYLE_ID;
  style.textContent = cssText;
  doc.head.appendChild(style);
}

export class MangaReader extends Base {
  constructor(root, options = {}) {
    injectStyles(root.ownerDocument);
    super(root, options);
  }
}

export { DEFAULTS };
