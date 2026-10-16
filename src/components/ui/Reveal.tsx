'use client';

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
