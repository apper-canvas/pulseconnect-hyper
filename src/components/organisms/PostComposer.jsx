import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Avatar from '@/components/atoms/Avatar';
import ApperIcon from '@/components/ApperIcon';
import { postService } from '@/services';

const PostComposer = ({ onPostCreated, className = '' }) => {
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [media, setMedia] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentUser = {
    displayName: "You",
    username: "current_user",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Please write something to share');
      return;
    }

    setLoading(true);
    try {
      const postData = {
        content: content.trim(),
        location: location.trim() || null,
        media: media
      };

      const newPost = await postService.create(postData);
      
      // Reset form
      setContent('');
      setLocation('');
      setMedia([]);
      setIsExpanded(false);
      
      toast.success('Post shared successfully!');
      onPostCreated?.(newPost);
    } catch (error) {
      toast.error('Failed to share post');
    } finally {
      setLoading(false);
    }
  };

  const handleMediaUpload = () => {
    // Simulate media upload
    const mockImage = {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop'
    };
    setMedia([...media, mockImage]);
    toast.success('Image added to post');
  };

  const removeMedia = (index) => {
    const newMedia = media.filter((_, i) => i !== index);
    setMedia(newMedia);
  };

  const characterLimit = 280;
  const remainingChars = characterLimit - content.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl border border-surface-200 shadow-sm ${className}`}
    >
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex space-x-3">
          <Avatar
            src={currentUser.avatar}
            alt={currentUser.displayName}
            size="medium"
          />
          
          <div className="flex-1 space-y-3">
            {/* Main text area */}
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={() => setIsExpanded(true)}
                placeholder="What's on your mind?"
                className="w-full p-3 text-lg placeholder-surface-400 border-none resize-none focus:outline-none bg-surface-50 rounded-lg min-h-[80px]"
                rows={isExpanded ? 4 : 2}
              />
              
              {/* Character count */}
              {isExpanded && (
                <div className="absolute bottom-2 right-2 text-sm text-surface-400">
                  <span className={remainingChars < 0 ? 'text-red-500' : ''}>
                    {remainingChars}
                  </span>
                </div>
              )}
            </div>

            {/* Location input */}
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center space-x-2"
              >
                <ApperIcon name="MapPin" size={16} className="text-surface-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Add location..."
                  className="flex-1 p-2 text-sm border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </motion.div>
            )}

            {/* Media preview */}
            {media.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="grid grid-cols-2 gap-2"
              >
                {media.map((item, index) => (
                  <div key={index} className="relative rounded-lg overflow-hidden bg-surface-100">
                    <img
                      src={item.url}
                      alt="Upload preview"
                      className="w-full h-32 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <ApperIcon name="X" size={12} />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Actions */}
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between pt-3 border-t border-surface-200"
              >
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="small"
                    icon="Image"
                    onClick={handleMediaUpload}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="small"
                    icon="Video"
                    onClick={handleMediaUpload}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="small"
                    icon="Smile"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="small"
                    onClick={() => {
                      setIsExpanded(false);
                      setContent('');
                      setLocation('');
                      setMedia([]);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="small"
                    loading={loading}
                    disabled={!content.trim() || remainingChars < 0}
                  >
                    Share
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default PostComposer;