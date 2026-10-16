import React from 'react';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CookieBanner } from '@/components/layout/CookieBanner';
import { BackToTop } from '@/components/layout/BackToTop';
import { DESIGN_TOKENS } from '@/lib/tokens';
import { Locale } from '@/i18n';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const titles: Record<Locale, string> = {
    id: 'Kodein — Jasa Pembuatan Website & Software Indralaya Utara, Ogan Ilir',
    en: 'Kodein — Web Development & Custom Software Studio',
    zh: 'Kodein — 网站建设与定制软件开发工作室',
  };

  const descriptions: Record<Locale, string> = {
    id: 'Kodein adalah studio pembuatan website, aplikasi mobile, dan software kustom di Gang Lampung 1, Indralaya Utara, Kabupaten Ogan Ilir, Sumatera Selatan.',
    en: 'Kodein is a web development, mobile app, and custom software studio based in Gang Lampung 1, Indralaya Utara, Ogan Ilir, South Sumatra.',
    zh: 'Kodein 是位于印尼南苏门答腊省奥干伊利尔县北印德拉拉亚 Gang Lampung 1 的网站建设、移动应用与定制软件开发工作室。',
  };

  const title = titles[locale] || titles.id;
  const description = descriptions[locale] || descriptions.id;

  return {
    metadataBase: new URL(DESIGN_TOKENS.brand.domain),
    title: {
      default: title,
      template: `%s | ${DESIGN_TOKENS.brand.name}`,
    },
    description,
    icons: {
      icon: '/favicon.ico?v=3',
      shortcut: '/favicon.ico?v=3',
      apple: '/favicon.ico?v=3',
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        id: '/id',
        en: '/en',
        zh: '/zh',
      },
    },
    openGraph: {
      title,
      description,
      url: `${DESIGN_TOKENS.brand.domain}/${locale}`,
      siteName: DESIGN_TOKENS.brand.name,
      locale: locale === 'id' ? 'id_ID' : locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
      images: [{ url: '/assets/brand/kodein-profile-dark.svg', width: 640, height: 640 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const messages = await getMessages();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: DESIGN_TOKENS.brand.name,
    url: DESIGN_TOKENS.brand.domain,
    logo: `${DESIGN_TOKENS.brand.domain}/assets/brand/kodein-logo-horizontal.svg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Gang Lampung 1, Indralaya Utara',
      addressLocality: 'Kabupaten Ogan Ilir',
      addressRegion: 'Sumatera Selatan',
      addressCountry: 'ID',
    },
  };

  return (
    <html lang={locale} className={jakarta.variable}>
      <body className="min-h-screen flex flex-col bg-brand-dark font-sans text-white antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <CookieBanner />
          <BackToTop />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
