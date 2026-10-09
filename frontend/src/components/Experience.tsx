import React from 'react';
import { experiences } from '../data/profile';
import './Experience.css';

interface ExperienceProps {
  className?: string;
}

const Experience: React.FC<ExperienceProps> = ({ className = '' }) => (
  <p className={`experience-prose ${className}`}>
    I've previously worked on software at {experiences.map((experience, index) => (
      <React.Fragment key={experience.company}>
        {index > 0 ? index === experiences.length - 1 ? ', and ' : ', ' : ''}
        <a href={experience.website} target="_blank" rel="noopener noreferrer">{experience.company}</a>
      </React.Fragment>
    ))}, and I'm interested in backend and infrastructure engineering.
  </p>
);

export default Experience;
