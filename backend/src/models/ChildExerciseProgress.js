import mongoose from 'mongoose';

const childExerciseProgressSchema = new mongoose.Schema({
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Child ID is required']
  },
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: [true, 'Exercise ID is required']
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed', 'skipped'],
    default: 'not-started'
  },
  score: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  attempts: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  responses: [{
    question: String,
    answer: mongoose.Schema.Types.Mixed,
    isCorrect: Boolean,
    timeToAnswer: Number, // in seconds
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  feedback: {
    strengths: [String],
    improvements: [String],
    nextSteps: [String]
  },
  assignedAt: {
    type: Date,
    default: Date.now
  },
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  dueDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
childExerciseProgressSchema.index({ childId: 1, exerciseId: 1 }, { unique: true });
childExerciseProgressSchema.index({ childId: 1, status: 1 });
childExerciseProgressSchema.index({ assignedBy: 1 });

// Method to calculate score based on responses
childExerciseProgressSchema.methods.calculateScore = function() {
  if (this.responses.length === 0) return 0;
  
  const correctResponses = this.responses.filter(response => response.isCorrect).length;
  const score = Math.round((correctResponses / this.responses.length) * 100);
  
  this.score = score;
  return score;
};

// Method to update status based on progress
childExerciseProgressSchema.methods.updateStatus = function() {
  if (this.completedAt) {
    this.status = 'completed';
  } else if (this.startedAt) {
    this.status = 'in-progress';
  }
};

export default mongoose.model('ChildExerciseProgress', childExerciseProgressSchema);
