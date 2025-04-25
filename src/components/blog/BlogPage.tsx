// src/pages/blog/index.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import blogPosts from '../../data/blog/blogPosts';

const BlogPage: React.FC = () => {
  const {  lang } = useParams<{  lang: string }>();

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Blog | Don’t Smoke Just Invest</title>
        <meta name="description" content="test test" />
      </Helmet>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">test test</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            to={`/${lang}/blog/${post.slug}`}
            className="block bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h2>
            <p className="text-gray-600 text-sm">{post.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
