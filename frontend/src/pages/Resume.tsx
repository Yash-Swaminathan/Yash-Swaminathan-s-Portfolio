import React from 'react';

const Resume: React.FC = () => {
  const handleDownload = () => {
    // Replace with your actual resume URL
    const resumeUrl = 'https://your-resume-link.com/resume.pdf';
    window.open(resumeUrl, '_blank');
  };

  const handleView = () => {
    // Replace with your actual resume URL or Google Drive viewer link
    const resumeUrl = 'https://your-resume-link.com/resume.pdf';
    window.open(resumeUrl, '_blank');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)',
      paddingTop: '60px' // Account for header
    }}>
      <div style={{ padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>

          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '3rem',
            borderRadius: '8px',
            boxShadow: 'var(--shadow-md)'
          }}>
            <h1 style={{
              fontSize: '2rem',
              marginBottom: '2rem',
              color: 'var(--text-primary)',
              fontWeight: '600'
            }}>
              Resume
            </h1>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={handleView}
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                View Resume
              </button>
              <button
                onClick={handleDownload}
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--text-primary)',
                  border: '2px solid var(--text-primary)',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;