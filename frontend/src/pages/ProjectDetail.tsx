import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProjectBySlug } from '../data/projects';
import { useWindowSize } from '../hooks/useWindowSize';

const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const project = slug ? getProjectBySlug(slug) : undefined;
  const { isMobile } = useWindowSize();

  useEffect(() => {
    if (!project) {
      navigate('/projects');
    }
  }, [project, navigate]);

  if (!project) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const }
    }
  };

  const getStatusColor = (status?: 'live' | 'demo' | 'archived') => {
    switch (status) {
      case 'live':
        return '#10b981';
      case 'demo':
        return '#f59e0b';
      case 'archived':
        return '#6b7280';
      default:
        return '#6b7280';
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
        paddingTop: '80px',
      }}
    >
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: isMobile ? '2rem 1.25rem 4rem 1.25rem' : '2.5rem 2rem 6rem 2rem',
      }}>

        {/* Back Button */}
        <motion.button
          variants={itemVariants}
          onClick={() => navigate('/projects')}
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.98 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0',
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '0.9375rem',
            fontWeight: '600',
            fontFamily: 'Inter, sans-serif',
            marginBottom: '2.5rem',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to projects
        </motion.button>

        {/* Header */}
        <motion.div variants={itemVariants} style={{ marginBottom: '2rem' }}>
          {/* Status + Meta */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
          }}>
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {project.year}
            </span>
            {project.status && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}>
                <span
                  style={{
                    height: '6px',
                    width: '6px',
                    borderRadius: '50%',
                    backgroundColor: getStatusColor(project.status),
                    display: 'inline-block',
                  }}
                />
                <span style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  textTransform: 'capitalize',
                  fontWeight: '500',
                }}>
                  {project.status}
                </span>
              </div>
            )}
            {project.timeline && (
              <>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>•</span>
                <span style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  fontWeight: '500',
                }}>
                  {project.timeline}
                </span>
              </>
            )}
            {project.teamSize && (
              <>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>•</span>
                <span style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  fontWeight: '500',
                }}>
                  {project.teamSize}
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: isMobile ? '2rem' : '2.75rem',
            fontWeight: '800',
            color: 'var(--text-primary)',
            margin: '0 0 0.75rem 0',
            lineHeight: '1.1',
            letterSpacing: '-0.025em',
            fontFamily: 'Inter, sans-serif',
          }}>
            {project.title}
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: isMobile ? '1.125rem' : '1.25rem',
            color: 'var(--text-secondary)',
            margin: '0 0 1.5rem 0',
            fontWeight: '500',
            lineHeight: '1.4',
          }}>
            {project.subtitle}
          </p>

          {/* Quick summary */}
          <p style={{
            fontSize: '1rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.65',
            fontWeight: '400',
          }}>
            {project.description}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          style={{
            display: 'flex',
            gap: '0.75rem',
            marginBottom: '3rem',
            flexWrap: 'wrap',
          }}
        >
          {project.repoUrl && (
            <motion.a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                backgroundColor: 'var(--text-primary)',
                color: 'var(--bg-primary)',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '0.9375rem',
                fontFamily: 'Inter, sans-serif',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.85';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              View on GitHub
            </motion.a>
          )}
          {project.demoUrl && (
            <motion.a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '0.9375rem',
                fontFamily: 'Inter, sans-serif',
                border: '1px solid var(--border-default)',
              }}
            >
              View Website
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
              </svg>
            </motion.a>
          )}
        </motion.div>

        {/* Overview */}
        {project.overview && (
          <motion.div variants={itemVariants} style={{ marginBottom: '3rem' }}>
            <div style={{
              fontSize: '1.0625rem',
              color: 'var(--text-primary)',
              lineHeight: '1.75',
              whiteSpace: 'pre-line',
              fontWeight: '400',
            }}>
              {project.overview}
            </div>
          </motion.div>
        )}

        {/* Sections */}
        {project.sections && project.sections.map((section, index) => (
          <motion.section
            key={index}
            variants={itemVariants}
            style={{ marginBottom: '3rem' }}
          >
            <h2 style={{
              fontSize: isMobile ? '1.375rem' : '1.5rem',
              fontWeight: '700',
              color: 'var(--text-primary)',
              marginBottom: '1rem',
              letterSpacing: '-0.015em',
              lineHeight: '1.3',
            }}>
              {section.heading}
            </h2>
            <div style={{
              fontSize: '1.0625rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.75',
              whiteSpace: 'pre-line',
              fontWeight: '400',
            }}>
              {section.content}
            </div>
          </motion.section>
        ))}

        {/* Tech Stack */}
        <motion.div variants={itemVariants} style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: isMobile ? '1.375rem' : '1.5rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: '1rem',
            letterSpacing: '-0.015em',
            lineHeight: '1.3',
          }}>
            Technologies Used
          </h2>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}>
            {project.tech.map((tech, index) => (
              <span
                key={index}
                style={{
                  padding: '0.5rem 0.875rem',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  borderRadius: '8px',
                  border: '1px solid var(--border-default)',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>


      </div>
    </motion.div>
  );
};

export default ProjectDetail;
