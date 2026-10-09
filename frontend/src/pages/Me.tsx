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
        </div>
      </section>

      <div className="home-story">
        <Experience />
        <p><Link to="/projects">See my work</Link></p>
      </div>

    </main>
  );
};

export default Me;
