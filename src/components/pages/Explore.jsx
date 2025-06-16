import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import SearchBar from '@/components/molecules/SearchBar';
import PostCard from '@/components/molecules/PostCard';
import TrendingHashtag from '@/components/molecules/TrendingHashtag';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { postService, userService } from '@/services';

const Explore = () => {
  const [activeTab, setActiveTab] = useState('trending');
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExploreData = async () => {
      setLoading(true);
      try {
        const [postsData, usersData, hashtagsData] = await Promise.all([
          postService.getAll(),
          userService.getAll(),
          postService.getTrendingHashtags()
        ]);
        
        // Sort posts by engagement (likes + comments + shares)
        const sortedPosts = postsData.sort((a, b) => {
          const engagementA = a.likes + a.comments + a.shares;
          const engagementB = b.likes + b.comments + b.shares;
          return engagementB - engagementA;
        });
        
        setPosts(sortedPosts);
        setUsers(usersData.filter(user => user.username !== 'current_user'));
        setHashtags(hashtagsData);
      } catch (error) {
        console.error('Failed to load explore data:', error);
        toast.error('Failed to load explore content');
      } finally {
        setLoading(false);
      }
    };

    loadExploreData();
  }, []);

  const tabs = [
    { id: 'trending', label: 'Trending', icon: 'TrendingUp' },
    { id: 'posts', label: 'Posts', icon: 'FileText' },
    { id: 'people', label: 'People', icon: 'Users' },
    { id: 'hashtags', label: 'Hashtags', icon: 'Hash' }
  ];

  const handlePostUpdate = (updatedPost) => {
    setPosts(prev => 
      prev.map(post => 
        post.Id === updatedPost.Id ? updatedPost : post
      )
    );
  };

  const renderSkeletonLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-surface-200 shadow-sm p-6">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-surface-200 rounded-full"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                <div className="h-3 bg-surface-200 rounded w-1/2"></div>
              </div>
            </div>
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

  const renderTrendingContent = () => (
    <div className="space-y-8">
      {/* Top Hashtags */}
      <section>
        <h2 className="text-xl font-semibold text-surface-900 mb-4">
          Trending Hashtags
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hashtags.slice(0, 6).map((item, index) => (
            <motion.div
              key={item.tag}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl border border-surface-200 shadow-sm"
            >
              <TrendingHashtag
                tag={item.tag}
                count={item.count}
                trend={index < 2 ? 'up' : index < 4 ? 'down' : null}
                onClick={() => setActiveTab('hashtags')}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular Posts */}
      <section>
        <h2 className="text-xl font-semibold text-surface-900 mb-4">
          Popular Posts
        </h2>
        <div className="space-y-6">
          {posts.slice(0, 3).map((post, index) => (
            <motion.div
              key={post.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PostCard post={post} onUpdate={handlePostUpdate} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderPostsContent = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {posts.map((post, index) => (
        <motion.div
          key={post.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <PostCard post={post} onUpdate={handlePostUpdate} />
        </motion.div>
      ))}
    </div>
  );

  const renderPeopleContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((user, index) => (
        <motion.div
          key={user.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl border border-surface-200 shadow-sm p-6"
        >
          <div className="text-center">
            <Avatar
              src={user.avatar}
              alt={user.displayName}
              size="xl"
              className="mx-auto mb-4"
            />
            <div className="flex items-center justify-center space-x-2 mb-2">
              <h3 className="font-semibold text-surface-900">
                {user.displayName}
              </h3>
              {user.verified && (
                <ApperIcon name="BadgeCheck" size={16} className="text-primary" />
              )}
            </div>
            <p className="text-surface-500 text-sm mb-4">
              @{user.username}
            </p>
            
            {user.bio && (
              <p className="text-surface-600 text-sm mb-4 line-clamp-2">
                {user.bio}
              </p>
            )}

            <div className="grid grid-cols-3 gap-4 mb-4 text-center">
              <div>
                <p className="font-semibold text-surface-900">{user.postsCount}</p>
                <p className="text-xs text-surface-500">Posts</p>
              </div>
              <div>
                <p className="font-semibold text-surface-900">{user.followers}</p>
                <p className="text-xs text-surface-500">Followers</p>
              </div>
              <div>
                <p className="font-semibold text-surface-900">{user.following}</p>
                <p className="text-xs text-surface-500">Following</p>
              </div>
            </div>

            <Button variant="primary" size="small" className="w-full">
              Follow
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderHashtagsContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {hashtags.map((item, index) => (
        <motion.div
          key={item.tag}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white rounded-xl border border-surface-200 shadow-sm"
        >
          <TrendingHashtag
            tag={item.tag}
            count={item.count}
            trend={index % 3 === 0 ? 'up' : index % 3 === 1 ? 'down' : null}
            onClick={() => toast.info(`Exploring #${item.tag}`)}
          />
        </motion.div>
      ))}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'trending':
        return renderTrendingContent();
      case 'posts':
        return renderPostsContent();
      case 'people':
        return renderPeopleContent();
      case 'hashtags':
        return renderHashtagsContent();
      default:
        return renderTrendingContent();
    }
  };

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-6xl mx-auto p-4 lg:p-6 pb-20 md:pb-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-surface-900 mb-4">
            Explore
          </h1>
          <div className="max-w-md">
            <SearchBar placeholder="Search posts, people, and hashtags..." />
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-surface-100 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-surface-600 hover:text-surface-900'
                }`}
              >
                <ApperIcon name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {loading ? renderSkeletonLoader() : renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default Explore;