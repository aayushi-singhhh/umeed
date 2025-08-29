import { useState } from 'react';
import { ParentDashboard } from './components/ParentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { ChildDashboard } from './components/ChildDashboard';
import { TherapistDashboard } from './components/TherapistDashboard';
import { CommunityHub } from './components/CommunityHub';
import { Users, Shield, Lightbulb } from 'lucide-react';

type UserRole = 'parent' | 'teacher' | 'child' | 'therapist';
type CurrentView = 'landing' | 'login' | 'signup' | 'dashboard' | 'community';

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

  // Landing Page Component
  const LandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Umeed</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Empowering children with learning differences through personalized, AI-driven educational experiences. 
              Join thousands of families, teachers, and therapists creating brighter futures together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button
                onClick={() => setCurrentView('signup')}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg"
              >
                Get Started Free
              </button>
              <button
                onClick={() => setCurrentView('login')}
                className="px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-200"
              >
                Sign In
              </button>
            </div>

            {/* Features Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Umeed?</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">AI-Powered Learning</h3>
                  <p className="text-gray-600">Personalized content that adapts to each child's unique learning style and pace</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Community Support</h3>
                  <p className="text-gray-600">Connect with other families and professionals sharing similar journeys</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
                  <p className="text-gray-600">Privacy-first platform with child-safe design and parental controls</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
    const [dashboardView, setDashboardView] = useState<'dashboard' | 'community'>('dashboard');

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
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setDashboardView('dashboard')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    dashboardView === 'dashboard'
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setDashboardView('community')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    dashboardView === 'community'
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Community
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {dashboardView === 'community' ? (
            <CommunityHub />
          ) : (
            <>
              {user?.role === 'parent' && <ParentDashboard />}
              {user?.role === 'teacher' && <TeacherDashboard />}
              {user?.role === 'child' && <ChildDashboard />}
              {user?.role === 'therapist' && <TherapistDashboard />}
            </>
          )}
        </main>
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

  return <LandingPage />;
}

export default App;