import React, { useState } from 'react';
import { Wand2, Play, Pause, RotateCcw, BookOpen, Sparkles, Award, HelpCircle } from 'lucide-react';

interface StoryPage {
  text: string;
  illustration_prompt: string;
}

interface ReadingCoach {
  sentence: string;
  pronunciation: string;
  correction_phrases: string[];
}

interface Reward {
  badge: string;
  unlocked_character: string;
  description: string;
}

interface StoryData {
  title: string;
  theme: string;
  characters: string[];
  level: number;
  pages: StoryPage[];
  illustrations: string[];
  audio_base64: string;
  page_count: number;
}

interface ApiResponse {
  success: boolean;
  story: StoryData;
  reading_coach: ReadingCoach;
  reward: Reward;
  error?: string;
}

export const StoryCreator: React.FC = () => {
  const [theme, setTheme] = useState('');
  const [characters, setCharacters] = useState('');
  const [readingLevel, setReadingLevel] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [story, setStory] = useState<StoryData | null>(null);
  const [readingCoach, setReadingCoach] = useState<ReadingCoach | null>(null);
  const [reward, setReward] = useState<Reward | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showReadingCoach, setShowReadingCoach] = useState(false);
  const [showReward, setShowReward] = useState(false);

  const generateStory = async () => {
    if (!theme.trim() || !characters.trim()) {
      setError('Please enter both a theme and characters for your story!');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setStory(null);
    setReadingCoach(null);
    setReward(null);
    setShowReadingCoach(false);
    setShowReward(false);

    try {
      const response = await fetch('http://localhost:5001/generate_story_mock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          theme: theme.trim(),
          characters: characters.trim(),
          reading_level: readingLevel,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      if (data.success && data.story) {
        setStory(data.story);
        setReadingCoach(data.reading_coach);
        setReward(data.reward);
        setCurrentPage(0);
        
        // Show reward after story is loaded
        setTimeout(() => {
          setShowReward(true);
          setTimeout(() => setShowReward(false), 5000);
        }, 1000);
      } else {
        setError(data.error || 'Failed to generate story');
      }
    } catch (err) {
      console.error('Error generating story:', err);
      setError('Failed to connect to the story service. Please make sure the backend is running.');
    } finally {
      setIsGenerating(false);
    }
  };

  const playAudio = () => {
    if (!story?.audio_base64) return;

    if (audioElement && !audioElement.paused) {
      audioElement.pause();
      setIsPlayingAudio(false);
      return;
    }

    try {
      // Convert base64 to audio blob
      const audioData = atob(story.audio_base64);
      const audioArray = new Uint8Array(audioData.length);
      for (let i = 0; i < audioData.length; i++) {
        audioArray[i] = audioData.charCodeAt(i);
      }
      const audioBlob = new Blob([audioArray], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);
      audio.onplay = () => setIsPlayingAudio(true);
      audio.onpause = () => setIsPlayingAudio(false);
      audio.onended = () => setIsPlayingAudio(false);
      
      setAudioElement(audio);
      audio.play();
    } catch (err) {
      console.error('Error playing audio:', err);
      setError('Failed to play audio narration');
    }
  };

  const resetStory = () => {
    setStory(null);
    setCurrentPage(0);
    setTheme('');
    setCharacters('');
    setError(null);
    if (audioElement) {
      audioElement.pause();
      setAudioElement(null);
    }
    setIsPlayingAudio(false);
  };

  const nextPage = () => {
    if (story && currentPage < story.page_count - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-12 w-12 text-purple-600 mr-3" />
            <h1 className="text-4xl font-bold text-purple-800">✨ Story Creator ✨</h1>
          </div>
          <p className="text-xl text-purple-600 mb-2">Create magical stories just for you!</p>
          <p className="text-gray-600">Tell us what you'd like your story to be about</p>
        </div>

        {!story ? (
          /* Story Creation Form */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-purple-200">
              <div className="space-y-6">
                {/* Theme Input */}
                <div>
                  <label className="block text-xl font-semibold text-purple-800 mb-3">
                    🎭 What's your story about?
                  </label>
                  <input
                    type="text"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="e.g., friendship, space adventure, magical forest, learning to ride a bike..."
                    className="w-full p-4 text-lg border-3 border-purple-300 rounded-2xl focus:border-purple-500 focus:outline-none bg-white/90"
                    maxLength={100}
                  />
                </div>

                {/* Characters Input */}
                <div>
                  <label className="block text-xl font-semibold text-purple-800 mb-3">
                    👥 Who are the characters? (separate with commas)
                  </label>
                  <input
                    type="text"
                    value={characters}
                    onChange={(e) => setCharacters(e.target.value)}
                    placeholder="e.g., Emma the elephant, Sam the squirrel, a friendly dragon..."
                    className="w-full p-4 text-lg border-3 border-purple-300 rounded-2xl focus:border-purple-500 focus:outline-none bg-white/90"
                    maxLength={200}
                  />
                </div>

                {/* Reading Level Selection */}
                <div>
                  <label className="block text-xl font-semibold text-purple-800 mb-3">
                    📚 Reading Level
                  </label>
                  <div className="flex space-x-4">
                    {[1, 2, 3].map((level) => (
                      <button
                        key={level}
                        onClick={() => setReadingLevel(level)}
                        className={`flex-1 p-4 rounded-2xl border-3 font-semibold transition-all ${
                          readingLevel === level
                            ? 'bg-purple-500 text-white border-purple-500'
                            : 'bg-white border-purple-300 text-purple-700 hover:border-purple-400'
                        }`}
                      >
                        {level === 1 ? '🌟 Beginner' : level === 2 ? '⭐ Intermediate' : '🌠 Advanced'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="bg-red-100 border-2 border-red-300 rounded-2xl p-4">
                    <p className="text-red-700 text-center font-medium">{error}</p>
                  </div>
                )}

                {/* Generate Button */}
                <button
                  onClick={generateStory}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xl py-4 px-8 rounded-2xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center">
                      <Sparkles className="h-6 w-6 mr-3 animate-spin" />
                      Creating Your Magical Story...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Wand2 className="h-6 w-6 mr-3" />
                      Generate My Story!
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Story Display */
          <div className="space-y-6">
            {/* Story Controls */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border-2 border-purple-200">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-purple-800 mb-1">
                    {story.theme}
                  </h2>
                  <p className="text-purple-600">
                    Starring: {story.characters.join(', ')}
                  </p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={playAudio}
                    className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors"
                  >
                    {isPlayingAudio ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                    <span>{isPlayingAudio ? 'Pause' : 'Play'} Story</span>
                  </button>
                  
                  {readingCoach && (
                    <button
                      onClick={() => setShowReadingCoach(!showReadingCoach)}
                      className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors"
                    >
                      <HelpCircle className="h-5 w-5" />
                      <span>Reading Coach</span>
                    </button>
                  )}
                  
                  <button
                    onClick={resetStory}
                    className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-xl hover:bg-purple-600 transition-colors"
                  >
                    <RotateCcw className="h-5 w-5" />
                    <span>New Story</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Reading Coach Section */}
            {showReadingCoach && readingCoach && (
              <div className="bg-blue-50/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border-2 border-blue-200">
                <div className="flex items-center mb-4">
                  <HelpCircle className="h-6 w-6 text-blue-600 mr-3" />
                  <h3 className="text-xl font-bold text-blue-800">Reading Coach</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-blue-700 font-medium mb-2">Practice this sentence:</p>
                    <p className="text-lg text-gray-800 bg-white p-4 rounded-xl border-2 border-blue-200">
                      "{readingCoach.sentence}"
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-700 font-medium mb-2">Pronunciation guide:</p>
                    <p className="text-lg text-blue-800 bg-blue-100 p-4 rounded-xl font-mono">
                      {readingCoach.pronunciation}
                    </p>
                  </div>
                  {readingCoach.correction_phrases.length > 0 && (
                    <div>
                      <p className="text-blue-700 font-medium mb-2">Helpful tips:</p>
                      <ul className="space-y-2">
                        {readingCoach.correction_phrases.map((phrase, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span className="text-gray-800">{phrase}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Storybook Pages */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-purple-200">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[500px]">
                {/* Illustration */}
                <div className="order-1 lg:order-1">
                  {story.illustrations[currentPage] ? (
                    <div className="relative">
                      <img
                        src={story.illustrations[currentPage]}
                        alt={`Story illustration ${currentPage + 1}`}
                        className="w-full h-auto rounded-2xl shadow-lg border-4 border-yellow-200"
                      />
                      <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Page {currentPage + 1}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-80 bg-gradient-to-br from-purple-200 to-pink-200 rounded-2xl flex items-center justify-center border-4 border-yellow-200">
                      <div className="text-center">
                        <Sparkles className="h-12 w-12 text-purple-500 mx-auto mb-4 animate-pulse" />
                        <p className="text-purple-700 font-medium">Loading illustration...</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Story Text */}
                <div className="order-2 lg:order-2">
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-3 border-yellow-300 shadow-lg">
                    <p className="text-lg leading-relaxed text-gray-800 font-medium">
                      {story.pages[currentPage]?.text || 'Loading story text...'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className="bg-blue-500 text-white px-6 py-3 rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors font-semibold"
                >
                  ← Previous
                </button>

                <div className="flex items-center space-x-2">
                  {Array.from({ length: story.page_count }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`w-4 h-4 rounded-full transition-colors ${
                        i === currentPage
                          ? 'bg-purple-500'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextPage}
                  disabled={currentPage === story.page_count - 1}
                  className="bg-blue-500 text-white px-6 py-3 rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors font-semibold"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reward Animation */}
        {showReward && reward && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-yellow-200 via-orange-200 to-red-200 rounded-3xl p-8 shadow-2xl border-4 border-yellow-400 max-w-md mx-4 animate-pulse">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Award className="h-16 w-16 text-yellow-600 animate-bounce" />
                </div>
                <h3 className="text-2xl font-bold text-orange-800 mb-4">🎉 Congratulations! 🎉</h3>
                <div className="space-y-3">
                  <div className="bg-white/80 rounded-2xl p-4">
                    <p className="text-lg font-semibold text-orange-700 mb-2">You earned a badge!</p>
                    <p className="text-xl">{reward.badge}</p>
                  </div>
                  <div className="bg-white/80 rounded-2xl p-4">
                    <p className="text-lg font-semibold text-orange-700 mb-2">Unlocked character!</p>
                    <p className="text-xl">{reward.unlocked_character}</p>
                  </div>
                  <div className="bg-white/80 rounded-2xl p-4">
                    <p className="text-gray-700">{reward.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowReward(false)}
                  className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-8 rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
                >
                  Awesome! ✨
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
