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
          <p className="home-eyebrow">Hi, I'm {profile.firstName}.</p>
          <h1 id="home-heading">{profile.headline}<br />{' '}<span>{profile.headlineEmphasis}</span></h1>
          <p className="home-introduction">{profile.introduction}</p>
          <div className="home-intro-actions">
            <a className="home-contact-button" href={`mailto:${profile.email}`}>Get in touch <span aria-hidden="true">↗</span></a>
            <Link className="home-text-link" to="/projects">Explore my work <span aria-hidden="true">↓</span></Link>
          </div>
        </div>
        <aside className="home-profile" aria-label="Education and engineering interests">
          <div className="home-profile-mark" aria-hidden="true">ys.</div>
          <div><span className="home-meta-label">Studying</span><p>{profile.program}<br />{profile.university}</p><span className="home-term">{profile.term} undergraduate</span></div>
          <div><span className="home-meta-label">Interested in</span><p>Backend systems<br />Infrastructure &amp; reliability<br />APIs &amp; data pipelines</p></div>
        </aside>
      </section>

      <div className="home-story">
        <p>Here are some of the things I've built: {selectedProjects.map(project => project && (
          <React.Fragment key={project.slug}>
            <Link to={`/projects/${project.slug}`}>{project.title}</Link> — {project.subtitle}.{' '}
          </React.Fragment>
        ))}<Link to="/projects">See more of my work</Link>.</p>
        <Experience />
      </div>

      <section className="home-contact-section" aria-labelledby="home-contact-heading">
        <div><p className="home-eyebrow">Get in touch</p><h2 id="home-contact-heading">Let's talk.</h2><p>Have an engineering opportunity in mind?<br />I'd love to hear about it.</p></div>
        <a className="home-contact-address" href={`mailto:${profile.email}`}>{profile.email} <span aria-hidden="true">↗</span></a>
      </section>
    </main>
  );
};

export default Me;
