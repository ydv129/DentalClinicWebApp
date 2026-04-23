import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { appointmentService } from '../../services/appointmentService';
import { formatDate, formatTime } from '../../utils';
import { Appointment, AppointmentStatus } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import Spinner from '../../components/common/Spinner';

const statusVariant: Record<AppointmentStatus, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  scheduled: 'info',
  confirmed: 'info',
  in_progress: 'warning',
  completed: 'success',
  cancelled: 'danger',
  no_show: 'danger'
};

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const response = await appointmentService.getAppointments({ limit: 5 });
      if (response.success && response.data) {
        setAppointments(response.data.appointments);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'scheduled' || a.status === 'confirmed'
  );

  if (loading) return <Spinner className="min-h-[400px]" />;

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Manage your dental appointments</p>
        </div>
        <Link to="/app/patient/book">
          <Button>Book Appointment</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-primary-100 rounded-lg">
            <Calendar className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{upcomingAppointments.length}</p>
            <p className="text-sm text-gray-500">Upcoming</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <Clock className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {appointments.filter((a) => a.status === 'completed').length}
            </p>
            <p className="text-sm text-gray-500">Completed</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-red-100 rounded-lg">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {appointments.filter((a) => a.status === 'cancelled').length}
            </p>
            <p className="text-sm text-gray-500">Cancelled</p>
          </div>
        </Card>
      </div>

      <Card title="Recent Appointments">
        {appointments.length === 0 ? (
          <EmptyState
            title="No appointments yet"
            description="Book your first appointment to get started"
            action={
              <Link to="/app/patient/book">
                <Button>Book Appointment</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => {
              const doctor = appointment.doctorId as unknown as { firstName?: string; lastName?: string; specialization?: string };
              return (
                <div
                  key={appointment._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-gray-50 gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">
                        Dr. {doctor?.firstName} {doctor?.lastName}
                      </h4>
                      <Badge variant={statusVariant[appointment.status]}>{appointment.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-500">{doctor?.specialization}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(appointment.appointmentDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatTime(appointment.appointmentTime)}
                      </span>
                    </div>
                  </div>
                  <Link to={`/patient/appointments?id=${appointment._id}`}>
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}