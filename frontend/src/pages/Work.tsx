import React from 'react';
import Experience from '../components/Experience';
import ProjectsSection from '../components/ProjectsSection';

const Work: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)',
      paddingTop: '80px'
    }}>
      {/* Experience Section */}
      <div style={{
        padding: '2rem',
        backgroundColor: 'var(--bg-primary)'
      }}>
        <Experience />
      </div>

      {/* Projects Section */}
      <div style={{
        padding: '2rem',
        backgroundColor: 'var(--bg-primary)'
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
