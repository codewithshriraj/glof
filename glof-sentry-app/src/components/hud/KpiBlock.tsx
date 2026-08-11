import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Icon } from '@/components/ui/Icon';

interface KpiBlockProps {
  label: string;
  value: string | number;
  subValue?: string;
  sourceTag?: string;
  statusLabel?: string;
  statusColor?: 'primary' | 'secondary' | 'warning' | 'critical' | 'advisory';
  icon?: string;
  className?: string;
}

export const KpiBlock: React.FC<KpiBlockProps> = ({
  label,
  value,
  subValue,
  sourceTag,
  statusLabel,
  statusColor = 'secondary',
  icon,
  className,
}) => {
  const colorMap = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    warning: 'text-warning',
    critical: 'text-critical',
    advisory: 'text-advisory',
  };

  return (
    <div
      className={cn(
        'data-card p-4 flex flex-col justify-between min-h-[104px] rounded-[4px]',
        statusColor === 'critical' && 'bg-critical/5 border-critical/40',
        className
      )}
    >
      <div className="flex justify-between items-start hud-border-b pb-2 mb-2">
        <h4 className="font-sans text-[11px] font-bold tracking-[0.1em] uppercase text-on-surface-variant">
          {label}
        </h4>
        {icon && (
          <Icon
            name={icon}
            size="sm"
            className={cn(
              statusColor === 'critical' ? 'text-critical pulse-ping' : 'text-outline'
            )}
          />
        )}
      </div>
      <div className="flex items-end justify-between gap-2">
        <div className={cn('font-mono text-[24px] md:text-[28px] font-bold leading-none', colorMap[statusColor])}>
          {value}
        </div>
        <div className="font-mono text-[10px] text-outline text-right leading-tight">
          {statusLabel && (
            <div className={cn('font-bold', colorMap[statusColor])}>{statusLabel}</div>
          )}
          {subValue && <div className="text-on-surface-variant">{subValue}</div>}
          {sourceTag && <div className="text-outline/80">{sourceTag}</div>}
        </div>
      </div>
    </div>
  );
};
