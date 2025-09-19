import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

// Helper function to get initial theme
const getInitialTheme = (): Theme => {
  // Check localStorage first (check raw value before casting)
  const savedThemeRaw = localStorage.getItem('theme');

  // Force reset any invalid themes (like 'hc') to light
  if (!savedThemeRaw || !['light', 'dark'].includes(savedThemeRaw)) {
    localStorage.setItem('theme', 'light');
    return 'light';
  }

  const savedTheme = savedThemeRaw as Theme;
  if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
    return savedTheme;
  }

  // Check system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
};

// Helper function to set theme on document
const applyTheme = (theme: Theme) => {
  // Force remove any old theme attributes
  document.documentElement.removeAttribute('data-theme');

  // Set new theme
  document.documentElement.setAttribute('data-theme', theme);

  // Set cookie for SSR (if needed in future)
  document.cookie = `theme=${theme};path=/;max-age=31536000;SameSite=Lax`;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Force cleanup on initialization - clear any invalid themes
    const rawTheme = localStorage.getItem('theme');
    if (rawTheme && !['light', 'dark'].includes(rawTheme)) {
      localStorage.removeItem('theme');
      localStorage.setItem('theme', 'light');
    }

    // Remove any invalid data-theme attributes
    const currentDataTheme = document.documentElement.getAttribute('data-theme');
    if (currentDataTheme && !['light', 'dark'].includes(currentDataTheme)) {
      document.documentElement.removeAttribute('data-theme');
    }

    return getInitialTheme();
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    const themeOrder: Theme[] = ['light', 'dark'];
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };

  // Apply theme on mount and listen for system changes
  useEffect(() => {
    applyTheme(theme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't manually set a preference
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;