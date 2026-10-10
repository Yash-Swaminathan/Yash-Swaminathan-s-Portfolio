import React from 'react';
import { Link } from 'react-router-dom';
import { posts } from '../data/posts';
import './Writing.css';

const Writing: React.FC = () => (
  <main className="writing-page">
    <h1>Writing</h1>
    <ul className="writing-list">
      {posts.map(post => (
        <li key={post.slug}>
          <div className="writing-entry-heading">
            <h2><Link to={`/writing/${post.slug}`}>{post.title}</Link></h2>
            <time dateTime={post.date}>{post.dateLabel}</time>
          </div>
          <p>{post.summary}</p>
        </li>
      ))}
    </ul>
  </main>
);

export default Writing;
