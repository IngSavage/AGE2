const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sql = require('mssql');
const { getPool } = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'cambiame';
const PORT = process.env.PORT || 3000;

// ensure table exists when we start
(async function createTableIfNotExists() {
  try {
    const pool = await getPool();
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'users')
      CREATE TABLE users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL,
        email NVARCHAR(255) NOT NULL UNIQUE,
        password NVARCHAR(255) NOT NULL,
        created_at DATETIME2 DEFAULT SYSUTCDATETIME()
      )
    `);
    console.log('Tabla users disponible');
  } catch (e) {
    console.error('Error creando tabla users', e);
  }
})();

// endpoints
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Faltan datos' });

  try {
    const pool = await getPool();
    // check existing email
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT id FROM users WHERE email = @email');
    if (result.recordset.length) {
      return res.status(400).json({ success: false, message: 'Correo ya registrado' });
    }

    const hash = await bcrypt.hash(password, 10);
    await pool.request()
      .input('name', sql.VarChar, name)
      .input('email', sql.VarChar, email)
      .input('password', sql.VarChar, hash)
      .query('INSERT INTO users (name, email, password) VALUES (@name, @email, @password)');

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error interno' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Faltan datos' });

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT id, password FROM users WHERE email = @email');
    if (!result.recordset.length) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    const user = result.recordset[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ sub: user.id, email }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error interno' });
  }
});

// optional: profile endpoint
app.get('/api/profile', async (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No autorizado' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, payload.sub)
      .query('SELECT id, name, email FROM users WHERE id = @id');
    if (!result.recordset.length) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(401).json({ message: 'Token inválido' });
  }
});

app.listen(PORT, () => console.log(`API escuchando en puerto ${PORT}`));
