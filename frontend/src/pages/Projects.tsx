import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { projects } from '../data/projects';
import { useWindowSize } from '../hooks/useWindowSize';

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = useWindowSize();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };


  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        paddingTop: '80px'
      }}
    >
      <div style={{ padding: isMobile ? '2rem 1.25rem 4rem 1.25rem' : '2.5rem 2rem 6rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          variants={itemVariants}
          style={{
            marginBottom: isMobile ? '2.5rem' : '3rem',
          }}
        >
          <h1
            style={{
              fontSize: isMobile ? '2.25rem' : '3rem',
              marginBottom: '0.5rem',
              color: 'var(--text-primary)',
              fontWeight: '800',
              letterSpacing: '-0.025em',
              lineHeight: '1.1'
            }}
          >
            Projects
          </h1>

          <p
            style={{
              fontSize: isMobile ? '1rem' : '1.125rem',
              color: 'var(--text-secondary)',
              maxWidth: '600px',
              lineHeight: '1.6',
              fontWeight: '400'
            }}
          >
            What I've Built!
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          style={{
            display: 'grid',
            gap: isMobile ? '1.5rem' : '1.75rem',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(520px, 1fr))',
          }}
        >
          {projects.map((project) => (
            <motion.article
              key={project.slug}
              variants={itemVariants}
              whileHover={{ y: -3 }}
              onClick={() => navigate(`/projects/${project.slug}`)}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                padding: isMobile ? '1.5rem' : '1.75rem',
                borderRadius: '12px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                cursor: 'pointer',
                border: '1px solid var(--border-default)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
              }}
            >

              {/* Content */}
              <div style={{ position: 'relative' }}>


                {/* Title */}
                <h3 style={{
                  fontSize: isMobile ? '1.375rem' : '1.5rem',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  margin: '0 0 0.375rem 0',
                  lineHeight: '1.25',
                  letterSpacing: '-0.015em',
                }}>
                  {project.title}
                </h3>

                {/* Subtitle */}
                <p style={{
                  fontSize: isMobile ? '0.9375rem' : '1rem',
                  color: 'var(--text-secondary)',
                  margin: '0 0 0.875rem 0',
                  fontWeight: '500',
                  lineHeight: '1.4',
                }}>
                  {project.subtitle}
                </p>

                {/* Description */}
                <p style={{
                  color: 'var(--text-secondary)',
                  lineHeight: '1.6',
                  marginBottom: '1.25rem',
                  fontSize: '0.9375rem',
                  fontWeight: '400',
                }}>
                  {project.description}
                </p>

                {/* KPI Chips */}
                {project.kpis && project.kpis.length > 0 && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}>
                      {project.kpis.map((kpi, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: '0.375rem 0.75rem',
                            backgroundColor: 'var(--bg-tertiary, rgba(0, 0, 0, 0.03))',
                            color: 'var(--text-primary)',
                            fontSize: '0.8125rem',
                            borderRadius: '6px',
                            border: '1px solid var(--border-default)',
                            fontWeight: '600',
                            fontFamily: 'monospace',
                          }}
                        >
                          {kpi}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Core Stack (max 3) */}
                <div style={{ marginBottom: '1.125rem' }}>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.4rem',
                  }}>
                    {(project.coreStack || project.tech.slice(0, 3)).map((tech, idx) => (
                      <span
                        key={idx}
                        style={{
                          padding: '0.25rem 0.625rem',
                          backgroundColor: 'var(--bg-primary)',
                          color: 'var(--text-secondary)',
                          fontSize: '0.75rem',
                          borderRadius: '6px',
                          border: '1px solid var(--border-default)',
                          fontWeight: '500',
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-default)',
                }}>
                  {project.repoUrl && (
                    <motion.a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      whileHover={{ x: 1 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        color: 'var(--text-secondary)',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }}
                    >
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      <span>GitHub</span>
                    </motion.a>
                  )}
                  <motion.div
                    whileHover={{ x: 2 }}
                    style={{
                      marginLeft: 'auto',
                      color: 'var(--text-primary)',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                    }}
                  >
                    <span>View project</span>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </motion.div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Projects;
