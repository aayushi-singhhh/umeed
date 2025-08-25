import { useState } from 'react';
import { Header } from './components/Header';
import { OnboardingChatbot } from './components/OnboardingChatbot';
import { ParentDashboard } from './components/ParentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { ChildDashboard } from './components/ChildDashboard';
import { TherapistDashboard } from './components/TherapistDashboard';
import { CommunityHub } from './components/CommunityHub';
import { Home, Users, MessageCircle, Calendar, Settings, HelpCircle } from 'lucide-react';
import { demoUsers } from './data/demoData';

function App() {
  const [currentUserId, setCurrentUserId] = useState('parent1');
  const [currentView, setCurrentView] = useState('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(false);

  const currentUser = demoUsers.find(user => user.id === currentUserId) || demoUsers[0];

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help', icon: HelpCircle }
  ];

  const renderCurrentView = () => {
    if (showOnboarding) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to BridgeConnect</h1>
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
        switch (currentUser.role) {
          case 'parent':
            return <ParentDashboard />;
          case 'teacher':
            return <TeacherDashboard />;
          case 'child':
            return <ChildDashboard />;
          case 'therapist':
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
        currentUser={currentUser} 
        onUserChange={setCurrentUserId} 
        allUsers={demoUsers}
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

            <div className="mt-8 pt-8 border-t border-gray-200">
              <button
                onClick={() => setShowOnboarding(true)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                <span className="text-sm font-medium">Try AI Setup Demo</span>
              </button>
            </div>
          </div>
        </nav>

        <main className="flex-1">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
}

export default App;