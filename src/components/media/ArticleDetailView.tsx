'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, Share2, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { Article } from '@/content/types';
import { ARTICLES } from '@/content/articles';
import { BLUR_DATA_URL } from '@/content/assets';
import { formatDate } from '@/lib/utils';
import { Locale } from '@/i18n';

export function ArticleDetailView({
  article,
  locale,
}: {
  article: Article;
  locale: Locale;
}) {
  const t = useTranslations('common');
  const [copied, setCopied] = useState(false);

  const related = ARTICLES.filter((a) => a.id !== article.id).slice(0, 3);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article className="bg-brand-dark pt-32 pb-24 text-white">
      <div className="mx-auto max-w-4xl px-6">
        <Link
          href="/media-center"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-brand-red transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t('backToMedia')}</span>
        </Link>

        <div className="mt-6 flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
          <span className="rounded-full bg-brand-red px-3 py-1 text-white">
            {article.category === 'press-release' ? t('pressRelease') : t('announcement')}
          </span>
          <time className="text-zinc-400">{formatDate(article.date, locale)}</time>
        </div>

        <h1 className="mt-5 text-fluid-h1 font-bold text-white">{article.title[locale]}</h1>

        <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10">
          <Image
            src={article.image}
            alt={article.title[locale]}
            fill
            priority
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover"
          />
        </div>

        <div className="mt-12 space-y-6 text-base md:text-lg leading-relaxed text-zinc-300">
          {article.content[locale].map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}

          {article.quote && (
            <blockquote className="my-8 rounded-r-xl border-l-4 border-brand-red bg-brand-charcoal p-6 italic text-white">
              “{article.quote[locale]}”
            </blockquote>
          )}
        </div>

        <div className="mt-12 flex items-center justify-between border-y border-white/10 py-6">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
            {t('share')}
          </span>
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:border-brand-red"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
            <span>{copied ? t('copied') : 'Copy URL'}</span>
          </button>
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-container px-6 sm:px-10 lg:px-16 xl:px-20">
        <h2 className="text-2xl font-bold text-white">{t('relatedArticles')}</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {related.map((rel) => {
            const href =
              rel.category === 'press-release'
                ? `/media-center/press-releases/${rel.slug}`
                : `/media-center/announcement/${rel.slug}`;
            return (
              <Link
                key={rel.id}
                href={href}
                className="group rounded-2xl border border-white/10 bg-brand-charcoal p-6 transition hover:border-brand-red"
              >
                <time className="text-xs text-zinc-400">{formatDate(rel.date, locale)}</time>
                <h3 className="mt-2 font-bold text-white group-hover:text-brand-red transition line-clamp-2">
                  {rel.title[locale]}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>
    </article>
  );
}
