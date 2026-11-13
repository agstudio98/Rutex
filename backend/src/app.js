const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const incidenceRoutes = require('./routes/incidenceRoutes');
const routeRoutes = require('./routes/routeRoutes');

const app = express();

// Middlewares globales
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint de salud
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    app: 'Rutex API',
    timestamp: new Date().toISOString(),
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/incidences', incidenceRoutes);
app.use('/api/routes', routeRoutes);

// Manejo de ruta no encontrada (404)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.originalUrl}`,
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('[Global Error Handler]:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
  });
});

module.exports = app;
