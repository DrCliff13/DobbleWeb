const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const db = require('../db'); // o './db' si está en el mismo directorio



// Rutas
router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/estadisticas/:id', authController.obtenerEstadisticas);
// Agrega esta línea temporal
//router.get('/verificar-tabla', authController.verificarTabla);


module.exports = router;
