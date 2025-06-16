import { motion } from 'framer-motion';
import Avatar from '@/components/atoms/Avatar';
import ApperIcon from '@/components/ApperIcon';

const StoryItem = ({ story, isAddStory = false, onClick }) => {
  if (isAddStory) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="flex flex-col items-center space-y-2 min-w-0"
      >
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-surface-100 to-surface-200 flex items-center justify-center border-2 border-dashed border-surface-300">
            <ApperIcon name="Plus" size={24} className="text-surface-500" />
          </div>
        </div>
        <p className="text-xs text-surface-600 font-medium truncate w-16 text-center">
          Add Story
        </p>
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex flex-col items-center space-y-2 min-w-0"
    >
      <Avatar
        src={story.user?.avatar}
        alt={story.user?.displayName}
        size="story"
        hasStory={true}
        storyViewed={story.viewed}
      />
      <p className="text-xs text-surface-600 font-medium truncate w-16 text-center">
        {story.user?.displayName?.split(' ')[0] || 'Unknown'}
      </p>
    </motion.button>
  );
};

export default StoryItem;