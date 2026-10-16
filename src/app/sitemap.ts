import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { DESIGN_TOKENS } from '@/lib/tokens';
import { ARTICLES } from '@/content/articles';
import { Article } from '@/content/types';

function getSitemapArticles(): Article[] {
  try {
    const dbPath = path.join(process.cwd(), 'data', 'cms.json');
    if (fs.existsSync(dbPath)) {
      const parsed = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      if (Array.isArray(parsed.articles)) return parsed.articles;
    }
  } catch {
    // Fallback to static articles
  }
  return ARTICLES;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = DESIGN_TOKENS.brand.domain;
  const routes = [
    '',
    '/about',
    '/our-ecosystem',
    '/dam',
    '/dim',
    '/ddmf',
    '/corporate-governance',
    '/wbs',
    '/vdp',
    '/media-center',
    '/investor-relations',
    '/help-center',
  ];

  const staticEntries = routes.flatMap((route) =>
    (['id', 'en', 'zh'] as const).map((locale) => ({
      url: `${base}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1.0 : 0.8,
    }))
  );

  const articles = getSitemapArticles();
  const articleEntries = articles.flatMap((article) =>
    (['id', 'en', 'zh'] as const).map((locale) => {
      const folder = article.category === 'press-release' ? 'press-releases' : 'announcement';
      return {
        url: `${base}/${locale}/media-center/${folder}/${article.slug}`,
        lastModified: new Date(article.date),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      };
    })
  );

  return [...staticEntries, ...articleEntries];
}
