'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { RegionalRiskMetric } from '@/lib/types/glof';
import { Icon } from '@/components/ui/Icon';
import { useLanguage } from '@/i18n';

interface RiskMatrixGridProps {
  items: RegionalRiskMetric[];
  className?: string;
}

export const RiskMatrixGrid: React.FC<RiskMatrixGridProps> = ({ items, className }) => {
  const { t, language } = useLanguage();

  const getMarkerColor = (color: string) => {
    switch (color) {
      case 'critical':
        return 'bg-critical border-critical text-critical';
      case 'secondary':
        return 'bg-secondary border-secondary text-secondary';
      case 'primary':
        return 'bg-primary border-primary text-primary';
      default:
        return 'bg-outline border-outline text-outline';
    }
  };

  return (
    <div className={cn('data-card flex flex-col rounded-[4px]', className)}>
      <div className="hud-border-b p-3 flex justify-between items-center bg-surface-container-low/40">
        <span className="font-sans text-[11px] font-bold tracking-[0.1em] text-on-surface uppercase">
          {t.riskIntelligence.matrixTitle}
        </span>
        <Icon name="grid_on" size="xs" className="text-outline" />
      </div>

      <div className="flex-grow p-6 flex flex-col min-h-[300px]">
        <div className="relative flex-grow border-l border-b border-surface-container-high ml-6 mb-6 bg-[linear-gradient(rgba(35,43,51,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(35,43,51,0.25)_1px,transparent_1px)] bg-[size:25%_25%]">
          {/* Y Axis Label */}
          <div className="absolute -left-7 top-1/2 -translate-y-1/2 -rotate-90 origin-center font-mono text-[9px] text-on-surface-variant tracking-[0.15em] whitespace-nowrap">
            {t.riskIntelligence.impactSeverity} →
          </div>

          {/* X Axis Label */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono text-[9px] text-on-surface-variant tracking-[0.15em]">
            {t.riskIntelligence.eventLikelihood} →
          </div>

          {/* Risk Quadrant Tint Overlays */}
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-critical/5 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-secondary/5 pointer-events-none" />

          {/* Markers */}
          {items.map((item) => (
            <div
              key={item.region}
              className="absolute w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
              style={{
                left: `${item.coordinatesOnMatrix.xPct}%`,
                top: `${item.coordinatesOnMatrix.yPct}%`,
              }}
            >
              <div className={cn('w-3 h-3 rounded-full', getMarkerColor(item.statusColor).split(' ')[0])} />
              <div
                className={cn(
                  'absolute -inset-1 rounded-full border opacity-75 animate-ping',
                  getMarkerColor(item.statusColor).split(' ')[1]
                )}
              />
              <span
                className={cn(
                  'absolute font-mono text-[10px] px-1.5 py-0.5 rounded-[2px] bg-surface-container border whitespace-nowrap z-30 shadow-md',
                  item.coordinatesOnMatrix.xPct > 50 ? 'right-4' : 'left-4',
                  'top-1/2 -translate-y-1/2',
                  getMarkerColor(item.statusColor)
                )}
              >
                {item.region} ({item.score.toFixed(3)})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
