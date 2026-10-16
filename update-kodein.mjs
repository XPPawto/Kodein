import fs from 'fs';
import path from 'path';

const files = {
  'src/i18n.ts': `import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

export const locales = ['id', 'en', 'zh'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'id';

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    messages: (await import(\`../messages/\${locale}.json\`)).default,
  };
});
`,

  'src/middleware.ts': `import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export const config = {
  matcher: ['/', '/(id|en|zh)/:path*', '/((?!api|_next|_vercel|.*\\\\..*).*)'],
};
`,

  'src/lib/tokens.ts': `export const DESIGN_TOKENS = {
  brand: {
    name: 'Kodein',
    shortName: 'Kodein',
    legalName: 'Kodein — Studio Pembuatan Website & Rekayasa Perangkat Lunak',
    domain: 'https://www.kodein.id',
    address: 'Gang Lampung 1, Indralaya Utara, Kabupaten Ogan Ilir, Sumatera Selatan, Indonesia',
    email: 'halo@kodein.id',
    irEmail: 'project@kodein.id',
    phone: '+62 812 7000 8900',
    socials: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
    },
    logos: {
      faviconIco: '/favicon.ico',
      mark: '/assets/brand/kodein-mark.svg',
      markGradient: '/assets/brand/kodein-mark-gradient.svg',
      markWhite: '/assets/brand/kodein-mark-white.svg',
      markBlack: '/assets/brand/kodein-mark-black.svg',
      profileDark: '/assets/brand/kodein-profile-dark.svg',
      profileRed: '/assets/brand/kodein-profile-red.svg',
      profileWhite: '/assets/brand/kodein-profile-white.svg',
      horizontalLight: '/assets/brand/kodein-logo-horizontal.svg',
      horizontalDark: '/assets/brand/kodein-logo-horizontal-dark.svg',
      horizontalMonoWhite: '/assets/brand/kodein-logo-horizontal-mono-white.svg',
    },
  },
  colors: {
    black: '#000000',
    dark: '#0A0A0A',
    surface: '#141210',
    red: '#EE2B10',
    redHover: '#C91F08',
    coral: '#FF5526',
    white: '#FFFFFF',
    lightBg: '#F8F9FA',
  },
  motion: {
    easing: [0.22, 1, 0.36, 1] as [number, number, number, number],
    duration: {
      fast: 0.25,
      base: 0.5,
      slow: 0.85,
    },
  },
} as const;
`,

  'src/lib/utils.ts': `import { clsx, type ClassValue } from 'clsx';
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
`,

  'messages/id.json': `{
  "nav": {
    "mainSite": "Kodein",
    "dam": "Web & Aplikasi Mobile",
    "dim": "Sistem Kustom & AI",
    "ddmf": "Server & Maintenance",
    "about": "Tentang Kodein",
    "aboutDesc": "Cara kami bekerja, prinsip koding, dan tim di balik Kodein.",
    "ecosystem": "Layanan Kami",
    "governance": "Standar Kerja",
    "governanceDesc": "Kualitas kode, garansi bug, kerahasiaan data (NDA), dan keamanan sistem.",
    "wbs": "Lapor Bug & Kendala",
    "wbsDesc": "Saluran langsung untuk melaporkan celah keamanan atau kendala teknis.",
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
    "otherLinks": "Akses Cepat",
    "pressReleases": "Catatan & Studi Kasus",
    "investorRelations": "Skema Kerja Sama",
    "wbs": "Lapor Bug / Keamanan",
    "vdp": "Mulai Diskusi Proyek",
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
    "governance": "Work Standards",
    "governanceDesc": "Code quality, bug warranty, strict NDA protection, and system security.",
    "wbs": "Report a Bug",
    "wbsDesc": "Direct channel for reporting security vulnerabilities or technical issues.",
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
    "otherLinks": "Quick Links",
    "pressReleases": "Case Studies & Notes",
    "investorRelations": "Engagement Models",
    "wbs": "Bug & Security Report",
    "vdp": "Book a Consultation",
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
    "governance": "工程标准",
    "governanceDesc": "代码质量保证、售后保修、严格的保密协议 (NDA) 与系统安全。",
    "wbs": "漏洞与问题反馈",
    "wbsDesc": "直接提交安全漏洞或技术故障的加密通道。",
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
    "otherLinks": "快捷链接",
    "pressReleases": "项目案例与技术动态",
    "investorRelations": "合作与交付模式",
    "wbs": "安全漏洞反馈",
    "vdp": "预约项目咨询",
    "rights": "保留所有权利。"
  }
}
`,

  'src/content/types.ts': `export type ArticleCategory = 'press-release' | 'announcement';

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
`,

  'src/content/siteData.ts': `import { ASSETS } from './assets';
import { EntityDetailData, MilestoneItem, ScopeEntity, StatItem } from './types';

export const HOME_CONTENT = {
  aboutIntro: {
    eyebrow: { id: 'Tentang Kodein', en: 'About Kodein', zh: '关于 Kodein' },
    statement: {
      id: 'Kodein membangun website, aplikasi web, dan perangkat lunak kustom yang dirancang agar cepat diakses, mudah dipakai, dan benar-benar membantu operasional bisnis Anda.',
      en: 'Kodein builds websites, web apps, and custom software engineered to load fast, feel intuitive, and solve real operational problems for your business.',
      zh: 'Kodein 专注于打造加载迅速、交互直观且能真正解决企业实际运营痛点的网站、Web 应用与定制软件系统。',
    },
    supporting: {
      id: 'Berangkat dari studio kami di Gang Lampung 1, Indralaya Utara, Kabupaten Ogan Ilir, Sumatera Selatan, kami mengerjakan proyek digital untuk UMKM, institusi pendidikan, hingga perusahaan nasional. Kami tidak sekadar menjual tampilan—kami menulis kode yang bersih dan mudah dirawat untuk jangka panjang.',
      en: 'Operating from our studio at Gang Lampung 1, Indralaya Utara, Ogan Ilir, South Sumatra, we craft digital products for growing businesses, educational institutions, and national enterprises. We don’t just ship pretty screens—we write clean, maintainable code built for the long haul.',
      zh: '我们的技术工作室位于南苏门答腊省奥干伊利尔县 (Ogan Ilir) 北印德拉拉亚 Gang Lampung 1。我们为成长型企业、教育机构及全国性公司提供数字化开发服务，坚持编写整洁、可长期维护的高质量代码。',
    },
  },
  scopeSection: {
    eyebrow: { id: 'Layanan Kami', en: 'What We Build', zh: '核心业务领域' },
    headline: {
      id: 'Mulai dari website profil perusahaan yang rapi hingga sistem operasional internal yang kompleks, semua kami rancang dari nol sesuai kebutuhan Anda.',
      en: 'From sharp company profile websites to complex internal software systems, everything is built from scratch around how your business actually works.',
      zh: '从精致的企业官网到复杂的内部业务管理系统，所有产品均根据您的实际业务流程量身定制。',
    },
  },
  statsSection: {
    eyebrow: { id: 'Kinerja Nyata', en: 'Real Track Record', zh: '真实交付数据' },
    headline: {
      id: 'Hasil Kerja Kodein dalam Angka',
      en: 'Kodein Work in Numbers',
      zh: 'Kodein 交付成果数据',
    },
  },
  reportsSection: {
    eyebrow: { id: 'Portofolio & Panduan Harga', en: 'Portfolio & Pricing Guide', zh: '作品集与报价指南' },
    headline: {
      id: 'Unduh ringkasan portofolio, rincian paket pembuatan website, serta estimasi waktu pengerjaan di Kodein.',
      en: 'Download our portfolio booklet, website development packages, and transparent project timeline estimates.',
      zh: '下载 Kodein 官方作品集手册、网站与软件开发套餐明细以及透明的项目周期评估表。',
    },
    subtext: {
      id: 'Ingin langsung berdiskusi soal ide aplikasi atau peremajaan website lama Anda? Tim kami siap membantu menghitungkan estimasi biaya tanpa komitmen awal.',
      en: 'Want to talk directly about an app idea or revamping an outdated website? Our team is happy to map out a scope and cost estimate with zero obligation.',
      zh: '想要直接探讨您的应用创意或旧网站改版方案？我们的技术团队随时为您提供免费的架构建议与费用评估。',
    },
    reportsAvailable: false,
  },
  journeySection: {
    eyebrow: { id: 'Perjalanan Kami', en: 'Our Journey', zh: '发展历程' },
    headline: {
      id: 'Tumbuh Bersama Klien dari Ogan Ilir untuk Indonesia',
      en: 'Growing with Our Clients from Ogan Ilir to Across Indonesia',
      zh: '从奥干伊利尔走向全印尼的成长足迹',
    },
    launchLabel: {
      id: 'Awal Mula Kodein',
      en: 'Where Kodein Started',
      zh: 'Kodein 创立起点',
    },
  },
  quoteSection: {
    beforeHighlight: {
      id: '“Website dan software yang baik itu sederhana ukurannya: ',
      en: '“Good software is measured simply: ',
      zh: '“衡量优秀网站与软件的标准其实很简单：',
    },
    highlight: {
      id: 'cepat dibuka, tidak membingungkan pengguna, dan langsung mempermudah pekerjaan sehari-hari',
      en: 'it loads fast, never confuses the user, and genuinely makes daily work easier',
      zh: '打开迅速、操作不繁琐，并且能真正让日常业务工作变得更轻松',
    },
    afterHighlight: {
      id: '—bukan sekadar terlihat canggih di atas kertas.”',
      en: '—rather than just sounding impressive on paper.”',
      zh: '——而不是仅仅停留在纸面上的华丽概念。”',
    },
    author: {
      id: 'Tim Engineer Kodein',
      en: 'Kodein Engineering Team',
      zh: 'Kodein 工程研发团队',
    },
    occasion: {
      id: 'Indralaya Utara, Kabupaten Ogan Ilir — Sumatera Selatan',
      en: 'Indralaya Utara, Ogan Ilir Regency — South Sumatra',
      zh: '印尼南苏门答腊省 · 奥干伊利尔县 · 北印德拉拉亚',
    },
  },
};

export const SCOPE_ENTITIES: ScopeEntity[] = [
  {
    id: 'main',
    code: 'KODEIN',
    title: { id: 'Studio Utama Kodein', en: 'Kodein Core Studio', zh: 'Kodein 核心工作室' },
    shortDesc: {
      id: 'Konsultasi teknis, perancangan UI/UX, dan arsitektur perangkat lunak langsung dari markas kami di Indralaya Utara.',
      en: 'Technical consultation, UI/UX design, and software architecture led directly from our studio in Indralaya Utara.',
      zh: '由我们位于北印德拉拉亚的工作室直接提供技术咨询、UI/UX 设计与软件系统架构。',
    },
    href: '/about',
    image: ASSETS.scope.main,
  },
  {
    id: 'dam',
    code: 'WEB & APP',
    title: { id: 'Web & Aplikasi Mobile', en: 'Web & Mobile Apps', zh: '网站与移动应用开发' },
    shortDesc: {
      id: 'Pembuatan website profil perusahaan, toko online, landing page, hingga aplikasi Android & iOS yang ringan dan responsif.',
      en: 'Company profile websites, online stores, landing pages, and responsive Android & iOS mobile applications.',
      zh: '定制高品质企业官网、电商平台、营销落地页以及流畅的 Android 与 iOS 移动应用。',
    },
    href: '/dam',
    image: ASSETS.scope.dam,
  },
  {
    id: 'dim',
    code: 'SOFTWARE & AI',
    title: { id: 'Sistem Kustom & AI', en: 'Custom Systems & AI', zh: '定制软件与人工智能' },
    shortDesc: {
      id: 'Pembuatan aplikasi kasir/POS, sistem stok gudang, sistem akademik, dashboard laporan, dan chatbot AI pintar.',
      en: 'Custom POS systems, warehouse inventory, academic portals, executive dashboards, and smart AI chatbots.',
      zh: '开发定制收银/POS系统、仓储库存管理、教务平台、数据看板及智能 AI 客服助手。',
    },
    href: '/dim',
    image: ASSETS.scope.dim,
  },
  {
    id: 'ddmf',
    code: 'SERVER & CARE',
    title: { id: 'Server, Cloud & Maintenance', en: 'Cloud & Maintenance', zh: '云端部署与系统运维' },
    shortDesc: {
      id: 'Pengaturan domain, VPS/cloud server, pengamanan SSL, backup rutin, dan perawatan website agar tidak pernah down.',
      en: 'Domain setup, VPS/cloud hosting, SSL security, automated backups, and ongoing website care.',
      zh: '提供域名配置、云服务器部署、SSL 安全加固、定期自动备份及全天候网站维护服务。',
    },
    href: '/ddmf',
    image: ASSETS.scope.ddmf,
  },
];

export const STATISTICS_DATA: StatItem[] = [
  {
    id: 'projects-delivered',
    value: 120,
    suffix: '+',
    label: { id: 'Proyek Web & Aplikasi Selesai', en: 'Web & App Projects Shipped', zh: '已交付网站与应用项目' },
    description: {
      id: 'Website perusahaan, sistem informasi, dan aplikasi mobile yang telah berjalan aktif digunakan klien.',
      en: 'Company websites, information systems, and mobile apps actively running in production.',
      zh: '已正式上线并稳定运行的企业网站、信息管理系统与移动应用程序。',
    },
  },
  {
    id: 'system-uptime',
    value: 99,
    suffix: '.9%',
    label: { id: 'Stabilitas Server Klien', en: 'Client Server Uptime', zh: '客户服务器稳定在线率' },
    description: {
      id: 'Website dan sistem klien tetap menyala dan stabil berkat konfigurasi server yang terpantau setiap hari.',
      en: 'Client websites stay online and responsive thanks to well-configured, actively monitored servers.',
      zh: '依托严谨的服务器配置与日常监控，确保客户网站与业务系统全天候稳定访问。',
    },
  },
  {
    id: 'page-speed',
    value: 96,
    suffix: '/100',
    label: { id: 'Rata-rata Skor Kecepatan Web', en: 'Avg. Google PageSpeed Score', zh: '平均网页性能评分' },
    description: {
      id: 'Website ringan dibuka baik dari jaringan Wi-Fi kantor maupun sinyal seluler di berbagai daerah.',
      en: 'Pages load quickly on both office fiber connections and mobile networks across regions.',
      zh: '无论是在办公宽带还是移动网络环境下，网页均能实现秒级流畅加载。',
    },
  },
  {
    id: 'client-retention',
    value: 92,
    suffix: '%',
    label: { id: 'Klien Memesan Kembali', en: 'Repeat & Referral Clients', zh: '客户复购与转介绍率' },
    description: {
      id: 'Mayoritas klien kembali mempercayakan penambahan fitur baru atau merekomendasikan Kodein ke rekan bisnisnya.',
      en: 'Most clients return for phase-two features or recommend Kodein to their business partners.',
      zh: '绝大多数客户在后续功能升级时继续选择 Kodein，并向商业伙伴主动推荐。',
    },
  },
  {
    id: 'faster-delivery',
    value: 14,
    suffix: ' Hari',
    label: { id: 'Rilis Website Profil Standar', en: 'Standard Web Turnaround (Days)', zh: '标准官网交付周期（天）' },
    description: {
      id: 'Proses pengerjaan terstruktur sehingga website profil bisnis Anda bisa tayang tepat waktu tanpa molor.',
      en: 'Structured workflows ensure your company profile website launches on schedule without dragging on.',
      zh: '标准化的敏捷开发流程，确保您的企业官网按期高质量上线，绝不拖延。',
    },
  },
  {
    id: 'support-response',
    prefix: '<',
    value: 30,
    suffix: 'm',
    label: { id: 'Respons Bantuan Teknis', en: 'Tech Support Response Time', zh: '技术支持平均响应时间' },
    description: {
      id: 'Komunikasi langsung dengan tim developer via WhatsApp atau grup proyek tanpa birokrasi berbelit.',
      en: 'Direct communication with our developers via WhatsApp or project channels—no ticket runarounds.',
      zh: '通过项目群直接与开发工程师沟通，省去繁琐流程，快速解决技术问题。',
    },
  },
];

export const TIMELINE_MILESTONES: MilestoneItem[] = [
  {
    id: 'm1',
    month: { id: 'Feb', en: 'Feb', zh: '2月' },
    day: '24',
    year: '2025',
    title: {
      id: 'Kodein Berdiri di Indralaya Utara, Ogan Ilir',
      en: 'Kodein Founded in Indralaya Utara, Ogan Ilir',
      zh: 'Kodein 在南苏门答腊北印德拉拉亚正式创立',
    },
    description: {
      id: 'Memulai langkah dari Gang Lampung 1, Indralaya Utara, dengan fokus membantu bisnis dan instansi lokal memiliki website profesional.',
      en: 'Started at Gang Lampung 1, Indralaya Utara, helping local businesses and institutions build professional websites.',
      zh: '从北印德拉拉亚 Gang Lampung 1 起步，致力于帮助本地企业与机构建设专业网站。',
    },
    image: ASSETS.timeline.m1,
    isCap: true,
  },
  {
    id: 'm2',
    month: { id: 'Mei', en: 'May', zh: '5月' },
    day: '15',
    year: '2025',
    title: {
      id: 'Pengembangan Sistem Informasi & Web App Kustom',
      en: 'Expanding into Custom Web Apps & Information Systems',
      zh: '拓展定制 Web 应用与信息管理系统业务',
    },
    description: {
      id: 'Mengerjakan berbagai proyek sistem inventaris, portal pendidikan, dan dashboard operasional di Sumatera Selatan.',
      en: 'Delivering inventory platforms, educational portals, and operational dashboards across South Sumatra.',
      zh: '为南苏门答腊多家机构成功交付库存管理平台、教育门户与运营数据看板。',
    },
    image: ASSETS.timeline.m2,
  },
  {
    id: 'm3',
    month: { id: 'Agu', en: 'Aug', zh: '8月' },
    day: '28',
    year: '2025',
    title: {
      id: 'Layanan Aplikasi Mobile & Integrasi Pembayaran Digital',
      en: 'Mobile Apps & Digital Payment Gateway Integration',
      zh: '推出移动应用开发与数字支付集成服务',
    },
    description: {
      id: 'Membantu UMKM dan perusahaan ritel meluncurkan aplikasi pemesanan di Android & iOS lengkap dengan QRIS dan Virtual Account.',
      en: 'Helping retail brands launch Android & iOS ordering apps integrated with QRIS and Virtual Accounts.',
      zh: '助力零售品牌上线支持 QRIS 与虚拟账户支付的 Android 及 iOS 订购应用。',
    },
    image: ASSETS.timeline.m3,
  },
  {
    id: 'm4',
    month: { id: 'Des', en: 'Dec', zh: '12月' },
    day: '12',
    year: '2025',
    title: {
      id: 'Penerapan CMS Mandiri & Otomasi AI untuk Klien',
      en: 'Self-Service CMS & AI Automation Rollout',
      zh: '全面上线自主 CMS 后台与 AI 业务自动化方案',
    },
    description: {
      id: 'Menghadirkan CMS yang sangat mudah dioperasikan oleh tim non-teknis serta integrasi chatbot layanan pelanggan.',
      en: 'Shipping intuitive CMS dashboards for non-technical teams alongside automated AI customer support.',
      zh: '为非技术团队打造极简易用的 CMS 管理系统，并集成全天候 AI 智能客服。',
    },
    image: ASSETS.timeline.m4,
  },
  {
    id: 'm5',
    month: { id: 'Okt', en: 'Oct', zh: '10月' },
    day: '16',
    year: '2026',
    title: {
      id: 'Melayani Klien Lintas Provinsi dengan Standar Global',
      en: 'Serving Cross-Province Clients with Global Engineering Standards',
      zh: '以国际工程标准服务全印尼跨省市客户',
    },
    description: {
      id: 'Tetap berkantor di Ogan Ilir sambil melayani pembuatan website dan software untuk klien di Palembang, Jakarta, hingga luar negeri.',
      en: 'Rooted in Ogan Ilir while building websites and software for clients in Palembang, Jakarta, and abroad.',
      zh: '立足奥干伊利尔，为巨港、雅加达及海外客户提供高水准的网站与软件工程服务。',
    },
    image: ASSETS.timeline.m5,
  },
];

export const ENTITY_DETAILS: Record<'dam' | 'dim' | 'ddmf', EntityDetailData> = {
  dam: {
    slug: 'dam',
    code: 'WEB & APP',
    name: {
      id: 'Pembuatan Website & Aplikasi Mobile',
      en: 'Website & Mobile App Development',
      zh: '网站建设与移动应用开发',
    },
    tagline: {
      id: 'Website yang rapi, cepat dibuka di HP maupun laptop, serta dilengkapi halaman admin (CMS) agar Anda mudah mengubah isi konten kapan saja.',
      en: 'Clean, fast-loading websites and mobile apps equipped with an easy CMS so your team can update content anytime.',
      zh: '打造在手机与电脑端均极速加载的精美网站与移动应用，并配备易用的 CMS 后台方便您随时更新内容。',
    },
    heroImage: ASSETS.scope.dam,
    overview: {
      id: [
        'Banyak bisnis memiliki website yang lambat, tampilannya berantakan saat dibuka di HP, atau sulit diedit karena bergantung terus pada developer lama. Di Kodein, kami membereskan masalah tersebut dari akar.',
        'Setiap website dan aplikasi mobile yang kami kerjakan dirancang khusus mengikuti identitas bisnis Anda, dioptimalkan agar mudah ditemukan di Google (SEO), dan diserahkan lengkap dengan panduan penggunaannya.',
      ],
      en: [
        'Too many businesses are stuck with slow websites that break on mobile screens or require calling a developer just to fix a typo. At Kodein, we solve that from day one.',
        'Every website and mobile app we build is custom-designed for your brand, structured for Google search visibility (SEO), and handed over with a clean admin dashboard.',
      ],
      zh: [
        '许多企业的旧网站存在加载缓慢、手机端排版错乱，或修改一行文字都要找开发人员的痛点。Kodein 从底层架构出发为您彻底解决这些问题。',
        '我们开发的每一个网站与移动应用均根据您的品牌量身定制，内置搜索引擎优化 (SEO) 架构，并交付直观的管理后台。',
      ],
    },
    focusAreas: [
      {
        title: {
          id: 'Website Company Profile & Instansi',
          en: 'Company Profile & Institutional Websites',
          zh: '企业官网与机构门户网站',
        },
        description: {
          id: 'Tampilan berwibawa, mendukung multi-bahasa (Indonesia, Inggris, Mandarin), dan langsung membangun kepercayaan calon klien.',
          en: 'Authoritative design with trilingual support (ID, EN, ZH) built to earn instant trust from prospective clients.',
          zh: '大气专业的视觉设计，支持印尼语、英语、中文三语切换，快速建立客户信任。',
        },
      },
      {
        title: {
          id: 'Toko Online (E-Commerce) & Katalog Produk',
          en: 'E-Commerce & Digital Product Catalogs',
          zh: '电商平台与在线产品目录',
        },
        description: {
          id: 'Lengkap dengan keranjang belanja, hitung ongkos kirim otomatis, pembayaran QRIS/transfer, hingga tombol order ke WhatsApp.',
          en: 'Complete with shopping cart, automated shipping rates, QRIS/bank checkout, or direct WhatsApp ordering.',
          zh: '集成购物车、自动运费计算、QRIS/银行转账支付以及一键跳转 WhatsApp 下单功能。',
        },
      },
      {
        title: {
          id: 'Aplikasi Android & iOS',
          en: 'Android & iOS Mobile Applications',
          zh: 'Android 与 iOS 移动应用开发',
        },
        description: {
          id: 'Aplikasi mobile untuk layanan pelanggan, booking jasa, maupun aplikasi operasional lapangan yang ringan dan hemat kuota.',
          en: 'Lightweight, reliable mobile apps for customer booking, loyalty programs, or field team operations.',
          zh: '开发轻量稳定的客户预约、会员服务及外勤团队移动办公 App。',
        },
      },
    ],
    highlights: [
      { metric: '96+', label: { id: 'Skor Kecepatan Google', en: 'Google PageSpeed Score', zh: 'Google 网页速度评分' } },
      { metric: '3 Bahasa', label: { id: 'Dukungan ID / EN / ZH', en: 'Built-in ID / EN / ZH Support', zh: '内置印/英/中三语支持' } },
      { metric: 'CMS Aktif', label: { id: 'Mudah Diedit Sendiri', en: 'Self-Editable Admin Panel', zh: '配备自主可控 CMS 后台' } },
    ],
  },
  dim: {
    slug: 'dim',
    code: 'SOFTWARE & AI',
    name: {
      id: 'Sistem Perangkat Lunak Kustom & Otomasi AI',
      en: 'Custom Software Systems & AI Automation',
      zh: '定制软件系统与 AI 业务自动化',
    },
    tagline: {
      id: 'Ubah pencatatan manual di kertas dan ribuan file Excel yang terpisah menjadi satu sistem web terpusat yang rapi dan otomatis.',
      en: 'Replace scattered spreadsheets and manual paperwork with a single, clean web system tailored to your workflow.',
      zh: '告别繁琐的纸质单据与分散的 Excel 表格，升级为统一、高效的定制化 Web 业务管理系统。',
    },
    heroImage: ASSETS.scope.dim,
    overview: {
      id: [
        'Setiap bisnis punya cara kerja yang unik. Sering kali software jadi (off-the-shelf) yang dijual di pasaran terlalu kaku atau justru memiliki puluhan menu rumit yang tidak pernah dipakai tim Anda.',
        'Kodein merancang sistem perangkat lunak yang 100% mengikuti alur kerja nyata di tempat Anda—sehingga staf langsung paham cara memakainya tanpa perlu pelatihan berbulan-bulan.',
      ],
      en: [
        'Every business operates differently. Off-the-shelf software is often either too rigid or bloated with puluhan menus your team never touches.',
        'Kodein builds custom software around how your team actually works—so staff can use it confidently on day one without months of training.',
      ],
      zh: [
        '每家企业的业务流程都独一无二。市面上的通用软件往往过于死板，或者堆砌了大量用不到的复杂菜单。',
        'Kodein 完全围绕您的实际工作流定制开发软件，让员工无需漫长培训即可轻松上手。',
      ],
    },
    focusAreas: [
      {
        title: {
          id: 'Sistem Kasir (POS), Stok Gudang & Keuangan',
          en: 'POS, Inventory & Operational Finance Systems',
          zh: '收银 (POS)、仓储库存与财务管理系统',
        },
        description: {
          id: 'Pantau barang masuk-keluar, stok menipis, hingga laporan laba-rugi harian langsung dari HP atau laptop kapan saja.',
          en: 'Track incoming stock, low-inventory alerts, and daily profit-loss reports live from your phone or laptop.',
          zh: '随时随地通过手机或电脑实时查看出入库明细、低库存预警及每日营收报表。',
        },
      },
      {
        title: {
          id: 'Sistem Akademik, HRIS & Administrasi Instansi',
          en: 'Academic Portals, HRIS & Institutional Systems',
          zh: '教务平台、人事系统 (HRIS) 与机构政务系统',
        },
        description: {
          id: 'Pengelolaan data siswa/mahasiswa, absensi pegawai, penggajian, hingga pengarsipan surat digital yang rapi.',
          en: 'Streamlined student records, employee attendance, payroll calculation, and digital document archiving.',
          zh: '高效管理学生档案、员工考勤、薪资核算与数字化公文归档。',
        },
      },
      {
        title: {
          id: 'Chatbot AI & Asisten Layanan Pelanggan',
          en: 'Custom AI Chatbots & Smart Assistants',
          zh: '定制 AI 智能客服与业务助手',
        },
        description: {
          id: 'Asisten otomatis yang dilatih dengan data produk Anda untuk menjawab pertanyaan pelanggan 24 jam di web atau WhatsApp.',
          en: 'AI assistants trained on your product catalog and FAQs to answer customer inquiries 24/7 on web or WhatsApp.',
          zh: '基于您的产品手册与业务数据训练专属 AI 助手，全天候自动回复网站或 WhatsApp 客户咨询。',
        },
      },
    ],
    highlights: [
      { metric: '100%', label: { id: 'Sesuai Alur Bisnis Anda', en: 'Tailored to Your Workflow', zh: '100% 契合您的业务流程' } },
      { metric: 'Hak Milik', label: { id: 'Tanpa Biaya Langganan Per Akun', en: 'No Per-User License Fees', zh: '无按人头收费的订阅限制' } },
      { metric: '24/7', label: { id: 'Integrasi Asisten AI Pintar', en: 'Smart AI Assistant Ready', zh: '支持 24/7 AI 智能助手集成' } },
    ],
  },
  ddmf: {
    slug: 'ddmf',
    code: 'SERVER & CARE',
    name: {
      id: 'Layanan Server, Cloud & Perawatan Website',
      en: 'Server Setup, Cloud & Website Maintenance',
      zh: '服务器部署、云架构与网站运维服务',
    },
    tagline: {
      id: 'Anda fokus mengurus bisnis, biar tim Kodein yang memastikan website dan server Anda selalu cepat, aman, dan ter-backup rutin.',
      en: 'You focus on running your business while Kodein keeps your website and servers fast, secure, and backed up.',
      zh: '您只需专注于业务增长，Kodein 负责保障您的网站与服务器始终快速、安全并定期备份。',
    },
    heroImage: ASSETS.scope.ddmf,
    overview: {
      id: [
        'Banyak pemilik bisnis pusing ketika masa aktif domain hampir habis, sertifikat SSL mati, email perusahaan tidak bisa mengirim pesan, atau website tiba-tiba lambat saat ramai pengunjung.',
        'Tim infrastruktur Kodein menangani seluruh urusan teknis di belakang layar tersebut secara proaktif, lengkap dengan laporan berkala yang mudah dipahami.',
      ],
      en: [
        'Business owners shouldn’t have to worry about expiring domains, broken SSL certificates, email deliverability, or server crashes during traffic spikes.',
        'Kodein’s infrastructure team handles all behind-the-scenes server care proactively, complete with clear monthly health checks.',
      ],
      zh: [
        '企业主不应为域名到期、SSL 证书失效、企业邮箱收发异常或流量高峰期服务器崩溃而烦恼。',
        'Kodein 运维团队在幕后主动处理所有技术细节，并提供清晰易懂的系统健康报告。',
      ],
    },
    focusAreas: [
      {
        title: {
          id: 'Setup VPS, Cloud Server & Domain Resmi',
          en: 'VPS, Cloud Server & Domain Management',
          zh: 'VPS、云服务器与官方域名托管',
        },
        description: {
          id: 'Konfigurasi server yang optimal dan hemat biaya di AWS, Google Cloud, DigitalOcean, maupun server lokal Indonesia.',
          en: 'Cost-effective, high-speed server setup across AWS, Google Cloud, DigitalOcean, or Indonesian data centers.',
          zh: '在 AWS、Google Cloud、DigitalOcean 或印尼本地数据中心进行高性价比的服务器优化配置。',
        },
      },
      {
        title: {
          id: 'Backup Otomatis & Pemulihan Cepat',
          en: 'Automated Backups & Rapid Recovery',
          zh: '自动备份与快速灾难恢复',
        },
        description: {
          id: 'Database dan file website Anda dicadangkan secara rutin sehingga selalu aman dari risiko kehilangan data.',
          en: 'Databases and media files are backed up on schedule so your business data stays safe against any mishap.',
          zh: '定期自动备份数据库与网站文件，确保您的核心业务数据万无一失。',
        },
      },
      {
        title: {
          id: 'Perawatan Bulanan & Update Konten/Fitur',
          en: 'Monthly Care & Feature Updates',
          zh: '包月维护与功能持续更新',
        },
        description: {
          id: 'Bantuan teknis kapan pun Anda butuh mengganti banner, memperbarui informasi, atau menambah halaman baru.',
          en: 'On-call technical help whenever you need to swap banners, update pages, or roll out new features.',
          zh: '随时响应您的日常维护需求，协助更换横幅、更新页面内容或迭代新功能。',
        },
      },
    ],
    highlights: [
      { metric: '99.9%', label: { id: 'Server Stabil & Terpantau', en: 'Monitored Server Uptime', zh: '服务器稳定在线监控' } },
      { metric: 'Harian', label: { id: 'Jadwal Backup Otomatis', en: 'Automated Daily Backups', zh: '每日自动数据备份' } },
      { metric: 'SSL/WAF', label: { id: 'Perlindungan Keamanan Aktif', en: 'Active Security Protection', zh: '主动式安全防护墙' } },
    ],
  },
};

export const ABOUT_PAGE_DATA = {
  vision: {
    id: 'Menjadi studio teknologi asal Sumatera Selatan yang dipercaya secara nasional karena hasil kerja yang rapi, jujur, dan benar-benar membawa manfaat nyata bagi bisnis klien.',
    en: 'To be a South Sumatra-born technology studio trusted nationwide for honest craftsmanship, clean code, and software that genuinely helps clients grow.',
    zh: '成为源自南苏门答腊、享誉全印尼的技术工作室，以诚实的工匠精神与整洁的代码为客户创造真实商业价值。',
  },
  missions: {
    id: [
      'Membuat website dan aplikasi yang cepat, mudah digunakan oleh siapa saja, dan tidak membebani klien dengan kerumitan teknis.',
      'Menjaga komunikasi yang jelas, tepat waktu, dan transparan mengenai biaya sejak hari pertama diskusi.',
      'Mendampingi pelaku usaha dari Indralaya Utara, Ogan Ilir, Palembang, hingga seluruh Indonesia dalam membangun sistem digital yang mandiri.',
    ],
    en: [
      'Build fast, accessible websites and apps without overwhelming clients with unnecessary technical jargon.',
      'Maintain clear communication, realistic timelines, and upfront pricing from day one.',
      'Support businesses in Indralaya Utara, Ogan Ilir, Palembang, and across Indonesia in owning reliable digital platforms.',
    ],
    zh: [
      '打造快速、易用的网站与软件应用，绝不用晦涩的技术术语增加客户的沟通负担。',
      '从项目第一天起保持透明的报价、清晰的沟通与守时的交付。',
      '陪伴北印德拉拉亚、奥干伊利尔、巨港乃至全印尼的企业建立自主可控的数字化系统。',
    ],
  },
  values: [
    {
      code: '01',
      title: { id: 'Kode Rapi & Mudah Dirawat', en: 'Clean, Maintainable Code', zh: '代码整洁，易于维护' },
      desc: {
        id: 'Kami menulis kode dengan struktur yang bersih agar website atau aplikasi Anda mudah ditambah fiturnya di masa depan.',
        en: 'We write well-structured code so your website or app can easily grow with new features in the future.',
        zh: '我们坚持清晰的代码结构，确保您的网站或应用在未来能够轻松扩展新功能。',
      },
    },
    {
      code: '02',
      title: { id: 'Jujur Soal Biaya & Waktu', en: 'Honest Pricing & Timelines', zh: '报价透明，按期交付' },
      desc: {
        id: 'Tidak ada biaya tersembunyi. Kami jelaskan di awal apa saja yang Anda dapatkan dan kapan proyek selesai.',
        en: 'No hidden fees. We lay out exactly what you get and when it will be delivered before we start.',
        zh: '绝无隐形收费。在项目启动前，我们会明确列出交付清单与上线时间表。',
      },
    },
    {
      code: '03',
      title: { id: 'Desain yang Memudahkan', en: 'Practical, Clear Design', zh: '实用直观的界面设计' },
      desc: {
        id: 'Desain bagus bukan berarti rumit. Kami mengutamakan kenyamanan pengunjung saat mencari info atau bertransaksi.',
        en: 'Good design isn’t complicated. We prioritize how easily visitors can find info or complete a purchase.',
        zh: '好的设计从不故弄玄虚，我们优先确保访客能快速找到所需信息或顺畅完成交易。',
      },
    },
    {
      code: '04',
      title: { id: 'Didampingi Sampai Bisa', en: 'Full Handover & Support', zh: '全程陪跑，包教包会' },
      desc: {
        id: 'Setelah website selesai, kami ajarkan cara mengelola CMS-nya dan tetap siap membantu jika ada kendala.',
        en: 'Once launched, we walk your team through the CMS and stay available whenever you need a hand.',
        zh: '项目上线后，我们会手把手指导您的团队使用 CMS 后台，并随时提供后续技术支持。',
      },
    },
  ],
  leadership: [
    {
      name: 'Raka Pratama',
      role: { id: 'Lead Software Architect', en: 'Lead Software Architect', zh: '首席软件架构师' },
      image: ASSETS.leadership.exec1,
    },
    {
      name: 'Dimas Aditya',
      role: { id: 'Full-Stack Web Developer', en: 'Full-Stack Web Developer', zh: '全栈 Web 开发工程师' },
      image: ASSETS.leadership.exec2,
    },
    {
      name: 'Nadia Kusuma',
      role: { id: 'UI/UX & Product Designer', en: 'UI/UX & Product Designer', zh: 'UI/UX 产品设计师' },
      image: ASSETS.leadership.exec3,
    },
    {
      name: 'Bima Santoso',
      role: { id: 'Cloud & Mobile Engineer', en: 'Cloud & Mobile Engineer', zh: '云架构与移动端工程师' },
      image: ASSETS.leadership.exec4,
    },
  ],
};

export const FAQ_ITEMS = [
  {
    category: 'General',
    q: {
      id: 'Di mana lokasi kantor atau studio Kodein?',
      en: 'Where is Kodein located?',
      zh: 'Kodein 的工作室位于哪里？',
    },
    a: {
      id: 'Studio Kodein berlokasi di Gang Lampung 1, Indralaya Utara, Kabupaten Ogan Ilir, Sumatera Selatan. Kami melayani pertemuan langsung di sekitar Indralaya/Palembang maupun pengerjaan proyek secara online untuk klien di seluruh Indonesia dan luar negeri.',
      en: 'Kodein is based at Gang Lampung 1, Indralaya Utara, Ogan Ilir Regency, South Sumatra. We welcome in-person meetings around Indralaya and Palembang, and work seamlessly online with clients across Indonesia and abroad.',
      zh: 'Kodein 工作室位于印尼南苏门答腊省奥干伊利尔县 (Ogan Ilir) 北印德拉拉亚 Gang Lampung 1。我们支持印德拉拉亚及巨港地区的线下当面洽谈，同时也为全印尼及海外客户提供高效的远程项目开发服务。',
    },
  },
  {
    category: 'Services',
    q: {
      id: 'Apa saja yang bisa dibuat oleh Kodein?',
      en: 'What kind of websites and software can Kodein build?',
      zh: 'Kodein 可以开发哪些类型的网站和软件？',
    },
    a: {
      id: 'Kami melayani pembuatan website profil perusahaan/instansi, toko online (e-commerce), sistem informasi kustom (kasir/POS, gudang, akademik, HRIS), aplikasi mobile Android & iOS, hingga integrasi chatbot AI.',
      en: 'We build company profile websites, e-commerce stores, custom web systems (POS, inventory, academic portals, HRIS), Android & iOS mobile apps, and custom AI chatbots.',
      zh: '我们提供企业与机构官网建设、电商平台、定制业务系统（收银 POS、库存、教务、人事系统）、Android 与 iOS 移动应用以及 AI 智能客服集成。',
    },
  },
  {
    category: 'CMS',
    q: {
      id: 'Apakah saya bisa mengubah isi website sendiri tanpa harus paham koding?',
      en: 'Can I update the website content myself without coding knowledge?',
      zh: '不懂编程的话，我可以自己修改网站内容吗？',
    },
    a: {
      id: 'Tentu saja. Website buatan Kodein sudah dilengkapi halaman CMS (Content Management System) bawaan. Anda cukup login, lalu bisa menambah artikel berita, mengubah angka statistik, atau mengganti teks langsung dari browser.',
      en: 'Absolutely. Websites built by Kodein come with a built-in CMS dashboard. You can log in and publish articles, update statistics, or edit page copy directly from your browser.',
      zh: '完全可以。Kodein 开发的网站均内置可视化 CMS 内容管理系统，您只需登录后台即可在浏览器中直接发布文章、修改统计数据或更新页面文字。',
    },
  },
  {
    category: 'Support',
    q: {
      id: 'Bagaimana jika setelah website jadi ada error atau saya butuh bantuan?',
      en: 'What if something breaks after launch or I need help?',
      zh: '网站上线后如果遇到故障或需要技术协助怎么办？',
    },
    a: {
      id: 'Setiap proyek mendapatkan garansi perbaikan bug gratis pasca-peluncuran. Tim kami juga selalu bisa dihubungi untuk membantu perawatan bulanan maupun penambahan fitur baru.',
      en: 'Every project includes a free post-launch bug warranty. Our team also remains available for monthly maintenance or future feature additions.',
      zh: '每个交付项目均包含上线后的免费 Bug 保修期。此外，我们的团队随时为您提供包月运维或后续新功能迭代服务。',
    },
  },
];
`,

  'src/content/articles.ts': `import { ASSETS } from './assets';
import { Article } from './types';

export const ARTICLES: Article[] = [
  {
    id: 'art-1',
    slug: 'technology-innovation-investment-forum-2026',
    category: 'announcement',
    date: '2026-10-14',
    image: ASSETS.hero.slide1,
    title: {
      id: 'Kodein Hadirkan Layanan Pembuatan Website Cepat Lengkap dengan CMS Tiga Bahasa',
      en: 'Kodein Launches Fast Custom Websites Complete with Built-in Trilingual CMS',
      zh: 'Kodein 推出极速定制网站开发服务，内置印/英/中三语 CMS 后台',
    },
    excerpt: {
      id: 'Dari Indralaya Utara, Ogan Ilir, kami membantu bisnis memiliki website berstandar modern yang mudah dikelola sendiri.',
      en: 'From Indralaya Utara, Ogan Ilir, we help businesses own modern, fast websites they can easily manage themselves.',
      zh: '立足北印德拉拉亚，助力企业拥有可自主轻松管理的现代化极速网站。',
    },
    content: {
      id: [
        'INDRALAYA UTARA — Kodein memperkenalkan paket pembuatan website perusahaan dan toko online generasi terbaru yang menggabungkan kecepatan akses tinggi dengan kemudahan pengelolaan konten melalui CMS bawaan.',
        'Banyak pelaku usaha mengeluhkan website lama mereka yang berat dibuka di ponsel dan sulit diperbarui. Dengan arsitektur berbasis Next.js yang dirancang tim Kodein di Gang Lampung 1, Indralaya Utara, halaman web kini terbuka dalam hitungan detik.',
        'Selain itu, dukungan tiga bahasa (Indonesia, Inggris, dan Mandarin) membuka peluang bagi bisnis lokal dan nasional untuk menjangkau mitra serta pelanggan internasional.',
      ],
      en: [
        'INDRALAYA UTARA — Kodein introduces its latest corporate and e-commerce web development stack, combining sub-second page loads with a straightforward built-in CMS.',
        'Many business owners struggle with sluggish websites that are painful to update. Engineered by our team at Gang Lampung 1, Indralaya Utara, Ogan Ilir, our Next.js architecture ensures instant loading on both mobile and desktop.',
        'With built-in Indonesian, English, and Chinese language support, local and national businesses can confidently reach international partners and customers.',
      ],
      zh: [
        '北印德拉拉亚 — Kodein 正式推出新一代企业官网与电商平台开发方案，将秒级页面加载速度与直观的内置 CMS 管理系统完美结合。',
        '针对许多企业旧网站在手机端打开缓慢、内容更新繁琐的痛点，位于奥干伊利尔县北印德拉拉亚 Gang Lampung 1 的 Kodein 研发团队采用 Next.js 架构，实现了移动端与桌面端的极速响应。',
        '同时，系统原生支持印尼语、英语与中文三语切换，助力本地及全国企业轻松拓展国际合作与海外客户。',
      ],
    },
    quote: {
      id: 'Website yang bagus harus menjadi aset yang bekerja 24 jam untuk bisnis Anda, bukan sekadar pajangan online.',
      en: 'A good website should be a 24/7 working asset for your business, not just an online brochure.',
      zh: '优秀的网站应当成为全天候为您创造价值的业务资产，而不仅仅是一张线上名片。',
    },
  },
  {
    id: 'art-2',
    slug: 'customer-service-excellence-award-100-state-enterprises',
    category: 'press-release',
    date: '2026-10-08',
    image: ASSETS.hero.slide2,
    title: {
      id: 'Studi Kasus: Digitalisasi Sistem Inventaris & Kasir Pangkas Waktu Rekap Bulanan Hingga 70%',
      en: 'Case Study: Custom Inventory & POS System Cuts Monthly Reporting Time by 70%',
      zh: '客户案例：定制库存与收银系统助企业缩短 70% 月度对账时间',
    },
    excerpt: {
      id: 'Menggantikan pencatatan buku manual menjadi aplikasi web real-time yang bisa dipantau pemilik toko dari mana saja.',
      en: 'Replacing manual ledger books with a real-time web app that store owners can monitor from anywhere.',
      zh: '用实时同步的 Web 管理系统取代手工账本，让店主随时随地掌握经营数据。',
    },
    content: {
      id: [
        'OGAN ILIR — Salah satu tantangan terbesar bisnis distribusi dan ritel adalah selisih stok barang di gudang dengan catatan penjualan di kasir. Kodein membantu menyelesaikan masalah ini melalui pembuatan aplikasi web POS & Inventaris kustom.',
        'Kini setiap transaksi otomatis memotong stok gudang dan menyusun laporan laba-rugi harian tanpa perlu rekap ulang di akhir bulan.',
      ],
      en: [
        'OGAN ILIR — One of the biggest headaches in retail and distribution is stock discrepancy between the warehouse and the cashier desk. Kodein solved this by building a custom web-based POS and Inventory system.',
        'Every sale now automatically deducts warehouse stock and generates daily profit reports without manual end-of-month reconciliation.',
      ],
      zh: [
        '奥干伊利尔 — 零售与分销行业最常见的痛点之一是仓库库存与前台销售数据不符。Kodein 通过定制开发 Web 端收银与库存管理系统彻底解决了这一难题。',
        '如今每一笔交易都会自动扣减库存并生成每日利润报表，无需在月底进行繁琐的人工核对。',
      ],
    },
  },
  {
    id: 'art-3',
    slug: 'strategic-partnership-cyber-security-technology',
    category: 'press-release',
    date: '2026-09-29',
    image: ASSETS.hero.slide3,
    title: {
      id: 'Mengapa Keamanan Data & Backup Rutin Wajib Ada di Setiap Pembuatan Software',
      en: 'Why Data Security & Automated Backups Are Standard in Every Kodein Build',
      zh: '为什么数据安全与自动备份是 Kodein 每个软件项目的标配',
    },
    excerpt: {
      id: 'Langkah praktis yang diterapkan Kodein untuk melindungi website dan database bisnis klien dari kehilangan data.',
      en: 'Practical measures Kodein takes to protect client websites and databases against data loss and cyber threats.',
      zh: 'Kodein 采取多重实用安全策略，全面保护客户网站与业务数据库免受数据丢失威胁。',
    },
    content: {
      id: [
        'INDRALAYA UTARA — Membangun aplikasi yang kaya fitur tidak akan ada artinya jika data di dalamnya rentan hilang atau disusupi. Di Kodein, setiap proyek dilengkapi konfigurasi keamanan berlapis sejak hari pertama.',
        'Kami menerapkan enkripsi koneksi penuh, penyaringan input untuk mencegah celah keamanan, serta penjadwalan backup otomatis ke penyimpanan terpisah.',
      ],
      en: [
        'INDRALAYA UTARA — Building feature-rich software means nothing if the underlying data is vulnerable. At Kodein, every project ships with multi-layered security configured from day one.',
        'We enforce full connection encryption, strict input sanitization, and automated off-site database backups.',
      ],
      zh: [
        '北印德拉拉亚 — 如果底层数据缺乏安全保障，再丰富的功能也毫无意义。在 Kodein，每个项目从第一天起就配置了多层安全防护。',
        '我们全面实施传输加密、严格的输入过滤以及异地自动数据库备份机制。',
      ],
    },
  },
  {
    id: 'art-4',
    slug: 'sustainable-housing-expo-achieves-idr-2-trillion-project-value',
    category: 'press-release',
    date: '2026-09-18',
    image: ASSETS.hero.slide4,
    title: {
      id: 'Website Katalog & Booking Online Bantu Pengembang Properti Lokal Tingkatkan Leads 2x Lipat',
      en: 'Custom Property Catalog & Booking Website Helps Local Developer Double Buyer Leads',
      zh: '定制房产目录与在线预约网站助力本地开发商潜在客户量翻倍',
    },
    excerpt: {
      id: 'Calon pembeli kini bisa melihat denah ketersediaan kavling secara langsung dan menjadwalkan survei lokasi lewat WhatsApp.',
      en: 'Prospective buyers can check live lot availability and schedule site visits directly via WhatsApp.',
      zh: '购房者可在线实时查看房源状态，并一键通过 WhatsApp 预约现场看房。',
    },
    content: {
      id: [
        'SUMATERA SELATAN — Kodein merampungkan pengembangan website interaktif bagi pengembang perumahan yang memungkinkan calon pembeli memeriksa status unit yang masih tersedia secara real-time.',
        'Dilengkapi simulasi cicilan otomatis dan tombol penghubung ke tim marketing, website ini meningkatkan jumlah pertanyaan calon pembeli hingga dua kali lipat.',
      ],
      en: [
        'SOUTH SUMATRA — Kodein completed an interactive web platform for a residential developer, allowing prospective buyers to check unit availability in real time.',
        'Equipped with an instant installment calculator and direct WhatsApp routing to sales agents, the platform doubled qualified buyer inquiries.',
      ],
      zh: [
        '南苏门答腊 — Kodein 为本地房地产开发商打造了交互式房源展示平台，支持客户实时查询在售房源状态。',
        '配合内置的分期付款计算器与 WhatsApp 销售直连功能，该网站的精准客户咨询量提升了两倍。',
      ],
    },
  },
  {
    id: 'art-5',
    slug: 'sovereign-green-transition-forum-announcement',
    category: 'announcement',
    date: '2026-09-05',
    image: ASSETS.hero.slide5,
    title: {
      id: 'Integrasi Chatbot AI untuk Menjawab Pertanyaan Pelanggan Otomatis 24 Jam',
      en: 'Integrating Custom AI Chatbots to Answer Customer Questions 24/7',
      zh: '集成定制 AI 智能客服，实现 24 小时全自动客户问答',
    },
    excerpt: {
      id: 'Solusi praktis bagi pemilik bisnis agar tidak kehilangan calon pembeli yang menghubungi di luar jam kerja.',
      en: 'A practical solution so businesses never miss prospective buyers messaging outside office hours.',
      zh: '帮助企业在非工作时间也能秒回客户咨询，不再错失任何潜在商机。',
    },
    content: {
      id: [
        'INDRALAYA UTARA — Calon pelanggan sering kali mencari informasi harga atau ketersediaan layanan pada malam hari. Agar bisnis Anda tetap responsif, Kodein menyediakan layanan integrasi asisten AI yang dilatih khusus menggunakan informasi produk Anda.',
        'Asisten ini mampu menjawab pertanyaan dengan bahasa yang sopan dan natural, lalu meneruskan pesanan serius ke nomor admin Anda.',
      ],
      en: [
        'INDRALAYA UTARA — Customers often browse and ask about pricing late at night. To keep your business responsive, Kodein integrates custom AI assistants trained specifically on your product knowledge.',
        'The assistant answers questions naturally and forwards qualified orders straight to your admin team.',
      ],
      zh: [
        '北印德拉拉亚 — 许多潜在客户习惯在夜间浏览并咨询价格。为了让您的业务时刻保持响应，Kodein 提供基于您企业产品知识库训练的专属 AI 助手集成服务。',
        'AI 助手能够以自然礼貌的语气解答疑问，并将高意向订单直接转交给人工管理员。',
      ],
    },
  },
  {
    id: 'art-6',
    slug: 'phase-two-soe-cluster-streamlining-completion',
    category: 'press-release',
    date: '2026-08-21',
    image: ASSETS.scope.dam,
    title: {
      id: 'Pembuatan Portal Akademik & Pendaftaran Online yang Ringan Saat Diakses Serentak',
      en: 'Building Academic & Online Registration Portals That Stay Fast Under Heavy Traffic',
      zh: '打造高并发下依然流畅稳定的教务管理与在线报名门户',
    },
    excerpt: {
      id: 'Optimasi database dan tampilan antarmuka yang ramah pengguna untuk memudahkan pendaftaran siswa/mahasiswa baru.',
      en: 'Database optimization and clean forms make new student registration smooth and crash-free.',
      zh: '通过数据库优化与清晰的表单设计，让新生在线报名流程顺畅无阻。',
    },
    content: {
      id: [
        'OGAN ILIR — Saat musim pendaftaran tiba, website sekolah atau kampus sering mengalami kendala lambat diakses. Kodein merancang portal pendaftaran online dengan arsitektur ringan yang sanggup menangani lonjakan pengunjung sekaligus.',
        'Panitia pendaftaran juga dapat mengunduh berkas dan memverifikasi data pendaftar dengan cepat dari satu dashboard.',
      ],
      en: [
        'OGAN ILIR — During admission season, school and campus websites often grind to a halt. Kodein engineers lightweight online registration portals capable of handling concurrent traffic spikes.',
        'Admission staff can review documents and verify applicants quickly from a single admin dashboard.',
      ],
      zh: [
        '奥干伊利尔 — 每逢招生季，学校与机构网站常因访问量激增而瘫痪。Kodein 采用轻量级高并发架构打造在线报名系统，轻松应对访问高峰。',
        '招生人员还可通过统一后台快速审核材料并导出录取数据。',
      ],
    },
  },
  {
    id: 'art-7',
    slug: 'global-credit-rating-affirmation-stable-outlook',
    category: 'announcement',
    date: '2026-08-04',
    image: ASSETS.scope.dim,
    title: {
      id: 'Konsultasi Pembuatan Website & Aplikasi Gratis di Studio Kodein Indralaya Utara',
      en: 'Free Website & App Consultation at Kodein Studio in Indralaya Utara',
      zh: '欢迎预约 Kodein 北印德拉拉亚工作室免费网站与应用开发咨询',
    },
    excerpt: {
      id: 'Punya ide aplikasi atau ingin memperbarui website lama? Mari ngobrol santai bersama tim teknis kami.',
      en: 'Have an app idea or want to refresh an old website? Let’s talk through your options with our tech team.',
      zh: '有新应用创意或想改版旧网站？欢迎与我们的技术团队直接交流。',
    },
    content: {
      id: [
        'INDRALAYA UTARA — Anda tidak perlu paham istilah teknis untuk mulai membuat website atau software di Kodein. Cukup ceritakan masalah atau tujuan bisnis Anda kepada kami.',
        'Kunjungi studio kami di Gang Lampung 1, Indralaya Utara, Kabupaten Ogan Ilir, atau jadwalkan diskusi online melalui halaman Diskusi Proyek.',
      ],
      en: [
        'INDRALAYA UTARA — You don’t need to speak tech jargon to build software with Kodein. Just tell us how your business works and what you want to achieve.',
        'Visit our studio at Gang Lampung 1, Indralaya Utara, Ogan Ilir Regency, or book an online call via our Start a Project page.',
      ],
      zh: [
        '北印德拉拉亚 — 与 Kodein 合作无需您精通复杂的技术术语，只需告诉我们您的业务目标与面临的痛点。',
        '欢迎莅临我们位于奥干伊利尔县北印德拉拉亚 Gang Lampung 1 的工作室，或通过“项目咨询”页面预约线上沟通。',
      ],
    },
  },
  {
    id: 'art-8',
    slug: 'critical-mineral-downstreaming-fund-first-close',
    category: 'press-release',
    date: '2026-07-19',
    image: ASSETS.scope.ddmf,
    title: {
      id: 'Tips Memilih Jasa Pembuatan Website agar Tidak Terkunci dari Source Code Sendiri',
      en: 'How to Choose a Web Developer Without Getting Locked Out of Your Own Source Code',
      zh: '如何选择网站开发商，避免失去自身源码与后台控制权',
    },
    excerpt: {
      id: 'Di Kodein, kami menjamin transparansi akses penuh dan kemudahan pengelolaan jangka panjang bagi setiap klien.',
      en: 'At Kodein, we guarantee transparent CMS access and clean handover for every client project.',
      zh: 'Kodein 承诺为每位客户提供透明的 CMS 管理权限与清晰的代码移交保障。',
    },
    content: {
      id: [
        'SUMATERA SELATAN — Pastikan Anda memilih mitra teknologi yang memberikan akses pengelolaan konten secara mandiri dan perjanjian kerja yang transparan.',
        'Kodein selalu menyertakan akses CMS dan dokumentasi yang rapi agar bisnis Anda memiliki kendali penuh atas aset digitalnya.',
      ],
      en: [
        'SOUTH SUMATRA — Always choose a technology partner that gives you independent content management access and transparent terms.',
        'Kodein includes CMS access and clear documentation so your business stays in full control of its digital assets.',
      ],
      zh: [
        '南苏门答腊 — 选择技术合作伙伴时，请务必确保您拥有独立的内容管理权限与透明的合同条款。',
        'Kodein 始终交付完整的 CMS 权限与清晰的操作文档，让您的企业真正掌握自身的数字资产。',
      ],
    },
  },
];
`,

  // Client Hook & Store untuk membaca data CMS secara real-time
  'src/lib/cmsClient.ts': `'use client';

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
`,

  // API Route Handler untuk CMS (GET, PUT untuk update seluruh/sebagian database JSON, POST untuk tambah artikel, DELETE untuk hapus artikel)
  'src/app/api/cms/route.ts': `import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { DESIGN_TOKENS } from '@/lib/tokens';
import { HOME_CONTENT, STATISTICS_DATA } from '@/content/siteData';
import { ARTICLES } from '@/content/articles';
import { CmsDatabase } from '@/content/types';

const DB_PATH = path.join(process.cwd(), 'data', 'cms.json');

function getSeedData(): CmsDatabase {
  return {
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
}

function readDb(): CmsDatabase {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const seed = getSeedData();
      fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
      fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2), 'utf8');
      return seed;
    }
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw) as CmsDatabase;
  } catch {
    return getSeedData();
  }
}

function writeDb(data: CmsDatabase) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

export async function GET() {
  const db = readDb();
  return NextResponse.json(db);
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const current = readDb();
    const updated: CmsDatabase = {
      ...current,
      ...body,
    };
    writeDb(updated);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update CMS data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const current = readDb();

    if (body.action === 'reset') {
      const seed = getSeedData();
      writeDb(seed);
      return NextResponse.json(seed);
    }

    if (body.article) {
      const updatedArticles = [body.article, ...current.articles];
      const updated = { ...current, articles: updatedArticles };
      writeDb(updated);
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Failed to save CMS item' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing article id' }, { status: 400 });
    }
    const current = readDb();
    const updated = {
      ...current,
      articles: current.articles.filter((a) => a.id !== id),
    };
    writeDb(updated);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}
`,

  // Halaman Admin CMS Studio Lengkap di /[locale]/cms
  'src/app/[locale]/cms/page.tsx': `'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  FilePlus2,
  BarChart3,
  Settings,
  Trash2,
  Save,
  RotateCcw,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useLocale } from 'next-intl';
import { useCmsData } from '@/lib/cmsClient';
import { ASSETS } from '@/content/assets';
import { Article, ArticleCategory } from '@/content/types';
import { Locale } from '@/i18n';

const DEFAULT_PIN = 'kodein2026';

export default function CmsPage() {
  const locale = useLocale() as Locale;
  const { data, refresh } = useCmsData();

  const [unlocked, setUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [activeTab, setActiveTab] = useState<'articles' | 'stats' | 'general'>('articles');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Form state untuk tambah artikel baru (3 Bahasa)
  const [category, setCategory] = useState<ArticleCategory>('press-release');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [image, setImage] = useState<string>(ASSETS.hero.slide1);
  const [titleId, setTitleId] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleZh, setTitleZh] = useState('');
  const [excerptId, setExcerptId] = useState('');
  const [excerptEn, setExcerptEn] = useState('');
  const [excerptZh, setExcerptZh] = useState('');
  const [bodyId, setBodyId] = useState('');
  const [bodyEn, setBodyEn] = useState('');
  const [bodyZh, setBodyZh] = useState('');

  // State lokal untuk edit General & Stats
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [statementId, setStatementId] = useState('');
  const [statementEn, setStatementEn] = useState('');
  const [statementZh, setStatementZh] = useState('');

  const showNotice = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === DEFAULT_PIN) {
      setUnlocked(true);
      setAddress(data.address);
      setEmail(data.email);
      setPhone(data.phone);
      setStatementId(data.aboutStatement.id);
      setStatementEn(data.aboutStatement.en);
      setStatementZh(data.aboutStatement.zh);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleId.trim()) return;
    setSaving(true);

    const slug =
      titleId
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
      '-' +
      Date.now().toString(36);

    const newArticle: Article = {
      id: \`art-\${Date.now()}\`,
      slug,
      category,
      date,
      image: image || ASSETS.hero.slide1,
      title: {
        id: titleId,
        en: titleEn || titleId,
        zh: titleZh || titleEn || titleId,
      },
      excerpt: {
        id: excerptId || titleId,
        en: excerptEn || excerptId || titleId,
        zh: excerptZh || excerptEn || excerptId || titleId,
      },
      content: {
        id: bodyId ? bodyId.split('\\n').filter(Boolean) : [excerptId || titleId],
        en: bodyEn
          ? bodyEn.split('\\n').filter(Boolean)
          : [excerptEn || excerptId || titleId],
        zh: bodyZh
          ? bodyZh.split('\\n').filter(Boolean)
          : [excerptZh || excerptId || titleId],
      },
    };

    const res = await fetch('/api/cms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ article: newArticle }),
    });

    setSaving(false);
    if (res.ok) {
      setTitleId('');
      setTitleEn('');
      setTitleZh('');
      setExcerptId('');
      setExcerptEn('');
      setExcerptZh('');
      setBodyId('');
      setBodyEn('');
      setBodyZh('');
      await refresh();
      showNotice('Artikel baru berhasil diterbitkan ke website!');
    }
  };

  const handleDeleteArticle = async (id: string) => {
    const res = await fetch(\`/api/cms?id=\${encodeURIComponent(id)}\`, {
      method: 'DELETE',
    });
    if (res.ok) {
      await refresh();
      showNotice('Artikel berhasil dihapus.');
    }
  };

  const handleStatChange = async (statId: string, newValue: number) => {
    const updatedStats = data.stats.map((s) =>
      s.id === statId ? { ...s, value: newValue } : s
    );
    const res = await fetch('/api/cms', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stats: updatedStats }),
    });
    if (res.ok) {
      await refresh();
      showNotice('Angka statistik berhasil diperbarui!');
    }
  };

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/cms', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        address: address || data.address,
        email: email || data.email,
        phone: phone || data.phone,
        aboutStatement: {
          id: statementId || data.aboutStatement.id,
          en: statementEn || data.aboutStatement.en,
          zh: statementZh || data.aboutStatement.zh,
        },
      }),
    });
    setSaving(false);
    if (res.ok) {
      await refresh();
      showNotice('Profil & teks utama Kodein berhasil disimpan!');
    }
  };

  const handleResetDefault = async () => {
    const res = await fetch('/api/cms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reset' }),
    });
    if (res.ok) {
      await refresh();
      showNotice('Seluruh data dikembalikan ke pengaturan awal.');
    }
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-brand-dark pt-36 pb-24 px-6 flex items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-white/15 bg-brand-charcoal p-8 text-white shadow-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-red">
            <Lock className="h-4 w-4" />
            <span>Kodein CMS Studio</span>
          </div>
          <h1 className="mt-3 text-2xl font-bold">Masuk ke Panel Konten</h1>
          <p className="mt-2 text-xs text-zinc-400">
            Masukkan kode akses untuk mengelola artikel, statistik, dan profil Kodein. (Default:{' '}
            <code className="text-brand-coral font-bold">kodein2026</code>)
          </p>

          <form onSubmit={handleUnlock} className="mt-6 space-y-4">
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Kode Akses CMS..."
              className="w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-sm text-white focus:border-brand-red focus:outline-none"
            />
            {pinError && (
              <p className="text-xs text-brand-red">Kode akses salah. Coba: kodein2026</p>
            )}
            <button
              type="submit"
              className="w-full rounded-full bg-brand-red py-3.5 text-sm font-bold text-white hover:bg-brand-redHover transition"
            >
              Buka CMS Studio
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark pt-32 pb-24 text-white">
      <div className="mx-auto max-w-container px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-red">
              <LayoutDashboard className="h-4 w-4" />
              <span>Kodein Content Management System</span>
            </div>
            <h1 className="mt-2 text-3xl font-bold">CMS Studio Kodein (ID / EN / ZH)</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Setiap perubahan yang Anda simpan di sini langsung tampil di halaman depan dan daftar artikel.
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetDefault}
            className="inline-flex items-center gap-2 self-start rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:border-brand-red hover:text-white transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset ke Data Awal</span>
          </button>
        </div>

        {toast && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-5 py-3.5 text-sm text-emerald-300">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
            <span>{toast}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('articles')}
            className={\`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition \${
              activeTab === 'articles'
                ? 'bg-brand-red text-white'
                : 'bg-brand-charcoal text-zinc-400 hover:text-white'
            }\`}
          >
            <FilePlus2 className="h-4 w-4" />
            <span>Artikel & Studi Kasus ({data.articles.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className={\`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition \${
              activeTab === 'stats'
                ? 'bg-brand-red text-white'
                : 'bg-brand-charcoal text-zinc-400 hover:text-white'
            }\`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Angka Statistik ({data.stats.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={\`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition \${
              activeTab === 'general'
                ? 'bg-brand-red text-white'
                : 'bg-brand-charcoal text-zinc-400 hover:text-white'
            }\`}
          >
            <Settings className="h-4 w-4" />
            <span>Teks Utama & Lokasi</span>
          </button>
        </div>

        {/* TAB 1: ARTICLES CRUD */}
        {activeTab === 'articles' && (
          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
            <form
              onSubmit={handleAddArticle}
              className="lg:col-span-5 space-y-4 rounded-2xl border border-white/10 bg-brand-charcoal p-6"
            >
              <h2 className="text-lg font-bold">Tambah Artikel / Portofolio Baru</h2>
              <p className="text-xs text-zinc-400">
                Jika bahasa Inggris/Mandarin dikosongkan, sistem otomatis memakai teks bahasa Indonesia.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400">
                    Kategori
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ArticleCategory)}
                    className="mt-1 w-full rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-xs text-white"
                  >
                    <option value="press-release">Studi Kasus (Press Release)</option>
                    <option value="announcement">Kabar Kodein (Announcement)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400">
                  URL Gambar Sampul (Unsplash)
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-brand-coral">
                  Judul Bahasa Indonesia *
                </label>
                <input
                  required
                  value={titleId}
                  onChange={(e) => setTitleId(e.target.value)}
                  placeholder="Contoh: Peluncuran Website E-Commerce Batik Ogan Ilir"
                  className="mt-1 w-full rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400">
                    Judul English (Opsional)
                  </label>
                  <input
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="English Title..."
                    className="mt-1 w-full rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400">
                    Judul Mandarin 中文 (Opsional)
                  </label>
                  <input
                    value={titleZh}
                    onChange={(e) => setTitleZh(e.target.value)}
                    placeholder="中文标题..."
                    className="mt-1 w-full rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400">
                  Ringkasan Singkat (ID)
                </label>
                <input
                  value={excerptId}
                  onChange={(e) => setExcerptId(e.target.value)}
                  placeholder="Ringkasan 1-2 kalimat..."
                  className="mt-1 w-full rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400">
                  Isi Artikel Lengkap (ID — Pisahkan paragraf dengan Enter)
                </label>
                <textarea
                  rows={4}
                  value={bodyId}
                  onChange={(e) => setBodyId(e.target.value)}
                  placeholder="Tulis isi artikel atau cerita studi kasus di sini..."
                  className="mt-1 w-full rounded-lg border border-white/15 bg-black/50 p-3 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-full bg-brand-red py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-brand-redHover transition"
              >
                {saving ? 'Menyimpan...' : 'Terbitkan Artikel'}
              </button>
            </form>

            {/* Daftar Artikel Aktif */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-lg font-bold">
                Daftar Artikel Aktif (5 Teratas Tampil di Hero Beranda)
              </h2>
              {data.articles.map((art, index) => (
                <div
                  key={art.id}
                  className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-brand-charcoal p-5"
                >
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
                      {index < 5 && (
                        <span className="rounded bg-brand-red px-2 py-0.5 text-white">
                          Hero Slide #{index + 1}
                        </span>
                      )}
                      <span className="text-zinc-400">{art.date}</span>
                    </div>
                    <h3 className="mt-2 font-bold text-white">{art.title[locale]}</h3>
                    <p className="mt-1 text-xs text-zinc-400 line-clamp-2">
                      {art.excerpt[locale]}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteArticle(art.id)}
                    aria-label="Hapus artikel"
                    className="shrink-0 rounded-lg border border-white/10 p-2 text-zinc-400 hover:border-brand-red hover:text-brand-red transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: STATS EDITOR */}
        {activeTab === 'stats' && (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.stats.map((stat) => (
              <div
                key={stat.id}
                className="rounded-2xl border border-white/10 bg-brand-charcoal p-6 space-y-4"
              >
                <div className="text-xs font-bold uppercase tracking-wider text-brand-red">
                  {stat.label[locale]}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-zinc-400">{stat.prefix || ''}</span>
                  <input
                    type="number"
                    defaultValue={stat.value}
                    onBlur={(e) => handleStatChange(stat.id, Number(e.target.value))}
                    className="w-32 rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-xl font-extrabold text-white focus:border-brand-red focus:outline-none"
                  />
                  <span className="text-sm text-zinc-400">{stat.suffix || ''}</span>
                </div>
                <p className="text-xs text-zinc-400">{stat.description[locale]}</p>
                <p className="text-[11px] text-zinc-500">
                  *Ubah angka lalu klik di luar kotak untuk menyimpan otomatis.
                </p>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: GENERAL & LOCATION */}
        {activeTab === 'general' && (
          <form
            onSubmit={handleSaveGeneral}
            className="mt-10 max-w-3xl space-y-6 rounded-2xl border border-white/10 bg-brand-charcoal p-8"
          >
            <h2 className="text-xl font-bold">Pengaturan Lokasi & Teks Utama Kodein</h2>

            <div>
              <label className="block text-xs font-bold uppercase text-zinc-300">
                Alamat Studio Kodein
              </label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-sm text-white"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-300">
                  Email Kontak
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-300">
                  Nomor Telepon / WhatsApp
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-sm text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-brand-coral">
                Pernyataan Utama Tentang Kodein (Bahasa Indonesia)
              </label>
              <textarea
                rows={3}
                value={statementId}
                onChange={(e) => setStatementId(e.target.value)}
                className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 p-4 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-zinc-300">
                Main Statement (English)
              </label>
              <textarea
                rows={3}
                value={statementEn}
                onChange={(e) => setStatementEn(e.target.value)}
                className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 p-4 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-zinc-300">
                核心介绍 (中文 Mandarin)
              </label>
              <textarea
                rows={3}
                value={statementZh}
                onChange={(e) => setStatementZh(e.target.value)}
                className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 p-4 text-sm text-white"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-brand-red px-8 py-3.5 text-sm font-bold text-white hover:bg-brand-redHover transition"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
`,

  // Update LanguageSwitcher untuk mendukung ID, EN, dan ZH (Mandarin)
  'src/components/layout/LanguageSwitcher.tsx': `'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import { usePathname, useRouter } from '@/navigation';
import { Locale } from '@/i18n';
import { cn } from '@/lib/utils';

const LANGUAGE_LABELS: Record<Locale, string> = {
  id: 'Indonesia (ID)',
  en: 'English (EN)',
  zh: '中文 (ZH)',
};

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const switchLocale = (nextLocale: Locale) => {
    setOpen(false);
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label="Select Language"
        className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs font-semibold uppercase text-white transition hover:border-white/30"
      >
        <FlagIcon code={locale} />
        <span>{locale.toUpperCase()}</span>
        <ChevronDown className="h-3 w-3 opacity-75" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-40 rounded-lg border border-white/15 bg-brand-charcoal p-1 shadow-xl z-50"
        >
          {(['id', 'en', 'zh'] as Locale[]).map((item) => (
            <button
              key={item}
              type="button"
              role="menuitem"
              onClick={() => switchLocale(item)}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-xs font-medium transition',
                locale === item
                  ? 'bg-brand-red text-white'
                  : 'text-zinc-300 hover:bg-white/10 hover:text-white'
              )}
            >
              <FlagIcon code={item} />
              <span>{LANGUAGE_LABELS[item]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FlagIcon({ code }: { code: Locale }) {
  if (code === 'id') {
    return (
      <svg className="h-3.5 w-3.5 rounded-full overflow-hidden shrink-0" viewBox="0 0 24 24">
        <rect width="24" height="12" fill="#E70011" />
        <rect y="12" width="24" height="12" fill="#FFFFFF" />
      </svg>
    );
  }
  if (code === 'zh') {
    return (
      <svg className="h-3.5 w-3.5 rounded-full overflow-hidden shrink-0" viewBox="0 0 24 24">
        <rect width="24" height="24" fill="#DE2910" />
        <circle cx="7" cy="7" r="3" fill="#FFDE00" />
        <circle cx="12" cy="4" r="1" fill="#FFDE00" />
        <circle cx="14" cy="6.5" r="1" fill="#FFDE00" />
        <circle cx="14" cy="9.5" r="1" fill="#FFDE00" />
        <circle cx="12" cy="12" r="1" fill="#FFDE00" />
      </svg>
    );
  }
  return (
    <svg className="h-3.5 w-3.5 rounded-full overflow-hidden shrink-0" viewBox="0 0 24 24">
      <rect width="24" height="24" fill="#012169" />
      <path d="M0 0L24 24M24 0L0 24" stroke="#FFF" strokeWidth="4" />
      <path d="M12 0V24M0 12H24" stroke="#FFF" strokeWidth="6" />
      <path d="M12 0V24M0 12H24" stroke="#C8102E" strokeWidth="3.5" />
    </svg>
  );
}
`,

  // Update Header agar ada pintasan ke CMS Studio & mendukung Widescreen
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
                <div className="col-span-5 flex flex-col justify-between border-r border-white/10 pr-8">
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

                <div className="col-span-7 grid grid-cols-2 gap-4">
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

  // Update Footer untuk membaca alamat dinamis dari CMS & menampilkan murni "Kodein"
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
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
                {t('otherLinks')}
              </h3>
              <ul className="mt-5 space-y-3.5 text-sm">
                <li>
                  <Link href="/cms" className="text-brand-coral font-semibold hover:underline transition">
                    {navT('cms')}
                  </Link>
                </li>
                <li>
                  <Link href="/investor-relations" className="text-zinc-300 hover:text-brand-red transition">
                    {t('investorRelations')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/help-center"
                    className="inline-flex items-center gap-1 text-zinc-300 hover:text-brand-red transition"
                  >
                    <span>{t('vdp')}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
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

  // Update HeroCarousel agar membaca 5 artikel teratas langsung dari CMS
  'src/components/home/HeroCarousel.tsx': `'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { BLUR_DATA_URL } from '@/content/assets';
import { Button } from '@/components/ui/Button';
import { cn, formatDate } from '@/lib/utils';
import { useCmsData } from '@/lib/cmsClient';
import { Locale } from '@/i18n';

export function HeroCarousel() {
  const locale = useLocale() as Locale;
  const t = useTranslations('common');
  const { data } = useCmsData();
  const slides = data.articles.slice(0, 5);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 }, [
    Autoplay({ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((idx: number) => emblaApi && emblaApi.scrollTo(idx), [emblaApi]);

  return (
    <section
      aria-label="Featured News Carousel"
      className="relative h-screen min-h-[680px] max-h-[1080px] w-full overflow-hidden bg-brand-black"
    >
      <div ref={emblaRef} className="h-full w-full overflow-hidden">
        <div className="flex h-full">
          {slides.map((slide, idx) => {
            const isSelected = idx === selectedIndex;
            const detailHref =
              slide.category === 'press-release'
                ? \`/media-center/press-releases/\${slide.slug}\`
                : \`/media-center/announcement/\${slide.slug}\`;

            return (
              <div key={slide.id} className="relative h-full min-w-0 flex-[0_0_100%] overflow-hidden">
                <div
                  className={cn(
                    'absolute inset-0 transition-transform duration-[7000ms] ease-out',
                    isSelected ? 'scale-105' : 'scale-100'
                  )}
                >
                  <Image
                    src={slide.image}
                    alt={slide.title[locale]}
                    fill
                    priority={idx === 0}
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>

                <div
                  className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/30"
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-black/40"
                  aria-hidden="true"
                />

                <div className="relative z-10 mx-auto flex h-full max-w-container flex-col justify-end px-6 sm:px-10 lg:px-16 xl:px-20 pb-28 md:pb-32">
                  <motion.div
                    key={\`\${slide.id}-\${isSelected}\`}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-6xl"
                  >
                    <div className="inline-flex items-center gap-3 text-xs sm:text-sm font-semibold uppercase tracking-widest text-zinc-300">
                      <span className="rounded-full bg-brand-red px-3.5 py-1 text-[11px] font-bold text-white">
                        {slide.category === 'press-release'
                          ? t('pressRelease')
                          : t('announcement')}
                      </span>
                      <span className="text-white/40">•</span>
                      <time dateTime={slide.date}>{formatDate(slide.date, locale)}</time>
                    </div>

                    <h1 className="mt-5 text-fluid-hero font-bold text-white">
                      {slide.title[locale]}
                    </h1>

                    <div className="mt-8">
                      <Button href={detailHref} variant="primary">
                        {t('learnMore')}
                      </Button>
                    </div>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-8 z-20 mx-auto flex max-w-container items-center justify-between gap-8 px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="grid flex-1 max-w-4xl grid-cols-5 gap-3" role="tablist">
          {slides.map((slide, idx) => {
            const active = idx === selectedIndex;
            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={\`Slide \${idx + 1}\`}
                onClick={() => scrollTo(idx)}
                className="group py-2 focus:outline-none"
              >
                <div className="h-1 w-full overflow-hidden rounded-full bg-white/25">
                  <div
                    className={cn(
                      'h-full bg-brand-red transition-all duration-500',
                      active ? 'w-full' : 'w-0 group-hover:w-1/3'
                    )}
                  />
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous slide"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition hover:border-brand-red hover:bg-brand-red"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next slide"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition hover:border-brand-red hover:bg-brand-red"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
`,

  // Update AboutIntro agar membaca teks dari CMS
  'src/components/home/AboutIntro.tsx': `'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { HOME_CONTENT } from '@/content/siteData';
import { DESIGN_TOKENS } from '@/lib/tokens';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { KodeinMarkSvg } from '@/components/ui/BrandLogo';
import { useCmsData } from '@/lib/cmsClient';
import { Locale } from '@/i18n';

export function AboutIntro() {
  const locale = useLocale() as Locale;
  const t = useTranslations('common');
  const { data } = useCmsData();
  const content = HOME_CONTENT.aboutIntro;

  const statementText = data.aboutStatement[locale] || content.statement[locale];
  const supportingText = data.aboutSupporting[locale] || content.supporting[locale];
  const brandName = DESIGN_TOKENS.brand.name;
  const parts = statementText.split(brandName);

  return (
    <section className="relative overflow-hidden bg-brand-dark py-24 md:py-36 border-b border-white/10">
      <KodeinMarkSvg
        variant="red"
        className="pointer-events-none absolute -right-28 -top-28 h-[420px] w-[420px] opacity-[0.04]"
      />

      <div className="relative z-10 mx-auto max-w-container px-6 sm:px-10 lg:px-16 xl:px-20">
        <Reveal>
          <div className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
            <span className="h-2 w-2 rounded-full bg-brand-red" />
            <span>{content.eyebrow[locale]}</span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="mt-6 max-w-5xl text-fluid-statement font-medium text-white">
            {parts.length > 1 ? (
              <>
                {parts[0]}
                <strong className="font-extrabold text-brand-red">{brandName}</strong>
                {parts[1]}
              </>
            ) : (
              statementText
            )}
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal delay={0.2} className="lg:col-span-8">
            <p className="text-base md:text-lg leading-relaxed text-zinc-400">
              {supportingText}
            </p>
          </Reveal>
          <Reveal delay={0.3} className="lg:col-span-4 lg:flex lg:justify-end">
            <Button href="/about" variant="outline">
              {t('learnMore')}
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
`,

  // Update StatisticsSection agar membaca angka dari CMS
  'src/components/home/StatisticsSection.tsx': `'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { HOME_CONTENT } from '@/content/siteData';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CountUp } from '@/components/ui/CountUp';
import { Reveal } from '@/components/ui/Reveal';
import { useCmsData } from '@/lib/cmsClient';
import { Locale } from '@/i18n';

export function StatisticsSection() {
  const locale = useLocale() as Locale;
  const { data } = useCmsData();

  return (
    <section className="bg-brand-light py-24 md:py-36 text-brand-dark">
      <div className="mx-auto max-w-container px-6 sm:px-10 lg:px-16 xl:px-20">
        <Reveal>
          <SectionHeading
            eyebrow={HOME_CONTENT.statsSection.eyebrow[locale]}
            title={HOME_CONTENT.statsSection.headline[locale]}
            lightMode
          />
        </Reveal>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-zinc-200">
          {data.stats.map((stat, idx) => (
            <Reveal
              key={stat.id}
              delay={idx * 0.06}
              className="group relative border-r border-b border-zinc-200 bg-white p-8 md:p-10 transition-colors duration-300 hover:bg-zinc-50"
            >
              <div className="h-1 w-10 bg-brand-red transition-all duration-300 group-hover:w-16" />
              <div className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight text-brand-dark">
                <CountUp
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  locale={locale}
                />
              </div>
              <h3 className="mt-4 text-lg font-bold text-brand-red">
                {stat.label[locale]}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                {stat.description[locale]}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
`,

  // Update MediaCenterClient agar membaca daftar artikel dari CMS
  'src/components/media/MediaCenterClient.tsx': `'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { Search, ArrowUpRight, PlusCircle } from 'lucide-react';
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

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              aria-label={t('searchPlaceholder')}
              className="w-full rounded-full border border-white/15 bg-black/50 py-2 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:border-brand-red focus:outline-none"
            />
          </div>
          <Link
            href="/cms"
            className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-brand-red px-4 py-2 text-xs font-bold text-white hover:bg-brand-redHover transition shrink-0"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>CMS</span>
          </Link>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {items.map((art) => {
          const href =
            art.category === 'press-release'
              ? \`/media-center/press-releases/\${art.slug}\`
              : \`/media-center/announcement/\${art.slug}\`;

          return (
            <Link
              key={art.id}
              href={href}
              className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-brand-charcoal transition hover:border-brand-red/60"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={art.image}
                  alt={art.title[locale]}
                  fill
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
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
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
`,

  // Update Detail Artikel agar bisa membaca artikel baru yang ditambahkan lewat CMS (data/cms.json)
  'src/app/[locale]/media-center/press-releases/[slug]/page.tsx': `import React from 'react';
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
`,

  'src/app/[locale]/media-center/announcement/[slug]/page.tsx': `import React from 'react';
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

export default function AnnouncementDetailPage({
  params: { locale, slug },
}: {
  params: { locale: Locale; slug: string };
}) {
  const articles = getArticles();
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  return <ArticleDetailView article={article} locale={locale} />;
}
`,

  // Update Layout Metadata untuk 3 Bahasa (ID, EN, ZH) & Alamat Ogan Ilir
  'src/app/[locale]/layout.tsx': `import React from 'react';
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
      template: \`%s | \${DESIGN_TOKENS.brand.name}\`,
    },
    description,
    icons: {
      icon: '/favicon.ico?v=3',
      shortcut: '/favicon.ico?v=3',
      apple: '/favicon.ico?v=3',
    },
    alternates: {
      canonical: \`/\${locale}\`,
      languages: {
        id: '/id',
        en: '/en',
        zh: '/zh',
      },
    },
    openGraph: {
      title,
      description,
      url: \`\${DESIGN_TOKENS.brand.domain}/\${locale}\`,
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
    logo: \`\${DESIGN_TOKENS.brand.domain}/assets/brand/kodein-logo-horizontal.svg\`,
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

console.log('🚀 Memperbarui proyek Kodein (Indralaya Utara, Ogan Ilir + 3 Bahasa + Built-in CMS)...');

// Hapus file data/cms.json lama jika ada agar ter-seed ulang dengan teks baru
const oldCmsDb = path.join(process.cwd(), 'data', 'cms.json');
if (fs.existsSync(oldCmsDb)) {
  fs.unlinkSync(oldCmsDb);
}

for (const [relativePath, content] of Object.entries(files)) {
  const fullPath = path.join(process.cwd(), relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`  ✓ Updated ${relativePath}`);
}

console.log('\n✅ Selesai! Seluruh pembaruan telah aktif:');
console.log('  • Nama murni: Kodein');
console.log('  • Lokasi: Gang Lampung 1, Indralaya Utara, Kabupaten Ogan Ilir, Sumatera Selatan');
console.log('  • Bahasa: Indonesia (/id), English (/en), Mandarin (/zh)');
console.log('  • Halaman Admin CMS: http://localhost:3000/id/cms (PIN: kodein2026)');