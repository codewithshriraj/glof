import React from 'react';
import { cn } from '@/lib/utils/cn';
import { TelemetryLogEntry } from '@/lib/types/glof';
import { Icon } from '@/components/ui/Icon';

interface TelemetryLogProps {
  title?: string;
  logs: TelemetryLogEntry[];
  maxHeight?: string;
  className?: string;
}

export const TelemetryLog: React.FC<TelemetryLogProps> = ({
  title = 'LIVE TELEMETRY',
  logs,
  maxHeight = 'h-[360px]',
  className,
}) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'CRIT':
      case 'ERR':
        return 'text-critical font-bold';
      case 'WARN':
        return 'text-warning font-bold';
      case 'INFO':
      default:
        return 'text-secondary';
    }
  };

  return (
    <div className={cn('data-card p-4 flex flex-col rounded-[4px]', className)}>
      <div className="flex justify-between items-center hud-border-b pb-2 mb-3">
        <h3 className="font-sans text-[11px] font-bold tracking-[0.1em] text-on-surface uppercase">
          {title}
        </h3>
        <Icon name="filter_list" size="xs" className="text-outline" />
      </div>

      <div
        className={cn(
          'flex-grow overflow-y-auto bg-surface-container-lowest/80 p-3 rounded-[3px] font-mono text-[11px] space-y-2 hud-border',
          maxHeight
        )}
      >
        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-2 leading-relaxed">
            <span className="text-outline shrink-0">{log.timestamp}</span>
            <span className={cn('shrink-0', getLevelColor(log.level))}>
              [{log.level}]
            </span>
            <span className="text-on-surface-variant break-words">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
