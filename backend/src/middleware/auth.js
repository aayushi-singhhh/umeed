import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        message: 'Access token required',
        code: 'NO_TOKEN'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Get user from database to ensure they still exist and are active
    const user = await User.findById(decoded.userId).select('-passwordHash');
    
    if (!user || !user.isActive) {
      return res.status(401).json({ 
        message: 'Invalid token or user not found',
        code: 'INVALID_TOKEN'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }

    res.status(500).json({ 
      message: 'Authentication error',
      code: 'AUTH_ERROR'
    });
  }
};

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Authentication required',
        code: 'NO_AUTH'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: allowedRoles,
        current: req.user.role
      });
    }

    next();
  };
};

export const requireChildAccess = async (req, res, next) => {
  try {
    const { childId } = req.params;
    const user = req.user;

    // Admin can access any child
    if (user.role === 'admin') {
      return next();
    }

    // Child can only access their own data
    if (user.role === 'child' && user._id.toString() === childId) {
      return next();
    }

    // Parent can access their linked children
    if (user.role === 'parent' && user.linkedChildIds.includes(childId)) {
      return next();
    }

    // Teacher can access children they teach
    if (user.role === 'teacher') {
      const ChildProfile = (await import('../models/ChildProfile.js')).default;
      const childProfile = await ChildProfile.findOne({ 
        userId: childId, 
        teacherIds: user._id 
      });
      
      if (childProfile) {
        return next();
      }
    }

    return res.status(403).json({ 
      message: 'Access denied to this child\'s data',
      code: 'CHILD_ACCESS_DENIED'
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error checking child access permissions',
      code: 'ACCESS_CHECK_ERROR'
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = await User.findById(decoded.userId).select('-passwordHash');
      
      if (user && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};
