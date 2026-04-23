import { Calendar, Clock, Users, DollarSign } from 'lucide-react';
import { useEffect, useState } from 'react';
import { doctorService } from '../../services/doctorService';
import { appointmentService } from '../../services/appointmentService';
import { Appointment } from '../../types';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({ today: 0, upcoming: 0, completed: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [aptResponse] = await Promise.all([
        appointmentService.getAppointments({ limit: 10 }),
        doctorService.getAppointments()
      ]);

      if (aptResponse.success && aptResponse.data) {
        setAppointments(aptResponse.data.appointments);
        const today = new Date().toDateString();
        setStats({
          today: aptResponse.data.appointments.filter(
            (a) => new Date(a.appointmentDate).toDateString() === today
          ).length,
          upcoming: aptResponse.data.appointments.filter(
            (a) => a.status === 'scheduled' || a.status === 'confirmed'
          ).length,
          completed: aptResponse.data.appointments.filter((a) => a.status === 'completed')
            .length,
          revenue: aptResponse.data.appointments.reduce((sum, a) => sum + (a.fees || 0), 0)
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner className="min-h-[400px]" />;

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
        <p className="text-gray-500">Manage your appointments</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-primary-100 rounded-lg">
            <Calendar className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.today}</p>
            <p className="text-sm text-gray-500">Today's Appointments</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Clock className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.upcoming}</p>
            <p className="text-sm text-gray-500">Upcoming</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            <p className="text-sm text-gray-500">Completed</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-yellow-100 rounded-lg">
            <DollarSign className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">${stats.revenue}</p>
            <p className="text-sm text-gray-500">Total Revenue</p>
          </div>
        </Card>
      </div>

      <Card title="Today's Appointments">
        {appointments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No appointments scheduled</p>
        ) : (
          <div className="space-y-4">
            {appointments.slice(0, 5).map((appointment) => {
              const patient = appointment.patientId as unknown as { firstName?: string; lastName?: string; phone?: string };
              return (
                <div
                  key={appointment._id}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {patient?.firstName} {patient?.lastName}
                    </h4>
                    <p className="text-sm text-gray-500">{patient?.phone}</p>
                    <p className="text-sm text-gray-500">{appointment.appointmentTime}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {appointment.type.replace('_', ' ')}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">{appointment.status}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}