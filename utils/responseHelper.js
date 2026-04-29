/**
 * Response Helper Utility
 * Standardizes API response format across the application
 */

/**
 * Success response helper
 * @param {Object} res - Express response object
 * @param {String} message - Success message
 * @param {Object} data - Response data
 * @param {Number} statusCode - HTTP status code (default: 200)
 * @param {Object} pagination - Pagination info for list responses
 */
export const successResponse = (res, message, data = null, statusCode = 200, pagination = null) => {
  const response = {
    success: true,
    message,
    data
  };

  if (pagination) {
    response.pagination = pagination;
  }

  return res.status(statusCode).json(response);
};

/**
 * Error response helper
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 * @param {Number} statusCode - HTTP status code (default: 400)
 * @param {Object} errors - Detailed error information
 */
export const errorResponse = (res, message, statusCode = 400, errors = null) => {
  const response = {
    success: false,
    message,
    data: null
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Validation error response helper
 * @param {Object} res - Express response object
 * @param {Array} errors - Validation errors array
 */
export const validationErrorResponse = (res, errors) => {
  return errorResponse(res, 'Validation error', 400, errors);
};
