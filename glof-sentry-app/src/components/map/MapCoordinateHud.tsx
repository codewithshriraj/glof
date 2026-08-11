import React from 'react';
import { cn } from '@/lib/utils/cn';

interface MapCoordinateHudProps {
  lat: number;
  lng: number;
  altM?: number;
  isCritical?: boolean;
  className?: string;
}

export const MapCoordinateHud: React.FC<MapCoordinateHudProps> = ({
  lat,
  lng,
  altM = 5240,
  isCritical = false,
  className,
}) => {
  const latStr = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}`;
  const lngStr = `${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`;

  return (
    <div
      className={cn(
        'bg-surface-container-high/95 backdrop-blur-md hud-border rounded-[4px] px-3.5 py-2.5 flex flex-col items-end shadow-xl z-[400] pointer-events-auto',
        isCritical && 'border-critical/50 bg-critical/5',
        className
      )}
    >
      <span className="font-mono text-[9px] text-outline uppercase tracking-wider mb-1">
        LAT / LNG / ELEVATION
      </span>
      <span
        className={cn(
          'font-mono text-[13px] font-bold leading-tight',
          isCritical ? 'text-critical' : 'text-secondary'
        )}
      >
        {latStr}
      </span>
      <span
        className={cn(
          'font-mono text-[13px] font-bold leading-tight',
          isCritical ? 'text-critical' : 'text-secondary'
        )}
      >
        {lngStr}
      </span>
      <span className="font-mono text-[11px] text-tertiary mt-1.5 border-t border-surface-container-highest pt-1 w-full text-right">
        {altM.toLocaleString()} M a.s.l.
      </span>
    </div>
  );
};
