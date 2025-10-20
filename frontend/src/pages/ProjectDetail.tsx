import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProjectBySlug } from '../data/projects';

const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const project = slug ? getProjectBySlug(slug) : undefined;

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
        paddingTop: '80px',
      }}
    >
      {/* Back Navigation */}
      <motion.div
        variants={itemVariants}
        style={{
          padding: '2rem',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <motion.button
          onClick={() => navigate('/projects')}
          whileHover={{ scale: 1.02, x: -4 }}
          whileTap={{ scale: 0.98 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-default)',
            borderRadius: '8px',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            fontFamily: 'Inter, sans-serif',
            marginBottom: '2rem',
          }}
        >
          ← Back to Projects
        </motion.button>
      </motion.div>

      {/* Hero Section */}
      <motion.div
        variants={itemVariants}
        style={{
          padding: '0 2rem 4rem 2rem',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <div>
          {/* Content */}
          <div style={{ maxWidth: '800px' }}>
            <motion.div
              variants={itemVariants}
              style={{
                marginBottom: '1rem',
              }}
            >
              <h1 style={{
                fontSize: '3rem',
                fontWeight: '700',
                color: 'var(--text-primary)',
                margin: 0,
                lineHeight: '1.1',
                fontFamily: 'Inter, sans-serif',
              }}>
                {project.title}
              </h1>
            </motion.div>

            <motion.p
              variants={itemVariants}
              style={{
                fontSize: '1.1rem',
                color: 'var(--text-primary)',
                lineHeight: '1.7',
                marginBottom: '2rem',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {project.description}
            </motion.p>


            {/* Technologies */}
            <motion.div
              variants={itemVariants}
              style={{
                marginBottom: '2rem',
              }}
            >
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '1rem',
                fontFamily: 'Inter, sans-serif',
              }}>
                Technologies
              </h3>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
              }}>
                {project.tech.map((tech, index) => (
                  <motion.span
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: 'var(--bg-tertiary, #f0f0f0)',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      fontWeight: '500',
                      borderRadius: '20px',
                      border: '1px solid var(--border-default)',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
              }}
            >
              {project.demoUrl && (
                <motion.a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: 'var(--text-accent, #007acc)',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '16px',
                    fontFamily: 'Inter, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  View Demo →
                </motion.a>
              )}

              {project.repoUrl && (
                <motion.a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '16px',
                    fontFamily: 'Inter, sans-serif',
                    border: '1px solid var(--border-default)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  View Code →
                </motion.a>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Detailed Description */}
      {project.longDescription && (
        <motion.div
          variants={itemVariants}
          style={{
            padding: '0 2rem 4rem 2rem',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '2rem',
            borderRadius: '16px',
            border: '1px solid var(--border-default)',
          }}>
            <div style={{
              fontSize: '1.1rem',
              color: 'var(--text-primary)',
              lineHeight: '1.7',
              whiteSpace: 'pre-line',
              fontFamily: 'Inter, sans-serif',
            }}>
              {project.longDescription}
            </div>
          </div>
        </motion.div>
      )}

    </motion.div>
  );
};

export default ProjectDetail;