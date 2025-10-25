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
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
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
      <div style={{ padding: isMobile ? '2rem 1rem' : '4rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          <motion.h1
            variants={itemVariants}
            style={{
              fontSize: isMobile ? '2rem' : '3rem',
              marginBottom: '1rem',
              color: 'var(--text-primary)',
              fontWeight: '700',
              textAlign: 'center'
            }}
          >
            Projects
          </motion.h1>

          <motion.p
            variants={itemVariants}
            style={{
              fontSize: isMobile ? '1rem' : '1.2rem',
              color: 'var(--text-secondary)',
              textAlign: 'center',
              marginBottom: isMobile ? '2rem' : '3rem',
            }}
          >
            A collection of my work and experiments
          </motion.p>

          <motion.div
            variants={containerVariants}
            style={{
              display: 'grid',
              gap: isMobile ? '2rem' : '2.5rem',
              gridTemplateColumns: '1fr',
              maxWidth: '900px',
              margin: '0 auto'
            }}
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.slug}
                variants={itemVariants}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                onClick={() => navigate(`/projects/${project.slug}`)}
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  padding: isMobile ? '2rem 1.5rem' : '3rem 2.5rem',
                  borderRadius: isMobile ? '16px' : '24px',
                  boxShadow: 'var(--shadow-lg)',
                  cursor: 'pointer',
                  border: '1px solid var(--border-default)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Background Pattern */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: index % 2 === 0
                    ? 'linear-gradient(135deg, rgba(0, 122, 204, 0.03) 0%, rgba(0, 122, 204, 0.06) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.04) 100%)',
                  zIndex: 0,
                }} />

                {/* Content Container */}
                <div style={{
                  position: 'relative',
                  zIndex: 1,
                }}>
                  {/* Header: Year and Featured Badge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '1rem',
                    flexWrap: 'wrap',
                  }}>
                    <span style={{
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)',
                      fontWeight: '500',
                      backgroundColor: 'var(--bg-tertiary, #f0f0f0)',
                      padding: '6px 14px',
                      borderRadius: '16px',
                    }}>
                      {project.year}
                    </span>
                    {project.featured && (
                      <span style={{
                        fontSize: '0.875rem',
                        color: 'var(--text-accent, #007acc)',
                        backgroundColor: 'rgba(0, 122, 204, 0.1)',
                        padding: '6px 14px',
                        borderRadius: '16px',
                        fontWeight: '600',
                        border: '1px solid var(--text-accent, #007acc)',
                      }}>
                        ★ Featured
                      </span>
                    )}
                  </div>

                  {/* Title and Subtitle */}
                  <h3 style={{
                    fontSize: isMobile ? '1.5rem' : '2rem',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    margin: '0 0 0.5rem 0',
                    lineHeight: '1.2',
                  }}>
                    {project.title}
                  </h3>

                  <p style={{
                    fontSize: isMobile ? '1rem' : '1.125rem',
                    color: 'var(--text-accent, #007acc)',
                    margin: '0 0 1rem 0',
                    fontWeight: '500',
                  }}>
                    {project.subtitle}
                  </p>

                  {/* Description */}
                  <p style={{
                    color: 'var(--text-secondary)',
                    lineHeight: '1.6',
                    marginBottom: '1.5rem',
                    fontSize: isMobile ? '0.9375rem' : '1rem',
                  }}>
                    {project.description}
                  </p>

                  {/* Metrics */}
                  {project.metrics && project.metrics.length > 0 && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{
                        display: 'flex',
                        gap: '0.75rem',
                        flexWrap: 'wrap',
                      }}>
                        {project.metrics.map((metric, idx) => (
                          <div
                            key={idx}
                            style={{
                              fontSize: '0.875rem',
                              color: 'var(--text-primary)',
                              backgroundColor: 'var(--bg-tertiary, #f0f0f0)',
                              padding: '8px 14px',
                              borderRadius: '16px',
                              fontWeight: '600',
                              border: '1px solid var(--border-default)',
                            }}
                          >
                            {metric}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Technologies */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}>
                      {project.tech.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: 'var(--bg-primary)',
                            color: 'var(--text-secondary)',
                            fontSize: '0.875rem',
                            borderRadius: '14px',
                            border: '1px solid var(--border-default)',
                            fontWeight: '500',
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tags and Call to Action */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--border-default)',
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem',
                      flexWrap: 'wrap',
                    }}>
                      {project.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '0.8125rem',
                            color: 'var(--text-secondary)',
                            backgroundColor: 'var(--bg-primary)',
                            padding: '5px 10px',
                            borderRadius: '12px',
                            border: '1px solid var(--border-default)',
                            fontWeight: '500',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div
                      style={{
                        color: 'var(--text-accent, #007acc)',
                        fontSize: '0.9375rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      View Details →
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Projects;