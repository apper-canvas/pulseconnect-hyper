import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const TrendingHashtag = ({ tag, count, trend, onClick }) => {
  const getTrendIcon = () => {
    if (trend === 'up') return 'TrendingUp';
    if (trend === 'down') return 'TrendingDown';
    return 'Hash';
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-500';
    if (trend === 'down') return 'text-red-500';
    return 'text-surface-400';
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, backgroundColor: '#F9FAFB' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full p-3 rounded-lg transition-colors text-left group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ApperIcon 
            name={getTrendIcon()} 
            size={16} 
            className={getTrendColor()}
          />
          <div>
            <p className="font-medium text-surface-900 group-hover:text-primary transition-colors">
              #{tag}
            </p>
            <p className="text-sm text-surface-500">
              {count.toLocaleString()} posts
            </p>
          </div>
        </div>
        
        <ApperIcon 
          name="ChevronRight" 
          size={16} 
          className="text-surface-400 group-hover:text-primary transition-colors"
        />
      </div>
    </motion.button>
  );
};

export default TrendingHashtag;