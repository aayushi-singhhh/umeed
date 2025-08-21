import React, { useState, useEffect } from 'react';
import { Star, Trophy, ArrowRight } from 'lucide-react';

interface GameProps {
  onComplete: (score: number) => void;
  onExit: () => void;
}

export const DyscalculiaPizzaFractions: React.FC<GameProps> = ({ onComplete, onExit }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [selectedSlices, setSelectedSlices] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(7 * 60);

  const levels = [
    {
      level: 1,
      story: "Welcome to Tony's Pizza Shop! Help serve the perfect slices!",
      challenges: [
        { question: "A customer wants 1/2 of a pizza. How many slices?", total: 4, answer: 2, visual: "🍕🍕🍕🍕" },
        { question: "Someone ordered 1/4 of a pizza. How many slices?", total: 4, answer: 1, visual: "🍕🍕🍕🍕" },
        { question: "A family wants 3/4 of a pizza. How many slices?", total: 4, answer: 3, visual: "🍕🍕🍕🍕" }
      ]
    },
    {
      level: 2,
      story: "Great job! Now let's try bigger pizzas!",
      challenges: [
        { question: "A customer wants 1/3 of a pizza. How many slices?", total: 6, answer: 2, visual: "🍕🍕🍕🍕🍕🍕" },
        { question: "Someone ordered 2/3 of a pizza. How many slices?", total: 6, answer: 4, visual: "🍕🍕🍕🍕🍕🍕" },
        { question: "A group wants 5/6 of a pizza. How many slices?", total: 6, answer: 5, visual: "🍕🍕🍕🍕🍕🍕" }
      ]
    },
    {
      level: 3,
      story: "Amazing! Now for our biggest pizzas!",
      challenges: [
        { question: "A customer wants 1/8 of a pizza. How many slices?", total: 8, answer: 1, visual: "🍕🍕🍕🍕🍕🍕🍕🍕" },
        { question: "Someone ordered 3/8 of a pizza. How many slices?", total: 8, answer: 3, visual: "🍕🍕🍕🍕🍕🍕🍕🍕" },
        { question: "A party wants 7/8 of a pizza. How many slices?", total: 8, answer: 7, visual: "🍕🍕🍕🍕🍕🍕🍕🍕" }
      ]
    }
  ];

  const currentLevelData = levels[currentLevel - 1];
  const [currentChallengeIndex, setChallengeIndex] = useState(0);
  const currentChallenge = currentLevelData.challenges[currentChallengeIndex];

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

  const handleSliceSelect = (slices: number) => {
    setSelectedSlices(slices);
    setShowFeedback(true);
    
    const isCorrect = slices === currentChallenge.answer;
    if (isCorrect) {
      setScore(prev => prev + 15);
    }

    setTimeout(() => {
      setShowFeedback(false);
      setSelectedSlices(0);
      
      if (isCorrect) {
        if (currentChallengeIndex < currentLevelData.challenges.length - 1) {
          setChallengeIndex(prev => prev + 1);
        } else if (currentLevel < levels.length) {
          setCurrentLevel(prev => prev + 1);
          setChallengeIndex(0);
        } else {
          setGameComplete(true);
        }
      }
    }, 2500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderPizzaSlices = () => {
    const slices = [];
    for (let i = 0; i < currentChallenge.total; i++) {
      slices.push(
        <button
          key={i}
          onClick={() => !showFeedback && handleSliceSelect(i + 1)}
          disabled={showFeedback}
          className={`w-16 h-16 text-3xl rounded-full transition-all duration-200 transform hover:scale-110 ${
            selectedSlices > i
              ? selectedSlices === currentChallenge.answer
                ? 'bg-green-200 border-4 border-green-500'
                : 'bg-red-200 border-4 border-red-500'
              : 'bg-orange-100 border-2 border-orange-300 hover:bg-orange-200'
          } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          🍕
        </button>
      );
    }
    return slices;
  };

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md w-full">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Pizza Master!</h2>
          <p className="text-xl text-gray-600 mb-6">You served all the customers perfectly!</p>
          <div className="bg-orange-100 rounded-2xl p-4 mb-6">
            <div className="text-4xl font-bold text-orange-600">{score}</div>
            <div className="text-orange-700">Pizza Points Earned!</div>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => onComplete(score)}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-200"
            >
              Continue Adventure
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
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-100 to-red-100 p-4">
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
              <div className="font-bold text-gray-800">Pizza Shop</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white rounded-2xl px-4 py-2 shadow-lg">
              <div className="text-sm text-gray-600">Time</div>
              <div className="font-bold text-gray-800">{formatTime(timeLeft)}</div>
            </div>
            <div className="bg-white rounded-2xl px-4 py-2 shadow-lg">
              <div className="text-sm text-gray-600">Score</div>
              <div className="font-bold text-orange-600">{score}</div>
            </div>
          </div>
        </div>

        {/* Story */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 text-center">
          <div className="text-4xl mb-2">👨‍🍳</div>
          <p className="text-lg text-gray-700 font-medium">{currentLevelData.story}</p>
        </div>

        {/* Game Area */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{currentChallenge.question}</h3>
            <div className="bg-orange-50 rounded-2xl p-6 mb-6">
              <div className="text-lg text-gray-700 mb-4">Click the pizza slices to count them!</div>
              <div className="flex justify-center items-center space-x-2 flex-wrap gap-2">
                {renderPizzaSlices()}
              </div>
            </div>
          </div>

          {/* Visual Helper */}
          <div className="bg-yellow-50 rounded-2xl p-6 mb-6 text-center">
            <div className="text-sm text-gray-600 mb-2">Whole Pizza:</div>
            <div className="text-4xl mb-2">{currentChallenge.visual}</div>
            <div className="text-sm text-gray-600">Total slices: {currentChallenge.total}</div>
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className="text-center mb-6">
              {selectedSlices === currentChallenge.answer ? (
                <div className="bg-green-100 rounded-2xl p-6">
                  <div className="text-4xl mb-2">🎉</div>
                  <h4 className="text-xl font-bold text-green-700 mb-2">Perfect Service!</h4>
                  <p className="text-green-600">You gave the customer exactly {currentChallenge.answer} slices!</p>
                </div>
              ) : (
                <div className="bg-orange-100 rounded-2xl p-6">
                  <div className="text-4xl mb-2">🤔</div>
                  <h4 className="text-xl font-bold text-orange-700 mb-2">Try Again!</h4>
                  <p className="text-orange-600">The customer needs {currentChallenge.answer} slices for their order.</p>
                </div>
              )}
            </div>
          )}

          {/* Progress */}
          <div className="mt-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Orders Completed</span>
              <span>{currentChallengeIndex + 1} / {currentLevelData.challenges.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-orange-400 to-red-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${((currentChallengeIndex + 1) / currentLevelData.challenges.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};