import { Doctor } from '../models/Doctor.js';
import { User } from '../models/User.js';
import { Appointment } from '../models/Appointment.js';
import PDFDocument from 'pdfkit';
import * as XLSX from 'xlsx';
import bcrypt from 'bcryptjs';

export const getProfile = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    res.json({ success: true, data: doctor });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, specialization, experience, consultationFee, availableDays, availableTimeStart, availableTimeEnd, bio } = req.body;
    
    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.user._id },
      { firstName, lastName, phone, specialization, experience, consultationFee, availableDays, availableTimeStart, availableTimeEnd, bio },
      { new: true, runValidators: true }
    );
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    
    res.json({ success: true, message: 'Profile updated', data: doctor });
  } catch (error) {
    next(error);
  }
};

export const getAppointments = async (req, res, next) => {
  try {
    const { status, date, page = 1, limit = 10 } = req.query;
    const query = { doctorId: req.user._id };
    
    if (status) query.status = status;
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.appointmentDate = { $gte: startOfDay, $lte: endOfDay };
    }
    
    const appointments = await Appointment.find(query)
      .populate('patientId', 'firstName lastName phone')
      .sort({ appointmentDate: 1 })
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

export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes, diagnosis, prescription, fees } = req.body;
    
    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, doctorId: req.user._id },
      { status, notes, diagnosis, prescription, fees },
      { new: true, runValidators: true }
    ).populate('patientId', 'firstName lastName phone');
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    res.json({ success: true, message: 'Appointment updated', data: appointment });
  } catch (error) {
    next(error);
  }
};

export const generateReport = async (req, res, next) => {
  try {
    const { startDate, endDate, format = 'pdf', status } = req.query;
    
    const query = { doctorId: req.user._id };
    if (startDate && endDate) {
      query.appointmentDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (status) query.status = status;
    
    const appointments = await Appointment.find(query)
      .populate('patientId', 'firstName lastName phone')
      .sort({ appointmentDate: -1 });
    
    if (!appointments.length) {
      return res.status(404).json({ success: false, message: 'No appointments found' });
    }
    
    if (format === 'excel') {
      const worksheet = XLSX.utils.json_to_sheet(appointments.map(a => ({
        'Date': new Date(a.appointmentDate).toLocaleDateString(),
        'Time': a.appointmentTime,
        'Patient': `${a.patientId?.firstName} ${a.patientId?.lastName}`,
        'Phone': a.patientId?.phone,
        'Type': a.type,
        'Status': a.status,
        'Diagnosis': a.diagnosis || '',
        'Fees': a.fees || 0,
        'Notes': a.notes || ''
      })));
      
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Appointments');
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=report.xlsx');
      return res.send(buffer);
    }
    
    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
    
    doc.pipe(res);
    
    doc.fontSize(20).text('Dental Clinic Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Period: ${startDate || 'All'} to ${endDate || 'All'}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.moveDown(2);
    
    const tableTop = 180;
    let position = tableTop;
    
    doc.fontSize(10).text('Date', 50, position)
      .text('Patient', 130, position)
      .text('Type', 280, position)
      .text('Status', 350, position)
      .text('Fees', 450, position);
    
    doc.moveTo(50, position + 15).lineTo(500, position + 15).stroke();
    position += 25;
    
    for (const apt of appointments) {
      if (position > 700) {
        doc.addPage();
        position = 50;
      }
      
      doc.text(new Date(apt.appointmentDate).toLocaleDateString(), 50, position)
        .text(`${apt.patientId?.firstName} ${apt.patientId?.lastName}`, 130, position)
        .text(apt.type, 280, position)
        .text(apt.status, 350, position)
        .text(`$${apt.fees || 0}`, 450, position);
      
      position += 20;
    }
    
    doc.moveDown(2);
    doc.fontSize(10).text(`Total Appointments: ${appointments.length}`, 50, doc.y);
    doc.text(`Total Revenue: $${appointments.reduce((sum, a) => sum + (a.fees || 0), 0)}`, 50, doc.y + 15);
    
    doc.end();
  } catch (error) {
    next(error);
  }
};

export const getAllDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find().select('-__v');
    res.json({ success: true, data: doctors });
  } catch (error) {
    next(error);
  }
};

export const createDoctor = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone, specialization, licenseNumber, experience, consultationFee, availableDays, availableTimeStart, availableTimeEnd, bio } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    
    const user = await User.create({
      email,
      password,
      role: 'doctor',
      isAdmin: false
    });
    
    const doctor = await Doctor.create({
      userId: user._id,
      firstName,
      lastName,
      phone,
      specialization,
      licenseNumber,
      experience,
      consultationFee,
      availableDays,
      availableTimeStart,
      availableTimeEnd,
      bio,
      isAdmin: false
    });
    
    res.status(201).json({ success: true, message: 'Doctor created', data: { user: { id: user._id, email: user.email }, doctor: { id: doctor._id, firstName, lastName, specialization } } });
  } catch (error) {
    next(error);
  }
};

export const removeDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    await User.findByIdAndDelete(doctor.userId);
    await Doctor.findByIdAndDelete(id);
    
    res.json({ success: true, message: 'Doctor removed' });
  } catch (error) {
    next(error);
  }
};

export const getPendingDoctors = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'doctor', isVerified: false }).select('-password -refreshToken');
    const pendingDoctors = await Promise.all(
      users.map(async (user) => {
        const doctor = await Doctor.findOne({ userId: user._id });
        return doctor;
      })
    );
    const filtered = pendingDoctors.filter(d => d !== null);
    res.json({ success: true, data: filtered });
  } catch (error) {
    next(error);
  }
};

export const verifyDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    await User.findByIdAndUpdate(doctor.userId, { isVerified: true });
    await Doctor.findByIdAndUpdate(id, { isVerified: true });
    
    res.json({ success: true, message: 'Doctor verified successfully' });
  } catch (error) {
    next(error);
  }
};