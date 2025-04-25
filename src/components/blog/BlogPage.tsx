// src/pages/blog/index.tsx
import React, { useEffect } from 'react';

import { Helmet } from 'react-helmet-async';
import { Link, useParams, useNavigate } from 'react-router-dom';
import blogPosts from '../../data/blog/blogPosts';
import { useTranslation } from 'react-i18next';
import { Calculator } from 'lucide-react';


const BlogPage: React.FC = () => {
  const { lang } = useParams<{ lang: string }>();
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
  const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

  return (
    <>
      <Helmet>
        <title>Blog | Don’t Smoke Just Invest</title>
        <meta name="description" content="Blog" />
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}></script>
        <script>
          {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `}
        </script>
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
              <Link
                to={`/${i18n.language}/books`}
                className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition"
              >
                Books
              </Link>
            </div>

            <div className="flex gap-2">
              <button onClick={() => switchLanguage('tr')} className="text-sm underline text-gray-600">TR</button>
              <button onClick={() => switchLanguage('en')} className="text-sm underline text-gray-600">EN</button>
            </div>

          </div>
        </header>
        <main className="container mx-auto px-4 py-8 flex-grow-main">


          <h1 className="text-3xl font-bold text-gray-800 mb-6">Blog</h1>

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

export default BlogPage;
