import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { postService } from '@/services';

const PostCard = ({ post, onUpdate }) => {
  const [isLiked, setIsLiked] = useState(post.liked);
  const [isBookmarked, setIsBookmarked] = useState(post.bookmarked);
  const [likes, setLikes] = useState(post.likes);
  const [loading, setLoading] = useState({});

  const handleLike = async () => {
    if (loading.like) return;
    
    setLoading(prev => ({ ...prev, like: true }));
    try {
      const updatedPost = await postService.likePost(post.Id);
      setIsLiked(updatedPost.liked);
      setLikes(updatedPost.likes);
      onUpdate?.(updatedPost);
    } catch (error) {
      toast.error('Failed to like post');
    } finally {
      setLoading(prev => ({ ...prev, like: false }));
    }
  };

  const handleBookmark = async () => {
    if (loading.bookmark) return;
    
    setLoading(prev => ({ ...prev, bookmark: true }));
    try {
      const updatedPost = await postService.bookmarkPost(post.Id);
      setIsBookmarked(updatedPost.bookmarked);
      onUpdate?.(updatedPost);
      toast.success(updatedPost.bookmarked ? 'Post bookmarked' : 'Bookmark removed');
    } catch (error) {
      toast.error('Failed to bookmark post');
    } finally {
      setLoading(prev => ({ ...prev, bookmark: false }));
    }
  };

  const handleShare = async () => {
    if (loading.share) return;
    
    setLoading(prev => ({ ...prev, share: true }));
    try {
      await postService.sharePost(post.Id);
      toast.success('Post shared!');
    } catch (error) {
      toast.error('Failed to share post');
    } finally {
      setLoading(prev => ({ ...prev, share: false }));
    }
  };

  const formatTimestamp = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return 'some time ago';
    }
  };

return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-white rounded-xl border border-surface-200 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      {/* Post Header */}
      <div className="p-4 flex items-center space-x-3">
        <Avatar 
          src={post.author?.avatar} 
          alt={post.author?.displayName}
          size="medium"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium text-surface-900 truncate">
              {post.author?.displayName || 'Unknown User'}
            </h3>
            {post.author?.verified && (
              <ApperIcon name="BadgeCheck" size={16} className="text-primary" />
            )}
          </div>
          <div className="flex items-center space-x-2 text-sm text-surface-500">
            <span>@{post.author?.username || 'unknown'}</span>
            <span>•</span>
            <span>{formatTimestamp(post.timestamp)}</span>
            {post.location && (
              <>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <ApperIcon name="MapPin" size={12} />
                  <span className="truncate">{post.location}</span>
                </div>
              </>
            )}
          </div>
        </div>
        
        <Button variant="ghost" size="small" icon="MoreHorizontal" />
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-surface-900 leading-relaxed break-words">
          {post.content}
        </p>
        
        {/* Hashtags */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {post.hashtags.map((tag, index) => (
              <span 
                key={index}
                className="text-primary hover:text-accent cursor-pointer text-sm font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Post Media */}
      {post.media && post.media.length > 0 && (
        <div className="px-4 pb-3">
          <div className="rounded-lg overflow-hidden bg-surface-50">
            {post.media.map((item, index) => (
              <img
                key={index}
                src={item.url}
                alt="Post media"
                className="w-full h-auto object-cover max-h-96"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      )}

      {/* Post Actions */}
      <div className="px-4 py-3 border-t border-surface-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLike}
              disabled={loading.like}
              className="flex items-center space-x-2 text-surface-600 hover:text-red-500 transition-colors"
            >
              <ApperIcon 
                name={isLiked ? "Heart" : "Heart"} 
                size={20}
                className={isLiked ? "text-red-500 fill-current" : ""}
              />
              <span className="text-sm font-medium">{likes}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 text-surface-600 hover:text-primary transition-colors"
            >
              <ApperIcon name="MessageCircle" size={20} />
              <span className="text-sm font-medium">{post.comments}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              disabled={loading.share}
              className="flex items-center space-x-2 text-surface-600 hover:text-primary transition-colors"
            >
              <ApperIcon name="Share" size={20} />
              <span className="text-sm font-medium">{post.shares}</span>
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBookmark}
            disabled={loading.bookmark}
            className={`p-2 rounded-lg transition-colors ${
              isBookmarked 
                ? 'text-primary bg-primary/10' 
                : 'text-surface-600 hover:text-primary hover:bg-surface-50'
            }`}
          >
            <ApperIcon 
              name={isBookmarked ? "BookmarkCheck" : "Bookmark"} 
              size={20}
            />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default PostCard;