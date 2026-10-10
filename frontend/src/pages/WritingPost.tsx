import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { posts } from '../data/posts';
import './Writing.css';

const WritingPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find(entry => entry.slug === slug);

  if (!post) {
    return <Navigate to="/writing" replace />;
  }

  return (
    <main className="writing-post">
      <Link className="writing-post-back" to="/writing">All writing</Link>
      <header className="writing-post-heading">
        <h1>{post.title}</h1>
        <time dateTime={post.date}>{post.dateLabel}</time>
      </header>
      <post.Body />
    </main>
  );
};

export default WritingPost;
