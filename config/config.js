import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Pagination defaults
  defaultPage: 1,
  defaultLimit: 10,
  
  // JWT settings
  jwtExpiresIn: '7d',
  
  // Service types for appointments
  serviceTypes: ['web', 'network', 'security', 'cameras'],
  
  // Appointment statuses
  appointmentStatuses: ['pending', 'confirmed', 'completed', 'cancelled']
};
