import React, { useState } from 'react';
import { Calendar, MessageCircle, Award, TrendingUp, Users, BookOpen, Heart, Clock, Brain, AlertCircle, CheckCircle, Star, Lightbulb, Phone, Video, Coffee, Zap, Target, Activity } from 'lucide-react';
import { GameProgress } from './GameProgress';
import { AILearningCoach } from './AILearningCoach';
import { useChildren, useChildProgress, useChildAnalytics, useNotifications } from '../hooks/useAPI';
import { useAuth } from '../contexts/AuthContext';

export const ParentDashboard: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('today');
  const [showStressSupport, setShowStressSupport] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedChildId, setSelectedChildId] = useState('');
  const { user } = useAuth();

  // Fetch real data from API
  const { data: children = [], isLoading: childrenLoading } = useChildren();
  const { data: childProgress, isLoading: progressLoading } = useChildProgress(selectedChildId);
  const { data: childAnalytics, isLoading: analyticsLoading } = useChildAnalytics(selectedChildId);
  const { data: notifications = [] } = useNotifications();

  // Set default selected child when children are loaded
  React.useEffect(() => {
    if (children.length > 0 && !selectedChildId) {
      setSelectedChildId(children[0]._id);
    }
  }, [children, selectedChildId]);

  if (childrenLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  const selectedChild = children.find(child => child._id === selectedChildId) || children[0];
  
  if (!selectedChild) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Children Found</h2>
            <p className="text-gray-600">You don't have any children registered yet. Please contact support or add a child profile.</p>
          </div>
        </div>
      </div>
    );
  }

  // Sample learning data for AI Coach
  const learningData = {
    child: {
      name: selectedChild?.name || 'Child',
      age: selectedChild?.age || 8,
      learningDifferences: selectedChild?.learningDifferences || [],
      interests: selectedChild?.interests || []
    },
    dailyMetrics: {
      tasksCompleted: childProgress?.tasksCompleted || 0,
      totalTasks: childProgress?.totalTasks || 0,
      focusTime: childProgress?.focusTime || 0,
      mood: childProgress?.mood || 'neutral',
      gameScores: childProgress?.gameScores || {
        reading: 0,
        math: 0,
        focus: 0,
        social: 0
      },
      streakDays: childProgress?.streakDays || 0,
      badgesEarned: childProgress?.badgesEarned || []
    },
    weeklyProgress: childAnalytics?.weeklyProgress || {
      readingFluency: { current: 0, change: 0 },
      taskIndependence: { current: 0, change: 0 },
      socialInteraction: { current: 0, change: 0 },
      emotionalRegulation: { current: 0, change: 0 }
    },
    patterns: childAnalytics?.patterns || {
      bestLearningTime: 'morning',
      frustrationTriggers: [],
      engagementBoosts: [],
      taskAvoidance: []
    }
  };

  const dailySnapshot = {
    tasksCompleted: childProgress?.tasksCompleted || 0,
    totalTasks: childProgress?.totalTasks || 0,
    mood: childProgress?.mood || 'neutral',
    focusTime: childProgress?.focusTime || 0,
    focusImprovement: childProgress?.focusImprovement || 0,
    newWordsRead: childProgress?.newWordsRead || 0,
    aiSummary: childProgress?.aiSummary || `${selectedChild?.name || 'Your child'} is making great progress! Keep up the good work with consistent practice and engagement.`
  };

  const gameInsights = [
    { 
      type: 'reading', 
      score: childProgress?.gameScores?.reading || 0, 
      timeSpent: childProgress?.timeSpent?.reading || 0, 
      accuracy: childProgress?.accuracy?.reading || 0, 
      improvement: childProgress?.improvement?.reading || 0 
    },
    { 
      type: 'math', 
      score: childProgress?.gameScores?.math || 0, 
      timeSpent: childProgress?.timeSpent?.math || 0, 
      accuracy: childProgress?.accuracy?.math || 0, 
      improvement: childProgress?.improvement?.math || 0 
    },
    { 
      type: 'focus', 
      score: childProgress?.gameScores?.focus || 0, 
      timeSpent: childProgress?.timeSpent?.focus || 0, 
      accuracy: childProgress?.accuracy?.focus || 0, 
      improvement: childProgress?.improvement?.focus || 0 
    },
    { 
      type: 'social', 
      score: childProgress?.gameScores?.social || 0, 
      timeSpent: childProgress?.timeSpent?.social || 0, 
      accuracy: childProgress?.accuracy?.social || 0, 
      improvement: childProgress?.improvement?.social || 0 
    }
  ];
  const aiCoachingTips = childAnalytics?.tips || [
    {
      type: 'timing',
      icon: '⏰',
      title: 'Keep Building Routines',
      tip: "Consistent practice times help build learning habits.",
      confidence: 'medium',
      basedOn: 'General best practices'
    }
  ];

  const lifeSkillsSuggestions = [
    {
      skill: 'Morning Independence',
      suggestion: 'Create a visual morning checklist with Alex. Let them check off each step - this builds executive function skills.',
      difficulty: 'easy',
      timeNeeded: '5 minutes setup'
    },
    {
      skill: 'Emotional Regulation',
      suggestion: 'Practice the "name it to tame it" technique. When Alex feels frustrated, help them identify and name the emotion.',
      difficulty: 'medium',
      timeNeeded: 'In the moment'
    },
    {
      skill: 'Social Sequencing',
      suggestion: 'Role-play ordering food at a restaurant. This builds confidence for real-world social interactions.',
      difficulty: 'medium',
      timeNeeded: '10 minutes'
    }
  ];

  const communityHighlights = [
    {
      group: 'ADHD Parent Circle',
      post: 'Sarah M. shared: "Timer method worked! My son completed homework in 20 minutes instead of 2 hours."',
      likes: 34,
      helpful: true
    },
    {
      group: 'Dyslexia Support Network',
      post: 'New research: Colored overlays help 60% of dyslexic children with reading comfort.',
      likes: 28,
      helpful: true
    },
    {
      group: 'Autism Family Hub',
      post: 'Weekly tip: Social stories work best when your child helps create them!',
      likes: 45,
      helpful: true
    }
  ];

  const upcomingAppointments = [
    {
      type: 'Speech Therapy',
      therapist: 'Dr. Martinez',
      date: 'Tomorrow',
      time: '2:00 PM',
      status: 'confirmed',
      notes: 'Working on /r/ sounds - practice at home with mirror'
    },
    {
      type: 'Parent-Teacher Conference',
      teacher: 'Ms. Johnson',
      date: 'Friday',
      time: '3:30 PM',
      status: 'confirmed',
      notes: 'Discuss reading progress and classroom accommodations'
    },
    {
      type: 'OT Assessment',
      therapist: 'Lisa Chen, OTR',
      date: 'Next Monday',
      time: '10:00 AM',
      status: 'pending',
      notes: 'Fine motor skills evaluation'
    }
  ];

  const phantomInsights = [
    {
      type: 'pattern',
      title: 'Task Avoidance Pattern',
      insight: 'Alex tends to skip math activities after 4 PM. Energy levels may be lower - consider morning math sessions.',
      actionable: true,
      severity: 'low'
    },
    {
      type: 'breakthrough',
      title: 'Reading Confidence Boost',
      insight: 'Alex spent 3 extra minutes on reading yesterday without prompting - confidence is building!',
      actionable: false,
      severity: 'positive'
    },
    {
      type: 'concern',
      title: 'Frustration Spike',
      insight: 'Detected increased task abandonment on Tuesday. Consider if any environmental factors changed.',
      actionable: true,
      severity: 'medium'
    }
  ];

  const progressMetrics = [
    { 
      skill: 'Reading Fluency', 
      current: 75, 
      target: 85, 
      change: +8,
      trend: 'improving',
      lastWeek: 67,
      description: 'Words per minute increased from 45 to 52'
    },
    { 
      skill: 'Task Independence', 
      current: 82, 
      target: 90, 
      change: +5,
      trend: 'steady',
      lastWeek: 77,
      description: 'Completes morning routine with minimal prompts'
    },
    { 
      skill: 'Social Interaction', 
      current: 68, 
      target: 80, 
      change: +12,
      trend: 'improving',
      lastWeek: 56,
      description: 'Initiated 3 conversations with peers this week'
    },
    { 
      skill: 'Emotional Regulation', 
      current: 71, 
      target: 85, 
      change: +15,
      trend: 'improving',
      lastWeek: 56,
      description: 'Used calming strategies 4 times independently'
    }
  ];

  const stressSupport = {
    level: 'moderate',
    suggestions: [
      'Take 5 deep breaths - you\'re doing an amazing job',
      'Remember: progress isn\'t always linear, and that\'s okay',
      'Connect with other parents in your support group',
      'Consider a 10-minute walk to reset your energy'
    ],
    resources: [
      { title: 'Parent Self-Care Guide', type: 'article' },
      { title: 'Mindful Parenting Meditation', type: 'audio' },
      { title: 'ADHD Parent Support Group', type: 'community' }
    ]
  };

  if (showStressSupport) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You're Not Alone</h2>
            <p className="text-gray-600">Parenting a neurodivergent child is both challenging and rewarding. Here's some support for you.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Coffee className="h-5 w-5 text-orange-500 mr-2" />
                Quick Reset
              </h3>
              <div className="space-y-3">
                {stressSupport.suggestions.map((suggestion, index) => (
                  <div key={index} className="p-3 bg-orange-50 rounded-lg text-sm text-gray-700">
                    {suggestion}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpen className="h-5 w-5 text-blue-500 mr-2" />
                Helpful Resources
              </h3>
              <div className="space-y-3">
                {stressSupport.resources.map((resource, index) => (
                  <button key={index} className="w-full p-3 bg-blue-50 rounded-lg text-sm text-gray-700 hover:bg-blue-100 transition-colors text-left">
                    {resource.title}
                    <span className="text-xs text-blue-600 block">{resource.type}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowStressSupport(false)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Show AI coaching interface if requested
  if (activeTab === 'ai-coach') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Dashboard
          </button>
        </div>
        <AILearningCoach learningData={learningData} userRole="parent" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with child selector */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Good morning, Sarah! 👋
            </h2>
            <p className="text-gray-600 mt-2">Here's how your children are doing today</p>
          </div>
          
          {/* Child Selector */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">Viewing:</span>
              <select
                value={selectedChildId}
                onChange={(e) => setSelectedChildId(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {children.map((child: any) => (
                  <option key={child._id} value={child._id}>
                    {child.name} ({child.age}y)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Child overview card */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{selectedChild?.profileImage}</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedChild?.name}</h3>
                <p className="text-gray-600">{selectedChild?.grade} • {selectedChild?.learningDifferences.join(', ')}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedChild?.interests?.slice(0, 3).map((interest: string, index: number) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{childProgress?.streakDays || 0} days</div>
              <div className="text-sm text-gray-600">Learning streak</div>
              <button
                onClick={() => setActiveTab('ai-coach')}
                className="mt-2 px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors"
              >
                AI Coach Insights
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Snapshot Card */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Today's Snapshot</h3>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">😊</span>
            </div>
            <span className="text-sm opacity-90">Happy mood</span>
          </div>
        </div>
        
        <div className="bg-white/10 rounded-xl p-4 mb-4">
          <p className="text-white/90 leading-relaxed">{dailySnapshot.aiSummary}</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{dailySnapshot.tasksCompleted}/{dailySnapshot.totalTasks}</div>
            <div className="text-sm opacity-90">Tasks Done</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{dailySnapshot.focusTime}m</div>
            <div className="text-sm opacity-90">Focus Time</div>
            <div className="text-xs text-green-200">+{dailySnapshot.focusImprovement}m this week</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{dailySnapshot.newWordsRead}</div>
            <div className="text-sm opacity-90">New Words</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'coaching', label: 'AI Coach', icon: Brain },
          { id: 'community', label: 'Community', icon: Users },
          { id: 'appointments', label: 'Appointments', icon: Calendar }
        ].map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <IconComponent className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Game Progress Insights */}
          <div className="lg:col-span-2">
            <GameProgress gameData={gameInsights} />
          </div>
          
          {/* Progress Overview */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
              Progress Overview
            </h3>
            
            {/* AI Game Recommendations */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                <Brain className="h-4 w-4 mr-2" />
                AI Game Recommendations
              </h4>
              <div className="space-y-2">
                <div className="text-sm text-blue-700">
                  📚 <strong>Reading boost:</strong> Try "Space Word Explorer" - Alex loves space themes!
                </div>
                <div className="text-sm text-blue-700">
                  🧮 <strong>Math practice:</strong> "Cooking Fractions" would be perfect for weekend family time
                </div>
                <div className="text-sm text-blue-700">
                  🎯 <strong>Focus training:</strong> Morning "Treasure Hunt" games work best for Alex
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {progressMetrics.map((item, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-gray-900 font-medium">{item.skill}</span>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500">{item.current}% / {item.target}%</span>
                      <div className={`text-xs font-medium ${
                        item.trend === 'improving' ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        +{item.change}% this month
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 relative"
                      style={{ width: `${item.current}%` }}
                    >
                      <div className="absolute right-0 top-0 h-3 w-1 bg-white/50 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Phantom Insights */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Zap className="h-5 w-5 text-purple-500 mr-2" />
              Game Performance Insights
            </h3>
            
            {/* Daily Game Summary */}
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-green-800 mb-2">Today's Game Achievements</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-700">🦁 Safari Word Adventure</span>
                  <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">Completed +15 pts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-700">🍕 Pizza Fractions</span>
                  <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">Completed +20 pts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">🌸 Emotion Garden</span>
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">In Progress</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {phantomInsights.map((insight, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  insight.severity === 'positive' ? 'bg-green-50 border-green-400' :
                  insight.severity === 'medium' ? 'bg-orange-50 border-orange-400' :
                  'bg-blue-50 border-blue-400'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{insight.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      insight.severity === 'positive' ? 'bg-green-100 text-green-800' :
                      insight.severity === 'medium' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {insight.type}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm mb-3">{insight.insight}</p>
                  {insight.actionable && (
                    <button className="text-blue-600 text-sm hover:text-blue-800 font-medium">
                      Take Action →
                    </button>
                  )}
                </div>
              ))}
              
              {/* Game-Specific Insights */}
              <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">Game Adaptation Success</h4>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    adaptive
                  </span>
                </div>
                <p className="text-gray-700 text-sm mb-3">AI automatically reduced Pizza Fractions difficulty after 3 attempts - Alex then completed it successfully!</p>
                <button className="text-purple-600 text-sm hover:text-purple-800 font-medium">
                  View Adaptation Details →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'coaching' && (
        <AILearningCoach learningData={learningData} userRole="parent" />
      )}

      {activeTab === 'community' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 text-blue-500 mr-2" />
            Community Highlights
          </h3>
          <div className="space-y-4">
            {communityHighlights.map((highlight, index) => (
              <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-blue-800">{highlight.group}</span>
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-gray-600">{highlight.likes}</span>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">{highlight.post}</p>
                {highlight.helpful && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Helpful
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Join Community Discussions
            </button>
          </div>
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 text-green-500 mr-2" />
            Upcoming Appointments
          </h3>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{appointment.type}</h4>
                    <p className="text-sm text-gray-600">with {appointment.therapist || appointment.teacher}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{appointment.date}</p>
                    <p className="text-sm text-gray-600">{appointment.time}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {appointment.status}
                  </span>
                  <div className="flex space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Video className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                      <Phone className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                      <MessageCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {appointment.notes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{appointment.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};