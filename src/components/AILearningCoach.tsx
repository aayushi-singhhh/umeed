import React, { useState, useEffect } from 'react';
import { Brain, MessageCircle, TrendingUp, Heart, Star, Lightbulb, Target, Zap, BookOpen, Users, Calendar, Award } from 'lucide-react';

interface LearningData {
  child: {
    name: string;
    age: number;
    learningDifferences: string[];
    interests: string[];
  };
  dailyMetrics: {
    tasksCompleted: number;
    totalTasks: number;
    focusTime: number;
    mood: string;
    gameScores: {
      reading: number;
      math: number;
      focus: number;
      social: number;
    };
    streakDays: number;
    badgesEarned: string[];
  };
  weeklyProgress: {
    readingFluency: { current: number; change: number };
    taskIndependence: { current: number; change: number };
    socialInteraction: { current: number; change: number };
    emotionalRegulation: { current: number; change: number };
  };
  patterns: {
    bestLearningTime: string;
    frustrationTriggers: string[];
    engagementBoosts: string[];
    taskAvoidance: string[];
  };
}

interface AICoachProps {
  learningData: LearningData;
  userRole: 'child' | 'parent' | 'therapist';
}

export const AILearningCoach: React.FC<AICoachProps> = ({ learningData, userRole }) => {
  const [activeTab, setActiveTab] = useState('insights');
  const [chatMessages, setChatMessages] = useState<Array<{id: string, type: 'user' | 'ai', content: string}>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showProgressStory, setShowProgressStory] = useState(false);

  const generateDailyNarrative = () => {
    const { child, dailyMetrics, patterns } = learningData;
    
    if (userRole === 'child') {
      return `🌟 Hey ${child.name}! What an amazing day you had! You completed ${dailyMetrics.tasksCompleted} out of ${dailyMetrics.totalTasks} missions and focused for ${dailyMetrics.focusTime} whole minutes - that's like watching a short cartoon! Your reading adventure score was ${dailyMetrics.gameScores.reading} points, and you're getting stronger every day. I noticed you were feeling ${dailyMetrics.mood} today, and that's perfectly okay! Tomorrow, let's try the Space Word Explorer game since you love planets so much! 🚀`;
    }
    
    if (userRole === 'parent') {
      return `${child.name} had a productive learning day! They completed ${dailyMetrics.tasksCompleted}/${dailyMetrics.totalTasks} activities with ${dailyMetrics.focusTime} minutes of sustained attention. Reading games showed a score of ${dailyMetrics.gameScores.reading}%, indicating ${dailyMetrics.gameScores.reading > 70 ? 'strong progress' : 'areas for gentle support'}. Their mood was ${dailyMetrics.mood}, and they performed best during ${patterns.bestLearningTime}. Consider scheduling tomorrow's reading practice in the morning for optimal engagement.`;
    }
    
    // Therapist view
    return `Clinical Summary for ${child.name}: Task completion rate: ${Math.round((dailyMetrics.tasksCompleted/dailyMetrics.totalTasks)*100)}%. Attention span: ${dailyMetrics.focusTime} minutes (${dailyMetrics.focusTime > 15 ? 'above' : 'within'} expected range for age ${child.age}). Reading fluency games: ${dailyMetrics.gameScores.reading}% accuracy. Social-emotional games: ${dailyMetrics.gameScores.social}% accuracy. Recommend focusing on ${dailyMetrics.gameScores.reading < 60 ? 'phonemic awareness activities' : 'reading comprehension strategies'}.`;
  };

  const generateAdaptiveRecommendations = () => {
    const { dailyMetrics, patterns, weeklyProgress } = learningData;
    
    const recommendations = [];
    
    // Reading recommendations
    if (dailyMetrics.gameScores.reading < 60) {
      recommendations.push({
        type: 'reading',
        priority: 'high',
        title: 'Reading Support Needed',
        suggestion: userRole === 'child' 
          ? "Let's try the Animal Word Safari tomorrow - it has bigger letters and fun sounds!"
          : "Consider shorter reading sessions with more visual supports. The Safari Word Adventure game adapts to reading level automatically.",
        icon: BookOpen,
        color: 'bg-blue-100 text-blue-800'
      });
    }
    
    // Focus recommendations
    if (dailyMetrics.focusTime < 10) {
      recommendations.push({
        type: 'focus',
        priority: 'medium',
        title: 'Attention Building',
        suggestion: userRole === 'child'
          ? "Your focus muscles are getting stronger! Tomorrow we'll do 2-minute treasure hunts to make them even stronger!"
          : "Attention span is developing. Try breaking tasks into 5-minute chunks with movement breaks between.",
        icon: Target,
        color: 'bg-purple-100 text-purple-800'
      });
    }
    
    // Social-emotional recommendations
    if (dailyMetrics.gameScores.social < 70) {
      recommendations.push({
        type: 'social',
        priority: 'medium',
        title: 'Social Skills Practice',
        suggestion: userRole === 'child'
          ? "The Emotion Garden game is perfect for you! It helps us understand feelings better."
          : "Social stories and emotion recognition games showing good engagement. Consider real-world practice opportunities.",
        icon: Heart,
        color: 'bg-pink-100 text-pink-800'
      });
    }
    
    // Mood-based recommendations
    if (dailyMetrics.mood === 'frustrated' || dailyMetrics.mood === 'sad') {
      recommendations.push({
        type: 'wellness',
        priority: 'high',
        title: 'Emotional Support',
        suggestion: userRole === 'child'
          ? "I noticed you might need some calm time. Let's do bubble breathing together! 🫧"
          : "Child showed signs of frustration. Consider starting tomorrow with a calming activity before academic tasks.",
        icon: Heart,
        color: 'bg-green-100 text-green-800'
      });
    }
    
    return recommendations;
  };

  const generateProgressStory = () => {
    const { child, weeklyProgress } = learningData;
    
    return {
      title: `${child.name}'s Amazing Learning Adventure This Week!`,
      chapters: [
        {
          title: "The Reading Quest",
          content: `Once upon a time, ${child.name} embarked on a magical reading journey! This week, they discovered ${Math.abs(weeklyProgress.readingFluency.change)} new reading powers, making their reading fluency grow to ${weeklyProgress.readingFluency.current}%! Like a brave explorer, they conquered word after word, each one making them stronger and more confident.`,
          emoji: "📚",
          progress: weeklyProgress.readingFluency.current
        },
        {
          title: "The Independence Castle",
          content: `In the land of Daily Tasks, ${child.name} built their Independence Castle brick by brick! They learned to do things all by themselves, growing their independence skills by ${Math.abs(weeklyProgress.taskIndependence.change)} points this week. Now they're ${weeklyProgress.taskIndependence.current}% independent - what a superhero!`,
          emoji: "🏰",
          progress: weeklyProgress.taskIndependence.current
        },
        {
          title: "The Friendship Bridge",
          content: `${child.name} also worked on building bridges to connect with friends! Their social interaction skills grew by ${Math.abs(weeklyProgress.socialInteraction.change)} points, reaching ${weeklyProgress.socialInteraction.current}%. Every conversation, every shared smile, every kind gesture made the bridge stronger!`,
          emoji: "🌉",
          progress: weeklyProgress.socialInteraction.current
        },
        {
          title: "The Calm Garden",
          content: `In the peaceful Calm Garden, ${child.name} learned to tend to their emotions. Their emotional regulation skills blossomed by ${Math.abs(weeklyProgress.emotionalRegulation.change)} points this week! Now they know how to take deep breaths, count to ten, and find their inner peace when things feel overwhelming.`,
          emoji: "🌸",
          progress: weeklyProgress.emotionalRegulation.current
        }
      ]
    };
  };

  const handleChatSubmit = () => {
    if (!inputMessage.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: inputMessage
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    
    // Generate AI response based on the question
    setTimeout(() => {
      let aiResponse = '';
      const question = inputMessage.toLowerCase();
      
      if (question.includes('struggle') || question.includes('difficult')) {
        aiResponse = `Based on the data, ${learningData.child.name} shows some challenges with ${learningData.dailyMetrics.gameScores.reading < 60 ? 'reading recognition' : learningData.dailyMetrics.gameScores.math < 60 ? 'math concepts' : 'maintaining focus'}. The pattern shows they perform best during ${learningData.patterns.bestLearningTime}. I recommend ${learningData.patterns.bestLearningTime === 'morning' ? 'scheduling challenging tasks before 11 AM' : 'using afternoon energy for active learning'} and incorporating their interest in ${learningData.child.interests[0]} into learning activities.`;
      } else if (question.includes('focus') || question.includes('tomorrow')) {
        aiResponse = `For tomorrow, I suggest focusing on ${learningData.dailyMetrics.gameScores.reading < 70 ? 'reading confidence through the Safari Word Adventure game' : learningData.dailyMetrics.gameScores.math < 70 ? 'math visualization with the Pizza Fractions game' : 'maintaining the great momentum with slightly more challenging activities'}. Start with a 2-minute breathing exercise, then ${learningData.patterns.bestLearningTime === 'morning' ? 'tackle the main learning goal before 10 AM' : 'use movement breaks every 10 minutes'}.`;
      } else if (question.includes('weekend') || question.includes('fun')) {
        aiResponse = `Here's a fun weekend plan! Saturday morning: Family Pizza Fraction cooking (real pizza making while learning fractions). Saturday afternoon: Nature scavenger hunt with word cards. Sunday: Emotion charades game and story creation time. Each activity builds on ${learningData.child.name}'s strengths while gently practicing areas that need support. Remember to celebrate every small win!`;
      } else {
        aiResponse = `Great question! Based on ${learningData.child.name}'s current progress, they're showing ${learningData.weeklyProgress.readingFluency.change > 0 ? 'positive growth' : 'steady development'} in reading (${learningData.weeklyProgress.readingFluency.current}%), and their focus time of ${learningData.dailyMetrics.focusTime} minutes is ${learningData.dailyMetrics.focusTime > 15 ? 'excellent' : 'developing well'} for their age. The key is consistency and celebrating progress, not perfection!`;
      }
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        content: aiResponse
      };
      
      setChatMessages(prev => [...prev, aiMessage]);
    }, 1000);
    
    setInputMessage('');
  };

  const tabs = [
    { id: 'insights', label: 'Daily Insights', icon: Brain },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
    { id: 'patterns', label: 'Learning Patterns', icon: TrendingUp },
    { id: 'chat', label: 'Ask AI Coach', icon: MessageCircle }
  ];

  if (showProgressStory && userRole === 'child') {
    const story = generateProgressStory();
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">📖</div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{story.title}</h1>
              <button
                onClick={() => setShowProgressStory(false)}
                className="text-blue-600 hover:text-blue-800"
              >
                ← Back to Dashboard
              </button>
            </div>
            
            <div className="space-y-8">
              {story.chapters.map((chapter, index) => (
                <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                  <div className="flex items-center mb-4">
                    <span className="text-4xl mr-4">{chapter.emoji}</span>
                    <h3 className="text-xl font-bold text-gray-800">{chapter.title}</h3>
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed">{chapter.content}</p>
                  <div className="bg-white rounded-lg p-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress Level</span>
                      <span>{chapter.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full"
                        style={{ width: `${chapter.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <div className="bg-yellow-100 rounded-2xl p-6">
                <div className="text-4xl mb-2">🌟</div>
                <h4 className="text-xl font-bold text-yellow-800 mb-2">You're Amazing!</h4>
                <p className="text-yellow-700">Every day you're growing stronger, smarter, and more wonderful. Keep being the incredible learner you are!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              {userRole === 'child' ? `Hi ${learningData.child.name}! 🌟` : 
               userRole === 'parent' ? 'AI Learning Coach' : 
               'Clinical AI Assistant'}
            </h2>
            <p className="text-blue-100">
              {userRole === 'child' ? "Let's see how awesome you've been!" :
               userRole === 'parent' ? `Personalized insights for ${learningData.child.name}` :
               'Evidence-based learning analytics'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{learningData.dailyMetrics.streakDays}</div>
            <div className="text-sm text-blue-200">Day Streak! 🔥</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8">
        {tabs.map((tab) => {
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
      {activeTab === 'insights' && (
        <div className="space-y-6">
          {/* Daily Narrative */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Brain className="h-5 w-5 text-purple-500 mr-2" />
              {userRole === 'child' ? 'Your Amazing Day!' : 'Daily Learning Summary'}
            </h3>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">{generateDailyNarrative()}</p>
            </div>
          </div>

          {/* Progress Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <BookOpen className="h-8 w-8 text-blue-500" />
                <span className="text-2xl font-bold text-blue-600">{learningData.dailyMetrics.gameScores.reading}%</span>
              </div>
              <h4 className="font-medium text-gray-900">Reading Games</h4>
              <p className="text-sm text-gray-600">
                {learningData.weeklyProgress.readingFluency.change > 0 ? '+' : ''}{learningData.weeklyProgress.readingFluency.change}% this week
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Target className="h-8 w-8 text-purple-500" />
                <span className="text-2xl font-bold text-purple-600">{learningData.dailyMetrics.focusTime}m</span>
              </div>
              <h4 className="font-medium text-gray-900">Focus Time</h4>
              <p className="text-sm text-gray-600">Sustained attention</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Heart className="h-8 w-8 text-pink-500" />
                <span className="text-2xl font-bold text-pink-600">{learningData.dailyMetrics.gameScores.social}%</span>
              </div>
              <h4 className="font-medium text-gray-900">Social Skills</h4>
              <p className="text-sm text-gray-600">
                {learningData.weeklyProgress.socialInteraction.change > 0 ? '+' : ''}{learningData.weeklyProgress.socialInteraction.change}% this week
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Award className="h-8 w-8 text-yellow-500" />
                <span className="text-2xl font-bold text-yellow-600">{learningData.dailyMetrics.badgesEarned.length}</span>
              </div>
              <h4 className="font-medium text-gray-900">New Badges</h4>
              <p className="text-sm text-gray-600">Earned today</p>
            </div>
          </div>

          {/* Progress Story Button for Children */}
          {userRole === 'child' && (
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">📖</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Your Weekly Adventure Story!</h3>
              <p className="text-gray-600 mb-4">See how amazing your learning journey has been this week!</p>
              <button
                onClick={() => setShowProgressStory(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
              >
                Read My Story! ✨
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          {generateAdaptiveRecommendations().map((rec, index) => {
            const IconComponent = rec.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${rec.color}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                        rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {rec.priority} priority
                      </span>
                    </div>
                    <p className="text-gray-700">{rec.suggestion}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'patterns' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Learning Patterns</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">Best Learning Time</span>
                <span className="font-medium text-green-700">{learningData.patterns.bestLearningTime}</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700 block mb-2">Engagement Boosts</span>
                <div className="flex flex-wrap gap-2">
                  {learningData.patterns.engagementBoosts.map((boost, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-xs">
                      {boost}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Areas to Watch</h4>
            <div className="space-y-3">
              {learningData.patterns.frustrationTriggers.length > 0 && (
                <div className="p-3 bg-orange-50 rounded-lg">
                  <span className="text-gray-700 block mb-2">Frustration Triggers</span>
                  <div className="flex flex-wrap gap-2">
                    {learningData.patterns.frustrationTriggers.map((trigger, index) => (
                      <span key={index} className="px-2 py-1 bg-orange-200 text-orange-800 rounded-full text-xs">
                        {trigger}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {learningData.patterns.taskAvoidance.length > 0 && (
                <div className="p-3 bg-red-50 rounded-lg">
                  <span className="text-gray-700 block mb-2">Task Avoidance</span>
                  <div className="flex flex-wrap gap-2">
                    {learningData.patterns.taskAvoidance.map((avoidance, index) => (
                      <span key={index} className="px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs">
                        {avoidance}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'chat' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Ask Your AI Learning Coach</h3>
          
          {/* Suggested Questions */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-3">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {[
                "Why did my child struggle this week?",
                "What should we focus on tomorrow?",
                "Give me a fun weekend learning plan",
                "How can I help with reading confidence?"
              ].map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(question)}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-64 overflow-y-auto mb-4 space-y-3 bg-gray-50 rounded-lg p-4">
            {chatMessages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Brain className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>Ask me anything about {learningData.child.name}'s learning journey!</p>
              </div>
            ) : (
              chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
                    {message.type === 'ai' && (
                      <div className="flex items-center mb-1">
                        <Brain className="h-4 w-4 text-purple-500 mr-1" />
                        <span className="text-xs text-purple-600 font-medium">AI Coach</span>
                      </div>
                    )}
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Chat Input */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
              placeholder="Ask about learning progress, strategies, or get recommendations..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleChatSubmit}
              disabled={!inputMessage.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Ask
            </button>
          </div>
        </div>
      )}
    </div>
  );
};