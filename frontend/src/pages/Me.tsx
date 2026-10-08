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

      <section className="home-section" aria-labelledby="home-work-heading">
        <div className="home-section-heading"><div><p className="home-eyebrow">01 / Selected work</p><h2 id="home-work-heading">Ideas, put into practice.</h2></div>
          <Link className="home-text-link" to="/projects">All projects <span aria-hidden="true">↗</span></Link></div>
        <div className="home-project-grid">{selectedProjects.map(project => project && (
          <Link key={project.slug} className="home-project" to={`/projects/${project.slug}`}>
            <div className="home-project-topline"><span>{project.year} / {project.tags.slice(0, 2).join(' + ')}</span><span className="home-project-arrow" aria-hidden="true">↗</span></div>
            <h3>{project.title}</h3>
            <p>{project.subtitle}</p>
            <div className="home-project-stack">{(project.coreStack || project.tech).slice(0, 3).map(technology => <span key={technology}>{technology}</span>)}</div>
          </Link>
        ))}</div>
      </section>

      <section className="home-section home-experience-section" aria-labelledby="home-experience-heading">
        <div className="home-section-heading"><div><p className="home-eyebrow">02 / Experience</p><h2 id="home-experience-heading">Where I've contributed.</h2></div><span className="home-section-note">Open a role for details</span></div>
        <Experience />
      </section>

      <section className="home-contact-section" aria-labelledby="home-contact-heading">
        <div><p className="home-eyebrow">03 / Get in touch</p><h2 id="home-contact-heading">Let's talk.</h2><p>Have an engineering opportunity in mind?<br />I'd love to hear about it.</p></div>
        <a className="home-contact-address" href={`mailto:${profile.email}`}>{profile.email} <span aria-hidden="true">↗</span></a>
      </section>
    </main>
  );
};

export default Me;
