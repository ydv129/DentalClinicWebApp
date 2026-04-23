import api from './api';
import { ApiResponse, Appointment } from '../types';

interface PaginatedResponse<T> {
  appointments: T[];
  total: number;
  page: number;
  pages: number;
}

interface AppointmentQuery {
  status?: string;
  page?: number;
  limit?: number;
}

export const appointmentService = {
  async getAppointments(query?: AppointmentQuery) {
    const response = await api.get<ApiResponse<PaginatedResponse<Appointment>>>('/appointments', { params: query });
    return response.data;
  },

  async getAppointment(id: string) {
    const response = await api.get<ApiResponse<Appointment>>(`/appointments/${id}`);
    return response.data;
  },

  async bookAppointment(data: {
    doctorId: string;
    appointmentDate: string;
    appointmentTime: string;
    type: string;
    symptoms?: string;
  }) {
    const response = await api.post<ApiResponse<Appointment>>('/appointments', data);
    return response.data;
  },

  async cancelAppointment(id: string, reason?: string) {
    const response = await api.put<ApiResponse<Appointment>>(`/appointments/${id}/cancel`, { reason });
    return response.data;
  },

  async rescheduleAppointment(id: string, appointmentDate: string, appointmentTime: string) {
    const response = await api.put<ApiResponse<Appointment>>(`/appointments/${id}/reschedule`, {
      appointmentDate,
      appointmentTime
    });
    return response.data;
  },

  async getAvailableSlots(doctorId: string, date: string) {
    const response = await api.get<ApiResponse<string[]>>('/appointments/available-slots', {
      params: { doctorId, date }
    });
    return response.data;
  }
};