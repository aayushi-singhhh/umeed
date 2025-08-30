import React, { useState } from 'react';
import { Sparkles, ArrowLeft } from 'lucide-react';

interface MatchingGame {
  type: 'matching';
  pictures: { emoji: string; word: string; id: string }[];
  instruction: string;
  encouragement: string;
  hint: string;
}

interface FillInBlank {
  type: 'fill-blank';
  sentence: string;
  options: string[];
  correct: string;
  encouragement: string;
  hint: string;
}

interface QuizGame {
  type: 'quiz';
  question: string;
  choices: { emoji: string; text: string; id: string }[];
  correct: string;
  encouragement: string;
  hint: string;
}

type Quest = MatchingGame | FillInBlank | QuizGame;

interface QuestSet {
  theme: string;
  quests: Quest[];
  badge: {
    name: string;
    emoji: string;
    description: string;
  };
}

interface GameifiedQuestsProps {
  onBack: () => void;
  onComplete: (score: number) => void;
}

export const GameifiedQuests: React.FC<GameifiedQuestsProps> = ({ onBack, onComplete }) => {
  const [currentQuestIndex, setCurrentQuestIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [completedQuests, setCompletedQuests] = useState<boolean[]>([false, false, false]);
  const [showBadge, setShowBadge] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [questSet, setQuestSet] = useState<QuestSet | null>(null);

  // Mock quest data - in production this would come from OpenAI
  const mockQuestSets: { [key: string]: QuestSet } = {
    animals: {
      theme: "Animals",
      quests: [
        {
          type: 'matching',
          pictures: [
            { emoji: '🐘', word: 'Elephant', id: 'elephant' },
            { emoji: '🦁', word: 'Lion', id: 'lion' },
            { emoji: '🐦', word: 'Bird', id: 'bird' },
            { emoji: '🐢', word: 'Turtle', id: 'turtle' }
          ],
          instruction: "Drag the words to the right picture!",
          encouragement: "Woohoo! You matched it! 🌟",
          hint: "Hmm, try again. Which one has a long trunk?"
        },
        {
          type: 'fill-blank',
          sentence: "The 🦁 is the king of the ____.",
          options: ["jungle", "sky", "water"],
          correct: "jungle",
          encouragement: "Yes! Lions roar in the jungle! 🦁💛",
          hint: "Lions live in wild places with lots of trees!"
        },
        {
          type: 'quiz',
          question: "Which animal can fly?",
          choices: [
            { emoji: '🐘', text: 'Elephant', id: 'elephant' },
            { emoji: '🐢', text: 'Turtle', id: 'turtle' },
            { emoji: '🐦', text: 'Bird', id: 'bird' }
          ],
          correct: "bird",
          encouragement: "Amazing! Birds have wings to fly! 🐦✨",
          hint: "Almost! Look for wings 🪽."
        }
      ],
      badge: {
        name: "Explorer Badge",
        emoji: "🌍",
        description: "You're an amazing animal explorer!"
      }
    },
    space: {
      theme: "Space",
      quests: [
        {
          type: 'matching',
          pictures: [
            { emoji: '🌞', word: 'Sun', id: 'sun' },
            { emoji: '🌙', word: 'Moon', id: 'moon' },
            { emoji: '⭐', word: 'Star', id: 'star' },
            { emoji: '🚀', word: 'Rocket', id: 'rocket' }
          ],
          instruction: "Match the space words to their pictures!",
          encouragement: "Stellar job! You're a space expert! ⭐",
          hint: "Look carefully at the shapes and colors!"
        },
        {
          type: 'fill-blank',
          sentence: "Astronauts travel to space in a ____.",
          options: ["car", "rocket", "boat"],
          correct: "rocket",
          encouragement: "Blast off! Rockets take us to space! 🚀",
          hint: "What goes up, up, up into the sky?"
        },
        {
          type: 'quiz',
          question: "What do we see in the sky at night?",
          choices: [
            { emoji: '🌞', text: 'Sun', id: 'sun' },
            { emoji: '🌙', text: 'Moon', id: 'moon' },
            { emoji: '🌈', text: 'Rainbow', id: 'rainbow' }
          ],
          correct: "moon",
          encouragement: "Perfect! The moon shines at night! 🌙✨",
          hint: "Think about what's bright in the dark sky!"
        }
      ],
      badge: {
        name: "Space Explorer",
        emoji: "🚀",
        description: "You're ready for space adventures!"
      }
    }
  };

  const generateQuests = async (selectedTheme: string) => {
    setIsGenerating(true);
    
    try {
      // Call the backend API to generate quests
      const response = await fetch('http://localhost:5001/generate_quests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          theme: selectedTheme,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.quest_set) {
        setQuestSet(data.quest_set);
        setCurrentQuestIndex(0);
        setScore(0);
        setCompletedQuests([false, false, false]);
      } else {
        throw new Error(data.error || 'Failed to generate quests');
      }
    } catch (error) {
      console.error('Error generating quests:', error);
      // Fallback to mock data if API fails
      const quest = mockQuestSets[selectedTheme] || mockQuestSets.animals;
      setQuestSet(quest);
      setCurrentQuestIndex(0);
      setScore(0);
      setCompletedQuests([false, false, false]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswer = (answer: string) => {
    if (showFeedback) return;
    
    const currentQuest = questSet!.quests[currentQuestIndex];
    
    let correct = false;
    if (currentQuest.type === 'matching') {
      // For matching, check if answer matches any word
      correct = currentQuest.pictures.some(p => p.word.toLowerCase() === answer.toLowerCase());
    } else if (currentQuest.type === 'fill-blank') {
      correct = answer.toLowerCase() === currentQuest.correct.toLowerCase();
    } else if (currentQuest.type === 'quiz') {
      correct = answer.toLowerCase() === currentQuest.correct.toLowerCase();
    }
    
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setScore(score + 1);
      const newCompleted = [...completedQuests];
      newCompleted[currentQuestIndex] = true;
      setCompletedQuests(newCompleted);
    }
    
    setTimeout(() => {
      setShowFeedback(false);
      
      if (currentQuestIndex < questSet!.quests.length - 1) {
        setCurrentQuestIndex(currentQuestIndex + 1);
      } else {
        // Show badge and complete
        setShowBadge(true);
        setTimeout(() => {
          onComplete(score + (correct ? 1 : 0));
        }, 3000);
      }
    }, 2500);
  };

  if (!questSet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 font-medium"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </button>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-purple-800 mb-4">
              🎮 Learning Quest Adventures!
            </h1>
            <p className="text-xl text-purple-600">Choose your learning adventure!</p>
          </div>

          {isGenerating ? (
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
              <Sparkles className="h-16 w-16 text-purple-500 mx-auto mb-6 animate-spin" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Creating Your Magical Quest...
              </h2>
              <p className="text-gray-600">Our AI is making special games just for you!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(mockQuestSets).map(([key, questData]) => (
                <div
                  key={key}
                  onClick={() => {
                    generateQuests(key);
                  }}
                  className="bg-white rounded-3xl shadow-xl p-8 cursor-pointer hover:scale-105 transition-transform duration-300 text-center"
                >
                  <div className="text-6xl mb-4">
                    {key === 'animals' ? '🦁🐘🐦' : '🚀🌙⭐'}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {questData.theme} Adventure
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Learn about {questData.theme.toLowerCase()} through fun games!
                  </p>
                  <div className="bg-purple-100 rounded-xl p-3">
                    <span className="text-purple-700 font-medium">
                      3 Fun Games • Earn {questData.badge.emoji} Badge
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentQuest = questSet.quests[currentQuestIndex];

  if (showBadge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md mx-auto">
          <div className="text-8xl mb-6 animate-bounce">{questSet.badge.emoji}</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Congratulations! 🎉
          </h2>
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-bold mb-2">{questSet.badge.name}</h3>
            <p>{questSet.badge.description}</p>
            <div className="mt-4 text-2xl">
              Score: {score}/3 ⭐
            </div>
          </div>
          <p className="text-gray-600 mb-6">
            You've completed the {questSet.theme} quest! Keep learning and growing! 🌱
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              {questSet.quests.map((_, index) => (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full ${
                    index < currentQuestIndex
                      ? 'bg-green-500'
                      : index === currentQuestIndex
                      ? 'bg-blue-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-purple-600 font-bold">
              Quest {currentQuestIndex + 1}/3
            </span>
          </div>
        </div>

        {/* Quest Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {currentQuest.type === 'matching' && '🎯 Match the Words'}
              {currentQuest.type === 'fill-blank' && '✍️ Fill the Blank'}
              {currentQuest.type === 'quiz' && '❓ Quiz Time'}
            </h2>
            
            {currentQuest.type === 'matching' && (
              <p className="text-xl text-gray-600">{currentQuest.instruction}</p>
            )}
            
            {currentQuest.type === 'fill-blank' && (
              <div className="text-2xl text-gray-800 mb-6">
                {currentQuest.sentence.split('____')[0]}
                <span className="bg-yellow-200 px-4 py-2 rounded-lg mx-2">____</span>
                {currentQuest.sentence.split('____')[1]}
              </div>
            )}
            
            {currentQuest.type === 'quiz' && (
              <p className="text-2xl text-gray-800 mb-6">{currentQuest.question}</p>
            )}
          </div>

          {/* Game Content */}
          <div className="mb-8">
            {currentQuest.type === 'matching' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {currentQuest.pictures.map((item) => (
                  <div key={item.id} className="text-center">
                    <div className="text-6xl mb-4">{item.emoji}</div>
                    <button
                      onClick={() => handleAnswer(item.word)}
                      className="bg-purple-500 text-white px-4 py-2 rounded-xl hover:bg-purple-600 transition-colors font-bold"
                    >
                      {item.word}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {currentQuest.type === 'fill-blank' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuest.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    className="bg-blue-500 text-white text-xl py-4 px-6 rounded-2xl hover:bg-blue-600 transition-colors font-bold"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {currentQuest.type === 'quiz' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {currentQuest.choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => handleAnswer(choice.text)}
                    className="bg-green-500 text-white p-6 rounded-2xl hover:bg-green-600 transition-colors text-center"
                  >
                    <div className="text-4xl mb-2">{choice.emoji}</div>
                    <div className="font-bold text-lg">{choice.text}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className={`text-center p-6 rounded-2xl ${
              isCorrect ? 'bg-green-100 border-green-300' : 'bg-orange-100 border-orange-300'
            } border-2`}>
              <div className="text-4xl mb-2">
                {isCorrect ? '🎉' : '💭'}
              </div>
              <p className="text-xl font-bold text-gray-800">
                {isCorrect ? currentQuest.encouragement : currentQuest.hint}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
