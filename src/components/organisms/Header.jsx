import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Avatar from '@/components/atoms/Avatar';
import SearchBar from '@/components/molecules/SearchBar';
import ApperIcon from '@/components/ApperIcon';
import { routes } from '@/config/routes';

const Header = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();

  const currentUser = {
    displayName: "You",
    username: "current_user",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face"
  };

  const navigationItems = [
    routes.feed,
    routes.explore,
    routes.messages,
    routes.notifications
  ];

return (
    <header className="sticky top-0 z-50 h-16 bg-white border-b border-surface-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <NavLink to="/feed" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
<ApperIcon name="Zap" size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent font-display">
                PulseConnect
              </span>
            </NavLink>
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'text-primary bg-primary/10'
                        : 'text-surface-600 hover:text-primary hover:bg-surface-50'
                    }`
                  }
                >
                  <div className="flex items-center space-x-2">
                    <ApperIcon name={item.icon} size={18} />
                    <span>{item.label}</span>
                  </div>
                </NavLink>
              ))}
            </nav>
          </div>

{/* Search Bar */}
          <div className="flex-1 mx-4 hidden md:block">
            <SearchBar />
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile search button */}
            <Button
              variant="ghost"
              size="small"
              icon="Search"
              className="sm:hidden"
            />
{/* Create Post */}
            <Button
              variant="prominent"
              size="small"
              icon="Plus"
              className="hidden sm:inline-flex"
            >
              Create
            </Button>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2"
              >
                <Avatar
                  src={currentUser.avatar}
                  alt={currentUser.displayName}
                  size="small"
                />
              </button>

              {/* Profile Dropdown */}
{showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-surface-200 py-2 z-50"
                >
                  <NavLink
                    to="/profile"
                    className="block px-4 py-2 text-sm text-surface-700 hover:bg-surface-50 whitespace-nowrap"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="User" size={16} />
                      <span>Profile</span>
                    </div>
                  </NavLink>
                  <button className="block w-full text-left px-4 py-2 text-sm text-surface-700 hover:bg-surface-50 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Settings" size={16} />
                      <span>Settings</span>
                    </div>
                  </button>
                  <hr className="my-2 border-surface-200" />
                  <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="LogOut" size={16} />
                      <span>Sign Out</span>
                    </div>
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;