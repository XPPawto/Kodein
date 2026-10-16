import fs from 'fs';
import path from 'path';

// Geometri inti 6 kapsul melingkar Kodein (C6 rotational symmetry)
const KODEIN_CAPSULES_GROUP = `
    <g transform="rotate(0 256 256)">
      <rect x="171" y="130" width="46" height="114" rx="23" transform="rotate(-4 194 187)" />
    </g>
    <g transform="rotate(60 256 256)">
      <rect x="171" y="130" width="46" height="114" rx="23" transform="rotate(-4 194 187)" />
    </g>
    <g transform="rotate(120 256 256)">
      <rect x="171" y="130" width="46" height="114" rx="23" transform="rotate(-4 194 187)" />
    </g>
    <g transform="rotate(180 256 256)">
      <rect x="171" y="130" width="46" height="114" rx="23" transform="rotate(-4 194 187)" />
    </g>
    <g transform="rotate(240 256 256)">
      <rect x="171" y="130" width="46" height="114" rx="23" transform="rotate(-4 194 187)" />
    </g>
    <g transform="rotate(300 256 256)">
      <rect x="171" y="130" width="46" height="114" rx="23" transform="rotate(-4 194 187)" />
    </g>`;

const files = {
  'package.json': `{
  "name": "kodein-software-house-profile",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.9.0",
    "clsx": "^2.1.1",
    "embla-carousel-autoplay": "^8.3.0",
    "embla-carousel-react": "^8.3.0",
    "framer-motion": "^11.11.1",
    "lucide-react": "^0.446.0",
    "next": "14.2.15",
    "next-intl": "^3.22.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.53.0",
    "tailwind-merge": "^2.5.3",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node": "^20.16.10",
    "@types/react": "^18.3.10",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.20",
    "eslint": "^8.57.1",
    "eslint-config-next": "14.2.15",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.13",
    "typescript": "^5.6.2"
  }
}
`,

  'tsconfig.json': `{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
`,

  'tailwind.config.ts': `import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#000000',
          dark: '#0A0A0A',
          charcoal: '#141210',
          surface: '#1A1817',
          border: '#262626',
          red: '#EE2B10',
          redHover: '#C91F08',
          coral: '#FF5526',
          gold: '#C5A059',
          light: '#F8F9FA',
          muted: '#A1A1AA',
        },
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        container: '1280px',
      },
      fontSize: {
        'fluid-hero': ['clamp(2.25rem, 4.5vw + 1rem, 4.25rem)', { lineHeight: '1.08', letterSpacing: '-0.03em' }],
        'fluid-h1': ['clamp(2rem, 3.8vw + 0.75rem, 3.5rem)', { lineHeight: '1.12', letterSpacing: '-0.025em' }],
        'fluid-h2': ['clamp(1.75rem, 2.8vw + 0.5rem, 2.75rem)', { lineHeight: '1.18', letterSpacing: '-0.02em' }],
        'fluid-statement': ['clamp(1.5rem, 2.5vw + 0.5rem, 2.5rem)', { lineHeight: '1.3', letterSpacing: '-0.015em' }],
      },
      transitionTimingFunction: {
        institutional: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      boxShadow: {
        card: '0 20px 40px -15px rgba(0, 0, 0, 0.5)',
        subtle: '0 4px 20px -2px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
`,

  'postcss.config.js': `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`,

  'next.config.mjs': `import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
`,

  '.eslintrc.json': `{
  "extends": ["next/core-web-vitals"]
}
`,

  '.gitignore': `node_modules
.next
out
.env*.local
.DS_Store
*.tsbuildinfo
next-env.d.ts
`,

  '.env.example': `NEXT_PUBLIC_SITE_URL=https://www.kodein.co.id
SMTP_HOST=smtp.kodein.co.id
SMTP_PORT=587
SMTP_USER=hello@kodein.co.id
SMTP_PASS=replace_with_secret
`,

  'Dockerfile': `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]
`,

  'public/robots.txt': `User-agent: *
Allow: /

Sitemap: https://www.kodein.co.id/sitemap.xml
`,

  'public/site.webmanifest': `{
  "name": "Kodein — Web Development & Custom Software Engineering",
  "short_name": "Kodein",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    },
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml"
    }
  ],
  "theme_color": "#0A0A0A",
  "background_color": "#0A0A0A",
  "display": "standalone"
}
`,

  'public/favicon.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="80 80 352 352" fill="none">
  <g fill="#EE2B10">${KODEIN_CAPSULES_GROUP}
  </g>
</svg>
`,

  'public/assets/brand/kodein-mark.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <g fill="#EE2B10">${KODEIN_CAPSULES_GROUP}
  </g>
</svg>
`,

  'public/assets/brand/kodein-mark-black.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <g fill="#14100E">${KODEIN_CAPSULES_GROUP}
  </g>
</svg>
`,

  'public/assets/brand/kodein-mark-white.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <g fill="#FFFFFF">${KODEIN_CAPSULES_GROUP}
  </g>
</svg>
`,

  'public/assets/brand/kodein-mark-gradient.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <defs>
    <linearGradient id="kodeinGrad" x1="120" y1="120" x2="392" y2="392" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FF5E2B" />
      <stop offset="100%" stop-color="#EE2B10" />
    </linearGradient>
  </defs>
  <g fill="url(#kodeinGrad)">${KODEIN_CAPSULES_GROUP}
  </g>
</svg>
`,

  'public/assets/brand/kodein-profile-dark.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <rect width="512" height="512" fill="#14110F" />
  <g fill="#FF5526">${KODEIN_CAPSULES_GROUP}
  </g>
</svg>
`,

  'public/assets/brand/kodein-profile-red.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <rect width="512" height="512" fill="#EE2B10" />
  <g fill="#FFFFFF">${KODEIN_CAPSULES_GROUP}
  </g>
</svg>
`,

  'public/assets/brand/kodein-profile-white.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <rect width="512" height="512" fill="#FFFFFF" />
  <g fill="#EE2B10">${KODEIN_CAPSULES_GROUP}
  </g>
</svg>
`,

  'public/assets/brand/kodein-logo-horizontal.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 420" fill="none">
  <g transform="translate(10, -46)" fill="#EE2B10">${KODEIN_CAPSULES_GROUP}
  </g>
  <text x="505" y="278" fill="#14110F" font-family="Plus Jakarta Sans, Inter, system-ui, sans-serif" font-size="195" font-weight="800" letter-spacing="-0.03em">Kodein</text>
</svg>
`,

  'public/assets/brand/kodein-logo-horizontal-dark.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 420" fill="none">
  <g transform="translate(10, -46)" fill="#FF5526">${KODEIN_CAPSULES_GROUP}
  </g>
  <text x="505" y="278" fill="#FFFFFF" font-family="Plus Jakarta Sans, Inter, system-ui, sans-serif" font-size="195" font-weight="800" letter-spacing="-0.03em">Kodein</text>
</svg>
`,

  'public/assets/brand/kodein-logo-horizontal-mono-white.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 420" fill="none">
  <g transform="translate(10, -46)" fill="#FFFFFF">${KODEIN_CAPSULES_GROUP}
  </g>
  <text x="505" y="278" fill="#FFFFFF" font-family="Plus Jakarta Sans, Inter, system-ui, sans-serif" font-size="195" font-weight="800" letter-spacing="-0.03em">Kodein</text>
</svg>
`,

  'src/i18n.ts': `import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

export const locales = ['id', 'en'] as const;
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

  'src/navigation.ts': `import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { locales } from './i18n';

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales });
`,

  'src/middleware.ts': `import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export const config = {
  matcher: ['/', '/(id|en)/:path*', '/((?!api|_next|_vercel|.*\\\\..*).*)'],
};
`,

  'src/styles/globals.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --bg-dark: #0a0a0a;
    --accent-red: #ee2b10;
  }

  html {
    scroll-behavior: smooth;
    background-color: #0a0a0a;
    color: #ffffff;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  ::selection {
    background-color: #ee2b10;
    color: #ffffff;
  }

  :focus-visible {
    outline: 2px solid #ee2b10;
    outline-offset: 3px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  ::before,
  ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
`,

  'src/lib/tokens.ts': `export const DESIGN_TOKENS = {
  brand: {
    name: 'Kodein',
    shortName: 'Kodein',
    legalName: 'PT Kodein Teknologi Indonesia — Web, Software & Digital Engineering',
    domain: 'https://www.kodein.co.id',
    address: 'Kodein Tech Hub, Jl. Jenderal Sudirman Kav. 1, Jakarta 12190, Indonesia',
    email: 'hello@kodein.co.id',
    irEmail: 'partnership@kodein.co.id',
    phone: '+62 21 5080 9000',
    socials: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
    },
    logos: {
      faviconSvg: '/favicon.svg',
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

export function formatDate(dateString: string, locale: Locale): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === 'id' ? 'id-ID' : 'en-US').format(value);
}

export function sanitizeText(input: string): string {
  return input.replace(/[<>]/g, '');
}
`,

  'messages/id.json': `{
  "nav": {
    "mainSite": "Kodein Digital",
    "dam": "Web & Software Engineering",
    "dim": "AI, Data & Automation",
    "ddmf": "Cloud & Managed DevOps",
    "about": "Tentang Kami",
    "aboutDesc": "Profil studio engineering, visi produk, tim ahli, dan budaya kerja Kodein.",
    "ecosystem": "Layanan & Solusi",
    "governance": "Standar & Keamanan",
    "governanceDesc": "Standar kualitas kode (QA), kepatuhan ISO/SOC2, perlindungan NDA, dan keamanan siber.",
    "wbs": "Pelaporan Keamanan & Etika",
    "wbsDesc": "Saluran pelaporan celah keamanan (Bug Bounty/VDP) dan etika kerja secara rahasia.",
    "media": "Insight & Berita",
    "investor": "Kemitraan & Klien",
    "help": "Konsultasi Proyek",
    "learnMore": "Pelajari Lebih Lanjut",
    "skipToContent": "Lewati ke konten utama"
  },
  "common": {
    "learnMore": "Pelajari Lebih Lanjut",
    "comingSoon": "Segera Hadir",
    "pressRelease": "Rilis Produk",
    "announcement": "Pengumuman",
    "all": "Semua",
    "searchPlaceholder": "Cari rilis produk, studi kasus, atau artikel...",
    "backToMedia": "Kembali ke Insight & Berita",
    "share": "Bagikan Artikel",
    "copied": "Tautan Disalin",
    "relatedArticles": "Artikel Terkait",
    "readArticle": "Baca Selengkapnya",
    "backToTop": "Kembali ke atas",
    "cookieText": "Kodein menggunakan kuki esensial dan analitik untuk memastikan performa situs web dan keamanan sesi Anda tetap optimal.",
    "cookieAccept": "Setuju & Tutup"
  },
  "footer": {
    "mainSites": "Divisi Layanan",
    "mediaCenter": "Wawasan & Publikasi",
    "otherLinks": "Tautan Klien",
    "pressReleases": "Rilis Produk & Berita",
    "investorRelations": "Kemitraan Strategis",
    "wbs": "Pelaporan Etika & Bug",
    "vdp": "Konsultasi Pembuatan Website",
    "rights": "Hak Cipta Dilindungi Undang-Undang."
  }
}
`,

  'messages/en.json': `{
  "nav": {
    "mainSite": "Kodein Digital",
    "dam": "Web & Software Engineering",
    "dim": "AI, Data & Automation",
    "ddmf": "Cloud & Managed DevOps",
    "about": "About Us",
    "aboutDesc": "Our engineering studio profile, product vision, specialist team, and culture.",
    "ecosystem": "Services & Solutions",
    "governance": "Quality & Security",
    "governanceDesc": "Code quality standards (QA), ISO/SOC2 compliance, NDA protection, and cybersecurity.",
    "wbs": "Security & Ethics Reporting",
    "wbsDesc": "Confidential channel for vulnerability disclosure and ethical reporting.",
    "media": "News & Insights",
    "investor": "Client Partnerships",
    "help": "Start a Project",
    "learnMore": "Learn More",
    "skipToContent": "Skip to main content"
  },
  "common": {
    "learnMore": "Learn More",
    "comingSoon": "Coming Soon",
    "pressRelease": "Product Release",
    "announcement": "Announcement",
    "all": "All",
    "searchPlaceholder": "Search product releases, case studies, or news...",
    "backToMedia": "Back to News & Insights",
    "share": "Share Article",
    "copied": "Link Copied",
    "relatedArticles": "Related Articles",
    "readArticle": "Read Article",
    "backToTop": "Back to top",
    "cookieText": "Kodein uses essential and analytical cookies to ensure optimal web performance and session security.",
    "cookieAccept": "Accept & Close"
  },
  "footer": {
    "mainSites": "Service Divisions",
    "mediaCenter": "Insights & Media",
    "otherLinks": "Client Links",
    "pressReleases": "Product Releases & News",
    "investorRelations": "Strategic Partnerships",
    "wbs": "Security & Ethics Channel",
    "vdp": "Book a Project Consultation",
    "rights": "All Rights Reserved."
  }
}
`,

  'src/content/types.ts': `export type ArticleCategory = 'press-release' | 'announcement';

export interface Article {
  id: string;
  slug: string;
  category: ArticleCategory;
  date: string;
  image: string;
  title: { id: string; en: string };
  excerpt: { id: string; en: string };
  content: { id: string[]; en: string[] };
  quote?: { id: string; en: string };
}

export interface StatItem {
  id: string;
  prefix?: string;
  value: number;
  suffix?: string;
  label: { id: string; en: string };
  description: { id: string; en: string };
}

export interface MilestoneItem {
  id: string;
  month: { id: string; en: string };
  day: string;
  year: string;
  title: { id: string; en: string };
  description: { id: string; en: string };
  image: string;
  isCap?: boolean;
}

export interface ScopeEntity {
  id: 'main' | 'dam' | 'dim' | 'ddmf';
  code: string;
  title: { id: string; en: string };
  shortDesc: { id: string; en: string };
  href: string;
  image: string;
}

export interface EntityDetailData {
  slug: 'dam' | 'dim' | 'ddmf';
  code: string;
  name: { id: string; en: string };
  tagline: { id: string; en: string };
  heroImage: string;
  overview: { id: string[]; en: string[] };
  focusAreas: Array<{
    title: { id: string; en: string };
    description: { id: string; en: string };
  }>;
  highlights: Array<{
    metric: string;
    label: { id: string; en: string };
  }>;
}
`,

  'src/content/assets.ts': `export const BLUR_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMklEQVR4nAEnANj/AAoKCg8PDxUVFREREREKCgoUFBQeHh4YGBgACgoKDAwMEBAQDg4O9g4R672fdN8AAAAASUVORK5CYII=';

export const ASSETS = {
  brand: {
    mark: '/assets/brand/kodein-mark.svg',
    markGradient: '/assets/brand/kodein-mark-gradient.svg',
    markWhite: '/assets/brand/kodein-mark-white.svg',
    markBlack: '/assets/brand/kodein-mark-black.svg',
    profileDark: '/assets/brand/kodein-profile-dark.svg',
    profileRed: '/assets/brand/kodein-profile-red.svg',
    profileWhite: '/assets/brand/kodein-profile-white.svg',
    logoHorizontal: '/assets/brand/kodein-logo-horizontal.svg',
    logoHorizontalDark: '/assets/brand/kodein-logo-horizontal-dark.svg',
    logoHorizontalMonoWhite: '/assets/brand/kodein-logo-horizontal-mono-white.svg',
  },
  hero: {
    slide1: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1920&q=85',
    slide2: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=85',
    slide3: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1920&q=85',
    slide4: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=85',
    slide5: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=85',
  },
  scope: {
    main: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    dam: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1200&q=80',
    dim: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
    ddmf: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
  },
  reports: {
    cover: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80',
  },
  timeline: {
    m1: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    m2: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    m3: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    m4: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80',
    m5: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
  },
  leadership: {
    portrait: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=80',
    exec1: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    exec2: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    exec3: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    exec4: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
  },
} as const;
`,

  'src/content/siteData.ts': `import { ASSETS } from './assets';
import { EntityDetailData, MilestoneItem, ScopeEntity, StatItem } from './types';

export const HOME_CONTENT = {
  aboutIntro: {
    eyebrow: { id: 'Tentang Kami', en: 'About Us' },
    statement: {
      id: 'Kodein adalah perusahaan rekayasa perangkat lunak, pembuatan website, dan transformasi digital yang merancang, membangun, serta mengoptimalkan sistem teknologi berkinerja tinggi untuk mengakselerasi pertumbuhan bisnis modern.',
      en: 'Kodein is a premier software engineering, web development, and digital transformation company that designs, builds, and scales high-performance technology systems to accelerate modern business growth.',
    },
    supporting: {
      id: 'Sebagai mitra teknologi tepercaya bagi korporasi, instansi, dan startup ambisius, Kodein memadukan desain UI/UX presisi, arsitektur kode modern, serta infrastruktur cloud yang aman untuk menghadirkan produk digital kelas dunia.',
      en: 'As a trusted technology partner for enterprises, institutions, and ambitious startups, Kodein combines precision UI/UX design, clean code architecture, and secure cloud infrastructure to deliver world-class digital products.',
    },
  },
  scopeSection: {
    eyebrow: { id: 'Lingkup Layanan', en: 'Scope of Services' },
    headline: {
      id: 'Melalui pendekatan engineering terintegrasi, setiap produk digital dirancang secara presisi, dibangun untuk skala besar, dan dioptimalkan demi dampak bisnis nyata.',
      en: 'Through an integrated engineering approach, every digital product is precision-crafted, built for scale, and optimized for measurable business impact.',
    },
  },
  statsSection: {
    eyebrow: { id: 'Rekam Jejak', en: 'Track Record' },
    headline: {
      id: 'Capaian Kodein dalam Angka',
      en: 'Kodein Impact in Numbers',
    },
  },
  reportsSection: {
    eyebrow: { id: 'Katalog & Studi Kasus', en: 'Capabilities & Case Studies' },
    headline: {
      id: 'Akses dokumen Company Profile, katalog solusi pembuatan website & software, serta studi kasus teknis Kodein.',
      en: 'Access our official Company Profile deck, web & software solution catalog, and engineering case studies.',
    },
    subtext: {
      id: 'Pelajari bagaimana metodologi Agile, standar keamanan kode, dan arsitektur modern kami membantu klien memangkas biaya operasional dan mempercepat peluncuran produk.',
      en: 'Discover how our Agile methodology, strict code security standards, and modern architecture help clients cut operational overhead and ship products faster.',
    },
    reportsAvailable: false,
  },
  journeySection: {
    eyebrow: { id: 'Perjalanan', en: 'Journey' },
    headline: {
      id: 'Jejak Inovasi Kodein',
      en: 'The Evolution of Kodein',
    },
    launchLabel: {
      id: 'Peluncuran Studio Kodein',
      en: 'Launch of Kodein Studio',
    },
  },
  quoteSection: {
    beforeHighlight: {
      id: '“Teknologi dan perangkat lunak yang hebat bukan sekadar barisan kode, melainkan ',
      en: '“Great software and digital platforms are more than lines of code—they are ',
    },
    highlight: {
      id: 'fondasi strategis yang memberdayakan bisnis untuk tumbuh lebih cepat, efisien, dan berdampak luas',
      en: 'the strategic foundation that empowers businesses to scale faster, operate smarter, and create lasting impact',
    },
    afterHighlight: {
      id: ' di era ekonomi digital global.”',
      en: ' in the global digital economy.”',
    },
    author: {
      id: 'Chief Executive Officer & Principal Architect',
      en: 'Chief Executive Officer & Principal Architect',
    },
    occasion: {
      id: 'Kodein Digital Engineering Keynote, Jakarta',
      en: 'Kodein Digital Engineering Keynote, Jakarta',
    },
  },
};

export const SCOPE_ENTITIES: ScopeEntity[] = [
  {
    id: 'main',
    code: 'KODEIN',
    title: { id: 'Kodein Digital Studio', en: 'Kodein Digital Studio' },
    shortDesc: {
      id: 'Konsultan utama strategi produk digital, desain UI/UX, dan transformasi teknologi skala korporasi.',
      en: 'Principal consultancy for digital product strategy, UI/UX design, and enterprise technology transformation.',
    },
    href: '/about',
    image: ASSETS.scope.main,
  },
  {
    id: 'dam',
    code: 'WEB & APP',
    title: { id: 'Web & Software Engineering', en: 'Web & Software Engineering' },
    shortDesc: {
      id: 'Pembuatan website korporat, aplikasi web kustom, e-commerce, dan aplikasi mobile (iOS & Android) berkinerja tinggi.',
      en: 'Custom corporate websites, scalable web applications, e-commerce platforms, and native/cross-platform mobile apps.',
    },
    href: '/dam',
    image: ASSETS.scope.dam,
  },
  {
    id: 'dim',
    code: 'AI & DATA',
    title: { id: 'AI, Data & Automation', en: 'AI, Data & Automation' },
    shortDesc: {
      id: 'Integrasi kecerdasan buatan (AI), sistem ERP/CRM kustom, otomasi alur kerja, dan analitik data cerdas.',
      en: 'Artificial intelligence integration, custom ERP/CRM systems, workflow automation, and business intelligence.',
    },
    href: '/dim',
    image: ASSETS.scope.dim,
  },
  {
    id: 'ddmf',
    code: 'CLOUD',
    title: { id: 'Cloud & Managed DevOps', en: 'Cloud & Managed DevOps' },
    shortDesc: {
      id: 'Infrastruktur cloud berkeamanan tinggi, CI/CD, optimasi server, serta layanan pemeliharaan sistem 24/7.',
      en: 'High-security cloud infrastructure, CI/CD pipelines, server optimization, and 24/7 managed maintenance.',
    },
    href: '/ddmf',
    image: ASSETS.scope.ddmf,
  },
];

export const STATISTICS_DATA: StatItem[] = [
  {
    id: 'projects-delivered',
    value: 250,
    suffix: '+',
    label: { id: 'Website & Software Diluncurkan', en: 'Websites & Software Shipped' },
    description: {
      id: 'Proyek pembuatan website, aplikasi mobile, dan sistem enterprise yang sukses beroperasi.',
      en: 'Custom websites, mobile apps, and enterprise software platforms successfully delivered.',
    },
  },
  {
    id: 'system-uptime',
    value: 99,
    suffix: '.9%',
    label: { id: 'Keandalan & Uptime Sistem', en: 'System Uptime & Reliability' },
    description: {
      id: 'Tingkat ketersediaan tinggi berkat arsitektur cloud modern dan pemantauan proaktif 24/7.',
      en: 'High availability powered by resilient cloud-native architecture and 24/7 monitoring.',
    },
  },
  {
    id: 'conversion-growth',
    prefix: '+',
    value: 145,
    suffix: '%',
    label: { id: 'Lonjakan Performa & Konversi', en: 'Performance & Conversion Lift' },
    description: {
      id: 'Rata-rata peningkatan kecepatan akses (Core Web Vitals) dan rasio konversi bisnis klien.',
      en: 'Average improvement in Core Web Vitals speed and client digital conversion rates.',
    },
  },
  {
    id: 'active-users',
    value: 15,
    suffix: 'M+',
    label: { id: 'Pengguna Akhir Terlayani', en: 'End-Users Empowered' },
    description: {
      id: 'Total pengguna yang berinteraksi secara mulus pada berbagai platform digital buatan Kodein.',
      en: 'Total active users interacting seamlessly across digital platforms built by Kodein.',
    },
  },
  {
    id: 'faster-delivery',
    value: 3,
    suffix: 'x',
    label: { id: 'Akselerasi Time-to-Market', en: 'Faster Time-to-Market' },
    description: {
      id: 'Pengembangan produk lebih cepat melalui komponen modular, Agile sprint, dan pipa CI/CD otomatis.',
      en: 'Accelerated product delivery through modular design systems, Agile sprints, and automated CI/CD.',
    },
  },
  {
    id: 'engineers',
    value: 85,
    suffix: '+',
    label: { id: 'Engineer & Desainer Spesialis', en: 'Specialist Engineers & Designers' },
    description: {
      id: 'Tim full-stack developer, UI/UX designer, QA, dan arsitek cloud berpengalaman.',
      en: 'Dedicated team of full-stack developers, UI/UX designers, QA engineers, and cloud architects.',
    },
  },
];

export const TIMELINE_MILESTONES: MilestoneItem[] = [
  {
    id: 'm1',
    month: { id: 'Feb', en: 'Feb' },
    day: '24',
    year: '2025',
    title: {
      id: 'Pendirian Studio Engineering Kodein',
      en: 'Foundation of Kodein Engineering Studio',
    },
    description: {
      id: 'Kodein resmi beroperasi sebagai mitra pembuatan website premium dan pengembangan perangkat lunak kustom.',
      en: 'Kodein officially launches as a premier web development and custom software engineering partner.',
    },
    image: ASSETS.timeline.m1,
    isCap: true,
  },
  {
    id: 'm2',
    month: { id: 'Apr', en: 'Apr' },
    day: '15',
    year: '2025',
    title: {
      id: 'Peluncuran 50+ Platform Web & E-Commerce Korporat',
      en: 'Delivery of 50+ Corporate Web & E-Commerce Platforms',
    },
    description: {
      id: 'Standarisasi desain sistem modern berbasis Next.js dan TypeScript dengan skor Lighthouse di atas 95.',
      en: 'Standardizing Next.js and TypeScript design systems achieving 95+ Lighthouse performance scores.',
    },
    image: ASSETS.timeline.m2,
  },
  {
    id: 'm3',
    month: { id: 'Jun', en: 'Jun' },
    day: '28',
    year: '2025',
    title: {
      id: 'Ekspansi Divisi AI, Data & Enterprise ERP',
      en: 'Expansion of AI, Data & Enterprise ERP Division',
    },
    description: {
      id: 'Membantu perusahaan mengotomasi operasional bisnis melalui sistem ERP kustom dan asisten berbasis AI.',
      en: 'Helping enterprises automate operations through custom ERP software and AI-powered workflows.',
    },
    image: ASSETS.timeline.m3,
  },
  {
    id: 'm4',
    month: { id: 'Des', en: 'Dec' },
    day: '12',
    year: '2025',
    title: {
      id: 'Sertifikasi Keamanan Siber & Managed Cloud 24/7',
      en: 'Cybersecurity Certification & 24/7 Managed Cloud',
    },
    description: {
      id: 'Menghadirkan layanan DevOps dan pengelolaan server berstandar tinggi untuk aplikasi misi-kritis.',
      en: 'Launching enterprise-grade DevOps and 24/7 managed cloud infrastructure for mission-critical apps.',
    },
    image: ASSETS.timeline.m4,
  },
  {
    id: 'm5',
    month: { id: 'Okt', en: 'Oct' },
    day: '14',
    year: '2026',
    title: {
      id: '250+ Proyek Sukses & Mitra Transformasi Digital Terkemuka',
      en: '250+ Successful Projects & Leading Digital Partner',
    },
    description: {
      id: 'Dipercaya oleh puluhan merek nasional dan global untuk membangun ekosistem perangkat lunak masa depan.',
      en: 'Trusted by national and global brands to architect and scale next-generation software ecosystems.',
    },
    image: ASSETS.timeline.m5,
  },
];

export const ENTITY_DETAILS: Record<'dam' | 'dim' | 'ddmf', EntityDetailData> = {
  dam: {
    slug: 'dam',
    code: 'WEB & APP',
    name: { id: 'Kodein Web & Software Engineering', en: 'Kodein Web & Software Engineering' },
    tagline: {
      id: 'Jasa pembuatan website korporat, aplikasi web kustom, dan aplikasi mobile dengan desain berkelas dan performa super cepat.',
      en: 'Custom corporate websites, web applications, and mobile apps engineered for speed, aesthetics, and conversion.',
    },
    heroImage: ASSETS.scope.dam,
    overview: {
      id: [
        'Divisi Web & Software Engineering Kodein membantu bisnis membangun kehadiran digital yang kuat melalui pembuatan website company profile, portal e-commerce, SaaS, hingga aplikasi mobile lintas platform.',
        'Kami tidak menggunakan template generik. Setiap baris kode dan elemen antarmuka (UI/UX) dirancang khusus mengikuti identitas brand, target pasar, dan kebutuhan skalabilitas bisnis Anda.',
      ],
      en: [
        'Kodein’s Web & Software Engineering division helps businesses establish commanding digital presence through custom corporate websites, e-commerce portals, SaaS platforms, and cross-platform mobile apps.',
        'We never rely on generic templates. Every line of code and UI/UX interaction is custom-engineered around your brand identity, audience, and scalability requirements.',
      ],
    },
    focusAreas: [
      {
        title: { id: 'Website Korporat & Company Profile Premium', en: 'Premium Corporate Websites & Portals' },
        description: {
          id: 'Website modern dengan animasi halus, SEO-friendly, multi-bahasa, dan CMS yang mudah dikelola tim Anda.',
          en: 'Modern websites with smooth motion design, technical SEO, bilingual support, and easy-to-edit CMS.',
        },
      },
      {
        title: { id: 'Aplikasi Web Kustom & E-Commerce', en: 'Custom Web Apps & E-Commerce' },
        description: {
          id: 'Pengembangan sistem transaksi, dashboard operasional, portal pelanggan, dan integrasi payment gateway.',
          en: 'End-to-end development of transactional platforms, operational dashboards, client portals, and payment gateways.',
        },
      },
      {
        title: { id: 'Aplikasi Mobile (iOS & Android)', en: 'Mobile App Development (iOS & Android)' },
        description: {
          id: 'Aplikasi mobile responsif dan stabil menggunakan teknologi React Native, Flutter, maupun Native.',
          en: 'High-performance mobile applications built with React Native, Flutter, or native iOS/Android stacks.',
        },
      },
    ],
    highlights: [
      { metric: '95+', label: { id: 'Skor Performa Lighthouse', en: 'Lighthouse Performance Score' } },
      { metric: '250+', label: { id: 'Website & Aplikasi Dirilis', en: 'Websites & Apps Shipped' } },
      { metric: '100%', label: { id: 'Desain Kustom & Responsif', en: 'Custom & Responsive UI/UX' } },
    ],
  },
  dim: {
    slug: 'dim',
    code: 'AI & DATA',
    name: { id: 'Kodein AI, Data & Enterprise Automation', en: 'Kodein AI, Data & Enterprise Automation' },
    tagline: {
      id: 'Mengotomatisasi proses bisnis yang rumit melalui perangkat lunak ERP/CRM kustom dan kecerdasan buatan.',
      en: 'Automating complex business workflows through custom ERP/CRM software and artificial intelligence.',
    },
    heroImage: ASSETS.scope.dim,
    overview: {
      id: [
        'Divisi AI, Data & Automation Kodein berfokus pada pengembangan sistem perangkat lunak internal yang memangkas pekerjaan manual dan menyatukan data perusahaan secara real-time.',
        'Mulai dari sistem manajemen inventaris, HRIS, keuangan operasional, hingga asisten chatbot AI pintar yang terhubung dengan database perusahaan Anda.',
      ],
      en: [
        'Kodein’s AI, Data & Automation division focuses on building internal software systems that eliminate manual bottlenecks and unify enterprise data in real time.',
        'From custom inventory management and HRIS to intelligent AI assistants securely connected to your company knowledge base.',
      ],
    },
    focusAreas: [
      {
        title: { id: 'Sistem ERP, CRM & Dashboard Kustom', en: 'Custom ERP, CRM & Executive Dashboards' },
        description: {
          id: 'Perangkat lunak yang menyesuaikan alur kerja unik perusahaan Anda, bukan sebaliknya.',
          en: 'Tailor-made enterprise software built around your exact operational workflows.',
        },
      },
      {
        title: { id: 'Integrasi AI & Chatbot Cerdas (RAG/LLM)', en: 'AI Integration & Smart Agents (RAG/LLM)' },
        description: {
          id: 'Otomasi layanan pelanggan dan pencarian dokumen internal menggunakan model AI mutakhir.',
          en: 'Automating customer support and internal document intelligence using state-of-the-art AI models.',
        },
      },
      {
        title: { id: 'Integrasi API & Sinkronisasi Sistem', en: 'API Integration & Legacy Modernization' },
        description: {
          id: 'Menghubungkan berbagai software lama dan pihak ketiga agar saling berkomunikasi secara otomatis.',
          en: 'Connecting disparate third-party tools and modernizing legacy software into unified APIs.',
        },
      },
    ],
    highlights: [
      { metric: '-60%', label: { id: 'Efisiensi Waktu Operasional', en: 'Operational Time Saved' } },
      { metric: '24/7', label: { id: 'Otomasi Agen AI Aktif', en: 'Active AI Workflow Automation' } },
      { metric: 'REST/GraphQL', label: { id: 'Arsitektur API Terbuka', en: 'Modern API Architecture' } },
    ],
  },
  ddmf: {
    slug: 'ddmf',
    code: 'CLOUD',
    name: { id: 'Kodein Cloud, DevOps & Managed Services', en: 'Kodein Cloud, DevOps & Managed Services' },
    tagline: {
      id: 'Menjaga website dan aplikasi Anda tetap cepat, aman dari serangan siber, dan selalu aktif 24/7.',
      en: 'Keeping your websites and software fast, cyber-resilient, and running smoothly 24/7.',
    },
    heroImage: ASSETS.scope.ddmf,
    overview: {
      id: [
        'Peluncuran website atau aplikasi hanyalah langkah awal. Divisi Cloud & Managed DevOps Kodein memastikan sistem Anda siap menghadapi lonjakan trafik tinggi tanpa kendala.',
        'Kami menangani setup server AWS/GCP/VPS, otomatisasi deployment, backup harian, hingga audit keamanan rutin agar tim Anda dapat fokus penuh pada bisnis.',
      ],
      en: [
        'Launching a website or application is just the beginning. Kodein’s Cloud & Managed DevOps division ensures your systems handle traffic spikes effortlessly.',
        'We manage AWS/GCP/VPS provisioning, automated deployments, daily backups, and security hardening so your team can focus on business growth.',
      ],
    },
    focusAreas: [
      {
        title: { id: 'Arsitektur Cloud & Optimasi Server', en: 'Cloud Architecture & Server Optimization' },
        description: {
          id: 'Konfigurasi server berkecepatan tinggi dengan auto-scaling dan efisiensi biaya bulanan.',
          en: 'High-speed server configuration with auto-scaling and cloud cost optimization.',
        },
      },
      {
        title: { id: 'Keamanan Siber, SSL & Proteksi DDoS', en: 'Cybersecurity, WAF & DDoS Protection' },
        description: {
          id: 'Perlindungan berlapis terhadap serangan siber, enkripsi data, dan pengujian penetrasi berkala.',
          en: 'Multi-layered defense against cyber threats, data encryption, and regular penetration testing.',
        },
      },
      {
        title: { id: 'Maintenance Website & Dukungan Teknis SLA', en: 'Website Maintenance & Dedicated SLA Support' },
        description: {
          id: 'Pembaruan fitur rutin, perbaikan bug cepat, dan pemantauan kesehatan sistem sepanjang waktu.',
          en: 'Continuous feature updates, rapid bug resolution, and round-the-clock system health monitoring.',
        },
      },
    ],
    highlights: [
      { metric: '99.9%', label: { id: 'Jaminan Uptime SLA', en: 'Guaranteed SLA Uptime' } },
      { metric: '<15m', label: { id: 'Waktu Respons Insiden Kritis', en: 'Critical Incident Response' } },
      { metric: 'ISO/OWASP', label: { id: 'Standar Keamanan Aplikasi', en: 'Application Security Standard' } },
    ],
  },
};

export const ABOUT_PAGE_DATA = {
  vision: {
    id: 'Menjadi mitra rekayasa perangkat lunak dan pembuatan website terdepan di Indonesia yang menghadirkan solusi teknologi berstandar global untuk mempercepat kesuksesan bisnis klien.',
    en: 'To be Indonesia’s foremost software engineering and web development partner, delivering global-standard technology solutions that accelerate client success.',
  },
  missions: {
    id: [
      'Merancang dan membangun website serta aplikasi kustom dengan kualitas kode terbaik, desain presisi, dan performa tinggi.',
      'Membantu bisnis dari berbagai skala melakukan digitalisasi dan otomasi operasional secara efisien dan terukur.',
      'Memberikan layanan purnajual, keamanan sistem, dan dukungan teknis jangka panjang yang dapat diandalkan.',
    ],
    en: [
      'Design and engineer custom websites and applications with clean code, precision UI/UX, and blazing performance.',
      'Empower businesses of all sizes to digitize and automate operations efficiently and measurably.',
      'Provide dependable long-term maintenance, system security, and responsive technical support.',
    ],
  },
  values: [
    {
      code: '01',
      title: { id: 'Kualitas Kode Tanpa Kompromi', en: 'Uncompromising Code Quality' },
      desc: {
        id: 'Setiap proyek ditulis dengan standar clean code, modular, mudah dikembangkan, dan melalui pengujian QA ketat.',
        en: 'Every project is written with clean, modular, maintainable code and undergoes rigorous QA testing.',
      },
    },
    {
      code: '02',
      title: { id: 'Desain Berorientasi Pengguna', en: 'Human-Centric UI/UX Design' },
      desc: {
        id: 'Memadukan estetika modern dengan kemudahan navigasi untuk menghasilkan konversi bisnis yang tinggi.',
        en: 'Blending modern aesthetics with intuitive usability to drive measurable user engagement and conversion.',
      },
    },
    {
      code: '03',
      title: { id: 'Transparansi & Ketepatan Waktu', en: 'Transparency & On-Time Delivery' },
      desc: {
        id: 'Komunikasi terbuka di setiap sprint dengan pelaporan progres berkala dan jadwal rilis yang jelas.',
        en: 'Open communication across every sprint with regular progress demos and predictable delivery timelines.',
      },
    },
    {
      code: '04',
      title: { id: 'Kemitraan Jangka Panjang', en: 'Long-Term Tech Partnership' },
      desc: {
        id: 'Kami tumbuh bersama klien sebagai konsultan dan tim teknis yang siap mendukung ekspansi bisnis kapan saja.',
        en: 'We grow alongside our clients as a dedicated technical partner ready to support continuous expansion.',
      },
    },
  ],
  leadership: [
    {
      name: 'Raka Pratama, M.Kom',
      role: { id: 'Chief Executive Officer & Principal Architect', en: 'Chief Executive Officer & Principal Architect' },
      image: ASSETS.leadership.exec1,
    },
    {
      name: 'Dimas Aditya',
      role: { id: 'VP of Web & Software Engineering', en: 'VP of Web & Software Engineering' },
      image: ASSETS.leadership.exec2,
    },
    {
      name: 'Nadia Kusuma',
      role: { id: 'Head of Product Design (UI/UX)', en: 'Head of Product Design (UI/UX)' },
      image: ASSETS.leadership.exec3,
    },
    {
      name: 'Bima Santoso',
      role: { id: 'Head of Cloud, DevOps & Security', en: 'Head of Cloud, DevOps & Security' },
      image: ASSETS.leadership.exec4,
    },
  ],
};

export const FAQ_ITEMS = [
  {
    category: 'Services',
    q: {
      id: 'Layanan apa saja yang ditawarkan oleh Kodein?',
      en: 'What services does Kodein provide?',
    },
    a: {
      id: 'Kodein melayani jasa pembuatan website (Company Profile, E-Commerce, Portal Berita, Web App), pengembangan software kustom (ERP, CRM, HRIS), pembuatan aplikasi mobile (Android & iOS), desain UI/UX, hingga pengelolaan server cloud dan maintenance.',
      en: 'Kodein provides custom website development (Corporate, E-Commerce, Web Apps), custom enterprise software (ERP, CRM, HRIS), mobile app development (iOS & Android), UI/UX design, and managed cloud/maintenance services.',
    },
  },
  {
    category: 'Process',
    q: {
      id: 'Berapa lama waktu pengerjaan sebuah website atau aplikasi di Kodein?',
      en: 'How long does it take to build a website or software project?',
    },
    a: {
      id: 'Untuk website company profile premium umumnya membutuhkan waktu 2–4 minggu. Sedangkan untuk sistem web aplikasi kustom, e-commerce, atau aplikasi mobile berkisar antara 6–16 minggu tergantung kompleksitas fitur.',
      en: 'A premium corporate profile website typically takes 2–4 weeks. Custom web applications, e-commerce platforms, or mobile apps range from 6–16 weeks depending on feature complexity.',
    },
  },
  {
    category: 'Tech',
    q: {
      id: 'Teknologi (Tech Stack) apa yang digunakan oleh tim Kodein?',
      en: 'What technology stack does Kodein use?',
    },
    a: {
      id: 'Kami menggunakan teknologi modern berstandar industri seperti Next.js, React, TypeScript, Tailwind CSS, Node.js, Go, Laravel, Python, PostgreSQL, serta Flutter/React Native untuk aplikasi mobile.',
      en: 'We use modern, industry-standard technologies including Next.js, React, TypeScript, Tailwind CSS, Node.js, Go, Laravel, Python, PostgreSQL, and Flutter/React Native for mobile apps.',
    },
  },
  {
    category: 'Support',
    q: {
      id: 'Apakah Kodein memberikan garansi, source code, dan layanan maintenance setelah website selesai?',
      en: 'Do you provide warranty, source code ownership, and post-launch maintenance?',
    },
    a: {
      id: 'Ya! Setiap proyek dilengkapi garansi bug-free pasca-peluncuran, serah terima hak milik penuh atas source code (sesuai kontrak), pelatihan penggunaan CMS, serta opsi paket maintenance bulanan/tahunan.',
      en: 'Yes! Every project includes a post-launch warranty, full source code ownership handover, CMS training for your team, and optional monthly/annual maintenance SLA packages.',
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
      id: 'Kodein Luncurkan Arsitektur Web Enterprise Generasi Baru Berbasis Next.js & Edge Cloud',
      en: 'Kodein Unveils Next-Gen Enterprise Web Architecture Powered by Next.js & Edge Cloud',
    },
    excerpt: {
      id: 'Membantu perusahaan menghadirkan website dan aplikasi web dengan waktu muat di bawah 1 detik serta keamanan tingkat tinggi.',
      en: 'Empowering businesses to deploy corporate websites and web apps with sub-second load times and enterprise security.',
    },
    content: {
      id: [
        'JAKARTA — Kodein secara resmi memperkenalkan kerangka kerja (framework) arsitektur web enterprise terbaru yang dirancang khusus untuk perusahaan yang membutuhkan kecepatan ekstrem, SEO maksimal, dan keamanan tinggi.',
        'Dengan menggabungkan Next.js App Router, TypeScript ketat, dan distribusi Edge Cloud, website yang dibangun oleh Kodein mampu mencetak skor performa sempurna sekaligus menekan biaya server hingga 40%.',
        'Layanan ini kini tersedia bagi seluruh klien baru Kodein, baik untuk kebutuhan pembuatan website korporat, portal layanan publik, maupun platform e-commerce berskala besar.',
      ],
      en: [
        'JAKARTA — Kodein officially unveils its latest enterprise web architecture framework designed for organizations demanding extreme speed, technical SEO excellence, and bank-grade security.',
        'By combining Next.js App Router, strict TypeScript, and Edge Cloud distribution, websites engineered by Kodein achieve top Lighthouse scores while reducing server costs by up to 40%.',
        'This architecture is now standard across all new Kodein client engagements, from corporate websites to high-volume e-commerce platforms.',
      ],
    },
    quote: {
      id: 'Website adalah wajah sekaligus mesin pertumbuhan bisnis Anda; kecepatannya menentukan kepercayaan pelanggan sejak detik pertama.',
      en: 'Your website is both the face and growth engine of your business; its speed defines customer trust from the very first second.',
    },
  },
  {
    id: 'art-2',
    slug: 'customer-service-excellence-award-100-state-enterprises',
    category: 'press-release',
    date: '2026-10-08',
    image: ASSETS.hero.slide2,
    title: {
      id: 'Kodein Rampungkan Transformasi Digital & Pembuatan Sistem Web untuk 100+ Klien Korporasi',
      en: 'Kodein Completes Digital Transformation & Custom Web Systems for 100+ Corporate Clients',
    },
    excerpt: {
      id: 'Desain UI/UX modern dan integrasi sistem backend yang mulus mendorong lonjakan kepuasan pengguna dan efisiensi operasional klien.',
      en: 'Modern UI/UX design and seamless backend integration drive record user satisfaction and operational efficiency.',
    },
    content: {
      id: [
        'JAKARTA — Divisi Web & Software Engineering Kodein mencatatkan tonggak pencapaian baru dengan merampungkan lebih dari 100 proyek transformasi website dan perangkat lunak korporasi dengan tingkat kepuasan klien mencapai 98%.',
        'Setiap proyek dikerjakan melalui tahapan riset pengguna mendalam, pembuatan prototipe interaktif, hingga pengujian otomatis sebelum diluncurkan ke publik.',
        'Pencapaian ini mempertegas posisi Kodein sebagai software house dan agensi pengembangan web pilihan utama bagi perusahaan di Indonesia.',
      ],
      en: [
        'JAKARTA — Kodein’s Web & Software Engineering division has reached a major milestone, completing over 100 corporate web and custom software projects with a 98% client satisfaction rating.',
        'Each engagement follows rigorous user research, interactive prototyping, and automated QA testing prior to production release.',
        'This milestone reinforces Kodein’s position as a premier software house and web development partner in Indonesia.',
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
      id: 'Standar Keamanan Siber Berlapis pada Setiap Aplikasi & Website Buatan Kodein',
      en: 'Multi-Layered Cybersecurity Standards Embedded in Every Kodein Web & Software Project',
    },
    excerpt: {
      id: 'Penerapan standar OWASP Top 10, enkripsi ujung-ke-ujung, dan perlindungan DDoS otomatis untuk melindungi data bisnis klien.',
      en: 'Implementing OWASP Top 10 compliance, end-to-end encryption, and automated DDoS mitigation to protect client data.',
    },
    content: {
      id: [
        'JAKARTA — Kodein memperkuat komitmen keamanan perangkat lunak dengan mengintegrasikan audit kerentanan otomatis (DevSecOps) pada seluruh siklus pembuatan website dan aplikasi klien.',
        'Melalui perlindungan Web Application Firewall (WAF) dan pengujian penetrasi berkala, seluruh platform yang dikelola Kodein terlindungi dari ancaman injeksi data maupun serangan siber.',
        'Klien juga mendapatkan jaminan kerahasiaan penuh melalui perjanjian Non-Disclosure Agreement (NDA) sejak tahap konsultasi awal.',
      ],
      en: [
        'JAKARTA — Kodein strengthens its software security commitment by embedding automated vulnerability auditing (DevSecOps) across every web and application development lifecycle.',
        'With Web Application Firewall (WAF) protection and regular penetration testing, platforms managed by Kodein remain resilient against modern cyber threats.',
        'All clients are further protected by strict Non-Disclosure Agreements (NDA) from the initial consultation phase.',
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
      id: 'Studi Kasus: Platform E-Commerce & Booking Properti Buatan Kodein Tingkatkan Penjualan 210%',
      en: 'Case Study: Custom E-Commerce & Property Booking Platform by Kodein Boosts Sales by 210%',
    },
    excerpt: {
      id: 'Pengalaman pemesanan real-time, tur virtual interaktif, dan integrasi pembayaran instan membantu klien mencetak rekor transaksi.',
      en: 'Real-time unit booking, interactive virtual tours, and instant payment integration help our client set transaction records.',
    },
    content: {
      id: [
        'JAKARTA — Sebuah platform pemesanan dan katalog properti terpadu yang dirancang serta dikembangkan oleh tim Kodein berhasil meningkatkan konversi penjualan klien hingga 210% dalam tiga bulan pertama.',
        'Sistem ini dilengkapi dashboard admin real-time, kalkulator simulasi dinamis, serta integrasi langsung ke sistem CRM dan WhatsApp Business API.',
      ],
      en: [
        'JAKARTA — An integrated property booking and e-catalog platform custom-designed and engineered by Kodein increased client sales conversions by 210% within three months of launch.',
        'The platform features real-time inventory dashboards, dynamic calculators, and seamless integration with CRM and WhatsApp Business APIs.',
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
      id: 'Kodein Buka Layanan Integrasi AI Kustom & Otomasi Bisnis untuk Perusahaan Indonesia',
      en: 'Kodein Launches Custom AI Integration & Business Automation Services for Enterprises',
    },
    excerpt: {
      id: 'Hadirkan asisten AI pintar yang terhubung langsung dengan dokumen internal, katalog produk, dan database perusahaan Anda.',
      en: 'Deploy intelligent AI assistants securely connected to your internal documents, product catalogs, and databases.',
    },
    content: {
      id: [
        'JAKARTA — Menjawab kebutuhan efisiensi di era kecerdasan buatan, Kodein meluncurkan layanan pengembangan AI kustom yang dapat diintegrasikan langsung ke dalam website maupun software internal perusahaan.',
        'Solusi ini memungkinkan bisnis mengotomatisasi layanan pelanggan 24/7, mempercepat analisis laporan, dan memangkas beban kerja administratif secara signifikan.',
      ],
      en: [
        'JAKARTA — Addressing the demand for intelligent efficiency, Kodein launches custom AI development services that integrate seamlessly into corporate websites and internal software.',
        'These solutions enable businesses to automate 24/7 customer support, accelerate report analysis, and significantly reduce administrative overhead.',
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
      id: 'Modernisasi Sistem ERP Logistik: Kodein Pangkas Waktu Proses Order Klien Hingga 65%',
      en: 'Logistics ERP Modernization: Kodein Cuts Client Order Processing Time by 65%',
    },
    excerpt: {
      id: 'Menggantikan sistem spreadsheet manual dengan aplikasi web terpusat dan aplikasi mobile kurir real-time.',
      en: 'Replacing manual spreadsheets with a centralized web dashboard and real-time courier mobile app.',
    },
    content: {
      id: [
        'JAKARTA — Tim Software Engineering Kodein berhasil merampungkan proyek pengembangan sistem ERP logistik dan pelacakan armada terpadu bagi perusahaan distribusi nasional.',
        'Digitalisasi ini memangkas waktu pemrosesan order hingga 65% dan menghilangkan kesalahan pencatatan stok di gudang.',
      ],
      en: [
        'JAKARTA — Kodein’s Software Engineering team has delivered an integrated logistics ERP and fleet tracking platform for a national distribution enterprise.',
        'The digitization reduced order processing times by 65% and eliminated warehouse inventory discrepancies.',
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
      id: 'Program Konsultasi Gratis: Audit Performa Website & Rancang Bangun Software bersama Kodein',
      en: 'Free Consultation Program: Website Performance Audit & Software Architecture Blueprint',
    },
    excerpt: {
      id: 'Diskusikan ide aplikasi atau kebutuhan pembuatan website baru Anda langsung bersama Senior Solutions Architect Kodein.',
      en: 'Discuss your app idea or website redesign directly with Kodein’s Senior Solutions Architects.',
    },
    content: {
      id: [
        'JAKARTA — Kodein membuka sesi konsultasi teknis dan audit performa website tanpa biaya bagi bisnis yang berencana melakukan peremajaan website atau membangun aplikasi baru di tahun ini.',
        'Tim kami akan memberikan rekomendasi teknologi, estimasi waktu pengerjaan, serta rincian anggaran yang transparan.',
      ],
      en: [
        'JAKARTA — Kodein opens complimentary technical consultation and website audit sessions for businesses planning a website revamp or new software build this year.',
        'Our team provides actionable tech stack recommendations, project timelines, and transparent budget breakdowns.',
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
      id: 'Layanan Managed Cloud Kodein Capai Rekor 99,99% Uptime Selama Lonjakan Trafik Kampanye Nasional',
      en: 'Kodein Managed Cloud Achieves 99.99% Uptime Record During National Campaign Traffic Spikes',
    },
    excerpt: {
      id: 'Infrastruktur auto-scaling Kubernetes dan optimasi database menjaga ribuan transaksi per detik tetap berjalan mulus.',
      en: 'Auto-scaling Kubernetes infrastructure and database optimization keep thousands of transactions per second running smoothly.',
    },
    content: {
      id: [
        'JAKARTA — Divisi Cloud & DevOps Kodein membuktikan keandalan infrastrukturnya dengan menjaga uptime 99,99% pada puluhan website klien saat terjadi lonjakan trafik hingga 10 kali lipat.',
        'Arsitektur cloud yang elastis memastikan pengunjung tetap merasakan kecepatan akses instan tanpa kendala server down.',
      ],
      en: [
        'JAKARTA — Kodein’s Cloud & DevOps division demonstrated infrastructure resilience by maintaining 99.99% uptime across client platforms during 10x traffic surges.',
        'Elastic cloud scaling ensured visitors experienced instant page loads with zero downtime.',
      ],
    },
  },
];
`,

  'src/components/ui/BrandLogo.tsx': `import React from 'react';
import { DESIGN_TOKENS } from '@/lib/tokens';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  className?: string;
  variant?: 'dark' | 'light' | 'mono-white';
  markOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function KodeinMarkSvg({
  className,
  variant = 'gradient',
}: {
  className?: string;
  variant?: 'red' | 'coral' | 'gradient' | 'white' | 'black';
}) {
  const fillMap = {
    red: '#EE2B10',
    coral: '#FF5526',
    gradient: 'url(#kodeinPinwheelGrad)',
    white: '#FFFFFF',
    black: '#14110F',
  };

  return (
    <svg
      viewBox="105 105 302 302"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="kodeinPinwheelGrad"
          x1="120"
          y1="120"
          x2="392"
          y2="392"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FF5E2B" />
          <stop offset="100%" stopColor="#EE2B10" />
        </linearGradient>
      </defs>
      <g fill={fillMap[variant]}>
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <g key={angle} transform={\`rotate(\${angle} 256 256)\`}>
            <rect
              x="171"
              y="130"
              width="46"
              height="114"
              rx="23"
              transform="rotate(-4 194 187)"
            />
          </g>
        ))}
      </g>
    </svg>
  );
}

export function BrandLogo({
  className,
  variant = 'dark',
  markOnly = false,
  size = 'md',
}: BrandLogoProps) {
  const sizeClasses = {
    sm: { icon: 'h-7 w-7', text: 'text-xl' },
    md: { icon: 'h-9 w-9', text: 'text-2xl' },
    lg: { icon: 'h-11 w-11', text: 'text-3xl' },
  }[size];

  const markVariant =
    variant === 'mono-white' ? 'white' : variant === 'dark' ? 'gradient' : 'red';

  const textColor =
    variant === 'light' ? 'text-[#14110F]' : 'text-white';

  return (
    <div
      className={cn(
        'inline-flex items-center gap-3 select-none group',
        className
      )}
    >
      <KodeinMarkSvg
        variant={markVariant}
        className={cn(
          sizeClasses.icon,
          'shrink-0 transition-transform duration-500 ease-institutional group-hover:rotate-[30deg]'
        )}
      />
      {!markOnly && (
        <span
          className={cn(
            sizeClasses.text,
            'font-extrabold tracking-[-0.03em] leading-none',
            textColor
          )}
        >
          {DESIGN_TOKENS.brand.name}
        </span>
      )}
    </div>
  );
}
`,

  'src/components/ui/Button.tsx': `import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/navigation';
import { cn } from '@/lib/utils';

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: 'primary' | 'outline' | 'light' | 'ghost';
  showArrow?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
  onClick?: () => void;
  className?: string;
}

export function Button({
  children,
  href,
  variant = 'primary',
  showArrow = true,
  disabled = false,
  type = 'button',
  onClick,
  className,
}: ButtonProps) {
  const baseStyles =
    'group inline-flex items-center justify-center gap-3 rounded-full px-6 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 ease-institutional focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red disabled:cursor-not-allowed disabled:opacity-50';

  const variants = {
    primary: 'bg-brand-red text-white hover:bg-brand-redHover shadow-sm',
    outline:
      'border border-white/25 bg-white/5 text-white backdrop-blur-sm hover:border-brand-red hover:bg-brand-red',
    light: 'bg-white text-brand-dark hover:bg-brand-red hover:text-white',
    ghost: 'border border-zinc-300 text-brand-dark hover:border-brand-red hover:bg-brand-red hover:text-white',
  };

  const content = (
    <>
      <span>{children}</span>
      {showArrow && (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/15 transition-transform duration-300 ease-institutional group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      )}
    </>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={cn(baseStyles, variants[variant], className)}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(baseStyles, variants[variant], className)}
    >
      {content}
    </button>
  );
}
`,

  'src/components/ui/SectionHeading.tsx': `import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  lightMode?: boolean;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  lightMode = false,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'max-w-3xl',
        align === 'center' && 'mx-auto text-center',
        className
      )}
    >
      <div className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
        <span className="h-2 w-2 rounded-full bg-brand-red" aria-hidden="true" />
        <span>{eyebrow}</span>
      </div>
      <h2
        className={cn(
          'mt-4 text-fluid-h2 font-bold tracking-tight',
          lightMode ? 'text-brand-dark' : 'text-white'
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'mt-4 text-base md:text-lg leading-relaxed',
            lightMode ? 'text-zinc-600' : 'text-zinc-400'
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
`,

  'src/components/ui/Reveal.tsx': `'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { DESIGN_TOKENS } from '@/lib/tokens';

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

export function Reveal({ children, delay = 0, y = 28, className }: RevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: DESIGN_TOKENS.motion.duration.base,
        delay,
        ease: DESIGN_TOKENS.motion.easing,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
`,

  'src/components/ui/CountUp.tsx': `'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { formatNumber } from '@/lib/utils';
import { Locale } from '@/i18n';

interface CountUpProps {
  value: number;
  prefix?: string;
  suffix?: string;
  locale: Locale;
  duration?: number;
}

export function CountUp({
  value,
  prefix = '',
  suffix = '',
  locale,
  duration = 1800,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const prefersReducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    if (prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(eased * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    window.requestAnimationFrame(step);
  }, [isInView, value, duration, prefersReducedMotion]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {formatNumber(displayValue, locale)}
      {suffix}
    </span>
  );
}
`,

  'src/components/layout/LanguageSwitcher.tsx': `'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import { usePathname, useRouter } from '@/navigation';
import { Locale } from '@/i18n';
import { cn } from '@/lib/utils';

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
          className="absolute right-0 mt-2 w-36 rounded-lg border border-white/15 bg-brand-charcoal p-1 shadow-xl z-50"
        >
          {(['id', 'en'] as Locale[]).map((item) => (
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
              <span>{item === 'id' ? 'Indonesia (ID)' : 'English (EN)'}</span>
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

  'src/components/layout/Header.tsx': `'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, Menu, X, ArrowUpRight } from 'lucide-react';
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
          <div className="mx-auto flex max-w-container items-center justify-between px-6 py-2 text-xs text-zinc-300">
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

        <div className="mx-auto flex h-20 max-w-container items-center justify-between px-6">
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
              <div className="mx-auto grid max-w-container grid-cols-12 gap-8 px-6 py-10">
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
                        desc="Web & App, AI & Data, Cloud & DevOps"
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

  'src/components/layout/Footer.tsx': `import React from 'react';
import { useTranslations } from 'next-intl';
import { Instagram, Linkedin, ArrowUpRight } from 'lucide-react';
import { Link } from '@/navigation';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { DESIGN_TOKENS } from '@/lib/tokens';

export function Footer() {
  const t = useTranslations('footer');
  const navT = useTranslations('nav');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-black border-t border-white/10 text-white">
      <div className="mx-auto max-w-container px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-6">
            <Link href="/" aria-label="Kodein Home">
              <BrandLogo variant="dark" size="lg" />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-zinc-400">
              {DESIGN_TOKENS.brand.legalName}
              <br />
              {DESIGN_TOKENS.brand.address}
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

  'src/components/layout/CookieBanner.tsx': `'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const STORAGE_KEY = 'kodein_cookie_consent_v1';

export function CookieBanner() {
  const t = useTranslations('common');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) setVisible(true);
    } catch {
      setVisible(false);
    }
  }, []);

  const accept = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, 'accepted');
    } catch {
      // Ignore storage errors
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie Consent"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-4xl rounded-2xl border border-white/15 bg-brand-charcoal/95 p-5 backdrop-blur-lg shadow-2xl sm:flex sm:items-center sm:justify-between sm:gap-6"
    >
      <p className="text-xs sm:text-sm leading-relaxed text-zinc-300">{t('cookieText')}</p>
      <button
        type="button"
        onClick={accept}
        className="mt-4 sm:mt-0 shrink-0 rounded-full bg-brand-red px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-redHover"
      >
        {t('cookieAccept')}
      </button>
    </div>
  );
}
`,

  'src/components/layout/BackToTop.tsx': `'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function BackToTop() {
  const t = useTranslations('common');
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={t('backToTop')}
      className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-brand-dark/90 text-white shadow-lg backdrop-blur-md transition hover:border-brand-red hover:bg-brand-red"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
`,

  'src/components/home/HeroCarousel.tsx': `'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { ARTICLES } from '@/content/articles';
import { BLUR_DATA_URL } from '@/content/assets';
import { Button } from '@/components/ui/Button';
import { cn, formatDate } from '@/lib/utils';
import { Locale } from '@/i18n';

export function HeroCarousel() {
  const locale = useLocale() as Locale;
  const t = useTranslations('common');
  const slides = ARTICLES.slice(0, 5);

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

                <div className="relative z-10 mx-auto flex h-full max-w-container flex-col justify-end px-6 pb-28 md:pb-32">
                  <motion.div
                    key={\`\${slide.id}-\${isSelected}\`}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-4xl"
                  >
                    <div className="inline-flex items-center gap-3 text-xs sm:text-sm font-semibold uppercase tracking-widest text-zinc-300">
                      <span className="rounded-full bg-brand-red px-3 py-1 text-[11px] font-bold text-white">
                        {slide.category === 'press-release'
                          ? t('pressRelease')
                          : t('announcement')}
                      </span>
                      <span className="text-white/40">•</span>
                      <time dateTime={slide.date}>{formatDate(slide.date, locale)}</time>
                    </div>

                    <h1 className="mt-5 text-fluid-hero font-bold text-white line-clamp-3">
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

      <div className="absolute inset-x-0 bottom-8 z-20 mx-auto flex max-w-container items-center justify-between gap-6 px-6">
        <div className="grid flex-1 max-w-xl grid-cols-5 gap-2.5" role="tablist">
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

  'src/components/home/AboutIntro.tsx': `'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { HOME_CONTENT } from '@/content/siteData';
import { DESIGN_TOKENS } from '@/lib/tokens';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { KodeinMarkSvg } from '@/components/ui/BrandLogo';
import { Locale } from '@/i18n';

export function AboutIntro() {
  const locale = useLocale() as Locale;
  const t = useTranslations('common');
  const content = HOME_CONTENT.aboutIntro;

  const statementText = content.statement[locale];
  const brandName = DESIGN_TOKENS.brand.name;
  const parts = statementText.split(brandName);

  return (
    <section className="relative overflow-hidden bg-brand-dark py-24 md:py-36 border-b border-white/10">
      <KodeinMarkSvg
        variant="red"
        className="pointer-events-none absolute -right-28 -top-28 h-[420px] w-[420px] opacity-[0.04]"
      />

      <div className="relative z-10 mx-auto max-w-container px-6">
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
              {content.supporting[locale]}
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

  'src/components/home/ScopeOfWork.tsx': `'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { useLocale } from 'next-intl';
import { Link } from '@/navigation';
import { HOME_CONTENT, SCOPE_ENTITIES } from '@/content/siteData';
import { BLUR_DATA_URL } from '@/content/assets';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { KodeinMarkSvg } from '@/components/ui/BrandLogo';
import { Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/utils';
import { Locale } from '@/i18n';

export function ScopeOfWork() {
  const locale = useLocale() as Locale;
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <section className="bg-brand-black py-24 md:py-36">
      <div className="mx-auto max-w-container px-6">
        <Reveal>
          <SectionHeading
            eyebrow={HOME_CONTENT.scopeSection.eyebrow[locale]}
            title={HOME_CONTENT.scopeSection.headline[locale]}
          />
        </Reveal>

        <div className="mt-14 flex flex-col gap-5 lg:h-[520px] lg:flex-row">
          {SCOPE_ENTITIES.map((entity, idx) => {
            const isExpanded = activeIndex === idx;
            return (
              <Link
                key={entity.id}
                href={entity.href}
                onMouseEnter={() => setActiveIndex(idx)}
                onFocus={() => setActiveIndex(idx)}
                className={cn(
                  'group relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-2xl border border-white/10 p-7 transition-all duration-500 ease-institutional',
                  isExpanded ? 'lg:flex-[1.7]' : 'lg:flex-1'
                )}
              >
                <Image
                  src={entity.image}
                  alt={entity.title[locale]}
                  fill
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-institutional group-hover:scale-105"
                />

                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/20 transition-opacity duration-300 group-hover:opacity-90"
                  aria-hidden="true"
                />

                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-black/50 px-3 py-1.5 text-xs font-bold tracking-widest text-white backdrop-blur-sm">
                      <KodeinMarkSvg variant="gradient" className="h-4 w-4" />
                      <span>{entity.code}</span>
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-red text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      <ArrowUpRight className="h-5 w-5" />
                    </span>
                  </div>

                  <div className="mt-auto pt-12">
                    <h3 className="text-2xl font-bold text-white">{entity.title[locale]}</h3>
                    <p
                      className={cn(
                        'mt-3 text-sm leading-relaxed text-zinc-300 transition-all duration-300',
                        isExpanded ? 'opacity-100' : 'lg:line-clamp-2 lg:opacity-80'
                      )}
                    >
                      {entity.shortDesc[locale]}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
`,

  'src/components/home/StatisticsSection.tsx': `'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { HOME_CONTENT, STATISTICS_DATA } from '@/content/siteData';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CountUp } from '@/components/ui/CountUp';
import { Reveal } from '@/components/ui/Reveal';
import { Locale } from '@/i18n';

export function StatisticsSection() {
  const locale = useLocale() as Locale;

  return (
    <section className="bg-brand-light py-24 md:py-36 text-brand-dark">
      <div className="mx-auto max-w-container px-6">
        <Reveal>
          <SectionHeading
            eyebrow={HOME_CONTENT.statsSection.eyebrow[locale]}
            title={HOME_CONTENT.statsSection.headline[locale]}
            lightMode
          />
        </Reveal>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-zinc-200">
          {STATISTICS_DATA.map((stat, idx) => (
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

  'src/components/home/ReportsSection.tsx': `'use client';

import React from 'react';
import Image from 'next/image';
import { Lock } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { HOME_CONTENT } from '@/content/siteData';
import { ASSETS, BLUR_DATA_URL } from '@/content/assets';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Locale } from '@/i18n';

export function ReportsSection() {
  const locale = useLocale() as Locale;
  const t = useTranslations('common');
  const content = HOME_CONTENT.reportsSection;

  return (
    <section className="relative overflow-hidden bg-brand-dark py-24 md:py-32 border-b border-white/10">
      <div className="mx-auto max-w-container px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-2xl border border-white/15 bg-brand-charcoal shadow-card">
              <Image
                src={ASSETS.reports.cover}
                alt="Kodein Company Profile & Capabilities Deck"
                fill
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent p-8 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <BrandLogo variant="dark" size="sm" />
                  <span className="rounded bg-brand-red px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
                    2026 EDITION
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                    {content.eyebrow[locale]}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-white">
                    Kodein Software & Web Capabilities Deck
                  </h3>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
              <span className="h-2 w-2 rounded-full bg-brand-red" />
              <span>{content.eyebrow[locale]}</span>
            </div>

            <h2 className="text-fluid-h2 font-bold text-white">
              {content.headline[locale]}
            </h2>

            <p className="text-base md:text-lg leading-relaxed text-zinc-400 max-w-2xl">
              {content.subtext[locale]}
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              {content.reportsAvailable ? (
                <Button href="/investor-relations" variant="primary">
                  {t('learnMore')}
                </Button>
              ) : (
                <>
                  <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-zinc-300">
                    <Lock className="h-4 w-4 text-brand-red" />
                    <span>PDF {t('comingSoon')}</span>
                  </div>
                  <Button href="/help-center" variant="primary">
                    {locale === 'id' ? 'Minta Estimasi Proyek' : 'Request Project Estimate'}
                  </Button>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
`,

  'src/components/home/JourneyTimeline.tsx': `'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useLocale } from 'next-intl';
import { HOME_CONTENT, TIMELINE_MILESTONES } from '@/content/siteData';
import { BLUR_DATA_URL } from '@/content/assets';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { KodeinMarkSvg } from '@/components/ui/BrandLogo';
import { Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/utils';
import { Locale } from '@/i18n';

export function JourneyTimeline() {
  const locale = useLocale() as Locale;
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 70%', 'end 65%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    restDelta: 0.001,
  });

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-brand-black py-24 md:py-36"
    >
      <div className="mx-auto max-w-container px-6">
        <Reveal>
          <SectionHeading
            eyebrow={HOME_CONTENT.journeySection.eyebrow[locale]}
            title={HOME_CONTENT.journeySection.headline[locale]}
            align="center"
          />
        </Reveal>

        <div className="relative mt-20">
          <div
            className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-48 -translate-x-1/2 lg:block"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 200 1400"
              fill="none"
              preserveAspectRatio="none"
              className="h-full w-full"
            >
              <path
                d="M100 0 C180 220, 20 450, 100 700 C180 950, 20 1180, 100 1400"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="3"
                strokeDasharray="8 8"
              />
              <motion.path
                d="M100 0 C180 220, 20 450, 100 700 C180 950, 20 1180, 100 1400"
                stroke="#EE2B10"
                strokeWidth="4"
                style={{ pathLength: smoothProgress }}
              />
            </svg>
          </div>

          <div
            className="pointer-events-none absolute inset-y-0 left-4 w-1 bg-white/10 lg:hidden"
            aria-hidden="true"
          >
            <motion.div
              className="w-full origin-top bg-brand-red h-full"
              style={{ scaleY: smoothProgress }}
            />
          </div>

          <div className="space-y-16 lg:space-y-24">
            {TIMELINE_MILESTONES.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={item.id}
                  className={cn(
                    'relative flex flex-col pl-12 lg:pl-0 lg:items-center lg:justify-between',
                    isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  )}
                >
                  <div
                    className="absolute left-4 top-8 lg:left-1/2 lg:top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full border-2 border-brand-red bg-brand-charcoal shadow-lg"
                    aria-hidden="true"
                  >
                    <KodeinMarkSvg variant="gradient" className="h-6 w-6" />
                  </div>

                  <Reveal className="w-full lg:w-[44%]">
                    <div className="group overflow-hidden rounded-2xl border border-white/10 bg-brand-charcoal p-6 sm:p-8 transition hover:border-brand-red/60">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                        <div className="shrink-0 rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-center sm:w-28">
                          <span className="block text-xs font-bold uppercase tracking-widest text-brand-red">
                            {item.month[locale]} {item.day}
                          </span>
                          <span className="mt-1 block text-2xl font-extrabold text-white">
                            {item.year}
                          </span>
                        </div>

                        <div className="relative h-32 w-full sm:w-40 shrink-0 overflow-hidden rounded-xl">
                          <Image
                            src={item.image}
                            alt={item.title[locale]}
                            fill
                            placeholder="blur"
                            blurDataURL={BLUR_DATA_URL}
                            sizes="200px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      </div>

                      <h3 className="mt-6 text-xl font-bold text-white">
                        {item.title[locale]}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                        {item.description[locale]}
                      </p>
                    </div>
                  </Reveal>

                  <div className="hidden lg:block lg:w-[44%]" />
                </div>
              );
            })}
          </div>

          <div className="mt-16 flex justify-start pl-4 lg:justify-center lg:pl-0">
            <div className="inline-flex items-center gap-3 rounded-full border border-brand-red bg-brand-red/15 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-white">
              <KodeinMarkSvg variant="gradient" className="h-4 w-4 animate-spin" />
              <span>{HOME_CONTENT.journeySection.launchLabel[locale]}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
`,

  'src/components/home/LeadershipQuote.tsx': `'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLocale } from 'next-intl';
import { HOME_CONTENT } from '@/content/siteData';
import { ASSETS, BLUR_DATA_URL } from '@/content/assets';
import { Reveal } from '@/components/ui/Reveal';
import { Locale } from '@/i18n';

export function LeadershipQuote() {
  const locale = useLocale() as Locale;
  const quote = HOME_CONTENT.quoteSection;
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const skylineY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [15, -15]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-brand-charcoal pt-24 pb-0 md:pt-32 border-t border-white/10"
    >
      <motion.div
        style={{ y: skylineY }}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 opacity-15"
      >
        <svg viewBox="0 0 1440 320" fill="none" className="w-full h-auto">
          <path
            fill="#FFFFFF"
            d="M0 320V220H60V160H110V220H150V110H220V240H260V140H330V80H390V210H430V130H510V230H560V60H630V200H690V120H760V190H820V40H890V180H950V110H1030V220H1080V90H1160V200H1220V140H1300V230H1360V170H1440V320H0Z"
          />
        </svg>
      </motion.div>

      <div className="relative z-10 mx-auto max-w-container px-6">
        <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7 pb-20 md:pb-28">
            <blockquote className="text-2xl sm:text-3xl md:text-4xl font-medium leading-snug text-white">
              <span>{quote.beforeHighlight[locale]}</span>
              <strong className="font-extrabold text-brand-red">
                {quote.highlight[locale]}
              </strong>
              <span>{quote.afterHighlight[locale]}</span>
            </blockquote>

            <div className="mt-8 border-l-4 border-brand-red pl-4">
              <p className="text-base font-bold text-white">{quote.author[locale]}</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-zinc-400">
                {quote.occasion[locale]}
              </p>
            </div>
          </Reveal>

          <motion.div
            style={{ y: portraitY }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div className="relative h-[380px] w-[300px] sm:h-[440px] sm:w-[360px] overflow-hidden rounded-t-3xl border-x border-t border-white/15 bg-gradient-to-b from-white/5 to-black">
              <Image
                src={ASSETS.leadership.portrait}
                alt={quote.author[locale]}
                fill
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                sizes="(max-width: 1024px) 300px, 360px"
                className="object-cover object-top grayscale contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
`,

  'src/components/entities/EntityLandingView.tsx': `import React from 'react';
import Image from 'next/image';
import { EntityDetailData } from '@/content/types';
import { BLUR_DATA_URL } from '@/content/assets';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { KodeinMarkSvg } from '@/components/ui/BrandLogo';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Locale } from '@/i18n';

export function EntityLandingView({
  data,
  locale,
}: {
  data: EntityDetailData;
  locale: Locale;
}) {
  return (
    <div className="bg-brand-dark text-white">
      <section className="relative pt-36 pb-24 md:pt-44 md:pb-32 overflow-hidden border-b border-white/10">
        <Image
          src={data.heroImage}
          alt={data.name[locale]}
          fill
          priority
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-black/60" />

        <div className="relative z-10 mx-auto max-w-container px-6">
          <span className="inline-flex items-center gap-2 rounded-md bg-brand-red px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
            <KodeinMarkSvg variant="white" className="h-4 w-4" />
            <span>{data.code}</span>
          </span>
          <h1 className="mt-5 text-fluid-h1 font-bold text-white">{data.name[locale]}</h1>
          <p className="mt-5 max-w-3xl text-lg md:text-xl text-zinc-300 leading-relaxed">
            {data.tagline[locale]}
          </p>
        </div>
      </section>

      <section className="border-b border-white/10 bg-brand-charcoal">
        <div className="mx-auto max-w-container px-6 py-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {data.highlights.map((h, i) => (
            <div key={i} className="border-l-2 border-brand-red pl-5">
              <div className="text-3xl md:text-4xl font-extrabold text-white">{h.metric}</div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                {h.label[locale]}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 md:py-28 border-b border-white/10">
        <div className="mx-auto max-w-container px-6 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="text-2xl font-bold text-white">
              {locale === 'id' ? 'Ikhtisar Layanan' : 'Service Overview'}
            </h2>
          </div>
          <div className="lg:col-span-8 space-y-5 text-base md:text-lg leading-relaxed text-zinc-300">
            {data.overview[locale].map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-brand-black">
        <div className="mx-auto max-w-container px-6">
          <SectionHeading
            eyebrow={data.code}
            title={locale === 'id' ? 'Spesialisasi & Solusi Utama' : 'Core Capabilities & Solutions'}
          />
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {data.focusAreas.map((area, idx) => (
              <Reveal
                key={idx}
                delay={idx * 0.08}
                className="rounded-2xl border border-white/10 bg-brand-charcoal p-8"
              >
                <span className="text-xs font-bold text-brand-red">0{idx + 1}</span>
                <h3 className="mt-3 text-xl font-bold text-white">{area.title[locale]}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  {area.description[locale]}
                </p>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 flex flex-wrap items-center gap-4">
            <Button href="/help-center" variant="primary">
              {locale === 'id' ? 'Konsultasikan Proyek Anda' : 'Consult Your Project'}
            </Button>
            <Button href="/media-center" variant="outline">
              {locale === 'id' ? 'Lihat Studi Kasus & Berita' : 'Explore Case Studies & News'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
`,

  'src/components/media/MediaCenterClient.tsx': `'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { Search, ArrowUpRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { ARTICLES } from '@/content/articles';
import { BLUR_DATA_URL } from '@/content/assets';
import { cn, formatDate } from '@/lib/utils';
import { Locale } from '@/i18n';
import { ArticleCategory } from '@/content/types';

export function MediaCenterClient() {
  const locale = useLocale() as Locale;
  const t = useTranslations('common');

  const [filter, setFilter] = useState<'all' | ArticleCategory>('all');
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);

  const filtered = useMemo(() => {
    return ARTICLES.filter((art) => {
      const matchesCategory = filter === 'all' || art.category === filter;
      const matchesQuery =
        art.title[locale].toLowerCase().includes(query.toLowerCase()) ||
        art.excerpt[locale].toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [filter, query, locale]);

  const items = filtered.slice(0, visibleCount);

  return (
    <div className="mx-auto max-w-container px-6 py-16">
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
            {locale === 'id' ? 'Muat Lebih Banyak' : 'Load More Articles'}
          </button>
        </div>
      )}
    </div>
  );
}
`,

  'src/components/media/ArticleDetailView.tsx': `'use client';

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

      <div className="mx-auto mt-20 max-w-container px-6">
        <h2 className="text-2xl font-bold text-white">{t('relatedArticles')}</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {related.map((rel) => {
            const href =
              rel.category === 'press-release'
                ? \`/media-center/press-releases/\${rel.slug}\`
                : \`/media-center/announcement/\${rel.slug}\`;
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
`,

  'src/app/layout.tsx': `import React from 'react';
import '@/styles/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
`,

  'src/app/not-found.tsx': `import React from 'react';
import Link from 'next/link';

export default function GlobalNotFound() {
  return (
    <html lang="id">
      <body className="flex min-h-screen flex-col items-center justify-center bg-brand-dark px-6 text-center text-white">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">404</span>
        <h1 className="mt-3 text-4xl font-bold">Halaman Tidak Ditemukan / Page Not Found</h1>
        <p className="mt-3 max-w-md text-sm text-zinc-400">
          Maaf, halaman yang Anda tuju tidak tersedia atau telah dipindahkan.
        </p>
        <Link
          href="/id"
          className="mt-8 rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white"
        >
          Kembali ke Beranda Kodein
        </Link>
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
  ];

  const staticEntries = routes.flatMap((route) =>
    (['id', 'en'] as const).map((locale) => ({
      url: \`\${base}/\${locale}\${route}\`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1.0 : 0.8,
    }))
  );

  const articleEntries = ARTICLES.flatMap((article) =>
    (['id', 'en'] as const).map((locale) => {
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
  const isId = locale === 'id';
  const title = isId
    ? \`\${DESIGN_TOKENS.brand.name} — Jasa Pembuatan Website & Software Engineering\`
    : \`\${DESIGN_TOKENS.brand.name} — Web Development & Custom Software Engineering\`;
  const description = isId
    ? 'Kodein adalah perusahaan pembuatan website, pengembangan software kustom, aplikasi mobile, AI, dan cloud infrastructure berkinerja tinggi.'
    : 'Kodein is a premier web development, custom software engineering, mobile app, AI, and cloud infrastructure company.';

  return {
    metadataBase: new URL(DESIGN_TOKENS.brand.domain),
    title: {
      default: title,
      template: \`%s | \${DESIGN_TOKENS.brand.name}\`,
    },
    description,
    manifest: '/site.webmanifest',
    icons: {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-48.png', sizes: '48x48', type: 'image/png' },
        { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: [{ url: '/apple-touch-icon-180.png', sizes: '180x180', type: 'image/png' }],
    },
    alternates: {
      canonical: \`/\${locale}\`,
      languages: {
        id: '/id',
        en: '/en',
      },
    },
    openGraph: {
      title,
      description,
      url: \`\${DESIGN_TOKENS.brand.domain}/\${locale}\`,
      siteName: DESIGN_TOKENS.brand.name,
      locale: isId ? 'id_ID' : 'en_US',
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
    legalName: DESIGN_TOKENS.brand.legalName,
    url: DESIGN_TOKENS.brand.domain,
    logo: \`\${DESIGN_TOKENS.brand.domain}/assets/brand/kodein-logo-horizontal.svg\`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: DESIGN_TOKENS.brand.address,
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

  'src/app/[locale]/page.tsx': `import React from 'react';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { AboutIntro } from '@/components/home/AboutIntro';
import { ScopeOfWork } from '@/components/home/ScopeOfWork';
import { StatisticsSection } from '@/components/home/StatisticsSection';
import { ReportsSection } from '@/components/home/ReportsSection';
import { JourneyTimeline } from '@/components/home/JourneyTimeline';
import { LeadershipQuote } from '@/components/home/LeadershipQuote';

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <AboutIntro />
      <ScopeOfWork />
      <StatisticsSection />
      <ReportsSection />
      <JourneyTimeline />
      <LeadershipQuote />
    </>
  );
}
`,

  'src/app/[locale]/not-found.tsx': `import React from 'react';
import { Link } from '@/navigation';

export default function LocaleNotFound() {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center px-6 text-center">
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">404</span>
      <h1 className="mt-4 text-3xl md:text-5xl font-bold text-white">
        Halaman Tidak Ditemukan
      </h1>
      <Link
        href="/"
        className="mt-8 rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white"
      >
        Kembali ke Beranda Kodein
      </Link>
    </div>
  );
}
`,

  'src/app/[locale]/about/page.tsx': `import React from 'react';
import Image from 'next/image';
import { ABOUT_PAGE_DATA } from '@/content/siteData';
import { BLUR_DATA_URL } from '@/content/assets';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { JourneyTimeline } from '@/components/home/JourneyTimeline';
import { Locale } from '@/i18n';

export default function AboutPage({ params: { locale } }: { params: { locale: Locale } }) {
  const isId = locale === 'id';

  return (
    <div className="bg-brand-dark pt-32 text-white">
      <section className="mx-auto max-w-container px-6 py-16 md:py-24 border-b border-white/10">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
          {isId ? 'Tentang Kodein' : 'About Kodein'}
        </span>
        <h1 className="mt-4 max-w-4xl text-fluid-h1 font-bold">
          {isId
            ? 'Merancang Website & Perangkat Lunak Berkelas Dunia untuk Pertumbuhan Bisnis Modern'
            : 'Engineering World-Class Websites & Custom Software for Modern Business Growth'}
        </h1>
      </section>

      <section className="mx-auto max-w-container px-6 py-20 grid grid-cols-1 gap-12 lg:grid-cols-2 border-b border-white/10">
        <div className="rounded-2xl border border-white/10 bg-brand-charcoal p-8 md:p-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-red">
            {isId ? 'Visi Kami' : 'Our Vision'}
          </span>
          <p className="mt-4 text-xl md:text-2xl font-semibold leading-relaxed text-white">
            {ABOUT_PAGE_DATA.vision[locale]}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-brand-charcoal p-8 md:p-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-red">
            {isId ? 'Misi Engineering' : 'Engineering Mission'}
          </span>
          <ul className="mt-4 space-y-4 text-zinc-300">
            {ABOUT_PAGE_DATA.missions[locale].map((m, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-red" />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-brand-light py-24 text-brand-dark">
        <div className="mx-auto max-w-container px-6">
          <SectionHeading
            eyebrow={isId ? 'Nilai Kerja' : 'Core Values'}
            title={isId ? 'Prinsip Rekayasa & Kualitas Kodein' : 'Kodein Engineering & Quality Principles'}
            lightMode
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ABOUT_PAGE_DATA.values.map((val) => (
              <div
                key={val.code}
                className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-subtle"
              >
                <span className="text-sm font-extrabold text-brand-red">{val.code}</span>
                <h3 className="mt-3 text-lg font-bold">{val.title[locale]}</h3>
                <p className="mt-2 text-sm text-zinc-600 leading-relaxed">{val.desc[locale]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-container px-6 py-24">
        <SectionHeading
          eyebrow={isId ? 'Tim Kepemimpinan' : 'Leadership Team'}
          title={isId ? 'Para Arsitek & Pemimpin Produk Kodein' : 'Kodein Principal Architects & Product Leaders'}
        />
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {ABOUT_PAGE_DATA.leadership.map((exec) => (
            <div
              key={exec.name}
              className="overflow-hidden rounded-2xl border border-white/10 bg-brand-charcoal"
            >
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={exec.image}
                  alt={exec.name}
                  fill
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover grayscale"
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-white">{exec.name}</h3>
                <p className="mt-1 text-xs text-zinc-400">{exec.role[locale]}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <JourneyTimeline />
    </div>
  );
}
`,

  'src/app/[locale]/our-ecosystem/page.tsx': `import React from 'react';
import { ScopeOfWork } from '@/components/home/ScopeOfWork';
import { StatisticsSection } from '@/components/home/StatisticsSection';
import { Locale } from '@/i18n';

export default function EcosystemPage({ params: { locale } }: { params: { locale: Locale } }) {
  const isId = locale === 'id';

  return (
    <div className="bg-brand-dark pt-32 text-white">
      <section className="mx-auto max-w-container px-6 py-16">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
          {isId ? 'Layanan & Solusi Kodein' : 'Kodein Services & Solutions'}
        </span>
        <h1 className="mt-4 max-w-4xl text-fluid-h1 font-bold">
          {isId
            ? 'Ekosistem Layanan End-to-End: Dari Desain UI/UX, Pembuatan Website, hingga Cloud'
            : 'End-to-End Digital Engineering: From UI/UX & Web Development to AI & Cloud'}
        </h1>
      </section>
      <ScopeOfWork />
      <StatisticsSection />
    </div>
  );
}
`,

  'src/app/[locale]/dam/page.tsx': `import React from 'react';
import { ENTITY_DETAILS } from '@/content/siteData';
import { EntityLandingView } from '@/components/entities/EntityLandingView';
import { Locale } from '@/i18n';

export default function DamPage({ params: { locale } }: { params: { locale: Locale } }) {
  return <EntityLandingView data={ENTITY_DETAILS.dam} locale={locale} />;
}
`,

  'src/app/[locale]/dim/page.tsx': `import React from 'react';
import { ENTITY_DETAILS } from '@/content/siteData';
import { EntityLandingView } from '@/components/entities/EntityLandingView';
import { Locale } from '@/i18n';

export default function DimPage({ params: { locale } }: { params: { locale: Locale } }) {
  return <EntityLandingView data={ENTITY_DETAILS.dim} locale={locale} />;
}
`,

  'src/app/[locale]/ddmf/page.tsx': `import React from 'react';
import { ENTITY_DETAILS } from '@/content/siteData';
import { EntityLandingView } from '@/components/entities/EntityLandingView';
import { Locale } from '@/i18n';

export default function DdmfPage({ params: { locale } }: { params: { locale: Locale } }) {
  return <EntityLandingView data={ENTITY_DETAILS.ddmf} locale={locale} />;
}
`,

  'src/app/[locale]/corporate-governance/page.tsx': `import React from 'react';
import { ShieldCheck, Code2, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Locale } from '@/i18n';

export default function GovernancePage({ params: { locale } }: { params: { locale: Locale } }) {
  const isId = locale === 'id';

  const pillars = [
    {
      icon: Code2,
      title: isId ? 'Standar Clean Code & QA Otomatis' : 'Clean Code & Automated QA Standards',
      desc: isId
        ? 'Setiap fitur melewati code review berlapis, automated testing, dan audit performa sebelum dirilis ke server produksi.'
        : 'Every feature undergoes peer code review, automated testing, and performance auditing prior to production deployment.',
    },
    {
      icon: ShieldCheck,
      title: isId ? 'Keamanan Aplikasi (OWASP & Enkripsi)' : 'Application Security (OWASP & Encryption)',
      desc: isId
        ? 'Mengadopsi standar keamanan OWASP Top 10 untuk mencegah celah keamanan pada website dan sistem perangkat lunak klien.'
        : 'Adopting OWASP Top 10 security practices to safeguard client websites and software applications against vulnerabilities.',
    },
    {
      icon: FileCheck,
      title: isId ? 'Perlindungan NDA & Hak Kekayaan Intelektual' : 'Strict NDA & Full IP Ownership',
      desc: isId
        ? 'Kerahasiaan ide bisnis dan data perusahaan Anda dijamin melalui perjanjian hukum (NDA) serta kepemilikan source code yang jelas.'
        : 'Your business ideas and proprietary data are protected under strict NDAs and clear source code intellectual property ownership.',
    },
  ];

  return (
    <div className="bg-brand-dark pt-32 pb-24 text-white">
      <div className="mx-auto max-w-container px-6">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
          {isId ? 'Standar Kualitas & Keamanan' : 'Quality & Security Standards'}
        </span>
        <h1 className="mt-4 max-w-4xl text-fluid-h1 font-bold">
          {isId
            ? 'Kualitas Engineering, Keamanan Data, dan Kepatuhan Standar Industri'
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

        <div className="mt-16 rounded-2xl border border-brand-red/40 bg-brand-charcoal p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold">
              {isId ? 'Pelaporan Celah Keamanan & Etika (VDP / WBS)' : 'Vulnerability Disclosure & Ethics Channel'}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-zinc-300">
              {isId
                ? 'Temukan bug keamanan pada sistem kami atau ingin melaporkan pelanggaran etika kerja secara rahasia? Gunakan saluran terenkripsi kami.'
                : 'Found a security bug or wish to report an ethical concern confidentially? Submit an encrypted report through our secure channel.'}
            </p>
          </div>
          <Button href="/wbs" variant="primary">
            {isId ? 'Kirim Laporan Keamanan' : 'Submit Security Report'}
          </Button>
        </div>
      </div>
    </div>
  );
}
`,

  'src/app/[locale]/wbs/page.tsx': `'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useLocale } from 'next-intl';
import { Locale } from '@/i18n';

const wbsSchema = z.object({
  reporterName: z.string().max(100).optional(),
  reporterEmail: z.string().email().optional().or(z.literal('')),
  category: z.enum(['fraud', 'bribery', 'conflict_of_interest', 'harassment', 'other']),
  incidentDate: z.string().min(1, 'Required'),
  description: z.string().min(30, 'Minimum 30 characters required').max(3000),
  honeypot: z.string().max(0).optional(),
});

type WbsFormValues = z.infer<typeof wbsSchema>;

export default function WbsPage() {
  const locale = useLocale() as Locale;
  const isId = locale === 'id';
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<WbsFormValues>({
    resolver: zodResolver(wbsSchema),
    defaultValues: { category: 'other', honeypot: '' },
  });

  const onSubmit = async (values: WbsFormValues) => {
    const res = await fetch('/api/wbs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      const data = await res.json();
      setSubmittedRef(data.referenceId);
      reset();
    }
  };

  return (
    <div className="bg-brand-dark pt-32 pb-24 text-white">
      <div className="mx-auto max-w-3xl px-6">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-red">
          <ShieldAlert className="h-4 w-4" />
          <span>Kodein Security & Ethics Reporting</span>
        </div>

        <h1 className="mt-4 text-fluid-h1 font-bold">
          {isId ? 'Pelaporan Keamanan (Bug Bounty) & Etika' : 'Encrypted Security & Ethics Reporting'}
        </h1>
        <p className="mt-4 text-zinc-400">
          {isId
            ? 'Identitas pelapor dilindungi sepenuhnya oleh Kodein. Gunakan formulir ini untuk melaporkan kerentanan teknis (VDP) atau pelanggaran etika.'
            : 'Reporter identity is strictly protected by Kodein. Use this form to report technical vulnerabilities (VDP) or ethical violations.'}
        </p>

        {submittedRef ? (
          <div className="mt-10 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-8">
            <CheckCircle2 className="h-10 w-10 text-emerald-400" />
            <h2 className="mt-4 text-xl font-bold">
              {isId ? 'Laporan Berhasil Diterima' : 'Report Successfully Submitted'}
            </h2>
            <p className="mt-2 text-sm text-zinc-300">
              {isId ? 'Nomor Tiket Referensi Anda:' : 'Your Reference Ticket ID:'}{' '}
              <strong className="font-mono text-white">{submittedRef}</strong>
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-10 space-y-6 rounded-2xl border border-white/10 bg-brand-charcoal p-8"
            noValidate
          >
            <input type="text" className="hidden" tabIndex={-1} {...register('honeypot')} />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                  {isId ? 'Nama / Alias (Opsional)' : 'Name / Handle (Optional)'}
                </label>
                <input
                  type="text"
                  {...register('reporterName')}
                  className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-sm text-white focus:border-brand-red focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                  {isId ? 'Email (Opsional)' : 'Email (Optional)'}
                </label>
                <input
                  type="email"
                  {...register('reporterEmail')}
                  className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-sm text-white focus:border-brand-red focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                  {isId ? 'Kategori Laporan *' : 'Report Category *'}
                </label>
                <select
                  {...register('category')}
                  className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-sm text-white focus:border-brand-red focus:outline-none"
                >
                  <option value="other">Celah Keamanan / Bug Bounty (VDP)</option>
                  <option value="fraud">Pelanggaran NDA / Privasi Data</option>
                  <option value="conflict_of_interest">Benturan Kepentingan</option>
                  <option value="bribery">Gratifikasi / Suap</option>
                  <option value="harassment">Pelanggaran Etika Kerja</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                  {isId ? 'Tanggal Temuan *' : 'Discovery Date *'}
                </label>
                <input
                  type="date"
                  {...register('incidentDate')}
                  className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-sm text-white focus:border-brand-red focus:outline-none"
                />
                {errors.incidentDate && (
                  <p className="mt-1 text-xs text-brand-red">{errors.incidentDate.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                {isId ? 'Rincian Teknis / Kronologi Lengkap *' : 'Technical Details / Description *'}
              </label>
              <textarea
                rows={5}
                {...register('description')}
                placeholder={
                  isId
                    ? 'Jelaskan langkah reproduksi bug, URL terkait, atau kronologi kejadian (minimal 30 karakter)...'
                    : 'Describe steps to reproduce, affected URLs, or incident chronology (min. 30 chars)...'
                }
                className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 p-4 text-sm text-white focus:border-brand-red focus:outline-none"
              />
              {errors.description && (
                <p className="mt-1 text-xs text-brand-red">{errors.description.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-brand-red py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-brand-redHover disabled:opacity-50"
            >
              {isSubmitting
                ? isId
                  ? 'Mengenkripsi & Mengirim...'
                  : 'Encrypting & Submitting...'
                : isId
                ? 'Kirim Laporan Terenkripsi'
                : 'Submit Encrypted Report'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
`,

  'src/app/[locale]/media-center/page.tsx': `import React from 'react';
import { MediaCenterClient } from '@/components/media/MediaCenterClient';
import { Locale } from '@/i18n';

export default function MediaCenterPage({ params: { locale } }: { params: { locale: Locale } }) {
  const isId = locale === 'id';

  return (
    <div className="bg-brand-dark pt-32 pb-20 text-white">
      <div className="mx-auto max-w-container px-6 pt-8">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
          Kodein Insights & News
        </span>
        <h1 className="mt-3 text-fluid-h1 font-bold">
          {isId
            ? 'Rilis Produk, Studi Kasus & Berita Teknologi'
            : 'Product Releases, Case Studies & Tech Announcements'}
        </h1>
      </div>
      <MediaCenterClient />
    </div>
  );
}
`,

  'src/app/[locale]/media-center/press-releases/[slug]/page.tsx': `import React from 'react';
import { notFound } from 'next/navigation';
import { ARTICLES } from '@/content/articles';
import { ArticleDetailView } from '@/components/media/ArticleDetailView';
import { Locale } from '@/i18n';

export default function PressReleaseDetailPage({
  params: { locale, slug },
}: {
  params: { locale: Locale; slug: string };
}) {
  const article = ARTICLES.find(
    (a) => a.slug === slug && a.category === 'press-release'
  );
  if (!article) notFound();

  return <ArticleDetailView article={article} locale={locale} />;
}
`,

  'src/app/[locale]/media-center/announcement/[slug]/page.tsx': `import React from 'react';
import { notFound } from 'next/navigation';
import { ARTICLES } from '@/content/articles';
import { ArticleDetailView } from '@/components/media/ArticleDetailView';
import { Locale } from '@/i18n';

export default function AnnouncementDetailPage({
  params: { locale, slug },
}: {
  params: { locale: Locale; slug: string };
}) {
  const article = ARTICLES.find(
    (a) => a.slug === slug && a.category === 'announcement'
  );
  if (!article) notFound();

  return <ArticleDetailView article={article} locale={locale} />;
}
`,

  'src/app/[locale]/investor-relations/page.tsx': `import React from 'react';
import { Mail, Phone, Handshake } from 'lucide-react';
import { ReportsSection } from '@/components/home/ReportsSection';
import { DESIGN_TOKENS } from '@/lib/tokens';
import { Locale } from '@/i18n';

export default function InvestorRelationsPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  const isId = locale === 'id';

  return (
    <div className="bg-brand-dark pt-32 text-white">
      <section className="mx-auto max-w-container px-6 py-16">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
          {isId ? 'Kemitraan & Klien Kodein' : 'Kodein Client & Strategic Partnerships'}
        </span>
        <h1 className="mt-4 max-w-4xl text-fluid-h1 font-bold">
          {isId
            ? 'Kolaborasi Pengembangan Produk Digital & Kemitraan Teknologi Jangka Panjang'
            : 'Digital Product Development & Long-Term Technology Partnerships'}
        </h1>
      </section>

      <ReportsSection />

      <section className="mx-auto max-w-container px-6 py-20 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-brand-charcoal p-8">
          <Handshake className="h-7 w-7 text-brand-red" />
          <h2 className="mt-4 text-2xl font-bold">
            {isId ? 'Model Kerja Sama Fleksibel' : 'Flexible Engagement Models'}
          </h2>
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
            {isId
              ? 'Kami menyediakan skema Fixed-Price Project untuk pembuatan website/aplikasi dengan ruang lingkup jelas, maupun Dedicated Engineering Team (Retainer) untuk pengembangan berkelanjutan.'
              : 'We offer Fixed-Price Project engagements for well-defined website/software builds, as well as Dedicated Engineering Teams (Retainer) for continuous product evolution.'}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-brand-charcoal p-8">
          <h2 className="text-2xl font-bold">
            {isId ? 'Kontak Kemitraan & Bisnis' : 'Partnership & Business Contact'}
          </h2>
          <div className="mt-6 space-y-3 text-sm text-zinc-300">
            <p className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-brand-red" />
              <span>{DESIGN_TOKENS.brand.irEmail}</span>
            </p>
            <p className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-brand-red" />
              <span>{DESIGN_TOKENS.brand.phone}</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
`,

  'src/app/[locale]/help-center/page.tsx': `'use client';

import React, { useState } from 'react';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import { useLocale } from 'next-intl';
import { FAQ_ITEMS } from '@/content/siteData';
import { cn } from '@/lib/utils';
import { Locale } from '@/i18n';

export default function HelpCenterPage() {
  const locale = useLocale() as Locale;
  const isId = locale === 'id';
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [sent, setSent] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      subject: String(formData.get('subject') || ''),
      message: String(formData.get('message') || ''),
    };
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) setSent(true);
  };

  return (
    <div className="bg-brand-dark pt-32 pb-24 text-white">
      <div className="mx-auto max-w-container px-6">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
          {isId ? 'Konsultasi & Pusat Bantuan Kodein' : 'Kodein Project Consultation & FAQ'}
        </span>
        <h1 className="mt-4 text-fluid-h1 font-bold">
          {isId
            ? 'Pertanyaan Umum & Formulir Konsultasi Pembuatan Website / Software'
            : 'Frequently Asked Questions & Project Consultation Inquiry'}
        </h1>

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-4">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-brand-charcoal overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between p-6 text-left font-bold text-white"
                  >
                    <span>{item.q[locale]}</span>
                    <ChevronDown
                      className={cn(
                        'h-5 w-5 text-brand-red transition-transform',
                        isOpen && 'rotate-180'
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-sm leading-relaxed text-zinc-300">
                      {item.a[locale]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-white/10 bg-brand-charcoal p-8">
              <h2 className="text-xl font-bold">
                {isId ? 'Mulai Konsultasi Proyek' : 'Start a Project Consultation'}
              </h2>
              <p className="mt-2 text-xs text-zinc-400">
                {isId
                  ? 'Ceritakan kebutuhan website atau aplikasi yang ingin Anda bangun.'
                  : 'Tell us about the website or software application you want to build.'}
              </p>

              {sent ? (
                <div className="mt-6 flex items-center gap-3 text-emerald-400">
                  <CheckCircle2 className="h-6 w-6 shrink-0" />
                  <p className="text-sm">
                    {isId
                      ? 'Terima kasih! Tim Solution Architect Kodein akan segera menghubungi Anda.'
                      : 'Thank you! Kodein’s Solution Architect team will reach out shortly.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="mt-6 space-y-4">
                  <input
                    name="name"
                    required
                    placeholder={isId ? 'Nama Anda & Perusahaan *' : 'Your Name & Company *'}
                    className="w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-sm text-white focus:border-brand-red focus:outline-none"
                  />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder={isId ? 'Alamat Email Bisnis *' : 'Work Email Address *'}
                    className="w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-sm text-white focus:border-brand-red focus:outline-none"
                  />
                  <input
                    name="subject"
                    required
                    placeholder={
                      isId
                        ? 'Jenis Proyek (Website / Web App / Mobile App / ERP) *'
                        : 'Project Type (Website / Web App / Mobile App / ERP) *'
                    }
                    className="w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-sm text-white focus:border-brand-red focus:outline-none"
                  />
                  <textarea
                    name="message"
                    required
                    rows={4}
                    placeholder={
                      isId
                        ? 'Jelaskan fitur utama, target waktu rilis, atau referensi yang diinginkan *'
                        : 'Describe key features, target timeline, or reference sites *'
                    }
                    className="w-full rounded-lg border border-white/15 bg-black/50 p-4 text-sm text-white focus:border-brand-red focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full rounded-full bg-brand-red py-3.5 text-sm font-bold text-white hover:bg-brand-redHover transition"
                  >
                    {isId ? 'Kirim Permintaan Konsultasi' : 'Request Consultation'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`,

  'src/app/api/contact/route.ts': `import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sanitizeText } from '@/lib/utils';

const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(3000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input parameters', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const cleanPayload = {
      name: sanitizeText(parsed.data.name),
      email: parsed.data.email,
      subject: sanitizeText(parsed.data.subject),
      message: sanitizeText(parsed.data.message),
      receivedAt: new Date().toISOString(),
    };

    return NextResponse.json({ status: 'ok', timestamp: cleanPayload.receivedAt });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
`,

  'src/app/api/wbs/route.ts': `import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sanitizeText } from '@/lib/utils';

const wbsServerSchema = z.object({
  reporterName: z.string().max(100).optional(),
  reporterEmail: z.string().email().optional().or(z.literal('')),
  category: z.enum(['fraud', 'bribery', 'conflict_of_interest', 'harassment', 'other']),
  incidentDate: z.string().min(1),
  description: z.string().min(30).max(3000),
  honeypot: z.string().max(0).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = wbsServerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    }

    if (parsed.data.honeypot && parsed.data.honeypot.length > 0) {
      return NextResponse.json({ status: 'ok', referenceId: 'KODEIN-VDP-BOT' });
    }

    const referenceId = \`KODEIN-SEC-\${Date.now().toString(36).toUpperCase()}\`;
    const sanitizedDescription = sanitizeText(parsed.data.description);
    void sanitizedDescription;

    return NextResponse.json({
      status: 'ok',
      referenceId,
    });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
`,
};

console.log('🚀 Updating Kodein project to Web & Software Engineering Agency edition...');

for (const [relativePath, content] of Object.entries(files)) {
  const fullPath = path.join(process.cwd(), relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`  ✓ Updated ${relativePath}`);
}

console.log('\n✅ All 56 files updated to Kodein Software & Web Development profile!');
console.log('Run:');
console.log('  npm run dev');