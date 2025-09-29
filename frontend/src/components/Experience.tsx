import React from 'react';

interface ExperienceItem {
  title: string;
  company: string;
  location: string;
  period: string;
  website?: string;
  highlights: string[];
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
      highlights: [
        "Optimized application availability by managing REST APIs in TypeScript, improving uptime from 99.94% → 99.993%",
        "Integrated New Relic observability tools for middleware, saving 40+ engineering hours per quarter ($8,000+ annually)"
      ]
    },
    {
      title: "Software Developer Intern — Backend & DevOps",
      company: "Turing",
      location: "Calgary, AB",
      period: "Jan 2025 → Apr 2025",
      highlights: [
        "Designed and implemented Alembic Migration scripts for PostgreSQL test databases, reducing manual setup time by 200+ hours",
        "Developed and approved 10+ RESTful API endpoints (FastAPI) and authored 60+ unit tests to achieve 95% coverage",
        "Contributed to scaling a full-stack web app to support 5000+ users"
      ]
    },
    {
      title: "Data Science Intern",
      company: "Gradiant (Synauta)",
      location: "Calgary, AB",
      period: "Sep 2023 → Jan 2024",
      highlights: [
        "Developed a Python-based analytics pipeline to process IoT sensor data, boosting system efficiency by 15–20%",
        "Designed and deployed a Dockerized Python pipeline automating cartridge filter substitutions, eliminating 90% of manual processes"
      ]
    }
  ];

  const education = {
    school: "University of Waterloo",
    degree: "Systems Design Engineering",
    period: "Present → 2029",
    location: "Waterloo, ON",
    website: "uwaterloo.ca",
    achievements: [
      "President's Scholarship of Distinction"
    ]
  };

  return (
    <div className={className} style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '3rem 2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: '20px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      border: '1px solid var(--border-default)'
    }}>

      {/* Experience Section */}
      <div style={{ marginBottom: '4rem' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '600',
          color: '#D2691E',
          marginBottom: '2rem',
          borderBottom: 'none',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
        }}>
          Experience
        </h2>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2.5rem'
        }}>
          {experiences.map((exp, index) => (
            <div key={index} style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr',
              gap: '3rem',
              alignItems: 'start',
              paddingBottom: index < experiences.length - 1 ? '2rem' : '0',
              borderBottom: index < experiences.length - 1 ? '1px solid var(--border-default)' : 'none'
            }}>
              {/* Company Info */}
              <div>
                <h3 style={{
                  fontSize: '1.15rem',
                  fontWeight: '600',
                  color: '#4A90E2',
                  marginBottom: '0.5rem',
                  lineHeight: '1.3'
                }}>
                  {exp.company}
                </h3>
                <p style={{
                  fontSize: '0.9rem',
                  color: 'var(--text-muted)',
                  margin: '0',
                  fontStyle: 'italic'
                }}>
                  {exp.location}
                </p>
              </div>

              {/* Position Info */}
              <div>
                <h4 style={{
                  fontSize: '1.15rem',
                  fontWeight: '600',
                  color: '#4A90E2',
                  marginBottom: '0.5rem',
                  lineHeight: '1.3'
                }}>
                  {exp.title}
                </h4>
                <p style={{
                  fontSize: '0.95rem',
                  color: 'var(--text-muted)',
                  marginBottom: '1rem'
                }}>
                  {exp.period}
                </p>
                <ul style={{
                  listStyle: 'none',
                  padding: '0',
                  margin: '0'
                }}>
                  {exp.highlights.slice(0, 2).map((highlight, idx) => (
                    <li key={idx} style={{
                      fontSize: '0.95rem',
                      color: 'var(--text)',
                      marginBottom: '0.75rem',
                      paddingLeft: '1.2rem',
                      position: 'relative',
                      lineHeight: '1.5'
                    }}>
                      <span style={{
                        position: 'absolute',
                        left: '0',
                        color: '#4A90E2',
                        fontWeight: 'bold',
                        fontSize: '1.2rem'
                      }}>•</span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education Section */}
      <div>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '600',
          color: '#D2691E',
          marginBottom: '2rem',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
        }}>
          Education
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '3rem',
          alignItems: 'start'
        }}>
          {/* School Info */}
          <div>
            <h3 style={{
              fontSize: '1.15rem',
              fontWeight: '600',
              color: '#4A90E2',
              marginBottom: '0.5rem',
              lineHeight: '1.3'
            }}>
              {education.school}
            </h3>
            <p style={{
              fontSize: '0.9rem',
              color: 'var(--text-muted)',
              margin: '0',
              fontStyle: 'italic'
            }}>
              {education.website}
            </p>
          </div>

          {/* Degree Info */}
          <div>
            <h4 style={{
              fontSize: '1.15rem',
              fontWeight: '600',
              color: '#4A90E2',
              marginBottom: '0.5rem',
              lineHeight: '1.3'
            }}>
              {education.degree}
            </h4>
            <p style={{
              fontSize: '0.95rem',
              color: 'var(--text-muted)',
              marginBottom: '1rem'
            }}>
              {education.period}
            </p>
            <ul style={{
              listStyle: 'none',
              padding: '0',
              margin: '0'
            }}>
              {education.achievements.map((achievement, idx) => (
                <li key={idx} style={{
                  fontSize: '0.95rem',
                  color: 'var(--text)',
                  marginBottom: '0.75rem',
                  paddingLeft: '1.2rem',
                  position: 'relative',
                  lineHeight: '1.5'
                }}>
                  <span style={{
                    position: 'absolute',
                    left: '0',
                    color: '#4A90E2',
                    fontWeight: 'bold',
                    fontSize: '1.2rem'
                  }}>•</span>
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;