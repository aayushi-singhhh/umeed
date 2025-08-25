import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import ChildProfile from '../models/ChildProfile.js';
import { authenticateToken, requireRole, requireChildAccess } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// @route   GET /api/users/children
// @desc    Get children linked to current user
// @access  Private (parent, teacher, admin)
router.get('/children', 
  authenticateToken, 
  requireRole('parent', 'teacher', 'admin'),
  asyncHandler(async (req, res) => {
    const user = req.user;
    let children = [];

    if (user.role === 'parent') {
      children = await User.find({ 
        _id: { $in: user.linkedChildIds },
        isActive: true 
      }).select('name email createdAt');
      
      // Get profiles for each child
      for (let child of children) {
        const profile = await ChildProfile.findOne({ userId: child._id });
        child.profile = profile;
      }
    } else if (user.role === 'teacher') {
      const profiles = await ChildProfile.find({ 
        teacherIds: user._id 
      }).populate('userId', 'name email createdAt');
      
      children = profiles.map(profile => ({
        ...profile.userId.toObject(),
        profile
      }));
    } else if (user.role === 'admin') {
      const profiles = await ChildProfile.find({}).populate('userId', 'name email createdAt');
      children = profiles.map(profile => ({
        ...profile.userId.toObject(),
        profile
      }));
    }

    res.json({
      children
    });
  })
);

// @route   GET /api/users/child/:childId
// @desc    Get specific child details
// @access  Private (requires child access)
router.get('/child/:childId',
  authenticateToken,
  requireChildAccess,
  asyncHandler(async (req, res) => {
    const { childId } = req.params;
    
    const child = await User.findById(childId).select('name email createdAt isActive');
    if (!child) {
      return res.status(404).json({
        message: 'Child not found',
        code: 'CHILD_NOT_FOUND'
      });
    }

    const profile = await ChildProfile.findOne({ userId: childId })
      .populate('parentIds', 'name email')
      .populate('teacherIds', 'name email');

    res.json({
      child: {
        ...child.toObject(),
        profile
      }
    });
  })
);

// @route   PUT /api/users/child/:childId
// @desc    Update child profile
// @access  Private (requires child access)
router.put('/child/:childId',
  authenticateToken,
  requireChildAccess,
  [
    body('age').optional().isInt({ min: 3, max: 18 }).withMessage('Age must be between 3 and 18'),
    body('disabilityType').optional().isIn(['dyslexia', 'adhd', 'autism', 'dyscalculia', 'other']).withMessage('Invalid disability type'),
    body('interests').optional().isArray().withMessage('Interests must be an array')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { childId } = req.params;
    const updateData = req.body;

    // Update child user if name is provided
    if (updateData.name) {
      await User.findByIdAndUpdate(childId, { name: updateData.name });
      delete updateData.name;
    }

    // Update child profile
    const profile = await ChildProfile.findOneAndUpdate(
      { userId: childId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({
        message: 'Child profile not found',
        code: 'PROFILE_NOT_FOUND'
      });
    }

    res.json({
      message: 'Child profile updated successfully',
      profile
    });
  })
);

// @route   POST /api/users/link-child
// @desc    Link a child to parent/teacher
// @access  Private (parent, teacher, admin)
router.post('/link-child',
  authenticateToken,
  requireRole('parent', 'teacher', 'admin'),
  [
    body('childId').isMongoId().withMessage('Valid child ID required')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { childId } = req.body;
    const user = req.user;

    // Check if child exists
    const child = await User.findById(childId);
    if (!child || child.role !== 'child') {
      return res.status(404).json({
        message: 'Child not found',
        code: 'CHILD_NOT_FOUND'
      });
    }

    const profile = await ChildProfile.findOne({ userId: childId });
    if (!profile) {
      return res.status(404).json({
        message: 'Child profile not found',
        code: 'PROFILE_NOT_FOUND'
      });
    }

    if (user.role === 'parent') {
      // Check if already linked
      if (user.linkedChildIds.includes(childId)) {
        return res.status(400).json({
          message: 'Child already linked to this parent',
          code: 'ALREADY_LINKED'
        });
      }

      // Link child to parent
      user.linkedChildIds.push(childId);
      await user.save();

      profile.parentIds.push(user._id);
      await profile.save();
    } else if (user.role === 'teacher') {
      // Check if already linked
      if (profile.teacherIds.includes(user._id)) {
        return res.status(400).json({
          message: 'Child already linked to this teacher',
          code: 'ALREADY_LINKED'
        });
      }

      profile.teacherIds.push(user._id);
      await profile.save();
    }

    res.json({
      message: 'Child linked successfully'
    });
  })
);

// @route   DELETE /api/users/unlink-child/:childId
// @desc    Unlink a child from parent/teacher
// @access  Private (parent, teacher, admin)
router.delete('/unlink-child/:childId',
  authenticateToken,
  requireRole('parent', 'teacher', 'admin'),
  asyncHandler(async (req, res) => {
    const { childId } = req.params;
    const user = req.user;

    const profile = await ChildProfile.findOne({ userId: childId });
    if (!profile) {
      return res.status(404).json({
        message: 'Child profile not found',
        code: 'PROFILE_NOT_FOUND'
      });
    }

    if (user.role === 'parent') {
      // Remove from parent's linked children
      user.linkedChildIds = user.linkedChildIds.filter(id => 
        id.toString() !== childId
      );
      await user.save();

      // Remove from child's parents
      profile.parentIds = profile.parentIds.filter(id => 
        id.toString() !== user._id.toString()
      );
      await profile.save();
    } else if (user.role === 'teacher') {
      // Remove from child's teachers
      profile.teacherIds = profile.teacherIds.filter(id => 
        id.toString() !== user._id.toString()
      );
      await profile.save();
    }

    res.json({
      message: 'Child unlinked successfully'
    });
  })
);

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', authenticateToken, asyncHandler(async (req, res) => {
  const user = req.user;
  let profile = null;

  if (user.role === 'child') {
    profile = await ChildProfile.findOne({ userId: user._id })
      .populate('parentIds', 'name email')
      .populate('teacherIds', 'name email');
  }

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      linkedChildIds: user.linkedChildIds,
      lastLogin: user.lastLogin,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt
    },
    profile
  });
}));

export default router;
