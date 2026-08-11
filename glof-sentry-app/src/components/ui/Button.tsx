import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'critical' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-sans font-bold uppercase tracking-wider transition-all duration-150 rounded-[4px] select-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer touch-manipulation';
  
  const sizeStyles = {
    sm: 'text-[11px] px-3 py-1.5 gap-1.5',
    md: 'text-[12px] px-4 py-2.5 gap-2',
    lg: 'text-[14px] px-6 py-3.5 gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-primary-strategic to-secondary text-background hover:brightness-110 shadow-[0_0_15px_rgba(93,230,255,0.2)] border border-secondary/40',
    secondary: 'bg-secondary/10 text-secondary border border-secondary/40 hover:bg-secondary/20 hover:shadow-[0_0_12px_rgba(93,230,255,0.15)]',
    critical: 'bg-critical/90 hover:bg-critical text-background border border-critical shadow-[0_0_15px_rgba(255,107,107,0.25)]',
    ghost: 'bg-transparent text-on-surface hover:bg-surface-container-high border border-transparent',
    outline: 'bg-surface-container-low text-on-surface border border-outline-variant/60 hover:border-secondary/40 hover:bg-surface-container hover:text-secondary',
  };

  return (
    <button
      type={type}
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
