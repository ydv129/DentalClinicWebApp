import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import patientRoutes from './routes/patient.js';
import doctorRoutes from './routes/doctor.js';
import appointmentRoutes from './routes/appointment.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authLimiter } from './middleware/rateLimiter.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dentalclinic';

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS),
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);
app.use('/api/auth', authLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Dental Clinic API is running', timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

const createCollectionsAndSuperAdmin = async () => {
  const db = mongoose.connection.db;
  
  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map(c => c.name);
  
  if (!collectionNames.includes('users')) {
    await db.createCollection('users');
    console.log('[users] collection created');
  }
  
  if (!collectionNames.includes('doctors')) {
    await db.createCollection('doctors');
    console.log('[doctors] collection created');
  }
  
  if (!collectionNames.includes('patients')) {
    await db.createCollection('patients');
    console.log('[patients] collection created');
  }
  
  if (!collectionNames.includes('appointments')) {
    await db.createCollection('appointments');
    console.log('[appointments] collection created');
  }
  
  const existingUser = await db.collection('users').findOne({ email: 'doctor@dentalclinic.com' });
  
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('doctor@123', 12);
    
    const superAdminUser = {
      email: 'doctor@dentalclinic.com',
      password: hashedPassword,
      role: 'doctor',
      isAdmin: true,
      isVerified: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const userResult = await db.collection('users').insertOne(superAdminUser);
    const userId = userResult.insertedId;
    
    const superAdminDoctor = {
      userId: userId,
      firstName: 'Super',
      lastName: 'Admin',
      phone: '+1234567890',
      specialization: 'Administration',
      licenseNumber: 'SUPERADMIN001',
      experience: 15,
      consultationFee: 0,
      availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      availableTimeStart: '09:00',
      availableTimeEnd: '17:00',
      bio: 'Super Admin - Can manage all doctors',
      isAdmin: true,
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection('doctors').insertOne(superAdminDoctor);
    
    console.log('=== Super Admin Doctor Created ===');
    console.log('Email: doctor@dentalclinic.com');
    console.log('Password: doctor@123');
  } else {
    console.log('=== Super Admin Already Exists ===');
  }
};

const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('=== Database Connected ===');
    
    await createCollectionsAndSuperAdmin();
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

startServer();

export default app;