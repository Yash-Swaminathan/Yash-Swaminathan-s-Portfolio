import React from 'react';

interface ExperienceItem {
  title: string;
  company: string;
  location: string;
  period: string;
  description?: string;
  website?: string;
}

interface ExperienceProps {
  className?: string;
}

const Experience: React.FC<ExperienceProps> = ({ className = '' }) => {
  const experiences: ExperienceItem[] = [
    {
      title: "Software Engineering Intern",
      company: "StackAdapt",
      location: "Toronto, ON",
      period: "May 2025 → Present",
      description: "Infra and backend engineering on 1P Backend Integration handling 3M+ requests/sec.",
      website: "https://www.stackadapt.com"
    },
    {
      title: "Software Engineer Intern",
      company: "Micromart",
      location: "Toronto, ON",
      period: "Aug 2025 → Dec 2025",
      description: "DevOps/infra and backend engineering focused on reliability and scalability",
      website: "https://www.micromart.com"
    },
    {
      title: "Software Developer Intern",
      company: "Turing",
      location: "Calgary, AB",
      period: "Jan 2025 → Apr 2025",
      description: "Backend & DevOps focused on building scalable APIs and automation",
      website: "https://theturingcompany.com"
    },
    {
      title: "Data Science Intern",
      company: "Gradiant (Synauta)",
      location: "Calgary, AB",
      period: "Sep 2023 → Jan 2024",
      description: "Data analytics and automation for IoT systems",
      website: "https://www.gradiant.com"
    }
  ];

  const companyLogos: { [key: string]: string } = {
    'StackAdapt': '/logos/stackadapt.jpg',
    'Micromart': '/logos/micromart.jpg',
    'Turing': '/logos/turing.jpg',
    'Gradiant (Synauta)': '/logos/gradiant.jpg'
  };

  return (
    <div className={className} style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Experience Section - Clean Box Container */}
      <div style={{
        backgroundColor: 'var(--surface-elevated)',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        border: '1px solid var(--border)',
        transition: 'all 0.3s ease'
      }}>
        <h2 style={{
          fontSize: '0.9rem',
          fontWeight: '600',
          color: 'var(--text-muted)',
          marginBottom: '1rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          NOW
        </h2>

        <div style={{
          marginBottom: '2rem'
        }}>
          {experiences.slice(0, 1).map((exp, index) => (
            <a
              key={index}
              href={exp.website}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                textDecoration: 'none',
                color: 'inherit',
                padding: '1rem',
                borderRadius: '12px',
                transition: 'all 0.2s ease',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <img
                src={companyLogos[exp.company] || '/logos/default.png'}
                alt={exp.company}
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'contain',
                  flexShrink: 0
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  margin: '0 0 0.25rem 0'
                }}>
                  {exp.company}
                </h3>
                <p style={{
                  fontSize: '0.95rem',
                  color: 'var(--text-secondary)',
                  margin: '0 0 0.25rem 0'
                }}>
                  {exp.title}
                </p>
                {exp.description && (
                  <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    margin: 0,
                    fontStyle: 'italic'
                  }}>
                    {exp.description}
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          backgroundColor: 'var(--border)',
          marginBottom: '2rem'
        }}></div>

        <h2 style={{
          fontSize: '0.9rem',
          fontWeight: '600',
          color: 'var(--text-muted)',
          marginBottom: '1rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          PREVIOUS
        </h2>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          {experiences.slice(1).map((exp, index) => (
            <a
              key={index}
              href={exp.website}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                textDecoration: 'none',
                color: 'inherit',
                padding: '0.75rem',
                borderRadius: '12px',
                transition: 'all 0.2s ease',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <img
                src={companyLogos[exp.company] || '/logos/default.png'}
                alt={exp.company}
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'contain',
                  flexShrink: 0
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div>
                <h3 style={{
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  margin: '0 0 0.15rem 0'
                }}>
                  {exp.company}
                </h3>
                <p style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  margin: '0 0 0.15rem 0'
                }}>
                  {exp.title}
                </p>
                {exp.description && (
                  <p style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    margin: 0,
                    fontStyle: 'italic'
                  }}>
                    {exp.description}
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experience;