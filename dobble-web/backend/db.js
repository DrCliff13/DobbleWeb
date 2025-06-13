// backend/db.js
const mysql = require('mysql2');

// Detectar si estamos en producción por la existencia de DATABASE_URL
const isProduction = process.env.DATABASE_URL !== undefined;

let connection;

if (isProduction) {
  // 🌐 Configuración para producción (Railway)
  const dbUrl = new URL(process.env.DATABASE_URL);

  connection = mysql.createConnection({
    host: dbUrl.hostname,
    port: dbUrl.port,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.replace('/', ''),
    ssl: { rejectUnauthorized: false } // Railway lo requiere para conexiones seguras
  });

  console.log('🌐 Conectando a base de datos en producción (Railway)...');
} else {
  // 🖥️ Configuración para entorno local
  connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',      // cámbialo si usas otra clave en tu local
    database: 'dobble_db'   // asegúrate de tener esta base localmente
  });

  console.log('🖥️ Conectando a base de datos local...');
}

// Conexión
connection.connect((err) => {
  if (err) {
    console.error('❌ Error al conectar con la base de datos:', err);
    return;
  }
  console.log('✅ Conexión exitosa a la base de datos MySQL');
});

module.exports = connection;
