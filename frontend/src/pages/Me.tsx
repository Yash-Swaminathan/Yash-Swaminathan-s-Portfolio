import React from 'react';
import { Link } from 'react-router-dom';
import Experience from '../components/Experience';
import { profile } from '../data/profile';
import './Me.css';

const Me: React.FC = () => {
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
        <p>I've built projects like {profile.selectedProjects.map((project, index) => (
          <React.Fragment key={project.slug}>
            {index > 0 ? index === profile.selectedProjects.length - 1 ? ' and ' : ', ' : ''}
            <Link to={`/projects/${project.slug}`}>{project.name}</Link>
          </React.Fragment>
        ))}.</p>
        <p>I also want to write more about what I'm learning and working on.</p>
        <Experience />
      </div>

    </main>
  );
};

export default Me;
