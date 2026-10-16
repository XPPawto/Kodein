'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  ChevronDown,
  Menu,
  X,
  ArrowUpRight,
  Compass,
  ShieldCheck,
  Search,
  Layers,
  Building2,
  MessageSquareText,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, usePathname, useRouter } from '@/navigation';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { cn } from '@/lib/utils';
import { Locale } from '@/i18n';

export function Header() {
  const locale = useLocale() as Locale;
  const isId = locale === 'id';
  const isZh = locale === 'zh';
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [activeMega, setActiveMega] = useState<'about' | 'governance' | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const currentPath = pendingPath ?? pathname;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setDirectoryOpen(false);
        router.push('/cms');
        return;
      }
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setDirectoryOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setDirectoryOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 80);

      // Check if viewport is currently locked inside sticky Section 04 (#section-stats) or Section 06 (#section-journey)
      const isInsideStickySection = (id: string) => {
        const el = document.getElementById(id);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= 64 && rect.bottom >= window.innerHeight * 0.5;
      };

      const inStickySection =
        isInsideStickySection('section-stats') || isInsideStickySection('section-journey');

      if (inStickySection && !mobileOpen && !directoryOpen) {
        setHidden(true);
        setActiveMega(null);
      } else if (currentY > 180 && currentY > lastScrollY && !mobileOpen && !directoryOpen) {
        setHidden(true);
        setActiveMega(null);
      } else {
        setHidden(false);
      }
      lastScrollY = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileOpen, directoryOpen]);

  useEffect(() => {
    setPendingPath(null);
    setMobileOpen(false);
    setActiveMega(null);
    setDirectoryOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleRouteStart = (e: Event) => {
      const custom = e as CustomEvent<{ path?: string }>;
      if (custom.detail?.path) {
        setPendingPath(custom.detail.path);
        setActiveMega(null);
        setMobileOpen(false);
        setDirectoryOpen(false);
      }
    };
    window.addEventListener('kodein:route-start', handleRouteStart);
    return () => window.removeEventListener('kodein:route-start', handleRouteStart);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen || directoryOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen, directoryOpen]);

  const entityLinks = [
    { label: t('mainSite'), href: '/' },
    { label: t('dam'), href: '/dam' },
    { label: t('dim'), href: '/dim' },
    { label: t('ddmf'), href: '/ddmf' },
  ];

  const directoryGroups = useMemo(
    () => [
      {
        title: isId
          ? '1. Layanan & Kapabilitas Teknis'
          : isZh
          ? '1. 软件开发服务与技术能力'
          : '1. IT Services & Technical Capabilities',
        icon: Layers,
        items: [
          {
            title: t('ecosystem'),
            href: '/our-ecosystem',
            tag: 'RINGKASAN',
            desc: isId
              ? 'Gambaran lengkap seluruh layanan pembuatan software, alur kerja 4 tahap, dan teknologi yang kami gunakan.'
              : isZh
              ? '全面了解 Kodein 的所有软件开发服务、4 步交付流程与核心技术栈。'
              : 'Complete overview of all our software services, 4-step workflow, and technology stack.',
          },
          {
            title: t('dam'),
            href: '/dam',
            tag: 'UNIT 01 • WEB & APP',
            desc: isId
              ? 'Pembuatan website perusahaan, toko online, web aplikasi (SaaS), dan aplikasi mobile Android/iOS.'
              : isZh
              ? '定制开发企业官网、电商平台、Web 应用 (SaaS) 及 iOS/Android 移动应用。'
              : 'Company websites, e-commerce, SaaS web apps, and iOS/Android mobile applications.',
          },
          {
            title: t('dim'),
            href: '/dim',
            tag: 'UNIT 02 • SISTEM & AI',
            desc: isId
              ? 'Pembuatan sistem operasional kustom (ERP/CRM), dashboard data analitik, integrasi API, dan otomasi AI.'
              : isZh
              ? '定制开发企业管理系统 (ERP/CRM)、数据分析看板、API 集成与 AI 自动化工具。'
              : 'Custom internal systems (ERP/CRM), analytics dashboards, API integrations, and AI automation.',
          },
          {
            title: t('ddmf'),
            href: '/ddmf',
            tag: 'UNIT 03 • CLOUD & OPS',
            desc: isId
              ? 'Setup server cloud (AWS/GCP/VPS), optimasi kecepatan, backup otomatis, dan perawatan berkala.'
              : isZh
              ? '云服务器部署 (AWS/GCP/VPS)、性能优化、自动备份与全天候安全监控运维。'
              : 'Cloud server deployment (AWS/GCP/VPS), speed optimization, automated backups, and SLA maintenance.',
          },
        ],
      },
      {
        title: isId
          ? '2. Profil Studio & Bukti Karya'
          : isZh
          ? '2. 工作室简介与项目案例'
          : '2. Studio Profile & Case Studies',
        icon: Building2,
        items: [
          {
            title: isId ? 'Beranda Utama' : isZh ? '网站首页' : 'Main Homepage',
            href: '/',
            tag: 'HOME',
            desc: isId
              ? 'Halaman utama berisi 7 bab ringkasan: sorotan karya, profil singkat, 3 pilar layanan, statistik, dan linimasa.'
              : isZh
              ? '包含精选案例、工作室简介、三大服务、核心数据与发展历程的完整概览。'
              : 'Executive summary with 7 chapters: highlights, studio intro, 3 service pillars, stats, and timeline.',
          },
          {
            title: t('about'),
            href: '/about',
            tag: 'PROFIL',
            desc: isId
              ? 'Cerita di balik Kodein di Indralaya Utara, prinsip kerja engineering, dan profil tim inti kami.'
              : isZh
              ? '了解 Kodein 的创立背景、工程原则以及核心管理与技术团队。'
              : 'Our story in North Indralaya, engineering philosophy, and core leadership team.',
          },
          {
            title: t('media'),
            href: '/media-center',
            tag: 'PORTOFOLIO',
            desc: isId
              ? 'Kumpulan studi kasus proyek klien yang telah selesai beserta kabar terbaru dari studio Kodein.'
              : isZh
              ? '查看已交付的真实客户项目案例研究与工作室最新技术动态。'
              : 'Real client project case studies, technical notes, and studio announcements.',
          },
        ],
      },
      {
        title: isId
          ? '3. Keamanan Enterprise & Tata Kelola'
          : isZh
          ? '3. 企业级安全标准与合规治理'
          : '3. Enterprise Security & Governance',
        icon: ShieldCheck,
        items: [
          {
            title: t('governance'),
            href: '/corporate-governance',
            tag: 'OWASP L2',
            desc: isId
              ? 'Arsitektur keamanan berlapis (Edge WAF, CSP, HSTS, Rate-Limiting), standar QA otomatis, dan jaminan NDA.'
              : isZh
              ? '纵深防御安全架构 (Edge WAF, CSP, HSTS)、自动化测试标准与 NDA 保密保障。'
              : 'Defense-in-Depth security controls (Edge WAF, CSP, HSTS), QA standards, and NDA guarantees.',
          },
          {
            title: t('vdp'),
            href: '/vdp',
            tag: 'RFC 9116 • VDP',
            desc: isId
              ? 'Portal resmi bagi peneliti keamanan siber untuk melaporkan temuan celah keamanan teknis (Safe Harbor).'
              : isZh
              ? '面向白帽黑客与安全研究人员的漏洞负责任披露平台 (Safe Harbor)。'
              : 'Official portal for security researchers to report technical vulnerabilities under Safe Harbor.',
          },
          {
            title: t('wbs'),
            href: '/wbs',
            tag: 'RAHASIA • WBS',
            desc: isId
              ? 'Saluran pelaporan rahasia jika ditemukan pelanggaran etika kerja, privasi data, atau penyalahgunaan.'
              : isZh
              ? '面向客户与内部团队的匿名保密举报通道，保护数据隐私与商业道德。'
              : 'Confidential channel to report ethical breaches, NDA violations, or misconduct.',
          },
        ],
      },
      {
        title: isId
          ? '4. Skema Biaya & Konsultasi Proyek'
          : isZh
          ? '4. 合作模式与项目咨询'
          : '4. Engagement Models & Project Inquiry',
        icon: MessageSquareText,
        items: [
          {
            title: t('investor'),
            href: '/investor-relations',
            tag: 'SKEMA KERJA SAMA',
            desc: isId
              ? 'Penjelasan 3 model kontrak: Fixed-Price (Harga Pasti), Dedicated Team (Tim Khusus), dan Maintenance.'
              : isZh
              ? '详解三种合作模式：固定总价项目制、专属技术团队外包与长期运维支持。'
              : 'Compare our 3 contract models: Fixed-Price Project, Dedicated Squad, and SLA Retainer.',
          },
          {
            title: t('help'),
            href: '/help-center',
            tag: 'KONSULTASI GRATIS',
            desc: isId
              ? 'Formulir diskusi proyek, tanya jawab umum (FAQ), dan kontak langsung WhatsApp/Email tim Kodein.'
              : isZh
              ? '常见合作问题解答 (FAQ) 以及在线提交您的项目需求获取免费报价评估。'
              : 'Frequently asked questions (FAQ) and direct form to request a project estimate.',
          },
        ],
      },
    ],
    [isId, isZh, t]
  );

  const filteredGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return directoryGroups;
    return directoryGroups
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (item) =>
            item.title.toLowerCase().includes(q) ||
            item.desc.toLowerCase().includes(q) ||
            item.tag.toLowerCase().includes(q)
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [directoryGroups, searchQuery]);

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
            : 'bg-gradient-to-b from-black/85 via-black/50 to-transparent'
        )}
      >
        <div className="hidden lg:block border-b border-white/10">
          <div className="mx-auto flex max-w-container items-center justify-between px-6 sm:px-10 lg:px-16 xl:px-20 py-2 text-xs text-zinc-300">
            <div className="flex items-center divide-x divide-white/15">
              {entityLinks.map((ent) => {
                const isActive = currentPath === ent.href;
                const isPending = pendingPath === ent.href;
                return (
                  <Link
                    key={ent.href}
                    href={ent.href}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 first:pl-0 transition hover:text-white',
                      isActive && 'font-semibold text-brand-coral'
                    )}
                  >
                    {isActive && (
                      <span
                        className={cn(
                          'h-1.5 w-1.5 rounded-full bg-brand-red',
                          isPending && 'animate-ping'
                        )}
                      />
                    )}
                    <span>{ent.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-5">
              <Link
                href="/media-center"
                className={cn(
                  'transition hover:text-white',
                  currentPath.startsWith('/media-center') && 'font-semibold text-brand-coral'
                )}
              >
                {t('media')}
              </Link>
              <Link
                href="/help-center"
                className={cn(
                  'transition hover:text-white',
                  currentPath === '/help-center' && 'font-semibold text-brand-coral'
                )}
              >
                {t('help')}
              </Link>
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        {/* Main Bar */}
        <div className="mx-auto flex h-20 max-w-container items-center justify-between px-6 sm:px-10 lg:px-16 xl:px-20">
          <Link href="/" aria-label="Kodein Home">
            <BrandLogo variant="dark" />
          </Link>

          <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-6 xl:gap-7">
            <button
              type="button"
              onMouseEnter={() => setActiveMega('about')}
              onClick={() => setActiveMega(activeMega === 'about' ? null : 'about')}
              aria-expanded={activeMega === 'about'}
              className={cn(
                'relative inline-flex items-center gap-1.5 py-2 text-sm font-medium transition',
                currentPath === '/about' ? 'text-brand-red' : 'text-white/90 hover:text-white'
              )}
            >
              <span>{t('about')}</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform duration-200',
                  activeMega === 'about' && 'rotate-180 text-brand-red'
                )}
              />
              {currentPath === '/about' && (
                <span className="absolute inset-x-0 -bottom-0.5 h-[2px] bg-brand-red" />
              )}
            </button>

            <Link
              href="/our-ecosystem"
              onMouseEnter={() => setActiveMega(null)}
              className={cn(
                'relative py-2 text-sm font-medium transition',
                currentPath === '/our-ecosystem' ? 'text-brand-red' : 'text-white/90 hover:text-white'
              )}
            >
              {t('ecosystem')}
              {currentPath === '/our-ecosystem' && (
                <span className="absolute inset-x-0 -bottom-0.5 h-[2px] bg-brand-red" />
              )}
            </Link>

            <button
              type="button"
              onMouseEnter={() => setActiveMega('governance')}
              onClick={() => setActiveMega(activeMega === 'governance' ? null : 'governance')}
              aria-expanded={activeMega === 'governance'}
              className={cn(
                'relative inline-flex items-center gap-1.5 py-2 text-sm font-medium transition',
                ['/corporate-governance', '/wbs', '/vdp'].includes(currentPath)
                  ? 'text-brand-red'
                  : 'text-white/90 hover:text-white'
              )}
            >
              <span>{t('governance')}</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform duration-200',
                  activeMega === 'governance' && 'rotate-180 text-brand-red'
                )}
              />
              {['/corporate-governance', '/wbs', '/vdp'].includes(currentPath) && (
                <span className="absolute inset-x-0 -bottom-0.5 h-[2px] bg-brand-red" />
              )}
            </button>

            <Link
              href="/media-center"
              onMouseEnter={() => setActiveMega(null)}
              className={cn(
                'relative py-2 text-sm font-medium transition',
                currentPath.startsWith('/media-center')
                  ? 'text-brand-red'
                  : 'text-white/90 hover:text-white'
              )}
            >
              {t('media')}
              {currentPath.startsWith('/media-center') && (
                <span className="absolute inset-x-0 -bottom-0.5 h-[2px] bg-brand-red" />
              )}
            </Link>

            <Link
              href="/investor-relations"
              onMouseEnter={() => setActiveMega(null)}
              className={cn(
                'relative py-2 text-sm font-medium transition',
                currentPath === '/investor-relations'
                  ? 'text-brand-red'
                  : 'text-white/90 hover:text-white'
              )}
            >
              {t('investor')}
              {currentPath === '/investor-relations' && (
                <span className="absolute inset-x-0 -bottom-0.5 h-[2px] bg-brand-red" />
              )}
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

        {/* Mega Menu */}
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
                        desc={
                          isId
                            ? 'Rincian lengkap 3 unit layanan (Web/Mobile, Sistem Kustom & AI, Cloud & Server).'
                            : isZh
                            ? '全面了解三大核心业务板块：Web/移动开发、定制系统与云服务器运维。'
                            : 'Full breakdown of our 3 service divisions (Web/Mobile, Custom Systems & AI, Cloud Ops).'
                        }
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

      {/* Interactive Site Directory & Quick Finder Modal (Ctrl+K) */}
      <AnimatePresence>
        {directoryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDirectoryOpen(false)}
            className="fixed inset-0 z-[70] flex items-start justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 md:pt-16 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -12 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl rounded-3xl border border-white/15 bg-brand-charcoal text-white shadow-2xl overflow-hidden"
            >
              {/* Modal Header + Search Bar */}
              <div className="border-b border-white/10 bg-black/40 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <Compass className="h-5 w-5 text-brand-red" />
                    <h2 className="text-lg font-bold">
                      {isId
                        ? 'Peta Situs & Panduan Isi Website Kodein'
                        : isZh
                        ? 'Kodein 全站导航与内容指南'
                        : 'Kodein Interactive Site Directory & Guide'}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDirectoryOpen(false)}
                    className="rounded-lg border border-white/10 p-1.5 text-zinc-400 hover:border-white/30 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="mt-1 text-xs text-zinc-400">
                  {isId
                    ? 'Seluruh halaman di website ini dikelompokkan menjadi 4 kategori jelas di bawah ini agar Anda dapat langsung menuju informasi yang dibutuhkan:'
                    : isZh
                    ? '我们将全站内容整理为以下 4 个清晰类别，方便您快速找到所需信息：'
                    : 'Every page on this website is organized into 4 clear categories below so you can jump straight to what you need:'}
                </p>

                <div className="relative mt-4">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      isId
                        ? 'Ketik yang Anda cari (contoh: website, harga, keamanan, portofolio, kontak)...'
                        : isZh
                        ? '输入关键词搜索页面（例如：网站开发、价格、安全、案例、联系）...'
                        : 'Filter pages (e.g. mobile app, pricing, security, case studies, contact)...'
                    }
                    className="w-full rounded-xl border border-white/15 bg-black/60 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-brand-red focus:outline-none"
                  />
                </div>
              </div>

              {/* Categorized Directory Grid */}
              <div className="max-h-[65vh] overflow-y-auto p-6 space-y-8">
                {filteredGroups.map((group, gIdx) => {
                  const Icon = group.icon;
                  return (
                    <div key={gIdx}>
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-red">
                        <Icon className="h-4 w-4" />
                        <span>{group.title}</span>
                      </div>
                      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {group.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setDirectoryOpen(false)}
                            className="group rounded-xl border border-white/10 bg-black/35 p-4 transition hover:border-brand-red/60 hover:bg-black/60"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-sm text-white group-hover:text-brand-red transition">
                                {item.title}
                              </span>
                              <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[10px] font-bold text-zinc-300">
                                {item.tag}
                              </span>
                            </div>
                            <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                              {item.desc}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
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
                <Link href="/help-center" className="block text-xl font-bold text-brand-red hover:underline">
                  {t('help')} →
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

              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setDirectoryOpen(true);
                }}
                className="flex w-full items-center justify-between rounded-xl border border-brand-red/40 bg-brand-red/10 px-4 py-3.5 text-sm font-semibold text-white"
              >
                <span className="inline-flex items-center gap-2">
                  <Compass className="h-4 w-4 text-brand-red" />
                  <span>{isId ? 'Buka Panduan & Peta Situs' : isZh ? '打开全站导览' : 'Open Site Guide'}</span>
                </span>
                <ArrowUpRight className="h-4 w-4 text-brand-red" />
              </button>
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
