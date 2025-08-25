import React, { useState } from 'react';
import { Users, BookOpen, MessageSquare, Lightbulb, AlertCircle, CheckCircle } from 'lucide-react';
import { AILearningCoach } from './AILearningCoach';
import { useAuth } from '../contexts/AuthContext';
import { useChildren, useChildProgress, useExercises, useNotifications } from '../hooks/useAPI';

export const TeacherDashboard: React.FC = () => {
  const [showAIInsights, setShowAIInsights] = useState(false);
  const { user } = useAuth();

  // Fetch real data from API
  const { data: children = [], isLoading: childrenLoading } = useChildren();
  const { data: exercises = [] } = useExercises();
  const { data: notifications = [] } = useNotifications();

  // Filter children assigned to this teacher
  const teacherStudents = children.filter((child: any) => child.teacherId === user?.id);

  if (childrenLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  // Sample learning data for AI Coach (teacher perspective)
  const learningData = {
    child: {
      name: 'Alex M.',
      age: 8,
      learningDifferences: ['ADHD', 'Dyslexia'],
      interests: ['dinosaurs', 'space', 'building blocks']
    },
    dailyMetrics: {
      tasksCompleted: 7,
      totalTasks: 10,
      focusTime: 23,
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
    weeklyProgress: {
      readingFluency: { current: 75, change: 8 },
      taskIndependence: { current: 82, change: 5 },
      socialInteraction: { current: 68, change: 12 },
      emotionalRegulation: { current: 71, change: 15 }
    },
    patterns: {
      bestLearningTime: 'morning',
      frustrationTriggers: ['complex instructions', 'evening tasks'],
      engagementBoosts: ['dinosaur themes', 'movement breaks', 'visual cues'],
      taskAvoidance: ['writing tasks after 4 PM', 'multi-step instructions']
    }
  };

  // Transform API data for teacher view
  const students = teacherStudents.map((child: any) => {
    const recentGames = ['Safari Word Adventure', 'Treasure Hunt Memory', 'Pizza Fractions', 'Emotion Garden'];
    const condition = child.learningDifferences?.[0] || 'General';
    const engagement = Math.floor(Math.random() * 30) + 70; // 70-100
    
    return {
      name: child.name,
      condition,
      status: engagement > 85 ? 'good' : engagement > 70 ? 'attention' : 'monitor',
      engagement,
      needs: condition === 'ADHD' ? 'Break reminders' : 
             condition === 'Dyslexia' ? 'Reading support' :
             condition === 'Autism Spectrum' ? 'Social prompts' : 'Focus strategies',
      gameProgress: { 
        reading: Math.floor(Math.random() * 40) + 60, 
        math: Math.floor(Math.random() * 40) + 60, 
        focus: Math.floor(Math.random() * 40) + 60, 
        social: Math.floor(Math.random() * 40) + 60 
      },
      recentGames: recentGames.slice(0, 2)
    };
  });

  // Placeholder AI suggestions
  const aiSuggestions = [
    {
      student: 'All Students',
      suggestion: 'Consider implementing visual learning aids for better engagement',
      type: 'game-recommendation'
    }
  ];

  // Placeholder parent messages  
  const parentMessages = [
    {
      parent: 'Parent Communication',
      message: 'No recent messages from parents...',
      time: 'No recent activity',
      unread: false
    }
  ];

  if (showAIInsights) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => setShowAIInsights(false)}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Teacher Dashboard
          </button>
        </div>
        <AILearningCoach learningData={learningData} userRole="therapist" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Good morning, Ms. Johnson!</h2>
        <p className="text-gray-600 mt-2">Your classroom insights for today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Students Present</p>
              <p className="text-2xl font-bold text-gray-900">23/25</p>
              <p className="text-green-600 text-sm">Great attendance!</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">IEP Students</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
              <p className="text-blue-600 text-sm">Need support</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Parent Messages</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-orange-600 text-sm">1 unread</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <MessageSquare className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">AI Suggestions</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
              <p className="text-purple-600 text-sm">New today</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Lightbulb className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 text-blue-500 mr-2" />
            Student Overview
          </h3>
          <div className="space-y-4">
            {students.map((student, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.condition}</p>
                      <div className="text-xs text-blue-600 mt-1">
                        Recent: {student.recentGames.join(', ')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {student.status === 'good' && <CheckCircle className="h-5 w-5 text-green-500" />}
                    {student.status === 'attention' && <AlertCircle className="h-5 w-5 text-orange-500" />}
                    {student.status === 'monitor' && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Engagement</span>
                    <span>{student.engagement}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                      style={{ width: `${student.engagement}%` }}
                    ></div>
                  </div>
                  
                  {/* Game Progress Mini-View */}
                  <div className="mt-3 grid grid-cols-4 gap-1">
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Read</div>
                      <div className={`text-xs font-bold ${student.gameProgress.reading > 70 ? 'text-green-600' : student.gameProgress.reading > 50 ? 'text-orange-600' : 'text-red-600'}`}>
                        {student.gameProgress.reading}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Math</div>
                      <div className={`text-xs font-bold ${student.gameProgress.math > 70 ? 'text-green-600' : student.gameProgress.math > 50 ? 'text-orange-600' : 'text-red-600'}`}>
                        {student.gameProgress.math}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Focus</div>
                      <div className={`text-xs font-bold ${student.gameProgress.focus > 70 ? 'text-green-600' : student.gameProgress.focus > 50 ? 'text-orange-600' : 'text-red-600'}`}>
                        {student.gameProgress.focus}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Social</div>
                      <div className={`text-xs font-bold ${student.gameProgress.social > 70 ? 'text-green-600' : student.gameProgress.social > 50 ? 'text-orange-600' : 'text-red-600'}`}>
                        {student.gameProgress.social}%
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-600 mt-2">Focus: {student.needs}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Lightbulb className="h-5 w-5 text-purple-500 mr-2" />
            Game-Based Teaching Insights
          </h3>
          
          {/* Quick Game Assignment */}
          <div className="bg-purple-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-purple-800 mb-2">Quick Game Assignments</h4>
            <div className="grid grid-cols-2 gap-2">
              <button className="bg-white border border-purple-200 rounded-lg p-2 text-sm hover:bg-purple-100">
                📚 Assign Reading Games
              </button>
              <button className="bg-white border border-purple-200 rounded-lg p-2 text-sm hover:bg-purple-100">
                🧮 Assign Math Games
              </button>
              <button className="bg-white border border-purple-200 rounded-lg p-2 text-sm hover:bg-purple-100">
                🎯 Assign Focus Games
              </button>
              <button className="bg-white border border-purple-200 rounded-lg p-2 text-sm hover:bg-purple-100">
                🤝 Assign Social Games
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {aiSuggestions.map((suggestion, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                suggestion.type === 'alert' ? 'bg-red-50 border-red-400' :
                suggestion.type === 'game-recommendation' ? 'bg-blue-50 border-blue-400' :
                suggestion.type === 'milestone' ? 'bg-green-50 border-green-400' :
                'bg-green-50 border-green-400'
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium text-gray-900">{suggestion.student}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    suggestion.type === 'alert' ? 'bg-red-100 text-red-800' :
                    suggestion.type === 'game-recommendation' ? 'bg-blue-100 text-blue-800' :
                    suggestion.type === 'milestone' ? 'bg-green-100 text-green-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {suggestion.type}
                  </span>
                </div>
                <p className="text-gray-700 text-sm">{suggestion.suggestion}</p>
                <div className="mt-3 flex space-x-2">
                  <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-xs hover:bg-gray-300">
                    {suggestion.type === 'game-recommendation' ? 'Assign Game' : 'Apply'}
                  </button>
                  <button className="px-3 py-1 bg-blue-500 text-white rounded-md text-xs hover:bg-blue-600">
                    Message Parent
                  </button>
                  <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-xs hover:bg-gray-300">
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <MessageSquare className="h-5 w-5 text-green-500 mr-2" />
          Parent Communications
        </h3>
        <div className="space-y-3">
          {parentMessages.map((message, index) => (
            <div key={index} className={`p-4 rounded-lg border ${message.unread ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium text-gray-900">{message.parent}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{message.time}</span>
                  {message.unread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                </div>
              </div>
              <p className="text-gray-700 text-sm">{message.message}</p>
              <div className="mt-3">
                <button className="px-3 py-1 bg-blue-500 text-white rounded-md text-xs hover:bg-blue-600">
                  Reply
                </button>
                <button 
                  onClick={() => setShowAIInsights(true)}
                  className="px-3 py-1 bg-purple-500 text-white rounded-md text-xs hover:bg-purple-600"
                >
                  AI Insights
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};