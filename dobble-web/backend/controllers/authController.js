const db = require('../db');
const bcrypt = require('bcrypt');

const login = (req, res) => {
  console.log('🔍 Login request recibida:', req.body);
  
  const { usuario, clave } = req.body;
  
  if (!usuario || !clave) {
    console.log('❌ Faltan datos:', { usuario: !!usuario, clave: !!clave });
    return res.status(400).json({ message: 'Faltan datos de autenticación' });
  }
  
  console.log('🔍 Consultando BD para usuario:', usuario);
  
  // Primero verifica que la tabla existe
  db.query('DESCRIBE usuarios', (err, describe) => {
    if (err) {
      console.error('❌ Error al describir tabla usuarios:', err);
      return res.status(500).json({ message: 'Error: tabla usuarios no encontrada' });
    }
    
    console.log('✅ Columnas de tabla usuarios:', describe.map(col => col.Field));
    
    // Ahora hace la consulta original
    const sql = 'SELECT * FROM usuarios WHERE usuario = ?';
    db.query(sql, [usuario], async (err, results) => {
      if (err) {
        console.error('❌ Error al consultar la base de datos:', err);
        console.error('❌ SQL que falló:', sql);
        console.error('❌ Parámetros:', [usuario]);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
      
      if (results.length === 0) {
        return res.status(401).json({ message: 'Usuario no encontrado' });
      }
      
      const user = results[0];
      const passwordMatch = await bcrypt.compare(clave, user.clave);
      
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }
      
      res.status(200).json({
        message: 'Login exitoso',
        user: {
          id: user.id,
          usuario: user.usuario,
          tipo_usuario: user.tipo_usuario,
          nombres: user.nombres
        }
      });
    });
  });
};

// Resto de funciones (register, obtenerEstadisticas)...

module.exports = {
  login,
  register,
  obtenerEstadisticas
};
