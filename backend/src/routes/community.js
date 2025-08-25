import express from 'express';
import { body, query, validationResult } from 'express-validator';
import CommunityPost from '../models/CommunityPost.js';
import { authenticateToken, requireRole, optionalAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// @route   GET /api/community/posts
// @desc    Get community posts
// @access  Public (with optional auth for personalization)
router.get('/posts',
  optionalAuth,
  [
    query('category').optional().isIn(['general', 'support', 'resources', 'success-stories', 'questions', 'tips']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    query('search').optional().isLength({ min: 1, max: 100 })
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
      page = 1,
      limit = 20,
      search,
      sortBy = 'recent' // recent, popular, pinned
    } = req.query;

    // Build filter
    const filter = { isModerated: false };
    if (category) filter.category = category;
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Children can only read posts, not see all content
    if (req.user && req.user.role === 'child') {
      // Additional filtering for child-appropriate content
      filter.category = { $in: ['general', 'success-stories', 'tips'] };
    }

    const skip = (page - 1) * limit;
    
    // Build sort criteria
    let sort = {};
    switch (sortBy) {
      case 'popular':
        sort = { 'likes.length': -1, createdAt: -1 };
        break;
      case 'pinned':
        sort = { isPinned: -1, createdAt: -1 };
        break;
      default: // recent
        sort = { isPinned: -1, createdAt: -1 };
    }

    const [posts, total] = await Promise.all([
      CommunityPost.find(filter)
        .populate('authorId', 'name role profilePicture')
        .populate('replies.authorId', 'name role profilePicture')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      CommunityPost.countDocuments(filter)
    ]);

    // Format posts for response
    const formattedPosts = posts.map(post => ({
      id: post._id,
      title: post.title,
      content: post.content,
      category: post.category,
      tags: post.tags,
      author: post.authorId,
      likes: post.likes.length,
      isLiked: req.user ? post.likes.some(like => like.userId.toString() === req.user._id.toString()) : false,
      replies: post.replies.length,
      views: post.views,
      isPinned: post.isPinned,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt
    }));

    res.json({
      posts: formattedPosts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  })
);

// @route   GET /api/community/posts/:id
// @desc    Get single post with replies
// @access  Public (with optional auth)
router.get('/posts/:id',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const post = await CommunityPost.findById(req.params.id)
      .populate('authorId', 'name role profilePicture')
      .populate('replies.authorId', 'name role profilePicture');

    if (!post || post.isModerated) {
      return res.status(404).json({
        message: 'Post not found',
        code: 'POST_NOT_FOUND'
      });
    }

    // Increment views
    await post.incrementViews();

    // Format post for response
    const formattedPost = {
      id: post._id,
      title: post.title,
      content: post.content,
      category: post.category,
      tags: post.tags,
      author: post.authorId,
      attachments: post.attachments,
      likes: post.likes.length,
      isLiked: req.user ? post.likes.some(like => like.userId.toString() === req.user._id.toString()) : false,
      replies: post.replies.map(reply => ({
        id: reply._id,
        content: reply.content,
        author: reply.authorId,
        likes: reply.likes.length,
        isLiked: req.user ? reply.likes.some(like => like.userId.toString() === req.user._id.toString()) : false,
        createdAt: reply.createdAt
      })),
      views: post.views,
      isPinned: post.isPinned,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt
    };

    res.json({ post: formattedPost });
  })
);

// @route   POST /api/community/posts
// @desc    Create new post
// @access  Private (parent, teacher, admin only)
router.post('/posts',
  authenticateToken,
  requireRole('parent', 'teacher', 'admin'),
  [
    body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be 5-200 characters'),
    body('content').trim().isLength({ min: 10, max: 5000 }).withMessage('Content must be 10-5000 characters'),
    body('category').isIn(['general', 'support', 'resources', 'success-stories', 'questions', 'tips']).withMessage('Invalid category'),
    body('tags').optional().isArray().withMessage('Tags must be an array')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, content, category, tags = [] } = req.body;

    const post = new CommunityPost({
      title,
      content,
      category,
      tags: tags.map(tag => tag.toLowerCase().trim()),
      authorId: req.user._id
    });

    await post.save();
    await post.populate('authorId', 'name role profilePicture');

    res.status(201).json({
      message: 'Post created successfully',
      post: {
        id: post._id,
        title: post.title,
        content: post.content,
        category: post.category,
        tags: post.tags,
        author: post.authorId,
        likes: 0,
        replies: 0,
        views: 0,
        createdAt: post.createdAt
      }
    });
  })
);

// @route   POST /api/community/posts/:id/reply
// @desc    Reply to a post
// @access  Private (parent, teacher, admin only)
router.post('/posts/:id/reply',
  authenticateToken,
  requireRole('parent', 'teacher', 'admin'),
  [
    body('content').trim().isLength({ min: 1, max: 2000 }).withMessage('Reply content must be 1-2000 characters')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { content } = req.body;
    const post = await CommunityPost.findById(req.params.id);

    if (!post || post.isModerated) {
      return res.status(404).json({
        message: 'Post not found',
        code: 'POST_NOT_FOUND'
      });
    }

    await post.addReply(req.user._id, content);
    await post.populate('replies.authorId', 'name role profilePicture');

    const newReply = post.replies[post.replies.length - 1];

    res.status(201).json({
      message: 'Reply added successfully',
      reply: {
        id: newReply._id,
        content: newReply.content,
        author: newReply.authorId,
        likes: 0,
        createdAt: newReply.createdAt
      }
    });
  })
);

// @route   POST /api/community/posts/:id/like
// @desc    Like/unlike a post
// @access  Private
router.post('/posts/:id/like',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const post = await CommunityPost.findById(req.params.id);

    if (!post || post.isModerated) {
      return res.status(404).json({
        message: 'Post not found',
        code: 'POST_NOT_FOUND'
      });
    }

    await post.toggleLike(req.user._id);

    const isLiked = post.likes.some(like => like.userId.toString() === req.user._id.toString());

    res.json({
      message: isLiked ? 'Post liked' : 'Post unliked',
      isLiked,
      likesCount: post.likes.length
    });
  })
);

// @route   PUT /api/community/posts/:id
// @desc    Update post
// @access  Private (author or admin)
router.put('/posts/:id',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
        code: 'POST_NOT_FOUND'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && post.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Not authorized to update this post',
        code: 'UNAUTHORIZED_UPDATE'
      });
    }

    const updatedPost = await CommunityPost.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('authorId', 'name role profilePicture');

    res.json({
      message: 'Post updated successfully',
      post: updatedPost
    });
  })
);

// @route   DELETE /api/community/posts/:id
// @desc    Delete post (admin only) or moderate post
// @access  Private (admin)
router.delete('/posts/:id',
  authenticateToken,
  requireRole('admin'),
  [
    body('reason').optional().isLength({ min: 1, max: 500 }).withMessage('Moderation reason must be 1-500 characters')
  ],
  asyncHandler(async (req, res) => {
    const { reason } = req.body;
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
        code: 'POST_NOT_FOUND'
      });
    }

    // Moderate post instead of deleting
    post.isModerated = true;
    post.moderationReason = reason || 'Content moderated by admin';
    post.moderatedBy = req.user._id;
    await post.save();

    res.json({
      message: 'Post moderated successfully'
    });
  })
);

// @route   GET /api/community/categories
// @desc    Get available categories
// @access  Public
router.get('/categories', (req, res) => {
  const categories = [
    { value: 'general', label: 'General Discussion', description: 'General conversations and topics' },
    { value: 'support', label: 'Support & Advice', description: 'Get help and support from the community' },
    { value: 'resources', label: 'Resources & Tools', description: 'Share useful resources and tools' },
    { value: 'success-stories', label: 'Success Stories', description: 'Share inspiring success stories' },
    { value: 'questions', label: 'Questions & Answers', description: 'Ask questions and get answers' },
    { value: 'tips', label: 'Tips & Tricks', description: 'Share helpful tips and strategies' }
  ];

  res.json({ categories });
});

export default router;
