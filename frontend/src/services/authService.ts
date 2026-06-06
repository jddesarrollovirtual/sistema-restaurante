import { apiClient } from './api';

export const login = async (email: string, password: string) => {
  const response = await apiClient.post('/api/auth/login', { email, password });
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const register = async (username: string, email: string, password: string, role: string) => {
  return apiClient.post('/api/auth/register', { username, email, password, role });
};

export const logout = () => {
  localStorage.removeItem('user');
};
