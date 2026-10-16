import React from 'react';
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
