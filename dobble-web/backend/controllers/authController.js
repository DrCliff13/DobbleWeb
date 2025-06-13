const db = require('../db');
const bcrypt = require('bcrypt');

// LOGIN
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

// REGISTER
const register = async (req, res) => {
  const {
    usuario,
    clave,
    nombres,
    apellidos,
    cedula,
    fecha_nacimiento,
    nivel_escolaridad,
    tipo_usuario
  } = req.body;
  
  if (!usuario || !clave || !nombres || !apellidos) {
    return res.status(400).json({ message: 'Faltan datos requeridos' });
  }
  
  try {
    const hashedPassword = await bcrypt.hash(clave, 10);
    
    const sql = `INSERT INTO usuarios 
    (usuario, clave, nombres, apellidos, cedula, fecha_nacimiento, nivel_escolaridad, tipo_usuario) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.query(
      sql,
      [usuario, hashedPassword, nombres, apellidos, cedula, fecha_nacimiento, nivel_escolaridad, tipo_usuario],
      (err, result) => {
        if (err) {
          console.error('Error al registrar usuario:', err);
          return res.status(500).json({ message: 'Error en el servidor' });
        }
        
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
      }
    );
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};

// OBTENER ESTADÍSTICAS
const obtenerEstadisticas = (req, res) => {
  const userId = req.params.id;
  const sql = 'SELECT partidas_jugadas, mejor_tiempo, victorias FROM estadisticas WHERE usuario_id = ?';
  
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error al obtener estadísticas:", err);
      return res.status(500).json({ message: 'Error al consultar estadísticas' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'No se encontraron estadísticas' });
    }
    
    const stats = results[0];
    res.status(200).json({
      gamesPlayed: stats.partidas_jugadas,
      bestTime: stats.mejor_tiempo,
      wins: stats.victorias
    });
  });
};

// EXPORTAR TODAS LAS FUNCIONES
module.exports = {
  login,
  register,
  obtenerEstadisticas
};
