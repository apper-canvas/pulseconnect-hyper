import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Mock notifications data
  const mockNotifications = [
    {
      id: 1,
      type: 'like',
      user: {
        displayName: 'Sarah Wilson',
        username: 'sarah_designer',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face'
      },
      content: 'liked your post',
      postContent: 'Just finished designing a new mobile app interface!',
      timestamp: '2024-01-20T14:30:00Z',
      read: false
    },
    {
      id: 2,
      type: 'comment',
      user: {
        displayName: 'Alex Chen',
        username: 'alex_photographer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
      },
      content: 'commented on your post',
      comment: 'This is absolutely stunning! Great work 👏',
      timestamp: '2024-01-20T13:15:00Z',
      read: false
    },
    {
      id: 3,
      type: 'follow',
      user: {
        displayName: 'Emma Rodriguez',
        username: 'emma_traveler',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face'
      },
      content: 'started following you',
      timestamp: '2024-01-20T12:00:00Z',
      read: true
    },
    {
      id: 4,
      type: 'mention',
      user: {
        displayName: 'Mike Thompson',
        username: 'mike_developer',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
      },
      content: 'mentioned you in a post',
      postContent: 'Great collaboration with @current_user on this project!',
      timestamp: '2024-01-20T10:45:00Z',
      read: true
    },
    {
      id: 5,
      type: 'like',
      user: {
        displayName: 'Emma Rodriguez',
        username: 'emma_traveler',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face'
      },
      content: 'liked your comment',
      comment: 'Thanks for the inspiration!',
      timestamp: '2024-01-20T09:30:00Z',
      read: true
    },
    {
      id: 6,
      type: 'share',
      user: {
        displayName: 'Sarah Wilson',
        username: 'sarah_designer',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face'
      },
      content: 'shared your post',
      postContent: 'Working from this incredible coworking space in Bali today!',
      timestamp: '2024-01-19T18:20:00Z',
      read: true
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 800);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return 'Heart';
      case 'comment':
        return 'MessageCircle';
      case 'follow':
        return 'UserPlus';
      case 'mention':
        return 'AtSign';
      case 'share':
        return 'Share';
      default:
        return 'Bell';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'like':
        return 'text-red-500';
      case 'comment':
        return 'text-blue-500';
      case 'follow':
        return 'text-green-500';
      case 'mention':
        return 'text-purple-500';
      case 'share':
        return 'text-orange-500';
      default:
        return 'text-surface-500';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'mentions') return notification.type === 'mention';
    return true;
  });

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const filters = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'unread', label: 'Unread', count: notifications.filter(n => !n.read).length },
    { id: 'mentions', label: 'Mentions', count: notifications.filter(n => n.type === 'mention').length }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50">
        <div className="max-w-2xl mx-auto p-4 lg:p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-surface-200 rounded w-48"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-surface-200 p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-surface-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                    <div className="h-3 bg-surface-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-4xl mx-auto p-4 lg:p-6 pb-20 md:pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-surface-900">Notifications</h1>
          {notifications.some(n => !n.read) && (
            <Button
              variant="ghost"
              size="small"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex space-x-1 bg-surface-100 rounded-lg p-1">
              {filters.map((filterOption) => (
                <button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    filter === filterOption.id
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-surface-600 hover:text-surface-900'
                  }`}
                >
                  <span>{filterOption.label}</span>
                  {filterOption.count > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      filter === filterOption.id
                        ? 'bg-primary/10 text-primary'
                        : 'bg-surface-300 text-surface-600'
                    }`}>
                      {filterOption.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-w-content mx-auto space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                layout
                className={`bg-white rounded-xl border border-surface-200 shadow-sm hover:shadow-md transition-all duration-200 ${
                  !notification.read ? 'border-l-4 border-l-primary' : ''
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar
                        src={notification.user.avatar}
                        alt={notification.user.displayName}
                        size="medium"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm ${
                        !notification.read ? 'ring-2 ring-primary' : ''
                      }`}>
                        <ApperIcon
                          name={getNotificationIcon(notification.type)}
                          size={12}
                          className={getNotificationColor(notification.type)}
                        />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm">
                          <span className="font-medium text-surface-900">
                            {notification.user.displayName}
                          </span>
                          <span className="text-surface-600 ml-1">
                            {notification.content}
                          </span>
                        </p>
                        <span className="text-xs text-surface-500 ml-2">
                          {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                        </span>
                      </div>

                      {/* Additional content based on notification type */}
                      {notification.postContent && (
                        <p className="text-sm text-surface-600 bg-surface-50 rounded-lg p-2 mt-2">
                          "{notification.postContent}"
                        </p>
                      )}

                      {notification.comment && (
                        <p className="text-sm text-surface-600 bg-surface-50 rounded-lg p-2 mt-2">
                          "{notification.comment}"
                        </p>
                      )}

                      {/* Action buttons */}
                      <div className="flex items-center space-x-2 mt-3">
                        {notification.type === 'follow' && (
                          <Button variant="primary" size="small">
                            Follow back
                          </Button>
                        )}
                        
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="small"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark as read
                          </Button>
                        )}
                        
                        <Button variant="ghost" size="small">
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredNotifications.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <ApperIcon name="Bell" size={48} className="text-surface-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900 mb-2">
              {filter === 'unread' ? 'No unread notifications' : 
               filter === 'mentions' ? 'No mentions yet' : 
               'No notifications yet'}
            </h3>
            <p className="text-surface-600">
              {filter === 'unread' ? 'You\'re all caught up!' : 
               filter === 'mentions' ? 'When someone mentions you, it\'ll appear here' :
               'When people interact with your posts, you\'ll see it here'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Notifications;