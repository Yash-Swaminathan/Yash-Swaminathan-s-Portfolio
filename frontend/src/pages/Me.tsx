import React from 'react';
import { Link } from 'react-router-dom';
import Experience from '../components/Experience';
import { profile } from '../data/profile';
import { getProjectBySlug } from '../data/projects';
import './Me.css';

const Me: React.FC = () => {
  const selectedProjects = profile.selectedProjectSlugs.map(getProjectBySlug);

  return (
    <main className="home-page">
      <section className="home-intro" aria-labelledby="home-heading">
        <div className="home-intro-copy">
          <h1 id="home-heading">Hi, I'm {profile.firstName}.</h1>
          <p className="home-introduction">I'm a {profile.term} {profile.program} student at the {profile.university}. {profile.introduction}</p>
          <div className="home-intro-actions">
            <a className="home-contact-button" href={`mailto:${profile.email}`}>Get in touch <span aria-hidden="true">↗</span></a>
            <Link className="home-text-link" to="/projects">Explore my work <span aria-hidden="true">↓</span></Link>
          </div>
        </div>
      </section>

      <div className="home-story">
        <p>Here are some of the things I've built: {selectedProjects.map(project => project && (
          <React.Fragment key={project.slug}>
            <Link to={`/projects/${project.slug}`}>{project.title}</Link> — {project.subtitle}.{' '}
          </React.Fragment>
        ))}<Link to="/projects">See more of my work</Link>.</p>
        <Experience />
      </div>

    </main>
  );
};

export default Me;
