import React, { useEffect, useState } from 'react';
import { Calculator } from 'lucide-react';
import UserInputForm from './components/UserInputForm';
import ResultsDisplay from './components/ResultsDisplay';
import { AppProvider } from './context/AppContext';
import './App.css';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Routes, Route, useParams, useNavigate, Navigate } from 'react-router-dom';
import Landing from './Landing';
import { Link } from 'react-router-dom';
import BlogPostPage from './components/blog/BlogPostPage';
import BlogPage from './components/blog/BlogPage';
import BookPostPage from './components/book/BookPostPage';
import BooksPage from './components/book/BooksPage';
import { SiInstagram} from '@icons-pack/react-simple-icons';

function MainContent() {
  const [showResults, setShowResults] = useState(false);
  const { lang } = useParams();
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
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
        <meta property="og:title" content={t('meta.title')} />
        <meta property="og:description" content={t('meta.description')} />
        <meta property="og:image" content="/og-image.png" />
        <meta name="robots" content="index, follow" />
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
          {!showResults ? (
            <UserInputForm onComplete={() => setShowResults(true)} />
          ) : (
            <ResultsDisplay onReset={() => setShowResults(false)} />
          )}
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
              <a href="https://instagram.com/dontsmokejustinvest_tr" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300">
                <SiInstagram size={24}  />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}


function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<RedirectToLang />} />
        <Route path="/:lang" element={<Landing />} />
        <Route path="/:lang/calculator" element={<MainContent />} />
        <Route path="/:lang/blog" element={<BlogPage />} />
        <Route path="/:lang/blog/:slug" element={<BlogPostPage />} />
        <Route path="/:lang/books" element={<BooksPage />} />
        <Route path="/:lang/books/:slug" element={<BookPostPage />} />


        <Route path="*" element={<div>404 - Not Found</div>} />
      </Routes>
    </AppProvider>
  );
}

const RedirectToLang = () => {
  const browserLang = navigator.language || navigator.languages[0];
  const langCode = browserLang.startsWith('tr') ? 'tr' : 'en';
  return <Navigate to={`/${langCode}`} replace />;
};


export default App;