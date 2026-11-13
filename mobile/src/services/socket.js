import { io } from 'socket.io-client';
import { SOCKET_URL } from '../config/constants';

let socket = null;

export const socketService = {
  // Conectar al servidor Socket.io
  connect: () => {
    if (!socket) {
      socket = io(SOCKET_URL, {
        transports: ['websocket'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socket.on('connect', () => {
        console.log('[Socket Cliente] Conectado al servidor con ID:', socket.id);
      });

      socket.on('disconnect', (reason) => {
        console.log('[Socket Cliente] Desconectado:', reason);
      });

      socket.on('connect_error', (error) => {
        console.warn('[Socket Cliente] Error de conexión:', error.message);
      });
    }
    return socket;
  },

  // Obtener la instancia actual
  getSocket: () => socket,

  // Unirse a la sala de trayecto
  joinRoute: (sessionId, userName, role = 'user') => {
    if (socket) {
      socket.emit('join_route', { sessionId, userName, role });
    }
  },

  // Salir de la sala
  leaveRoute: (sessionId, userName) => {
    if (socket) {
      socket.emit('leave_route', { sessionId, userName });
    }
  },

  // Emitir actualización de ubicación en tiempo real
  emitLocationUpdate: (sessionId, latitude, longitude, speed = 0, heading = 0) => {
    if (socket && socket.connected) {
      socket.emit('location_update', {
        sessionId,
        latitude,
        longitude,
        speed,
        heading,
      });
    }
  },

  // Disparar alerta de emergencia / pánico
  emitEmergencyAlert: (sessionId, reason, latitude, longitude) => {
    if (socket && socket.connected) {
      socket.emit('emergency_alert', {
        sessionId,
        reason,
        latitude,
        longitude,
      });
    }
  },

  // Notificar fin de ruta
  emitFinishRoute: (sessionId) => {
    if (socket && socket.connected) {
      socket.emit('finish_route', { sessionId });
    }
  },

  // Escuchar actualización de ubicación de acompañante/usuario
  onLocationUpdated: (callback) => {
    if (socket) {
      socket.on('route_location_updated', callback);
    }
  },

  // Escuchar alerta de emergencia
  onEmergencyAlert: (callback) => {
    if (socket) {
      socket.on('route_emergency_alert', callback);
    }
  },

  // Escuchar cuando un contacto se une
  onCompanionJoined: (callback) => {
    if (socket) {
      socket.on('companion_joined', callback);
    }
  },

  // Desuscribir oyentes de eventos de ruta
  cleanRouteListeners: () => {
    if (socket) {
      socket.off('route_location_updated');
      socket.off('route_emergency_alert');
      socket.off('companion_joined');
      socket.off('companion_left');
      socket.off('route_completed');
    }
  },

  // Desconectar socket
  disconnect: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },
};
