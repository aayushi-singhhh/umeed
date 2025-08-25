import express from 'express';
import { body, query, validationResult } from 'express-validator';
import ChildExerciseProgress from '../models/ChildExerciseProgress.js';
import Exercise from '../models/Exercise.js';
import ChildProfile from '../models/ChildProfile.js';
import Notification from '../models/Notification.js';
import { authenticateToken, requireChildAccess } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// @route   GET /api/progress/child/:childId
// @desc    Get progress for a specific child
// @access  Private (requires child access)
router.get('/child/:childId',
  authenticateToken,
  requireChildAccess,
  [
    query('status').optional().isIn(['not-started', 'in-progress', 'completed', 'skipped']),
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

    const { childId } = req.params;
    const { status, page = 1, limit = 20 } = req.query;

    const filter = { childId };
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const [progressRecords, total] = await Promise.all([
      ChildExerciseProgress.find(filter)
        .populate('exerciseId', 'title description category difficulty')
        .populate('assignedBy', 'name email role')
        .sort({ assignedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      ChildExerciseProgress.countDocuments(filter)
    ]);

    // Calculate summary statistics
    const stats = await ChildExerciseProgress.aggregate([
      { $match: { childId: childId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgScore: { $avg: '$score' }
        }
      }
    ]);

    const summary = {
      total: 0,
      notStarted: 0,
      inProgress: 0,
      completed: 0,
      skipped: 0,
      averageScore: 0
    };

    stats.forEach(stat => {
      summary.total += stat.count;
      switch (stat._id) {
        case 'not-started':
          summary.notStarted = stat.count;
          break;
        case 'in-progress':
          summary.inProgress = stat.count;
          break;
        case 'completed':
          summary.completed = stat.count;
          summary.averageScore = stat.avgScore || 0;
          break;
        case 'skipped':
          summary.skipped = stat.count;
          break;
      }
    });

    res.json({
      progress: progressRecords,
      summary,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  })
);

// @route   GET /api/progress/:progressId
// @desc    Get specific progress record
// @access  Private
router.get('/:progressId',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const progress = await ChildExerciseProgress.findById(req.params.progressId)
      .populate('exerciseId')
      .populate('assignedBy', 'name email role')
      .populate('childId', 'name email');

    if (!progress) {
      return res.status(404).json({
        message: 'Progress record not found',
        code: 'PROGRESS_NOT_FOUND'
      });
    }

    // Check access permissions
    const user = req.user;
    let hasAccess = false;

    if (user.role === 'admin') {
      hasAccess = true;
    } else if (user.role === 'child' && user._id.toString() === progress.childId._id.toString()) {
      hasAccess = true;
    } else if (user.role === 'parent' && user.linkedChildIds.includes(progress.childId._id)) {
      hasAccess = true;
    } else if (user.role === 'teacher') {
      const childProfile = await ChildProfile.findOne({ 
        userId: progress.childId._id, 
        teacherIds: user._id 
      });
      hasAccess = !!childProfile;
    }

    if (!hasAccess) {
      return res.status(403).json({
        message: 'Access denied to this progress record',
        code: 'ACCESS_DENIED'
      });
    }

    res.json({ progress });
  })
);

// @route   POST /api/progress/:progressId/start
// @desc    Start an exercise
// @access  Private (child only)
router.post('/:progressId/start',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const progress = await ChildExerciseProgress.findById(req.params.progressId);

    if (!progress) {
      return res.status(404).json({
        message: 'Progress record not found',
        code: 'PROGRESS_NOT_FOUND'
      });
    }

    // Only the assigned child can start the exercise
    if (req.user._id.toString() !== progress.childId.toString()) {
      return res.status(403).json({
        message: 'Only the assigned child can start this exercise',
        code: 'UNAUTHORIZED_START'
      });
    }

    if (progress.status === 'completed') {
      return res.status(400).json({
        message: 'Exercise already completed',
        code: 'ALREADY_COMPLETED'
      });
    }

    progress.status = 'in-progress';
    progress.startedAt = new Date();
    await progress.save();

    res.json({
      message: 'Exercise started successfully',
      progress
    });
  })
);

// @route   POST /api/progress/:progressId/submit
// @desc    Submit exercise response
// @access  Private (child only)
router.post('/:progressId/submit',
  authenticateToken,
  [
    body('responses').isArray().withMessage('Responses must be an array'),
    body('timeSpent').optional().isInt({ min: 0 }).withMessage('Time spent must be a positive number')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { responses, timeSpent = 0 } = req.body;
    const progress = await ChildExerciseProgress.findById(req.params.progressId)
      .populate('exerciseId');

    if (!progress) {
      return res.status(404).json({
        message: 'Progress record not found',
        code: 'PROGRESS_NOT_FOUND'
      });
    }

    // Only the assigned child can submit
    if (req.user._id.toString() !== progress.childId.toString()) {
      return res.status(403).json({
        message: 'Only the assigned child can submit this exercise',
        code: 'UNAUTHORIZED_SUBMIT'
      });
    }

    if (progress.status === 'completed') {
      return res.status(400).json({
        message: 'Exercise already completed',
        code: 'ALREADY_COMPLETED'
      });
    }

    // Update progress
    progress.responses = responses;
    progress.timeSpent += timeSpent;
    progress.attempts += 1;
    progress.status = 'completed';
    progress.completedAt = new Date();

    // Calculate score
    progress.calculateScore();

    await progress.save();

    // Update child's overall progress score
    const childProfile = await ChildProfile.findOne({ userId: progress.childId });
    if (childProfile) {
      await childProfile.updateProgressScore();
    }

    // Create notification for parents/teachers
    const notificationPromises = [];
    
    if (childProfile) {
      // Notify parents
      childProfile.parentIds.forEach(parentId => {
        notificationPromises.push(
          Notification.createNotification({
            userId: parentId,
            type: 'progressUpdate',
            title: 'Child Completed Exercise',
            message: `${req.user.name} completed "${progress.exerciseId.title}" with a score of ${progress.score}%`,
            data: {
              childId: progress.childId,
              exerciseId: progress.exerciseId._id,
              score: progress.score
            },
            actionUrl: `/progress/${progress._id}`
          })
        );
      });

      // Notify teachers
      childProfile.teacherIds.forEach(teacherId => {
        notificationPromises.push(
          Notification.createNotification({
            userId: teacherId,
            type: 'progressUpdate',
            title: 'Student Completed Exercise',
            message: `${req.user.name} completed "${progress.exerciseId.title}" with a score of ${progress.score}%`,
            data: {
              childId: progress.childId,
              exerciseId: progress.exerciseId._id,
              score: progress.score
            },
            actionUrl: `/progress/${progress._id}`
          })
        );
      });
    }

    await Promise.all(notificationPromises);

    res.json({
      message: 'Exercise submitted successfully',
      progress,
      score: progress.score
    });
  })
);

// @route   GET /api/progress/analytics/child/:childId
// @desc    Get detailed analytics for a child
// @access  Private (requires child access)
router.get('/analytics/child/:childId',
  authenticateToken,
  requireChildAccess,
  asyncHandler(async (req, res) => {
    const { childId } = req.params;
    const { startDate, endDate } = req.query;

    const filter = { childId, status: 'completed' };
    
    if (startDate && endDate) {
      filter.completedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Get progress over time
    const progressOverTime = await ChildExerciseProgress.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            year: { $year: '$completedAt' },
            month: { $month: '$completedAt' },
            day: { $dayOfMonth: '$completedAt' }
          },
          averageScore: { $avg: '$score' },
          exercisesCompleted: { $sum: 1 },
          totalTimeSpent: { $sum: '$timeSpent' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Get performance by category
    const performanceByCategory = await ChildExerciseProgress.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'exercises',
          localField: 'exerciseId',
          foreignField: '_id',
          as: 'exercise'
        }
      },
      { $unwind: '$exercise' },
      {
        $group: {
          _id: '$exercise.category',
          averageScore: { $avg: '$score' },
          exercisesCompleted: { $sum: 1 },
          totalTimeSpent: { $sum: '$timeSpent' }
        }
      }
    ]);

    // Get performance by difficulty
    const performanceByDifficulty = await ChildExerciseProgress.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'exercises',
          localField: 'exerciseId',
          foreignField: '_id',
          as: 'exercise'
        }
      },
      { $unwind: '$exercise' },
      {
        $group: {
          _id: '$exercise.difficulty',
          averageScore: { $avg: '$score' },
          exercisesCompleted: { $sum: 1 }
        }
      }
    ]);

    // Get recent achievements
    const childProfile = await ChildProfile.findOne({ userId: childId });
    const recentAchievements = childProfile ? 
      childProfile.achievements
        .sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt))
        .slice(0, 5) : [];

    res.json({
      analytics: {
        progressOverTime,
        performanceByCategory,
        performanceByDifficulty,
        recentAchievements,
        overallStats: {
          totalExercisesCompleted: performanceByCategory.reduce((sum, cat) => sum + cat.exercisesCompleted, 0),
          overallAverageScore: performanceByCategory.reduce((sum, cat) => sum + cat.averageScore, 0) / performanceByCategory.length || 0,
          totalTimeSpent: performanceByCategory.reduce((sum, cat) => sum + cat.totalTimeSpent, 0)
        }
      }
    });
  })
);

export default router;
