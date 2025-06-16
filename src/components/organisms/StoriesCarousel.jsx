import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import StoryItem from '@/components/molecules/StoryItem';
import ApperIcon from '@/components/ApperIcon';
import { storyService } from '@/services';

const StoriesCarousel = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStories = async () => {
      setLoading(true);
      setError(null);
      try {
        const storiesData = await storyService.getAll();
        setStories(storiesData);
      } catch (err) {
        setError(err.message || 'Failed to load stories');
        toast.error('Failed to load stories');
      } finally {
        setLoading(false);
      }
    };

    loadStories();
  }, []);

  const handleAddStory = () => {
    toast.info('Story creation coming soon!');
  };

  const handleStoryClick = async (story) => {
    try {
      if (!story.viewed) {
        await storyService.markAsViewed(story.Id);
        setStories(prev => 
          prev.map(s => 
            s.Id === story.Id ? { ...s, viewed: true } : s
          )
        );
      }
      // In a real app, this would open the story viewer
      toast.info(`Viewing ${story.user?.displayName}'s story`);
    } catch (error) {
      toast.error('Failed to load story');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-4">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center space-y-2 min-w-0">
              <div className="w-14 h-14 rounded-full bg-surface-200 animate-pulse"></div>
              <div className="w-12 h-3 bg-surface-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-6 text-center">
        <ApperIcon name="AlertCircle" size={24} className="text-red-500 mx-auto mb-2" />
        <p className="text-surface-600">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-surface-200 shadow-sm p-4"
    >
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
        {/* Add Story Button */}
        <StoryItem isAddStory onClick={handleAddStory} />
        
        {/* Stories */}
        {stories.map((story, index) => (
          <motion.div
            key={story.Id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StoryItem 
              story={story} 
              onClick={() => handleStoryClick(story)}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default StoriesCarousel;