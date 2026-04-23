import api from './api';
import { AuthResponse } from '../types';

export const authService = {
  async register(data: Record<string, string>) {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  async login(email: string, password: string) {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  },

  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  async refreshToken(refreshToken: string) {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  }
};