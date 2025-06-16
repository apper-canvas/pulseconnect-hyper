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
    <div className="min-h-screen bg-gradient-soft">
      {/* Header */}
      <Header />
      
      {/* Main content container */}
      <div className="flex-1">
        <main className="min-h-screen">
          <div className="w-full">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Mobile bottom navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default Layout;