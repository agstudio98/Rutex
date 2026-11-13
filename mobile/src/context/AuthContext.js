import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/api';
import { socketService } from '../services/socket';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcomeGuide, setShowWelcomeGuide] = useState(false);

  // Cargar sesión guardada al iniciar la app
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('@rutex_token');
        const storedUser = await AsyncStorage.getItem('@rutex_user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('[AuthContext] Error recuperando sesión:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  // Iniciar sesión
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const { token: receivedToken, user: receivedUser } = response.data;

      setToken(receivedToken);
      setUser(receivedUser);
      setShowWelcomeGuide(true);

      await AsyncStorage.setItem('@rutex_token', receivedToken);
      await AsyncStorage.setItem('@rutex_user', JSON.stringify(receivedUser));

      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Error al iniciar sesión. Verifica tus datos.';
      return { success: false, message };
    }
  };

  const loginWithGoogle = async (idToken) => {
    try {
      const response = await authService.loginWithGoogle(idToken);
      const { token: receivedToken, user: receivedUser } = response.data;
      setToken(receivedToken);
      setUser(receivedUser);
      setShowWelcomeGuide(true);
      await AsyncStorage.setItem('@rutex_token', receivedToken);
      await AsyncStorage.setItem('@rutex_user', JSON.stringify(receivedUser));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'No se pudo validar tu cuenta de Google.',
      };
    }
  };

  // Registrarse
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      const { token: receivedToken, user: receivedUser } = response.data;

      setToken(receivedToken);
      setUser(receivedUser);
      setShowWelcomeGuide(true);

      await AsyncStorage.setItem('@rutex_token', receivedToken);
      await AsyncStorage.setItem('@rutex_user', JSON.stringify(receivedUser));

      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Error al registrarse. Intenta nuevamente.';
      return { success: false, message };
    }
  };

  // Cerrar sesión
  const logout = async () => {
    setToken(null);
    setUser(null);
    setShowWelcomeGuide(false);
    socketService.disconnect();

    try {
      await Promise.all([
        AsyncStorage.removeItem('@rutex_token'),
        AsyncStorage.removeItem('@rutex_user'),
      ]);
    } catch (error) {
      console.error('[AuthContext] Error al cerrar sesión:', error);
    }
  };

  // Actualizar datos del perfil
  const refreshProfile = async () => {
    try {
      const response = await authService.getProfile();
      if (response.data?.user) {
        setUser(response.data.user);
        await AsyncStorage.setItem('@rutex_user', JSON.stringify(response.data.user));
      }
    } catch (error) {
      console.warn('[AuthContext] No se pudo actualizar perfil:', error.message);
    }
  };

  // Actualizar perfil y configuraciones en backend y almacenamiento local
  const updateProfileAndSettings = async (updates) => {
    try {
      const response = await authService.updateProfile(updates);
      if (response.data?.user) {
        setUser(response.data.user);
        await AsyncStorage.setItem('@rutex_user', JSON.stringify(response.data.user));
        return { success: true, user: response.data.user };
      }
    } catch (error) {
      console.warn('[AuthContext] Error actualizando en backend, aplicando fallback local:', error.message);
      const updatedUser = {
        ...user,
        ...updates,
        settings: {
          ...(user?.settings || {}),
          ...(updates.settings || {}),
        },
      };
      setUser(updatedUser);
      await AsyncStorage.setItem('@rutex_user', JSON.stringify(updatedUser));
      return { success: true, localOnly: true, user: updatedUser };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token,
        showWelcomeGuide,
        dismissWelcomeGuide: () => setShowWelcomeGuide(false),
        login,
        loginWithGoogle,
        register,
        logout,
        refreshProfile,
        updateProfileAndSettings,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
