// Demo data for the learning disabilities support platform

export interface Child {
  id: string;
  name: string;
  age: number;
  grade: string;
  learningDifferences: string[];
  interests: string[];
  profileImage?: string;
  parentId: string;
  teacherId: string;
  therapistId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'parent' | 'teacher' | 'therapist' | 'child';
  profileImage?: string;
}

export interface GameProgress {
  gameId: string;
  gameName: string;
  category: 'reading' | 'math' | 'focus' | 'social';
  score: number;
  completedLevels: number;
  totalLevels: number;
  lastPlayed: string;
  timeSpent: number; // minutes
  improvements: string[];
}

export interface LearningMetrics {
  childId: string;
  date: string;
  tasksCompleted: number;
  totalTasks: number;
  focusTime: number; // minutes
  mood: 'happy' | 'neutral' | 'frustrated' | 'excited' | 'tired';
  gameScores: {
    reading: number;
    math: number;
    focus: number;
    social: number;
  };
  streakDays: number;
  badgesEarned: string[];
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  recipientId: string;
  content: string;
  timestamp: string;
  read: boolean;
  subject?: string;
  attachments?: string[];
}

export interface AIInsight {
  id: string;
  childId: string;
  type: 'recommendation' | 'alert' | 'milestone' | 'pattern';
  title: string;
  description: string;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high';
  timestamp: string;
  data?: any;
}

// Demo Users
export const demoUsers: User[] = [
  {
    id: 'parent1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    role: 'parent',
    profileImage: '👩‍💼'
  },
  {
    id: 'parent2',
    name: 'Mike Chen',
    email: 'mike.chen@example.com',
    role: 'parent',
    profileImage: '👨‍💻'
  },
  {
    id: 'teacher1',
    name: 'Ms. Rodriguez',
    email: 'elena.rodriguez@school.edu',
    role: 'teacher',
    profileImage: '👩‍🏫'
  },
  {
    id: 'therapist1',
    name: 'Dr. Thompson',
    email: 'david.thompson@therapy.com',
    role: 'therapist',
    profileImage: '👨‍⚕️'
  },
  {
    id: 'child1',
    name: 'Alex Johnson',
    email: '',
    role: 'child',
    profileImage: '🧒'
  },
  {
    id: 'child2',
    name: 'Emma Chen',
    email: '',
    role: 'child',
    profileImage: '👧'
  }
];

// Demo Children
export const demoChildren: Child[] = [
  {
    id: 'child1',
    name: 'Alex Johnson',
    age: 8,
    grade: '3rd Grade',
    learningDifferences: ['ADHD', 'Dyslexia'],
    interests: ['dinosaurs', 'space', 'building blocks', 'video games'],
    profileImage: '🧒',
    parentId: 'parent1',
    teacherId: 'teacher1',
    therapistId: 'therapist1'
  },
  {
    id: 'child2',
    name: 'Emma Chen',
    age: 7,
    grade: '2nd Grade',
    learningDifferences: ['Autism Spectrum', 'Social Communication'],
    interests: ['art', 'animals', 'puzzles', 'music'],
    profileImage: '👧',
    parentId: 'parent2',
    teacherId: 'teacher1'
  },
  {
    id: 'child3',
    name: 'Maya Rodriguez',
    age: 9,
    grade: '4th Grade',
    learningDifferences: ['Dyscalculia', 'Anxiety'],
    interests: ['reading', 'cooking', 'pets', 'dancing'],
    profileImage: '👧',
    parentId: 'parent1',
    teacherId: 'teacher1'
  }
];

// Demo Game Progress
export const demoGameProgress: GameProgress[] = [
  {
    gameId: 'dyslexia-safari',
    gameName: 'Safari Word Adventure',
    category: 'reading',
    score: 78,
    completedLevels: 12,
    totalLevels: 20,
    lastPlayed: '2025-08-21T10:30:00Z',
    timeSpent: 25,
    improvements: ['Letter recognition up 15%', 'Reading speed improved']
  },
  {
    gameId: 'adhd-treasure',
    gameName: 'Treasure Hunt Memory',
    category: 'focus',
    score: 88,
    completedLevels: 8,
    totalLevels: 15,
    lastPlayed: '2025-08-21T14:20:00Z',
    timeSpent: 18,
    improvements: ['Attention span increased', 'Sequence memory better']
  },
  {
    gameId: 'dyscalculia-pizza',
    gameName: 'Pizza Fractions',
    category: 'math',
    score: 65,
    completedLevels: 6,
    totalLevels: 12,
    lastPlayed: '2025-08-20T16:45:00Z',
    timeSpent: 22,
    improvements: ['Fraction understanding improving']
  },
  {
    gameId: 'autism-emotions',
    gameName: 'Emotion Garden',
    category: 'social',
    score: 92,
    completedLevels: 15,
    totalLevels: 18,
    lastPlayed: '2025-08-21T09:15:00Z',
    timeSpent: 30,
    improvements: ['Emotion recognition excellent', 'Social cues understanding']
  }
];

// Demo Learning Metrics
export const demoLearningMetrics: LearningMetrics[] = [
  {
    childId: 'child1',
    date: '2025-08-21',
    tasksCompleted: 7,
    totalTasks: 10,
    focusTime: 45,
    mood: 'happy',
    gameScores: {
      reading: 78,
      math: 65,
      focus: 88,
      social: 71
    },
    streakDays: 5,
    badgesEarned: ['Reading Wizard', 'Focus Champion']
  },
  {
    childId: 'child2',
    date: '2025-08-21',
    tasksCompleted: 8,
    totalTasks: 10,
    focusTime: 35,
    mood: 'excited',
    gameScores: {
      reading: 72,
      math: 68,
      focus: 75,
      social: 92
    },
    streakDays: 3,
    badgesEarned: ['Social Star', 'Art Master']
  }
];

// Demo Messages
export const demoMessages: Message[] = [
  {
    id: 'msg1',
    senderId: 'teacher1',
    senderName: 'Ms. Rodriguez',
    senderRole: 'teacher',
    recipientId: 'parent1',
    subject: 'Alex\'s Progress Update',
    content: 'Alex had an excellent day today! He completed all reading exercises and showed great improvement in focus during math time. The new strategies we discussed are really working.',
    timestamp: '2025-08-21T15:30:00Z',
    read: false
  },
  {
    id: 'msg2',
    senderId: 'therapist1',
    senderName: 'Dr. Thompson',
    senderRole: 'therapist',
    recipientId: 'parent1',
    subject: 'Session Notes & Home Strategies',
    content: 'Great session with Alex today. We worked on emotional regulation techniques. I recommend continuing the breathing exercises at home, especially during homework time.',
    timestamp: '2025-08-21T12:15:00Z',
    read: true
  },
  {
    id: 'msg3',
    senderId: 'parent1',
    senderName: 'Sarah Johnson',
    senderRole: 'parent',
    recipientId: 'teacher1',
    subject: 'Homework Question',
    content: 'Hi Ms. Rodriguez, Alex is struggling with the math worksheet tonight. Should we skip the word problems for now and focus on the basic calculations?',
    timestamp: '2025-08-20T19:45:00Z',
    read: true
  }
];

// Demo AI Insights
export const demoAIInsights: AIInsight[] = [
  {
    id: 'insight1',
    childId: 'child1',
    type: 'recommendation',
    title: 'Optimal Learning Time Detected',
    description: 'Alex shows 40% better focus and completion rates during morning sessions (9-11 AM). Consider scheduling challenging tasks during this window.',
    actionable: true,
    priority: 'medium',
    timestamp: '2025-08-21T08:00:00Z',
    data: {
      timeWindow: '9:00-11:00 AM',
      improvementRate: 40,
      tasksAffected: ['math', 'reading comprehension']
    }
  },
  {
    id: 'insight2',
    childId: 'child1',
    type: 'milestone',
    title: 'Reading Fluency Milestone Achieved',
    description: 'Alex has consistently scored above 75% in reading games for 5 consecutive days. Ready for next difficulty level!',
    actionable: true,
    priority: 'high',
    timestamp: '2025-08-21T10:30:00Z',
    data: {
      currentLevel: 'Beginner',
      suggestedLevel: 'Intermediate',
      consistency: 5
    }
  },
  {
    id: 'insight3',
    childId: 'child1',
    type: 'alert',
    title: 'Focus Decline in Afternoon',
    description: 'Attention span drops significantly after 3 PM. Consider implementing movement breaks or switching to hands-on activities.',
    actionable: true,
    priority: 'medium',
    timestamp: '2025-08-20T15:30:00Z',
    data: {
      declineRate: 30,
      suggestedBreaks: ['5-minute walk', 'stretching', 'fidget toys']
    }
  },
  {
    id: 'insight4',
    childId: 'child2',
    type: 'pattern',
    title: 'Social Interaction Improvement',
    description: 'Emma\'s social skills scores have improved 25% over the past week, particularly in emotion recognition tasks.',
    actionable: false,
    priority: 'low',
    timestamp: '2025-08-21T11:00:00Z',
    data: {
      improvementRate: 25,
      strongestArea: 'emotion recognition',
      weeklyTrend: 'upward'
    }
  }
];

// Weekly Progress Data
export const weeklyProgressData = {
  child1: {
    readingFluency: { current: 78, change: 12, trend: [66, 68, 71, 75, 76, 77, 78] },
    taskIndependence: { current: 82, change: 8, trend: [74, 76, 78, 79, 80, 81, 82] },
    socialInteraction: { current: 71, change: 15, trend: [56, 58, 62, 66, 68, 69, 71] },
    emotionalRegulation: { current: 85, change: 18, trend: [67, 70, 74, 78, 81, 83, 85] },
    focusAttention: { current: 88, change: 22, trend: [66, 70, 75, 80, 84, 86, 88] }
  },
  child2: {
    readingFluency: { current: 72, change: 8, trend: [64, 66, 68, 69, 70, 71, 72] },
    taskIndependence: { current: 75, change: 10, trend: [65, 67, 69, 71, 72, 74, 75] },
    socialInteraction: { current: 92, change: 25, trend: [67, 72, 78, 83, 87, 90, 92] },
    emotionalRegulation: { current: 88, change: 20, trend: [68, 72, 76, 80, 84, 86, 88] },
    focusAttention: { current: 75, change: 12, trend: [63, 65, 68, 70, 72, 74, 75] }
  }
};

// Teacher classroom data
export const classroomData = {
  totalStudents: 25,
  presentToday: 23,
  iepStudents: 8,
  studentsNeedingSupport: [
    {
      id: 'child1',
      name: 'Alex Johnson',
      condition: 'ADHD + Dyslexia',
      status: 'good',
      recentProgress: 'Improved focus in morning sessions',
      nextAction: 'Continue current strategies'
    },
    {
      id: 'child2',
      name: 'Emma Chen',
      condition: 'Autism Spectrum',
      status: 'excellent',
      recentProgress: 'Social skills developing rapidly',
      nextAction: 'Introduce peer interaction activities'
    },
    {
      id: 'child3',
      name: 'Maya Rodriguez',
      condition: 'Dyscalculia',
      status: 'needs-attention',
      recentProgress: 'Struggles with new math concepts',
      nextAction: 'Simplify problem presentation'
    }
  ]
};

// Get data by user role and ID
export const getDataForUser = (userId: string, userRole: string) => {
  switch (userRole) {
    case 'parent':
      const parentChildren = demoChildren.filter(child => child.parentId === userId);
      return {
        children: parentChildren,
        messages: demoMessages.filter(msg => msg.recipientId === userId || msg.senderId === userId),
        insights: demoAIInsights.filter(insight => 
          parentChildren.some(child => child.id === insight.childId)
        ),
        gameProgress: demoGameProgress,
        learningMetrics: demoLearningMetrics.filter(metric =>
          parentChildren.some(child => child.id === metric.childId)
        )
      };
    
    case 'teacher':
      const teacherStudents = demoChildren.filter(child => child.teacherId === userId);
      return {
        students: teacherStudents,
        classroom: classroomData,
        messages: demoMessages.filter(msg => msg.recipientId === userId || msg.senderId === userId),
        insights: demoAIInsights.filter(insight =>
          teacherStudents.some(student => student.id === insight.childId)
        )
      };
    
    case 'therapist':
      const therapistClients = demoChildren.filter(child => child.therapistId === userId);
      return {
        clients: therapistClients,
        messages: demoMessages.filter(msg => msg.recipientId === userId || msg.senderId === userId),
        insights: demoAIInsights.filter(insight =>
          therapistClients.some(client => client.id === insight.childId)
        )
      };
    
    case 'child':
      const childData = demoChildren.find(child => child.id === userId);
      return {
        profile: childData,
        gameProgress: demoGameProgress,
        metrics: demoLearningMetrics.find(metric => metric.childId === userId),
        badges: demoLearningMetrics.find(metric => metric.childId === userId)?.badgesEarned || []
      };
    
    default:
      return {};
  }
};

// Current logged in user (for demo purposes)
export const currentUser = demoUsers[0]; // Sarah Johnson (parent)
