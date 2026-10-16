import type { Config } from 'tailwindcss';

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
        container: '1760px',
      },
      fontSize: {
        'fluid-hero': ['clamp(2.15rem, 3.6vw + 0.75rem, 3.85rem)', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        'fluid-h1': ['clamp(2rem, 3.5vw + 0.75rem, 3.5rem)', { lineHeight: '1.12', letterSpacing: '-0.025em' }],
        'fluid-h2': ['clamp(1.75rem, 2.6vw + 0.5rem, 2.75rem)', { lineHeight: '1.18', letterSpacing: '-0.02em' }],
        'fluid-statement': ['clamp(1.5rem, 2.3vw + 0.5rem, 2.5rem)', { lineHeight: '1.3', letterSpacing: '-0.015em' }],
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
