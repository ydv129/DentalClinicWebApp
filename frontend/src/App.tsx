import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Landing from './pages/Landing';
import PatientDashboard from './pages/patient/Dashboard';
import PatientAppointments from './pages/patient/Appointments';
import BookAppointment from './pages/patient/BookAppointment';
import DoctorDashboard from './pages/doctor/Dashboard';
import DoctorAppointments from './pages/doctor/Appointments';
import { useAuthStore } from './store/authStore';

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: 'patient' | 'doctor' }) {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/app" replace />;
  
  return <>{children}</>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();
  
  if (isAuthenticated) {
    if (user?.role === 'doctor' || user?.isAdmin) {
      return <Navigate to="/app/doctor" replace />;
    }
    return <Navigate to="/app" replace />;
  }
  
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
        
        <Route path="/app" element={<Layout />}>
          <Route index element={
            <ProtectedRoute>
              <PatientDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="patient/appointments" element={
            <ProtectedRoute role="patient">
              <PatientAppointments />
            </ProtectedRoute>
          } />
          <Route path="patient/book" element={
            <ProtectedRoute role="patient">
              <BookAppointment />
            </ProtectedRoute>
          } />
          
          <Route path="doctor" element={
            <ProtectedRoute role="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          } />
          <Route path="doctor/appointments" element={
            <ProtectedRoute role="doctor">
              <DoctorAppointments />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}