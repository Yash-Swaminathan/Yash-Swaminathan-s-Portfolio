import React from 'react';

interface ProjectsSectionProps {
  className?: string;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ className = '' }) => {
  return (
    <div className={className} style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '3rem 2rem',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: '1rem'
        }}>
          I believe tech is best built with <span style={{ fontStyle: 'italic' }}>empathy</span>.
        </h2>
        <p style={{
          fontSize: '1.1rem',
          color: 'var(--text-secondary)',
          marginBottom: '2rem'
        }}>
          Building with intention.
        </p>

        <div style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '3rem'
        }}>
          {['infra', 'ai', 'fullstack', 'design'].map((tag) => (
            <span
              key={tag}
              style={{
                padding: '0.5rem 1.5rem',
                border: '1px solid var(--border-default)',
                borderRadius: '4px',
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                backgroundColor: 'transparent'
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div style={{ marginBottom: '3rem' }}>
          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-secondary)',
            marginBottom: '1rem',
            fontStyle: 'italic'
          }}>
            so, what have i been <span style={{ fontWeight: '600' }}>building</span>?
          </p>
          <p style={{
            fontSize: '0.95rem',
            color: 'var(--text-muted)',
            fontStyle: 'italic'
          }}>
            click to read more about each project below!
          </p>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid var(--border-default)',
        paddingTop: '2rem'
      }}>
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: '2rem',
          borderRadius: '12px',
          border: '1px solid var(--border-default)',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <span style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#22c55e',
              borderRadius: '50%',
              display: 'inline-block'
            }}></span>
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: 0
            }}>
              CURRENTLY BUILDING
            </h3>
          </div>

          <div>
            <h4 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '0.5rem'
            }}>
              NODAL
            </h4>
            <p style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              margin: 0
            }}>
              Reimagining the way we interact, learn and automate with AI using nodes. Stay tuned!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsSection;
