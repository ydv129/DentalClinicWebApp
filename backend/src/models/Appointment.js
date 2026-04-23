import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  appointmentDate: { type: Date, required: true },
  appointmentTime: { type: String, required: true },
  duration: { type: Number, default: 30, min: 15, max: 120 },
  type: { 
    type: String, 
    enum: ['checkup', 'cleaning', 'filling', 'extraction', 'root_canal', 'crown', 'whitening', 'implant', 'orthodontic', 'emergency'],
    required: true 
  },
  status: { 
    type: String, 
    enum: ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'],
    default: 'scheduled'
  },
  notes: { type: String, trim: true },
  symptoms: { type: String, trim: true },
  diagnosis: { type: String, trim: true },
  prescription: { type: String, trim: true },
  fees: { type: Number, default: 0, min: 0 },
  cancellationReason: { type: String, trim: true },
  cancelledAt: { type: Date },
  cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

appointmentSchema.index({ patientId: 1, appointmentDate: 1 });
appointmentSchema.index({ doctorId: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1 });

export const Appointment = mongoose.model('Appointment', appointmentSchema);