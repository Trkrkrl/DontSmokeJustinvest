// src/pages/blog/[slug].tsx şeklinde her bir blog içeriğini görüntülemeyi sağlar
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import blogPosts from '../../data/blog/blogPosts';
import { getBaseUrl } from '../../utils/getBaseUrl';

interface BlogContent {
    title: string;
    summary: string;
    content: string;      // HTML içerik veya MDX içerik (şu anda html)
    coverImage?: string;  // Kapak resmi URL'si
    publishedAt?: string; // Yayın tarihi (örneğin: 2025-04-26)
    tags?: string[];      // SEO için etiketler
  }
  

const BlogPostPage: React.FC = () => {
    const { slug,lang } = useParams<{ slug: string, lang: string }>();
    const [post, setPost] = useState<BlogContent | null>(null);
    const [notFound, setNotFound] = useState(false);
    

   

    useEffect(() => {
        if (!slug) return;

        import(`../../data/blog/posts/${slug}.json`)
            .then((module) => setPost(module.default))
            .catch(
                () => (setNotFound(true), console.log(" - "))
            );
    }, [slug]);

    if (!post) {
        return <div className="text-center p-8">404 - İçerik bulunamadı .</div>;
    }

    if (notFound) {
        return <div className="text-center p-8">404 - İçerik bulunamadı.</div>;
    }

    if (!post) {
        return <div className="text-center p-8">Yükleniyor...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <Helmet>
                <title>{post.title} | Don’t Smoke Just Invest</title>
                <meta name="description" content={post.summary} />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.summary} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={`${getBaseUrl()}/${lang}/blog/${slug}`} />
            </Helmet>

            {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-64 object-cover rounded-md mb-6"
        />
      )}

      <h1 className="text-4xl font-bold text-gray-900 mb-2">{post.title}</h1>

      {post.publishedAt && (
        <p className="text-sm text-gray-500 mb-4">{new Date(post.publishedAt).toLocaleDateString()}</p>
      )}

      {post.tags && (
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs bg-gray-200 px-2 py-1 rounded-full text-gray-700">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <p className="text-gray-700 mb-8 italic">{post.summary}</p>

      <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
};

export default BlogPostPage;