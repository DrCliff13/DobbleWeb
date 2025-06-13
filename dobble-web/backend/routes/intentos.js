// backend/routes/intentos.js
const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/intentos', (req, res) => {
  const { usuario, simbolo_correcto, simbolo_respuesta } = req.body;
  const es_correcto = simbolo_correcto === simbolo_respuesta ? 1 : 0;

  db.run(
    `INSERT INTO intentos (usuario, simbolo_correcto, simbolo_respuesta, es_correcto)
     VALUES (?, ?, ?, ?)`,
    [usuario, simbolo_correcto, simbolo_respuesta, es_correcto],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, es_correcto });
    }
  );
});

router.get('/intentos', (req, res) => {
  db.all(`SELECT * FROM intentos ORDER BY fecha DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
