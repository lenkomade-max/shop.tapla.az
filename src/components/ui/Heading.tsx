import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
  tracking?: 'tighter' | 'tight' | 'normal' | 'wide' | 'wider';
  serif?: boolean;
}

export function Heading({
  children,
  className,
  level = 2,
  weight = 'light',
  align = 'left',
  tracking = 'wide',
  serif = false,
  ...props
}: HeadingProps) {
  const Tag = `h${level}` as const;

  const levelClasses = {
    1: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-none',
    2: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight',
    3: 'text-2xl sm:text-3xl md:text-4xl leading-snug',
    4: 'text-xl sm:text-2xl md:text-3xl leading-snug',
    5: 'text-lg sm:text-xl leading-normal',
    6: 'text-base sm:text-lg leading-normal',
  };

  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const trackingClasses = {
    tighter: 'tracking-tighter',
    tight: 'tracking-tight',
    normal: 'tracking-normal',
    wide: 'tracking-wide',
    wider: 'tracking-wider uppercase',
  };

  return (
    <Tag
      className={twMerge(
        clsx(
          levelClasses[level],
          weightClasses[weight],
          alignClasses[align],
          trackingClasses[tracking],
          serif ? 'font-serif' : 'font-sans'
        ),
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
