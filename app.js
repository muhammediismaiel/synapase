import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/config.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.middleware.js';
import { asyncHandler } from './middlewares/asyncHandler.middleware.js';
import { authenticate, adminLogin } from './middlewares/auth.middleware.js';
import appointmentRoutes from './routes/appointment.routes.js';

/**
 * Express Application Setup
 * Configures middleware, routes, and error handling
 */

const app = express();

// Security middleware
app.use(helmet());

// CORS middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware (development only)
if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
  });
}

// Home/Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Synapse Technology Services',
    data: {
      service: 'Synapse API',
      version: '1.0.0',
      endpoints: {
        health: '/health',
        api: '/api',
        appointments: '/appointments',
        admin: '/admin'
      },
      documentation: 'Visit /api for more information'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    data: {
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv,
      version: '1.0.0'
    }
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Synapse Technology Services API',
    data: {
      version: '1.0.0',
      description: 'Technology services platform with appointment booking',
      endpoints: {
        appointments: '/appointments',
        admin: '/admin'
      },
      documentation: '/api/docs'
    }
  });
});

// Authentication routes
app.post('/admin/login', asyncHandler(adminLogin));

// Protected admin routes
app.use('/admin', authenticate);

// Appointment routes
app.use('/appointments', appointmentRoutes);

// Admin dashboard routes (protected)
app.get('/admin/dashboard', authenticate, asyncHandler(async (req, res) => {
  // This would typically fetch dashboard statistics
  res.status(200).json({
    success: true,
    message: 'Admin dashboard data',
    data: {
      user: req.user,
      message: 'Welcome to admin dashboard'
    }
  });
}));

// Favicon route to prevent 404 errors
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// 404 handler for undefined routes
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
