import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { profile } from '../data/profile';
import './SiteChrome.css';

const Navigation: React.FC = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
    ...(process.env.NODE_ENV === 'development' && !new URLSearchParams(location.search).has('preview') ? [{ path: '/review', label: 'Review' }] : [])
  ];

  useEffect(() => setMenuOpen(false), [location.pathname]);

  return (
    <header className="site-header">
      <a className="site-skip-link" href="#page-content">Skip to content</a>
      <div className="site-header-inner">
        <Link className="site-brand" to="/" aria-label={`${profile.name}, home`}><span aria-hidden="true">ys.</span>{profile.name}</Link>
        <div className="site-header-controls">
          <nav id="site-navigation" className={`site-navigation ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
            {navItems.map(item => <Link key={item.path} to={item.path} aria-current={item.path === '/' ? location.pathname === '/' ? 'page' : undefined : location.pathname.startsWith(item.path) ? 'page' : undefined}>{item.label}</Link>)}
          </nav>
          <ThemeToggle compact />
          <button className="site-menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="site-navigation" onClick={() => setMenuOpen(previous => !previous)}>{menuOpen ? 'Close' : 'Menu'}</button>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
