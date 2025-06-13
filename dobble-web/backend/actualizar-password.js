const bcrypt = require('bcrypt');
const db = require('./db');

async function actualizarPassword() {
  try {
    const nuevaPassword = '1234';
    const hashedPassword = await bcrypt.hash(nuevaPassword, 10);
    
    db.query(
      'UPDATE usuarios SET clave = ? WHERE usuario = ?',
      [hashedPassword, 'mau'],
      (err, result) => {
        if (err) {
          console.error('❌ Error:', err);
        } else if (result.affectedRows > 0) {
          console.log('✅ Contraseña actualizada exitosamente para profesor1');
          console.log('   Nueva contraseña: 1234');
        } else {
          console.log('❌ Usuario profesor1 no encontrado');
        }
        process.exit();
      }
    );
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit();
  }
}

actualizarPassword();