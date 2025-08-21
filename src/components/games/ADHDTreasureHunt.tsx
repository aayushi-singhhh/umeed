import React, { useState, useEffect } from 'react';
import { Star, Trophy, Zap, Target } from 'lucide-react';

interface GameProps {
  onComplete: (score: number) => void;
  onExit: () => void;
}

export const ADHDTreasureHunt: React.FC<GameProps> = ({ onComplete, onExit }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [showingSequence, setShowingSequence] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [currentStep, setCurrentStep] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [streak, setStreak] = useState(0);

  const treasureItems = [
    { id: 1, emoji: '💎', name: 'Diamond', color: 'bg-blue-400' },
    { id: 2, emoji: '🏆', name: 'Trophy', color: 'bg-yellow-400' },
    { id: 3, emoji: '⭐', name: 'Star', color: 'bg-purple-400' },
    { id: 4, emoji: '🎯', name: 'Target', color: 'bg-red-400' },
    { id: 5, emoji: '🔥', name: 'Fire', color: 'bg-orange-400' },
    { id: 6, emoji: '⚡', name: 'Lightning', color: 'bg-green-400' }
  ];

  const levels = [
    { level: 1, story: "Welcome, brave explorer! Follow the treasure map sequence!", length: 3, speed: 1000 },
    { level: 2, story: "Great job! The treasure is getting closer!", length: 4, speed: 900 },
    { level: 3, story: "Amazing focus! One more challenge to the treasure!", length: 5, speed: 800 }
  ];

  const currentLevelData = levels[currentLevel - 1];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    startNewSequence();
  }, [currentLevel]);

  const startNewSequence = () => {
    const newSequence = [];
    for (let i = 0; i < currentLevelData.length; i++) {
      newSequence.push(Math.floor(Math.random() * 6) + 1);
    }
    setSequence(newSequence);
    setPlayerSequence([]);
    setCurrentStep(0);
    showSequenceToPlayer(newSequence);
  };

  const showSequenceToPlayer = (seq: number[]) => {
    setShowingSequence(true);
    let index = 0;
    
    const showNext = () => {
      if (index < seq.length) {
        setCurrentStep(seq[index]);
        setTimeout(() => {
          setCurrentStep(0);
          index++;
          if (index < seq.length) {
            setTimeout(showNext, 200);
          } else {
            setShowingSequence(false);
          }
        }, currentLevelData.speed);
      }
    };
    
    setTimeout(showNext, 500);
  };

  const handleItemClick = (itemId: number) => {
    if (showingSequence) return;

    const newPlayerSequence = [...playerSequence, itemId];
    setPlayerSequence(newPlayerSequence);

    const currentIndex = newPlayerSequence.length - 1;
    const isCorrect = sequence[currentIndex] === itemId;

    if (!isCorrect) {
      setShowFeedback(true);
      setTimeout(() => {
        setShowFeedback(false);
        setStreak(0);
        startNewSequence();
      }, 1500);
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      // Completed sequence successfully
      const points = currentLevelData.length * 10 + (streak * 5);
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setShowFeedback(true);

      setTimeout(() => {
        setShowFeedback(false);
        if (currentLevel < levels.length) {
          setCurrentLevel(prev => prev + 1);
        } else {
          setGameComplete(true);
        }
      }, 2000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md w-full">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Treasure Found!</h2>
          <p className="text-xl text-gray-600 mb-6">Your amazing focus led you to the treasure!</p>
          <div className="bg-purple-100 rounded-2xl p-4 mb-6">
            <div className="text-4xl font-bold text-purple-600">{score}</div>
            <div className="text-purple-700">Adventure Points!</div>
            <div className="text-sm text-purple-600 mt-1">Streak: {streak} in a row!</div>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => onComplete(score)}
              className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-xl font-bold hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
            >
              Continue Quest
            </button>
            <button
              onClick={onExit}
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-bold hover:bg-gray-300 transition-colors"
            >
              Back to Map
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onExit}
              className="bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
            >
              ←
            </button>
            <div className="bg-white rounded-2xl px-4 py-2 shadow-lg">
              <div className="text-sm text-gray-600">Level {currentLevel}</div>
              <div className="font-bold text-gray-800">Treasure Hunt</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white rounded-2xl px-4 py-2 shadow-lg">
              <div className="text-sm text-gray-600">Time</div>
              <div className="font-bold text-gray-800">{formatTime(timeLeft)}</div>
            </div>
            <div className="bg-white rounded-2xl px-4 py-2 shadow-lg">
              <div className="text-sm text-gray-600">Score</div>
              <div className="font-bold text-purple-600">{score}</div>
            </div>
            {streak > 0 && (
              <div className="bg-yellow-100 rounded-2xl px-4 py-2 shadow-lg">
                <div className="text-sm text-yellow-600">Streak</div>
                <div className="font-bold text-yellow-700">{streak}🔥</div>
              </div>
            )}
          </div>
        </div>

        {/* Story */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 text-center">
          <div className="text-4xl mb-2">🗺️</div>
          <p className="text-lg text-gray-700 font-medium">{currentLevelData.story}</p>
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-3xl p-6 mb-8 text-center">
          {showingSequence ? (
            <div>
              <div className="text-2xl font-bold mb-2">📍 Watch the Map!</div>
              <p className="text-purple-100">Remember the treasure sequence...</p>
            </div>
          ) : (
            <div>
              <div className="text-2xl font-bold mb-2">🎯 Your Turn!</div>
              <p className="text-purple-100">Click the treasures in the same order!</p>
              <div className="text-sm mt-2 text-purple-200">
                Progress: {playerSequence.length} / {sequence.length}
              </div>
            </div>
          )}
        </div>

        {/* Game Grid */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {treasureItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                disabled={showingSequence}
                className={`aspect-square rounded-2xl text-4xl font-bold transition-all duration-200 transform hover:scale-110 ${
                  currentStep === item.id && showingSequence
                    ? `${item.color} scale-125 shadow-2xl animate-pulse`
                    : playerSequence.includes(item.id)
                    ? 'bg-green-200 border-4 border-green-500'
                    : `${item.color} hover:shadow-xl`
                } ${showingSequence ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-3xl mb-1">{item.emoji}</div>
                  <div className="text-xs text-white font-medium">{item.name}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className="text-center mt-8">
              {playerSequence.length === sequence.length ? (
                <div className="bg-green-100 rounded-2xl p-6">
                  <div className="text-4xl mb-2">🎉</div>
                  <h4 className="text-xl font-bold text-green-700 mb-2">Perfect Memory!</h4>
                  <p className="text-green-600">You followed the treasure map perfectly!</p>
                  {streak > 1 && (
                    <div className="text-sm text-green-600 mt-2">
                      Amazing streak: {streak} in a row! 🔥
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-orange-100 rounded-2xl p-6">
                  <div className="text-4xl mb-2">🗺️</div>
                  <h4 className="text-xl font-bold text-orange-700 mb-2">New Map!</h4>
                  <p className="text-orange-600">Let's try a different treasure path!</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Tips */}
        <div className="bg-yellow-50 rounded-2xl p-4 mt-6 text-center">
          <div className="text-sm text-yellow-700">
            💡 <strong>Focus Tip:</strong> Take a deep breath and watch carefully!
          </div>
        </div>
      </div>
    </div>
  );
};