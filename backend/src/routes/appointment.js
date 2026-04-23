import { Router } from 'express';
import { bookAppointment, getAppointments, getAppointment, cancelAppointment, rescheduleAppointment, getAvailableSlots } from '../controllers/appointmentController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, authorize('patient'), bookAppointment);
router.get('/', authenticate, authorize('patient'), getAppointments);
router.get('/available-slots', authenticate, authorize('patient'), getAvailableSlots);
router.get('/:id', authenticate, authorize('patient'), getAppointment);
router.put('/:id/cancel', authenticate, authorize('patient'), cancelAppointment);
router.put('/:id/reschedule', authenticate, authorize('patient'), rescheduleAppointment);

export default router;