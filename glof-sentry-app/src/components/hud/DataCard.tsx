import React from 'react';
import { cn } from '@/lib/utils/cn';

interface DataCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  badge?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: 'default' | 'critical' | 'highlight';
  noPadding?: boolean;
}

export const DataCard: React.FC<DataCardProps> = ({
  title,
  badge,
  footer,
  variant = 'default',
  noPadding = false,
  children,
  className,
  ...props
}) => {
  const variantStyles = {
    default: 'data-card',
    critical: 'data-card bg-critical/5 border-critical/40',
    highlight: 'data-card bg-secondary/5 border-secondary/40',
  };

  return (
    <div
      className={cn(
        'relative flex flex-col overflow-hidden rounded-[4px]',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {title && (
        <div className="flex justify-between items-center px-4 py-2.5 hud-border-b bg-surface-container-low/40">
          <h3 className="font-sans text-[11px] font-bold tracking-[0.1em] uppercase text-on-surface">
            {title}
          </h3>
          {badge && <div>{badge}</div>}
        </div>
      )}
      <div className={cn('flex-grow', !noPadding && 'p-4')}>{children}</div>
      {footer && (
        <div className="px-4 py-2 hud-border-t bg-surface-container-lowest/50 text-[10px] font-mono text-outline">
          {footer}
        </div>
      )}
    </div>
  );
};
