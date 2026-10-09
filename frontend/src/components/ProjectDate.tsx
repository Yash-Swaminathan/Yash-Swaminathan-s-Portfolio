import React from 'react';
import { Project } from '../data/projects';

const ProjectDate: React.FC<{ project: Project }> = ({ project }) => {
  const dateTime = project.month ? `${project.year}-${String(project.month).padStart(2, '0')}` : String(project.year);
  const label = project.month
    ? new Date(Date.UTC(project.year, project.month - 1)).toLocaleDateString('en', { month: 'short', year: 'numeric', timeZone: 'UTC' })
    : String(project.year);

  return <time dateTime={dateTime} title="Earliest commit on GitHub">{label}</time>;
};

export default ProjectDate;
