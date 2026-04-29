/**
 * Phone Helper Utility
 * Provides phone number validation and formatting functions
 */

/**
 * Validate phone number format
 * @param {String} phone - Phone number to validate
 * @returns {Boolean} True if phone number is valid
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone);
};

/**
 * Format phone number for display
 * @param {String} phone - Phone number to format
 * @returns {String} Formatted phone number
 */
export const formatPhone = (phone) => {
  // Remove any non-digit characters except +
  const cleaned = phone.replace(/[^\d\+]/g, '');
  
  // Basic formatting - can be enhanced based on requirements
  if (cleaned.startsWith('+')) {
    return cleaned;
  }
  
  return `+${cleaned}`;
};

/**
 * Extract country code from phone number
 * @param {String} phone - Phone number
 * @returns {String} Country code or null
 */
export const getCountryCode = (phone) => {
  const match = phone.match(/^[\+](\d{1,3})/);
  return match ? match[1] : null;
};

/**
 * Normalize phone number (remove formatting)
 * @param {String} phone - Phone number to normalize
 * @returns {String} Normalized phone number
 */
export const normalizePhone = (phone) => {
  return phone.replace(/[^\d\+]/g, '');
};
