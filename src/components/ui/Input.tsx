import React, { useId } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  dark?: boolean;
}

export function Input({
  className,
  label,
  error,
  dark = false,
  id,
  type = 'text',
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;


  return (
    <div className="w-full flex flex-col space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className={clsx(
            'text-[10px] tracking-widest uppercase font-semibold',
            dark ? 'text-neutral-400' : 'text-neutral-600'
          )}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        className={twMerge(
          clsx(
            'w-full px-4 py-3.5 text-xs font-sans tracking-wide transition-all duration-300 focus:outline-none border rounded-none',
            dark
              ? 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500 focus:border-white focus:ring-1 focus:ring-white'
              : 'bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950',
            error && 'border-red-500 focus:border-red-500'
          ),
          className
        )}
        {...props}
      />
      {error && (
        <span className="text-[10px] text-red-500 font-medium tracking-wide uppercase">
          {error}
        </span>
      )}
    </div>
  );
}
