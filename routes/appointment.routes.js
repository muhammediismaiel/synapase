import { Router } from 'express';
import { AppointmentController } from '../controllers/appointment.controller.js';

const router = Router();
const appointmentController = new AppointmentController();

/**
 * Appointment Routes
 * Base path: /appointments
 */

// POST /appointments - Create a new appointment
router.post('/', appointmentController.createAppointment.bind(appointmentController));

// GET /appointments - Get all appointments with filtering and pagination
// Query parameters: page, limit, status, serviceType, sortBy, sortOrder
router.get('/', appointmentController.getAllAppointments.bind(appointmentController));

// GET /appointments/today - Get today's appointments
router.get('/today', appointmentController.getTodayAppointments.bind(appointmentController));

// GET /appointments/upcoming - Get upcoming appointments
router.get('/upcoming', appointmentController.getUpcomingAppointments.bind(appointmentController));

// GET /appointments/statistics - Get appointment statistics
router.get('/statistics', appointmentController.getAppointmentStatistics.bind(appointmentController));

// GET /appointments/:id - Get appointment by ID
router.get('/:id', appointmentController.getAppointmentById.bind(appointmentController));

// PATCH /appointments/:id/status - Update appointment status
// Body: { status: "pending|confirmed|completed|cancelled" }
router.patch('/:id/status', appointmentController.updateAppointmentStatus.bind(appointmentController));

// DELETE /appointments/:id - Delete appointment
router.delete('/:id', appointmentController.deleteAppointment.bind(appointmentController));

export default router;
