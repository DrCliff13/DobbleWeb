// backend/controllers/gameController.js
const db = require('../db');

const guardarIntento = (req, res) => {
  const { user_id, categoria, puntaje, tiempo_respuesta } = req.body;

  if (!user_id || !puntaje) {
    return res.status(400).json({ message: 'Datos incompletos' });
  }

  db.query(
    'INSERT INTO intentos_partida (user_id, categoria, puntaje, tiempo_respuesta) VALUES (?, ?, ?, ?)',
    [user_id, categoria, puntaje, tiempo_respuesta],
    (err, result) => {
      if (err) {
        console.error('Error al guardar el intento:', err);
        return res.status(500).json({ message: 'Error en el servidor' });
      }

      res.status(201).json({ message: 'Intento guardado exitosamente', intento_id: result.insertId });
    }
  );
};

module.exports = { guardarIntento };
