import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

/**
 * JWT Authentication Middleware
 * Protects routes that require admin authentication
 */

/**
 * Generate JWT Token
 * @param {Object} payload - Token payload
 * @returns {String} JWT token
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  });
};

/**
 * Verify JWT Token
 * @param {String} token - JWT token
 * @returns {Object} Decoded token payload
 */
export const verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};

/**
 * Authentication Middleware
 * Verifies JWT token from Authorization header
 */
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
        data: null
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
      const decoded = verifyToken(token);
      req.user = decoded;
      next();
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
        data: null
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
      data: null
    });
  }
};

/**
 * Optional Authentication Middleware
 * Attaches user to request if token is present, but doesn't block if not
 */
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const decoded = verifyToken(token);
        req.user = decoded;
      } catch (jwtError) {
        // Token is invalid, but we don't block the request
        // Just continue without user info
      }
    }
    
    next();
  } catch (error) {
    // Continue without user info on any error
    next();
  }
};

/**
 * Admin Role Check Middleware
 * Ensures the authenticated user has admin role
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
      data: null
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required',
      data: null
    });
  }

  next();
};

/**
 * Simple Admin Login Controller
 * This would typically be in a separate auth controller, but keeping it simple for now
 */
export const adminLogin = (req, res) => {
  try {
    const { username, password } = req.body;

    // Simple hardcoded admin credentials (in production, use proper authentication)
    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'admin123'; // In production, use hashed passwords

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        data: null
      });
    }

    // Generate JWT token
    const token = generateToken({
      username: ADMIN_USERNAME,
      role: 'admin',
      loginTime: new Date().toISOString()
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          username: ADMIN_USERNAME,
          role: 'admin'
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      data: null
    });
  }
};
