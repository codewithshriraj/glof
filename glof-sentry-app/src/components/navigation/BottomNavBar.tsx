'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { Icon } from '@/components/ui/Icon';
import { useLanguage } from '@/i18n';

interface BottomNavBarProps {
  onOpenFieldReport?: () => void;
  onOpenDrawer?: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  onOpenFieldReport,
  onOpenDrawer,
}) => {
  const pathname = usePathname();
  const { t } = useLanguage();

  const isCommandActive = pathname === '/command' || pathname === '/';
  const isAlertsActive = pathname === '/alerts';
  const isMapActive = pathname === '/map';

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 w-full z-40 flex items-center justify-around h-16 bg-surface-dim/95 backdrop-blur-md hud-border-t pb-[env(safe-area-inset-bottom)] select-none shadow-2xl"
    >
      {/* 1. COMMAND */}
      <Link
        href="/command"
        className={cn(
          'flex flex-col items-center justify-center flex-1 h-full min-h-[48px] py-1 transition-all duration-150 relative touch-manipulation cursor-pointer',
          isCommandActive
            ? 'text-secondary border-t-2 border-secondary bg-secondary/5'
            : 'text-outline hover:text-on-surface'
        )}
      >
        <Icon
          name="dashboard"
          size="sm"
          filled={isCommandActive}
          className={isCommandActive ? 'text-secondary' : 'text-outline'}
        />
        <span className="font-sans text-[9px] font-bold tracking-wider mt-0.5 text-center leading-none">
          {t.nav.command.split(' ')[0]}
        </span>
      </Link>

      {/* 2. ALERTS */}
      <Link
        href="/alerts"
        className={cn(
          'flex flex-col items-center justify-center flex-1 h-full min-h-[48px] py-1 transition-all duration-150 relative touch-manipulation cursor-pointer',
          isAlertsActive
            ? 'text-secondary border-t-2 border-secondary bg-secondary/5'
            : 'text-outline hover:text-on-surface'
        )}
      >
        <div className="relative">
          <Icon
            name="crisis_alert"
            size="sm"
            filled={isAlertsActive}
            className={isAlertsActive ? 'text-secondary' : 'text-outline'}
          />
          <span className="absolute -top-1 -right-2 bg-critical text-background font-mono text-[8px] px-1 rounded-full font-bold">
            3
          </span>
        </div>
        <span className="font-sans text-[9px] font-bold tracking-wider mt-0.5 text-center leading-none">
          {t.nav.alerts.split(' ')[0]}
        </span>
      </Link>

      {/* 3. GIS MAP */}
      <Link
        href="/map"
        className={cn(
          'flex flex-col items-center justify-center flex-1 h-full min-h-[48px] py-1 transition-all duration-150 relative touch-manipulation cursor-pointer',
          isMapActive
            ? 'text-secondary border-t-2 border-secondary bg-secondary/5'
            : 'text-outline hover:text-on-surface'
        )}
      >
        <Icon
          name="map"
          size="sm"
          filled={isMapActive}
          className={isMapActive ? 'text-secondary' : 'text-outline'}
        />
        <span className="font-sans text-[9px] font-bold tracking-wider mt-0.5 text-center leading-none">
          {t.nav.map.split(' ')[0]}
        </span>
      </Link>

      {/* 4. FIELD REPORT ACTION BUTTON */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (onOpenFieldReport) onOpenFieldReport();
        }}
        className="flex flex-col items-center justify-center flex-1 h-full min-h-[48px] py-1 text-critical hover:text-critical/80 transition-colors relative touch-manipulation cursor-pointer group"
        title={t.fieldReport.modalTitle}
        aria-label="Report Field Incident"
      >
        <div className="w-7 h-7 rounded-full bg-critical/20 border border-critical/60 flex items-center justify-center group-active:scale-95 transition-transform">
          <Icon name="add_alert" size="xs" className="text-critical animate-pulse" />
        </div>
        <span className="font-sans text-[9px] font-bold tracking-wider text-critical mt-0.5 text-center leading-none">
          {t.nav.report}
        </span>
      </button>

      {/* 5. MORE / ALL MODULES DRAWER TRIGGER */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (onOpenDrawer) onOpenDrawer();
        }}
        className="flex flex-col items-center justify-center flex-1 h-full min-h-[48px] py-1 text-outline hover:text-on-surface transition-colors relative touch-manipulation cursor-pointer group"
        title="Open All Modules"
        aria-label="Open All Modules"
      >
        <Icon name="grid_view" size="sm" className="group-hover:text-on-surface text-outline" />
        <span className="font-sans text-[9px] font-bold tracking-wider mt-0.5 text-center leading-none">
          {t.nav.more}
        </span>
      </button>
    </nav>
  );
};
