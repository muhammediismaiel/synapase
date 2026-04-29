import Joi from 'joi';
import { config } from '../config/config.js';

/**
 * Validation Middleware using Joi
 * Provides request body validation for different endpoints
 */

// Appointment validation schema
const appointmentSchema = Joi.object({
  name: Joi.string()
    .required()
    .min(2)
    .max(100)
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 100 characters',
      'any.required': 'Name is required'
    }),
  
  phone: Joi.string()
    .required()
    .pattern(/^[\+]?[1-9][\d]{0,15}$/)
    .messages({
      'string.empty': 'Phone number is required',
      'string.pattern.base': 'Please enter a valid phone number',
      'any.required': 'Phone number is required'
    }),
  
  address: Joi.string()
    .required()
    .min(5)
    .max(200)
    .messages({
      'string.empty': 'Address is required',
      'string.min': 'Address must be at least 5 characters long',
      'string.max': 'Address cannot exceed 200 characters',
      'any.required': 'Address is required'
    }),
  
  serviceType: Joi.string()
    .required()
    .valid(...config.serviceTypes)
    .messages({
      'any.only': `Service type must be one of: ${config.serviceTypes.join(', ')}`,
      'any.required': 'Service type is required'
    }),
  
  appointmentDate: Joi.date()
    .required()
    .iso()
    .min('now')
    .messages({
      'date.empty': 'Appointment date is required',
      'date.format': 'Appointment date must be a valid ISO date',
      'date.min': 'Appointment date cannot be in the past',
      'any.required': 'Appointment date is required'
    })
});

// Status update validation schema
const statusUpdateSchema = Joi.object({
  status: Joi.string()
    .required()
    .valid(...config.appointmentStatuses)
    .messages({
      'any.only': `Status must be one of: ${config.appointmentStatuses.join(', ')}`,
      'any.required': 'Status is required'
    })
});

// Query parameters validation schema
const querySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(config.defaultPage),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(config.defaultLimit),
  
  status: Joi.string()
    .valid(...config.appointmentStatuses),
  
  serviceType: Joi.string()
    .valid(...config.serviceTypes),
  
  sortBy: Joi.string()
    .valid('createdAt', 'appointmentDate', 'name', 'serviceType', 'status')
    .default('createdAt'),
  
  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('desc')
});

/**
 * Validate appointment creation request body
 */
export const validateAppointment = (req, res, next) => {
  const { error } = appointmentSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      data: null,
      errors: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }
  
  next();
};

/**
 * Validate status update request body
 */
export const validateStatusUpdate = (req, res, next) => {
  const { error } = statusUpdateSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      data: null,
      errors: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }
  
  next();
};

/**
 * Validate query parameters
 */
export const validateQuery = (req, res, next) => {
  const { error, value } = querySchema.validate(req.query);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Query validation error',
      data: null,
      errors: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }
  
  // Replace req.query with validated and sanitized values
  req.query = value;
  next();
};

/**
 * Validate MongoDB ObjectId
 */
export const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid appointment ID',
      data: null
    });
  }
  
  next();
};
