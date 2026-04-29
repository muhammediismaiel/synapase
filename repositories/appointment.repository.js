import { BaseRepository } from './base.repository.js';
import { Appointment } from '../DataBase/models/appointment.model.js';

/**
 * Appointment Repository extending Base Repository
 * Provides appointment-specific operations
 */
export class AppointmentRepository extends BaseRepository {
  constructor() {
    super(Appointment);
  }

  /**
   * Find appointments by service type
   * @param {String} serviceType - Service type filter
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Appointments and pagination info
   */
  async findByServiceType(serviceType, options = {}) {
    try {
      const filters = { serviceType };
      return await this.findAll(filters, options);
    } catch (error) {
      throw new Error(`Failed to find appointments by service type: ${error.message}`);
    }
  }

  /**
   * Find appointments by status
   * @param {String} status - Status filter
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Appointments and pagination info
   */
  async findByStatus(status, options = {}) {
    try {
      const filters = { status };
      return await this.findAll(filters, options);
    } catch (error) {
      throw new Error(`Failed to find appointments by status: ${error.message}`);
    }
  }

  /**
   * Find appointments by date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Appointments and pagination info
   */
  async findByDateRange(startDate, endDate, options = {}) {
    try {
      const filters = {
        appointmentDate: {
          $gte: startDate,
          $lte: endDate
        }
      };
      return await this.findAll(filters, options);
    } catch (error) {
      throw new Error(`Failed to find appointments by date range: ${error.message}`);
    }
  }

  /**
   * Find appointments by phone number
   * @param {String} phone - Phone number
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Appointments and pagination info
   */
  async findByPhone(phone, options = {}) {
    try {
      const filters = { phone };
      return await this.findAll(filters, options);
    } catch (error) {
      throw new Error(`Failed to find appointments by phone: ${error.message}`);
    }
  }

  /**
   * Check for existing appointment at the same date and time
   * @param {Date} appointmentDate - Appointment date
   * @param {String} phone - Phone number (optional)
   * @returns {Promise<Object|null>} Existing appointment or null
   */
  async findExistingAppointment(appointmentDate, phone = null) {
    try {
      const filters = { appointmentDate };
      if (phone) {
        filters.phone = phone;
      }
      
      return await this.findOne(filters);
    } catch (error) {
      throw new Error(`Failed to check existing appointment: ${error.message}`);
    }
  }

  /**
   * Find appointments for today
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Appointments and pagination info
   */
  async findTodayAppointments(options = {}) {
    try {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

      const filters = {
        appointmentDate: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      };

      return await this.findAll(filters, options);
    } catch (error) {
      throw new Error(`Failed to find today's appointments: ${error.message}`);
    }
  }

  /**
   * Find upcoming appointments
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Appointments and pagination info
   */
  async findUpcomingAppointments(options = {}) {
    try {
      const filters = {
        appointmentDate: { $gt: new Date() },
        status: { $in: ['pending', 'confirmed'] }
      };

      return await this.findAll(filters, { ...options, sort: { appointmentDate: 1 } });
    } catch (error) {
      throw new Error(`Failed to find upcoming appointments: ${error.message}`);
    }
  }

  /**
   * Update appointment status
   * @param {String} id - Appointment ID
   * @param {String} status - New status
   * @returns {Promise<Object>} Updated appointment
   */
  async updateStatus(id, status) {
    try {
      return await this.update(id, { status });
    } catch (error) {
      throw new Error(`Failed to update appointment status: ${error.message}`);
    }
  }

  /**
   * Get appointment statistics
   * @returns {Promise<Object>} Appointment statistics
   */
  async getStatistics() {
    try {
      const [
        total,
        pending,
        confirmed,
        completed,
        cancelled,
        today,
        upcoming
      ] = await Promise.all([
        this.count(),
        this.count({ status: 'pending' }),
        this.count({ status: 'confirmed' }),
        this.count({ status: 'completed' }),
        this.count({ status: 'cancelled' }),
        this.getTodayCount(),
        this.getUpcomingCount()
      ]);

      return {
        total,
        pending,
        confirmed,
        completed,
        cancelled,
        today,
        upcoming
      };
    } catch (error) {
      throw new Error(`Failed to get appointment statistics: ${error.message}`);
    }
  }

  /**
   * Helper method to get today's appointment count
   * @returns {Promise<Number>} Today's appointment count
   */
  async getTodayCount() {
    try {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

      return await this.count({
        appointmentDate: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      });
    } catch (error) {
      throw new Error(`Failed to get today's appointment count: ${error.message}`);
    }
  }

  /**
   * Helper method to get upcoming appointment count
   * @returns {Promise<Number>} Upcoming appointment count
   */
  async getUpcomingCount() {
    try {
      return await this.count({
        appointmentDate: { $gt: new Date() },
        status: { $in: ['pending', 'confirmed'] }
      });
    } catch (error) {
      throw new Error(`Failed to get upcoming appointment count: ${error.message}`);
    }
  }
}
