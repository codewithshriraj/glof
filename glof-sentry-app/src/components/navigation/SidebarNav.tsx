'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { Icon } from '@/components/ui/Icon';
import { PwaInstallPrompt } from '@/components/common/PwaInstallPrompt';
import { ConnectionStatusIndicator } from '@/components/common/ConnectionStatusIndicator';
import { useLanguage } from '@/i18n';

interface SidebarNavProps {
  onOpenFieldReport: () => void;
  className?: string;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ onOpenFieldReport, className }) => {
  const pathname = usePathname();
  const { t } = useLanguage();

  const mainNavItems = [
    { label: t.nav.command, href: '/command', icon: 'dashboard' },
    { label: t.nav.alerts, href: '/alerts', icon: 'crisis_alert', badge: '3', badgeCritical: true },
    { label: t.nav.dispatch, href: '/dispatch', icon: 'local_shipping' },
    { label: t.nav.map, href: '/map', icon: 'map' },
    { label: t.nav.riskIntelligence, href: '/risk-intelligence', icon: 'psychology' },
    { label: t.nav.operationalHealth, href: '/operational-health', icon: 'monitor_heart' },
    { label: t.nav.admin, href: '/admin', icon: 'admin_panel_settings' },
  ];

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col justify-between w-64 xl:w-72 bg-surface-container/95 hud-border-r h-[calc(100vh-64px)] sticky top-16 z-30 font-mono text-[11px] p-3 select-none overflow-y-auto',
        className
      )}
    >
      <div className="space-y-4">
        {/* Connection Status & Live Node Indicator */}
        <div className="bg-surface-container-lowest p-2.5 rounded-[4px] hud-border flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Icon name="dns" size="xs" className="text-secondary" />
            <span className="text-[10px] text-outline">NODE: SEOC-04</span>
          </div>
          <ConnectionStatusIndicator compact />
        </div>

        {/* Quick Field Incident Trigger Button */}
        <button
          type="button"
          onClick={onOpenFieldReport}
          className="w-full bg-critical/15 hover:bg-critical/25 text-critical border border-critical/40 p-2.5 rounded-[4px] font-sans font-bold text-[11px] flex items-center justify-center gap-2 transition-all shadow-[0_0_10px_rgba(255,107,107,0.15)] touch-manipulation cursor-pointer"
        >
          <Icon name="add_alert" size="xs" className="animate-pulse" />
          <span>{t.fieldReport.modalTitle}</span>
        </button>

        {/* Navigation Links Grouped by Operational Role */}
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === '/command' && pathname === '/') ||
              (item.href === '/lakes/south-lhonak' && pathname.startsWith('/lakes'));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-3 py-2 rounded-[3px] transition-all font-sans text-[11px] font-bold tracking-wide',
                  isActive
                    ? 'bg-secondary/15 text-secondary border-l-2 border-secondary shadow-[0_0_12px_rgba(93,230,255,0.1)]'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    name={item.icon}
                    size="xs"
                    className={isActive ? 'text-secondary' : 'text-outline'}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={cn(
                      'font-mono text-[9px] px-1.5 py-0.2 rounded-[2px] font-bold',
                      item.badgeCritical
                        ? 'bg-critical text-background animate-pulse'
                        : 'bg-secondary/20 text-secondary'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom PWA Install & System Metadata */}
      <div className="space-y-3 pt-3 hud-border-t">
        <PwaInstallPrompt variant="sidebar" />

        <div className="text-[9px] text-outline text-center">
          GLOF SENTRY // ISRO-CWC-NDMA
        </div>
      </div>
    </aside>
  );
};
