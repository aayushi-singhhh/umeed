import React, { useState } from 'react';
import { Users, MessageSquare, Heart, Share2, Calendar, BookOpen, Coffee, X } from 'lucide-react';

export const CommunityHub: React.FC = () => {
  const [activeGroup, setActiveGroup] = useState('adhd-parents');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('adhd-parents');
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Sarah M.',
      group: 'ADHD Parent Circle',
      time: '2 hours ago',
      content: 'Finally found a morning routine that works! Visual schedule + timer = game changer. My 8-year-old actually gets ready without 10 reminders now! 🙌',
      likes: 23,
      replies: 8,
      hasLiked: false
    },
    {
      id: 2,
      author: 'Mike T.',
      group: 'Autism Family Network',
      time: '4 hours ago',
      content: 'Does anyone have tips for helping with transitions? My son struggles when we need to leave the park. Social stories help but looking for more strategies.',
      likes: 15,
      replies: 12,
      hasLiked: true
    },
    {
      id: 3,
      author: 'Lisa K.',
      group: 'Dyslexia Life Skills',
      time: '1 day ago',
      content: 'Celebrating small wins! Emma read her first full chapter book today. It took 3 months but she did it! Never giving up on our kids. 💪📖',
      likes: 47,
      replies: 19,
      hasLiked: true
    }
  ]);

  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === parseInt(postId) 
        ? { ...post, hasLiked: !post.hasLiked, likes: post.hasLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;
    
    const selectedGroupData = parentGroups.find(g => g.id === selectedGroup);
    const newPost = {
      id: Math.max(...posts.map(p => p.id)) + 1,
      author: 'You',
      group: selectedGroupData?.name || 'General',
      time: 'Just now',
      content: newPostContent.trim(),
      likes: 0,
      replies: 0,
      hasLiked: false
    };
    
    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setShowCreatePost(false);
  };

  const parentGroups = [
    { id: 'adhd-parents', name: 'ADHD Parent Circle', members: 234, color: 'bg-blue-500', icon: '🎯' },
    { id: 'dyslexia-support', name: 'Dyslexia Life Skills', members: 189, color: 'bg-green-500', icon: '📚' },
    { id: 'autism-family', name: 'Autism Family Network', members: 312, color: 'bg-purple-500', icon: '🧩' },
    { id: 'teen-support', name: 'Teen Transition Support', members: 156, color: 'bg-orange-500', icon: '🌟' }
  ];

  const upcomingEvents = [
    { title: 'Virtual Coffee Chat', time: 'Today 8:00 PM', group: 'ADHD Parent Circle', attendees: 12 },
    { title: 'IEP Workshop', time: 'Tomorrow 7:00 PM', group: 'General', attendees: 45 },
    { title: 'Sensory Tools Demo', time: 'Friday 6:30 PM', group: 'Autism Family Network', attendees: 28 }
  ];

  const weeklyTips = [
    'Top strategy shared: Use "first/then" language instead of "if/then" for better cooperation',
    'Most helpful tool: Visual timers for transitions (mentioned 18 times this week)',
    'Parent wellness tip: 5-minute breathing exercises before challenging conversations'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Community Hub</h2>
        <p className="text-gray-600 mt-2">Connect, share, and support each other on this journey</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="h-5 w-5 text-blue-500 mr-2" />
              Your Groups
            </h3>
            <div className="space-y-3">
              {parentGroups.map((group) => (
                <div
                  key={group.id}
                  onClick={() => setActiveGroup(group.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    activeGroup === group.id 
                      ? 'bg-blue-50 border-2 border-blue-200' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{group.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{group.name}</p>
                      <p className="text-xs text-gray-500">{group.members} members</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 text-green-500 mr-2" />
              Upcoming Events
            </h3>
            <div className="space-y-3">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900 text-sm">{event.title}</p>
                  <p className="text-xs text-gray-600">{event.time}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">{event.group}</span>
                    <span className="text-xs text-blue-600">{event.attendees} attending</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Community Feed</h3>
              <button 
                onClick={() => setShowCreatePost(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
              >
                New Post
              </button>
            </div>
            
            <div className="space-y-6">
              {posts.map((post: any) => (
                <div key={post.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium text-gray-900">{post.author}</p>
                      <p className="text-sm text-gray-500">{post.group} • {post.time}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{post.content}</p>
                  
                  <div className="flex items-center space-x-6">
                    <button 
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center space-x-1 text-sm ${
                        post.hasLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${post.hasLiked ? 'fill-current' : ''}`} />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-500">
                      <MessageSquare className="h-4 w-4" />
                      <span>{post.replies}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-green-500">
                      <Share2 className="h-4 w-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BookOpen className="h-5 w-5 text-purple-500 mr-2" />
              Weekly Insights
            </h3>
            <div className="space-y-3">
              {weeklyTips.map((tip, index) => (
                <div key={index} className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                  <p className="text-sm text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg p-6">
            <div className="text-center">
              <Coffee className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Need Someone to Talk To?</h4>
              <p className="text-sm text-gray-600 mb-4">Join our daily coffee chats or reach out to our peer support network.</p>
              <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-600">
                Find Support
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Create New Post</h3>
              <button
                onClick={() => setShowCreatePost(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Post to Group
                </label>
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {parentGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.icon} {group.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What's on your mind?
                </label>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share your thoughts, ask for advice, or celebrate a win..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {newPostContent.length}/500 characters
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim()}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};