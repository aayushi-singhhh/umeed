import React, { useState, useEffect } from 'react';
import { Star, Heart, Trophy, ArrowRight } from 'lucide-react';

interface GameProps {
  onComplete: (score: number) => void;
  onExit: () => void;
}

export const DyslexiaAnimalWords: React.FC<GameProps> = ({ onComplete, onExit }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(7 * 60); // 7 minutes

  const levels = [
    {
      level: 1,
      story: "Welcome to Safari Word Adventure! Help the animals find their names!",
      words: [
        { word: 'CAT', image: '🐱', sound: '/sounds/cat.mp3' },
        { word: 'DOG', image: '🐶', sound: '/sounds/dog.mp3' },
        { word: 'PIG', image: '🐷', sound: '/sounds/pig.mp3' }
      ],
      scrambled: ['TAC', 'GOD', 'GIP']
    },
    {
      level: 2,
      story: "Great job! Now let's help the farm animals!",
      words: [
        { word: 'DUCK', image: '🦆', sound: '/sounds/duck.mp3' },
        { word: 'GOAT', image: '🐐', sound: '/sounds/goat.mp3' },
        { word: 'FROG', image: '🐸', sound: '/sounds/frog.mp3' }
      ],
      scrambled: ['CKUD', 'TAOG', 'GORF']
    },
    {
      level: 3,
      story: "Amazing! Now the jungle animals need your help!",
      words: [
        { word: 'TIGER', image: '🐅', sound: '/sounds/tiger.mp3' },
        { word: 'ZEBRA', image: '🦓', sound: '/sounds/zebra.mp3' },
        { word: 'SNAKE', image: '🐍', sound: '/sounds/snake.mp3' }
      ],
      scrambled: ['GREIT', 'ARBEZ', 'KEANS']
    }
  ];

  const currentLevelData = levels[currentLevel - 1];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const currentWord = currentLevelData.words[currentWordIndex];

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

  const handleWordSelect = (word: string) => {
    setSelectedWord(word);
    setShowFeedback(true);
    
    const isCorrect = word === currentWord.word;
    if (isCorrect) {
      setScore(prev => prev + 10);
    }

    setTimeout(() => {
      setShowFeedback(false);
      setSelectedWord(null);
      
      if (isCorrect) {
        if (currentWordIndex < currentLevelData.words.length - 1) {
          setCurrentWordIndex(prev => prev + 1);
        } else if (currentLevel < levels.length) {
          setCurrentLevel(prev => prev + 1);
          setCurrentWordIndex(0);
        } else {
          setGameComplete(true);
        }
      }
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md w-full">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Safari Complete!</h2>
          <p className="text-xl text-gray-600 mb-6">You helped all the animals find their names!</p>
          <div className="bg-yellow-100 rounded-2xl p-4 mb-6">
            <div className="text-4xl font-bold text-yellow-600">{score}</div>
            <div className="text-yellow-700">Safari Points Earned!</div>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => onComplete(score)}
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-6 rounded-xl font-bold hover:from-green-600 hover:to-blue-600 transition-all duration-200"
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 p-4">
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
              <div className="font-bold text-gray-800">Safari Adventure</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white rounded-2xl px-4 py-2 shadow-lg">
              <div className="text-sm text-gray-600">Time</div>
              <div className="font-bold text-gray-800">{formatTime(timeLeft)}</div>
            </div>
            <div className="bg-white rounded-2xl px-4 py-2 shadow-lg">
              <div className="text-sm text-gray-600">Score</div>
              <div className="font-bold text-yellow-600">{score}</div>
            </div>
          </div>
        </div>

        {/* Story */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 text-center">
          <p className="text-lg text-gray-700 font-medium">{currentLevelData.story}</p>
        </div>

        {/* Game Area */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="text-8xl mb-4 animate-bounce">{currentWord.image}</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Help this animal find its name!</h3>
            <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors">
              🔊 Hear the sound
            </button>
          </div>

          {/* Word Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[currentWord.word, ...currentLevelData.scrambled.slice(0, 2)].sort().map((word, index) => (
              <button
                key={index}
                onClick={() => handleWordSelect(word)}
                disabled={showFeedback}
                className={`p-6 rounded-2xl text-2xl font-bold transition-all duration-200 transform hover:scale-105 ${
                  selectedWord === word
                    ? word === currentWord.word
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                    : 'bg-gradient-to-br from-purple-400 to-pink-400 text-white hover:from-purple-500 hover:to-pink-500'
                } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {word}
              </button>
            ))}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className="text-center">
              {selectedWord === currentWord.word ? (
                <div className="bg-green-100 rounded-2xl p-6">
                  <div className="text-4xl mb-2">🎉</div>
                  <h4 className="text-xl font-bold text-green-700 mb-2">Perfect!</h4>
                  <p className="text-green-600">You helped the {currentWord.word.toLowerCase()} find its name!</p>
                </div>
              ) : (
                <div className="bg-orange-100 rounded-2xl p-6">
                  <div className="text-4xl mb-2">🤔</div>
                  <h4 className="text-xl font-bold text-orange-700 mb-2">Try Again!</h4>
                  <p className="text-orange-600">The {currentWord.image} is called "{currentWord.word}"</p>
                </div>
              )}
            </div>
          )}

          {/* Progress */}
          <div className="mt-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{currentWordIndex + 1} / {currentLevelData.words.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${((currentWordIndex + 1) / currentLevelData.words.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};