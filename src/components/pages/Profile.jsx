import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import PostCard from '@/components/molecules/PostCard';
import ApperIcon from '@/components/ApperIcon';
import { userService, postService } from '@/services';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const currentUser = await userService.getCurrentUser();
        setUser(currentUser);
        
        setPostsLoading(true);
        const userPosts = await postService.getByUserId(currentUser.Id);
        // Enrich posts with author data
        const enrichedPosts = userPosts.map(post => ({
          ...post,
          author: currentUser
        }));
        setPosts(enrichedPosts);
      } catch (error) {
        console.error('Failed to load profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
        setPostsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handlePostUpdate = (updatedPost) => {
    setPosts(prev => 
      prev.map(post => 
        post.Id === updatedPost.Id ? updatedPost : post
      )
    );
  };

  const tabs = [
    { id: 'posts', label: 'Posts', icon: 'Grid3x3', count: posts.length },
    { id: 'media', label: 'Media', icon: 'Image', count: posts.filter(p => p.media?.length > 0).length },
    { id: 'liked', label: 'Liked', icon: 'Heart', count: 0 }
  ];

  const renderTabContent = () => {
    let filteredPosts = posts;
    
    if (activeTab === 'media') {
      filteredPosts = posts.filter(post => post.media && post.media.length > 0);
    }
    
    if (postsLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-surface-200 shadow-sm p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-32 bg-surface-200 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-surface-200 rounded w-full"></div>
                  <div className="h-4 bg-surface-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (filteredPosts.length === 0) {
      const emptyMessages = {
        posts: {
          icon: 'FileText',
          title: 'No posts yet',
          description: 'Share your first post to get started!'
        },
        media: {
          icon: 'Image',
          title: 'No media posts',
          description: 'Posts with photos and videos will appear here'
        },
        liked: {
          icon: 'Heart',
          title: 'No liked posts',
          description: 'Posts you like will appear here'
        }
      };

      const message = emptyMessages[activeTab];

      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name={message.icon} size={48} className="text-surface-300 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-lg font-medium text-surface-900 mb-2">
            {message.title}
          </h3>
          <p className="text-surface-600">
            {message.description}
          </p>
        </motion.div>
      );
    }

    if (activeTab === 'media') {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.Id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="aspect-square rounded-lg overflow-hidden bg-surface-100 cursor-pointer group"
            >
              <div className="relative h-full">
                <img
                  src={post.media[0]?.url}
                  alt="Post media"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-4 text-white">
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Heart" size={16} />
                      <span className="text-sm font-medium">{post.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="MessageCircle" size={16} />
                      <span className="text-sm font-medium">{post.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              layout
            >
              <PostCard post={post} onUpdate={handlePostUpdate} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50">
        <div className="max-w-4xl mx-auto p-4 lg:p-6">
          <div className="animate-pulse space-y-6">
            <div className="bg-white rounded-xl border border-surface-200 p-6">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-surface-200 rounded-full"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-8 bg-surface-200 rounded w-48"></div>
                  <div className="h-4 bg-surface-200 rounded w-32"></div>
                  <div className="flex space-x-8">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-6 bg-surface-200 rounded w-12"></div>
                        <div className="h-4 bg-surface-200 rounded w-16"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="User" size={48} className="text-surface-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">
            Profile not found
          </h3>
          <p className="text-surface-600">
            Unable to load profile information
          </p>
        </div>
      </div>
    );
  }

return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-6xl mx-auto p-4 lg:p-6 pb-20 md:pb-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-white rounded-xl border border-surface-200 shadow-sm p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            <Avatar
              src={user.avatar}
              alt={user.displayName}
              size="xl"
              className="w-24 h-24"
            />
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-3xl font-bold text-surface-900">
                  {user.displayName}
                </h1>
                {user.verified && (
                  <ApperIcon name="BadgeCheck" size={24} className="text-primary" />
                )}
              </div>
              
              <p className="text-surface-600 mb-4 text-lg">@{user.username}</p>
              
              {user.bio && (
                <p className="text-surface-700 mb-6 leading-relaxed max-w-2xl">
                  {user.bio}
                </p>
              )}

              <div className="flex items-center space-x-12 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-surface-900">{user.postsCount}</p>
                  <p className="text-sm text-surface-500 font-medium">Posts</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-surface-900">{user.followers}</p>
                  <p className="text-sm text-surface-500 font-medium">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-surface-900">{user.following}</p>
                  <p className="text-sm text-surface-500 font-medium">Following</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button variant="primary" size="medium" icon="Edit">
                  Edit Profile
                </Button>
                <Button variant="secondary" size="medium" icon="Settings">
                  Settings
                </Button>
                <Button variant="ghost" size="medium" icon="Share" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Tabs */}
        <div className="mb-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-1 bg-surface-100 rounded-lg p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-surface-600 hover:text-surface-900'
                  }`}
                >
                  <ApperIcon name={tab.icon} size={16} />
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.id
                        ? 'bg-primary/10 text-primary'
                        : 'bg-surface-300 text-surface-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-5xl mx-auto"
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;