import api from './api';
import { ApiResponse, Doctor, Appointment } from '../types';

interface PaginatedResponse<T> {
  appointments: T[];
  total: number;
  page: number;
  pages: number;
}

interface ReportQuery {
  startDate?: string;
  endDate?: string;
  format?: 'pdf' | 'excel';
  status?: string;
}

export const doctorService = {
  async getProfile() {
    const response = await api.get<ApiResponse<Doctor>>('/doctors/profile');
    return response.data;
  },

  async updateProfile(data: Partial<Doctor>) {
    const response = await api.put<ApiResponse<Doctor>>('/doctors/profile', data);
    return response.data;
  },

  async getAppointments(query?: { status?: string; date?: string; page?: number; limit?: number }) {
    const response = await api.get<ApiResponse<PaginatedResponse<Appointment>>>('/doctors/appointments', {
      params: query
    });
    return response.data;
  },

  async updateAppointmentStatus(
    id: string,
    data: {
      status: string;
      notes?: string;
      diagnosis?: string;
      prescription?: string;
      fees?: number;
    }
  ) {
    const response = await api.put<ApiResponse<Appointment>>(`/doctors/appointments/${id}`, data);
    return response.data;
  },

  async generateReport(query: ReportQuery) {
    const response = await api.get('/doctors/report', {
      params: query,
      responseType: 'blob'
    });
    return response;
  }
};