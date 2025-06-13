const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/game/guardar-intento
router.post('/guardar-intento', (req, res) => {
  try {
    const { nombre, puntaje } = req.body;
    
    if (!nombre || puntaje == null) {
      return res.status(400).json({ 
        success: false,
        message: 'Datos incompletos' 
      });
    }

    const sql = 'INSERT INTO intentos (nombre, puntaje) VALUES (?, ?)';
    db.query(sql, [nombre, puntaje], (err, result) => {
      if (err) {
        console.error('❌ Error al guardar intento:', err);
        return res.status(500).json({ 
          success: false,
          message: 'Error en el servidor',
          error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
      }

      console.log(`✅ Intento guardado - ID: ${result.insertId}, Nombre: ${nombre}, Puntaje: ${puntaje}`);
      
      res.status(200).json({ 
        success: true,
        message: 'Intento guardado correctamente',
        id: result.insertId
      });
    });
    
  } catch (error) {
    console.error('❌ Error al guardar intento:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error en el servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/game/intentos - Obtener todos los intentos
router.get('/intentos', (req, res) => {
  try {
    const sql = 'SELECT * FROM intentos ORDER BY puntaje DESC, id DESC LIMIT 100';
    db.query(sql, (err, rows) => {
      if (err) {
        console.error('❌ Error al obtener intentos:', err);
        return res.status(500).json({
          success: false,
          message: 'Error al obtener intentos'
        });
      }

      res.json({
        success: true,
        intentos: rows
      });
    });
    
  } catch (error) {
    console.error('❌ Error al obtener intentos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener intentos'
    });
  }
});

module.exports = router;
