/**
 * Date Helper Utility
 * Provides common date manipulation and validation functions
 */

/**
 * Check if date is in the past
 * @param {Date} date - Date to check
 * @returns {Boolean} True if date is in the past
 */
export const isDateInPast = (date) => {
  const inputDate = new Date(date);
  const now = new Date();
  return inputDate <= now;
};

/**
 * Check if date is too far in the future (more than 1 year)
 * @param {Date} date - Date to check
 * @returns {Boolean} True if date is more than 1 year in future
 */
export const isDateTooFarInFuture = (date) => {
  const inputDate = new Date(date);
  const maxFutureDate = new Date();
  maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 1);
  return inputDate > maxFutureDate;
};

/**
 * Get start of hour for a given date
 * @param {Date} date - Input date
 * @returns {Date} Start of the hour
 */
export const getStartOfHour = (date) => {
  const startHour = new Date(date);
  startHour.setMinutes(0, 0, 0);
  return startHour;
};

/**
 * Get end of hour for a given date
 * @param {Date} date - Input date
 * @returns {Date} End of the hour
 */
export const getEndOfHour = (date) => {
  const endHour = getStartOfHour(date);
  endHour.setHours(endHour.getHours() + 1);
  return endHour;
};

/**
 * Get start of day for a given date
 * @param {Date} date - Input date
 * @returns {Date} Start of the day
 */
export const getStartOfDay = (date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
};

/**
 * Get end of day for a given date
 * @param {Date} date - Input date
 * @returns {Date} End of the day
 */
export const getEndOfDay = (date) => {
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay;
};

/**
 * Format date for display
 * @param {Date} date - Date to format
 * @returns {String} Formatted date string
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Add days to a date
 * @param {Date} date - Original date
 * @param {Number} days - Number of days to add
 * @returns {Date} New date with days added
 */
export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
