import React from 'react';
import { experiences } from '../data/profile';
import './Experience.css';

interface ExperienceProps {
  className?: string;
}

const Experience: React.FC<ExperienceProps> = ({ className = '' }) => (
  <div className={`experience-list ${className}`}>
    {experiences.map(experience => (
      <details className="experience-role" key={experience.company}>
        <summary>
          <span className="experience-company">{experience.company}</span>
          <span className="experience-title">{experience.title}</span>
          <span className="experience-period">{experience.period}</span>
          <span className="experience-expand" aria-hidden="true">+</span>
        </summary>
        <div className="experience-description"><p>{experience.description}</p>
          <a href={experience.website} target="_blank" rel="noopener noreferrer">Company website <span aria-hidden="true">↗</span></a></div>
      </details>
    ))}
  </div>
);

export default Experience;
