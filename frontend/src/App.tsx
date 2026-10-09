import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { MapProvider } from './contexts/MapContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
// Map is now embedded in individual pages
import Me from './pages/Me';
import Work from './pages/Work';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Writing from './pages/Writing';

const Review = process.env.NODE_ENV === 'development' ? React.lazy(() => import('./pages/Review')) : null;

function AppContent() {
  const location = useLocation();

  if (Review && location.pathname === '/review') {
    return <React.Suspense fallback={<p>Loading portfolio review...</p>}><Review /></React.Suspense>;
  }

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navigation />
      <div id="page-content" tabIndex={-1} style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Me />} />
          <Route path="/work" element={<Work />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/writing" element={<Writing />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <MapProvider>
        <Router>
          <AppContent />
        </Router>
      </MapProvider>
    </ThemeProvider>
  );
}

export default App;
