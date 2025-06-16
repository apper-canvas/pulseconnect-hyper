import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routes } from '@/config/routes';

const MobileBottomNav = () => {
  const navigationItems = [
    routes.feed,
    routes.explore,
    { ...routes.messages, icon: 'Plus', label: 'Create', path: '/create' }, // Middle create button
    routes.notifications,
    routes.profile
  ];

return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-surface-200 shadow-lg z-50">
      <nav className="flex items-center justify-around py-2">
        {navigationItems.map((item, index) => {
          // Special styling for create button (middle item)
          if (index === 2) {
            return (
              <motion.button
                key="create"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg"
              >
                <ApperIcon name="Plus" size={24} className="text-white" />
              </motion.button>
            );
          }

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-surface-500'
                }`
              }
            >
              {({ isActive }) => (
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center space-y-1"
                >
                  <ApperIcon 
                    name={item.icon} 
                    size={20} 
                    className={isActive ? 'text-primary' : 'text-surface-500'}
                  />
                  <span className="text-xs font-medium">
                    {item.label}
                  </span>
                </motion.div>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileBottomNav;