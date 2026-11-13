const http = require('http');
const dotenv = require('dotenv');
const path = require('path');

// Cargar siempre el .env del backend, aunque el proceso se inicie desde otro directorio.
dotenv.config({ path: path.resolve(__dirname, '../.env') });

if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'replace-with-a-long-random-secret') {
  throw new Error('Configurá un JWT_SECRET propio en backend/.env antes de iniciar el servidor.');
}

const app = require('./app');
const connectDB = require('./config/db');
const { Server } = require('socket.io');
const initRouteSockets = require('./sockets/routeSocket');

const PORT = process.env.PORT || 5000;

// Conectar con MongoDB
connectDB();

// Servidor HTTP conjunto para Express y Socket.io
const server = http.createServer(app);

// Inicialización de Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  },
});

// Configurar salas y eventos en tiempo real
initRouteSockets(io);

server.listen(PORT, () => {
  console.log(`🚀 [Rutex Backend] Servidor ejecutándose en el puerto ${PORT}`);
  console.log(`📡 [WebSockets] Socket.io listo para conexiones`);
});
