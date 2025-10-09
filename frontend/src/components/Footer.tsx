import React from 'react';

const Footer: React.FC = () => {
  const socialLinks = [
    { text: '✉️', href: 'mailto:yswamina@uwaterloo.ca', label: 'Email' },
    { text: '𝕏', href: 'https://twitter.com/yashswaminathan', label: 'Twitter' },
    { text: 'in', href: 'https://linkedin.com/in/yash-swaminathan', label: 'LinkedIn' },
    { text: 'GH', href: 'https://github.com/yash-swaminathan', label: 'GitHub' },
    { text: 'IG', href: 'https://instagram.com/yashswaminathan', label: 'Instagram' }
  ];

  return (
    <footer style={{
      backgroundColor: '#000000',
      color: '#ffffff',
      padding: '1.5rem 2rem',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        alignItems: 'center'
      }}>
        {/* Built With */}
        <div style={{
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            justifyContent: 'center'
          }}>
            {['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Spotify API'].map((tech) => (
              <span
                key={tech}
                style={{
                  backgroundColor: '#1a1a1a',
                  color: '#cccccc',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '12px',
                  border: '1px solid #333333'
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div style={{
          display: 'flex',
          gap: '1.5rem',
          alignItems: 'center'
        }}>
          {socialLinks.map(({ text, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              style={{
                color: '#999999',
                fontSize: '20px',
                transition: 'color 0.2s ease',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#999999'}
            >
              {text}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div style={{
          textAlign: 'center',
          fontSize: '12px',
          color: '#666666'
        }}>
          © {new Date().getFullYear()} Yash Swaminathan
        </div>
      </div>
    </footer>
  );
};

export default Footer;
