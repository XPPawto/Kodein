'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { Search, ArrowUpRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { BLUR_DATA_URL } from '@/content/assets';
import { cn, formatDate } from '@/lib/utils';
import { useCmsData } from '@/lib/cmsClient';
import { Locale } from '@/i18n';
import { ArticleCategory } from '@/content/types';

export function MediaCenterClient() {
  const locale = useLocale() as Locale;
  const t = useTranslations('common');
  const { data } = useCmsData();

  const [filter, setFilter] = useState<'all' | ArticleCategory>('all');
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);

  const filtered = useMemo(() => {
    return data.articles.filter((art) => {
      const matchesCategory = filter === 'all' || art.category === filter;
      const matchesQuery =
        art.title[locale].toLowerCase().includes(query.toLowerCase()) ||
        art.excerpt[locale].toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [data.articles, filter, query, locale]);

  const items = filtered.slice(0, visibleCount);

  return (
    <div className="mx-auto max-w-container px-6 sm:px-10 lg:px-16 xl:px-20 py-16">
      <div className="sticky top-20 z-30 flex flex-col gap-4 rounded-2xl border border-white/10 bg-brand-charcoal/95 p-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2" role="tablist">
          {(
            [
              { id: 'all', label: t('all') },
              { id: 'press-release', label: t('pressRelease') },
              { id: 'announcement', label: t('announcement') },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={filter === tab.id}
              onClick={() => {
                setFilter(tab.id);
                setVisibleCount(6);
              }}
              className={cn(
                'rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition',
                filter === tab.id
                  ? 'bg-brand-red text-white'
                  : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"/>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            aria-label={t('searchPlaceholder')}
            className="w-full rounded-full border border-white/15 bg-black/50 py-2 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:border-brand-red focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {items.map((art) => {
          const href =
            art.category === 'press-release'
              ? `/media-center/press-releases/${art.slug}`
              : `/media-center/announcement/${art.slug}`;

          return (
            <Link className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-brand-charcoal transition hover:border-brand-red/60" href="{href}" key="{art.id}">
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image alt="{art.title[locale]}" blurDataURL="{BLUR_DATA_URL}" className="object-cover transition-transform duration-500 group-hover:scale-105" fill placeholder="blur" sizes="(max-width: 768px) 100vw, 33vw" src="{art.image}"/>
                <span className="absolute left-4 top-4 rounded-full bg-brand-red px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                  {art.category === 'press-release' ? t('pressRelease') : t('announcement')}
                </span>
              </div>

              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <time className="text-xs font-medium text-zinc-400">
                    {formatDate(art.date, locale)}
                  </time>
                  <h2 className="mt-2 text-lg font-bold text-white group-hover:text-brand-red transition line-clamp-2">
                    {art.title[locale]}
                  </h2>
                  <p className="mt-2 text-sm text-zinc-400 line-clamp-3">
                    {art.excerpt[locale]}
                  </p>
                </div>

                <div className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-red">
                  <span>{t('readArticle')}</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {visibleCount < filtered.length && (
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-brand-red hover:bg-brand-red"
          >
            {locale === 'id' ? 'Muat Lebih Banyak' : locale === 'zh' ? '加载更多' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
