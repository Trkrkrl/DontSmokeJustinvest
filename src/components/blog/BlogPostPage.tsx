// src/pages/blog/[slug].tsx şeklinde her bir blog içeriğini görüntülemeyi sağlar
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import blogPosts from '../../data/blog/blogPosts';
import { getBaseUrl } from '../../utils/getBaseUrl';
import { Calculator } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface BlogContent {
    title: string;
    summary: string;
    content: string;      // HTML içerik veya MDX içerik (şu anda html)
    coverImage?: string;  // Kapak resmi URL'si
    publishedAt?: string; // Yayın tarihi (örneğin: 2025-04-26)
    tags?: string[];      // SEO için etiketler
    keywords?: string[]; // 🔑 SEO için eklenen alan
    author?: string;     // (isteğe bağlı) yazarı belirt
}


const BlogPostPage: React.FC = () => {
    const { slug, lang } = useParams<{ slug: string, lang: string }>();
    const [post, setPost] = useState<BlogContent | null>(null);
    const [notFound, setNotFound] = useState(false);
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        if (lang && lang !== i18n.language) {
            i18n.changeLanguage(lang);
        }
    }, [lang, i18n]);

    const switchLanguage = (targetLang: string) => {
        const pathParts = window.location.pathname.split('/');
        if (pathParts.length > 1) {
            pathParts[1] = targetLang; // sadece lang parametresini değiştir
            const newPath = pathParts.join('/');
            navigate(newPath);
        }
    };
    const handleHeaderClick = () => {
        navigate(`/${lang}`);
    };


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
//TODO: Buraya redirect to 404 page eklenecek ki, 404 sayfasında footer ve header de olsun
    if (!post) {
        return <div className="text-center p-8">Yükleniyor...</div>;
    }
    const pageUrl = `${getBaseUrl()}/${lang}/blog/${slug}`;

    return (
        <>
            <Helmet>
                <title>{post.title} | Don’t Smoke Just Invest</title>
                <meta name="description" content={post.summary} />
                <meta name="keywords" content={post.keywords?.join(', ')} />
                <meta name="author" content={post.author || 'Don’t Smoke Just Invest'} />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.summary} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={pageUrl} />
                {post.coverImage && <meta property="og:image" content={post.coverImage} />}
                <link rel="canonical" href={pageUrl} />
            </Helmet>
            <div className="full-height-layout bg-gradient-to-br from-gray-50 to-gray-100">
                <header className="bg-white shadow-sm">
                    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div
                                onClick={handleHeaderClick}
                                className="flex items-center cursor-pointer hover:opacity-80 transition"
                            >
                                <Calculator className="h-8 w-8 text-green-600 mr-3" />
                                <h1 className="text-2xl font-bold text-gray-800">{t('header.title')}</h1>
                            </div>
                            <Link
                                to={`/${i18n.language}/blog`}
                                className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition"
                            >
                                Blog
                            </Link>
                        </div>

                        <div className="flex gap-2">
                            <button onClick={() => switchLanguage('tr')} className="text-sm underline text-gray-600">TR</button>
                            <button onClick={() => switchLanguage('en')} className="text-sm underline text-gray-600">EN</button>
                        </div>

                    </div>
                </header>
                <main className="container mx-auto px-4 py-8 flex-grow-main max-w-3xl">
                    {post.coverImage && (
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-64 object-cover rounded-md mb-6"
                        />
                    )}

                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{post.title}</h1>

                    {post.publishedAt && (
                        <p className="text-sm text-gray-500 mb-4">
                            {new Date(post.publishedAt).toLocaleDateString('tr-TR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                    )}

                    {post.tags && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {post.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="text-xs bg-gray-200 px-2 py-1 rounded-full text-gray-700"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <p className="text-gray-700 mb-8 italic">{post.summary}</p>

                    <div
                        className="prose prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                </main>
                <footer className="bg-gray-800 text-white py-6">
                    <div className="container mx-auto px-4 text-center">
                        <p className="text-sm font-semibold">{t('footer.copyright')}</p>
                        <p className="text-xs mt-2 text-gray-400">{t('footer.disclaimer')}</p>
                        <p className="text-xs mt-4 text-gray-300">{t('footer.support')}</p>

                        <div className="mt-3 flex justify-center space-x-4">
                            <a href="https://github.com/sponsors/Trkrkrl" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:text-blue-300 underline">
                                {t('footer.github')}
                            </a>
                            <a href="https://patreon.com/TheKarapetti" target="_blank" rel="noopener noreferrer" className="text-sm text-yellow-400 hover:text-yellow-300 underline">
                                {t('footer.patreon')}
                            </a>
                        </div>
                    </div>
                </footer>
            </div>

        </>
    );
};

export default BlogPostPage;