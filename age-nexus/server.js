import http from 'http';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'data.json');

function readDb() {
  if (!fs.existsSync(dbPath)) {
    const initial = { users: [], sessions: [], messages: [], counters: { user: 1, message: 1 } };
    fs.writeFileSync(dbPath, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

function writeDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function createToken() {
  return crypto.randomBytes(24).toString('hex');
}

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

function getToken(req) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) return '';
  return auth.slice(7);
}

function authUser(req, db) {
  const token = getToken(req);
  const session = db.sessions.find(s => s.token === token);
  if (!session) return null;
  const user = db.users.find(u => u.id === session.userId);
  return user ? { id: user.id, username: user.username, token } : null;
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
    const db = readDb();

    if (req.method === 'POST' && pathname === '/api/auth/signup') {
      const { username = '', password = '' } = await parseBody(req);
      if (!username.trim() || password.length < 4) return sendJson(res, 400, { error: 'Usuario y contraseña válidos requeridos' });
      if (db.users.some(u => u.username === username.trim())) return sendJson(res, 409, { error: 'El usuario ya existe' });

      const user = { id: db.counters.user++, username: username.trim(), passwordHash: hashPassword(password), createdAt: new Date().toISOString() };
      db.users.push(user);
      const token = createToken();
      db.sessions.push({ token, userId: user.id, createdAt: new Date().toISOString() });
      writeDb(db);
      return sendJson(res, 201, { token, user: { id: user.id, username: user.username } });
    }

    if (req.method === 'POST' && pathname === '/api/auth/login') {
      const { username = '', password = '' } = await parseBody(req);
      const user = db.users.find(u => u.username === username.trim());
      if (!user || user.passwordHash !== hashPassword(password)) return sendJson(res, 401, { error: 'Usuario o contraseña incorrectos' });

      const token = createToken();
      db.sessions.push({ token, userId: user.id, createdAt: new Date().toISOString() });
      writeDb(db);
      return sendJson(res, 200, { token, user: { id: user.id, username: user.username } });
    }

    if (req.method === 'GET' && pathname === '/api/auth/me') {
      const user = authUser(req, db);
      if (!user) return sendJson(res, 401, { error: 'No autorizado' });
      return sendJson(res, 200, { user: { id: user.id, username: user.username } });
    }

    if (req.method === 'POST' && pathname === '/api/auth/logout') {
      const user = authUser(req, db);
      if (!user) return sendJson(res, 401, { error: 'No autorizado' });
      db.sessions = db.sessions.filter(s => s.token !== user.token);
      writeDb(db);
      return sendJson(res, 200, { ok: true });
    }

    if (req.method === 'GET' && pathname === '/api/messages') {
      const user = authUser(req, db);
      if (!user) return sendJson(res, 401, { error: 'No autorizado' });

      const payload = db.messages.slice().reverse().map(msg => {
        const author = db.users.find(u => u.id === msg.userId);
        return {
          id: msg.id,
          text: msg.text,
          author: { id: author.id, username: author.username },
          createdAt: msg.createdAt,
          updatedAt: msg.updatedAt,
          isOwner: msg.userId === user.id
        };
      });
      return sendJson(res, 200, payload);
    }

    if (req.method === 'POST' && pathname === '/api/messages') {
      const user = authUser(req, db);
      if (!user) return sendJson(res, 401, { error: 'No autorizado' });
      const { text = '' } = await parseBody(req);
      if (!text.trim()) return sendJson(res, 400, { error: 'Mensaje requerido' });

      const message = { id: db.counters.message++, userId: user.id, text: text.trim(), createdAt: new Date().toISOString(), updatedAt: null };
      db.messages.push(message);
      writeDb(db);
      return sendJson(res, 201, { id: message.id });
    }

    if ((req.method === 'PUT' || req.method === 'DELETE') && pathname.startsWith('/api/messages/')) {
      const user = authUser(req, db);
      if (!user) return sendJson(res, 401, { error: 'No autorizado' });
      const id = Number(pathname.split('/').pop());
      const message = db.messages.find(m => m.id === id);
      if (!message) return sendJson(res, 404, { error: 'Mensaje no encontrado' });
      if (message.userId !== user.id) return sendJson(res, 403, { error: 'No autorizado para esta acción' });

      if (req.method === 'DELETE') {
        db.messages = db.messages.filter(m => m.id !== id);
        writeDb(db);
        return sendJson(res, 200, { ok: true });
      }

      const { text = '' } = await parseBody(req);
      if (!text.trim()) return sendJson(res, 400, { error: 'Mensaje requerido' });
      message.text = text.trim();
      message.updatedAt = new Date().toISOString();
      writeDb(db);
      return sendJson(res, 200, { ok: true });
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
