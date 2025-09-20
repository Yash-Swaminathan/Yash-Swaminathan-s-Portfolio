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
          onClick={() => navigate('/')}
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
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          gap: '4rem',
          alignItems: 'start',
        }}>
          {/* Content */}
          <div>
            <motion.div
              variants={itemVariants}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '1rem',
              }}
            >
              <h1 style={{
                fontSize: '3rem',
                fontWeight: '700',
                color: 'var(--text-primary)',
                margin: 0,
                lineHeight: '1.1',
              }}>
                {project.title}
              </h1>
              <span style={{
                fontSize: '1.2rem',
                color: 'var(--text-secondary)',
                fontWeight: '500',
                padding: '4px 12px',
                backgroundColor: 'var(--bg-tertiary, #f0f0f0)',
                borderRadius: '20px',
              }}>
                {project.year}
              </span>
            </motion.div>

            <motion.p
              variants={itemVariants}
              style={{
                fontSize: '1.5rem',
                color: 'var(--text-accent, #007acc)',
                margin: '0 0 2rem 0',
                fontWeight: '500',
              }}
            >
              {project.subtitle}
            </motion.p>

            <motion.p
              variants={itemVariants}
              style={{
                fontSize: '1.1rem',
                color: 'var(--text-primary)',
                lineHeight: '1.7',
                marginBottom: '2rem',
              }}
            >
              {project.description}
            </motion.p>

            {/* Metrics */}
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
              }}>
                Key Features
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
              }}>
                {project.metrics.map((metric, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    style={{
                      padding: '12px 16px',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-default)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {metric}
                  </motion.div>
                ))}
              </div>
            </motion.div>

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
              }}>
                Technologies Used
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

          {/* Project Image/Mockup */}
          <motion.div
            variants={itemVariants}
            style={{
              height: '500px',
              background: `linear-gradient(135deg, var(--bg-tertiary, #f5f5f5) 0%, var(--bg-secondary) 100%)`,
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              fontSize: '72px',
              fontWeight: 'bold',
              border: '1px solid var(--border-default)',
            }}
          >
            {project.title.slice(0, 2).toUpperCase()}
          </motion.div>
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
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '1.5rem',
            }}>
              Project Details
            </h2>
            <div style={{
              fontSize: '1.1rem',
              color: 'var(--text-primary)',
              lineHeight: '1.7',
              whiteSpace: 'pre-line',
            }}>
              {project.longDescription}
            </div>
          </div>
        </motion.div>
      )}

      {/* Project Tags */}
      <motion.div
        variants={itemVariants}
        style={{
          padding: '0 2rem 4rem 2rem',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: '1rem',
        }}>
          Project Categories
        </h3>
        <div style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
        }}>
          {project.tags.map((tag, index) => (
            <motion.span
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              style={{
                padding: '8px 16px',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-secondary)',
                fontSize: '14px',
                fontWeight: '500',
                borderRadius: '20px',
                border: '2px solid var(--border-default)',
              }}
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectDetail;