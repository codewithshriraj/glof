'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { Icon } from '@/components/ui/Icon';
import { PwaInstallPrompt } from '@/components/common/PwaInstallPrompt';
import { ConnectionStatusIndicator } from '@/components/common/ConnectionStatusIndicator';
import { LanguageSelector } from '@/components/common/LanguageSelector';
import { formatUtcTime } from '@/lib/utils/format';
import { useLanguage } from '@/i18n';

interface TopAppBarProps {
  onOpenDrawer?: () => void;
  onOpenFieldReport?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  onOpenDrawer,
  onOpenFieldReport,
}) => {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [utcTime, setUtcTime] = useState<string>('UTC 14:32');

  const navLinks = [
    { label: t.nav.command, href: '/command' },
    { label: t.nav.alerts, href: '/alerts', badge: '3', badgeCritical: true },
    { label: t.nav.dispatch, href: '/dispatch' },
    { label: t.nav.riskIntelligence, href: '/risk-intelligence' },
    { label: t.nav.map, href: '/map' },
    { label: t.nav.admin, href: '/admin' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setUtcTime(formatUtcTime(new Date()));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-3 sm:px-4 md:px-6 h-16 bg-surface-container/95 backdrop-blur-md hud-border-b">
      {/* Left: Mobile Menu Toggle & Brand Identity */}
      <div className="flex items-center gap-2.5">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenDrawer) onOpenDrawer();
          }}
          className="lg:hidden w-11 h-11 -ml-1.5 rounded-[4px] flex items-center justify-center text-on-surface hover:bg-surface-container-high focus:outline-none touch-manipulation cursor-pointer transition-colors"
          aria-label="Open Navigation Menu"
        >
          <Icon name="menu" size="md" className="text-secondary" />
        </button>

        <Link href="/command" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-[4px] bg-primary/10 border border-primary/40 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
            <Icon name="hub" size="md" className="text-primary" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-sans text-[12px] sm:text-[14px] font-bold tracking-[0.12em] text-primary uppercase leading-tight">
              {t.common.glofSentry}
            </h1>
            <span className="font-mono text-[8px] sm:text-[9px] text-outline tracking-wider hidden sm:block">
              {t.common.nationalPlatform}
            </span>
          </div>
        </Link>
      </div>

      {/* Center: Desktop Navigation Bar */}
      <nav className="hidden xl:flex items-center gap-1">
        {navLinks.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href === '/command' && pathname === '/') ||
            (link.href === '/lakes/south-lhonak' && pathname.startsWith('/lakes'));

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'font-sans text-[11px] font-bold tracking-[0.08em] px-2.5 py-1.5 rounded-[3px] transition-all duration-150 flex items-center gap-1.5',
                isActive
                  ? 'text-primary bg-surface-container-high hud-border shadow-[0_0_10px_rgba(184,196,255,0.15)]'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60'
              )}
            >
              <span>{link.label}</span>
              {link.badge && (
                <span
                  className={cn(
                    'font-mono text-[9px] px-1 py-0.2 rounded-[2px] font-bold',
                    link.badgeCritical
                      ? 'bg-critical text-background'
                      : 'bg-secondary/20 text-secondary'
                  )}
                >
                  [{link.badge}]
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Right: Actions, Language Selector, Telemetry Beacon & PWA Install */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Selector (Visible on all viewports) */}
        <LanguageSelector variant="pill" />

        {/* Field Report Button (Quick action) */}
        {onOpenFieldReport && (
          <button
            type="button"
            onClick={onOpenFieldReport}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded bg-critical/15 text-critical border border-critical/40 hover:bg-critical/25 font-mono text-[10px] font-bold transition-all touch-manipulation cursor-pointer min-h-[36px]"
            title={t.fieldReport.modalTitle}
          >
            <Icon name="add_alert" size="xs" />
            <span>{t.nav.report}</span>
          </button>
        )}

        {/* PWA Install Button */}
        <PwaInstallPrompt variant="button" />

        {/* Connection Status & UTC Clock */}
        <div className="flex items-center gap-2 bg-surface-container-lowest/80 px-2.5 py-1 rounded-[4px] hud-border">
          <ConnectionStatusIndicator compact />
          <span className="font-mono text-[11px] text-primary font-medium hidden md:inline">
            {utcTime}
          </span>
          <div className="w-2 h-2 rounded-full bg-secondary relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-secondary pulse-ping" />
          </div>
        </div>
      </div>
    </header>
  );
};
