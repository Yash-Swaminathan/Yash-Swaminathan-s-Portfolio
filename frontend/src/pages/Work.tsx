import React from 'react';
import Experience from '../components/Experience';
import ProjectsSection from '../components/ProjectsSection';

const Work: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)',
      paddingTop: '60px'
    }}>
      {/* Work Heading */}
      <div style={{ padding: '3rem 2rem 2rem 2rem' }}>
        <h1 style={{
          fontSize: '4rem',
          fontWeight: '700',
          color: 'var(--text-primary)',
          textAlign: 'center',
          marginBottom: '3rem',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          letterSpacing: '-0.02em'
        }}>
          Work
        </h1>
      </div>

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
