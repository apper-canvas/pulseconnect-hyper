import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import PostComposer from '@/components/organisms/PostComposer';
import StoriesCarousel from '@/components/organisms/StoriesCarousel';
import Sidebar from '@/components/organisms/Sidebar';
import PostCard from '@/components/molecules/PostCard';
import ApperIcon from '@/components/ApperIcon';
import { postService } from '@/services';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const postsData = await postService.getAll();
        setPosts(postsData);
      } catch (err) {
        setError(err.message || 'Failed to load posts');
        toast.error('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
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

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-0">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-20 md:pb-6">
            <div className="max-w-2xl mx-auto space-y-6">
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
          </main>
        </div>
      </div>
    </div>
  );
};

export default Feed;