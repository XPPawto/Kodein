import fs from 'fs';
import path from 'path';

const files = {
  'messages/id.json': `{
  "nav": {
    "mainSite": "Kodein",
    "dam": "Web & Aplikasi Mobile",
    "dim": "Sistem Kustom & AI",
    "ddmf": "Server & Maintenance",
    "about": "Tentang Kodein",
    "aboutDesc": "Cara kami bekerja, prinsip koding, dan tim di balik Kodein.",
    "ecosystem": "Layanan Kami",
    "governance": "Standar & Keamanan",
    "governanceDesc": "Kualitas kode, garansi bug, kerahasiaan data (NDA), dan keamanan sistem.",
    "wbs": "Whistleblowing System",
    "wbsDesc": "Saluran pelaporan pelanggaran etika, privasi data, atau kecurangan secara rahasia.",
    "vdp": "Vulnerability Disclosure Program",
    "vdpDesc": "Program pelaporan celah keamanan teknis (Bug Bounty / Responsible Disclosure) pada sistem Kodein.",
    "media": "Catatan & Karya",
    "investor": "Model Kerja Sama",
    "help": "Diskusi Proyek",
    "cms": "CMS Studio",
    "learnMore": "Lihat Detail",
    "skipToContent": "Lewati ke konten utama"
  },
  "common": {
    "learnMore": "Baca Selengkapnya",
    "comingSoon": "Segera Hadir",
    "pressRelease": "Studi Kasus",
    "announcement": "Kabar Kodein",
    "all": "Semua",
    "searchPlaceholder": "Cari studi kasus, proyek, atau catatan teknis...",
    "backToMedia": "Kembali ke Catatan & Karya",
    "share": "Bagikan Halaman",
    "copied": "Tautan Disalin",
    "relatedArticles": "Tulisan Lainnya",
    "readArticle": "Baca Cerita Lengkap",
    "backToTop": "Kembali ke atas",
    "cookieText": "Situs ini menggunakan penyimpanan lokal seperlunya agar pengaturan bahasa dan sesi Anda berjalan lancar.",
    "cookieAccept": "Mengerti"
  },
  "footer": {
    "mainSites": "Layanan Utama",
    "mediaCenter": "Jelajahi",
    "otherLinks": "Tautan Lainnya",
    "pressReleases": "Catatan & Studi Kasus",
    "investorRelations": "Model Kerja Sama",
    "wbs": "Whistleblowing System",
    "vdp": "Program Pengungkapan Kerentanan (VDP)",
    "rights": "Seluruh hak cipta dilindungi."
  }
}
`,

  'messages/en.json': `{
  "nav": {
    "mainSite": "Kodein",
    "dam": "Web & Mobile Apps",
    "dim": "Custom Systems & AI",
    "ddmf": "Cloud & Maintenance",
    "about": "About Kodein",
    "aboutDesc": "How we work, our engineering standards, and the people behind Kodein.",
    "ecosystem": "Our Services",
    "governance": "Standards & Security",
    "governanceDesc": "Code quality, bug warranty, strict NDA protection, and system security.",
    "wbs": "Whistleblowing System",
    "wbsDesc": "Confidential channel for reporting ethical violations, NDA breaches, or misconduct.",
    "vdp": "Vulnerability Disclosure Program",
    "vdpDesc": "Responsible disclosure program for reporting security bugs across Kodein systems.",
    "media": "Work & Notes",
    "investor": "How We Partner",
    "help": "Start a Project",
    "cms": "CMS Studio",
    "learnMore": "View Details",
    "skipToContent": "Skip to main content"
  },
  "common": {
    "learnMore": "Read More",
    "comingSoon": "Coming Soon",
    "pressRelease": "Case Study",
    "announcement": "Studio News",
    "all": "All",
    "searchPlaceholder": "Search case studies, projects, or technical notes...",
    "backToMedia": "Back to Work & Notes",
    "share": "Share Page",
    "copied": "Link Copied",
    "relatedArticles": "More Stories",
    "readArticle": "Read Full Story",
    "backToTop": "Back to top",
    "cookieText": "We use minimal local storage to remember your language preference and keep your browsing smooth.",
    "cookieAccept": "Got It"
  },
  "footer": {
    "mainSites": "Core Services",
    "mediaCenter": "Explore",
    "otherLinks": "Other Links",
    "pressReleases": "Case Studies & Notes",
    "investorRelations": "Partnership Models",
    "wbs": "Whistleblowing System",
    "vdp": "Vulnerability Disclosure Program",
    "rights": "All rights reserved."
  }
}
`,

  'messages/zh.json': `{
  "nav": {
    "mainSite": "Kodein",
    "dam": "网站与移动应用开发",
    "dim": "定制软件与人工智能",
    "ddmf": "云架构与系统运维",
    "about": "关于 Kodein",
    "aboutDesc": "我们的工作方式、代码标准以及 Kodein 背后的技术团队。",
    "ecosystem": "服务与方案",
    "governance": "工程与安全标准",
    "governanceDesc": "代码质量保证、售后保修、严格的保密协议 (NDA) 与系统安全。",
    "wbs": "违规举报系统 (WBS)",
    "wbsDesc": "用于匿名举报职业道德违规、数据泄密或不当行为的保密通道。",
    "vdp": "漏洞披露计划 (VDP)",
    "vdpDesc": "面向安全研究人员与白帽黑客的负责任技术安全漏洞提交通道。",
    "media": "案例与动态",
    "investor": "合作模式",
    "help": "项目咨询",
    "cms": "CMS 后台",
    "learnMore": "查看详情",
    "skipToContent": "跳转到主要内容"
  },
  "common": {
    "learnMore": "阅读更多",
    "comingSoon": "即将上线",
    "pressRelease": "项目案例",
    "announcement": "最新动态",
    "all": "全部",
    "searchPlaceholder": "搜索项目案例、产品发布或技术笔记...",
    "backToMedia": "返回案例与动态",
    "share": "分享文章",
    "copied": "链接已复制",
    "relatedArticles": "相关阅读",
    "readArticle": "阅读全文",
    "backToTop": "返回顶部",
    "cookieText": "我们使用必要的本地存储来保存您的语言偏好并确保流畅的浏览体验。",
    "cookieAccept": "知道了"
  },
  "footer": {
    "mainSites": "核心业务",
    "mediaCenter": "探索更多",
    "otherLinks": "其他链接",
    "pressReleases": "项目案例与技术动态",
    "investorRelations": "合作与交付模式",
    "wbs": "违规举报系统 (WBS)",
    "vdp": "漏洞披露计划 (VDP)",
    "rights": "保留所有权利。"
  }
}
`,

  // Update Header agar Mega Menu menampilkan Corporate Governance, WBS, dan VDP
  'src/components/layout/Header.tsx': `'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, Menu, X, ArrowUpRight, LayoutDashboard } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, usePathname } from '@/navigation';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { cn } from '@/lib/utils';

export function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [activeMega, setActiveMega] = useState<'about' | 'governance' | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 80);
      if (currentY > 180 && currentY > lastScrollY && !mobileOpen) {
        setHidden(true);
        setActiveMega(null);
      } else {
        setHidden(false);
      }
      lastScrollY = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setActiveMega(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const entityLinks = [
    { label: t('mainSite'), href: '/' },
    { label: t('dam'), href: '/dam' },
    { label: t('dim'), href: '/dim' },
    { label: t('ddmf'), href: '/ddmf' },
  ];

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-brand-red focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        {t('skipToContent')}
      </a>

      <header
        onMouseLeave={() => setActiveMega(null)}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-institutional',
          hidden ? '-translate-y-full' : 'translate-y-0',
          scrolled || activeMega
            ? 'bg-brand-dark/95 backdrop-blur-md border-b border-white/10 shadow-lg'
            : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent'
        )}
      >
        <div className="hidden lg:block border-b border-white/10">
          <div className="mx-auto flex max-w-container items-center justify-between px-6 sm:px-10 lg:px-16 xl:px-20 py-2 text-xs text-zinc-300">
            <div className="flex items-center divide-x divide-white/15">
              {entityLinks.map((ent) => {
                const isActive = pathname === ent.href;
                return (
                  <Link
                    key={ent.href}
                    href={ent.href}
                    className={cn(
                      'px-3 first:pl-0 transition hover:text-white',
                      isActive && 'font-semibold text-brand-coral'
                    )}
                  >
                    {ent.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-5">
              <Link
                href="/cms"
                className="inline-flex items-center gap-1.5 text-brand-coral hover:text-white transition font-semibold"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>{t('cms')}</span>
              </Link>
              <Link href="/media-center" className="hover:text-white transition">
                {t('media')}
              </Link>
              <Link href="/help-center" className="hover:text-white transition">
                {t('help')}
              </Link>
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        <div className="mx-auto flex h-20 max-w-container items-center justify-between px-6 sm:px-10 lg:px-16 xl:px-20">
          <Link href="/" aria-label="Kodein Home">
            <BrandLogo variant="dark" />
          </Link>

          <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-8">
            <button
              type="button"
              onMouseEnter={() => setActiveMega('about')}
              onClick={() => setActiveMega(activeMega === 'about' ? null : 'about')}
              aria-expanded={activeMega === 'about'}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white/90 hover:text-white py-2"
            >
              <span>{t('about')}</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform duration-200',
                  activeMega === 'about' && 'rotate-180 text-brand-red'
                )}
              />
            </button>

            <Link
              href="/our-ecosystem"
              onMouseEnter={() => setActiveMega(null)}
              className={cn(
                'text-sm font-medium transition py-2',
                pathname === '/our-ecosystem' ? 'text-brand-red' : 'text-white/90 hover:text-white'
              )}
            >
              {t('ecosystem')}
            </Link>

            <button
              type="button"
              onMouseEnter={() => setActiveMega('governance')}
              onClick={() => setActiveMega(activeMega === 'governance' ? null : 'governance')}
              aria-expanded={activeMega === 'governance'}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white/90 hover:text-white py-2"
            >
              <span>{t('governance')}</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform duration-200',
                  activeMega === 'governance' && 'rotate-180 text-brand-red'
                )}
              />
            </button>

            <Link
              href="/media-center"
              onMouseEnter={() => setActiveMega(null)}
              className={cn(
                'text-sm font-medium transition py-2',
                pathname.startsWith('/media-center')
                  ? 'text-brand-red'
                  : 'text-white/90 hover:text-white'
              )}
            >
              {t('media')}
            </Link>

            <Link
              href="/investor-relations"
              onMouseEnter={() => setActiveMega(null)}
              className={cn(
                'text-sm font-medium transition py-2',
                pathname === '/investor-relations'
                  ? 'text-brand-red'
                  : 'text-white/90 hover:text-white'
              )}
            >
              {t('investor')}
            </Link>
          </nav>

          <div className="flex items-center gap-3 lg:hidden">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle Menu"
              aria-expanded={mobileOpen}
              className="rounded-lg border border-white/15 p-2 text-white hover:bg-white/10"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {activeMega && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="hidden lg:block border-t border-white/10 bg-brand-charcoal/95 backdrop-blur-xl"
            >
              <div className="mx-auto grid max-w-container grid-cols-12 gap-8 px-6 sm:px-10 lg:px-16 xl:px-20 py-10">
                <div className="col-span-4 flex flex-col justify-between border-r border-white/10 pr-8">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
                      {activeMega === 'about' ? t('about') : t('governance')}
                    </span>
                    <h3 className="mt-2 text-2xl font-bold text-white">
                      {activeMega === 'about' ? t('aboutDesc') : t('governanceDesc')}
                    </h3>
                  </div>
                  <Link
                    href={activeMega === 'about' ? '/about' : '/corporate-governance'}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-red hover:underline"
                  >
                    <span>{t('learnMore')}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>

                <div
                  className={cn(
                    'col-span-8 grid gap-4',
                    activeMega === 'about' ? 'grid-cols-2' : 'grid-cols-3'
                  )}
                >
                  {activeMega === 'about' ? (
                    <>
                      <MegaMenuLink href="/about" title={t('about')} desc={t('aboutDesc')} />
                      <MegaMenuLink
                        href="/our-ecosystem"
                        title={t('ecosystem')}
                        desc="Web & Mobile Apps, Custom Software, Cloud"
                      />
                    </>
                  ) : (
                    <>
                      <MegaMenuLink
                        href="/corporate-governance"
                        title={t('governance')}
                        desc={t('governanceDesc')}
                      />
                      <MegaMenuLink href="/wbs" title={t('wbs')} desc={t('wbsDesc')} />
                      <MegaMenuLink href="/vdp" title={t('vdp')} desc={t('vdpDesc')} />
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-brand-dark pt-24 px-6 pb-10 overflow-y-auto lg:hidden flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="space-y-3 border-b border-white/10 pb-6">
                <Link href="/about" className="block text-xl font-bold text-white hover:text-brand-red">
                  {t('about')}
                </Link>
                <Link href="/our-ecosystem" className="block text-xl font-bold text-white hover:text-brand-red">
                  {t('ecosystem')}
                </Link>
                <Link href="/corporate-governance" className="block text-xl font-bold text-white hover:text-brand-red">
                  {t('governance')}
                </Link>
                <Link href="/wbs" className="block pl-4 text-base font-medium text-zinc-400 hover:text-white">
                  — {t('wbs')}
                </Link>
                <Link href="/vdp" className="block pl-4 text-base font-medium text-zinc-400 hover:text-white">
                  — {t('vdp')}
                </Link>
                <Link href="/media-center" className="block text-xl font-bold text-white hover:text-brand-red">
                  {t('media')}
                </Link>
                <Link href="/investor-relations" className="block text-xl font-bold text-white hover:text-brand-red">
                  {t('investor')}
                </Link>
                <Link href="/help-center" className="block text-xl font-bold text-white hover:text-brand-red">
                  {t('help')}
                </Link>
                <Link href="/cms" className="block text-xl font-bold text-brand-coral">
                  {t('cms')}
                </Link>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  {t('ecosystem')}
                </p>
                <div className="mt-3 grid grid-cols-1 gap-2.5">
                  {entityLinks.map((ent) => (
                    <Link
                      key={ent.href}
                      href={ent.href}
                      className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white"
                    >
                      <span>{ent.label}</span>
                      <ArrowUpRight className="h-4 w-4 text-brand-red" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MegaMenuLink({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-brand-red/60 hover:bg-white/[0.06]"
    >
      <div className="flex items-center justify-between">
        <span className="font-bold text-white group-hover:text-brand-red transition">{title}</span>
        <ArrowUpRight className="h-4 w-4 text-zinc-400 group-hover:text-brand-red transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
      <p className="mt-2 text-xs leading-relaxed text-zinc-400">{desc}</p>
    </Link>
  );
}
`,

  // Update Footer untuk menampilkan kembali Vulnerability Disclosure Program (VDP), WBS, dan Investor Relations
  'src/components/layout/Footer.tsx': `'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Instagram, Linkedin, ArrowUpRight, MapPin } from 'lucide-react';
import { Link } from '@/navigation';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { DESIGN_TOKENS } from '@/lib/tokens';
import { useCmsData } from '@/lib/cmsClient';

export function Footer() {
  const t = useTranslations('footer');
  const navT = useTranslations('nav');
  const { data } = useCmsData();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-black border-t border-white/10 text-white">
      <div className="mx-auto max-w-container px-6 sm:px-10 lg:px-16 xl:px-20 py-16 md:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-5">
            <Link href="/" aria-label="Kodein Home">
              <BrandLogo variant="dark" size="lg" />
            </Link>
            <div className="flex items-start gap-2.5 max-w-md text-sm leading-relaxed text-zinc-400">
              <MapPin className="h-4 w-4 text-brand-red shrink-0 mt-1" />
              <span>{data.address}</span>
            </div>
            <p className="text-xs text-zinc-500">
              {data.email} • {data.phone}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={DESIGN_TOKENS.brand.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:border-brand-red hover:bg-brand-red"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={DESIGN_TOKENS.brand.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:border-brand-red hover:bg-brand-red"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 gap-10 sm:grid-cols-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
                {t('mainSites')}
              </h3>
              <ul className="mt-5 space-y-3.5 text-sm">
                <li>
                  <Link href="/dam" className="text-zinc-300 hover:text-brand-red transition">
                    {navT('dam')}
                  </Link>
                </li>
                <li>
                  <Link href="/dim" className="text-zinc-300 hover:text-brand-red transition">
                    {navT('dim')}
                  </Link>
                </li>
                <li>
                  <Link href="/ddmf" className="text-zinc-300 hover:text-brand-red transition">
                    {navT('ddmf')}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
                {t('mediaCenter')}
              </h3>
              <ul className="mt-5 space-y-3.5 text-sm">
                <li>
                  <Link href="/media-center" className="text-zinc-300 hover:text-brand-red transition">
                    {t('pressReleases')}
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-zinc-300 hover:text-brand-red transition">
                    {navT('about')}
                  </Link>
                </li>
                <li>
                  <Link href="/our-ecosystem" className="text-zinc-300 hover:text-brand-red transition">
                    {navT('ecosystem')}
                  </Link>
                </li>
                <li>
                  <Link href="/cms" className="text-brand-coral font-semibold hover:underline transition">
                    {navT('cms')}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
                {t('otherLinks')}
              </h3>
              <ul className="mt-5 space-y-3.5 text-sm">
                <li>
                  <Link href="/investor-relations" className="text-zinc-300 hover:text-brand-red transition">
                    {t('investorRelations')}
                  </Link>
                </li>
                <li>
                  <Link href="/wbs" className="text-zinc-300 hover:text-brand-red transition">
                    {t('wbs')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/vdp"
                    className="inline-flex items-center gap-1 text-zinc-300 hover:text-brand-red transition"
                  >
                    <span>{t('vdp')}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>
            © {currentYear} {DESIGN_TOKENS.brand.name}. {t('rights')}
          </p>
          <div className="flex items-center gap-6">
            <Link href="/corporate-governance" className="hover:text-zinc-300 transition">
              {navT('governance')}
            </Link>
            <Link href="/vdp" className="hover:text-zinc-300 transition">
              VDP
            </Link>
            <Link href="/help-center" className="hover:text-zinc-300 transition">
              {navT('help')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
`,

  // Buat halaman khusus Vulnerability Disclosure Program (VDP) di /[locale]/vdp/page.tsx
  'src/app/[locale]/vdp/page.tsx': `'use client';

import React, { useState } from 'react';
import { ShieldCheck, Bug, Lock, Terminal, CheckCircle2 } from 'lucide-react';
import { useLocale } from 'next-intl';
import { Locale } from '@/i18n';

export default function VdpPage() {
  const locale = useLocale() as Locale;
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const copy = {
    id: {
      eyebrow: 'Vulnerability Disclosure Program (VDP)',
      title: 'Program Pengungkapan Kerentanan Keamanan Kodein',
      subtitle:
        'Kodein berkomitmen menjaga keamanan setiap baris kode, website, dan infrastruktur server yang kami bangun. Kami mengundang peneliti keamanan siber (security researchers) untuk melaporkan temuan celah keamanan secara bertanggung jawab.',
      safeHarborTitle: 'Jaminan Safe Harbor',
      safeHarborDesc:
        'Kami tidak akan menempuh jalur hukum terhadap peneliti yang melakukan pengujian dengan iktikad baik, tidak merusak layanan (DoS), dan tidak mengakses atau menyebarkan data milik klien Kodein.',
      scopeTitle: 'Cakupan Sistem (In-Scope)',
      scopeDesc:
        'Seluruh domain resmi *.kodein.id, API publik Kodein, serta repositori open-source resmi milik studio Kodein.',
      slaTitle: 'Respons & Penanganan Cepat',
      slaDesc:
        'Tim engineer kami di Indralaya Utara memverifikasi setiap laporan kritis dalam waktu maksimal 1x24 jam dan memberikan apresiasi di Hall of Fame keamanan Kodein.',
      formTitle: 'Kirim Laporan Kerentanan Teknis (PoC)',
      researcherName: 'Nama / Handle Peneliti (Opsional)',
      researcherEmail: 'Email untuk Konfirmasi Temuan *',
      targetAsset: 'URL / Domain / Endpoint Terdampak *',
      severity: 'Tingkat Keparahan (Severity) *',
      pocLabel: 'Langkah Reproduksi (Steps to Reproduce) & Dampak Teknis *',
      pocPlaceholder:
        'Tuliskan payload, langkah reproduksi secara berurutan, dan dampak kerentanan (minimal 30 karakter)...',
      submitBtn: 'Kirim Laporan VDP Terenkripsi',
      submittingBtn: 'Mengirim Laporan...',
      successTitle: 'Laporan VDP Berhasil Diterima',
      successTicket: 'Nomor Tiket VDP Anda:',
    },
    en: {
      eyebrow: 'Vulnerability Disclosure Program (VDP)',
      title: 'Kodein Security Vulnerability Disclosure Program',
      subtitle:
        'Kodein is committed to securing every line of code, website, and server infrastructure we engineer. We welcome independent security researchers to report potential vulnerabilities through responsible disclosure.',
      safeHarborTitle: 'Safe Harbor Guarantee',
      safeHarborDesc:
        'We will not pursue legal action against researchers who test in good faith, avoid service disruption (DoS), and do not exfiltrate or modify client data.',
      scopeTitle: 'In-Scope Assets',
      scopeDesc:
        'All official *.kodein.id domains, public Kodein APIs, and official open-source repositories maintained by Kodein.',
      slaTitle: 'Rapid Triage & Resolution',
      slaDesc:
        'Our engineering team acknowledges critical reports within 24 hours and credits valid findings on the Kodein Security Hall of Fame.',
      formTitle: 'Submit a Technical Vulnerability Report (PoC)',
      researcherName: 'Researcher Name / Handle (Optional)',
      researcherEmail: 'Contact Email for Triage Updates *',
      targetAsset: 'Affected URL / Domain / Endpoint *',
      severity: 'Estimated Severity (CVSS) *',
      pocLabel: 'Steps to Reproduce & Technical Impact *',
      pocPlaceholder:
        'Provide clear reproduction steps, proof-of-concept (PoC), and security impact (min. 30 chars)...',
      submitBtn: 'Submit Encrypted VDP Report',
      submittingBtn: 'Encrypting & Sending...',
      successTitle: 'VDP Report Received',
      successTicket: 'Your VDP Ticket Reference:',
    },
    zh: {
      eyebrow: '漏洞披露计划 (VDP)',
      title: 'Kodein 安全漏洞负责任披露计划',
      subtitle:
        'Kodein 致力于保障我们开发的每一行代码、网站与服务器基础设施的安全。我们欢迎安全研究人员与白帽黑客通过负责任的方式向我们报告潜在的技术安全漏洞。',
      safeHarborTitle: '安全港保障 (Safe Harbor)',
      safeHarborDesc:
        '对于出于善意进行测试、未造成服务中断 (DoS) 且未窃取或篡改客户数据的安全研究人员，我们承诺绝不采取法律行动。',
      scopeTitle: '测试范围 (In-Scope)',
      scopeDesc:
        '所有 *.kodein.id 官方域名、Kodein 公共 API 接口以及 Kodein 官方维护的开源代码库。',
      slaTitle: '快速响应与修复',
      slaDesc:
        '我们的工程团队会在 24 小时内确认严重漏洞报告，并将有效报告者列入 Kodein 安全致谢榜。',
      formTitle: '提交技术安全漏洞报告 (PoC)',
      researcherName: '研究人员姓名 / 昵称（选填）',
      researcherEmail: '用于接收修复进度的联系邮箱 *',
      targetAsset: '受影响的 URL / 域名 / 接口地址 *',
      severity: '漏洞严重程度 (Severity) *',
      pocLabel: '复现步骤 (Steps to Reproduce) 与技术影响 *',
      pocPlaceholder: '请详细描述漏洞复现步骤、PoC 验证代码及潜在安全影响（至少 30 个字符）...',
      submitBtn: '提交加密 VDP 漏洞报告',
      submittingBtn: '正在加密提交...',
      successTitle: 'VDP 漏洞报告已成功接收',
      successTicket: '您的漏洞跟踪编号：',
    },
  }[locale];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const target = String(formData.get('targetAsset') || '');
    const sev = String(formData.get('severity') || 'high');
    const poc = String(formData.get('poc') || '');

    const payload = {
      reporterName: String(formData.get('researcherName') || ''),
      reporterEmail: String(formData.get('researcherEmail') || ''),
      category: 'other',
      incidentDate: new Date().toISOString().split('T')[0],
      description: \`[VDP-\${sev.toUpperCase()}] Target: \${target} | PoC: \${poc}\`,
      honeypot: '',
    };

    const res = await fetch('/api/wbs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setSubmitting(false);
    if (res.ok) {
      const data = await res.json();
      setTicketId(data.referenceId.replace('KODEIN-SEC-', 'KODEIN-VDP-'));
    }
  };

  return (
    <div className="bg-brand-dark pt-32 pb-24 text-white">
      <div className="mx-auto max-w-container px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
          <Bug className="h-4 w-4" />
          <span>{copy.eyebrow}</span>
        </div>

        <h1 className="mt-4 max-w-4xl text-fluid-h1 font-bold">{copy.title}</h1>
        <p className="mt-4 max-w-3xl text-base md:text-lg text-zinc-400 leading-relaxed">
          {copy.subtitle}
        </p>

        {/* 3 Pillars of Kodein VDP */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-brand-charcoal p-7">
            <ShieldCheck className="h-7 w-7 text-brand-red" />
            <h2 className="mt-4 text-lg font-bold">{copy.safeHarborTitle}</h2>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{copy.safeHarborDesc}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-brand-charcoal p-7">
            <Terminal className="h-7 w-7 text-brand-red" />
            <h2 className="mt-4 text-lg font-bold">{copy.scopeTitle}</h2>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{copy.scopeDesc}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-brand-charcoal p-7">
            <Lock className="h-7 w-7 text-brand-red" />
            <h2 className="mt-4 text-lg font-bold">{copy.slaTitle}</h2>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{copy.slaDesc}</p>
          </div>
        </div>

        {/* VDP Submission Form */}
        <div className="mt-16 max-w-3xl">
          {ticketId ? (
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-8">
              <CheckCircle2 className="h-10 w-10 text-emerald-400" />
              <h2 className="mt-4 text-xl font-bold">{copy.successTitle}</h2>
              <p className="mt-2 text-sm text-zinc-300">
                {copy.successTicket}{' '}
                <strong className="font-mono text-white">{ticketId}</strong>
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-6 rounded-2xl border border-white/10 bg-brand-charcoal p-8"
            >
              <h2 className="text-xl font-bold">{copy.formTitle}</h2>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                    {copy.researcherName}
                  </label>
                  <input
                    name="researcherName"
                    type="text"
                    placeholder="e.g. @sec_hunter"
                    className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-sm text-white focus:border-brand-red focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                    {copy.researcherEmail}
                  </label>
                  <input
                    name="researcherEmail"
                    type="email"
                    required
                    placeholder="researcher@domain.com"
                    className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-sm text-white focus:border-brand-red focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                    {copy.targetAsset}
                  </label>
                  <input
                    name="targetAsset"
                    type="text"
                    required
                    placeholder="https://api.kodein.id/v1/..."
                    className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-sm text-white focus:border-brand-red focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                    {copy.severity}
                  </label>
                  <select
                    name="severity"
                    className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-sm text-white focus:border-brand-red focus:outline-none"
                  >
                    <option value="critical">Critical (CVSS 9.0 - 10.0)</option>
                    <option value="high">High (CVSS 7.0 - 8.9)</option>
                    <option value="medium">Medium (CVSS 4.0 - 6.9)</option>
                    <option value="low">Low / Informational</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                  {copy.pocLabel}
                </label>
                <textarea
                  name="poc"
                  required
                  minLength={30}
                  rows={5}
                  placeholder={copy.pocPlaceholder}
                  className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 p-4 font-mono text-xs text-white focus:border-brand-red focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-brand-red py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-brand-redHover disabled:opacity-50"
              >
                {submitting ? copy.submittingBtn : copy.submitBtn}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
`,

  // Update Corporate Governance page agar memiliki tombol langsung ke WBS dan VDP
  'src/app/[locale]/corporate-governance/page.tsx': `import React from 'react';
import { ShieldCheck, Code2, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Locale } from '@/i18n';

export default function GovernancePage({ params: { locale } }: { params: { locale: Locale } }) {
  const isId = locale === 'id';
  const isZh = locale === 'zh';

  const pillars = [
    {
      icon: Code2,
      title: isId
        ? 'Standar Clean Code & QA Otomatis'
        : isZh
        ? '整洁代码与自动化质量测试'
        : 'Clean Code & Automated QA Standards',
      desc: isId
        ? 'Setiap fitur melewati code review berlapis, automated testing, dan audit performa sebelum dirilis ke server produksi.'
        : isZh
        ? '每项功能在发布到生产服务器之前，均经过多层代码审查、自动化测试与性能审计。'
        : 'Every feature undergoes peer code review, automated testing, and performance auditing prior to production deployment.',
    },
    {
      icon: ShieldCheck,
      title: isId
        ? 'Keamanan Aplikasi (OWASP & Enkripsi)'
        : isZh
        ? '应用安全标准 (OWASP 与加密)'
        : 'Application Security (OWASP & Encryption)',
      desc: isId
        ? 'Mengadopsi standar keamanan OWASP Top 10 untuk mencegah celah keamanan pada website dan sistem perangkat lunak klien.'
        : isZh
        ? '采用 OWASP Top 10 安全规范，全面防范客户网站与软件系统中的潜在安全漏洞。'
        : 'Adopting OWASP Top 10 security practices to safeguard client websites and software applications against vulnerabilities.',
    },
    {
      icon: FileCheck,
      title: isId
        ? 'Perlindungan NDA & Hak Kekayaan Intelektual'
        : isZh
        ? '严格的保密协议 (NDA) 与源码所有权'
        : 'Strict NDA & Full IP Ownership',
      desc: isId
        ? 'Kerahasiaan ide bisnis dan data perusahaan Anda dijamin melalui perjanjian hukum (NDA) serta kepemilikan source code yang jelas.'
        : isZh
        ? '通过具有法律效力的保密协议 (NDA) 与清晰的源码知识产权归属，全面保护您的商业机密。'
        : 'Your business ideas and proprietary data are protected under strict NDAs and clear source code intellectual property ownership.',
    },
  ];

  return (
    <div className="bg-brand-dark pt-32 pb-24 text-white">
      <div className="mx-auto max-w-container px-6 sm:px-10 lg:px-16 xl:px-20">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
          {isId
            ? 'Standar Kualitas & Keamanan'
            : isZh
            ? '工程质量与安全标准'
            : 'Quality & Security Standards'}
        </span>
        <h1 className="mt-4 max-w-4xl text-fluid-h1 font-bold">
          {isId
            ? 'Kualitas Engineering, Keamanan Data, dan Kepatuhan Standar Industri'
            : isZh
            ? '卓越的工程质量、数据安全保障与行业合规标准'
            : 'Engineering Excellence, Data Security, and Industry-Grade Compliance'}
        </h1>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-brand-charcoal p-8"
              >
                <Icon className="h-8 w-8 text-brand-red" />
                <h2 className="mt-5 text-xl font-bold">{p.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{p.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-brand-red/40 bg-brand-charcoal p-8 flex flex-col justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-red">
                VDP
              </span>
              <h2 className="mt-2 text-2xl font-bold">
                Vulnerability Disclosure Program (VDP)
              </h2>
              <p className="mt-2 text-sm text-zinc-300 leading-relaxed">
                {isId
                  ? 'Program pengungkapan kerentanan teknis bagi peneliti keamanan siber untuk melaporkan bug keamanan pada infrastruktur dan sistem Kodein secara bertanggung jawab.'
                  : isZh
                  ? '面向安全研究人员的负责任漏洞披露计划，用于提交 Kodein 系统与基础设施中的潜在技术安全漏洞。'
                  : 'Responsible disclosure program for security researchers to report technical vulnerabilities across Kodein systems.'}
              </p>
            </div>
            <div>
              <Button href="/vdp" variant="primary">
                {isId ? 'Buka Halaman VDP' : isZh ? '进入 VDP 漏洞提交页面' : 'Open VDP Portal'}
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-brand-charcoal p-8 flex flex-col justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                WBS
              </span>
              <h2 className="mt-2 text-2xl font-bold">Whistleblowing System (WBS)</h2>
              <p className="mt-2 text-sm text-zinc-300 leading-relaxed">
                {isId
                  ? 'Saluran pelaporan rahasia bagi klien, mitra, maupun tim internal untuk melaporkan pelanggaran etika kerja, privasi data (NDA), atau kecurangan.'
                  : isZh
                  ? '面向客户、合作伙伴及内部员工的保密举报通道，用于匿名反馈违反职业道德或保密协议的行为。'
                  : 'Confidential reporting channel for clients, partners, and staff to report ethical breaches or NDA violations.'}
              </p>
            </div>
            <div>
              <Button href="/wbs" variant="outline">
                {isId ? 'Buka Halaman WBS' : isZh ? '进入 WBS 举报通道' : 'Open WBS Portal'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`,

  'src/app/sitemap.ts': `import { MetadataRoute } from 'next';
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
    '/cms',
  ];

  const staticEntries = routes.flatMap((route) =>
    (['id', 'en', 'zh'] as const).map((locale) => ({
      url: \`\${base}/\${locale}\${route}\`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1.0 : 0.8,
    }))
  );

  const articleEntries = ARTICLES.flatMap((article) =>
    (['id', 'en', 'zh'] as const).map((locale) => {
      const folder = article.category === 'press-release' ? 'press-releases' : 'announcement';
      return {
        url: \`\${base}/\${locale}/media-center/\${folder}/\${article.slug}\`,
        lastModified: new Date(article.date),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      };
    })
  );

  return [...staticEntries, ...articleEntries];
}
`,
};

console.log('🛡️ Mengembalikan Vulnerability Disclosure Program (VDP) & membuat halaman /vdp...');

for (const [relativePath, content] of Object.entries(files)) {
  const fullPath = path.join(process.cwd(), relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`  ✓ Updated ${relativePath}`);
}

console.log('\n✅ Selesai! Program Pengungkapan Kerentanan (VDP) sudah aktif kembali di:');
console.log('  • Footer (Kolom Tautan Lainnya / Other Links)');
console.log('  • Mega Menu (Standar & Keamanan)');
console.log('  • Halaman penuh VDP: http://localhost:3000/id/vdp (serta /en/vdp dan /zh/vdp)');