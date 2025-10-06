import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Me', pageIndicator: '/me', isHome: true, isExternal: false },
    { path: '/Yash_Swaminathan_Resume.pdf', label: 'Resume', pageIndicator: '/resume', isHome: false, isExternal: true },
    { path: '/projects', label: 'Projects', pageIndicator: '/projects', isHome: false, isExternal: false },
  ];

  const getCurrentPage = () => {
    const currentItem = navItems.find(item => {
      if (item.isHome) {
        return location.pathname === '/';
      }
      return location.pathname === item.path;
    });
    return currentItem ? currentItem.pageIndicator : '/me';
  };

  const isActive = (path: string, isHome: boolean) => {
    if (isHome) {
      return location.pathname === '/';
    }
    return location.pathname === path;
  };

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '60px',
      backgroundColor: 'var(--surface-elevated)',
      borderBottom: '1px solid var(--border)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem'
    }}>
      {/* Left side - Name and current page */}
      <div style={{
        color: '#000000',
        fontSize: '18px',
        fontWeight: '500'
      }}>
        Yash Swaminathan <span style={{ color: '#666666' }}>{getCurrentPage()}</span>
      </div>

      {/* Right side - Navigation links and theme toggle */}
      <nav>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {navItems.map((item) => (
            item.isExternal ? (
              <a
                key={item.path}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#666666',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: '400',
                  transition: 'color 0.2s ease',
                  borderBottom: '2px solid transparent',
                  paddingBottom: '2px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#333333';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#666666';
                }}
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  color: isActive(item.path, item.isHome) ? '#000000' : '#666666',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: '400',
                  transition: 'color 0.2s ease',
                  borderBottom: isActive(item.path, item.isHome) ? '2px solid #000000' : '2px solid transparent',
                  paddingBottom: '2px'
                }}
                onMouseEnter={(e) => {
                  if (!isActive(item.path, item.isHome)) {
                    e.currentTarget.style.color = '#333333';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.path, item.isHome)) {
                    e.currentTarget.style.color = '#666666';
                  }
                }}
              >
                {item.label}
              </Link>
            )
          ))}
          <ThemeToggle slider={true} />
        </div>
      </nav>
    </header>
  );
};

export default Navigation;