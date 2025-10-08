import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{
      backgroundColor: '#000000',
      color: '#ffffff',
      padding: '3rem 2rem',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        {/* Witty Comment */}
        <div style={{
          textAlign: 'center',
          fontSize: '16px',
          color: '#cccccc',
          fontStyle: 'italic',
          paddingBottom: '1rem',
          borderBottom: '1px solid #333333'
        }}>
          Since you scrolled down here, maybe you'd like to hear more from me?
          <br />
          <a
            href="mailto:yswamina@uwaterloo.ca"
            style={{
              color: '#ffffff',
              textDecoration: 'underline',
              fontWeight: '500',
              marginTop: '0.5rem',
              display: 'inline-block'
            }}
          >
            yswamina@uwaterloo.ca
          </a>
        </div>

        {/* Main Footer Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem'
        }}>
          {/* Made By */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '0.75rem',
              color: '#ffffff'
            }}>
              Made by Yash Swaminathan
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#999999',
              lineHeight: '1.6'
            }}>
              Systems Design Engineering @ University of Waterloo
              <br />
              Software Engineer passionate about building scalable systems
            </p>
          </div>

          {/* Built With */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '0.75rem',
              color: '#ffffff'
            }}>
              Built With
            </h3>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              {['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Docker', 'Leaflet', 'Spotify API'].map((tech) => (
                <span
                  key={tech}
                  style={{
                    backgroundColor: '#1a1a1a',
                    color: '#cccccc',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '13px',
                    border: '1px solid #333333'
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div style={{
          textAlign: 'center',
          paddingTop: '1.5rem',
          borderTop: '1px solid #333333',
          fontSize: '13px',
          color: '#666666'
        }}>
          © {new Date().getFullYear()} Yash Swaminathan. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
