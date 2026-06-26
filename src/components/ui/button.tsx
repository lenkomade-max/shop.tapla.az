import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'accent';
  size?: 'sm' | 'md' | 'lg' | 'full';
  loading?: boolean;
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-sans tracking-widest uppercase transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer';

  const variantClasses = {
    primary: 'bg-neutral-950 text-white hover:bg-neutral-800 border border-neutral-950',
    secondary: 'bg-white text-neutral-950 hover:bg-neutral-50 border border-neutral-200',
    outline: 'bg-transparent text-neutral-950 border border-neutral-950 hover:bg-neutral-950 hover:text-white',
    accent: 'bg-neutral-900 text-amber-100 hover:bg-amber-950 hover:text-white border border-neutral-900',
    text: 'bg-transparent text-neutral-950 p-0 relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-neutral-950 after:origin-right hover:after:origin-left after:scale-x-100 hover:after:scale-x-0 after:transition-transform after:duration-300',
  };

  const sizeClasses = {
    sm: 'text-[11px] px-4 py-2 font-medium',
    md: 'text-xs px-6 py-3.5 font-semibold',
    lg: 'text-sm px-8 py-4 font-semibold',
    full: 'text-xs px-6 py-4 font-semibold w-full',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={twMerge(
        clsx(baseClasses, variantClasses[variant], sizeClasses[size]),
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="flex items-center space-x-2">
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>GÖZLƏYİN...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
