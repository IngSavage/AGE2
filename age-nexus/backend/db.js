const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER, // full server address e.g. "yourserver.database.windows.net"
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

async function getPool() {
  if (!global.dbPool) {
    global.dbPool = await sql.connect(config);
  }
  return global.dbPool;
}

module.exports = { getPool };