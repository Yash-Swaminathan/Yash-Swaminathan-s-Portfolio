import React from 'react';
import { profile } from '../data/profile';
import './SiteChrome.css';

const Footer: React.FC = () => (
  <footer className="site-footer">
    <div className="site-footer-inner">
      <nav aria-label="Contact and profile links">
        <a href={profile.chatterbox} target="_blank" rel="noopener noreferrer">Message me on ChatterBox</a>
        <a href={`mailto:${profile.email}`}>Email</a>
        <a href={profile.x} target="_blank" rel="noopener noreferrer">X</a>
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href={profile.resume} target="_blank" rel="noopener noreferrer">Resume</a>
      </nav>
    </div>
  </footer>
);

export default Footer;
