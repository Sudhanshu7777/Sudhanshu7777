/**
 * Validation utilities
 */

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (basic validation)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate required field
 */
export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

/**
 * Validate string length
 */
export const isValidLength = (value: string, min: number, max?: number): boolean => {
  const length = value.trim().length;
  if (max) {
    return length >= min && length <= max;
  }
  return length >= min;
};

/**
 * Validate numeric value
 */
export const isNumeric = (value: any): boolean => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

/**
 * Validate coordinates
 */
export const isValidCoordinates = (lat: number, lng: number): boolean => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

/**
 * Validate file type
 */
export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

/**
 * Validate file size
 */
export const isValidFileSize = (file: File, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

/**
 * Common validation rules
 */
export const validationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
  phone: {
    required: false,
    pattern: /^\+?[\d\s\-\(\)]{10,}$/,
    message: 'Please enter a valid phone number',
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    message: 'Name must be between 2 and 50 characters',
  },
  description: {
    required: false,
    maxLength: 500,
    message: 'Description must not exceed 500 characters',
  },
  image: {
    required: true,
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    maxSize: 10, // MB
    message: 'Please upload a valid image file (JPEG, PNG, or WebP) under 10MB',
  },
};

/**
 * Validate form field
 */
export const validateField = (value: any, rule: any): { isValid: boolean; message?: string } => {
  // Check required
  if (rule.required && !isRequired(value)) {
    return { isValid: false, message: 'This field is required' };
  }

  // Skip validation if field is not required and empty
  if (!rule.required && !isRequired(value)) {
    return { isValid: true };
  }

  // Check pattern
  if (rule.pattern && typeof value === 'string') {
    if (!rule.pattern.test(value)) {
      return { isValid: false, message: rule.message || 'Invalid format' };
    }
  }

  // Check length
  if (typeof value === 'string') {
    if (rule.minLength && value.length < rule.minLength) {
      return { isValid: false, message: rule.message || `Minimum ${rule.minLength} characters required` };
    }
    if (rule.maxLength && value.length > rule.maxLength) {
      return { isValid: false, message: rule.message || `Maximum ${rule.maxLength} characters allowed` };
    }
  }

  // Check numeric
  if (rule.numeric && !isNumeric(value)) {
    return { isValid: false, message: 'Please enter a valid number' };
  }

  return { isValid: true };
};
