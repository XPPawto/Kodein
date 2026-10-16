import React from 'react';
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { ARTICLES } from '@/content/articles';
import { ArticleDetailView } from '@/components/media/ArticleDetailView';
import { Article } from '@/content/types';
import { Locale } from '@/i18n';

export const dynamic = 'force-dynamic';

function getArticles(): Article[] {
  try {
    const dbPath = path.join(process.cwd(), 'data', 'cms.json');
    if (fs.existsSync(dbPath)) {
      const parsed = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      if (Array.isArray(parsed.articles)) return parsed.articles;
    }
  } catch {
    // Fallback
  }
  return ARTICLES;
}

export default function PressReleaseDetailPage({
  params: { locale, slug },
}: {
  params: { locale: Locale; slug: string };
}) {
  const articles = getArticles();
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  return <ArticleDetailView article={article} locale={locale} />;
}
