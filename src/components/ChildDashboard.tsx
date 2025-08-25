import React, { useState, useEffect } from 'react';
import { Star, Trophy, Gift, Play, Book, Heart, Sparkles, Volume2, Pause, RotateCcw, Wind } from 'lucide-react';
import { GameSelector } from './games/GameSelector';
import { GameProgress } from './GameProgress';
import { AILearningCoach } from './AILearningCoach';
import { useAuth } from '../contexts/AuthContext';
import { useChildProgress, useExercises } from '../hooks/useAPI';

export const ChildDashboard: React.FC = () => {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [currentMood, setCurrentMood] = useState<string>('happy');
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [showCelebration, setShowCelebration] = useState(false);
  const [showGames, setShowGames] = useState(false);
  const [showAICoach, setShowAICoach] = useState(false);
  
  const { user } = useAuth();
  
  // For child users, get their own progress
  const childId = user?.role === 'child' ? user.id : user?.children?.[0];
  const { data: childProgress, isLoading } = useChildProgress(childId);
  const { data: exercises = [] } = useExercises({ childId });

  const [score, setScore] = useState(0);
  
  // Update score when childProgress loads
  useEffect(() => {
    if (childProgress?.gameScores?.reading) {
      setScore(childProgress.gameScores.reading);
    }
  }, [childProgress]);

  const [dailyMissions, setDailyMissions] = useState([
    { id: 1, title: 'Safari Word Adventure', type: 'reading', completed: false, difficulty: 'easy', points: 15 },
    { id: 2, title: 'Pizza Fraction Fun', type: 'math', completed: true, difficulty: 'medium', points: 20 },
    { id: 3, title: 'Emotion Garden', type: 'social', completed: false, difficulty: 'easy', points: 12 }
  ]);

  // Update missions from API exercises
  useEffect(() => {
    if (exercises.length > 0) {
      const missions = exercises.slice(0, 3).map((exercise: any, index: number) => ({
        id: index + 1,
        title: exercise.title,
        type: exercise.type,
        completed: exercise.completed || false,
        difficulty: exercise.difficulty || 'easy',
        points: exercise.points || 15
      }));
      setDailyMissions(missions);
    }
  }, [exercises]);

  // Animated buddy states
  const [buddyState, setBuddyState] = useState<'idle' | 'cheering' | 'thinking'>('idle');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const questMap = [
    { 
      id: 1, 
      title: 'Dino Spelling Adventure', 
      icon: '🦕', 
      completed: true, 
      points: 15, 
      color: 'from-green-400 to-emerald-500',
      description: 'Help the dinosaurs spell their names!'
    },
    { 
      id: 2, 
      title: 'Jumping Jack Math', 
      icon: '🏃', 
      completed: true, 
      points: 10, 
      color: 'from-blue-400 to-cyan-500',
      description: 'Move your body while solving puzzles!'
    },
    { 
      id: 3, 
      title: 'Emotion Color Quest', 
      icon: '🎨', 
      completed: false, 
      points: 12, 
      color: 'from-purple-400 to-pink-500',
      description: 'Paint how you feel today!'
    },
    { 
      id: 4, 
      title: 'Learning Games', 
      icon: '🎮', 
      completed: false, 
      points: 15, 
      color: 'from-orange-400 to-red-500',
      description: 'Play fun learning games!'
    }
  ];

  const lifeSkillsChallenges = [
    { 
      title: 'Brush Teeth Like a Superhero', 
      icon: '🦷', 
      status: 'completed', 
      points: 5,
      animation: 'animate-bounce'
    },
    { 
      title: 'Pack My Magic School Bag', 
      icon: '🎒', 
      status: 'in-progress', 
      points: 8,
      animation: 'animate-pulse'
    },
    { 
      title: 'Say Magic Words (Please & Thank You)', 
      icon: '✨', 
      status: 'completed', 
      points: 3,
      animation: 'animate-bounce'
    },
    { 
      title: 'Tie Shoelaces Adventure', 
      icon: '👟', 
      status: 'new', 
      points: 10,
      animation: ''
    }
  ];

  const badges = [
    { name: 'Reading Wizard', icon: '🧙‍♂️', earned: true, description: 'Read 5 stories this week!' },
    { name: 'Kindness Hero', icon: '💝', earned: true, description: 'Shared toys with friends!' },
    { name: 'Focus Champion', icon: '🎯', earned: false, description: 'Stay focused for 15 minutes' },
    { name: 'Brave Explorer', icon: '🗺️', earned: false, description: 'Try 3 new activities' }
  ];

  const moodOptions = [
    { emoji: '😊', label: 'Happy', value: 'happy', color: 'bg-yellow-200' },
    { emoji: '😐', label: 'Okay', value: 'okay', color: 'bg-gray-200' },
    { emoji: '😟', label: 'Sad', value: 'sad', color: 'bg-blue-200' },
    { emoji: '😤', label: 'Frustrated', value: 'frustrated', color: 'bg-red-200' },
    { emoji: '😴', label: 'Tired', value: 'tired', color: 'bg-purple-200' }
  ];

  const encouragingMessages = [
    "You're doing amazing today! 🌟",
    "I'm so proud of how hard you're trying! 💪",
    "You're getting stronger every day! 🦸‍♀️",
    "Your brain is growing with every challenge! 🧠✨"
  ];

  // Sample learning data for AI Coach
  const learningData = {
    child: {
      name: 'Alex',
      age: 8,
      learningDifferences: ['ADHD', 'Dyslexia'],
      interests: ['dinosaurs', 'space', 'building blocks']
    },
    dailyMetrics: {
      tasksCompleted: 7,
      totalTasks: 10,
      focusTime: 23,
      mood: currentMood,
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

  useEffect(() => {
    // Simulate buddy animations
    const interval = setInterval(() => {
      setBuddyState(prev => prev === 'idle' ? 'thinking' : 'idle');
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleActivityComplete = (activityId: number) => {
    setBuddyState('cheering');
    setShowCelebration(true);
    setTimeout(() => {
      setShowCelebration(false);
      setBuddyState('idle');
    }, 3000);
  };

  const startBreathingExercise = () => {
    setShowBreathingExercise(true);
    // Simulate breathing cycle
    const breathingCycle = setInterval(() => {
      setBreathingPhase(prev => prev === 'inhale' ? 'exhale' : 'inhale');
    }, 3000);

    setTimeout(() => {
      clearInterval(breathingCycle);
      setShowBreathingExercise(false);
    }, 30000);
  };

  const handleGameComplete = (gameType: string, score: number) => {
    setBuddyState('cheering');
    setShowCelebration(true);
    setScore(prev => prev + score);
    
    // Update daily missions
    setDailyMissions(prev => prev.map(mission => {
      if (gameType.includes(mission.type)) {
        return { ...mission, completed: true };
      }
      return mission;
    }));
    
    setTimeout(() => {
      setShowCelebration(false);
      setBuddyState('idle');
      setShowGames(false);
    }, 3000);
  };

  if (showGames) {
    return (
      <GameSelector 
        onBack={() => setShowGames(false)}
        onGameComplete={handleGameComplete}
      />
    );
  }

  if (showAICoach) {
    return <AILearningCoach learningData={learningData} userRole="child" />;
  }

  if (showBreathingExercise) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Let's Take a Calm Breath 🫧</h2>
            <p className="text-lg text-gray-600">Follow the bubble and breathe with me</p>
          </div>
          
          <div className="relative">
            <div 
              className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-300 to-purple-300 transition-all duration-3000 ${
                breathingPhase === 'inhale' ? 'scale-150' : 'scale-100'
              }`}
            >
              <div className="absolute inset-0 rounded-full bg-white opacity-30 animate-pulse"></div>
            </div>
            <p className="text-2xl font-bold text-gray-700 mt-6">
              {breathingPhase === 'inhale' ? 'Breathe In... 🌬️' : 'Breathe Out... 💨'}
            </p>
          </div>

          <button
            onClick={() => setShowBreathingExercise(false)}
            className="mt-8 px-6 py-3 bg-green-500 text-white rounded-full font-bold hover:bg-green-600 transition-colors"
          >
            I Feel Better Now! ✨
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 p-4">
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 text-center animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Awesome Job!</h3>
            <p className="text-gray-600">You earned 15 points!</p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header with Buddy */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className={`text-8xl transition-transform duration-500 ${
              buddyState === 'cheering' ? 'animate-bounce' : 
              buddyState === 'thinking' ? 'animate-pulse' : ''
            }`}>
              🦉
            </div>
            <div className="absolute -top-2 -right-2">
              {buddyState === 'cheering' && <span className="text-2xl animate-spin">⭐</span>}
              {buddyState === 'thinking' && <span className="text-xl animate-pulse">💭</span>}
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Hi Alex! 🌟</h1>
          <p className="text-xl text-gray-600">Ready for today's adventure?</p>
          
          {/* Stats Bar */}
          <div className="flex justify-center items-center space-x-8 mt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2">
                142
              </div>
              <p className="text-sm text-gray-600">Magic Points</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2">
                7
              </div>
              <p className="text-sm text-gray-600">Badges</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2">
                3
              </div>
              <p className="text-sm text-gray-600">Quests Done</p>
            </div>
          </div>
        </div>

        {/* Mood Check-in */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">How are you feeling today? 💭</h3>
          <div className="flex justify-center space-x-4">
            {moodOptions.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setCurrentMood(mood.value)}
                className={`w-16 h-16 rounded-full ${mood.color} flex items-center justify-center text-2xl transition-all duration-200 hover:scale-110 ${
                  currentMood === mood.value ? 'ring-4 ring-blue-300 scale-110' : ''
                }`}
              >
                {mood.emoji}
              </button>
            ))}
          </div>
          {currentMood && (
            <p className="text-center mt-4 text-gray-600">
              {currentMood === 'happy' && "That's wonderful! Let's have fun learning! 🎉"}
              {currentMood === 'okay' && "That's perfectly fine! Let's make today better! 🌈"}
              {currentMood === 'sad' && "I'm here for you! Let's do something gentle today. 🤗"}
              {currentMood === 'frustrated' && "I understand. Want to try a calming activity first? 🫧"}
              {currentMood === 'tired' && "Let's take it easy today with fun, gentle activities! 😴"}
            </p>
          )}
        </div>

        {/* Quest Map */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
            <span className="mr-2">🗺️</span>
            Today's Daily Missions
            <span className="ml-2">✨</span>
          </h3>
          
          {/* AI Personalized Missions */}
          <div className="bg-blue-50 rounded-2xl p-4 mb-6 text-center">
            <div className="text-sm text-blue-700 mb-2">🤖 <strong>Your AI Buddy Says:</strong></div>
            <p className="text-blue-800">"I picked these special games just for you today! Let's have fun learning together!"</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dailyMissions.map((mission, index) => (
              <div
                key={mission.id}
                className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                  mission.completed 
                    ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-4 border-green-300' 
                    : `bg-gradient-to-br from-purple-400 to-pink-500 text-white shadow-lg hover:shadow-xl`
                }`}
                onClick={() => {
                  if (!mission.completed) {
                    if (mission.type === 'reading' || mission.type === 'math' || mission.type === 'social') {
                      setShowGames(true);
                    } else {
                      handleActivityComplete(mission.id);
                    }
                  }
                }}
              >
                {mission.completed && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-white" />
                  </div>
                )}
                
                <div className="text-center">
                  <div className="text-5xl mb-3">
                    {mission.type === 'reading' && '🦁'}
                    {mission.type === 'math' && '🍕'}
                    {mission.type === 'social' && '🌸'}
                    {mission.type === 'focus' && '🗺️'}
                  </div>
                  <h4 className="font-bold text-lg mb-2">{mission.title}</h4>
                  <div className={`text-xs mb-2 ${mission.completed ? 'text-gray-500' : 'text-white opacity-75'}`}>
                    Difficulty: {mission.difficulty} • {mission.points} points
                  </div>
                  
                  {mission.completed ? (
                    <div className="flex items-center justify-center text-green-600">
                      <Star className="h-5 w-5 mr-1 fill-current" />
                      <span className="font-bold">+{mission.points} points earned!</span>
                    </div>
                  ) : (
                    <div className="bg-white bg-opacity-20 rounded-full px-4 py-2 font-bold">
                      {mission.points} points waiting!
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Progress Summary */}
          <div className="mt-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm text-gray-600">Today's Progress</span>
                <div className="font-bold text-gray-800">
                  {dailyMissions.filter(m => m.completed).length} / {dailyMissions.length} missions complete
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-600">Points Earned</span>
                <div className="font-bold text-orange-600">
                  +{dailyMissions.filter(m => m.completed).reduce((sum, m) => sum + m.points, 0)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Life Skills Zone */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🏠</span>
              Life Skills Challenges
            </h3>
            <div className="space-y-4">
              {lifeSkillsChallenges.map((challenge, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    challenge.status === 'completed' 
                      ? 'bg-green-50 border-green-300' 
                      : challenge.status === 'in-progress'
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-gray-50 border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`text-3xl ${challenge.animation}`}>{challenge.icon}</span>
                      <div>
                        <p className="font-bold text-gray-800">{challenge.title}</p>
                        {challenge.status === 'completed' && (
                          <p className="text-green-600 text-sm font-medium">✨ Completed! Great job!</p>
                        )}
                        {challenge.status === 'in-progress' && (
                          <p className="text-blue-600 text-sm font-medium">🔄 Keep going!</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">
                        +{challenge.points}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wellness Corner */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🧘‍♀️</span>
              Calm Corner
            </h3>
            <div className="space-y-4">
              <button
                onClick={startBreathingExercise}
                className="w-full p-4 bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-xl font-bold hover:from-blue-500 hover:to-purple-600 transition-all duration-200"
              >
                <Wind className="h-6 w-6 mx-auto mb-2" />
                Bubble Breathing 🫧
              </button>
              
              <button className="w-full p-4 bg-gradient-to-r from-green-400 to-teal-500 text-white rounded-xl font-bold hover:from-green-500 hover:to-teal-600 transition-all duration-200">
                <span className="block mb-2">🎵</span>
                Calming Music
              </button>
              
              <button className="w-full p-4 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-xl font-bold hover:from-orange-500 hover:to-pink-600 transition-all duration-200">
                <span className="block mb-2">🏃‍♂️</span>
                Movement Break
              </button>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl">
              <p className="text-center text-gray-700 font-medium">
                {encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)]}
              </p>
            </div>
          </div>
        </div>

        {/* Badge Collection */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
            <Gift className="h-6 w-6 mr-2 text-purple-500" />
            My Amazing Badge Collection
            <Sparkles className="h-6 w-6 ml-2 text-yellow-500" />
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge, index) => (
              <div
                key={index}
                className={`p-4 rounded-2xl text-center transition-all duration-300 hover:scale-105 ${
                  badge.earned 
                    ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-4 border-yellow-300 shadow-lg' 
                    : 'bg-gray-100 border-2 border-gray-200 opacity-60'
                }`}
              >
                <div className="text-5xl mb-3">{badge.icon}</div>
                <p className="font-bold text-gray-800 mb-1">{badge.name}</p>
                <p className="text-xs text-gray-600 mb-3">{badge.description}</p>
                {badge.earned && (
                  <div className="inline-flex items-center px-3 py-1 bg-yellow-200 text-yellow-800 text-xs font-bold rounded-full">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Earned!
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Encouragement Footer */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-8 rounded-3xl shadow-lg">
            <div className="text-4xl mb-4">🎉</div>
            <h4 className="text-2xl font-bold mb-3">You're Doing AMAZING, Alex!</h4>
            <p className="text-purple-100 mb-6 text-lg">
              Every day you're getting stronger, smarter, and more awesome! 
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-white text-purple-600 px-6 py-3 rounded-full font-bold hover:bg-purple-50 transition-colors">
                📞 Tell Mom & Dad!
              </button>
              <button className="bg-purple-600 text-white px-6 py-3 rounded-full font-bold hover:bg-purple-700 transition-colors border-2 border-white">
                🎁 Surprise Me!
              </button>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-200">
              <button
                onClick={() => setShowAICoach(true)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200"
              >
                <span className="text-sm font-medium">My Learning Story! 📖</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};