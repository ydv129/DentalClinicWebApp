import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { appointmentService } from '../../services/appointmentService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Spinner from '../../components/common/Spinner';

const appointmentTypes = [
  { value: 'checkup', label: 'Checkup' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'filling', label: 'Filling' },
  { value: 'extraction', label: 'Extraction' },
  { value: 'root_canal', label: 'Root Canal' },
  { value: 'crown', label: 'Crown' },
  { value: 'whitening', label: 'Whitening' },
  { value: 'implant', label: 'Implant' },
  { value: 'orthodontic', label: 'Orthodontic' },
  { value: 'emergency', label: 'Emergency' }
];

const doctors = [
  { id: '1', name: 'Dr. John Smith', specialization: 'General Dentistry' },
  { id: '2', name: 'Dr. Sarah Johnson', specialization: 'Orthodontist' },
  { id: '3', name: 'Dr. Michael Brown', specialization: 'Oral Surgeon' }
];

export default function BookAppointment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    type: 'checkup',
    symptoms: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!form.doctorId) {
        toast.error('Please select a doctor');
        setLoading(false);
        return;
      }
      if (!form.appointmentDate) {
        toast.error('Please select a date');
        setLoading(false);
        return;
      }
      if (!form.appointmentTime) {
        toast.error('Please select a time slot');
        setLoading(false);
        return;
      }
      
      const response = await appointmentService.bookAppointment(form);
      if (response.success) {
        toast.success('Appointment booked successfully');
        navigate('/app/patient/appointments');
      } else {
        toast.error(response.message || 'Something went wrong. Please try again.');
      }
    } catch (error: any) {
      const message = error?.response?.data?.message;
      if (message) {
        toast.error(message);
      } else {
        toast.error('Unable to book appointment. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date: string) => {
    setForm({ ...form, appointmentDate: date, appointmentTime: '' });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>
        <p className="text-gray-500">Schedule a new appointment</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6">
        <div className="space-y-5">
          <Select
            id="doctor"
            label="Select Doctor"
            value={form.doctorId}
            onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
            options={[
              { value: '', label: 'Choose a doctor' },
              ...doctors.map((d) => ({ value: d.id, label: `${d.name} - ${d.specialization}` }))
            ]}
            required
          />

          <Input
            id="date"
            label="Appointment Date"
            type="date"
            value={form.appointmentDate}
            onChange={(e) => handleDateChange(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
          />

          {form.appointmentDate && (
            <Select
              id="time"
              label="Appointment Time"
              value={form.appointmentTime}
              onChange={(e) => setForm({ ...form, appointmentTime: e.target.value })}
              options={[
                { value: '', label: 'Select time' },
                { value: '09:00', label: '9:00 AM' },
                { value: '09:30', label: '9:30 AM' },
                { value: '10:00', label: '10:00 AM' },
                { value: '10:30', label: '10:30 AM' },
                { value: '11:00', label: '11:00 AM' },
                { value: '11:30', label: '11:30 AM' },
                { value: '14:00', label: '2:00 PM' },
                { value: '14:30', label: '2:30 PM' },
                { value: '15:00', label: '3:00 PM' },
                { value: '15:30', label: '3:30 PM' },
                { value: '16:00', label: '4:00 PM' },
                { value: '16:30', label: '4:30 PM' }
              ]}
              required
            />
          )}

          <Select
            id="type"
            label="Appointment Type"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            options={appointmentTypes}
            required
          />

          <Input
            id="symptoms"
            label="Describe your symptoms (optional)"
            value={form.symptoms}
            onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
            placeholder="Describe what you're experiencing"
          />
        </div>

        <div className="flex gap-3 mt-6">
          <Link to="/patient/appointments" className="flex-1">
            <Button type="button" variant="secondary" className="w-full">
              Cancel
            </Button>
          </Link>
          <Button type="submit" loading={loading} className="flex-1">
            Book Appointment
          </Button>
        </div>
      </form>
    </div>
  );
}