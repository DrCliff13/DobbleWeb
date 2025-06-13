const express = require('express');
const router = express.Router();
const db = require('../db'); // Asegúrate que `db` es tu conexión MySQL
const bcrypt = require('bcrypt');

// Registrar usuario
router.post('/registro', async (req, res) => {
  const { usuario, clave, nombres, apellidos, cedula, fecha_nacimiento, nivel_escolaridad, tipo_usuario } = req.body;

  if (!usuario || !clave) {
    return res.status(400).json({ message: 'Usuario y clave son obligatorios' });
  }

  try {
    // Encriptar la clave antes de guardar
    const claveHash = await bcrypt.hash(clave, 10);

    const sql = `
      INSERT INTO Usuarios 
        (usuario, clave, nombres, apellidos, cedula, fecha_nacimiento, nivel_escolaridad, tipo_usuario)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const valores = [
      usuario,
      claveHash,
      nombres || null,
      apellidos || null,
      cedula || null,
      fecha_nacimiento || null,
      nivel_escolaridad || null,
      tipo_usuario || 'estudiante'
    ];

    db.query(sql, valores, (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ message: 'El usuario ya existe' });
        }
        console.error('❌ Error al registrar:', err);
        return res.status(500).json({ message: 'Error al registrar el usuario' });
      }

      res.status(201).json({ message: 'Usuario registrado con éxito', id: result.insertId });
    });
  } catch (error) {
    console.error('❌ Error en /registro:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
