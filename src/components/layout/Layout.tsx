
import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/store';
import Header from './Header';
import Footer from './Footer';
import { useEffect } from 'react';

interface LayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
  adminOnly?: boolean;
}

const Layout = ({ 
  children, 
  requireAuth = false,
  adminOnly = false
}: LayoutProps) => {
  const { user, isAuthenticated } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      navigate('/login');
    } else if (adminOnly && (!isAuthenticated || user?.role !== 'admin')) {
      navigate('/unauthorized');
    }
  }, [isAuthenticated, user, requireAuth, adminOnly, navigate]);

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (adminOnly && (!isAuthenticated || user?.role !== 'admin')) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
