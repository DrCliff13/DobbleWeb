const mysql = require('mysql2');
require('dotenv').config(); // Cargar .env

let connection;

if (process.env.DATABASE_URL) {
  const dbUrl = new URL(process.env.DATABASE_URL);
  connection = mysql.createConnection({
    host: dbUrl.hostname,
    port: dbUrl.port,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.replace('/', ''),
    ssl: { rejectUnauthorized: false }
  });
  console.log('🌐 Conectando a base de datos en producción (Railway)...');
} else {
  connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'dobble_db'
  });
  console.log('🖥️ Conectando a base de datos local...');
}

connection.connect((err) => {
  if (err) {
    console.error('❌ Error al conectar con la base de datos:', err);
    return;
  }
  console.log('✅ Conexión exitosa a la base de datos MySQL');
});

module.exports = connection;
