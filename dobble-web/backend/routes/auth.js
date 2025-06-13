const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');
const db = require('../db'); // o './db' si está en el mismo directorio


router.post('/login', login);

module.exports = router;
