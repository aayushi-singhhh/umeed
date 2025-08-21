import React, { useState } from 'react';
import { Brain, Calculator, Zap, Heart, Sparkles, ArrowLeft } from 'lucide-react';
import { DyslexiaAnimalWords } from './DyslexiaAnimalWords';
import { DyscalculiaPizzaFractions } from './DyscalculiaPizzaFractions';
import { ADHDTreasureHunt } from './ADHDTreasureHunt';
import { AutismEmotionPuzzle } from './AutismEmotionPuzzle';

interface GameSelectorProps {
  onBack: () => void;
  onGameComplete: (gameType: string, score: number) => void;
}

export const GameSelector: React.FC<GameSelectorProps> = ({ onBack, onGameComplete }) => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const games = [
    {
      id: 'dyslexia-words',
      title: 'Safari Word Adventure',
      description: 'Help animals find their names! Perfect for reading practice.',
      icon: Brain,
      color: 'from-green-400 to-blue-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      difficulty: 'Easy',
      duration: '5-7 minutes',
      skills: ['Word Recognition', 'Reading', 'Phonics'],
      emoji: '🦁'
    },
    {
      id: 'dyscalculia-fractions',
      title: 'Pizza Shop Fractions',
      description: 'Serve customers the perfect pizza slices and learn fractions!',
      icon: Calculator,
      color: 'from-orange-400 to-red-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      difficulty: 'Medium',
      duration: '6-8 minutes',
      skills: ['Fractions', 'Counting', 'Visual Math'],
      emoji: '🍕'
    },
    {
      id: 'adhd-memory',
      title: 'Treasure Hunt Memory',
      description: 'Follow the treasure map sequence and improve your focus!',
      icon: Zap,
      color: 'from-purple-400 to-blue-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      difficulty: 'Medium',
      duration: '5 minutes',
      skills: ['Memory', 'Focus', 'Attention'],
      emoji: '🗺️'
    },
    {
      id: 'autism-emotions',
      title: 'Emotion Garden Puzzle',
      description: 'Learn about feelings through calm, structured scenarios.',
      icon: Heart,
      color: 'from-pink-400 to-purple-500',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      difficulty: 'Easy',
      duration: '7-10 minutes',
      skills: ['Emotions', 'Social Skills', 'Empathy'],
      emoji: '🌸'
    }
  ];

  const handleGameSelect = (gameId: string) => {
    setSelectedGame(gameId);
  };

  const handleGameComplete = (score: number) => {
    if (selectedGame) {
      onGameComplete(selectedGame, score);
      setSelectedGame(null);
    }
  };

  const handleGameExit = () => {
    setSelectedGame(null);
  };

  // Render selected game
  if (selectedGame === 'dyslexia-words') {
    return <DyslexiaAnimalWords onComplete={handleGameComplete} onExit={handleGameExit} />;
  }
  if (selectedGame === 'dyscalculia-fractions') {
    return <DyscalculiaPizzaFractions onComplete={handleGameComplete} onExit={handleGameExit} />;
  }
  if (selectedGame === 'adhd-memory') {
    return <ADHDTreasureHunt onComplete={handleGameComplete} onExit={handleGameExit} />;
  }
  if (selectedGame === 'autism-emotions') {
    return <AutismEmotionPuzzle onComplete={handleGameComplete} onExit={handleGameExit} />;
  }

  // Game selection screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow mr-4"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Learning Adventure Games</h1>
            <p className="text-gray-600 mt-1">Choose a fun game designed just for you!</p>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {games.map((game) => {
            const IconComponent = game.icon;
            return (
              <div
                key={game.id}
                className={`${game.bgColor} rounded-3xl p-6 border-2 ${game.borderColor} hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer`}
                onClick={() => handleGameSelect(game.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 bg-gradient-to-r ${game.color} rounded-2xl`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-4xl">{game.emoji}</div>
                  </div>
                  <div className="text-right">
                    <div className="bg-white rounded-full px-3 py-1 text-xs font-medium text-gray-600 mb-1">
                      {game.difficulty}
                    </div>
                    <div className="text-xs text-gray-500">{game.duration}</div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{game.title}</h3>
                <p className="text-gray-600 mb-4">{game.description}</p>

                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Skills you'll practice:</div>
                  <div className="flex flex-wrap gap-2">
                    {game.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-white rounded-full px-3 py-1 text-xs font-medium text-gray-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <button className={`w-full bg-gradient-to-r ${game.color} text-white py-3 px-6 rounded-xl font-bold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2`}>
                  <Sparkles className="h-4 w-4" />
                  <span>Start Adventure</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Tips Section */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">💡</span>
            Game Tips for Success
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-2xl p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Take Your Time</h4>
              <p className="text-blue-700 text-sm">There's no rush! Think carefully about each choice.</p>
            </div>
            <div className="bg-green-50 rounded-2xl p-4">
              <h4 className="font-semibold text-green-800 mb-2">Ask for Help</h4>
              <p className="text-green-700 text-sm">If you need help, ask a parent or teacher!</p>
            </div>
            <div className="bg-purple-50 rounded-2xl p-4">
              <h4 className="font-semibold text-purple-800 mb-2">Have Fun</h4>
              <p className="text-purple-700 text-sm">Learning is an adventure - enjoy the journey!</p>
            </div>
            <div className="bg-orange-50 rounded-2xl p-4">
              <h4 className="font-semibold text-orange-800 mb-2">Celebrate Wins</h4>
              <p className="text-orange-700 text-sm">Every correct answer is worth celebrating!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};