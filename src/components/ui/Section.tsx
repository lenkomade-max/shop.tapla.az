import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?: 'light' | 'dark' | 'neutral' | 'transparent';
  id?: string;
  py?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export function Section({
  children,
  className,
  variant = 'light',
  id,
  py = 'md',
  ...props
}: SectionProps) {
  const bgClasses = {
    light: 'bg-white text-neutral-900',
    dark: 'bg-neutral-950 text-white',
    neutral: 'bg-neutral-50 text-neutral-900',
    transparent: 'bg-transparent',
  };

  const pyClasses = {
    none: 'py-0',
    sm: 'py-8 md:py-12',
    md: 'py-16 md:py-24',
    lg: 'py-20 md:py-32',
    xl: 'py-28 md:py-40',
  };

  return (
    <section
      id={id}
      className={twMerge(
        clsx(bgClasses[variant], pyClasses[py], 'relative overflow-hidden w-full'),
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}
