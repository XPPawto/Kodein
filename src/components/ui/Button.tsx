import React from 'react';
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
