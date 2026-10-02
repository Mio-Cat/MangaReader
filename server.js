/* 极简静态文件服务器（仅用于本地预览 demo） */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const MANGA_DIR = path.join(root, 'demo', 'manga'); // 漫画图源目录（项目内）
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

const IMAGE_RE = /\.(jpe?g|png|webp)$/i;
const NO_STORE = { 'Cache-Control': 'no-store' }; // 代码/样式改动即时生效

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);

  if (p === '/api/manga') {
    let files = [];
    try {
      files = fs.readdirSync(MANGA_DIR)
        .filter((f) => IMAGE_RE.test(f))
        .sort();
    } catch { /* 目录不存在则返回空 */ }
    res.writeHead(200, { 'Content-Type': 'application/json', ...NO_STORE });
    return res.end(JSON.stringify(files));
  }

  if (p.startsWith('/manga/')) {
    const name = path.basename(p); // 防目录穿越
    const file = path.join(MANGA_DIR, name);
    if (!fs.existsSync(file)) {
      res.writeHead(404);
      return res.end('not found');
    }
    res.writeHead(200, { 'Content-Type': mime[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    return fs.createReadStream(file).pipe(res);
  }

  if (p === '/') p = '/index.html';
  const file = path.join(root, p);
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404);
    return res.end('not found');
  }
  res.writeHead(200, {
    'Content-Type': mime[path.extname(file)] || 'application/octet-stream',
    ...(path.extname(file) === '.png' || path.extname(file) === '.jpg' || path.extname(file) === '.jpeg' ? {} : NO_STORE),
  });
  fs.createReadStream(file).pipe(res);
}).listen(5180, () => console.log('MangaReader demo: http://localhost:5180'));
