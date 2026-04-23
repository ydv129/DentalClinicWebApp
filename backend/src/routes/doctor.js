import { Router } from 'express';
import { getProfile, updateProfile, getAppointments, updateAppointmentStatus, generateReport, createDoctor, removeDoctor, getAllDoctors, verifyDoctor, getPendingDoctors } from '../controllers/doctorController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/profile', authenticate, authorize('doctor'), getProfile);
router.put('/profile', authenticate, authorize('doctor'), updateProfile);
router.get('/appointments', authenticate, authorize('doctor'), getAppointments);
router.put('/appointments/:id', authenticate, authorize('doctor'), updateAppointmentStatus);
router.get('/report', authenticate, authorize('doctor'), generateReport);

router.get('/all', authenticate, authorize('admin', 'doctor'), getAllDoctors);
router.get('/pending', authenticate, authorize('admin'), getPendingDoctors);
router.post('/verify/:id', authenticate, authorize('admin'), verifyDoctor);
router.post('/create', authenticate, authorize('admin'), createDoctor);
router.delete('/:id', authenticate, authorize('admin'), removeDoctor);

export default router;