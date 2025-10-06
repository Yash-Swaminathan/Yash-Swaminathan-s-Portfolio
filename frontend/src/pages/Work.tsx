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
      {/* Main Content - Projects on left, Experience on right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 350px',
        gap: '3rem',
        padding: '2rem',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Left - Projects Section */}
        <div>
          <ProjectsSection />
        </div>

        {/* Right - Experience Section */}
        <div>
          <Experience />
        </div>
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
