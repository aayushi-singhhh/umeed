import React from 'react';
import { Brain, Bell } from 'lucide-react';
import { User as UserType } from '../data/demoData';

interface HeaderProps {
  currentUser: UserType;
  onUserChange: (userId: string) => void;
  allUsers: UserType[];
}

export const Header: React.FC<HeaderProps> = ({ currentUser, onUserChange, allUsers }) => {
  const roleColors = {
    parent: 'bg-blue-500',
    teacher: 'bg-green-500',
    child: 'bg-purple-500',
    therapist: 'bg-orange-500'
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
              <h1 className="text-xl font-bold text-gray-900">BridgeConnect</h1>
              <p className="text-xs text-gray-500">Empowering Every Learner</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* User Switcher for Demo */}
            <div className="flex items-center space-x-2">
              <select
                value={currentUser.id}
                onChange={(e) => onUserChange(e.target.value)}
                className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {allUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.profileImage} {user.name} ({user.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${roleColors[currentUser.role as keyof typeof roleColors]}`}>
                {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
              </span>
              
              <button className="p-2 text-gray-400 hover:text-gray-500 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-2">
                <span className="text-lg">{currentUser.profileImage}</span>
                <span className="text-sm font-medium text-gray-700">{currentUser.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};