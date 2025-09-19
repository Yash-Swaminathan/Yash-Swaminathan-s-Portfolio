import React from 'react';
import { useTheme, Theme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  compact?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', compact = false }) => {
  const { theme, setTheme, toggleTheme } = useTheme();

  const themeConfig = {
    light: {
      icon: '☀️',
      label: 'Light',
      ariaLabel: 'Switch to light theme'
    },
    dark: {
      icon: '🌙',
      label: 'Dark',
      ariaLabel: 'Switch to dark theme'
    }
  };

  if (compact) {
    return (
      <button
        onClick={toggleTheme}
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          color: 'var(--text)',
          fontSize: '18px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          outline: 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
          e.currentTarget.style.color = 'var(--primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--surface)';
          e.currentTarget.style.color = 'var(--text)';
        }}
        onFocus={(e) => {
          e.currentTarget.style.outline = '2px solid var(--ring)';
          e.currentTarget.style.outlineOffset = '2px';
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = 'none';
        }}
        aria-label={`Current theme: ${theme}. Click to cycle themes.`}
        title={`Current: ${themeConfig[theme].label}. Click to cycle.`}
      >
        <span role="img" aria-hidden="true">
          {themeConfig[theme].icon}
        </span>
      </button>
    );
  }

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '4px'
      }}
    >
      {(Object.keys(themeConfig) as Theme[]).map((themeOption) => (
        <button
          key={themeOption}
          onClick={() => setTheme(themeOption)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            outline: 'none',
            cursor: 'pointer',
            border: 'none',
            backgroundColor: theme === themeOption ? 'var(--primary)' : 'transparent',
            color: theme === themeOption ? 'white' : 'var(--text-muted)',
            boxShadow: theme === themeOption ? 'var(--shadow-sm)' : 'none'
          }}
          onMouseEnter={(e) => {
            if (theme !== themeOption) {
              e.currentTarget.style.color = 'var(--text)';
              e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
            }
          }}
          onMouseLeave={(e) => {
            if (theme !== themeOption) {
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = '2px solid var(--ring)';
            e.currentTarget.style.outlineOffset = '2px';
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = 'none';
          }}
          aria-label={themeConfig[themeOption].ariaLabel}
          aria-pressed={theme === themeOption}
        >
          <span style={{ fontSize: '16px' }} role="img" aria-hidden="true">
            {themeConfig[themeOption].icon}
          </span>
          <span>{themeConfig[themeOption].label}</span>
        </button>
      ))}
    </div>
  );
};

export default ThemeToggle;