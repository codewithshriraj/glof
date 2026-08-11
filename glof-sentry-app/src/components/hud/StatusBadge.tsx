import React from 'react';
import { cn } from '@/lib/utils/cn';
import { RiskLevel, RiskStatus } from '@/lib/types/glof';

interface StatusBadgeProps {
  level?: RiskLevel;
  status?: RiskStatus | string;
  pulse?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  level,
  status,
  pulse = false,
  size = 'md',
  className,
}) => {
  const getVariantStyles = () => {
    if (level === 'L4' || status === 'CRITICAL') {
      return 'bg-critical/10 text-critical border-critical/40';
    }
    if (level === 'L3' || status === 'WARNING' || status === 'AMBER') {
      return 'bg-warning/10 text-warning border-warning/40';
    }
    if (level === 'L2' || status === 'WATCH' || status === 'ADVISORY') {
      return 'bg-secondary/10 text-secondary border-secondary/40';
    }
    return 'bg-advisory/10 text-advisory border-advisory/40';
  };

  const displayText = status || level || 'NOMINAL';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-sans font-bold uppercase tracking-wider border rounded-[2px]',
        size === 'sm' ? 'text-[9px] px-1.5 py-0.5' : 'text-[11px] px-2 py-0.5',
        getVariantStyles(),
        className
      )}
    >
      {pulse && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full inline-block',
            level === 'L4' || status === 'CRITICAL' ? 'bg-critical pulse-ping' : 'bg-secondary pulse-ping'
          )}
        />
      )}
      <span>{displayText}</span>
    </span>
  );
};
