import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { exerciseService, progressService } from '../services/exercises';
import { userService } from '../services/users';
import { communityService, notificationService } from '../services/community';

// Exercise hooks
export const useExercises = (params = {}) => {
  return useQuery({
    queryKey: ['exercises', params],
    queryFn: () => exerciseService.getExercises(params)
  });
};

export const useExercise = (id: string) => {
  return useQuery({
    queryKey: ['exercise', id],
    queryFn: () => exerciseService.getExercise(id),
    enabled: !!id
  });
};

export const useCreateExercise = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: exerciseService.createExercise,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
    }
  });
};

export const useAssignExercise = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: exerciseService.assignExercise,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress'] });
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
    }
  });
};

// Progress hooks
export const useChildProgress = (childId: string, params = {}) => {
  return useQuery({
    queryKey: ['progress', 'child', childId, params],
    queryFn: () => progressService.getChildProgress(childId, params),
    enabled: !!childId
  });
};

export const useSubmitExercise = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ progressId, submissionData }: { progressId: string, submissionData: any }) =>
      progressService.submitExercise(progressId, submissionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    }
  });
};

export const useChildAnalytics = (childId: string, params = {}) => {
  return useQuery({
    queryKey: ['analytics', 'child', childId, params],
    queryFn: () => progressService.getChildAnalytics(childId, params),
    enabled: !!childId
  });
};

// User hooks
export const useChildren = () => {
  return useQuery({
    queryKey: ['children'],
    queryFn: userService.getChildren
  });
};

export const useChild = (childId: string) => {
  return useQuery({
    queryKey: ['child', childId],
    queryFn: () => userService.getChild(childId),
    enabled: !!childId
  });
};

export const useUpdateChild = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ childId, updateData }: { childId: string, updateData: any }) =>
      userService.updateChild(childId, updateData),
    onSuccess: (_, { childId }) => {
      queryClient.invalidateQueries({ queryKey: ['child', childId] });
      queryClient.invalidateQueries({ queryKey: ['children'] });
    }
  });
};

// Community hooks
export const useCommunityPosts = (params = {}) => {
  return useQuery({
    queryKey: ['community', 'posts', params],
    queryFn: () => communityService.getPosts(params)
  });
};

export const useCommunityPost = (id: string) => {
  return useQuery({
    queryKey: ['community', 'post', id],
    queryFn: () => communityService.getPost(id),
    enabled: !!id
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: communityService.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community', 'posts'] });
    }
  });
};

export const useReplyToPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ postId, content }: { postId: string, content: string }) =>
      communityService.replyToPost(postId, content),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['community', 'post', postId] });
      queryClient.invalidateQueries({ queryKey: ['community', 'posts'] });
    }
  });
};

export const useTogglePostLike = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: communityService.toggleLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community'] });
    }
  });
};

// Notification hooks
export const useNotifications = (params = {}) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => notificationService.getNotifications(params)
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: notificationService.getUnreadCount,
    refetchInterval: 30000 // Refetch every 30 seconds
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });
};
