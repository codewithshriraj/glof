'use client';

import React, { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils/cn';

interface ConnectionStatusIndicatorProps {
  compact?: boolean;
  className?: string;
}

export const ConnectionStatusIndicator: React.FC<ConnectionStatusIndicatorProps> = ({
  compact = false,
  className,
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [lastSyncTime, setLastSyncTime] = useState<string>('14:35 UTC');
  const [isReconnecting, setIsReconnecting] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsReconnecting(true);
      setTimeout(() => {
        setIsOnline(true);
        setIsReconnecting(false);
        const now = new Date();
        setLastSyncTime(`${now.getUTCHours().toString().padStart(2, '0')}:${now.getUTCMinutes().toString().padStart(2, '0')} UTC`);
      }, 1200);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsReconnecting(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (compact) {
    return (
      <div
        className={cn(
          'flex items-center gap-1.5 px-2 py-0.5 rounded-[3px] font-mono text-[9px] font-bold border transition-colors',
          isOnline
            ? 'bg-advisory/10 text-advisory border-advisory/30'
            : isReconnecting
            ? 'bg-warning/10 text-warning border-warning/30 animate-pulse'
            : 'bg-error/15 text-error border-error/40',
          className
        )}
        title={isOnline ? 'Real-time Himalayan mesh telemetry connected' : `Offline. Last sync: ${lastSyncTime}`}
      >
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            isOnline ? 'bg-advisory' : isReconnecting ? 'bg-warning' : 'bg-error animate-pulse'
          )}
        />
        <span>
          {isOnline ? 'LIVE' : isReconnecting ? 'RECONNECTING' : 'OFFLINE'}
        </span>
      </div>
    );
  }

  return (
    <div className={cn('font-mono', className)}>
      {!isOnline && (
        <div className="bg-error/15 border-b border-error/40 px-4 py-2 text-center text-error flex flex-wrap items-center justify-center gap-2 text-[10px] animate-fadeIn">
          <div className="flex items-center gap-1.5 font-bold">
            <Icon name="wifi_off" size="xs" />
            <span>⚠ OFFLINE MODE ACTIVATED</span>
          </div>
          <span className="text-outline">{'//'}</span>
          <span className="text-on-surface-variant font-medium">
            LAST SYNCHRONIZED: <strong className="text-on-surface">{lastSyncTime}</strong>
          </span>
          <span className="text-outline">{'//'}</span>
          <span className="text-error font-bold">LIVE RISK TELEMETRY UNAVAILABLE</span>
        </div>
      )}

      {isReconnecting && (
        <div className="bg-warning/15 border-b border-warning/40 px-4 py-1.5 text-center text-warning flex items-center justify-center gap-2 text-[10px] animate-pulse">
          <Icon name="sync" size="xs" className="animate-spin" />
          <span>RE-ESTABLISHING SECURE CRYOSPHERE TELEMETRY LINK...</span>
        </div>
      )}
    </div>
  );
};
