import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { doctorService } from '../../services/doctorService';
import { appointmentService } from '../../services/appointmentService';
import { Appointment, AppointmentStatus } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';

const statusVariant: Record<AppointmentStatus, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  scheduled: 'info',
  confirmed: 'info',
  in_progress: 'warning',
  completed: 'success',
  cancelled: 'danger',
  no_show: 'danger'
};

const statusOptions = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'no_show', label: 'No Show' }
];

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [form, setForm] = useState({
    status: '',
    diagnosis: '',
    prescription: '',
    notes: '',
    fees: 0
  });
  const [reportForm, setReportForm] = useState({
    startDate: '',
    endDate: '',
    format: 'pdf'
  });

  useEffect(() => {
    loadAppointments();
  }, [statusFilter]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const response = await appointmentService.getAppointments({
        status: statusFilter || undefined
      });
      if (response.success && response.data) {
        setAppointments(response.data.appointments);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedAppointment) return;
    setActionLoading(true);
    try {
      const response = await doctorService.updateAppointmentStatus(selectedAppointment._id, form);
      if (response.success) {
        toast.success('Appointment updated');
        setEditModalOpen(false);
        loadAppointments();
      } else {
        toast.error(response.message || 'Failed to update');
      }
    } catch (error) {
      toast.error('Failed to update appointment');
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setForm({
      status: appointment.status,
      diagnosis: appointment.diagnosis || '',
      prescription: appointment.prescription || '',
      notes: appointment.notes || '',
      fees: appointment.fees || 0
    });
    setEditModalOpen(true);
  };

  const handleDownloadReport = async () => {
    setActionLoading(true);
    try {
      const response = await doctorService.generateReport({
        startDate: reportForm.startDate || undefined,
        endDate: reportForm.endDate || undefined,
        format: reportForm.format as 'pdf' | 'excel'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report.${reportForm.format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Report downloaded');
      setReportModalOpen(false);
    } catch (error) {
      toast.error('Failed to download report');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Spinner className="min-h-[400px]" />;

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-500">Manage patient appointments</p>
        </div>
        <Button onClick={() => setReportModalOpen(true)}>Download Report</Button>
      </div>

      <Card>
        <div className="mb-4">
          <Select
            id="statusFilter"
            label="Filter by Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[{ value: '', label: 'All Statuses' }, ...statusOptions]}
          />
        </div>

        {appointments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No appointments found</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => {
              const patient = appointment.patientId as unknown as { firstName?: string; lastName?: string; phone?: string };
              return (
                <div
                  key={appointment._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-gray-50 gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">
                        {patient?.firstName} {patient?.lastName}
                      </h4>
                      <Badge variant={statusVariant[appointment.status]}>{appointment.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-500">{patient?.phone}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(appointment.appointmentDate).toLocaleDateString()} at{' '}
                      {appointment.appointmentTime}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => openEditModal(appointment)}>
                    Update
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Update Appointment">
        <div className="space-y-4">
          <Select
            id="status"
            label="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            options={statusOptions}
          />
          <Input
            id="diagnosis"
            label="Diagnosis"
            value={form.diagnosis}
            onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
          />
          <Input
            id="prescription"
            label="Prescription"
            value={form.prescription}
            onChange={(e) => setForm({ ...form, prescription: e.target.value })}
          />
          <Input
            id="notes"
            label="Notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
          <Input
            id="fees"
            label="Fees"
            type="number"
            value={form.fees}
            onChange={(e) => setForm({ ...form, fees: Number(e.target.value) })}
          />
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setEditModalOpen(false)}>
              Close
            </Button>
            <Button loading={actionLoading} onClick={handleStatusUpdate}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={reportModalOpen} onClose={() => setReportModalOpen(false)} title="Download Report">
        <div className="space-y-4">
          <Input
            id="startDate"
            label="Start Date"
            type="date"
            value={reportForm.startDate}
            onChange={(e) => setReportForm({ ...reportForm, startDate: e.target.value })}
          />
          <Input
            id="endDate"
            label="End Date"
            type="date"
            value={reportForm.endDate}
            onChange={(e) => setReportForm({ ...reportForm, endDate: e.target.value })}
          />
          <Select
            id="format"
            label="Format"
            value={reportForm.format}
            onChange={(e) => setReportForm({ ...reportForm, format: e.target.value })}
            options={[
              { value: 'pdf', label: 'PDF' },
              { value: 'excel', label: 'Excel' }
            ]}
          />
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setReportModalOpen(false)}>
              Close
            </Button>
            <Button loading={actionLoading} onClick={handleDownloadReport}>
              Download
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}