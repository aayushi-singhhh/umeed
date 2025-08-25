import api from './api.js';

export const userService = {
  // Get linked children
  getChildren: async () => {
    const response = await api.get('/users/children');
    return response.data;
  },

  // Get specific child details
  getChild: async (childId) => {
    const response = await api.get(`/users/child/${childId}`);
    return response.data;
  },

  // Update child profile
  updateChild: async (childId, updateData) => {
    const response = await api.put(`/users/child/${childId}`, updateData);
    return response.data;
  },

  // Link child to parent/teacher
  linkChild: async (childId) => {
    const response = await api.post('/users/link-child', { childId });
    return response.data;
  },

  // Unlink child from parent/teacher
  unlinkChild: async (childId) => {
    const response = await api.delete(`/users/unlink-child/${childId}`);
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  }
};

export default userService;
