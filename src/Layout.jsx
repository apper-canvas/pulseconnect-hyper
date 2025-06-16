import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '@/components/organisms/Header';
import MobileBottomNav from '@/components/organisms/MobileBottomNav';

const Layout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <Header />
      
      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto">
          <Outlet />
        </main>
      </div>
      
      {/* Mobile bottom navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default Layout;