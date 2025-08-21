import React from 'react';
import { Brain, Menu, Bell, User } from 'lucide-react';

interface HeaderProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRole, onRoleChange }) => {
  const roles = [
    { id: 'parent', label: 'Parent', color: 'bg-blue-500' },
    { id: 'teacher', label: 'Teacher', color: 'bg-green-500' },
    { id: 'child', label: 'Child', color: 'bg-purple-500' },
    { id: 'therapist', label: 'Therapist', color: 'bg-orange-500' }
  ];

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
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => onRoleChange(role.id)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                    currentRole === role.id
                      ? `${role.color} text-white shadow-sm`
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-500 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <User className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};