// src/pages/kitaplar/[slug].tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getBaseUrl } from '../../utils/getBaseUrl';
import { Calculator } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface BookContent {
    slug:string;
    title: string;
    summary: string;
    author:string;
    description: string;
    coverImage: string;
    hepsiburadaUrl: string;
    tags?: string[];
}

const BookPostPage: React.FC = () => {
    const { slug, lang } = useParams<{ slug: string, lang: string }>();

    const [book, setBook] = useState<BookContent | null>(null);
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

        import(`../../data/books/posts/${slug}.json`)
            .then((module) => setBook(module.default))
            .catch(() => setNotFound(true));
    }, [slug]);

    if (notFound) {
        return <div className="text-center p-8">404 - Kitap bulunamadı.</div>;
    }

    if (!book) {
        return <div className="text-center p-8">Yükleniyor...</div>;
    }

    const pageUrl = `${getBaseUrl()}/${lang}/books/${slug}`;

    return (
        <>
            
                <Helmet>
                    <title>{book.title} | Kitap Tavsiyesi</title>
                    <meta name="description" content={book.summary} />
                    <meta property="og:title" content={book.title} />
                    <meta property="og:description" content={book.summary} />
                    <meta property="og:type" content="book" />
                    <meta property="og:image" content={book.coverImage} />
                    <meta property="og:url" content={pageUrl} />
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
                                    {t('header.blog')}
                                </Link>
                                <Link
                                    to={`/${i18n.language}/books`}
                                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition"
                                >
                                    {t('header.books')}
                                </Link>
                            </div>

                            <div className="flex gap-2">
                                <button onClick={() => switchLanguage('tr')} className="text-sm underline text-gray-600">TR</button>
                                <button onClick={() => switchLanguage('en')} className="text-sm underline text-gray-600">EN</button>
                            </div>

                        </div>
                    </header>
                    <main className="container mx-auto px-4 py-8 flex-grow-main max-w-3xl">
                        <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-auto max-h-[500px] object-contain rounded shadow"
                        />

                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
                        <p className="text-gray-600 italic mb-4">{book.summary}</p>

                        {book.tags && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {book.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div
                            className="prose max-w-none mb-6"
                            dangerouslySetInnerHTML={{ __html: book.description }}
                        />

                        <a
                            href={book.hepsiburadaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition"
                        >
                            Hepsiburada'dan Satın Al
                        </a>

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

export default BookPostPage;
