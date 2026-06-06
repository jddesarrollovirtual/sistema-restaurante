import axios from 'axios';
import { io } from 'socket.io-client';

// Usa la variable de entorno configurada en Vercel o la URL de producción
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://sistema-restaurante-backend-s9ru.onrender.com';

// Cliente Axios centralizado
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Helper para obtener el token
const getToken = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user).token : null;
};

// Interceptor para añadir el token automáticamente
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Cliente Socket.io centralizado
export const socket = io(API_BASE_URL);
