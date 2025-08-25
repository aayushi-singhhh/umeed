import express from 'express';
import { body, query, validationResult } from 'express-validator';
import Exercise from '../models/Exercise.js';
import ChildExerciseProgress from '../models/ChildExerciseProgress.js';
import Notification from '../models/Notification.js';
import { authenticateToken, requireRole, requireChildAccess } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// @route   GET /api/exercises
// @desc    Get exercises (filtered by query parameters)
// @access  Private
router.get('/',
  authenticateToken,
  [
    query('category').optional().isIn(['reading', 'math', 'memory', 'social', 'attention', 'motor-skills']),
    query('difficulty').optional().isIn(['easy', 'medium', 'hard']),
    query('disabilityType').optional().isIn(['dyslexia', 'adhd', 'autism', 'dyscalculia', 'general']),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
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
      category,
      difficulty,
      disabilityType,
      page = 1,
      limit = 20,
      search
    } = req.query;

    // Build filter
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (disabilityType) filter.disabilityType = disabilityType;
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Role-based filtering
    if (req.user.role === 'teacher') {
      // Teachers see their own exercises
      filter.createdBy = req.user._id;
    }

    const skip = (page - 1) * limit;
    
    const [exercises, total] = await Promise.all([
      Exercise.find(filter)
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Exercise.countDocuments(filter)
    ]);

    res.json({
      exercises,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  })
);

// @route   GET /api/exercises/:id
// @desc    Get single exercise
// @access  Private
router.get('/:id',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const exercise = await Exercise.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!exercise || !exercise.isActive) {
      return res.status(404).json({
        message: 'Exercise not found',
        code: 'EXERCISE_NOT_FOUND'
      });
    }

    res.json({ exercise });
  })
);

// @route   POST /api/exercises
// @desc    Create new exercise
// @access  Private (teacher, admin)
router.post('/',
  authenticateToken,
  requireRole('teacher', 'admin'),
  [
    body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be 5-200 characters'),
    body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters'),
    body('category').isIn(['reading', 'math', 'memory', 'social', 'attention', 'motor-skills']).withMessage('Invalid category'),
    body('difficulty').isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty'),
    body('disabilityType').isIn(['dyslexia', 'adhd', 'autism', 'dyscalculia', 'general']).withMessage('Invalid disability type'),
    body('content.type').isIn(['multiple-choice', 'drag-drop', 'text-input', 'game', 'video']).withMessage('Invalid content type'),
    body('content.data').notEmpty().withMessage('Content data is required')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const exerciseData = {
      ...req.body,
      createdBy: req.user._id
    };

    const exercise = new Exercise(exerciseData);
    await exercise.save();

    await exercise.populate('createdBy', 'name email');

    res.status(201).json({
      message: 'Exercise created successfully',
      exercise
    });
  })
);

// @route   PUT /api/exercises/:id
// @desc    Update exercise
// @access  Private (teacher who created it, admin)
router.put('/:id',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({
        message: 'Exercise not found',
        code: 'EXERCISE_NOT_FOUND'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && exercise.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Not authorized to update this exercise',
        code: 'UNAUTHORIZED_UPDATE'
      });
    }

    const updatedExercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    res.json({
      message: 'Exercise updated successfully',
      exercise: updatedExercise
    });
  })
);

// @route   DELETE /api/exercises/:id
// @desc    Delete (deactivate) exercise
// @access  Private (teacher who created it, admin)
router.delete('/:id',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({
        message: 'Exercise not found',
        code: 'EXERCISE_NOT_FOUND'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && exercise.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Not authorized to delete this exercise',
        code: 'UNAUTHORIZED_DELETE'
      });
    }

    // Soft delete by setting isActive to false
    exercise.isActive = false;
    await exercise.save();

    res.json({
      message: 'Exercise deleted successfully'
    });
  })
);

// @route   POST /api/exercises/assign
// @desc    Assign exercise to child
// @access  Private (parent, teacher, admin)
router.post('/assign',
  authenticateToken,
  requireRole('parent', 'teacher', 'admin'),
  [
    body('exerciseId').isMongoId().withMessage('Valid exercise ID required'),
    body('childId').isMongoId().withMessage('Valid child ID required'),
    body('dueDate').optional().isISO8601().withMessage('Valid due date required')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { exerciseId, childId, dueDate } = req.body;

    // Check if exercise exists
    const exercise = await Exercise.findById(exerciseId);
    if (!exercise || !exercise.isActive) {
      return res.status(404).json({
        message: 'Exercise not found',
        code: 'EXERCISE_NOT_FOUND'
      });
    }

    // Check if already assigned
    const existingProgress = await ChildExerciseProgress.findOne({
      childId,
      exerciseId
    });

    if (existingProgress) {
      return res.status(400).json({
        message: 'Exercise already assigned to this child',
        code: 'ALREADY_ASSIGNED'
      });
    }

    // Create progress record
    const progress = new ChildExerciseProgress({
      childId,
      exerciseId,
      assignedBy: req.user._id,
      dueDate: dueDate ? new Date(dueDate) : undefined
    });

    await progress.save();

    // Create notification for child
    await Notification.createNotification({
      userId: childId,
      type: 'exerciseAssigned',
      title: 'New Exercise Assigned',
      message: `You have a new exercise: ${exercise.title}`,
      data: {
        exerciseId,
        assignedBy: req.user._id
      },
      actionUrl: `/exercises/${exerciseId}`
    });

    res.status(201).json({
      message: 'Exercise assigned successfully',
      progress
    });
  })
);

export default router;
