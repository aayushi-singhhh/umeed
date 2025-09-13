import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, Heart, Brain, MessageCircle, Smile, Zap, TrendingUp } from 'lucide-react';

interface EmotionDashboard {
  today_emotions: string[];
  mood_trend: string;
  coping_strategies_used: Array<{
    strategy: string;
    times_used: number;
    effectiveness: number;
  }>;
  achievements: string[];
  weekly_summary: {
    positive_emotions: number;
    challenging_moments: number;
    successful_coping: number;
    improvement_areas: string[];
  };
}

export const EmotionAICompanion: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string>('neutral');
  const [, setCompanionMessage] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{type: 'user' | 'companion', message: string}>>([]);
  const [userInput, setUserInput] = useState('');
  const [showDashboard, setShowDashboard] = useState(false);
  const [emotionDashboard, setEmotionDashboard] = useState<EmotionDashboard | null>(null);
  const [showSocialStory, setShowSocialStory] = useState(false);
  const [socialStory, setSocialStory] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const API_BASE_URL = 'http://localhost:5001';

  // Start webcam
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setIsActive(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please check permissions.');
    }
  }, []);

  // Stop webcam
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  }, []);

  // Capture and analyze emotion
  const analyzeEmotion = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsAnalyzing(true);
    
    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;

      // Capture frame from video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);

      // Convert to base64
      const imageBase64 = canvas.toDataURL('image/jpeg').split(',')[1];

      // Send to backend for analysis
      const response = await fetch(`${API_BASE_URL}/analyze_emotion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_base64: imageBase64,
          child_id: 'child1',
          activity_context: 'learning with AI companion'
        }),
      });

      const result = await response.json();

      if (result.success) {
        setCurrentEmotion(result.emotion_detected);
        setCompanionMessage(result.companion_response);
        
        // Add companion message to chat
        setChatMessages(prev => [...prev, {
          type: 'companion',
          message: result.companion_response
        }]);
        
        // Show intervention if needed
        if (result.intervention_needed) {
          setTimeout(() => {
            generateSocialStory(result.emotion_detected);
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error analyzing emotion:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // Auto-analyze every 10 seconds when active
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && !isAnalyzing) {
      interval = setInterval(analyzeEmotion, 10000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isAnalyzing, analyzeEmotion]);

  // Send chat message
  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = userInput.trim();
    setUserInput('');

    // Add user message to chat
    setChatMessages(prev => [...prev, {
      type: 'user',
      message: userMessage
    }]);

    try {
      const response = await fetch(`${API_BASE_URL}/companion_chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          child_id: 'child1',
          message: userMessage,
          current_emotion: currentEmotion
        }),
      });

      const result = await response.json();

      if (result.success) {
        setChatMessages(prev => [...prev, {
          type: 'companion',
          message: result.companion_response.message
        }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Load emotion dashboard
  const loadDashboard = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/emotion_dashboard?child_id=child1`);
      const result = await response.json();

      if (result.success) {
        setEmotionDashboard(result.dashboard);
        setShowDashboard(true);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  // Generate social story
  const generateSocialStory = async (emotionContext: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/generate_social_story`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          child_id: 'child1',
          emotion_context: `feeling ${emotionContext} during learning activities`
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSocialStory(result.social_story);
        setShowSocialStory(true);
      }
    } catch (error) {
      console.error('Error generating social story:', error);
    }
  };

  const getEmotionEmoji = (emotion: string) => {
    const emojis = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      fear: '😰',
      surprise: '😲',
      neutral: '😐',
      disgust: '🤢'
    };
    return emojis[emotion as keyof typeof emojis] || '😐';
  };

  const getEmotionColor = (emotion: string) => {
    const colors = {
      happy: 'text-green-600 bg-green-100',
      sad: 'text-blue-600 bg-blue-100',
      angry: 'text-red-600 bg-red-100',
      fear: 'text-purple-600 bg-purple-100',
      surprise: 'text-yellow-600 bg-yellow-100',
      neutral: 'text-gray-600 bg-gray-100',
      disgust: 'text-orange-600 bg-orange-100'
    };
    return colors[emotion as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-pink-100 p-3 rounded-full">
              <Heart className="h-6 w-6 text-pink-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Emotion AI Companion</h1>
              <p className="text-gray-600">Real-time emotional support and guidance</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={loadDashboard}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Dashboard</span>
            </button>
            
            {!isActive ? (
              <button
                onClick={startCamera}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Camera className="h-4 w-4" />
                <span>Start Camera</span>
              </button>
            ) : (
              <button
                onClick={stopCamera}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Camera className="h-4 w-4" />
                <span>Stop Camera</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Camera and Emotion Detection */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Camera className="h-5 w-5 mr-2" />
                Emotion Detection
              </h3>
              
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-64 bg-black rounded-lg object-cover"
                />
                <canvas
                  ref={canvasRef}
                  className="hidden"
                />
                
                {isActive && (
                  <div className="absolute top-3 right-3">
                    <div className="bg-red-500 w-3 h-3 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
              
              {isActive && (
                <div className="mt-4 text-center">
                  <button
                    onClick={analyzeEmotion}
                    disabled={isAnalyzing}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Emotion'}
                  </button>
                </div>
              )}
            </div>

            {/* Current Emotion Display */}
            {currentEmotion && (
              <div className={`p-4 rounded-lg ${getEmotionColor(currentEmotion)}`}>
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-4xl">{getEmotionEmoji(currentEmotion)}</span>
                  <div>
                    <h4 className="font-semibold text-lg">Current Emotion</h4>
                    <p className="capitalize">{currentEmotion}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AI Companion Chat */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                Chat with Companion
              </h3>
              
              <div className="h-64 overflow-y-auto bg-white rounded-lg p-3 space-y-2">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-20">
                    <Smile className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Hi! I'm your AI companion. How are you feeling today?</p>
                  </div>
                ) : (
                  chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded-lg ${
                        msg.type === 'user' 
                          ? 'bg-blue-100 text-blue-900 ml-8' 
                          : 'bg-pink-100 text-pink-900 mr-8'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {msg.type === 'companion' && (
                          <Heart className="h-4 w-4 mt-1 text-pink-600" />
                        )}
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="flex space-x-2 mt-3">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="How are you feeling?"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => generateSocialStory('frustrated')}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
          >
            <Brain className="h-4 w-4" />
            <span>Social Story</span>
          </button>
          
          <button
            onClick={analyzeEmotion}
            disabled={!isActive || isAnalyzing}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 disabled:opacity-50 transition-colors"
          >
            <Zap className="h-4 w-4" />
            <span>Quick Check</span>
          </button>
        </div>
      </div>

      {/* Emotion Dashboard Modal */}
      {showDashboard && emotionDashboard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Emotion Dashboard</h2>
                <button
                  onClick={() => setShowDashboard(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Today's Emotions</h3>
                  <div className="flex space-x-1">
                    {emotionDashboard.today_emotions.map((emotion, index) => (
                      <span key={index} className="text-2xl">
                        {getEmotionEmoji(emotion)}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Weekly Summary</h3>
                  <div className="space-y-1 text-sm">
                    <p>Positive emotions: {emotionDashboard.weekly_summary.positive_emotions}%</p>
                    <p>Successful coping: {emotionDashboard.weekly_summary.successful_coping}</p>
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">Achievements</h3>
                  <ul className="text-sm space-y-1">
                    {emotionDashboard.achievements.slice(0, 2).map((achievement, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-green-500 mr-1">✓</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Social Story Modal */}
      {showSocialStory && socialStory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Social Story</h2>
                <button
                  onClick={() => setShowSocialStory(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                  {socialStory}
                </p>
              </div>
              
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowSocialStory(false)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  I understand
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionAICompanion;
