import { motion } from 'framer-motion';

const Avatar = ({ 
  src, 
  alt, 
  size = 'medium',
  className = '',
  onClick,
  hasStory = false,
  storyViewed = false,
  showOnlineStatus = false,
  isOnline = false
}) => {
  const sizes = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-12 h-12',
    xl: 'w-16 h-16',
    story: 'w-14 h-14'
  };
  
  const ringClasses = hasStory 
    ? storyViewed 
      ? 'ring-2 ring-surface-300' 
      : 'ring-2 ring-gradient-to-r from-primary to-accent ring-offset-2'
    : '';
  
  const avatarClasses = `${sizes[size]} rounded-full object-cover ${ringClasses} ${onClick ? 'cursor-pointer' : ''} ${className}`;

  const content = (
    <div className="relative inline-block">
      <img
        src={src || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face'}
        alt={alt || 'Avatar'}
        className={avatarClasses}
        style={hasStory && !storyViewed ? {
          background: 'linear-gradient(45deg, #7C3AED, #8B5CF6)',
          padding: '2px'
        } : {}}
      />
      
      {showOnlineStatus && (
        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-surface-400'}`} />
      )}
    </div>
  );

  if (onClick) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

export default Avatar;