import React from 'react';
import ProjectsSection from '../components/ProjectsSection';

const Work: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)',
      paddingTop: '80px'
    }}>
      {/* Projects Section - Full Width */}
      <div style={{
        padding: '2rem',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <ProjectsSection />
      </div>

      {/* Additional spacing */}
      <div style={{ padding: '2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Empty space for clean look */}
        </div>
      </div>
    </div>
  );
};

export default Work;
