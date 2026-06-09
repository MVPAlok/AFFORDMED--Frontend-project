import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

function App() {
  const [route, setRoute] = useState(window.location.hash || '#');

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

  // Check if hash matches dashboard route prefix
  if (route.startsWith('#dashboard')) {
    return <Dashboard currentRoute={route} />;
  }

  // Fallback to Landing Page
  return <LandingPage />;
}

export default App;
