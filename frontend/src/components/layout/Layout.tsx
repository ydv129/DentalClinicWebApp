import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, User, LogOut, Menu, X, Stethoscope, Users } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../utils';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isDoctor = user?.role === 'doctor' || user?.isAdmin;

  const patientNav = [
    { path: '/app', label: 'Dashboard', icon: Calendar },
    { path: '/app/patient/appointments', label: 'My Appointments', icon: Calendar },
    { path: '/app/patient/book', label: 'Book Appointment', icon: Calendar }
  ];

  const doctorAdminNav = [
    { path: '/app/doctor', label: 'Dashboard', icon: Stethoscope },
    { path: '/app/doctor/appointments', label: 'Appointments', icon: Calendar },
    { path: '/app/doctor/manage', label: 'Manage Doctors', icon: Users }
  ];

  const nav = isDoctor ? doctorAdminNav : patientNav;

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 z-0">
        <img src="/background/bg.jpg" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-white/30" />
      </div>
      <div className="relative z-10">
      <header className="bg-[#FBF0D9] border-b border-stone-300 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <Link to="/" className="flex items-center gap-2">
                <div className="h-9 w-9 bg-teal-600 rounded-lg flex items-center justify-center">
                  <Stethoscope className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-700 hidden sm:block">DentalCare</span>
              </Link>
            </div>

            <nav className="hidden lg:flex items-center gap-1">
              {nav.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    location.pathname === item.path
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-500" />
                </div>
                <span className="text-sm font-medium text-gray-600 hidden sm:block">
                  {user?.isAdmin ? 'Admin' : user?.role === 'doctor' ? 'Dr. Doctor' : 'Patient'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FBF0D9] border-b border-stone-300">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  location.pathname === item.path
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-gray-500 hover:bg-gray-100'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
      </div>
    </div>
  );
}