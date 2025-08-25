import React, { useState } from 'react';
import { Calendar, FileText, TrendingUp, Users, Clock, Target, CheckSquare } from 'lucide-react';
import { AILearningCoach } from './AILearningCoach';
import { demoChildren, demoMessages, demoAIInsights } from '../data/demoData';

export const TherapistDashboard: React.FC = () => {
  const [showAICoach, setShowAICoach] = useState(false);

  // Get therapist's clients (Dr. Thompson - therapist1)
  const therapistClients = demoChildren.filter(child => child.therapistId === 'therapist1');
  const therapistMessages = demoMessages.filter(msg => msg.recipientId === 'therapist1' || msg.senderId === 'therapist1');
  const therapistInsights = demoAIInsights.filter(insight => 
    therapistClients.some(client => client.id === insight.childId)
  );

  const upcomingAppointments = therapistClients.map((client, index) => ({
    name: client.name,
    time: ['2:00 PM', '3:30 PM', '4:00 PM'][index] || '2:00 PM',
    type: client.learningDifferences.includes('ADHD') ? 'Focus Training' :
          client.learningDifferences.includes('Dyslexia') ? 'Reading Support' :
          client.learningDifferences.includes('Autism') ? 'Social Skills' : 'General Therapy',
    status: 'confirmed',
    progress: ['good', 'excellent', 'needs-attention'][index % 3]
  }));

  const progressReports = therapistClients.map(client => ({
    student: client.name,
    goal: client.learningDifferences.includes('ADHD') ? 'Attention & Focus' :
          client.learningDifferences.includes('Dyslexia') ? 'Reading fluency' :
          'Social interaction skills',
    current: Math.floor(Math.random() * 30) + 60,
    target: 85,
    sessions: Math.floor(Math.random() * 10) + 5
  }));

  // Sample learning data for AI Coach (therapist perspective)
  const learningData = {
    child: {
      name: therapistClients[0]?.name || 'Alex',
      age: therapistClients[0]?.age || 8,
      learningDifferences: therapistClients[0]?.learningDifferences || ['ADHD', 'Dyslexia'],
      interests: therapistClients[0]?.interests || ['dinosaurs', 'space', 'building blocks']
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
      engagementBoosts: ['visual cues', 'movement breaks', 'positive reinforcement'],
      taskAvoidance: ['writing tasks after 4 PM', 'multi-step instructions']
    }
  };

  const homeExercises = therapistClients.map(client => ({
    student: client.name,
    exercise: client.learningDifferences.includes('ADHD') ? 'Focus breathing exercises' :
              client.learningDifferences.includes('Dyslexia') ? 'Daily 15-min reading' :
              'Social story practice',
    completed: `${Math.floor(Math.random() * 7) + 1}/7 days`,
    parent: demoMessages.find(msg => msg.senderId.includes('parent'))?.senderName || 'Parent'
  }));

  const aiInsights = therapistInsights.map(insight => ({
    student: therapistClients.find(c => c.id === insight.childId)?.name || 'Student',
    insight: insight.description,
    type: insight.type
  }));

  if (showAICoach) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => setShowAICoach(false)}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Therapist Dashboard
          </button>
        </div>
        <AILearningCoach learningData={learningData} userRole="therapist" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome, Dr. Thompson! 👨‍⚕️</h2>
          <p className="text-gray-600 mt-2">Your therapy session overview for today</p>
        </div>
        <button
          onClick={() => setShowAICoach(true)}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors flex items-center space-x-2"
        >
          <span>🧠</span>
          <span>AI Coach</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Sessions</p>
              <p className="text-2xl font-bold text-gray-900">4</p>
              <p className="text-blue-600 text-sm">All confirmed</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Clients</p>
              <p className="text-2xl font-bold text-gray-900">18</p>
              <p className="text-green-600 text-sm">3 new referrals</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Reports Due</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-orange-600 text-sm">This week</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">AI Insights</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
              <p className="text-purple-600 text-sm">New patterns</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 text-blue-500 mr-2" />
            Today's Appointments
          </h3>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{appointment.name}</p>
                    <p className="text-sm text-gray-600">{appointment.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{appointment.time}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`inline-block w-3 h-3 rounded-full ${
                    appointment.progress === 'excellent' ? 'bg-green-400' :
                    appointment.progress === 'good' ? 'bg-blue-400' :
                    appointment.progress === 'needs-attention' ? 'bg-orange-400' :
                    'bg-gray-400'
                  }`}></span>
                  <button className="text-blue-600 text-sm hover:text-blue-800">View Notes</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="h-5 w-5 text-green-500 mr-2" />
            Client Progress
          </h3>
          <div className="space-y-4">
            {progressReports.map((progress, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{progress.student}</p>
                    <p className="text-sm text-gray-600">{progress.goal}</p>
                  </div>
                  <span className="text-sm text-gray-500">{progress.sessions} sessions</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress.current}% / {progress.target}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                      style={{ width: `${progress.current}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <CheckSquare className="h-5 w-5 text-purple-500 mr-2" />
            Home Exercise Tracking
          </h3>
          <div className="space-y-4">
            {homeExercises.map((exercise, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{exercise.student}</p>
                    <p className="text-sm text-gray-600">{exercise.exercise}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{exercise.completed}</p>
                    <p className="text-sm text-gray-500">by {exercise.parent}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${parseInt(exercise.completed.split('/')[0]) / parseInt(exercise.completed.split('/')[1]) * 100}%` }}
                    ></div>
                  </div>
                  <button className="text-blue-600 text-sm hover:text-blue-800">Message</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 text-orange-500 mr-2" />
            AI-Powered Insights
          </h3>
          <div className="space-y-4">
            {aiInsights.map((insight, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                insight.type === 'recommendation' ? 'bg-blue-50 border-blue-400' :
                insight.type === 'alert' ? 'bg-orange-50 border-orange-400' :
                'bg-green-50 border-green-400'
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium text-gray-900">{insight.student}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    insight.type === 'recommendation' ? 'bg-blue-100 text-blue-800' :
                    insight.type === 'alert' ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {insight.type}
                  </span>
                </div>
                <p className="text-gray-700 text-sm">{insight.insight}</p>
                <div className="mt-3 flex space-x-2">
                  <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-xs hover:bg-gray-300">
                    Add to Notes
                  </button>
                  <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-xs hover:bg-gray-300">
                    Share with Parent
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};