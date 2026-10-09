import React from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects';
import ProjectDate from '../components/ProjectDate';
import './Projects.css';

const Projects: React.FC = () => (
  <main className="projects-page">
    <h1>Projects</h1>
    <ul className="projects-list">
      {projects.map(project => (
        <li key={project.slug}>
          <div className="projects-entry-heading">
            <h2><Link to={`/projects/${project.slug}`}>{project.name || project.title}</Link></h2>
            <ProjectDate project={project} />
          </div>
          <p>{project.subtitle}</p>
        </li>
      ))}
    </ul>
  </main>
);

export default Projects;
