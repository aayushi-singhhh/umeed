import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Exercise title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Exercise description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    enum: ['reading', 'math', 'memory', 'social', 'attention', 'motor-skills'],
    required: [true, 'Category is required']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: [true, 'Difficulty level is required']
  },
  disabilityType: {
    type: String,
    enum: ['dyslexia', 'adhd', 'autism', 'dyscalculia', 'general'],
    required: [true, 'Target disability type is required']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required']
  },
  content: {
    type: {
      type: String,
      enum: ['multiple-choice', 'drag-drop', 'text-input', 'game', 'video'],
      required: true
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  },
  estimatedDuration: {
    type: Number, // in minutes
    default: 10,
    min: 1,
    max: 60
  },
  ageRange: {
    min: {
      type: Number,
      default: 3
    },
    max: {
      type: Number,
      default: 18
    }
  },
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  resources: [{
    name: String,
    url: String,
    type: {
      type: String,
      enum: ['image', 'video', 'audio', 'document']
    }
  }]
}, {
  timestamps: true
});

// Index for better search performance
exerciseSchema.index({ category: 1, difficulty: 1, disabilityType: 1 });
exerciseSchema.index({ createdBy: 1 });
exerciseSchema.index({ tags: 1 });

export default mongoose.model('Exercise', exerciseSchema);
