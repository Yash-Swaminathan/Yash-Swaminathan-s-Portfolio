import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { MapProvider } from './contexts/MapContext';
import Navigation from './components/Navigation';
// Map is now embedded in individual pages
import Me from './pages/Me';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';

function App() {
  return (
    <ThemeProvider>
      <MapProvider>
        <Router>
          <div className="App">
            <Navigation />
            <Routes>
              <Route path="/" element={<Me />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:slug" element={<ProjectDetail />} />
            </Routes>
          </div>
        </Router>
      </MapProvider>
    </ThemeProvider>
  );
}

export default App;
