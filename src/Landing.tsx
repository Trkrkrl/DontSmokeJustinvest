import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';


const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useParams();
  const { t, i18n } = useTranslation();


  const handleCalculateClick = () => {
    navigate(`/${lang}/calculator`);
  };
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


  return (
    <>
      <Helmet>
        <title>{t('landing.meta.title')}</title>
        <meta name="description" content={t('landing.meta.description')} />
        <meta property="og:title" content={t('landing.meta.title')} />
        <meta property="og:description" content={t('landing.meta.description')} />
        <meta property="og:image" content="/og-image.png" />
      </Helmet>

      <div className="full-height-layout bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center cursor-pointer hover:opacity-80 transition">
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

        {/* Main */}
        <main className="flex-grow-main flex flex-col items-center justify-center px-4 py-16 text-center">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
              {t('landing.headline')}
            </h2>
            <p className="text-md md:text-lg text-gray-600 mb-8">
              {t('landing.subtext')}
            </p>
            <button
              onClick={handleCalculateClick}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 transition duration-300"
            >
              {t('landing.cta')}
            </button>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-6">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm font-semibold">{t('footer.copyright')}</p>
            <p className="text-xs mt-2 text-gray-400">{t('footer.disclaimer')}</p>
            <p className="text-xs mt-4 text-gray-300">{t('footer.support')}</p>

            <div className="mt-3 flex justify-center space-x-4">
              <a
                href="https://github.com/sponsors/Trkrkrl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:text-blue-300 underline"
              >
                {t('footer.github')}
              </a>
              <a
                href="https://patreon.com/TheKarapetti"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-yellow-400 hover:text-yellow-300 underline"
              >
                {t('footer.patreon')}
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Landing;
