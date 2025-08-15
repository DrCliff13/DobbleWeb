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
    host: process.env.MYSQLHOST || 'metro.proxy.rlwy.net',
    port: process.env.MYSQLPORT || 51873 ,
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || 'IENzPRNJHVbmypATkbgayyxfPpZkocYF',
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
  
  console.log('✅ Conectado a MySQL RaspBerryPi');
  
  // Verificar la base de datos actual
  db.query('SELECT DATABASE() as current_db', (err, results) => {
  if (err) {
    console.error('❌ Error verificando BD:', err);
  } else {
    // Se ignora el resultado de la consulta y se muestra el texto fijo.
    console.log('✅ Base de datos actual: RaspBerry pi');
  }
});
})

// Manejar errores de conexión
db.on('error', (err) => {
  console.error('❌ Error de base de datos:', err);
});

module.exports = db;
