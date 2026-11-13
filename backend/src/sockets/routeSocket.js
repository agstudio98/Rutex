const RouteSession = require('../models/RouteSession');

/**
 * Manejador de eventos en tiempo real para salas de trayecto con Socket.io
 * @param {import('socket.io').Server} io
 */
const initRouteSockets = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket] Cliente conectado: ${socket.id}`);

    // Unirse a la sala de una sesión de trayecto específica
    socket.on('join_route', ({ sessionId, userName, role = 'companion' }) => {
      if (!sessionId) {
        return socket.emit('error', { message: 'sessionId es obligatorio' });
      }

      const roomName = `route_${sessionId}`;
      socket.join(roomName);
      console.log(`[Socket] ${socket.id} (${userName || 'Anónimo'}) se unió a ${roomName}`);

      // Notificar a todos en la sala sobre el nuevo acompañante
      io.to(roomName).emit('companion_joined', {
        socketId: socket.id,
        userName,
        role,
        timestamp: new Date(),
      });
    });

    // Salir de la sala del trayecto
    socket.on('leave_route', ({ sessionId, userName }) => {
      if (!sessionId) return;
      const roomName = `route_${sessionId}`;
      socket.leave(roomName);
      console.log(`[Socket] ${socket.id} salió de ${roomName}`);

      io.to(roomName).emit('companion_left', {
        socketId: socket.id,
        userName,
        timestamp: new Date(),
      });
    });

    // Actualización de ubicación en tiempo real
    socket.on('location_update', async (data) => {
      try {
        const { sessionId, latitude, longitude, speed, heading } = data;

        if (!sessionId || latitude === undefined || longitude === undefined) {
          return socket.emit('error', {
            message: 'Datos insuficientes en location_update',
          });
        }

        const roomName = `route_${sessionId}`;

        // Reenviar coordenadas inmediatamente a los contactos conectados a la sala
        io.to(roomName).emit('route_location_updated', {
          sessionId,
          latitude,
          longitude,
          speed: speed || 0,
          heading: heading || 0,
          timestamp: new Date().toISOString(),
        });

        // Actualizar en base de datos de manera asíncrona
        await RouteSession.findByIdAndUpdate(sessionId, {
          currentLocation: {
            type: 'Point',
            coordinates: [Number(longitude), Number(latitude)],
          },
        });
      } catch (err) {
        console.error('[Socket location_update Error]:', err.message);
      }
    });

    // Disparo de alerta de emergencia
    socket.on('emergency_alert', async (data) => {
      try {
        const { sessionId, reason, latitude, longitude } = data;

        if (!sessionId) {
          return socket.emit('error', { message: 'sessionId requerido para alerta' });
        }

        const roomName = `route_${sessionId}`;
        const alertTimestamp = new Date();

        // Actualizar estado en la base de datos a 'alert'
        const updatedSession = await RouteSession.findByIdAndUpdate(
          sessionId,
          {
            status: 'alert',
            alertDetails: {
              triggeredAt: alertTimestamp,
              reason: reason || 'Alerta de pánico activada desde la app',
            },
            ...(latitude !== undefined && longitude !== undefined
              ? {
                  currentLocation: {
                    type: 'Point',
                    coordinates: [Number(longitude), Number(latitude)],
                  },
                }
              : {}),
          },
          { new: true }
        );

        console.warn(`[EMERGENCIA] Alerta activada en la ruta: ${sessionId}`);

        // Emitir alerta a todos los acompañantes/contactos en la sala
        io.to(roomName).emit('route_emergency_alert', {
          sessionId,
          status: 'alert',
          reason: reason || 'Alerta de pánico activada',
          location: latitude && longitude ? { latitude, longitude } : null,
          timestamp: alertTimestamp.toISOString(),
          session: updatedSession,
        });
      } catch (err) {
        console.error('[Socket emergency_alert Error]:', err.message);
      }
    });

    // Finalización de ruta
    socket.on('finish_route', async ({ sessionId }) => {
      try {
        if (!sessionId) return;
        const roomName = `route_${sessionId}`;

        await RouteSession.findByIdAndUpdate(sessionId, {
          status: 'completed',
        });

        io.to(roomName).emit('route_completed', {
          sessionId,
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        console.error('[Socket finish_route Error]:', err.message);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Cliente desconectado: ${socket.id}`);
    });
  });
};

module.exports = initRouteSockets;
