import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const messages = [];
let nextMessageId = 1;

function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

async function parseBody(req) {
  let raw = '';
  for await (const chunk of req) raw += chunk;
  if (!raw) return {};
  return JSON.parse(raw);
}

function serveStatic(req, res) {
  const cleanUrl = decodeURIComponent(req.url.split('?')[0]);
  const relative = cleanUrl === '/' ? 'index.html' : cleanUrl.replace(/^\//, '');
  const target = path.join(__dirname, relative);

  if (!target.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  if (!fs.existsSync(target) || fs.statSync(target).isDirectory()) {
    const indexPath = path.join(__dirname, 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(fs.readFileSync(indexPath));
    return;
  }

  const ext = path.extname(target).toLowerCase();
  const types = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.mp3': 'audio/mpeg'
  };

  res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
  fs.createReadStream(target).pipe(res);
}

const server = http.createServer(async (req, res) => {
  try {
    const pathname = req.url.split('?')[0];

    if (req.method === 'GET' && pathname === '/api/messages') {
      return sendJson(res, 200, messages.slice().reverse());
    }

    if (req.method === 'POST' && pathname === '/api/messages') {
      const { text = '' } = await parseBody(req);
      if (!text.trim()) return sendJson(res, 400, { error: 'Mensaje requerido' });

      const message = {
        id: nextMessageId++,
        text: text.trim(),
        createdAt: new Date().toISOString(),
        author: { username: 'Anónimo' }
      };
      messages.push(message);
      return sendJson(res, 201, { id: message.id });
    }

    serveStatic(req, res);
  } catch {
    sendJson(res, 500, { error: 'Error interno del servidor' });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Age Nexus disponible en http://localhost:${PORT}`);
});
