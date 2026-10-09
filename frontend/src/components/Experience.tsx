import React from 'react';
import { experiences } from '../data/profile';
import './Experience.css';

interface ExperienceProps {
  className?: string;
}

const Experience: React.FC<ExperienceProps> = ({ className = '' }) => (
  <p className={`experience-prose ${className}`}>
    I've worked {experiences.map((experience, index) => (
      <React.Fragment key={experience.company}>
        {index > 0 ? index === experiences.length - 1 ? ', and ' : ', ' : ''}
        at <a href={experience.website} target="_blank" rel="noopener noreferrer">{experience.company}</a> as a {experience.title.toLowerCase()} ({experience.period})
      </React.Fragment>
    ))}.
  </p>
);

export default Experience;
