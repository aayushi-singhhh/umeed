import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Reply content is required'],
    maxlength: [2000, 'Reply cannot exceed 2000 characters']
  },
  likes: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    likedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isModerated: {
    type: Boolean,
    default: false
  },
  moderationReason: String
}, {
  timestamps: true
});

const communityPostSchema = new mongoose.Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Post content is required'],
    maxlength: [5000, 'Content cannot exceed 5000 characters']
  },
  category: {
    type: String,
    enum: ['general', 'support', 'resources', 'success-stories', 'questions', 'tips'],
    required: [true, 'Category is required']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  attachments: [{
    name: String,
    url: String,
    type: {
      type: String,
      enum: ['image', 'document', 'video']
    },
    size: Number
  }],
  likes: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    likedAt: {
      type: Date,
      default: Date.now
    }
  }],
  replies: [replySchema],
  views: {
    type: Number,
    default: 0
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isModerated: {
    type: Boolean,
    default: false
  },
  moderationReason: String,
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better search performance
communityPostSchema.index({ authorId: 1 });
communityPostSchema.index({ category: 1 });
communityPostSchema.index({ tags: 1 });
communityPostSchema.index({ createdAt: -1 });
communityPostSchema.index({ isPinned: -1, createdAt: -1 });

// Method to add a reply
communityPostSchema.methods.addReply = function(authorId, content) {
  this.replies.push({
    authorId,
    content
  });
  return this.save();
};

// Method to like/unlike post
communityPostSchema.methods.toggleLike = function(userId) {
  const existingLike = this.likes.find(like => 
    like.userId.toString() === userId.toString()
  );
  
  if (existingLike) {
    this.likes = this.likes.filter(like => 
      like.userId.toString() !== userId.toString()
    );
  } else {
    this.likes.push({ userId });
  }
  
  return this.save();
};

// Method to increment views
communityPostSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

export default mongoose.model('CommunityPost', communityPostSchema);
