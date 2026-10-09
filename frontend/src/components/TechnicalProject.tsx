import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../data/projects';
import ProjectDate from './ProjectDate';
import { projectFigures } from './ProjectFigures';
import './TechnicalProject.css';

const ProjectText: React.FC<{ content: string }> = ({ content }) => (
  <>
    {content.split('\n\n').map((paragraph, paragraphIndex) => (
      <p key={paragraphIndex}>
        {paragraph.split(/(\[[^\]]+\]\(https:\/\/[^)]+\)|`[^`]+`)/g).map((part, partIndex) => {
          const link = part.match(/^\[([^\]]+)\]\((https:\/\/[^)]+)\)$/);
          if (link) {
            return <a key={partIndex} href={link[2]} target="_blank" rel="noopener noreferrer">{link[1]}</a>;
          }
          return part.startsWith('`') && part.endsWith('`')
            ? <code key={partIndex}>{part.slice(1, -1)}</code>
            : <React.Fragment key={partIndex}>{part}</React.Fragment>;
        })}
      </p>
    ))}
  </>
);

const TechnicalProject: React.FC<{ project: Project }> = ({ project }) => {
  const architecture = project.sections?.find(section => section.heading === 'System Architecture');
  const deepDives = project.sections?.filter(section => section !== architecture) || [];
  const ArchitectureFigure = project.figure ? projectFigures[project.figure] : undefined;

  return (
    <main className="technical-project">
      <Link className="technical-project-back" to="/projects">All projects</Link>
      <header className="technical-project-heading">
        <div><h1>{project.title}</h1><p className="technical-project-subtitle">{project.subtitle}</p></div>
        <ProjectDate project={project} />
      </header>
      <div className="technical-project-overview"><ProjectText content={project.overview || project.description} /></div>
      <nav className="technical-project-links" aria-label="Project resources">
        {project.repoUrl && <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">GitHub</a>}
        {project.setupUrl && <a href={project.setupUrl} target="_blank" rel="noopener noreferrer">Setup guide</a>}
        {project.extensionUrl && <a href={project.extensionUrl} target="_blank" rel="noopener noreferrer">VS Code extension</a>}
        {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">Demo</a>}
      </nav>
      <p className="technical-project-stack">{project.tech.join(' · ')}</p>
      {architecture && (
        <section className="technical-project-architecture" aria-labelledby="architecture-heading">
          <h2 id="architecture-heading">System architecture</h2>
          {ArchitectureFigure && <ArchitectureFigure />}
          <ProjectText content={architecture.content} />
        </section>
      )}
      {deepDives.length > 0 && (
        <section className="technical-project-details" aria-labelledby="technical-details-heading">
          <h2 id="technical-details-heading">Go deeper</h2>
          {deepDives.map(section => {
            const SectionFigure = section.figure ? projectFigures[section.figure] : undefined;
            return (
              <details key={section.heading}>
                <summary>{section.heading}<span aria-hidden="true">+</span></summary>
                <div className="technical-project-detail-content">
                  {SectionFigure && <SectionFigure />}
                  {section.content && <ProjectText content={section.content} />}
                  {section.bullets && (
                    <ul className="technical-project-tradeoffs">
                      {section.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}
                    </ul>
                  )}
                </div>
              </details>
            );
          })}
        </section>
      )}
    </main>
  );
};

export default TechnicalProject;
