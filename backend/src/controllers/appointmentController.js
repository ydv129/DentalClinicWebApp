import { Appointment } from '../models/Appointment.js';
import { Patient } from '../models/Patient.js';
import { Doctor } from '../models/Doctor.js';

export const bookAppointment = async (req, res, next) => {
  try {
    const { doctorId, appointmentDate, appointmentTime, type, symptoms } = req.body;
    
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient profile not found' });
    }
    
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    const existing = await Appointment.findOne({
      doctorId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      status: { $nin: ['cancelled'] }
    });
    
    if (existing) {
      return res.status(400).json({ success: false, message: 'Time slot not available' });
    }
    
    const appointment = await Appointment.create({
      patientId: patient._id,
      doctorId,
      appointmentDate,
      appointmentTime,
      type,
      symptoms
    });
    
    await appointment.populate('doctorId', 'firstName lastName specialization');
    
    res.status(201).json({ success: true, message: 'Appointment booked', data: appointment });
  } catch (error) {
    next(error);
  }
};

export const getAppointments = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = {};
    
    if (status) query.status = status;
    
    const patient = await Patient.findOne({ userId: req.user._id });
    if (patient) query.patientId = patient._id;
    
    const appointments = await Appointment.find(query)
      .populate('doctorId', 'firstName lastName specialization')
      .sort({ appointmentDate: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await Appointment.countDocuments(query);
    
    res.json({
      success: true,
      data: { appointments, total, page: parseInt(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

export const getAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const patient = await Patient.findOne({ userId: req.user._id });
    
    const appointment = await Appointment.findOne({ _id: id, patientId: patient?._id })
      .populate('doctorId', 'firstName lastName specialization');
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    res.json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

export const cancelAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const patient = await Patient.findOne({ userId: req.user._id });
    
    const appointment = await Appointment.findOne({ _id: id, patientId: patient?._id });
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    if (appointment.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Already cancelled' });
    }
    
    if (appointment.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Cannot cancel completed appointment' });
    }
    
    appointment.status = 'cancelled';
    appointment.cancellationReason = reason;
    appointment.cancelledAt = new Date();
    appointment.cancelledBy = req.user._id;
    await appointment.save();
    
    res.json({ success: true, message: 'Appointment cancelled', data: appointment });
  } catch (error) {
    next(error);
  }
};

export const rescheduleAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { appointmentDate, appointmentTime } = req.body;
    
    const patient = await Patient.findOne({ userId: req.user._id });
    
    const appointment = await Appointment.findOne({ _id: id, patientId: patient?._id });
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    if (appointment.status === 'cancelled' || appointment.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Cannot reschedule this appointment' });
    }
    
    const existing = await Appointment.findOne({
      _id: { $ne: id },
      doctorId: appointment.doctorId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      status: { $nin: ['cancelled'] }
    });
    
    if (existing) {
      return res.status(400).json({ success: false, message: 'Time slot not available' });
    }
    
    appointment.appointmentDate = appointmentDate;
    appointment.appointmentTime = appointmentTime;
    appointment.status = 'scheduled';
    await appointment.save();
    
    await appointment.populate('doctorId', 'firstName lastName specialization');
    
    res.json({ success: true, message: 'Appointment rescheduled', data: appointment });
  } catch (error) {
    next(error);
  }
};

export const getAvailableSlots = async (req, res, next) => {
  try {
    const { doctorId, date } = req.query;
    
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'lowercase' });
    if (!doctor.availableDays.includes(dayOfWeek)) {
      return res.json({ success: true, data: [] });
    }
    
    const [startHour] = doctor.availableTimeStart.split(':').map(Number);
    const [endHour] = doctor.availableTimeEnd.split(':').map(Number);
    
    const bookedSlots = await Appointment.find({
      doctorId,
      appointmentDate: { $gte: new Date(date), $lt: new Date(date) },
      status: { $nin: ['cancelled'] }
    }).select('appointmentTime');
    
    const bookedTimes = bookedSlots.map(a => a.appointmentTime);
    const slots = [];
    
    for (let hour = startHour; hour < endHour; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      if (!bookedTimes.includes(time)) {
        slots.push(time);
      }
      const halfHour = `${hour.toString().padStart(2, '0')}:30`;
      if (!bookedTimes.includes(halfHour)) {
        slots.push(halfHour);
      }
    }
    
    res.json({ success: true, data: slots });
  } catch (error) {
    next(error);
  }
};