import fs from 'fs';
import path from 'path';
import blogPosts from '../data/blog/blogPosts';
import bookPosts from '../data/books/bookPosts';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const baseUrl = 'https://dont-smoke-justinvest.vercel.app';
const langs = ['tr', 'en'];

const staticPaths = [
  '/',
  '/tr/blog',
  '/en/blog',
  '/tr/books',
  '/en/books',
  '/tr/calculator',
  '/en/calculator'
];

const blogPaths = blogPosts.flatMap(post => langs.map(lang => `/${lang}/blog/${post.slug}`));
const bookPaths = bookPosts.flatMap(post => langs.map(lang => `/${lang}/books/${post.slug}`));

const allPaths = [...staticPaths, ...blogPaths, ...bookPaths];

const getCurrentDate = () => new Date().toISOString().split('T')[0];

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPaths
    .map(
      (url) => `
  <url>
    <loc>${baseUrl}${url}</loc>
    <lastmod>${getCurrentDate()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${url === '/' ? '1.0' : '0.7'}</priority>
  </url>`
    )
    .join('')}
</urlset>
`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const parentDirName=dirname(__dirname);
const grandParentDirName=dirname(parentDirName);


const publicPath = path.join(grandParentDirName, 'sitemap.xml');
fs.writeFileSync(publicPath, sitemapContent.trim());

console.log('✅ Sitemap başarıyla güncellendi!');
