import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProjectBySlug } from '../data/projects';
import { useWindowSize } from '../hooks/useWindowSize';

// Helper function to parse inline markdown (bold, inline code, links)
const parseMarkdown = (text: string): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  let currentIndex = 0;
  let keyCounter = 0;

  // Regex patterns for inline markdown
  const patterns = [
    { regex: /\*\*(.+?)\*\*/g, type: 'bold' },      // **bold**
    { regex: /`(.+?)`/g, type: 'code' },            // `inline code`
    { regex: /\[(.+?)\]\((.+?)\)/g, type: 'link' }, // [text](url)
  ];

  // Find all matches and their positions
  const matches: Array<{ start: number; end: number; type: string; content: string; url?: string }> = [];

  patterns.forEach(({ regex, type }) => {
    const re = new RegExp(regex);
    let match;
    while ((match = re.exec(text)) !== null) {
      if (type === 'link') {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          type,
          content: match[1],
          url: match[2]
        });
      } else {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          type,
          content: match[1]
        });
      }
    }
  });

  // Sort matches by position
  matches.sort((a, b) => a.start - b.start);

  // Process text with matches
  matches.forEach((match) => {
    // Add text before the match
    if (match.start > currentIndex) {
      parts.push(text.slice(currentIndex, match.start));
    }

    // Add the formatted content
    switch (match.type) {
      case 'bold':
        parts.push(
          <strong key={`bold-${keyCounter++}`} style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
            {match.content}
          </strong>
        );
        break;
      case 'code':
        parts.push(
          <code
            key={`code-${keyCounter++}`}
            style={{
              backgroundColor: 'var(--bg-secondary)',
              padding: '0.15rem 0.4rem',
              borderRadius: '4px',
              fontSize: '0.9em',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              border: '1px solid var(--border-default)',
            }}
          >
            {match.content}
          </code>
        );
        break;
      case 'link':
        parts.push(
          <a
            key={`link-${keyCounter++}`}
            href={match.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--text-primary)',
              textDecoration: 'underline',
            }}
          >
            {match.content}
          </a>
        );
        break;
    }

    currentIndex = match.end;
  });

  // Add remaining text
  if (currentIndex < text.length) {
    parts.push(text.slice(currentIndex));
  }

  return parts.length > 0 ? parts : [text];
};

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

        {/* Optional system / architecture diagram */}
        {project.diagram && (
          <motion.div
            variants={itemVariants}
            style={{
              marginBottom: '2.5rem',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid var(--border-default)',
              backgroundColor: 'var(--bg-secondary)',
            }}
          >
            <img
              src={project.diagram}
              alt={`${project.title} system architecture diagram`}
              style={{
                display: 'block',
                width: '100%',
                height: 'auto',
              }}
            />
          </motion.div>
        )}

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
              {project.overview.split('\n').map((line, lineIdx) => (
                <React.Fragment key={lineIdx}>
                  {parseMarkdown(line)}
                  {lineIdx < project.overview!.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
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
            {(() => {
              const content = section.content || '';
              const codeFenceRegex = /```(\w+)?\n([\s\S]*?)```/g;
              const segments: Array<{ type: 'text' | 'code'; lang?: string; value: string }> = [];
              let lastIndex = 0;
              let match: RegExpExecArray | null;
              while ((match = codeFenceRegex.exec(content)) !== null) {
                const [full, lang, code] = match;
                const start = match.index;
                if (start > lastIndex) {
                  segments.push({ type: 'text', value: content.slice(lastIndex, start) });
                }
                segments.push({ type: 'code', lang: (lang || '').toLowerCase(), value: code.trim() });
                lastIndex = start + full.length;
              }
              if (lastIndex < content.length) {
                segments.push({ type: 'text', value: content.slice(lastIndex) });
              }

              return (
                <div>
                  {segments.map((seg, i) => {
                    if (seg.type === 'code') {
                      return (
                        <pre
                          key={i}
                          style={{
                            backgroundColor: 'var(--bg-secondary)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-default)',
                            borderRadius: '8px',
                            padding: '0.875rem 1rem',
                            overflowX: 'auto',
                            fontSize: '0.95rem',
                            lineHeight: 1.6,
                            margin: '1rem 0'
                          }}
                        >
                          <code style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}>
                            {seg.value}
                          </code>
                        </pre>
                      );
                    }
                    return (
                      <div
                        key={i}
                        style={{
                          fontSize: '1.0625rem',
                          color: 'var(--text-secondary)',
                          lineHeight: '1.75',
                          whiteSpace: 'pre-line',
                          fontWeight: '400',
                        }}
                      >
                        {seg.value.split('\n').map((line, lineIdx) => (
                          <React.Fragment key={lineIdx}>
                            {parseMarkdown(line)}
                            {lineIdx < seg.value.split('\n').length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
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
