'use client';

import React from 'react';
import { AlertTimelineEvent } from '@/lib/types/glof';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils/cn';
import { useLanguage } from '@/i18n';

interface AlertTimelineProps {
  events: AlertTimelineEvent[];
  className?: string;
}

export const AlertTimeline: React.FC<AlertTimelineProps> = ({ events, className }) => {
  const { t, language } = useLanguage();

  return (
    <div className={cn('data-card hud-border flex flex-col rounded-[4px]', className)}>
      {/* Header */}
      <div className="p-3 hud-border-b bg-surface-container-low/80 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Icon name="history" size="xs" className="text-secondary" />
          <span className="font-sans text-[11px] font-bold tracking-wider text-on-surface uppercase">
            {t.alerts.auditTimeline}
          </span>
        </div>
        <span className="font-mono text-[9px] text-outline">
          {language === 'hi' ? 'अपरिवर्तनीय घटना लॉग' : 'IMMUTABLE EVENT LOG'}
        </span>
      </div>

      {/* Events List */}
      <div className="p-4 flex flex-col gap-3 font-mono text-[11px]">
        {events.map((evt, idx) => {
          const isCritical = evt.severity === 'critical';
          const isWarn = evt.severity === 'warn';

          return (
            <div
              key={evt.id || idx}
              className={cn(
                'relative pl-5 pb-3 border-l-2 last:pb-0',
                isCritical
                  ? 'border-l-critical'
                  : isWarn
                  ? 'border-l-warning'
                  : 'border-l-secondary/50'
              )}
            >
              {/* Dot Beacon */}
              <div
                className={cn(
                  'absolute -left-[5px] top-0.5 w-2 h-2 rounded-full',
                  isCritical
                    ? 'bg-critical pulse-ping'
                    : isWarn
                    ? 'bg-warning'
                    : 'bg-secondary'
                )}
              />

              {/* Event Header */}
              <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] mb-0.5">
                <span className="text-secondary font-bold">{evt.actor}</span>
                <span className="text-outline">{evt.timestampUTC}</span>
              </div>

              {/* Action Title */}
              <div
                className={cn(
                  'font-sans text-[11px] font-bold uppercase',
                  isCritical ? 'text-critical' : 'text-on-surface'
                )}
              >
                {evt.action}
              </div>

              {/* Details */}
              <p className="text-[10px] text-on-surface-variant mt-0.5 font-sans leading-relaxed">
                {evt.details}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
