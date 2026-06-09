import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { AuthProvider, useAuth } from './hooks/useAuth';

function AppContent() {
  const [route, setRoute] = useState(window.location.hash || '#');
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || '#');
      // Scroll to top on hash route change
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-white"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  // Auth Routing
  if (route === '#login') {
    return <Login />;
  }

  // Check if hash matches dashboard route prefix
  if (route.startsWith('#dashboard')) {
    if (!user) {
      window.location.hash = '#login';
      return null;
    }
    return <Dashboard currentRoute={route} />;
  }

  // Fallback to Landing Page
  return <LandingPage />;
}

export default function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}
