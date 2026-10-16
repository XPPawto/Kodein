export type ArticleCategory = 'press-release' | 'announcement';

export interface LocalizedText {
  id: string;
  en: string;
  zh: string;
}

export interface LocalizedTextArray {
  id: string[];
  en: string[];
  zh: string[];
}

export interface Article {
  id: string;
  slug: string;
  category: ArticleCategory;
  date: string;
  image: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  content: LocalizedTextArray;
  quote?: LocalizedText;
}

export interface StatItem {
  id: string;
  prefix?: string;
  value: number;
  suffix?: string;
  label: LocalizedText;
  description: LocalizedText;
}

export interface MilestoneItem {
  id: string;
  month: LocalizedText;
  day: string;
  year: string;
  title: LocalizedText;
  description: LocalizedText;
  image: string;
  isCap?: boolean;
}

export interface ScopeEntity {
  id: 'main' | 'dam' | 'dim' | 'ddmf';
  code: string;
  title: LocalizedText;
  shortDesc: LocalizedText;
  href: string;
  image: string;
}

export interface EntityDetailData {
  slug: 'dam' | 'dim' | 'ddmf';
  code: string;
  name: LocalizedText;
  tagline: LocalizedText;
  heroImage: string;
  overview: LocalizedTextArray;
  focusAreas: Array<{
    title: LocalizedText;
    description: LocalizedText;
  }>;
  highlights: Array<{
    metric: string;
    label: LocalizedText;
  }>;
}

export interface CmsDatabase {
  address: string;
  email: string;
  phone: string;
  aboutStatement: LocalizedText;
  aboutSupporting: LocalizedText;
  quoteHighlight: LocalizedText;
  reportsAvailable: boolean;
  stats: StatItem[];
  articles: Article[];
}
