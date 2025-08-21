import React, { useState, useEffect } from 'react';
import { Star, Trophy, Heart, Smile } from 'lucide-react';

interface GameProps {
  onComplete: (score: number) => void;
  onExit: () => void;
}

export const AutismEmotionPuzzle: React.FC<GameProps> = ({ onComplete, onExit }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(8 * 60);

  const emotions = [
    { id: 'happy', emoji: '😊', name: 'Happy', color: 'bg-yellow-200', description: 'Feeling good and cheerful' },
    { id: 'sad', emoji: '😢', name: 'Sad', color: 'bg-blue-200', description: 'Feeling down or upset' },
    { id: 'angry', emoji: '😠', name: 'Angry', color: 'bg-red-200', description: 'Feeling mad or frustrated' },
    { id: 'surprised', emoji: '😲', name: 'Surprised', color: 'bg-purple-200', description: 'Feeling shocked or amazed' },
    { id: 'scared', emoji: '😨', name: 'Scared', color: 'bg-gray-200', description: 'Feeling afraid or worried' },
    { id: 'excited', emoji: '🤩', name: 'Excited', color: 'bg-orange-200', description: 'Feeling very happy and energetic' }
  ];

  const levels = [
    {
      level: 1,
      story: "Welcome to the Emotion Garden! Let's learn about feelings together.",
      scenarios: [
        { 
          situation: "Maya got a new puppy for her birthday!", 
          image: "🎁🐶", 
          correctEmotion: 'excited',
          explanation: "Getting a new puppy is very exciting!"
        },
        { 
          situation: "Tom's ice cream fell on the ground.", 
          image: "🍦💔", 
          correctEmotion: 'sad',
          explanation: "It's sad when something we like gets ruined."
        },
        { 
          situation: "Lisa heard a loud thunder sound.", 
          image: "⛈️🔊", 
          correctEmotion: 'scared',
          explanation: "Loud sounds can make us feel scared."
        }
      ]
    },
    {
      level: 2,
      story: "Great job! Now let's explore more feelings!",
      scenarios: [
        { 
          situation: "Alex's friend took their toy without asking.", 
          image: "🧸😤", 
          correctEmotion: 'angry',
          explanation: "We feel angry when someone takes our things without asking."
        },
        { 
          situation: "Emma found a $5 bill on the sidewalk!", 
          image: "💵✨", 
          correctEmotion: 'surprised',
          explanation: "Finding money is a nice surprise!"
        },
        { 
          situation: "Sam is playing their favorite game.", 
          image: "🎮😄", 
          correctEmotion: 'happy',
          explanation: "Doing things we love makes us happy."
        }
      ]
    },
    {
      level: 3,
      story: "Amazing! Let's try some tricky emotion situations!",
      scenarios: [
        { 
          situation: "Jordan's best friend is moving to another city.", 
          image: "📦😔", 
          correctEmotion: 'sad',
          explanation: "It's sad when friends move away."
        },
        { 
          situation: "Riley just won first place in the art contest!", 
          image: "🏆🎨", 
          correctEmotion: 'excited',
          explanation: "Winning something special is very exciting!"
        },
        { 
          situation: "Casey has to give a presentation to the whole class.", 
          image: "👥📝", 
          correctEmotion: 'scared',
          explanation: "Speaking in front of people can feel scary."
        }
      ]
    }
  ];

  const currentLevelData = levels[currentLevel - 1];
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const currentScenario = currentLevelData.scenarios[currentScenarioIndex];

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

  const handleEmotionSelect = (emotionId: string) => {
    setSelectedEmotion(emotionId);
    setShowFeedback(true);
    
    const isCorrect = emotionId === currentScenario.correctEmotion;
    if (isCorrect) {
      setScore(prev => prev + 20);
    }

    setTimeout(() => {
      setShowFeedback(false);
      setSelectedEmotion(null);
      
      if (isCorrect) {
        if (currentScenarioIndex < currentLevelData.scenarios.length - 1) {
          setCurrentScenarioIndex(prev => prev + 1);
        } else if (currentLevel < levels.length) {
          setCurrentLevel(prev => prev + 1);
          setCurrentScenarioIndex(0);
        } else {
          setGameComplete(true);
        }
      }
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md w-full">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Emotion Expert!</h2>
          <p className="text-xl text-gray-600 mb-6">You understand feelings so well!</p>
          <div className="bg-pink-100 rounded-2xl p-4 mb-6">
            <div className="text-4xl font-bold text-pink-600">{score}</div>
            <div className="text-pink-700">Emotion Points!</div>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => onComplete(score)}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 px-6 rounded-xl font-bold hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
            >
              Continue Journey
            </button>
            <button
              onClick={onExit}
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-bold hover:bg-gray-300 transition-colors"
            >
              Back to Garden
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4">
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
              <div className="font-bold text-gray-800">Emotion Garden</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white rounded-2xl px-4 py-2 shadow-lg">
              <div className="text-sm text-gray-600">Time</div>
              <div className="font-bold text-gray-800">{formatTime(timeLeft)}</div>
            </div>
            <div className="bg-white rounded-2xl px-4 py-2 shadow-lg">
              <div className="text-sm text-gray-600">Score</div>
              <div className="font-bold text-pink-600">{score}</div>
            </div>
          </div>
        </div>

        {/* Story */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 text-center">
          <div className="text-4xl mb-2">🌸</div>
          <p className="text-lg text-gray-700 font-medium">{currentLevelData.story}</p>
        </div>

        {/* Scenario */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{currentScenario.image}</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">How do you think they feel?</h3>
            <div className="bg-purple-50 rounded-2xl p-4 max-w-2xl mx-auto">
              <p className="text-lg text-gray-700">{currentScenario.situation}</p>
            </div>
          </div>

          {/* Emotion Options */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {emotions.map((emotion) => (
              <button
                key={emotion.id}
                onClick={() => handleEmotionSelect(emotion.id)}
                disabled={showFeedback}
                className={`p-6 rounded-2xl transition-all duration-200 transform hover:scale-105 ${
                  selectedEmotion === emotion.id
                    ? emotion.id === currentScenario.correctEmotion
                      ? 'bg-green-200 border-4 border-green-500'
                      : 'bg-red-200 border-4 border-red-500'
                    : `${emotion.color} hover:shadow-lg border-2 border-transparent`
                } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">{emotion.emoji}</div>
                  <div className="font-bold text-gray-800 mb-1">{emotion.name}</div>
                  <div className="text-xs text-gray-600">{emotion.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 text-center">
            {selectedEmotion === currentScenario.correctEmotion ? (
              <div className="bg-green-100 rounded-2xl p-6">
                <div className="text-4xl mb-2">🎉</div>
                <h4 className="text-xl font-bold text-green-700 mb-2">Perfect Understanding!</h4>
                <p className="text-green-600 mb-3">{currentScenario.explanation}</p>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-sm text-green-700">
                    <strong>Remember:</strong> It's normal to feel {emotions.find(e => e.id === currentScenario.correctEmotion)?.name.toLowerCase()} in situations like this!
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-orange-100 rounded-2xl p-6">
                <div className="text-4xl mb-2">🤔</div>
                <h4 className="text-xl font-bold text-orange-700 mb-2">Let's Think Together!</h4>
                <p className="text-orange-600 mb-3">{currentScenario.explanation}</p>
                <div className="bg-orange-50 rounded-lg p-3">
                  <p className="text-sm text-orange-700">
                    The correct feeling was: <strong>{emotions.find(e => e.id === currentScenario.correctEmotion)?.name}</strong> {emotions.find(e => e.id === currentScenario.correctEmotion)?.emoji}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Progress */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Scenarios Completed</span>
            <span>{currentScenarioIndex + 1} / {currentLevelData.scenarios.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-pink-400 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((currentScenarioIndex + 1) / currentLevelData.scenarios.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Calm Reminder */}
        <div className="bg-blue-50 rounded-2xl p-4 mt-6 text-center">
          <div className="text-sm text-blue-700">
            🧘‍♀️ <strong>Take your time:</strong> There's no rush. Think about how you would feel!
          </div>
        </div>
      </div>
    </div>
  );
};