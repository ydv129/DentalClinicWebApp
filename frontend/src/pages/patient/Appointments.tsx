import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { appointmentService } from '../../services/appointmentService';
import { formatDate, formatTime } from '../../utils';
import { Appointment, AppointmentStatus } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';

const statusVariant: Record<AppointmentStatus, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  scheduled: 'info',
  confirmed: 'info',
  in_progress: 'warning',
  completed: 'success',
  cancelled: 'danger',
  no_show: 'danger'
};

export default function PatientAppointments() {
  const [searchParams] = useSearchParams();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      loadAppointment(id);
    }
    loadAppointments();
  }, [searchParams]);

  const loadAppointment = async (id: string) => {
    try {
      const response = await appointmentService.getAppointment(id);
      if (response.success && response.data) {
        setSelectedAppointment(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadAppointments = async () => {
    try {
      const response = await appointmentService.getAppointments();
      if (response.success && response.data) {
        setAppointments(response.data.appointments);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!selectedAppointment) return;
    setActionLoading(true);
    try {
      const response = await appointmentService.cancelAppointment(selectedAppointment._id, cancelReason);
      if (response.success) {
        toast.success('Appointment cancelled');
        setCancelModalOpen(false);
        loadAppointments();
      } else {
        toast.error(response.message || 'Failed to cancel');
      }
    } catch (error) {
      toast.error('Failed to cancel appointment');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReschedule = async () => {
    if (!selectedAppointment || !rescheduleDate || !rescheduleTime) return;
    setActionLoading(true);
    try {
      const response = await appointmentService.rescheduleAppointment(
        selectedAppointment._id,
        rescheduleDate,
        rescheduleTime
      );
      if (response.success) {
        toast.success('Appointment rescheduled');
        setRescheduleModalOpen(false);
        loadAppointments();
      } else {
        toast.error(response.message || 'Failed to reschedule');
      }
    } catch (error) {
      toast.error('Failed to reschedule appointment');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Spinner className="min-h-[400px]" />;

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-500">View and manage your appointments</p>
        </div>
        <Link to="/app/patient/book">
          <Button>Book New Appointment</Button>
        </Link>
      </div>

      {appointments.length === 0 ? (
        <Card>
          <EmptyState
            title="No appointments"
            description="You haven't booked any appointments yet"
            action={
              <Link to="/app/patient/book">
                <Button>Book Appointment</Button>
              </Link>
            }
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => {
            const doctor = appointment.doctorId as unknown as { firstName?: string; lastName?: string; specialization?: string };
            return (
              <Card key={appointment._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">
                      Dr. {doctor?.firstName} {doctor?.lastName}
                    </h4>
                    <Badge variant={statusVariant[appointment.status]}>{appointment.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-500">{doctor?.specialization}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>{formatDate(appointment.appointmentDate)}</span>
                    <span>{formatTime(appointment.appointmentTime)}</span>
                    <span className="capitalize">{appointment.type.replace('_', ' ')}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {appointment.status === 'scheduled' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setRescheduleModalOpen(true);
                        }}
                      >
                        Reschedule
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setCancelModalOpen(true);
                        }}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={cancelModalOpen} onClose={() => setCancelModalOpen(false)} title="Cancel Appointment">
        <div className="space-y-4">
          <p className="text-gray-600">Are you sure you want to cancel this appointment?</p>
          <Input
            id="cancelReason"
            label="Reason (optional)"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Enter reason for cancellation"
          />
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setCancelModalOpen(false)}>
              Close
            </Button>
            <Button variant="danger" loading={actionLoading} onClick={handleCancel}>
              Cancel Appointment
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={rescheduleModalOpen}
        onClose={() => setRescheduleModalOpen(false)}
        title="Reschedule Appointment"
      >
        <div className="space-y-4">
          <Input
            id="rescheduleDate"
            label="New Date"
            type="date"
            value={rescheduleDate}
            onChange={(e) => setRescheduleDate(e.target.value)}
          />
          <Input
            id="rescheduleTime"
            label="New Time"
            type="time"
            value={rescheduleTime}
            onChange={(e) => setRescheduleTime(e.target.value)}
          />
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setRescheduleModalOpen(false)}>
              Close
            </Button>
            <Button loading={actionLoading} onClick={handleReschedule}>
              Reschedule
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}