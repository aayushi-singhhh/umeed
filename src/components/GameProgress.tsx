import React from 'react';
import { TrendingUp, Target, Clock, Star } from 'lucide-react';

interface GameProgressProps {
  gameData: {
    type: string;
    score: number;
    timeSpent: number;
    accuracy: number;
    improvement: number;
  }[];
}

export const GameProgress: React.FC<GameProgressProps> = ({ gameData }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
        Game Progress Insights
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gameData.map((game, index) => (
          <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-gray-800 capitalize">{game.type} Games</h4>
                <p className="text-sm text-gray-600">Last 7 days</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">{game.score}</div>
                <div className="text-xs text-gray-500">avg score</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Accuracy</span>
                <span className="font-medium">{game.accuracy}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                  style={{ width: `${game.accuracy}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Time Spent</span>
                <span className="font-medium">{game.timeSpent} min</span>
              </div>
              
              {game.improvement > 0 && (
                <div className="flex items-center text-green-600 text-sm">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+{game.improvement}% improvement</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};