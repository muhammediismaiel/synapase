import { AppointmentRepository } from '../repositories/appointment.repository.js';
import { config } from '../config/config.js';

/**
 * Appointment Service - Business Logic Layer
 * Handles appointment booking with validation and business rules
 */
export class AppointmentService {
  constructor() {
    this.appointmentRepository = new AppointmentRepository();
  }

  /**
   * Create a new appointment with validation
   * @param {Object} appointmentData - Appointment data
   * @returns {Promise<Object>} Created appointment
   */
  async createAppointment(appointmentData) {
    try {
      // Validate required fields
      this.validateAppointmentData(appointmentData);

      // Validate phone number format
      this.validatePhone(appointmentData.phone);

      // Validate appointment date (no past dates)
      this.validateAppointmentDate(appointmentData.appointmentDate);

      // Check for double booking
      await this.checkDoubleBooking(appointmentData.appointmentDate, appointmentData.phone);

      // Create appointment
      const appointment = await this.appointmentRepository.create(appointmentData);

      return appointment;
    } catch (error) {
      throw new Error(`Failed to create appointment: ${error.message}`);
    }
  }

  /**
   * Get all appointments with filtering and pagination
   * @param {Object} query - Query parameters
   * @returns {Promise<Object>} Appointments and pagination info
   */
  async getAllAppointments(query = {}) {
    try {
      const {
        page,
        limit,
        status,
        serviceType,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = query;

      // Build filters
      const filters = {};
      if (status) {
        filters.status = status;
      }
      if (serviceType) {
        filters.serviceType = serviceType;
      }

      // Build sort options
      const sort = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Build options
      const options = {
        page: parseInt(page) || config.defaultPage,
        limit: parseInt(limit) || config.defaultLimit,
        sort
      };

      return await this.appointmentRepository.findAll(filters, options);
    } catch (error) {
      throw new Error(`Failed to get appointments: ${error.message}`);
    }
  }

  /**
   * Get appointment by ID
   * @param {String} id - Appointment ID
   * @returns {Promise<Object>} Appointment
   */
  async getAppointmentById(id) {
    try {
      return await this.appointmentRepository.findById(id);
    } catch (error) {
      throw new Error(`Failed to get appointment: ${error.message}`);
    }
  }

  /**
   * Update appointment status
   * @param {String} id - Appointment ID
   * @param {String} status - New status
   * @returns {Promise<Object>} Updated appointment
   */
  async updateAppointmentStatus(id, status) {
    try {
      // Validate status
      if (!config.appointmentStatuses.includes(status)) {
        throw new Error(`Invalid status. Must be one of: ${config.appointmentStatuses.join(', ')}`);
      }

      // Check if appointment exists
      const appointment = await this.appointmentRepository.findById(id);
      
      // Business logic for status transitions
      this.validateStatusTransition(appointment.status, status);

      return await this.appointmentRepository.updateStatus(id, status);
    } catch (error) {
      throw new Error(`Failed to update appointment status: ${error.message}`);
    }
  }

  /**
   * Delete appointment
   * @param {String} id - Appointment ID
   * @returns {Promise<Object>} Deleted appointment
   */
  async deleteAppointment(id) {
    try {
      // Check if appointment exists
      const appointment = await this.appointmentRepository.findById(id);

      // Business rule: Cannot delete completed appointments
      if (appointment.status === 'completed') {
        throw new Error('Cannot delete completed appointments');
      }

      return await this.appointmentRepository.delete(id);
    } catch (error) {
      throw new Error(`Failed to delete appointment: ${error.message}`);
    }
  }

  /**
   * Get appointment statistics
   * @returns {Promise<Object>} Appointment statistics
   */
  async getAppointmentStatistics() {
    try {
      return await this.appointmentRepository.getStatistics();
    } catch (error) {
      throw new Error(`Failed to get appointment statistics: ${error.message}`);
    }
  }

  /**
   * Get today's appointments
   * @param {Object} query - Query parameters
   * @returns {Promise<Object>} Today's appointments
   */
  async getTodayAppointments(query = {}) {
    try {
      const { page, limit } = query;
      const options = {
        page: parseInt(page) || config.defaultPage,
        limit: parseInt(limit) || config.defaultLimit
      };

      return await this.appointmentRepository.findTodayAppointments(options);
    } catch (error) {
      throw new Error(`Failed to get today's appointments: ${error.message}`);
    }
  }

  /**
   * Get upcoming appointments
   * @param {Object} query - Query parameters
   * @returns {Promise<Object>} Upcoming appointments
   */
  async getUpcomingAppointments(query = {}) {
    try {
      const { page, limit } = query;
      const options = {
        page: parseInt(page) || config.defaultPage,
        limit: parseInt(limit) || config.defaultLimit
      };

      return await this.appointmentRepository.findUpcomingAppointments(options);
    } catch (error) {
      throw new Error(`Failed to get upcoming appointments: ${error.message}`);
    }
  }

  /**
   * Validate appointment data
   * @param {Object} data - Appointment data
   */
  validateAppointmentData(data) {
    const requiredFields = ['name', 'phone', 'address', 'serviceType', 'appointmentDate'];
    
    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`${field} is required`);
      }
    }

    // Validate service type
    if (!config.serviceTypes.includes(data.serviceType)) {
      throw new Error(`Invalid service type. Must be one of: ${config.serviceTypes.join(', ')}`);
    }

    // Validate name length
    if (data.name.length > 100) {
      throw new Error('Name cannot exceed 100 characters');
    }

    // Validate address length
    if (data.address.length > 200) {
      throw new Error('Address cannot exceed 200 characters');
    }
  }

  /**
   * Validate phone number format
   * @param {String} phone - Phone number
   */
  validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    
    if (!phoneRegex.test(phone)) {
      throw new Error('Invalid phone number format');
    }
  }

  /**
   * Validate appointment date
   * @param {Date} appointmentDate - Appointment date
   */
  validateAppointmentDate(appointmentDate) {
    const date = new Date(appointmentDate);
    const now = new Date();

    if (date <= now) {
      throw new Error('Appointment date cannot be in the past');
    }

    // Check if appointment is too far in the future (e.g., more than 1 year)
    const maxFutureDate = new Date();
    maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 1);

    if (date > maxFutureDate) {
      throw new Error('Appointment date cannot be more than 1 year in the future');
    }
  }

  /**
   * Check for double booking
   * @param {Date} appointmentDate - Appointment date
   * @param {String} phone - Phone number
   */
  async checkDoubleBooking(appointmentDate, phone) {
    try {
      // Check if there's already an appointment at the same time for the same phone
      const existingAppointment = await this.appointmentRepository.findExistingAppointment(
        appointmentDate,
        phone
      );

      if (existingAppointment) {
        throw new Error('An appointment already exists for this date and time');
      }

      // Optional: Check if there are too many appointments at the same time slot
      // This would depend on business requirements (e.g., max 5 appointments per hour)
      const hourStart = new Date(appointmentDate);
      hourStart.setMinutes(0, 0, 0);
      
      const hourEnd = new Date(hourStart);
      hourEnd.setHours(hourStart.getHours() + 1);

      const appointmentsInHour = await this.appointmentRepository.count({
        appointmentDate: {
          $gte: hourStart,
          $lt: hourEnd
        }
      });

      // Business rule: Maximum 10 appointments per hour
      if (appointmentsInHour >= 10) {
        throw new Error('This time slot is fully booked. Please choose a different time.');
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Validate status transitions
   * @param {String} currentStatus - Current status
   * @param {String} newStatus - New status
   */
  validateStatusTransition(currentStatus, newStatus) {
    const validTransitions = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['completed', 'cancelled'],
      'completed': [], // Cannot change from completed
      'cancelled': [] // Cannot change from cancelled
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new Error(`Cannot change status from ${currentStatus} to ${newStatus}`);
    }
  }
}
