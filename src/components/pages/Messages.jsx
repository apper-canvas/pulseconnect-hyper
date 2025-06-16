import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import { userService } from '@/services';

const Messages = () => {
  const [users, setUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock conversations data
  const [conversations] = useState([
    {
      id: 1,
      user: { id: 1, username: 'sarah_designer', displayName: 'Sarah Wilson', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face' },
      lastMessage: 'That design looks amazing! 🎨',
      timestamp: '2m ago',
      unread: 2,
      online: true
    },
    {
      id: 2,
      user: { id: 2, username: 'alex_photographer', displayName: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face' },
      lastMessage: 'When are we planning the next shoot?',
      timestamp: '1h ago',
      unread: 0,
      online: false
    },
    {
      id: 3,
      user: { id: 3, username: 'emma_traveler', displayName: 'Emma Rodriguez', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face' },
      lastMessage: 'Bali is incredible! You should visit',
      timestamp: '3h ago',
      unread: 1,
      online: true
    }
  ]);

  // Mock messages data
  const [messages] = useState({
    1: [
      { id: 1, sender: 'other', content: 'Hey! How\'s the new project going?', timestamp: '10:30 AM' },
      { id: 2, sender: 'me', content: 'Going really well! Just finished the wireframes', timestamp: '10:32 AM' },
      { id: 3, sender: 'other', content: 'That design looks amazing! 🎨', timestamp: '10:35 AM' },
      { id: 4, sender: 'me', content: 'Thanks! Want to review it together later?', timestamp: '10:36 AM' }
    ],
    2: [
      { id: 1, sender: 'other', content: 'The photos from yesterday turned out great', timestamp: '2:15 PM' },
      { id: 2, sender: 'me', content: 'I can\'t wait to see them!', timestamp: '2:20 PM' },
      { id: 3, sender: 'other', content: 'When are we planning the next shoot?', timestamp: '2:25 PM' }
    ],
    3: [
      { id: 1, sender: 'other', content: 'Just arrived in Ubud!', timestamp: '9:00 AM' },
      { id: 2, sender: 'me', content: 'Wow! How\'s the weather?', timestamp: '9:05 AM' },
      { id: 3, sender: 'other', content: 'Bali is incredible! You should visit', timestamp: '9:10 AM' }
    ]
  });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await userService.getAll();
        setUsers(usersData.filter(user => user.username !== 'current_user'));
      } catch (error) {
        console.error('Failed to load users:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat) return;

    // In a real app, this would send the message to the server
    console.log(`Sending message to ${selectedChat.user.displayName}: ${message}`);
    setMessage('');
  };

  const formatTime = (timestamp) => {
    return timestamp;
  };

if (loading) {
    return (
      <div className="min-h-screen bg-surface-50">
        <div className="max-w-7xl mx-auto p-4 lg:p-6">
          <div className="flex h-[calc(100vh-8rem)]">
            <div className="w-80 bg-white border-r border-surface-200 p-4">
              <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-surface-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                      <div className="h-3 bg-surface-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 p-4">
              <div className="h-full bg-surface-100 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-7xl mx-auto p-4 lg:p-6 pb-20 md:pb-6">
        <div className="flex h-[calc(100vh-8rem)] rounded-xl overflow-hidden border border-surface-200 shadow-sm">
          {/* Conversations List */}
          <div className="w-80 bg-white border-r border-surface-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-surface-200">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-semibold text-surface-900">Messages</h1>
                <Button variant="ghost" size="small" icon="Edit" />
              </div>
              <Input
                placeholder="Search conversations..."
                icon="Search"
                className="text-sm"
              />
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conversation) => (
                <motion.button
                  key={conversation.id}
                  whileHover={{ backgroundColor: '#F9FAFB' }}
                  onClick={() => setSelectedChat(conversation)}
                  className={`w-full p-4 text-left border-b border-surface-100 transition-colors ${
                    selectedChat?.id === conversation.id ? 'bg-primary/5 border-primary/20' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar
                        src={conversation.user.avatar}
                        alt={conversation.user.displayName}
                        size="medium"
                        showOnlineStatus
                        isOnline={conversation.online}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-surface-900 truncate">
                          {conversation.user.displayName}
                        </p>
                        <span className="text-xs text-surface-500">
                          {conversation.timestamp}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-surface-600 truncate">
                          {conversation.lastMessage}
                        </p>
                        {conversation.unread > 0 && (
                          <span className="bg-primary text-white text-xs font-medium px-2 py-1 rounded-full min-w-[20px] text-center">
                            {conversation.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 bg-white border-b border-surface-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar
                      src={selectedChat.user.avatar}
                      alt={selectedChat.user.displayName}
                      size="medium"
                      showOnlineStatus
                      isOnline={selectedChat.online}
                    />
                    <div>
                      <p className="font-medium text-surface-900">
                        {selectedChat.user.displayName}
                      </p>
                      <p className="text-sm text-surface-500">
                        {selectedChat.online ? 'Online' : 'Last seen 2h ago'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="small" icon="Phone" />
                    <Button variant="ghost" size="small" icon="Video" />
                    <Button variant="ghost" size="small" icon="MoreVertical" />
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-surface-50">
                  <div className="max-w-4xl mx-auto space-y-4">
                    {messages[selectedChat.id]?.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.sender === 'me'
                            ? 'bg-primary text-white'
                            : 'bg-white text-surface-900 border border-surface-200'
                        }`}>
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${
                            msg.sender === 'me' ? 'text-primary-100' : 'text-surface-500'
                          }`}>
                            {msg.timestamp}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-surface-200">
                  <div className="max-w-4xl mx-auto flex items-center space-x-3">
                    <Button type="button" variant="ghost" size="small" icon="Plus" />
                    <Button type="button" variant="ghost" size="small" icon="Image" />
                    
                    <div className="flex-1">
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="border-surface-300"
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      variant="primary"
                      size="small"
                      icon="Send"
                      disabled={!message.trim()}
                    />
                  </div>
                </form>
              </>
            ) : (
              /* No Chat Selected */
              <div className="flex-1 flex items-center justify-center bg-surface-50">
                <div className="text-center">
                  <ApperIcon name="MessageCircle" size={64} className="text-surface-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-surface-900 mb-2">
                    No conversation selected
                  </h3>
                  <p className="text-surface-600">
                    Choose a conversation from the sidebar to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;