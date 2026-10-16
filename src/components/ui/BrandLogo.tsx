import React from 'react';
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
  const rawId = React.useId();
  const gradId = `kodeinPinwheelGrad-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  const fillMap = {
    red: '#EE2B10',
    coral: '#FF5526',
    gradient: `url(#${gradId})`,
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
          id={gradId}
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
          <g key={angle} transform={`rotate(${angle} 256 256)`}>
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
