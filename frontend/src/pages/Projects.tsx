import React from 'react';

const Projects: React.FC = () => {
  const projects = [
    {
      title: "Portfolio Database System",
      description: "Built a comprehensive portfolio management system with PostgreSQL, Docker, and real-time button click tracking.",
      tech: ["PostgreSQL", "Docker", "Node.js", "React", "TypeScript"],
    },
    {
      title: "Interactive Web Applications",
      description: "Developed dynamic, responsive web applications with modern frameworks and smooth user experiences.",
      tech: ["React", "JavaScript", "HTML5", "CSS3"],
    },
    {
      title: "Full-Stack Development",
      description: "Created end-to-end solutions connecting frontend interfaces with robust backend systems and databases.",
      tech: ["Express.js", "REST APIs", "Database Design", "Authentication"],
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)',
      paddingTop: '60px' // Account for header
    }}>
      <div style={{ padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

          <h1 style={{
            fontSize: '2.5rem',
            marginBottom: '3rem',
            color: 'var(--text-primary)',
            fontWeight: '600',
            textAlign: 'center'
          }}>
            Projects
          </h1>

          <div style={{
            display: 'grid',
            gap: '2rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))'
          }}>
            {projects.map((project, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  padding: '2rem',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-md)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
              >
                <h3 style={{
                  fontSize: '1.5rem',
                  marginBottom: '1rem',
                  color: 'var(--text-primary)',
                  fontWeight: '600'
                }}>
                  {project.title}
                </h3>

                <p style={{
                  color: 'var(--text-secondary)',
                  lineHeight: '1.6',
                  marginBottom: '1.5rem'
                }}>
                  {project.description}
                </p>

                <div>
                  <h4 style={{
                    fontSize: '0.9rem',
                    marginBottom: '0.5rem',
                    color: 'var(--text-primary)',
                    fontWeight: '600'
                  }}>
                    Technologies:
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {project.tech.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        style={{
                          padding: '0.25rem 0.75rem',
                          backgroundColor: 'var(--bg-tertiary)',
                          color: 'var(--text-primary)',
                          fontSize: '0.85rem',
                          borderRadius: '20px'
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;