import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Project, getFeaturedProjects } from '../data/projects';
import './ProjectShifter.css';

interface ProjectCardProps {
  project: Project;
  index: number;
  isActive: boolean;
  onClick: () => void;
  onHover: () => void;
  onFocus: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  isActive,
  onClick,
  onHover,
  onFocus
}) => {
  const cardVariants = {
    inactive: {
      scale: 0.9,
      opacity: 0.7,
      filter: 'grayscale(20%)',
    },
    active: {
      scale: 1,
      opacity: 1,
      filter: 'grayscale(0%)',
    },
    hover: {
      scale: 1.02,
      opacity: 1,
      filter: 'grayscale(0%)',
      y: -8,
    }
  };

  return (
    <motion.div
      className="project-card"
      variants={cardVariants}
      initial="inactive"
      animate={isActive ? "active" : "inactive"}
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      onHoverStart={onHover}
      onFocus={onFocus}
      tabIndex={0}
      role="button"
      aria-label={`View project: ${project.title}`}
      style={{
        minWidth: '320px',
        height: '400px',
        marginRight: '24px',
        cursor: 'pointer',
        outline: 'none',
        borderRadius: '16px',
        backgroundColor: 'var(--bg-secondary)',
        border: isActive ? '2px solid var(--text-accent, #007acc)' : '1px solid var(--border-default)',
        boxShadow: isActive ? 'var(--shadow-lg)' : 'var(--shadow-md)',
        overflow: 'hidden',
        position: 'relative',
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Cover Image */}
      <div style={{
        height: '200px',
        background: `linear-gradient(135deg, var(--bg-tertiary, #f5f5f5) 0%, var(--bg-secondary) 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-secondary)',
        fontSize: '48px',
        fontWeight: 'bold',
      }}>
        {project.title.slice(0, 2).toUpperCase()}
      </div>

      {/* Content */}
      <div style={{
        padding: '20px',
        height: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        {/* Header */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '8px',
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: 0,
              lineHeight: '1.2',
            }}>
              {project.title}
            </h3>
            <span style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              fontWeight: '500',
            }}>
              {project.year}
            </span>
          </div>

          <p style={{
            fontSize: '16px',
            color: 'var(--text-accent, #007acc)',
            margin: '0 0 12px 0',
            fontWeight: '500',
          }}>
            {project.subtitle}
          </p>
        </div>

        {/* Metrics */}
        <div>
          {project.metrics.slice(0, 1).map((metric, idx) => (
            <div
              key={idx}
              style={{
                fontSize: '14px',
                color: 'var(--text-primary)',
                backgroundColor: 'var(--bg-tertiary, #f0f0f0)',
                padding: '6px 12px',
                borderRadius: '20px',
                display: 'inline-block',
                marginBottom: '12px',
                fontWeight: '500',
              }}
            >
              {metric}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{
            display: 'flex',
            gap: '6px',
            flexWrap: 'wrap',
          }}>
            {project.tags.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  backgroundColor: 'var(--bg-primary)',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-default)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <motion.div
            style={{
              color: 'var(--text-accent, #007acc)',
              fontSize: '14px',
              fontWeight: '600',
            }}
            animate={{
              x: isActive ? [0, 4, 0] : 0,
            }}
            transition={{
              duration: 1.5,
              repeat: isActive ? Infinity : 0,
              ease: "easeInOut",
            }}
          >
            View →
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

interface ProjectShifterProps {
  onProjectClick?: (project: Project) => void;
}

const ProjectShifter: React.FC<ProjectShifterProps> = ({ onProjectClick }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [projects] = useState(getFeaturedProjects());
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToProject = useCallback((index: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = 344; // 320px + 24px margin
      const scrollLeft = index * cardWidth;
      scrollContainerRef.current.scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      });
    }
  }, []);

  const handleProjectClick = useCallback((project: Project, index: number) => {
    setActiveIndex(index);
    if (onProjectClick) {
      onProjectClick(project);
    } else {
      navigate(`/projects/${project.slug}`);
    }
  }, [navigate, onProjectClick]);

  const handleKeyNavigation = useCallback((e: KeyboardEvent) => {
    if (e.target !== document.body) return;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        const prevIndex = Math.max(0, activeIndex - 1);
        setActiveIndex(prevIndex);
        scrollToProject(prevIndex);
        break;
      case 'ArrowRight':
        e.preventDefault();
        const nextIndex = Math.min(projects.length - 1, activeIndex + 1);
        setActiveIndex(nextIndex);
        scrollToProject(nextIndex);
        break;
      case 'Enter':
        if (e.metaKey || e.ctrlKey) {
          e.preventDefault();
          handleProjectClick(projects[activeIndex], activeIndex);
        }
        break;
    }
  }, [activeIndex, projects, scrollToProject, handleProjectClick]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyNavigation);
    return () => document.removeEventListener('keydown', handleKeyNavigation);
  }, [handleKeyNavigation]);

  const prevProject = () => {
    const newIndex = Math.max(0, activeIndex - 1);
    setActiveIndex(newIndex);
    scrollToProject(newIndex);
  };

  const nextProject = () => {
    const newIndex = Math.min(projects.length - 1, activeIndex + 1);
    setActiveIndex(newIndex);
    scrollToProject(newIndex);
  };

  return (
    <div style={{
      padding: '4rem 0',
      backgroundColor: 'var(--bg-primary)',
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem',
        marginBottom: '2rem',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            margin: 0,
          }}>
            Featured Projects
          </h2>

          <div style={{
            display: 'flex',
            gap: '8px',
          }}>
            <motion.button
              onClick={prevProject}
              disabled={activeIndex === 0}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '1px solid var(--border-default)',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                cursor: activeIndex === 0 ? 'not-allowed' : 'pointer',
                opacity: activeIndex === 0 ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
              }}
              aria-label="Previous project"
            >
              ←
            </motion.button>

            <motion.button
              onClick={nextProject}
              disabled={activeIndex === projects.length - 1}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '1px solid var(--border-default)',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                cursor: activeIndex === projects.length - 1 ? 'not-allowed' : 'pointer',
                opacity: activeIndex === projects.length - 1 ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
              }}
              aria-label="Next project"
            >
              →
            </motion.button>
          </div>
        </div>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '16px',
          margin: 0,
        }}>
          Use arrow keys to navigate • ⌘/Ctrl + Enter to open
        </p>
      </div>

      {/* Carousel */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div
          ref={scrollContainerRef}
          className="project-shifter-scroll"
          onScroll={(e) => {
            const scrollLeft = e.currentTarget.scrollLeft;
            const cardWidth = 344;
            const newIndex = Math.round(scrollLeft / cardWidth);
            if (newIndex !== activeIndex && newIndex >= 0 && newIndex < projects.length) {
              setActiveIndex(newIndex);
            }
          }}
        >
          {projects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={index}
              isActive={index === activeIndex}
              onClick={() => handleProjectClick(project, index)}
              onHover={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* Dots Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        marginTop: '2rem',
      }}>
        {projects.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setActiveIndex(index);
              scrollToProject(index);
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: index === activeIndex ? 'var(--text-accent, #007acc)' : 'var(--border-default)',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
            }}
            aria-label={`Go to project ${index + 1}: ${projects[index].title}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectShifter;