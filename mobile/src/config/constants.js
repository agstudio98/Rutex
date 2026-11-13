import { Platform } from 'react-native';

// Para probar en dispositivo físico con Expo Go (misma red Wi-Fi),
// definí la IP local de tu PC (ej: '192.168.1.50'). Si es null, usa emulador/simulador.
export const DEV_MACHINE_IP = null;

export const SERVER_HOST = DEV_MACHINE_IP
  ? `http://${DEV_MACHINE_IP}:5000`
  : Platform.OS === 'android'
  ? 'http://10.0.2.2:5000'
  : 'http://localhost:5000';

export const API_BASE_URL = `${SERVER_HOST}/api`;
export const SOCKET_URL = SERVER_HOST;

export const INCIDENT_TYPES = [
  {
    id: 'sin_luz',
    label: 'Sin luz / Falla lumínica',
    color: '#EAB308',
    description: 'Postes apagados o visibilidad muy baja',
  },
  {
    id: 'sospechoso',
    label: 'Actividad sospechosa',
    color: '#F97316',
    description: 'Personas o vehículos merodeando',
  },
  {
    id: 'arrebatos',
    label: 'Zona de robos / Arrebatos',
    color: '#EF4444',
    description: 'Hechos recurrentes en la cuadra',
  },
  {
    id: 'zona_peligrosa',
    label: 'Punto inseguro',
    color: '#DC2626',
    description: 'Esquina o pasaje peligroso',
  },
  {
    id: 'accidente',
    label: 'Accidente o corte',
    color: '#3B82F6',
    description: 'Tránsito interrumpido o riesgo vial',
  },
  {
    id: 'otro',
    label: 'Otro reporte',
    color: '#6B7280',
    description: 'Cualquier otra advertencia comunitaria',
  },
];

export const DEFAULT_MAP_DELTA = {
  latitudeDelta: 0.015,
  longitudeDelta: 0.015,
};
