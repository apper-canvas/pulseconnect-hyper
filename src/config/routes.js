import Feed from '@/components/pages/Feed';
import Explore from '@/components/pages/Explore';
import Messages from '@/components/pages/Messages';
import Notifications from '@/components/pages/Notifications';
import Profile from '@/components/pages/Profile';

export const routes = {
  feed: {
    id: 'feed',
    label: 'Home',
    path: '/feed',
    icon: 'Home',
    component: Feed
  },
  explore: {
    id: 'explore',
    label: 'Explore',
    path: '/explore',
    icon: 'Search',
    component: Explore
  },
  messages: {
    id: 'messages',
    label: 'Messages',
    path: '/messages',
    icon: 'MessageCircle',
    component: Messages
  },
  notifications: {
    id: 'notifications',
    label: 'Notifications',
    path: '/notifications',
    icon: 'Bell',
    component: Notifications
  },
  profile: {
    id: 'profile',
    label: 'Profile',
    path: '/profile',
    icon: 'User',
    component: Profile
  }
};

export const routeArray = Object.values(routes);

export default routes;