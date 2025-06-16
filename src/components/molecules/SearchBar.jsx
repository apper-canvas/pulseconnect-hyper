import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Input from '@/components/atoms/Input';
import Avatar from '@/components/atoms/Avatar';
import ApperIcon from '@/components/ApperIcon';
import { userService } from '@/services';

const SearchBar = ({ placeholder = "Search users and hashtags...", className = '' }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    try {
      const users = await userService.searchUsers(searchQuery);
      setResults(users);
      setIsOpen(true);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce search
    timeoutRef.current = setTimeout(() => {
      handleSearch(value);
    }, 300);
  };

  const handleResultClick = (user) => {
    setQuery(user.displayName);
    setIsOpen(false);
    // Navigate to user profile or handle selection
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

return (
    <div ref={searchRef} className={`relative w-full ${className}`}>
      <div className="relative">
        <Input
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          icon="Search"
          iconPosition="left"
          className="pr-10 w-full"
          onFocus={() => query && setIsOpen(true)}
        />
        
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <ApperIcon 
              name="X" 
              size={16} 
              className="text-surface-400 hover:text-surface-600" 
            />
          </button>
        )}
        
        {loading && (
          <div className="absolute inset-y-0 right-8 flex items-center">
            <ApperIcon 
              name="Loader2" 
              size={16} 
              className="text-surface-400 animate-spin" 
            />
          </div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-surface-200 z-50 max-h-96 overflow-y-auto"
          >
            <div className="py-2">
              {results.map((user) => (
                <motion.button
                  key={user.Id}
                  whileHover={{ backgroundColor: '#F9FAFB' }}
                  onClick={() => handleResultClick(user)}
                  className="w-full px-4 py-3 flex items-center space-x-3 text-left hover:bg-surface-50 transition-colors"
                >
                  <Avatar src={user.avatar} alt={user.displayName} size="small" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-900 truncate">
                      {user.displayName}
                    </p>
                    <p className="text-sm text-surface-500 truncate">
                      @{user.username}
                    </p>
                  </div>
                  {user.verified && (
                    <ApperIcon name="BadgeCheck" size={16} className="text-primary" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && query && results.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-surface-200 z-50"
          >
            <div className="py-8 px-4 text-center">
              <ApperIcon name="Search" size={24} className="text-surface-300 mx-auto mb-2" />
              <p className="text-sm text-surface-500">No results found for "{query}"</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;