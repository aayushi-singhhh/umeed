import express from 'express';
import { query, validationResult } from 'express-validator';
import Notification from '../models/Notification.js';
import { authenticateToken } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get notifications for current user
// @access  Private
router.get('/',
  authenticateToken,
  [
    query('isRead').optional().isBoolean().withMessage('isRead must be a boolean'),
    query('type').optional().isIn(['exerciseAssigned', 'progressUpdate', 'newPost', 'postReply', 'achievementUnlocked', 'sessionReminder', 'parentUpdate', 'teacherMessage']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      isRead,
      type,
      page = 1,
      limit = 20
    } = req.query;

    // Build filter
    const filter = { userId: req.user._id };
    if (isRead !== undefined) filter.isRead = isRead === 'true';
    if (type) filter.type = type;

    // Check for expired notifications and remove them
    await Notification.deleteMany({
      userId: req.user._id,
      expiresAt: { $lt: new Date() }
    });

    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Notification.countDocuments(filter),
      Notification.getUnreadCount(req.user._id)
    ]);

    res.json({
      notifications,
      unreadCount,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  })
);

// @route   GET /api/notifications/unread-count
// @desc    Get count of unread notifications
// @access  Private
router.get('/unread-count',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const unreadCount = await Notification.getUnreadCount(req.user._id);
    
    res.json({ unreadCount });
  })
);

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!notification) {
      return res.status(404).json({
        message: 'Notification not found',
        code: 'NOTIFICATION_NOT_FOUND'
      });
    }

    if (!notification.isRead) {
      await notification.markAsRead();
    }

    res.json({
      message: 'Notification marked as read',
      notification
    });
  })
);

// @route   PUT /api/notifications/mark-all-read
// @desc    Mark all notifications as read
// @access  Private
router.put('/mark-all-read',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const result = await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { 
        isRead: true, 
        readAt: new Date() 
      }
    );

    res.json({
      message: 'All notifications marked as read',
      modifiedCount: result.modifiedCount
    });
  })
);

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!notification) {
      return res.status(404).json({
        message: 'Notification not found',
        code: 'NOTIFICATION_NOT_FOUND'
      });
    }

    res.json({
      message: 'Notification deleted successfully'
    });
  })
);

// @route   DELETE /api/notifications/clear-all
// @desc    Clear all notifications for user
// @access  Private
router.delete('/clear-all',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const result = await Notification.deleteMany({ userId: req.user._id });

    res.json({
      message: 'All notifications cleared',
      deletedCount: result.deletedCount
    });
  })
);

// @route   GET /api/notifications/types
// @desc    Get available notification types
// @access  Private
router.get('/types',
  authenticateToken,
  (req, res) => {
    const types = [
      {
        value: 'exerciseAssigned',
        label: 'Exercise Assigned',
        description: 'When a new exercise is assigned to you'
      },
      {
        value: 'progressUpdate',
        label: 'Progress Update',
        description: 'When progress is made on exercises'
      },
      {
        value: 'newPost',
        label: 'New Community Post',
        description: 'When new posts are made in the community'
      },
      {
        value: 'postReply',
        label: 'Post Reply',
        description: 'When someone replies to your community post'
      },
      {
        value: 'achievementUnlocked',
        label: 'Achievement Unlocked',
        description: 'When you unlock a new achievement'
      },
      {
        value: 'sessionReminder',
        label: 'Session Reminder',
        description: 'Reminders for upcoming learning sessions'
      },
      {
        value: 'parentUpdate',
        label: 'Parent Update',
        description: 'Updates from parents to children'
      },
      {
        value: 'teacherMessage',
        label: 'Teacher Message',
        description: 'Messages from teachers'
      }
    ];

    res.json({ types });
  }
);

export default router;
