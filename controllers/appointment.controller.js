import { AppointmentService } from '../services/appointment.service.js';

/**
 * Appointment Controller - HTTP Request Handlers
 * Manages incoming requests and sends responses
 */
export class AppointmentController {
  constructor() {
    this.appointmentService = new AppointmentService();
  }

  /**
   * Create a new appointment
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createAppointment(req, res) {
    try {
      const appointment = await this.appointmentService.createAppointment(req.body);

      res.status(201).json({
        success: true,
        message: 'Appointment created successfully',
        data: appointment
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  /**
   * Get all appointments with filtering and pagination
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllAppointments(req, res) {
    try {
      const result = await this.appointmentService.getAllAppointments(req.query);

      res.status(200).json({
        success: true,
        message: 'Appointments retrieved successfully',
        data: result.documents,
        pagination: result.pagination
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  /**
   * Get appointment by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAppointmentById(req, res) {
    try {
      const appointment = await this.appointmentService.getAppointmentById(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Appointment retrieved successfully',
        data: appointment
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  /**
   * Update appointment status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateAppointmentStatus(req, res) {
    try {
      const { status } = req.body;
      const appointment = await this.appointmentService.updateAppointmentStatus(
        req.params.id,
        status
      );

      res.status(200).json({
        success: true,
        message: 'Appointment status updated successfully',
        data: appointment
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  /**
   * Delete appointment
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteAppointment(req, res) {
    try {
      const appointment = await this.appointmentService.deleteAppointment(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Appointment deleted successfully',
        data: appointment
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  /**
   * Get appointment statistics
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAppointmentStatistics(req, res) {
    try {
      const statistics = await this.appointmentService.getAppointmentStatistics();

      res.status(200).json({
        success: true,
        message: 'Appointment statistics retrieved successfully',
        data: statistics
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  /**
   * Get today's appointments
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getTodayAppointments(req, res) {
    try {
      const result = await this.appointmentService.getTodayAppointments(req.query);

      res.status(200).json({
        success: true,
        message: "Today's appointments retrieved successfully",
        data: result.documents,
        pagination: result.pagination
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  /**
   * Get upcoming appointments
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getUpcomingAppointments(req, res) {
    try {
      const result = await this.appointmentService.getUpcomingAppointments(req.query);

      res.status(200).json({
        success: true,
        message: 'Upcoming appointments retrieved successfully',
        data: result.documents,
        pagination: result.pagination
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }
}
