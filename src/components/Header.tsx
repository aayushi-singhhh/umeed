import React from 'react';
import { Brain, Bell, LogOut, Settings } from 'lucide-react';

interface HeaderProps {
  currentUser: any;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentUser, onLogout }) => {
  const roleColors = {
    parent: 'bg-blue-500',
    teacher: 'bg-green-500',
    child: 'bg-purple-500',
    therapist: 'bg-orange-500',
    admin: 'bg-red-500'
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'parent': return '👨‍👩‍👧‍👦';
      case 'teacher': return '👩‍🏫';
      case 'child': return '🧒';
      case 'therapist': return '👩‍⚕️';
      case 'admin': return '👑';
      default: return '👤';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Umeed</h1>
              <p className="text-xs text-gray-500">Empowering Every Learner</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${roleColors[currentUser?.role as keyof typeof roleColors] || 'bg-gray-500'}`}>
                {currentUser?.role?.charAt(0).toUpperCase() + currentUser?.role?.slice(1)}
              </span>
              
              <button className="p-2 text-gray-400 hover:text-gray-500 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getRoleIcon(currentUser?.role)}</span>
                <span className="text-sm font-medium text-gray-700">{currentUser?.name}</span>
              </div>

              <div className="flex items-center space-x-1 ml-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Settings className="h-4 w-4" />
                </button>
                <button 
                  onClick={onLogout}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};