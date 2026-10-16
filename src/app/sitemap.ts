import { MetadataRoute } from 'next';
import { DESIGN_TOKENS } from '@/lib/tokens';
import { ARTICLES } from '@/content/articles';

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

  const articleEntries = ARTICLES.flatMap((article) =>
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
