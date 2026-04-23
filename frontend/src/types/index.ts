export interface User {
  id: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  isAdmin?: boolean;
  isVerified?: boolean;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface Patient {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address?: string;
  medicalHistory?: string;
  allergies?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Doctor {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  specialization: string;
  licenseNumber: string;
  experience: number;
  consultationFee: number;
  availableDays: string[];
  availableTimeStart: string;
  availableTimeEnd: string;
  bio?: string;
  isAdmin?: boolean;
  isVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  _id: string;
  patientId: string | Patient;
  doctorId: string | Doctor;
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  type: AppointmentType;
  status: AppointmentStatus;
  notes?: string;
  symptoms?: string;
  diagnosis?: string;
  prescription?: string;
  fees: number;
  cancellationReason?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type AppointmentType =
  | 'checkup'
  | 'cleaning'
  | 'filling'
  | 'extraction'
  | 'root_canal'
  | 'crown'
  | 'whitening'
  | 'implant'
  | 'orthodontic'
  | 'emergency';

export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}