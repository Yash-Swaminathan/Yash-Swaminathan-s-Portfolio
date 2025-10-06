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
      <div>
        <h2 style={{
          fontSize: '1.2rem',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: '1.5rem'
        }}>
          NOW
        </h2>

        <div style={{
          marginBottom: '2rem'
        }}>
          {experiences.slice(0, 1).map((exp, index) => (
            <div key={index}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                margin: '0 0 0.25rem 0'
              }}>
                {exp.company}
              </h3>
              <p style={{
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                margin: 0
              }}>
                {exp.title}
              </p>
            </div>
          ))}
        </div>

        <h2 style={{
          fontSize: '1.2rem',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: '1.5rem'
        }}>
          PREVIOUS
        </h2>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          {experiences.slice(1).map((exp, index) => (
            <div key={index}>
              <h3 style={{
                fontSize: '0.95rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                margin: '0 0 0.25rem 0'
              }}>
                {exp.company}
              </h3>
              <p style={{
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                margin: 0
              }}>
                {exp.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experience;