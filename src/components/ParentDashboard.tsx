import React, { useState } from 'react';
import { Calendar, TrendingUp, Users, BookOpen, CheckCircle, Activity } from 'lucide-react';
import { CommunityHub } from './CommunityHub';

export const ParentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demo
  const childData = {
    name: 'Alex',
    age: 8,
    tasksCompleted: 7,
    totalTasks: 10,
    mood: 'happy',
    focusTime: 23,
    gameScores: {
      reading: 78,
      math: 65,
      focus: 88,
      social: 71
    },
    recentBadges: ['Reading Wizard', 'Focus Champion']
  };

  const progressData = [
    { skill: 'Reading Fluency', current: 75, target: 85, change: +8 },
    { skill: 'Task Independence', current: 82, target: 90, change: +5 },
    { skill: 'Social Interaction', current: 68, target: 80, change: +12 },
    { skill: 'Emotional Regulation', current: 71, target: 85, change: +15 }
  ];

  const upcomingAppointments = [
    { type: 'Speech Therapy', therapist: 'Dr. Martinez', date: 'Tomorrow', time: '2:00 PM' },
    { type: 'Parent-Teacher Conference', teacher: 'Ms. Johnson', date: 'Friday', time: '3:30 PM' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Good morning! 👋</h2>
        <p className="text-gray-600 mt-2">Here's how {childData.name} is doing today</p>
      </div>

      {/* Daily Snapshot */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white mb-8">
        <h3 className="text-xl font-semibold mb-4">Today's Snapshot</h3>
        <div className="bg-white/10 rounded-xl p-4 mb-4">
          <p className="text-white/90">
            {childData.name} completed {childData.tasksCompleted} out of {childData.totalTasks} tasks today! 
            They're in a {childData.mood} mood and spent {childData.focusTime} minutes in focused activities.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{Math.round((childData.tasksCompleted / childData.totalTasks) * 100)}%</p>
            <p className="text-white/80">Tasks Complete</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{childData.focusTime}m</p>
            <p className="text-white/80">Focus Time</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{childData.recentBadges.length}</p>
            <p className="text-white/80">New Badges</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'progress', label: 'Progress', icon: TrendingUp },
          { id: 'community', label: 'Community', icon: Users },
          { id: 'appointments', label: 'Appointments', icon: Calendar }
        ].map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
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
          {/* Game Progress */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <BookOpen className="h-5 w-5 text-blue-500 mr-2" />
              Game Performance
            </h3>
            <div className="space-y-4">
              {Object.entries(childData.gameScores).map(([skill, score]) => (
                <div key={skill} className="flex items-center justify-between">
                  <span className="capitalize font-medium">{skill}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold">{score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              Recent Achievements
            </h3>
            <div className="space-y-3">
              {childData.recentBadges.map((badge, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">🏆</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{badge}</p>
                    <p className="text-sm text-gray-600">Earned today!</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'progress' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
            Progress Overview
          </h3>
          <div className="space-y-6">
            {progressData.map((progress, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{progress.skill}</h4>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    progress.change > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {progress.change > 0 ? '+' : ''}{progress.change}%
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress.current}% / {progress.target}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full"
                      style={{ width: `${progress.current}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'community' && (
        <CommunityHub />
      )}

      {activeTab === 'appointments' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 text-green-500 mr-2" />
            Upcoming Appointments
          </h3>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{appointment.type}</p>
                    <p className="text-sm text-gray-600">
                      with {appointment.therapist || appointment.teacher}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{appointment.date}</p>
                    <p className="text-sm text-gray-600">{appointment.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};