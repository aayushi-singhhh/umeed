import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { OnboardingChatbot } from './components/OnboardingChatbot';
import { ParentDashboard } from './components/ParentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { ChildDashboard } from './components/ChildDashboard';
import { TherapistDashboard } from './components/TherapistDashboard';
import { CommunityHub } from './components/CommunityHub';
import AuthPage from './components/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';
import { Home, Users, MessageCircle, Calendar, Settings, HelpCircle, LogOut } from 'lucide-react';

// Create a client
const queryClient = new QueryClient();

const MainApp = () => {
  const { isAuthenticated, user, loading, logout } = useAuth();
  const [currentView, setCurrentView] = useState('landing');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Enhanced debugging
  useEffect(() => {
    const debug = `User: ${user?.email || 'null'} | Role: ${user?.role || 'none'} | Loading: ${loading} | Authenticated: ${isAuthenticated} | View: ${currentView}`;
    setDebugInfo(debug);
    console.log('🔍 APP STATE CHANGE:', debug);
  }, [user, loading, isAuthenticated, currentView]);

  // Handle navigation based on auth state
  useEffect(() => {
    console.log('🔄 APP: Auth effect triggered', { user: !!user, loading, isAuthenticated, currentView });
    
    if (!loading) {
      if (isAuthenticated && user) {
        console.log('✅ APP: User authenticated, setting dashboard');
        setCurrentView('dashboard');
      } else if (currentView === 'dashboard') {
        console.log('❌ APP: No user but on dashboard, redirecting to landing');
        setCurrentView('landing');
      }
    }
  }, [isAuthenticated, user, loading]);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help', icon: HelpCircle }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading Umeed...</h2>
          <p className="text-gray-500 mt-2">Setting up your learning environment</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('🔓 APP: User not authenticated, showing AuthPage');
    return <AuthPage />;
  }

  const renderCurrentView = () => {
    if (showOnboarding) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Umeed</h1>
              <p className="text-xl text-gray-600">Let's create a personalized learning plan for your child</p>
            </div>
            <OnboardingChatbot />
            <div className="text-center mt-6">
              <button
                onClick={() => setShowOnboarding(false)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                Complete Setup & Continue to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'community':
        return <CommunityHub />;
      case 'dashboard':
      default:
        switch (user?.role) {
          case 'parent':
            return <ParentDashboard />;
          case 'teacher':
            return <TeacherDashboard />;
          case 'child':
            return <ChildDashboard />;
          case 'admin':
            return <TherapistDashboard />;
          default:
            return <ParentDashboard />;
        }
    }
  };

  if (showOnboarding) {
    return renderCurrentView();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentUser={user} 
        onLogout={logout}
      />
      
      <div className="flex">
        <nav className="w-64 bg-white shadow-sm min-h-screen border-r border-gray-200">
          <div className="p-4">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
                      currentView === item.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 space-y-2">
              <button
                onClick={() => setShowOnboarding(true)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                <span className="text-sm font-medium">Try AI Setup Demo</span>
              </button>
              
              <button
                onClick={logout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </nav>

        <main className="flex-1">
          <ProtectedRoute>
            {renderCurrentView()}
          </ProtectedRoute>
        </main>
        
        {/* Enhanced debug info */}
        <div className="fixed bottom-4 right-4 bg-black text-white p-3 rounded text-xs max-w-xs z-50">
          <div className="font-bold text-green-400">DEBUG INFO:</div>
          <div className="text-white">{debugInfo}</div>
          <div className="mt-1 text-yellow-400">View: {currentView}</div>
          <div className="text-blue-400">LocalStorage Token: {localStorage.getItem('token') ? 'YES' : 'NO'}</div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;