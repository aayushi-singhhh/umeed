import { useState } from 'react';
import { ParentDashboard } from './components/ParentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { ChildDashboard } from './components/ChildDashboard';
import { TherapistDashboard } from './components/TherapistDashboard';
import { CommunityHub } from './components/CommunityHub';
import { AIReadingCoach } from './components/AIReadingCoach';
import { EmotionAICompanion } from './components/EmotionAICompanion';
import { PredictiveAnalyticsDashboard } from './components/PredictiveAnalyticsDashboard';
import LandingPage from './components/LandingPage';
import { Brain, Heart, BarChart3, Bot } from 'lucide-react';

type UserRole = 'parent' | 'teacher' | 'child' | 'therapist';
type CurrentView = 'landing' | 'login' | 'signup' | 'dashboard' | 'community' | 'ai-reading-coach' | 'emotion-companion' | 'predictive-analytics';

interface User {
  name: string;
  email: string;
  role: UserRole;
}

function App() {
  const [currentView, setCurrentView] = useState<CurrentView>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('parent');

  // Mock login function - no real authentication
  const handleLogin = (email: string, _password: string, role: UserRole) => {
    // Mock user creation
    const mockUser: User = {
      name: email.split('@')[0], // Use email prefix as name
      email: email,
      role: role
    };
    
    setUser(mockUser);
    setCurrentView('dashboard');
  };

  // Mock signup function
  const handleSignup = (name: string, email: string, _password: string, role: UserRole) => {
    const mockUser: User = {
      name: name,
      email: email,
      role: role
    };
    
    setUser(mockUser);
    setCurrentView('dashboard');
  };

  // Logout function
  const handleLogout = () => {
    setUser(null);
    setCurrentView('landing');
  };



  // Login Component
  const LoginPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to continue to Umeed</p>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          handleLogin(
            formData.get('email') as string,
            formData.get('password') as string,
            selectedRole
          );
        }} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="parent">Parent</option>
              <option value="teacher">Teacher</option>
              <option value="child">Child</option>
              <option value="therapist">Therapist</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => setCurrentView('signup')}
              className="text-purple-600 hover:text-purple-800 font-semibold"
            >
              Sign Up
            </button>
          </p>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => setCurrentView('landing')}
            className="text-gray-500 hover:text-gray-700"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );

  // Signup Component
  const SignupPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Join Umeed</h2>
          <p className="text-gray-600 mt-2">Create your account and start your journey</p>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          handleSignup(
            formData.get('name') as string,
            formData.get('email') as string,
            formData.get('password') as string,
            selectedRole
          );
        }} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="parent">Parent</option>
              <option value="teacher">Teacher</option>
              <option value="child">Child</option>
              <option value="therapist">Therapist</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Create a password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
          >
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => setCurrentView('login')}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Sign In
            </button>
          </p>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => setCurrentView('landing')}
            className="text-gray-500 hover:text-gray-700"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );

  // Dashboard Component with Navigation
  const DashboardWithNav = () => {
    const [dashboardView, setDashboardView] = useState<'dashboard' | 'community' | 'ai-reading-coach' | 'emotion-companion' | 'predictive-analytics'>('dashboard');

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-purple-600">Umeed</h1>
                <span className="ml-4 text-gray-600">Welcome, {user?.name}!</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setDashboardView('dashboard')}
                  className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                    dashboardView === 'dashboard'
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Dashboard
                </button>
                
                {/* AI Features Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-1 px-3 py-2 rounded-lg font-medium text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    <Bot className="h-4 w-4" />
                    <span>AI Features</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <button
                        onClick={() => setDashboardView('ai-reading-coach')}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2 ${
                          dashboardView === 'ai-reading-coach' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                        }`}
                      >
                        <Brain className="h-4 w-4 text-blue-600" />
                        <span>AI Reading Coach 2.0</span>
                      </button>
                      <button
                        onClick={() => setDashboardView('emotion-companion')}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2 ${
                          dashboardView === 'emotion-companion' ? 'bg-pink-50 text-pink-700' : 'text-gray-700'
                        }`}
                      >
                        <Heart className="h-4 w-4 text-pink-600" />
                        <span>Emotion AI Companion</span>
                      </button>
                      <button
                        onClick={() => setDashboardView('predictive-analytics')}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2 ${
                          dashboardView === 'predictive-analytics' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'
                        }`}
                      >
                        <BarChart3 className="h-4 w-4 text-indigo-600" />
                        <span>Predictive Analytics</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setDashboardView('community')}
                  className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                    dashboardView === 'community'
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Community
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1">
          {dashboardView === 'community' && <CommunityHub />}
          {dashboardView === 'ai-reading-coach' && <AIReadingCoach />}
          {dashboardView === 'emotion-companion' && <EmotionAICompanion />}
          {dashboardView === 'predictive-analytics' && <PredictiveAnalyticsDashboard />}
          {dashboardView === 'dashboard' && (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {user?.role === 'parent' && <ParentDashboard />}
              {user?.role === 'teacher' && <TeacherDashboard />}
              {user?.role === 'child' && <ChildDashboard />}
              {user?.role === 'therapist' && <TherapistDashboard />}
            </main>
          )}
        </div>
      </div>
    );
  };

  // Main App Render
  if (currentView === 'dashboard' && user) {
    return <DashboardWithNav />;
  }

  if (currentView === 'login') {
    return <LoginPage />;
  }

  if (currentView === 'signup') {
    return <SignupPage />;
  }

  return (
    <LandingPage 
      onGetStarted={() => setCurrentView('signup')}
      onSignIn={() => setCurrentView('login')}
    />
  );
}

export default App;