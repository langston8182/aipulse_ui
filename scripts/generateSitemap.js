import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { getArticles } from '../src/services/articles.ts';
import { slugify } from '../src/utils/slug.ts';

// Load environment variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_URL = process.env.SITE_URL

async function generateSitemap() {
    try {
        console.log('Generating sitemap...');

        // Fetch all articles
        const articles = await getArticles();

        // Start XML content
        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${SITE_URL}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Categories page -->
  <url>
    <loc>${SITE_URL}/categories</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- About page -->
  <url>
    <loc>${SITE_URL}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;

        // Add article URLs
        for (const article of articles) {
            const slug = `${slugify(article.title)}-${article._id}`;
            const publishDate = new Date(article.publishedAt).toISOString().split('T')[0];

            sitemap += `
  <!-- Article: ${article.title} -->
  <url>
    <loc>${SITE_URL}/article/${slug}</loc>
    <lastmod>${publishDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
        }

        // Extract unique categories and add category pages
        const categories = [...new Set(articles.map(article => article.category))];

        for (const category of categories) {
            sitemap += `
  <!-- Category: ${category} -->
  <url>
    <loc>${SITE_URL}/categories?category=${encodeURIComponent(category)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
        }

        // Close XML
        sitemap += `
</urlset>`;

        // Write to file
        const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
        await fs.writeFile(sitemapPath, sitemap);

        console.log('✅ Sitemap generated successfully at public/sitemap.xml');

    } catch (error) {
        console.error('❌ Error generating sitemap:', error);
    }
}

// Run the function
generateSitemap();