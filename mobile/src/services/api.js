import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar token JWT automáticamente
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@rutex_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('Error leyendo token de AsyncStorage:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Endpoints de autenticación
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  loginWithGoogle: (idToken) => api.post('/auth/google', { idToken }),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  addContact: (contactEmail) => api.post('/auth/contacts', { contactEmail }),
};

// Endpoints de trayectos
export const routeService = {
  createSession: (origin, destination) =>
    api.post('/routes', { origin, destination }),
  getSessionById: (id) => api.get(`/routes/${id}`),
  updateStatus: (id, status, reason) =>
    api.patch(`/routes/${id}/status`, { status, reason }),
  getCurrentActive: () => api.get('/routes/active/current'),
};

// Endpoints de incidencias
export const incidenceService = {
  create: (data) => api.post('/incidences', data),
  getNearby: (lat, lng, distance = 5000) =>
    api.get(`/incidences/nearby?lat=${lat}&lng=${lng}&distance=${distance}`),
  getAll: () => api.get('/incidences'),
};

export default api;
