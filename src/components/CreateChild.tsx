import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus, Baby, Calendar, Heart, Plus } from 'lucide-react';

const CreateChild = ({ onClose, onSuccess }) => {
  const { createChild } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    disabilityType: 'dyslexia',
    interests: []
  });
  const [newInterest, setNewInterest] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const disabilityTypes = [
    { value: 'dyslexia', label: 'Dyslexia' },
    { value: 'adhd', label: 'ADHD' },
    { value: 'autism', label: 'Autism' },
    { value: 'dyscalculia', label: 'Dyscalculia' },
    { value: 'other', label: 'Other' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, newInterest.trim()]
      });
      setNewInterest('');
    }
  };

  const removeInterest = (interest) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(i => i !== interest)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const childData = {
        ...formData,
        age: parseInt(formData.age)
      };
      
      await createChild(childData);
      onSuccess?.();
      onClose?.();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create child account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mb-3">
            <Baby className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Create Child Account</h2>
          <p className="text-gray-600 text-sm mt-1">Add a new child to your care</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Child's Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter child's name"
            />
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <select
              id="age"
              name="age"
              required
              value={formData.age}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select age</option>
              {Array.from({ length: 16 }, (_, i) => i + 3).map(age => (
                <option key={age} value={age}>{age} years old</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="disabilityType" className="block text-sm font-medium text-gray-700 mb-1">
              Learning Disability Type
            </label>
            <select
              id="disabilityType"
              name="disabilityType"
              value={formData.disabilityType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {disabilityTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interests (Optional)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Add an interest..."
              />
              <button
                type="button"
                onClick={addInterest}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {formData.interests.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.interests.map((interest) => (
                  <span
                    key={interest}
                    className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {interest}
                    <button
                      type="button"
                      onClick={() => removeInterest(interest)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-400 to-blue-500 text-white py-2 px-4 rounded-lg hover:from-green-500 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </div>
              ) : (
                'Create Child'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChild;
