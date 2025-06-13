const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

console.log('🚀 Iniciando servidor...');

// ===== MIDDLEWARES BÁSICOS PRIMERO =====
app.use(cors());
app.use(express.json());
console.log('✅ Middlewares básicos configurados');

// ===== ARCHIVOS ESTÁTICOS =====
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));
console.log('✅ Archivos estáticos configurados');

// ===== RUTAS DE LA API =====
console.log('🔍 Configurando rutas...');

try {
  // Rutas de autenticación
  const authRoutes = require('./routes/authRoutes');
  app.use('/api/auth', authRoutes);
  console.log('✅ authRoutes configuradas');

  // Rutas de juego 
  const gameRoutes = require('./routes/juegoRoutes');
  app.use('/api/game', gameRoutes);
  console.log('✅ gameRoutes configuradas');

  // Rutas de usuario
  const usuarioRoutes = require('./routes/usuarioRoutes');
  app.use('/api/usuario', usuarioRoutes);
  console.log('✅ usuarioRoutes configuradas');

  // Rutas de estadísticas
  const estadisticasRoutes = require('./routes/estadisticasRoutes');
  app.use('/api/estadisticas', estadisticasRoutes);
  console.log('✅ estadisticasRoutes configuradas');

} catch (error) {
  console.error('❌ Error configurando rutas:', error.message);
  process.exit(1); // Salir si hay error crítico
}

// ===== CATCH-ALL PARA SPA (AL FINAL) =====
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});
console.log('✅ Catch-all configurado');

// ===== MANEJO DE ERRORES GLOBAL =====
app.use((error, req, res, next) => {
  console.error('❌ Error:', error.message);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Algo salió mal'
  });
});

// ===== INICIAR SERVIDOR =====
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log('🔗 Rutas API disponibles:');
  console.log('   POST /api/auth/login');
  console.log('   POST /api/auth/register'); 
  console.log('   GET  /api/auth/estadisticas/:id');
  console.log('   POST /api/game/guardar-intento');
  console.log('   GET  /api/usuario/');
  console.log('   GET  /api/estadisticas/ranking');
  console.log('   GET  /api/estadisticas/jugador/:id');
  console.log('   POST /api/estadisticas/actualizar');
  console.log('   GET  /api/estadisticas/top/:cantidad');
});
