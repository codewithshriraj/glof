import React from 'react';
import { mockScenarioFactorContributions } from '@/lib/mock/simulation-data';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils/cn';

interface RiskContributionPanelProps {
  className?: string;
}

export const RiskContributionPanel: React.FC<RiskContributionPanelProps> = ({ className }) => {
  return (
    <div className={cn('data-card hud-border flex flex-col rounded-[4px]', className)}>
      {/* Header */}
      <div className="p-3 hud-border-b bg-surface-container-low/80 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Icon name="psychology" size="xs" className="text-secondary" />
          <span className="font-sans text-[11px] font-bold tracking-wider text-on-surface uppercase">
            SCENARIO RISK FACTOR CONTRIBUTIONS
          </span>
        </div>
        <span className="font-mono text-[9px] text-primary bg-primary/10 px-1.5 py-0.5 rounded-[2px] border border-primary/30">
          EXPLAINABLE RISK MODEL
        </span>
      </div>

      {/* Factor Contribution Bars */}
      <div className="p-4 flex flex-col gap-3 font-mono text-[11px]">
        {mockScenarioFactorContributions.map((item, idx) => {
          const isCritical = item.severity === 'CRITICAL';
          const isHigh = item.severity === 'HIGH';

          return (
            <div key={idx} className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-sans text-on-surface font-medium">{item.factor}</span>
                <div className="flex items-center gap-2">
                  <span className="text-outline">{item.contributionValue}</span>
                  <span
                    className={cn(
                      'font-bold px-1.5 py-0.2 rounded-[2px] text-[9px]',
                      isCritical
                        ? 'text-critical bg-critical/15'
                        : isHigh
                        ? 'text-warning bg-warning/15'
                        : 'text-secondary bg-secondary/15'
                    )}
                  >
                    {item.weightPct}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-surface-container-high rounded-[1px] overflow-hidden">
                <div
                  className={cn(
                    'h-full transition-all duration-300',
                    isCritical
                      ? 'bg-critical'
                      : isHigh
                      ? 'bg-warning'
                      : item.barColor === 'secondary'
                      ? 'bg-secondary'
                      : 'bg-primary'
                  )}
                  style={{ width: `${item.weightPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
