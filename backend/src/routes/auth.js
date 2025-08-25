import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import ChildProfile from '../models/ChildProfile.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Validation rules
const registerValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['parent', 'teacher', 'admin']).withMessage('Invalid role - children cannot register independently')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required')
];

const createChildValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('age').isInt({ min: 3, max: 18 }).withMessage('Age must be between 3 and 18'),
  body('disabilityType').isIn(['dyslexia', 'adhd', 'autism', 'dyscalculia', 'other']).withMessage('Invalid disability type'),
  body('interests').optional().isArray().withMessage('Interests must be an array')
];

// @route   POST /api/auth/register
// @desc    Register a new user (parent, teacher, admin only)
// @access  Public
router.post('/register', registerValidation, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { name, email, password, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      message: 'User with this email already exists',
      code: 'USER_EXISTS'
    });
  }

  // Create user
  const user = new User({
    name,
    email,
    passwordHash: password, // Will be hashed by pre-save hook
    role
  });

  await user.save();

  // Generate token
  const token = generateToken(user._id);

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
}));

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', loginValidation, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { email, password } = req.body;

  // Find user and include password for comparison
  const user = await User.findOne({ email, isActive: true });
  if (!user) {
    return res.status(401).json({
      message: 'Invalid credentials',
      code: 'INVALID_CREDENTIALS'
    });
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({
      message: 'Invalid credentials',
      code: 'INVALID_CREDENTIALS'
    });
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate token
  const token = generateToken(user._id);

  // Get additional data based on role
  let additionalData = {};
  if (user.role === 'child') {
    const childProfile = await ChildProfile.findOne({ userId: user._id });
    additionalData.profile = childProfile;
  } else if (user.role === 'parent') {
    additionalData.children = await User.find({ 
      _id: { $in: user.linkedChildIds },
      isActive: true 
    }).select('name email');
  }

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      linkedChildIds: user.linkedChildIds,
      lastLogin: user.lastLogin,
      ...additionalData
    }
  });
}));

// @route   POST /api/auth/create-child
// @desc    Create a child account (parent/teacher/admin only)
// @access  Private
router.post('/create-child', 
  authenticateToken, 
  requireRole('parent', 'teacher', 'admin'),
  createChildValidation,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, age, disabilityType, interests = [] } = req.body;
    const creator = req.user;

    // Generate email for child (internal use)
    const childEmail = `child_${Date.now()}_${Math.random().toString(36).substr(2, 9)}@umeed.internal`;
    
    // Generate a temporary password (will be changed in first login)
    const tempPassword = `temp_${Math.random().toString(36).substr(2, 12)}`;

    // Create child user
    const childUser = new User({
      name,
      email: childEmail,
      passwordHash: tempPassword,
      role: 'child'
    });

    await childUser.save();

    // Create child profile
    const childProfile = new ChildProfile({
      userId: childUser._id,
      age,
      disabilityType,
      interests,
      parentIds: creator.role === 'parent' ? [creator._id] : [],
      teacherIds: creator.role === 'teacher' ? [creator._id] : []
    });

    await childProfile.save();

    // Link child to creator
    if (creator.role === 'parent') {
      creator.linkedChildIds.push(childUser._id);
      await creator.save();
    }

    res.status(201).json({
      message: 'Child account created successfully',
      child: {
        id: childUser._id,
        name: childUser.name,
        profile: childProfile
      }
    });
  })
);

// @route   GET /api/auth/me
// @desc    Get current user info
// @access  Private
router.get('/me', authenticateToken, asyncHandler(async (req, res) => {
  const user = req.user;
  let additionalData = {};

  if (user.role === 'child') {
    const childProfile = await ChildProfile.findOne({ userId: user._id });
    additionalData.profile = childProfile;
  } else if (user.role === 'parent') {
    const children = await User.find({ 
      _id: { $in: user.linkedChildIds },
      isActive: true 
    }).select('name email');
    additionalData.children = children;
  }

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      linkedChildIds: user.linkedChildIds,
      lastLogin: user.lastLogin,
      ...additionalData
    }
  });
}));

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', authenticateToken, asyncHandler(async (req, res) => {
  // In a more advanced implementation, you might blacklist the token
  res.json({
    message: 'Logged out successfully'
  });
}));

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', 
  authenticateToken,
  [
    body('currentPassword').notEmpty().withMessage('Current password required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        message: 'Current password is incorrect',
        code: 'INVALID_CURRENT_PASSWORD'
      });
    }

    // Update password
    user.passwordHash = newPassword;
    await user.save();

    res.json({
      message: 'Password updated successfully'
    });
  })
);

export default router;
