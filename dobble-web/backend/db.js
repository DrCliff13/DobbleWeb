const mysql = require('mysql2');

console.log('🔗 Configurando conexión a base de datos...');

let db;

if (process.env.MYSQL_URL) {
  // Usar URL completa (para Railway)
  console.log('🔍 Usando MYSQL_URL para conexión');
  db = mysql.createConnection(process.env.MYSQL_URL);
} else {
  // Usar variables individuales (para desarrollo local)
  console.log('🔍 Usando variables individuales para conexión');
  const dbConfig = {
    host: process.env.MYSQLHOST || 'localhost',
    port: process.env.MYSQLPORT || 13693,
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || 'WkRMtHedglauDZwYepbHspDTMCYDEQGi',
    database: process.env.MYSQLDATABASE || 'railway'
  };
  
  db = mysql.createConnection(dbConfig);
}

// Conectar y manejar errores
db.connect((err) => {
  if (err) {
    console.error('❌ Error conectando a MySQL:', err);
    process.exit(1);
  }
  
  console.log('✅ Conectado a MySQL Railway');
  
  // Verificar la base de datos actual
  db.query('SELECT DATABASE() as current_db', (err, results) => {
    if (err) {
      console.error('❌ Error verificando BD:', err);
    } else {
      console.log('✅ Base de datos actual:', results[0]?.current_db);
    }
  });
});

// Manejar errores de conexión
db.on('error', (err) => {
  console.error('❌ Error de base de datos:', err);
});

module.exports = db;
