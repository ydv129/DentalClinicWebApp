import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  specialization: { type: String, required: true, trim: true },
  licenseNumber: { type: String, required: true, unique: true, trim: true },
  experience: { type: Number, required: true, min: 0 },
  consultationFee: { type: Number, required: true, min: 0 },
  availableDays: [{ type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] }],
  availableTimeStart: { type: String, required: true },
  availableTimeEnd: { type: String, required: true },
  bio: { type: String, trim: true },
  isAdmin: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

doctorSchema.virtual('fullName').get(function() {
  return `Dr. ${this.firstName} ${this.lastName}`;
});

doctorSchema.index({ userId: 1 }, { unique: true });
doctorSchema.index({ specialization: 1 });

export const Doctor = mongoose.model('Doctor', doctorSchema);