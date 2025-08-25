import api from './api.js';

export const exerciseService = {
  // Get exercises with filtering
  getExercises: async (params = {}) => {
    const response = await api.get('/exercises', { params });
    return response.data;
  },

  // Get single exercise
  getExercise: async (id) => {
    const response = await api.get(`/exercises/${id}`);
    return response.data;
  },

  // Create new exercise (teacher/admin only)
  createExercise: async (exerciseData) => {
    const response = await api.post('/exercises', exerciseData);
    return response.data;
  },

  // Update exercise
  updateExercise: async (id, exerciseData) => {
    const response = await api.put(`/exercises/${id}`, exerciseData);
    return response.data;
  },

  // Delete exercise
  deleteExercise: async (id) => {
    const response = await api.delete(`/exercises/${id}`);
    return response.data;
  },

  // Assign exercise to child
  assignExercise: async (assignmentData) => {
    const response = await api.post('/exercises/assign', assignmentData);
    return response.data;
  }
};

export const progressService = {
  // Get child's progress
  getChildProgress: async (childId, params = {}) => {
    const response = await api.get(`/progress/child/${childId}`, { params });
    return response.data;
  },

  // Get specific progress record
  getProgress: async (progressId) => {
    const response = await api.get(`/progress/${progressId}`);
    return response.data;
  },

  // Start exercise
  startExercise: async (progressId) => {
    const response = await api.post(`/progress/${progressId}/start`);
    return response.data;
  },

  // Submit exercise responses
  submitExercise: async (progressId, submissionData) => {
    const response = await api.post(`/progress/${progressId}/submit`, submissionData);
    return response.data;
  },

  // Get detailed analytics for child
  getChildAnalytics: async (childId, params = {}) => {
    const response = await api.get(`/progress/analytics/child/${childId}`, { params });
    return response.data;
  }
};

export default { exerciseService, progressService };
