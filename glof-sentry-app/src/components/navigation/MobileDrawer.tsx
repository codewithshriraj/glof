'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { Icon } from '@/components/ui/Icon';
import { PwaInstallPrompt } from '@/components/common/PwaInstallPrompt';
import { ConnectionStatusIndicator } from '@/components/common/ConnectionStatusIndicator';
import { LanguageSelector } from '@/components/common/LanguageSelector';
import { useLanguage } from '@/i18n';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFieldReport: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  onOpenFieldReport,
}) => {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { label: t.nav.command, href: '/command', icon: 'dashboard' },
    { label: t.nav.alerts, href: '/alerts', icon: 'crisis_alert', badge: '3', badgeCritical: true },
    { label: t.nav.dispatch, href: '/dispatch', icon: 'local_shipping' },
    { label: t.nav.map, href: '/map', icon: 'map' },
    { label: t.nav.riskIntelligence, href: '/risk-intelligence', icon: 'psychology' },
    { label: t.nav.operationalHealth, href: '/operational-health', icon: 'monitor_heart' },
    { label: t.nav.admin, href: '/admin', icon: 'admin_panel_settings' },
  ];

  // Close drawer on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Close drawer automatically whenever pathname changes
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [pathname]);

  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-[90] flex animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer touch-manipulation"
        aria-hidden="true"
      />

      {/* Drawer Body */}
      <div className="relative w-80 max-w-[85vw] bg-surface-container hud-border-r h-full p-4 flex flex-col justify-between z-10 font-mono text-[11px] select-none shadow-2xl animate-slideRight overflow-y-auto">
        <div className="space-y-4">
          {/* Header with Close */}
          <div className="flex justify-between items-center hud-border-b pb-3">
            <div className="flex items-center gap-2 text-primary font-bold">
              <Icon name="hub" size="sm" />
              <span className="font-sans text-[13px] tracking-wider uppercase">{t.common.glofSentry}</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors touch-manipulation cursor-pointer"
              aria-label="Close Drawer"
            >
              <Icon name="close" size="sm" />
            </button>
          </div>

          {/* Language Selector Component */}
          <LanguageSelector variant="expanded" />

          {/* Connection Status Indicator */}
          <div className="bg-surface-container-lowest p-2 rounded hud-border flex justify-between items-center">
            <span className="text-[10px] text-outline">{t.pwa.telemetryLink}</span>
            <ConnectionStatusIndicator compact />
          </div>

          {/* Incident Report Trigger Button */}
          <button
            type="button"
            onClick={() => {
              onClose();
              setTimeout(onOpenFieldReport, 50);
            }}
            className="w-full bg-critical/20 hover:bg-critical/30 active:scale-98 text-critical border border-critical/40 p-2.5 rounded font-sans font-bold text-[11px] flex items-center justify-center gap-2 transition-all touch-manipulation cursor-pointer"
          >
            <Icon name="add_alert" size="xs" className="animate-pulse" />
            <span>{t.fieldReport.modalTitle}</span>
          </button>

          {/* Navigation Links */}
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href === '/command' && pathname === '/') ||
                (item.href === '/lakes/south-lhonak' && pathname.startsWith('/lakes'));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center justify-between px-3 py-2.5 rounded font-sans text-[12px] font-bold transition-colors touch-manipulation cursor-pointer',
                    isActive
                      ? 'bg-secondary/15 text-secondary border-l-2 border-secondary'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      name={item.icon}
                      size="sm"
                      className={isActive ? 'text-secondary' : 'text-outline'}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={cn(
                        'font-mono text-[9px] px-1.5 py-0.2 rounded font-bold',
                        item.badgeCritical
                          ? 'bg-critical text-background'
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

        {/* Footer with PWA Install Prompt */}
        <div className="pt-4 hud-border-t space-y-2 mt-4">
          <PwaInstallPrompt />
          <div className="text-center font-mono text-[9px] text-outline">
            ISRO-NDMA CWC GLOF SENTRY
          </div>
        </div>
      </div>
    </div>
  );
};
