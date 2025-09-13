import React, { useState } from 'react';
import { Play, Sparkles, Users, Heart, Star, Check, X, ArrowRight, QrCode, Zap, Target, Trophy, BookOpen, BarChart3, Gamepad2, Smile, ChevronRight } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onSignIn }) => {
  const [showQR, setShowQR] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 py-20 px-4 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-br from-teal-200 to-green-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full opacity-10 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-purple-200 shadow-lg">
                <Sparkles className="w-5 h-5 text-purple-600 animate-spin" />
                <span className="text-sm font-semibold text-purple-800">🌈 Learning, Reimagined with AI</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-8">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                  Inclusive AI-Powered
                </span>
                <br />
                <span className="text-gray-800 font-serif">Learning for</span>
                <br />
                <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                  Every Child
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-600 mb-10 leading-relaxed max-w-2xl font-light">
                We create <strong className="text-purple-700">gamified quests</strong> that make learning 
                <strong className="text-blue-700"> joyful</strong>, <strong className="text-teal-700">accessible</strong>, 
                and <strong className="text-orange-600">personalized</strong> for neurodivergent children.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start mb-8">
                <button
                  onClick={onGetStarted}
                  className="group bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3"
                >
                  <Play className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  Try a Demo Quest
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={onSignIn}
                  className="bg-white/90 backdrop-blur-sm text-gray-800 px-10 py-5 rounded-2xl font-bold text-xl border-2 border-gray-200 hover:border-purple-300 hover:shadow-xl hover:bg-white transition-all duration-300"
                >
                  Sign In
                </button>
              </div>

              <div className="text-sm text-gray-500 font-medium">
                ✨ Trusted by <strong>10,000+</strong> families worldwide
              </div>
            </div>

            {/* Right Column - AI-Generated Visual */}
            <div className="relative">
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-purple-200 shadow-2xl">
                {/* AI-Generated Illustration Placeholder */}
                <div className="aspect-square bg-gradient-to-br from-blue-100 via-purple-100 to-teal-100 rounded-3xl flex flex-col items-center justify-center text-7xl p-8 relative overflow-hidden">
                  {/* Background pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/50"></div>
                  
                  {/* Main illustration elements */}
                  <div className="relative z-10 text-center">
                    <div className="mb-4 animate-bounce">🌈</div>
                    <div className="flex gap-4 mb-4">
                      <span className="animate-pulse">👧🏽</span>
                      <span className="animate-bounce delay-300">👦🏻</span>
                    </div>
                    <div className="flex gap-3 text-5xl">
                      <span className="animate-spin">🤖</span>
                      <span className="animate-pulse">✨</span>
                    </div>
                  </div>
                  
                  {/* Floating learning elements */}
                  <div className="absolute top-4 left-4 text-3xl animate-bounce">📚</div>
                  <div className="absolute top-4 right-4 text-3xl animate-pulse">🎮</div>
                  <div className="absolute bottom-4 left-4 text-3xl animate-bounce delay-500">🧩</div>
                  <div className="absolute bottom-4 right-4 text-3xl animate-pulse delay-700">🎯</div>
                </div>
                <div className="mt-6 text-center">
                  <div className="text-sm text-gray-600 italic font-medium">Diverse children learning together in a futuristic environment</div>
                </div>
              </div>
              
              {/* Floating Achievement Elements */}
              <div className="absolute -top-6 -right-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full w-20 h-20 flex items-center justify-center text-3xl animate-bounce shadow-lg">
                🚀
              </div>
              <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-green-400 to-teal-400 rounded-full w-16 h-16 flex items-center justify-center text-2xl animate-pulse shadow-lg">
                ⭐
              </div>
              <div className="absolute top-1/2 -right-4 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full w-12 h-12 flex items-center justify-center text-xl animate-bounce delay-300 shadow-lg">
                💖
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Umeed Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-800 mb-6">✨ Why Umeed?</h2>
            <div className="w-32 h-2 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Challenge */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 border-2 border-red-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-5xl mb-6 text-center">🧩</div>
              <h3 className="text-2xl font-bold text-red-800 mb-4 text-center">Challenge</h3>
              <p className="text-red-700 text-lg leading-relaxed text-center">
                Traditional learning often leaves neurodivergent children behind.
              </p>
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 bg-red-100 px-4 py-2 rounded-full">
                  <X className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800">One-size-fits-all</span>
                </div>
              </div>
            </div>
            
            {/* Solution */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 border-2 border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-5xl mb-6 text-center">🤖</div>
              <h3 className="text-2xl font-bold text-blue-800 mb-4 text-center">Our Solution</h3>
              <p className="text-blue-700 text-lg leading-relaxed text-center">
                AI adapts to each child's pace, style, and interests through interactive games.
              </p>
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Personalized AI</span>
                </div>
              </div>
            </div>
            
            {/* Impact */}
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-3xl p-8 border-2 border-green-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-5xl mb-6 text-center">🌟</div>
              <h3 className="text-2xl font-bold text-green-800 mb-4 text-center">Impact</h3>
              <p className="text-green-700 text-lg leading-relaxed text-center">
                Every child feels included, motivated, and celebrated.
              </p>
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
                  <Heart className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Inclusive Learning</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-800 mb-6">🎮 What We Offer</h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Cutting-edge AI features designed specifically for neurodivergent learners
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Feature Cards */}
            <div className="space-y-8">
              {/* Gamified Quests */}
              <div className="group bg-white rounded-3xl p-8 shadow-xl border border-purple-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="flex items-start gap-6">
                  <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl p-4 text-white text-3xl group-hover:rotate-12 transition-transform duration-300">
                    <Gamepad2 className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Gamified Learning Quests</h3>
                    <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                      Math, Language, Logic through play. Visual aids, voice guidance, sensory-friendly elements.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">🎯 Adaptive Difficulty</span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">📚 Story-Based</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Reading Coach */}
              <div className="group bg-white rounded-3xl p-8 shadow-xl border border-green-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="flex items-start gap-6">
                  <div className="bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl p-4 text-white text-3xl group-hover:rotate-12 transition-transform duration-300">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">AI Reading Coach 2.0</h3>
                    <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                      Real-time pronunciation feedback with Whisper AI and personalized phonics training.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">🗣️ Speech Recognition</span>
                      <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">🎯 Adaptive Feedback</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emotion AI Companion */}
              <div className="group bg-white rounded-3xl p-8 shadow-xl border border-orange-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="flex items-start gap-6">
                  <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl p-4 text-white text-3xl group-hover:rotate-12 transition-transform duration-300">
                    <Smile className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Emotion AI Companion</h3>
                    <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                      Real-time emotion detection and contextual support for social-emotional learning.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">😊 Emotion Detection</span>
                      <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">📖 Social Stories</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Predictive Analytics */}
              <div className="group bg-white rounded-3xl p-8 shadow-xl border border-indigo-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="flex items-start gap-6">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl p-4 text-white text-3xl group-hover:rotate-12 transition-transform duration-300">
                    <BarChart3 className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Predictive Learning Analytics</h3>
                    <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                      ML-powered insights for optimal intervention timing and personalized learning paths.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">🧠 Predictive ML</span>
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">📊 Progress Tracking</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Screenshots/Mockups */}
            <div className="space-y-8">
              <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="aspect-video bg-gradient-to-br from-blue-100 via-purple-100 to-teal-100 rounded-3xl flex items-center justify-center text-6xl mb-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/20"></div>
                  <div className="relative z-10 text-center">
                    <div className="mb-2">📱</div>
                    <div className="text-4xl">✨🎮</div>
                  </div>
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-3">Interactive Dashboard</h4>
                <p className="text-gray-600">Real-time progress tracking and AI insights with parent dashboard</p>
              </div>
              
              <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="aspect-video bg-gradient-to-br from-green-100 via-teal-100 to-blue-100 rounded-3xl flex items-center justify-center text-6xl mb-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/20"></div>
                  <div className="relative z-10 text-center">
                    <div className="mb-2">🗣️</div>
                    <div className="text-4xl">👂🎯</div>
                  </div>
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-3">Reading Coach Interface</h4>
                <p className="text-gray-600">Speech recognition and pronunciation feedback with inclusive design</p>
              </div>
              
              <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="aspect-video bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100 rounded-3xl flex items-center justify-center text-6xl mb-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/20"></div>
                  <div className="relative z-10 text-center">
                    <div className="mb-2">😊</div>
                    <div className="text-4xl">📹💬</div>
                  </div>
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-3">Emotion AI Dashboard</h4>
                <p className="text-gray-600">Real-time emotion detection and personalized AI tutor support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We're Different */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-800 mb-6">💡 How We're Different</h2>
            <p className="text-2xl text-gray-600">Traditional learning vs. Gamified, Inclusive AI</p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-10 shadow-2xl border border-blue-200/50">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Traditional Learning */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-red-100 rounded-full p-4">
                    <X className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800">Traditional Learning ❌</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-red-700 text-lg">
                    <X className="w-5 h-5 flex-shrink-0" />
                    <span>One-size-fits-all approach</span>
                  </div>
                  <div className="flex items-center gap-4 text-red-700 text-lg">
                    <X className="w-5 h-5 flex-shrink-0" />
                    <span>Static content and pacing</span>
                  </div>
                  <div className="flex items-center gap-4 text-red-700 text-lg">
                    <X className="w-5 h-5 flex-shrink-0" />
                    <span>Limited emotional support</span>
                  </div>
                  <div className="flex items-center gap-4 text-red-700 text-lg">
                    <X className="w-5 h-5 flex-shrink-0" />
                    <span>Reactive intervention only</span>
                  </div>
                  <div className="flex items-center gap-4 text-red-700 text-lg">
                    <X className="w-5 h-5 flex-shrink-0" />
                    <span>Generic feedback and assessment</span>
                  </div>
                </div>
              </div>
              
              {/* Gamified, Inclusive AI */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-green-100 rounded-full p-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800">Gamified, Inclusive AI ✅</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-green-700 text-lg">
                    <Check className="w-5 h-5 flex-shrink-0" />
                    <span>Personalized to each child's needs</span>
                  </div>
                  <div className="flex items-center gap-4 text-green-700 text-lg">
                    <Check className="w-5 h-5 flex-shrink-0" />
                    <span>Adaptive difficulty and content</span>
                  </div>
                  <div className="flex items-center gap-4 text-green-700 text-lg">
                    <Check className="w-5 h-5 flex-shrink-0" />
                    <span>Real-time emotional intelligence</span>
                  </div>
                  <div className="flex items-center gap-4 text-green-700 text-lg">
                    <Check className="w-5 h-5 flex-shrink-0" />
                    <span>Predictive intervention timing</span>
                  </div>
                  <div className="flex items-center gap-4 text-green-700 text-lg">
                    <Check className="w-5 h-5 flex-shrink-0" />
                    <span>AI-powered personalized feedback</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stories */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-800 mb-6">🌍 Impact Stories</h2>
            <p className="text-2xl text-gray-600">Real families, real transformations</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Testimonial */}
            <div className="bg-white rounded-3xl p-10 shadow-2xl border border-purple-200/50">
              <div className="flex items-start gap-6 mb-8">
                <div className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-full w-20 h-20 flex items-center justify-center text-white text-3xl">
                  👩‍👧
                </div>
                <div>
                  <div className="flex text-yellow-400 mb-3">
                    <Star className="w-6 h-6 fill-current" />
                    <Star className="w-6 h-6 fill-current" />
                    <Star className="w-6 h-6 fill-current" />
                    <Star className="w-6 h-6 fill-current" />
                    <Star className="w-6 h-6 fill-current" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800">Sarah M., Parent</h4>
                  <p className="text-gray-600">Mother of Emma, age 8 (ADHD)</p>
                </div>
              </div>
              
              <blockquote className="text-xl text-gray-700 italic mb-8 leading-relaxed">
                "My child finally loves learning again thanks to Umeed! The AI reading coach helped Emma with her pronunciation, 
                and now she reads bedtime stories to her little brother. The personalized quests keep her engaged for hours!"
              </blockquote>
              
              <div className="flex flex-wrap gap-3">
                <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">✨ Reading Improvement</span>
                <span className="bg-pink-100 text-pink-800 px-4 py-2 rounded-full text-sm font-medium">💪 Confidence Boost</span>
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">🎯 ADHD Support</span>
              </div>
            </div>
            
            {/* Visual */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-8 shadow-2xl border border-pink-200/50">
                <div className="aspect-square bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 rounded-3xl flex items-center justify-center text-7xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/20"></div>
                  <div className="relative z-10 text-center animate-pulse">
                    <div className="mb-4">👧</div>
                    <div className="text-5xl mb-4">✨📚</div>
                    <div className="text-4xl">💖</div>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-gray-600 italic font-medium">Happy child learning and thriving with AI support</p>
                </div>
              </div>
              
              {/* Floating achievement badges */}
              <div className="absolute -top-8 -right-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full w-24 h-24 flex items-center justify-center animate-bounce shadow-xl">
                <div className="text-center text-white">
                  <Trophy className="w-6 h-6 mx-auto mb-1" />
                  <div className="text-xs font-bold">Level Up!</div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-green-400 to-teal-400 rounded-full w-16 h-16 flex items-center justify-center animate-pulse shadow-xl">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us Today */}
      <section className="py-24 px-4 bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-6xl animate-bounce">🚀</div>
          <div className="absolute top-20 right-20 text-4xl animate-pulse">⭐</div>
          <div className="absolute bottom-20 left-20 text-5xl animate-bounce delay-300">🎯</div>
          <div className="absolute bottom-10 right-10 text-3xl animate-pulse delay-500">💡</div>
          <div className="absolute top-1/2 left-1/4 text-3xl animate-bounce delay-700">🌟</div>
          <div className="absolute top-1/3 right-1/3 text-4xl animate-pulse delay-1000">✨</div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-6xl font-bold mb-8">🚀 Join Us Today</h2>
          <p className="text-3xl mb-12 leading-relaxed font-light">
            We don't just teach differently — we build a future where <strong>every child thrives</strong>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-16">
            <button
              onClick={onGetStarted}
              className="group bg-white text-purple-600 px-12 py-6 rounded-2xl font-bold text-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-4"
            >
              <Play className="w-7 h-7 group-hover:rotate-12 transition-transform" />
              Try Demo
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="bg-white/20 backdrop-blur-sm text-white px-12 py-6 rounded-2xl font-bold text-2xl border-2 border-white/30 hover:bg-white/30 hover:scale-105 transition-all duration-300 flex items-center gap-4">
              <Users className="w-7 h-7" />
              Join Waitlist
            </button>
            
            <button
              onClick={() => setShowQR(!showQR)}
              className="bg-white/20 backdrop-blur-sm text-white px-8 py-6 rounded-2xl font-bold hover:bg-white/30 hover:scale-105 transition-all duration-300 flex items-center gap-3"
            >
              <QrCode className="w-6 h-6" />
              QR Code
            </button>
          </div>
          
          {/* QR Code Modal */}
          {showQR && (
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-10 inline-block shadow-2xl">
              <div className="bg-white rounded-3xl p-8 shadow-xl">
                <div className="w-56 h-56 bg-gray-800 rounded-3xl flex items-center justify-center text-white mb-6">
                  <div className="text-center">
                    <QrCode className="w-20 h-20 mx-auto mb-4" />
                    <div className="text-lg font-bold">QR Code</div>
                    <div className="text-sm opacity-75">Scan to try demo</div>
                  </div>
                </div>
                <p className="text-gray-800 font-bold">Scan to access Umeed prototype</p>
              </div>
            </div>
          )}
          
          <div className="text-xl font-light">
            ✨ Join <strong className="text-2xl">10,000+</strong> families already transforming learning experiences
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
