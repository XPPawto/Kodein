'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Download,
  Eye,
  FileText,
  Lock,
  X,
  ShieldCheck,
  Code2,
  Server,
  Cpu,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { HOME_CONTENT } from '@/content/siteData';
import { ASSETS, BLUR_DATA_URL } from '@/content/assets';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { BrandLogo, KodeinMarkSvg } from '@/components/ui/BrandLogo';
import { useCmsData } from '@/lib/cmsClient';
import { formatStatSuffix } from '@/lib/utils';
import { Locale } from '@/i18n';

export function ReportsSection() {
  const locale = useLocale() as Locale;
  const isId = locale === 'id';
  const isZh = locale === 'zh';
  const t = useTranslations('common');
  const { data } = useCmsData();
  const content = HOME_CONTENT.reportsSection;
  const isAvailable = data.reportsAvailable ?? content.reportsAvailable;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [zoom, setZoom] = useState<number>(100);

  const downloadUrl = `/api/deck?locale=${locale}&mode=download`;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreviewOpen(false);
    };
    if (previewOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [previewOpen]);

  const servicePillars = [
    {
      code: 'UNIT 01 • WEB & MOBILE APPS',
      icon: Code2,
      title: isId
        ? 'Pembuatan Website Perusahaan, Web App (SaaS) & Aplikasi Android/iOS'
        : isZh
        ? '企业官网、SaaS 平台与 iOS/Android 移动应用开发'
        : 'Corporate Websites, SaaS Web Apps & iOS/Android Mobile Applications',
      stack: 'Next.js • React • TypeScript • Tailwind CSS • Flutter • React Native • Node.js',
      desc: isId
        ? 'Website profil korporat cepat & SEO-friendly, platform e-commerce, portal web kustom, hingga aplikasi mobile Android & iOS dengan UI/UX modern.'
        : isZh
        ? '打造高速、SEO 友好的企业官网、电商系统、定制 Web 门户及跨平台移动应用。'
        : 'High-conversion corporate websites, e-commerce platforms, custom web portals, and cross-platform mobile apps engineered for speed and SEO.',
    },
    {
      code: 'UNIT 02 • CUSTOM SYSTEMS & AI',
      icon: Cpu,
      title: isId
        ? 'Sistem Operasional Internal (ERP / CRM), Integrasi API & Otomasi AI'
        : isZh
        ? '定制企业管理系统 (ERP/CRM)、API 集成与 AI 自动化'
        : 'Enterprise Operations Software (ERP / CRM), API & AI Automation',
      stack: 'PostgreSQL • Python • Go • REST/GraphQL API • LLM/RAG AI Agents • Docker',
      desc: isId
        ? 'Sistem manajemen operasional kustom, dashboard analitik eksekutif, integrasi payment gateway/pengiriman, serta asisten cerdas berbasis AI.'
        : isZh
        ? '定制开发内部运营看板、库存与财务自动化流程、支付网关 API 集成以及智能 AI 助手。'
        : 'Tailored internal dashboards, inventory/HR/finance workflow automation, payment gateway integrations, and intelligent AI assistants.',
    },
    {
      code: 'UNIT 03 • CLOUD & MAINTENANCE',
      icon: Server,
      title: isId
        ? 'Manajemen Server Cloud, Keamanan Infrastruktur & Perawatan Rutin (SLA)'
        : isZh
        ? '云服务器架构、安全加固与全天候 SLA 运维服务'
        : 'Cloud Server Architecture, Hardening & Managed SLA Maintenance',
      stack: 'AWS • Google Cloud • Linux VPS • Nginx • CI/CD Pipelines • Daily Backup',
      desc: isId
        ? 'Setup arsitektur server cloud stabil, optimasi kecepatan database, backup terenkripsi harian, pemantauan uptime 24/7, dan garansi perbaikan bug.'
        : isZh
        ? '零停机云端部署、服务器安全加固、每日加密备份、24/7 在线监控与优先漏洞修复保障。'
        : 'Zero-downtime deployment, server hardening, daily encrypted backups, 24/7 uptime monitoring, and continuous security patching under SLA.',
    },
  ];

  const securityBullets = isId
    ? [
        'Proteksi Edge WAF Aktif & Standar OWASP ASVS L2 (Anti SQL Injection, XSS, CSRF, Path Traversal).',
        'Hardened HTTP Security Headers (CSP Ketat, HSTS Preload, Anti-Clickjacking, Rate-Limiter Berlapis).',
        'Autentikasi Zero-Trust (Timing-Safe SHA-256 + Token Sesi HMAC-SHA256 HttpOnly & SameSite=Strict).',
        'Jaminan Kerahasiaan Data (NDA Resmi) & Serah Terima 100% Hak Kepemilikan Source Code.',
      ]
    : isZh
    ? [
        '主动边缘 WAF 防火墙与 OWASP ASVS L2 标准（防范 SQL 注入、XSS、CSRF 与路径遍历）。',
        '加固型 HTTP 安全响应头（严格 CSP、HSTS 预加载、防点击劫持与多层速率限制）。',
        '零信任安全认证（防时序攻击 SHA-256 校验 + HMAC-SHA256 签名会话令牌）。',
        '严格的法律保密协议 (NDA) 与 100% 客户源码知识产权移交保障。',
      ]
    : [
        'Active Edge WAF & OWASP ASVS L2 Protection (SQLi, XSS, CSRF, Path Traversal defense).',
        'Strict HTTP Security Headers (CSP, HSTS 2-Year Preload, Anti-Clickjacking, Multi-Tier Rate Limiter).',
        'Zero-Trust Authentication (Timing-Safe SHA-256 + HMAC-SHA256 Signed HttpOnly Sessions).',
        'Strict Non-Disclosure Agreement (NDA) & 100% Client Source Code IP Ownership Handover.',
      ];

  const engagementModels = isId
    ? [
        {
          name: '1. Fixed-Price Project',
          detail:
            'Cocok untuk pembuatan website, profil perusahaan, atau MVP dengan spesifikasi ruang lingkup dan jadwal rilis yang terukur.',
        },
        {
          name: '2. Dedicated Engineering Squad',
          detail:
            'Tim developer & desainer khusus bulanan yang terintegrasi penuh untuk mengembangkan sistem bisnis Anda secara berkelanjutan.',
        },
        {
          name: '3. Managed SLA Retainer',
          detail:
            'Paket perawatan rutin server, pembaruan keamanan berkala, backup harian otomatis, dan dukungan teknis prioritas.',
        },
      ]
    : isZh
    ? [
        {
          name: '1. 固定总价项目制 (Fixed-Price)',
          detail: '适用于需求范围明确的企业官网、电商系统或 MVP 产品开发，按里程碑透明交付。',
        },
        {
          name: '2. 专属工程团队 (Dedicated Squad)',
          detail: '按月配置专属全栈工程师与设计师，深度融入您的长期产品迭代路线图。',
        },
        {
          name: '3. 长期运维保障 (Managed SLA Retainer)',
          detail: '提供全天候服务器监控、安全补丁更新、每日自动备份与优先技术支持。',
        },
      ]
    : [
        {
          name: '1. Fixed-Price Project',
          detail:
            'Ideal for websites, company profiles, or MVPs with clear specifications and milestone-based delivery.',
        },
        {
          name: '2. Dedicated Engineering Squad',
          detail:
            'Monthly dedicated developers and designers integrated directly into your long-term product roadmap.',
        },
        {
          name: '3. Managed SLA Retainer',
          detail:
            'Ongoing server maintenance, continuous security patching, daily backups, and priority bug resolution.',
        },
      ];

  return (
    <section className="relative overflow-hidden bg-brand-dark py-24 md:py-32 border-b border-white/10">
      <div className="mx-auto max-w-container px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div
              onClick={() => isAvailable && setPreviewOpen(true)}
              role={isAvailable ? 'button' : undefined}
              tabIndex={isAvailable ? 0 : undefined}
              onKeyDown={(e) => {
                if (isAvailable && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  setPreviewOpen(true);
                }
              }}
              className="group relative mx-auto aspect-[4/5] max-w-md cursor-pointer overflow-hidden rounded-2xl border border-white/15 bg-brand-charcoal shadow-card transition duration-300 hover:border-brand-red/70"
            >
              <Image
                src={ASSETS.reports.cover}
                alt="Kodein Company Profile & Capabilities Deck"
                fill
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover opacity-60 transition duration-500 group-hover:scale-105 group-hover:opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent p-8 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <BrandLogo variant="dark" size="sm" />
                  <span className="rounded bg-brand-red px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
                    2026 EDITION • PDF
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                    {content.eyebrow[locale]}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-white">
                    Kodein Software & Web Capabilities Deck
                  </h3>
                  {isAvailable && (
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition group-hover:border-brand-red group-hover:bg-brand-red">
                      <Eye className="h-3.5 w-3.5" />
                      <span>
                        {isId
                          ? 'Klik untuk Pratinjau Dokumen'
                          : isZh
                          ? '点击在线预览手册'
                          : 'Click to Preview Document'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
              <span className="rounded bg-brand-red/15 px-2 py-0.5 font-mono text-[11px] text-brand-red">
                05 / 07
              </span>
              <span>{content.eyebrow[locale]}</span>
            </div>

            <h2 className="text-fluid-h2 font-bold text-white">
              {content.headline[locale]}
            </h2>

            <p className="text-base md:text-lg leading-relaxed text-zinc-400 max-w-2xl">
              {content.subtext[locale]}
            </p>

            {/* Document Metadata Strip */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-mono">
                <FileText className="h-3.5 w-3.5 text-brand-red" />
                PDF • 2 {isId ? 'Halaman Eksekutif' : isZh ? '页完整版' : 'Executive Pages'}
              </span>
              <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-mono">
                {isId
                  ? 'Isi: Profil, 3 Layanan, Tech Stack, Keamanan OWASP & Skema Kerja Sama'
                  : isZh
                  ? '包含：简介、三大服务、技术栈、安全标准与合作模式'
                  : 'Includes: Profile, 3 Service Pillars, Tech Stack, OWASP Security & Pricing Models'}
              </span>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              {isAvailable ? (
                <>
                  <button
                    type="button"
                    onClick={() => setPreviewOpen(true)}
                    className="inline-flex items-center gap-2.5 rounded-full bg-brand-red px-7 py-4 text-sm font-bold text-white transition hover:bg-brand-redHover shadow-lg"
                  >
                    <Eye className="h-4 w-4" />
                    <span>
                      {isId
                        ? 'Lihat Isi PDF'
                        : isZh
                        ? '在线预览 PDF'
                        : 'Preview PDF Document'}
                    </span>
                  </button>

                  <a
                    href={downloadUrl}
                    download
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-4 text-sm font-semibold text-white transition hover:border-brand-red hover:bg-white/10"
                  >
                    <Download className="h-4 w-4 text-brand-red" />
                    <span>
                      {isId
                        ? 'Unduh PDF (2026)'
                        : isZh
                        ? '下载 PDF 手册 (2026)'
                        : 'Download PDF (2026)'}
                    </span>
                  </a>

                  <Button href="/help-center" variant="outline">
                    {isId
                      ? 'Minta Estimasi Proyek'
                      : isZh
                      ? '获取项目报价评估'
                      : 'Request Project Estimate'}
                  </Button>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-zinc-300">
                    <Lock className="h-4 w-4 text-brand-red" />
                    <span>PDF {t('comingSoon')}</span>
                  </div>
                  <Button href="/help-center" variant="primary">
                    {isId
                      ? 'Minta Estimasi Proyek'
                      : isZh
                      ? '获取项目报价评估'
                      : 'Request Project Estimate'}
                  </Button>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </div>

      {/* Native In-App PDF Document Reader Modal (Immune to IDM / Browser Download Interception) */}
      <AnimatePresence>
        {previewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewOpen(false)}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-3 sm:p-6 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/15 bg-brand-charcoal text-white shadow-2xl"
            >
              {/* Reader Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-black/60 px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-red/15 text-brand-red">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Kodein-Capabilities-Deck-2026.pdf
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      {isId
                        ? '2 Halaman Eksekutif • Pratinjau Langsung (Tanpa Download Otomatis)'
                        : isZh
                        ? '2 页完整版 • 内置文档阅读器（免下载直接预览）'
                        : '2 Executive Pages • Built-in Document Reader'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Zoom Controls */}
                  <div className="hidden md:flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1">
                    <button
                      type="button"
                      onClick={() => setZoom((z) => Math.max(80, z - 10))}
                      aria-label="Zoom Out"
                      className="p-1 text-zinc-400 hover:text-white"
                    >
                      <ZoomOut className="h-3.5 w-3.5" />
                    </button>
                    <span className="px-1.5 font-mono text-[11px] text-zinc-300">{zoom}%</span>
                    <button
                      type="button"
                      onClick={() => setZoom((z) => Math.min(125, z + 10))}
                      aria-label="Zoom In"
                      className="p-1 text-zinc-400 hover:text-white"
                    >
                      <ZoomIn className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <a
                    href={downloadUrl}
                    download
                    className="inline-flex items-center gap-1.5 rounded-lg bg-brand-red px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-redHover"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>
                      {isId ? 'Unduh File PDF' : isZh ? '下载 PDF 文件' : 'Download PDF File'}
                    </span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setPreviewOpen(false)}
                    aria-label="Close Preview"
                    className="rounded-lg border border-white/10 p-2 text-zinc-400 transition hover:border-white/30 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable A4 Document Canvas */}
              <div className="flex-1 overflow-y-auto bg-zinc-950/90 p-4 sm:p-8 space-y-8">
                <div
                  style={{ maxWidth: `${Math.round((820 * zoom) / 100)}px` }}
                  className="mx-auto space-y-8 transition-all duration-200"
                >
                  {/* ==================== PAGE 01 / 02 ==================== */}
                  <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#0E0E11] shadow-2xl">
                    {/* Top Red Accent Bar */}
                    <div className="h-3 w-full bg-brand-red" />

                    <div className="p-6 sm:p-10 md:p-12 space-y-8">
                      {/* Page Header */}
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
                        <BrandLogo variant="dark" size="md" />
                        <span className="rounded bg-brand-red px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-white">
                          2026 EDITION • OFFICIAL DECK
                        </span>
                      </div>

                      {/* Cover Title Block */}
                      <div className="border-l-4 border-brand-red pl-5 py-1">
                        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
                          KODEIN SOFTWARE & WEB STUDIO
                        </p>
                        <h4 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
                          {isId
                            ? 'Profil Studio, Kapabilitas Teknis & Panduan Kerja Sama'
                            : isZh
                            ? '工作室简介、技术能力、安全架构与合作指南'
                            : 'Company Profile, Technical Capabilities & Engagement Guide'}
                        </h4>
                        <p className="mt-2 text-sm text-zinc-400">
                          {data.address}
                        </p>
                      </div>

                      {/* 01. Executive Summary Box */}
                      <div className="rounded-xl border border-brand-red/40 bg-brand-charcoal p-6">
                        <div className="font-mono text-xs font-bold uppercase tracking-wider text-brand-red">
                          {isId
                            ? '01  |  RINGKASAN EKSEKUTIF STUDIO KODEIN'
                            : isZh
                            ? '01  |  KODEIN 工作室执行摘要'
                            : '01  |  EXECUTIVE SUMMARY'}
                        </div>
                        <p className="mt-3 text-sm sm:text-base font-medium text-white leading-relaxed">
                          {data.aboutStatement[locale]}
                        </p>
                        <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                          {data.aboutSupporting[locale]}
                        </p>
                      </div>

                      {/* 02. Verified Studio Track Record (6 Stats) */}
                      <div>
                        <div className="font-mono text-xs font-bold uppercase tracking-wider text-brand-red">
                          {isId
                            ? '02  |  REKAM JEJAK & ANGKA CAPAIAN PRODUKSI KODEIN'
                            : isZh
                            ? '02  |  核心交付记录与生产数据'
                            : '02  |  VERIFIED STUDIO TRACK RECORD & METRICS'}
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                          {data.stats.map((st) => (
                            <div
                              key={st.id}
                              className="rounded-xl border border-white/10 bg-black/45 p-4"
                            >
                              <div className="text-2xl font-extrabold text-brand-red">
                                {st.prefix || ''}
                                {st.value}
                                {formatStatSuffix(st.suffix, locale)}
                              </div>
                              <div className="mt-1 text-xs font-bold text-white">
                                {st.label[locale]}
                              </div>
                              <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">
                                {st.description[locale]}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Page 1 Footer */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-5 font-mono text-[11px] text-zinc-400">
                        <span>
                          KODEIN STUDIO • {data.email} • {data.phone}
                        </span>
                        <span className="font-bold text-brand-red">PAGE 01 / 02</span>
                      </div>
                    </div>
                  </div>

                  {/* ==================== PAGE 02 / 02 ==================== */}
                  <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#0E0E11] shadow-2xl">
                    <div className="h-3 w-full bg-brand-red" />

                    <div className="p-6 sm:p-10 md:p-12 space-y-8">
                      {/* 03. 3 Service Pillars */}
                      <div>
                        <div className="font-mono text-xs font-bold uppercase tracking-wider text-brand-red">
                          {isId
                            ? '03  |  TIGA PILAR LAYANAN UTAMA & TEKNOLOGI KODEIN'
                            : isZh
                            ? '03  |  三大核心工程服务与技术栈'
                            : '03  |  CORE ENGINEERING SERVICES & TECH STACK'}
                        </div>

                        <div className="mt-4 space-y-3.5">
                          {servicePillars.map((pil) => {
                            const Icon = pil.icon;
                            return (
                              <div
                                key={pil.code}
                                className="rounded-xl border border-white/10 border-l-4 border-l-brand-red bg-black/45 p-5"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-mono text-[11px] font-bold text-brand-red">
                                    {pil.code}
                                  </span>
                                  <Icon className="h-4 w-4 text-zinc-400" />
                                </div>
                                <h5 className="mt-1.5 text-base font-bold text-white">
                                  {pil.title}
                                </h5>
                                <p className="mt-1 font-mono text-[11px] text-zinc-300">
                                  {pil.stack}
                                </p>
                                <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                                  {pil.desc}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* 04. Enterprise Security Standards */}
                      <div className="rounded-xl border border-white/15 bg-brand-charcoal p-6">
                        <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-brand-red">
                          <ShieldCheck className="h-4 w-4" />
                          <span>
                            {isId
                              ? '04  |  STANDAR KEAMANAN ENTERPRISE & JAMINAN HUKUM (NDA)'
                              : isZh
                              ? '04  |  企业级安全标准 (OWASP ASVS L2) 与保密协议'
                              : '04  |  ENTERPRISE SECURITY STANDARDS (OWASP ASVS L2)'}
                          </span>
                        </div>
                        <ul className="mt-3.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                          {securityBullets.map((item, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-xs leading-relaxed text-zinc-300"
                            >
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-red mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* 05. Engagement Models */}
                      <div>
                        <div className="font-mono text-xs font-bold uppercase tracking-wider text-brand-red">
                          {isId
                            ? '05  |  MODEL KERJA SAMA & SKEMA KONTRAK'
                            : isZh
                            ? '05  |  合作模式与交付方案'
                            : '05  |  ENGAGEMENT MODELS & HOW TO START'}
                        </div>
                        <div className="mt-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                          {engagementModels.map((m, idx) => (
                            <div
                              key={idx}
                              className="rounded-xl border border-white/10 bg-black/45 p-4"
                            >
                              <div className="text-xs font-bold text-white">{m.name}</div>
                              <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-400">
                                {m.detail}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA Banner */}
                      <div className="rounded-xl bg-brand-red p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm sm:text-base font-extrabold">
                            <KodeinMarkSvg variant="white" className="h-5 w-5" />
                            <span>
                              {isId
                                ? 'SIAP MEMBANGUN WEBSITE ATAU SISTEM BERSAMA KODEIN?'
                                : isZh
                                ? '准备好与 KODEIN 一起构建您的数字化产品了吗？'
                                : 'READY TO BUILD YOUR NEXT DIGITAL PRODUCT WITH KODEIN?'}
                            </span>
                          </div>
                          <p className="text-xs text-white/90">
                            Email: {data.email} • WhatsApp: {data.phone}
                          </p>
                        </div>
                        <a
                          href={downloadUrl}
                          download
                          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-black px-5 py-2.5 text-xs font-bold text-white transition hover:bg-zinc-900"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>
                            {isId ? 'Simpan PDF' : isZh ? '保存 PDF' : 'Save PDF'}
                          </span>
                        </a>
                      </div>

                      {/* Page 2 Footer */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-5 font-mono text-[11px] text-zinc-400">
                        <span>KODEIN SOFTWARE & WEB CAPABILITIES DECK (2026 EDITION)</span>
                        <span className="font-bold text-brand-red">PAGE 02 / 02</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
