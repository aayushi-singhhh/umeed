import mongoose from 'mongoose';

const childProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [3, 'Age must be at least 3'],
    max: [18, 'Age cannot exceed 18']
  },
  disabilityType: {
    type: String,
    enum: ['dyslexia', 'adhd', 'autism', 'dyscalculia', 'other'],
    required: [true, 'Disability type is required']
  },
  interests: [{
    type: String,
    trim: true
  }],
  progressScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  parentIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  teacherIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  preferences: {
    gamificationLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    difficultyPreference: {
      type: String,
      enum: ['adaptive', 'fixed-easy', 'fixed-medium', 'fixed-hard'],
      default: 'adaptive'
    },
    sessionDuration: {
      type: Number,
      default: 15, // minutes
      min: 5,
      max: 60
    }
  },
  achievements: [{
    name: String,
    description: String,
    earnedAt: {
      type: Date,
      default: Date.now
    },
    icon: String
  }]
}, {
  timestamps: true
});

// Calculate progress score based on completed exercises
childProfileSchema.methods.updateProgressScore = async function() {
  const Progress = mongoose.model('ChildExerciseProgress');
  const completedExercises = await Progress.find({
    childId: this.userId,
    status: 'completed'
  });
  
  if (completedExercises.length === 0) {
    this.progressScore = 0;
    return;
  }
  
  const averageScore = completedExercises.reduce((sum, exercise) => 
    sum + exercise.score, 0) / completedExercises.length;
  
  this.progressScore = Math.round(averageScore);
  await this.save();
};

export default mongoose.model('ChildProfile', childProfileSchema);
