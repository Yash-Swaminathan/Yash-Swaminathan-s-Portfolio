import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { MapProvider } from './contexts/MapContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
// Map is now embedded in individual pages
import Me from './pages/Me';
import Work from './pages/Work';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';

function App() {
  return (
    <ThemeProvider>
      <MapProvider>
        <Router>
          <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navigation />
            <div style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Me />} />
                <Route path="/work" element={<Work />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:slug" element={<ProjectDetail />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </MapProvider>
    </ThemeProvider>
  );
}

export default App;
