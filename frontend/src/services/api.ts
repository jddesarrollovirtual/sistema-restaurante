import axios from 'axios';
import { io } from 'socket.io-client';

// Usa la variable de entorno configurada en Vercel o la URL de producción (ROOT del backend)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://sistema-restaurante-backend-s9ru.onrender.com';

// Cliente Axios centralizado
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Cliente Socket.io centralizado - intentar conectar a la raíz
export const socket = io(API_BASE_URL, {
  transports: ['websocket', 'polling'],
  path: '/socket.io'
});
