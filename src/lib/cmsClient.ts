'use client';

import { useEffect, useState } from 'react';
import { CmsDatabase } from '@/content/types';
import { DESIGN_TOKENS } from './tokens';
import { HOME_CONTENT, STATISTICS_DATA } from '@/content/siteData';
import { ARTICLES } from '@/content/articles';

export const DEFAULT_CMS_DB: CmsDatabase = {
  address: DESIGN_TOKENS.brand.address,
  email: DESIGN_TOKENS.brand.email,
  phone: DESIGN_TOKENS.brand.phone,
  aboutStatement: HOME_CONTENT.aboutIntro.statement,
  aboutSupporting: HOME_CONTENT.aboutIntro.supporting,
  quoteHighlight: HOME_CONTENT.quoteSection.highlight,
  reportsAvailable: HOME_CONTENT.reportsSection.reportsAvailable,
  stats: STATISTICS_DATA,
  articles: ARTICLES,
};

export function useCmsData() {
  const [data, setData] = useState<CmsDatabase>(DEFAULT_CMS_DB);
  const [loaded, setLoaded] = useState(false);

  const refresh = async () => {
    try {
      const res = await fetch('/api/cms', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      // Fallback to default seed data if offline
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return { data, loaded, refresh };
}
