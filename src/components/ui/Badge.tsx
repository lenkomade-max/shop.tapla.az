import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'solid' | 'outline' | 'accent';
  size?: 'sm' | 'md';
}

export function Badge({
  children,
  className,
  variant = 'solid',
  size = 'sm',
  ...props
}: BadgeProps) {
  const variantClasses = {
    solid: 'bg-neutral-900 text-white border-neutral-900',
    outline: 'bg-transparent text-neutral-900 border-neutral-300',
    accent: 'bg-red-50 text-red-700 border-red-200 uppercase font-semibold letter-spacing-1',
  };

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 tracking-wider uppercase font-semibold border',
    md: 'text-xs px-2.5 py-1 tracking-widest uppercase font-semibold border',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center rounded-none font-sans',
          variantClasses[variant],
          sizeClasses[size]
        ),
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
