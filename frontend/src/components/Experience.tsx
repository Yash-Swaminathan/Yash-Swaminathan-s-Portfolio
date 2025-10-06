import React from 'react';

interface ExperienceItem {
  title: string;
  company: string;
  location: string;
  period: string;
  website?: string;
}

interface ExperienceProps {
  className?: string;
}

const Experience: React.FC<ExperienceProps> = ({ className = '' }) => {
  const experiences: ExperienceItem[] = [
    {
      title: "Software Engineer Intern — Backend & DevOps",
      company: "Micromart",
      location: "Toronto, ON",
      period: "Aug 2025 → Present",
      website: "https://www.micromart.com"
    },
    {
      title: "Software Developer Intern — Backend & DevOps",
      company: "Turing",
      location: "Calgary, AB",
      period: "Jan 2025 → Apr 2025",
      website: "https://theturingcompany.com"
    },
    {
      title: "Data Science Intern",
      company: "Gradiant (Synauta)",
      location: "Calgary, AB",
      period: "Sep 2023 → Jan 2024",
      website: "https://www.gradiant.com"
    }
  ];

  const education = {
    school: "University of Waterloo",
    degree: "Systems Design Engineering",
    period: "Present → 2029",
    location: "Waterloo, ON",
    website: "uwaterloo.ca"
  };

  const companyLogos: { [key: string]: string } = {
    'Micromart': '/logos/micromart.jpg',
    'Turing': '/logos/turing.jpg',
    'Gradiant (Synauta)': '/logos/gradiant.jpg'
  };

  return (
    <div className={className} style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Experience Section */}
      <div>
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
          marginBottom: '3rem'
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
                color: 'inherit'
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
                  margin: 0
                }}>
                  {exp.title}
                </p>
              </div>
            </a>
          ))}
        </div>

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
          gap: '1.25rem'
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
                color: 'inherit'
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
                  margin: 0
                }}>
                  {exp.title}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experience;