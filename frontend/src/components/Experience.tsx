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
      period: "Aug 2025 → Present"
    },
    {
      title: "Software Developer Intern — Backend & DevOps",
      company: "Turing",
      location: "Calgary, AB",
      period: "Jan 2025 → Apr 2025"
    },
    {
      title: "Data Science Intern",
      company: "Gradiant (Synauta)",
      location: "Calgary, AB",
      period: "Sep 2023 → Jan 2024"
    }
  ];

  const education = {
    school: "University of Waterloo",
    degree: "Systems Design Engineering",
    period: "Present → 2029",
    location: "Waterloo, ON",
    website: "uwaterloo.ca"
  };

  return (
    <div className={className} style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Experience Section */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: '1.5rem'
        }}>
          Experience
        </h2>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {experiences.map((exp, index) => (
            <div key={index} style={{
              paddingBottom: '1rem',
              borderBottom: index < experiences.length - 1 ? '1px solid var(--border-default)' : 'none'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: '0.25rem'
              }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  margin: 0
                }}>
                  {exp.title}
                </h3>
                <span style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)'
                }}>
                  {exp.period}
                </span>
              </div>
              <p style={{
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                margin: 0
              }}>
                {exp.company} · {exp.location}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Education Section */}
      <div>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: '1.5rem'
        }}>
          Education
        </h2>

        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '0.25rem'
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: 0
            }}>
              {education.degree}
            </h3>
            <span style={{
              fontSize: '0.85rem',
              color: 'var(--text-muted)'
            }}>
              {education.period}
            </span>
          </div>
          <p style={{
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
            margin: 0
          }}>
            {education.school}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Experience;