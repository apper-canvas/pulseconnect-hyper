import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import PostComposer from '@/components/organisms/PostComposer';
import StoriesCarousel from '@/components/organisms/StoriesCarousel';
import Sidebar from '@/components/organisms/Sidebar';
import PostCard from '@/components/molecules/PostCard';
import Avatar from '@/components/atoms/Avatar';
import ApperIcon from '@/components/ApperIcon';
import { postService, userService } from '@/services';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
useEffect(() => {
    const loadFeedData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [postsData, suggested, active] = await Promise.all([
          postService.getAll(),
          userService.getSuggestedUsers(),
          userService.getActiveUsers()
        ]);
        setPosts(postsData);
        setSuggestedUsers(suggested);
        setActiveUsers(active);
      } catch (err) {
        setError(err.message || 'Failed to load feed data');
        toast.error('Failed to load feed data');
      } finally {
        setLoading(false);
      }
    };

    loadFeedData();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(prev => 
      prev.map(post => 
        post.Id === updatedPost.Id ? updatedPost : post
      )
    );
  };

  const renderSkeletonLoader = () => (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-surface-200 shadow-sm p-6">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-surface-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-surface-200 rounded w-32"></div>
                <div className="h-3 bg-surface-200 rounded w-24"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-surface-200 rounded w-full"></div>
              <div className="h-4 bg-surface-200 rounded w-3/4"></div>
            </div>
            <div className="h-48 bg-surface-200 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderErrorState = () => (
    <div className="text-center py-12">
      <ApperIcon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-surface-900 mb-2">
        Something went wrong
      </h3>
      <p className="text-surface-600 mb-4">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        Try again
      </button>
    </div>
  );

  const renderEmptyState = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        <ApperIcon name="FileText" size={48} className="text-surface-300 mx-auto mb-4" />
      </motion.div>
      <h3 className="text-lg font-medium text-surface-900 mb-2">
        No posts yet
      </h3>
      <p className="text-surface-600 mb-6">
        Be the first to share something amazing with the community!
      </p>
    </motion.div>
  );

const handleFollowUser = async (userId) => {
    try {
      await userService.followUser(userId);
      toast.success('User followed successfully');
      // Refresh suggested users
      const suggested = await userService.getSuggestedUsers();
      setSuggestedUsers(suggested);
    } catch (err) {
      toast.error('Failed to follow user');
    }
  };

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr_280px] gap-6 p-4 lg:p-6">
          {/* Left Sidebar - Quick Stats + Trending */}
          <Sidebar />
          
          {/* Main Content - Stories + Feed */}
          <main className="flex-1 min-h-screen">
            <div className="max-w-feed mx-auto pb-20 md:pb-6">
              <div className="space-y-6">
                {/* Stories */}
                <StoriesCarousel />
                
                {/* Post Composer */}
                <PostComposer onPostCreated={handlePostCreated} />
                
                {/* Feed Content */}
                <div className="space-y-6">
                  {loading && renderSkeletonLoader()}
                  
                  {error && renderErrorState()}
                  
                  {!loading && !error && posts.length === 0 && renderEmptyState()}
                  
                  {!loading && !error && posts.length > 0 && (
                    <AnimatePresence mode="popLayout">
                      {posts.map((post, index) => (
                        <motion.div
                          key={post.Id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ 
                            duration: 0.3,
                            delay: index * 0.1 
                          }}
                          layout
                        >
                          <PostCard 
                            post={post} 
                            onUpdate={handlePostUpdate}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>
              </div>
            </div>
          </main>

          {/* Right Column - Suggested Users + Active Now */}
          <aside className="hidden xl:block w-280 space-y-6">
            {/* Suggested Users */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-surface-200"
            >
              <div className="flex items-center space-x-2 mb-4">
                <ApperIcon name="Users" size={20} className="text-primary" />
                <h3 className="font-semibold text-surface-900">Suggested for you</h3>
              </div>

              <div className="space-y-3">
                {suggestedUsers.map((user) => (
                  <div key={user.Id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar src={user.avatar} alt={user.displayName} size="small" />
                      <div>
                        <p className="text-sm font-medium text-surface-900">
                          {user.displayName}
                        </p>
                        <p className="text-xs text-surface-500">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleFollowUser(user.Id)}
                      className="text-xs font-medium text-primary hover:text-accent transition-colors"
                    >
                      Follow
                    </button>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 text-sm text-primary hover:text-accent font-medium transition-colors">
                See all suggestions
              </button>
            </motion.div>

            {/* Active Now */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-surface-200"
            >
              <div className="flex items-center space-x-2 mb-4">
                <ApperIcon name="Circle" size={20} className="text-green-500" />
                <h3 className="font-semibold text-surface-900">Active now</h3>
              </div>

              <div className="space-y-3">
                {activeUsers.map((user) => (
                  <div key={user.Id} className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar src={user.avatar} alt={user.displayName} size="small" />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-surface-900">
                        {user.displayName}
                      </p>
                      <p className="text-xs text-surface-500">
                        Active now
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Feed;