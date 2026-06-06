import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth/';

export const login = async (email: string, password: string) => {
  const response = await axios.post(API_URL + 'login', { email, password });
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const register = async (username: string, email: string, password: string, role: string) => {
  return axios.post(API_URL + 'register', { username, email, password, role });
};

export const logout = () => {
  localStorage.removeItem('user');
};
