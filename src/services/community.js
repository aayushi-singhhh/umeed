import api from './api.js';

export const communityService = {
  // Get community posts
  getPosts: async (params = {}) => {
    const response = await api.get('/community/posts', { params });
    return response.data;
  },

  // Get single post with replies
  getPost: async (id) => {
    const response = await api.get(`/community/posts/${id}`);
    return response.data;
  },

  // Create new post
  createPost: async (postData) => {
    const response = await api.post('/community/posts', postData);
    return response.data;
  },

  // Reply to post
  replyToPost: async (postId, content) => {
    const response = await api.post(`/community/posts/${postId}/reply`, { content });
    return response.data;
  },

  // Like/unlike post
  toggleLike: async (postId) => {
    const response = await api.post(`/community/posts/${postId}/like`);
    return response.data;
  },

  // Update post
  updatePost: async (postId, postData) => {
    const response = await api.put(`/community/posts/${postId}`, postData);
    return response.data;
  },

  // Delete/moderate post (admin only)
  deletePost: async (postId, reason) => {
    const response = await api.delete(`/community/posts/${postId}`, { 
      data: { reason } 
    });
    return response.data;
  },

  // Get available categories
  getCategories: async () => {
    const response = await api.get('/community/categories');
    return response.data;
  }
};

export const notificationService = {
  // Get notifications for current user
  getNotifications: async (params = {}) => {
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  // Get unread count
  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await api.put('/notifications/mark-all-read');
    return response.data;
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },

  // Clear all notifications
  clearAll: async () => {
    const response = await api.delete('/notifications/clear-all');
    return response.data;
  }
};

export default { communityService, notificationService };
