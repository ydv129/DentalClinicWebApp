import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser, setTokens } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const initialRole = searchParams.get('role') === 'doctor' ? 'doctor' : 'patient';
  
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    gender: 'male',
    role: initialRole
  });
  const [doctorFields, setDoctorFields] = useState({
    specialization: 'General Dentistry',
    licenseNumber: '',
    experience: '',
    consultationFee: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.firstName.trim()) {
      toast.error('Please enter your first name');
      return;
    }
    if (!form.lastName.trim()) {
      toast.error('Please enter your last name');
      return;
    }
    if (!form.email.trim() || !form.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (!form.phone.trim() || form.phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }
    if (!form.password || form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (form.role === 'patient') {
      if (!form.dateOfBirth) {
        toast.error('Please select your date of birth');
        return;
      }
      if (!form.gender) {
        toast.error('Please select your gender');
        return;
      }
    }
    
    if (form.role === 'doctor') {
      if (!doctorFields.licenseNumber?.trim()) {
        toast.error('Please enter your license number');
        return;
      }
      if (!doctorFields.experience || doctorFields.experience === '0') {
        toast.error('Please enter your experience in years');
        return;
      }
      if (!doctorFields.consultationFee) {
        toast.error('Please enter your consultation fee');
        return;
      }
    }
    
    setLoading(true);
    
    try {
      const payload: Record<string, string> = {
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        role: form.role,
        gender: form.gender
      };
      
      if (form.role === 'patient') {
        payload.dateOfBirth = form.dateOfBirth;
      } else {
        if (!doctorFields.licenseNumber || !doctorFields.experience || !doctorFields.consultationFee) {
          toast.error('Please fill all doctor fields: license number, experience, and consultation fee');
          setLoading(false);
          return;
        }
        payload.licenseNumber = doctorFields.licenseNumber;
        payload.experience = doctorFields.experience;
        payload.consultationFee = doctorFields.consultationFee;
        payload.specialization = doctorFields.specialization;
      }
      
      const response = await authService.register(payload);
      
      if (response.success && response.data) {
        if (form.role === 'doctor') {
          toast.info('Registration submitted. Awaiting admin verification.');
          navigate('/login');
        } else {
          setUser(response.data.user);
          setTokens(response.data.accessToken, response.data.refreshToken);
          toast.success('Registration successful');
          navigate('/app');
        }
      } else {
        toast.error(response.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

  const roleOptions = [
    { value: 'patient', label: 'Patient' },
    { value: 'doctor', label: 'Doctor' }
  ];

  const specOptions = [
    { value: 'General Dentistry', label: 'General Dentistry' },
    { value: 'Orthodontist', label: 'Orthodontist' },
    { value: 'Oral Surgeon', label: 'Oral Surgeon' },
    { value: 'Periodontist', label: 'Periodontist' },
    { value: 'Endodontist', label: 'Endodontist' },
    { value: 'Pediatric Dentist', label: 'Pediatric Dentist' }
  ];

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <div className="fixed inset-0 z-0">
        <img src="/background/bg.jpg" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-white/30" />
      </div>
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-700">Create Account</h1>
          <p className="text-gray-500 mt-1">Join DentalCare today</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 relative z-10">
          <div className="space-y-4">
            <Select
              id="role"
              label="Register as"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              options={roleOptions}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="firstName"
                label="First Name"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                placeholder="John"
                required
              />
              <Input
                id="lastName"
                label="Last Name"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                placeholder="Doe"
                required
              />
            </div>
            
            <Input
              id="email"
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="john@example.com"
              required
            />
            
            <Input
              id="phone"
              label="Phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+1 234 567 8900"
              required
            />
            
            {form.role === 'patient' && (
              <>
                <Input
                  id="dateOfBirth"
                  label="Date of Birth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                  required
                />
                <Select
                  id="gender"
                  label="Gender"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  options={genderOptions}
                />
              </>
            )}
            
            {form.role === 'doctor' && (
              <>
                <Select
                  id="specialization"
                  label="Specialization"
                  value={doctorFields.specialization}
                  onChange={(e) => setDoctorFields({ ...doctorFields, specialization: e.target.value })}
                  options={specOptions}
                />
                <Input
                  id="licenseNumber"
                  label="License Number"
                  value={doctorFields.licenseNumber}
                  onChange={(e) => setDoctorFields({ ...doctorFields, licenseNumber: e.target.value })}
                  placeholder="DOC12345"
                  required
                />
                <Input
                  id="experience"
                  label="Experience (years)"
                  type="number"
                  value={doctorFields.experience}
                  onChange={(e) => setDoctorFields({ ...doctorFields, experience: e.target.value })}
                  placeholder="5"
                />
                <Input
                  id="consultationFee"
                  label="Consultation Fee ($)"
                  type="number"
                  value={doctorFields.consultationFee}
                  onChange={(e) => setDoctorFields({ ...doctorFields, consultationFee: e.target.value })}
                  placeholder="100"
                />
              </>
            )}
            
            <Input
              id="password"
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Create a password"
              required
            />
            
            <Input
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="Confirm your password"
              required
            />
          </div>

          <Button type="submit" loading={loading} className="w-full mt-6">
            {form.role === 'doctor' ? 'Submit for Verification' : 'Create Account'}
          </Button>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-600 hover:text-teal-700 font-medium">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}