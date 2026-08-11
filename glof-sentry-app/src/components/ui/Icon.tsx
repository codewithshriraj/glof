import React from 'react';
import { cn } from '@/lib/utils/cn';

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  filled?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  xs: 'text-[14px]',
  sm: 'text-[16px]',
  md: 'text-[20px]',
  lg: 'text-[24px]',
  xl: 'text-[32px]',
};

export const Icon: React.FC<IconProps> = ({
  name,
  filled = false,
  size = 'md',
  className,
  ...props
}) => {
  return (
    <span
      className={cn(
        'material-symbols-outlined select-none pointer-events-none inline-flex items-center justify-center',
        filled && 'filled',
        sizeClasses[size],
        className
      )}
      aria-hidden="true"
      {...props}
    >
      {name}
    </span>
  );
};
