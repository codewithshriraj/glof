'use client';

import React, { useState } from 'react';
import { OperationalAlert } from '@/lib/types/glof';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils/cn';
import { useLanguage } from '@/i18n';

interface AlertQueueProps {
  alerts: OperationalAlert[];
  selectedAlertId: string;
  onSelectAlert: (alertId: string) => void;
  className?: string;
}

type FilterType = 'ALL' | 'CRITICAL' | 'UNACKNOWLEDGED';

export const AlertQueue: React.FC<AlertQueueProps> = ({
  alerts,
  selectedAlertId,
  onSelectAlert,
  className,
}) => {
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');

  const filteredAlerts = alerts.filter((alert) => {
    if (activeFilter === 'CRITICAL') return alert.severity === 'L4';
    if (activeFilter === 'UNACKNOWLEDGED') return alert.status === 'NEW';
    return true;
  });

  return (
    <div className={cn('data-card hud-border flex flex-col rounded-[4px]', className)}>
      {/* Filter Tabs Header */}
      <div className="p-3 hud-border-b bg-surface-container-low/80 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <Icon name="format_list_bulleted" size="xs" className="text-secondary" />
          <span className="font-sans text-[11px] font-bold tracking-wider text-on-surface uppercase">
            {t.alerts.activeAlertQueue} ({filteredAlerts.length})
          </span>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 font-mono text-[9px]">
          <button
            type="button"
            onClick={() => setActiveFilter('ALL')}
            className={cn(
              'px-2 py-1 rounded-[2px] font-bold transition-colors uppercase border touch-manipulation cursor-pointer',
              activeFilter === 'ALL'
                ? 'bg-secondary/15 text-secondary border-secondary/50'
                : 'bg-surface-container text-outline hover:text-on-surface border-surface-high'
            )}
          >
            {t.alerts.filterAll} ({alerts.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('CRITICAL')}
            className={cn(
              'px-2 py-1 rounded-[2px] font-bold transition-colors uppercase border touch-manipulation cursor-pointer',
              activeFilter === 'CRITICAL'
                ? 'bg-critical/20 text-critical border-critical/50'
                : 'bg-surface-container text-outline hover:text-on-surface border-surface-high'
            )}
          >
            {t.alerts.filterCritical} ({alerts.filter((a) => a.severity === 'L4').length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('UNACKNOWLEDGED')}
            className={cn(
              'px-2 py-1 rounded-[2px] font-bold transition-colors uppercase border touch-manipulation cursor-pointer',
              activeFilter === 'UNACKNOWLEDGED'
                ? 'bg-warning/20 text-warning border-warning/50'
                : 'bg-surface-container text-outline hover:text-on-surface border-surface-high'
            )}
          >
            {t.alerts.filterUnack} ({alerts.filter((a) => a.status === 'NEW').length})
          </button>
        </div>
      </div>

      {/* Alert Feed List */}
      <div className="divide-y divide-surface-high max-h-[600px] overflow-y-auto">
        {filteredAlerts.map((alert) => {
          const isSelected = alert.id === selectedAlertId;
          const isCritical = alert.severity === 'L4';
          const isWarning = alert.severity === 'L3';

          return (
            <article
              key={alert.id}
              onClick={() => onSelectAlert(alert.id)}
              className={cn(
                'p-3.5 cursor-pointer transition-all flex flex-col gap-2 relative border-l-4',
                isCritical
                  ? 'border-l-critical'
                  : isWarning
                  ? 'border-l-warning'
                  : 'border-l-secondary',
                isSelected
                  ? isCritical
                    ? 'bg-critical/10 shadow-inner'
                    : 'bg-surface-container-high shadow-inner'
                  : 'hover:bg-surface-container-high/60 bg-surface-container-low/40'
              )}
            >
              {/* Header Row */}
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-[2px] border',
                      isCritical
                        ? 'bg-critical text-background border-critical font-extrabold'
                        : isWarning
                        ? 'bg-warning/20 text-warning border-warning/40'
                        : 'bg-secondary/20 text-secondary border-secondary/40'
                    )}
                  >
                    {alert.severity} {'//'} {alert.type}
                  </span>
                  <span className="font-mono text-[10px] text-outline font-bold">
                    {alert.id}
                  </span>
                </div>

                <span
                  className={cn(
                    'font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-[2px] border',
                    alert.status === 'NEW'
                      ? 'text-warning border-warning/40 bg-warning/10 pulse-dot'
                      : alert.status === 'ESCALATED' || alert.status === 'DISPATCHED'
                      ? 'text-critical border-critical/40 bg-critical/10'
                      : 'text-advisory border-advisory/40 bg-advisory/10'
                  )}
                >
                  {alert.status}
                </span>
              </div>

              {/* Title & Site Location */}
              <div>
                <h3 className="font-sans text-[13px] font-bold text-on-surface uppercase tracking-wide">
                  {alert.lakeName} ({alert.lakeCode}) — {alert.title}
                </h3>
                <p className="font-sans text-[11px] text-on-surface-variant line-clamp-2 mt-0.5">
                  {alert.triggerCondition}
                </p>
              </div>

              {/* Meta Footer */}
              <div className="flex justify-between items-center font-mono text-[9px] text-outline pt-1 hud-border-t">
                <span className="flex items-center gap-1 text-secondary">
                  <Icon name="location_on" size="xs" />
                  {alert.region}
                </span>
                <span>{alert.createdAtUTC} · {alert.assignedOperator}</span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
