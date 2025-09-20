import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { projects } from '../data/projects';

const Projects: React.FC = () => {
  const navigate = useNavigate();

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
      <div style={{ padding: '4rem 1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          <motion.h1
            variants={itemVariants}
            style={{
              fontSize: '3rem',
              marginBottom: '1rem',
              color: 'var(--text-primary)',
              fontWeight: '700',
              textAlign: 'center'
            }}
          >
            All Projects
          </motion.h1>

          <motion.p
            variants={itemVariants}
            style={{
              fontSize: '1.2rem',
              color: 'var(--text-secondary)',
              textAlign: 'center',
              marginBottom: '3rem',
            }}
          >
            A comprehensive look at my work and experiments
          </motion.p>

          <motion.div
            variants={containerVariants}
            style={{
              display: 'grid',
              gap: '4rem',
              gridTemplateColumns: '1fr',
              maxWidth: '1000px',
              margin: '0 auto'
            }}
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.slug}
                variants={itemVariants}
                whileHover={{
                  y: -12,
                  transition: { duration: 0.3 }
                }}
                onClick={() => navigate(`/projects/${project.slug}`)}
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  padding: 'clamp(2rem, 4vw, 4rem) clamp(1.5rem, 3vw, 3rem)',
                  borderRadius: 'clamp(20px, 3vw, 32px)',
                  boxShadow: 'var(--shadow-lg)',
                  cursor: 'pointer',
                  border: '1px solid var(--border-default)',
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: 'clamp(300px, 50vh, 400px)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
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
                    ? 'linear-gradient(135deg, rgba(0, 122, 204, 0.03) 0%, rgba(0, 122, 204, 0.08) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  zIndex: 0,
                }} />

                {/* Content Container */}
                <div style={{
                  position: 'relative',
                  zIndex: 1,
                  width: '100%',
                  maxWidth: '800px',
                }}>
                  {/* Project Header */}
                  <div style={{
                    marginBottom: '2rem',
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '1rem',
                      marginBottom: '1rem',
                      flexWrap: 'wrap',
                    }}>
                      <span style={{
                        fontSize: '1rem',
                        color: 'var(--text-secondary)',
                        fontWeight: '500',
                        backgroundColor: 'var(--bg-tertiary, #f0f0f0)',
                        padding: '8px 16px',
                        borderRadius: '20px',
                      }}>
                        {project.year}
                      </span>
                      {project.featured && (
                        <span style={{
                          fontSize: '0.9rem',
                          color: 'var(--text-accent, #007acc)',
                          backgroundColor: 'var(--bg-primary)',
                          padding: '8px 16px',
                          borderRadius: '20px',
                          fontWeight: '600',
                          border: '2px solid var(--text-accent, #007acc)',
                        }}>
                          ★ FEATURED
                        </span>
                      )}
                    </div>

                    <h3 style={{
                      fontSize: 'clamp(2rem, 5vw, 3rem)',
                      fontWeight: '700',
                      color: 'var(--text-primary)',
                      margin: '0 0 1rem 0',
                      lineHeight: '1.1',
                    }}>
                      {project.title}
                    </h3>

                    <p style={{
                      fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
                      color: 'var(--text-accent, #007acc)',
                      margin: '0 0 2rem 0',
                      fontWeight: '500',
                    }}>
                      {project.subtitle}
                    </p>
                  </div>

                  <p style={{
                    color: 'var(--text-secondary)',
                    lineHeight: '1.8',
                    marginBottom: '3rem',
                    fontSize: '1.1rem',
                    maxWidth: '700px',
                    margin: '0 auto 3rem auto',
                  }}>
                    {project.description}
                  </p>

                  {/* Metrics */}
                  <div style={{ marginBottom: '3rem' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '1rem',
                      flexWrap: 'wrap',
                    }}>
                      {project.metrics.map((metric, idx) => (
                        <div
                          key={idx}
                          style={{
                            fontSize: '0.9rem',
                            color: 'var(--text-primary)',
                            backgroundColor: 'var(--bg-tertiary, #f0f0f0)',
                            padding: '12px 20px',
                            borderRadius: '24px',
                            fontWeight: '600',
                            border: '1px solid var(--border-default)',
                          }}
                        >
                          {metric}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technologies */}
                  <div style={{ marginBottom: '2rem' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}>
                      {project.tech.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: 'var(--bg-primary)',
                            color: 'var(--text-secondary)',
                            fontSize: '0.9rem',
                            borderRadius: '20px',
                            border: '1px solid var(--border-default)',
                            fontWeight: '500',
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tags and Action */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '2rem',
                    flexWrap: 'wrap',
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '12px',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                    }}>
                      {project.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '0.9rem',
                            color: 'var(--text-secondary)',
                            backgroundColor: 'var(--bg-primary)',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: '1px solid var(--border-default)',
                            fontWeight: '500',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <motion.div
                      style={{
                        color: 'var(--text-accent, #007acc)',
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        backgroundColor: 'rgba(0, 122, 204, 0.1)',
                        padding: '12px 24px',
                        borderRadius: '25px',
                        border: '2px solid var(--text-accent, #007acc)',
                      }}
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: 'var(--text-accent, #007acc)',
                        color: 'white',
                        transition: { duration: 0.2 }
                      }}
                    >
                      View Project →
                    </motion.div>
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