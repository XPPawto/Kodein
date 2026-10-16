import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Locale } from '@/i18n';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const LOCALE_MAP: Record<Locale, string> = {
  id: 'id-ID',
  en: 'en-US',
  zh: 'zh-CN',
};

export function formatDate(dateString: string, locale: Locale): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat(LOCALE_MAP[locale] || 'id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(LOCALE_MAP[locale] || 'id-ID').format(value);
}

export function sanitizeText(input: string): string {
  return input.replace(/[<>]/g, '');
}

export function formatStatSuffix(suffix: string | undefined, locale: Locale): string {
  if (!suffix) return '';
  if (suffix.trim().toLowerCase() === 'hari') {
    if (locale === 'en') return ' Days';
    if (locale === 'zh') return ' 天';
    return ' Hari';
  }
  return suffix;
}
