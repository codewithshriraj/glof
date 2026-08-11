'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { useLanguage } from '@/i18n';

interface MapLegendProps {
  className?: string;
}

export const MapLegend: React.FC<MapLegendProps> = ({ className }) => {
  const { t } = useLanguage();

  return (
    <div
      className={cn(
        'bg-surface-container-high/95 backdrop-blur-md hud-border rounded-[4px] p-3 shadow-xl z-[400] pointer-events-auto font-mono text-[10px]',
        className
      )}
    >
      <div className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-wider hud-border-b pb-1.5 mb-2">
        {t.map.riskClassification}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-critical pulse-ping" />
          <span className="text-critical font-bold">{t.map.legendCritical}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-warning pulse-dot" />
          <span className="text-warning font-bold">{t.map.legendWarning}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
          <span className="text-secondary font-bold">{t.map.legendWatch}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-advisory" />
          <span className="text-advisory font-bold">{t.map.legendNominal}</span>
        </div>
      </div>

      <div className="mt-2 pt-2 hud-border-t flex flex-col gap-1 text-[9px] text-outline">
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 bg-critical border border-dashed inline-block" />
          <span>{t.map.inundationCorridor}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-primary/30 border border-primary inline-block rounded-[1px]" />
          <span>{t.map.iotStation}</span>
        </div>
      </div>
    </div>
  );
};
