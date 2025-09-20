import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { MapProvider } from './contexts/MapContext';
import Navigation from './components/Navigation';
import CurrentCityMap, { MapToggleButton } from './components/CurrentCityMap';
import Me from './pages/Me';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';

function App() {
  const [isMapVisible, setIsMapVisible] = useState(true);

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

            {/* Mini Map */}
            {isMapVisible && (
              <CurrentCityMap
                width={280}
                height={200}
                top="80px"
                right="20px"
              />
            )}

            {/* Map Toggle Button */}
            <MapToggleButton
              onToggle={() => setIsMapVisible(!isMapVisible)}
              isVisible={isMapVisible}
            />
          </div>
        </Router>
      </MapProvider>
    </ThemeProvider>
  );
}

export default App;
