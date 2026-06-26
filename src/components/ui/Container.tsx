import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  clean?: boolean;
}

export function Container({ children, className, clean = false, ...props }: ContainerProps) {
  return (
    <div
      className={twMerge(
        clsx(
          !clean && 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
          clean && 'w-full'
        ),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
