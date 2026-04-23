import { Router } from 'express';
import { getProfile, updateProfile, getMyAppointments } from '../controllers/patientController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/profile', authenticate, authorize('patient'), getProfile);
router.put('/profile', authenticate, authorize('patient'), updateProfile);
router.get('/appointments', authenticate, authorize('patient'), getMyAppointments);

export default router;