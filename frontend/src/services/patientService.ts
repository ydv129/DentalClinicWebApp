import api from './api';
import { ApiResponse, Patient } from '../types';

export const patientService = {
  async getProfile() {
    const response = await api.get<ApiResponse<Patient>>('/patients/profile');
    return response.data;
  },

  async updateProfile(data: Partial<Patient>) {
    const response = await api.put<ApiResponse<Patient>>('/patients/profile', data);
    return response.data;
  }
};