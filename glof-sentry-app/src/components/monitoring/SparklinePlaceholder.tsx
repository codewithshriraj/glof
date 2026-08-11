import React from 'react';
import { cn } from '@/lib/utils/cn';

interface SparklinePlaceholderProps {
  title?: string;
  sourceTag?: string;
  heights: number[];
  slaThresholdPct?: number;
  className?: string;
}

export const SparklinePlaceholder: React.FC<SparklinePlaceholderProps> = ({
  title = 'DATA PIPELINE UPTIME',
  sourceTag = 'SOURCE: AWS-CW-1',
  heights,
  slaThresholdPct = 50,
  className,
}) => {
  return (
    <div className={cn('data-card p-4 flex flex-col rounded-[4px]', className)}>
      <div className="flex justify-between items-center hud-border-b pb-2 mb-4">
        <h3 className="font-sans text-[11px] font-bold tracking-[0.1em] text-on-surface uppercase">
          {title}
        </h3>
        <span className="font-mono text-[10px] text-outline">{sourceTag}</span>
      </div>

      <div className="relative w-full h-44 flex items-end justify-between gap-1 mt-2">
        {/* Abstracted Chart Bars */}
        {heights.map((height, idx) => {
          const isBelowSla = height < slaThresholdPct;
          return (
            <div
              key={idx}
              className={cn(
                'w-full transition-opacity opacity-80 hover:opacity-100 rounded-t-[1px]',
                isBelowSla ? 'bg-critical shadow-[0_0_8px_rgba(255,107,107,0.4)]' : 'bg-primary-fixed/80'
              )}
              style={{ height: `${height}%` }}
              title={`Metric at step ${idx + 1}: ${height}%`}
            />
          );
        })}

        {/* SLA Threshold Overlay Line */}
        <div
          className="absolute w-full border-b border-dashed border-critical left-0 z-10 pointer-events-none opacity-60 flex items-center"
          style={{ bottom: `${slaThresholdPct}%` }}
        >
          <span className="absolute right-0 font-mono text-[9px] text-critical -top-3.5 bg-background/90 px-1 border border-critical/30 rounded-[2px]">
            SLA THRESHOLD ({slaThresholdPct}%)
          </span>
        </div>

        {/* Background Grid Lines */}
        <div className="absolute w-full border-b border-surface-container-high bottom-[25%] left-0 pointer-events-none" />
        <div className="absolute w-full border-b border-surface-container-high bottom-[50%] left-0 pointer-events-none" />
        <div className="absolute w-full border-b border-surface-container-high bottom-[75%] left-0 pointer-events-none" />
      </div>

      <div className="flex justify-between mt-3 font-mono text-[10px] text-outline hud-border-t pt-2">
        <span>T-24H</span>
        <span>T-12H</span>
        <span className="text-secondary font-bold">NOW (LIVE)</span>
      </div>
    </div>
  );
};
