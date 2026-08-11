'use client';

import React from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { MapPlaceholder } from '@/components/monitoring/MapPlaceholder';
import { Icon } from '@/components/ui/Icon';
import { mockSystemTelemetry, mockRecentActivity } from '@/lib/mock/seed-data';
import { useLanguage } from '@/i18n';

export default function CommandCenterPage() {
  const { t, language } = useLanguage();

  return (
    <AppShell>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-1 relative z-10">
        {/* Hero: Mini Live Risk Map (Span 8) */}
        <div className="md:col-span-12 xl:col-span-8">
          <MapPlaceholder />
        </div>

        {/* KPI Grid Stack (Span 4) */}
        <div className="md:col-span-12 xl:col-span-4 flex flex-col gap-1">
          {/* KPI 1: National GLOF Risk Index */}
          <div className="data-card hud-border p-4 flex flex-col justify-between h-full min-h-[96px] rounded-[4px]">
            <div className="flex justify-between items-start hud-border-b pb-2 mb-2">
              <h3 className="font-sans text-[11px] font-bold tracking-[0.1em] text-on-surface-variant uppercase">
                {t.command.nationalRiskSummary}
              </h3>
              <Icon name="trending_up" size="xs" className="text-tertiary-container" />
            </div>
            <div className="flex items-end justify-between">
              <div className="font-mono text-[28px] font-bold text-warning leading-none">
                {mockSystemTelemetry.nationalRiskIndex.toFixed(3)}
              </div>
              <div className="font-mono text-[10px] text-tertiary-container text-right leading-tight">
                <div className="text-warning font-bold">{t.command.amberStatus}</div>
                <div>CWC-NDMA Integrated</div>
              </div>
            </div>
          </div>

          {/* KPI 2: Active Alert Sites */}
          <div className="data-card hud-border p-4 flex flex-col justify-between h-full min-h-[96px] bg-critical/5 border-critical/30 rounded-[4px]">
            <div className="flex justify-between items-start hud-border-b pb-2 mb-2 border-critical/30">
              <h3 className="font-sans text-[11px] font-bold tracking-[0.1em] text-critical uppercase">
                {t.command.criticalBreachRisk}
              </h3>
              <Icon name="warning" size="xs" className="text-critical pulse-ping" />
            </div>
            <div className="flex items-end justify-between">
              <div className="font-mono text-[28px] font-bold text-critical leading-none">
                0{mockSystemTelemetry.activeAlertSitesCount}
              </div>
              <div className="font-mono text-[10px] text-critical/80 text-right leading-tight">
                <div className="font-bold">{t.alerts.severityCritical}</div>
                <div>14:28 UTC</div>
              </div>
            </div>
          </div>

          {/* KPI 3: Lakes Under High Watch */}
          <div className="data-card hud-border p-4 flex flex-col justify-between h-full min-h-[96px] rounded-[4px]">
            <div className="flex justify-between items-start hud-border-b pb-2 mb-2">
              <h3 className="font-sans text-[11px] font-bold tracking-[0.1em] text-on-surface-variant uppercase">
                {t.command.filterWatch}
              </h3>
              <Icon name="visibility" size="xs" className="text-secondary" />
            </div>
            <div className="flex items-end justify-between">
              <div className="font-mono text-[28px] font-bold text-secondary leading-none">
                {mockSystemTelemetry.lakesUnderWatchCount}
              </div>
              <div className="font-mono text-[10px] text-tertiary-container text-right leading-tight">
                <div>Sentinel-2 L2A</div>
              </div>
            </div>
          </div>

          {/* KPI 4: Avg Lake Expansion */}
          <div className="data-card hud-border p-4 flex flex-col justify-between h-full min-h-[96px] rounded-[4px]">
            <div className="flex justify-between items-start hud-border-b pb-2 mb-2">
              <h3 className="font-sans text-[11px] font-bold tracking-[0.1em] text-on-surface-variant uppercase">
                {t.command.avgLakeExpansion}
              </h3>
              <Icon name="straighten" size="xs" className="text-tertiary-container" />
            </div>
            <div className="flex items-end justify-between">
              <div className="font-mono text-[28px] font-bold text-primary leading-none">
                +{mockSystemTelemetry.avgLakeExpansionPct}%
              </div>
              <div className="font-mono text-[10px] text-tertiary-container text-right leading-tight">
                <div>±0.2% variance</div>
                <div>Landsat-9 15d</div>
              </div>
            </div>
          </div>
        </div>

        {/* System Status & Activity Feed Bottom Row */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-1 mt-1">
          {/* Recent Activity Feed */}
          <div className="data-card hud-border p-4 h-[200px] flex flex-col rounded-[4px]">
            <h3 className="font-sans text-[11px] font-bold tracking-[0.1em] text-on-surface hud-border-b pb-2 mb-3 uppercase">
              {t.command.recentActivityFeed}
            </h3>
            <div className="flex-grow overflow-hidden flex flex-col gap-2 font-mono text-[12px] text-on-surface-variant">
              {mockRecentActivity.map((act, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2 pl-2 py-1 ${
                    act.type === 'critical'
                      ? 'border-l-2 border-critical bg-surface-container-low'
                      : act.type === 'secondary'
                      ? 'border-l-2 border-secondary'
                      : 'border-l-2 border-outline-variant'
                  }`}
                >
                  <span
                    className={`font-mono text-[10px] shrink-0 mt-0.5 ${
                      act.type === 'critical'
                        ? 'text-critical font-bold'
                        : act.type === 'secondary'
                        ? 'text-secondary'
                        : 'text-outline'
                    }`}
                  >
                    [{act.time}]
                  </span>
                  <span className={act.type === 'critical' ? 'text-on-surface' : 'text-outline'}>
                    {act.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* System Telemetry */}
          <div className="data-card hud-border p-4 h-[200px] flex flex-col rounded-[4px]">
            <div className="flex justify-between items-center hud-border-b pb-2 mb-3">
              <h3 className="font-sans text-[11px] font-bold tracking-[0.1em] text-on-surface uppercase">
                {t.common.liveTelemetry}
              </h3>
              <Link
                href="/operational-health"
                className="font-mono text-[10px] text-secondary hover:underline flex items-center gap-1"
              >
                {t.common.viewDetails} →
              </Link>
            </div>
            <div className="flex-grow flex flex-col justify-around">
              <div className="flex justify-between items-center hud-border-b pb-2 border-outline-variant/30">
                <div className="flex items-center gap-2">
                  <Icon name="satellite_alt" size="xs" className="text-secondary" />
                  <span className="font-mono text-[13px] text-on-surface">{t.admin.satelliteIntegrations}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  <span className="font-mono text-[10px] text-secondary font-bold">
                    {mockSystemTelemetry.satelliteArrayStatus}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center hud-border-b pb-2 border-outline-variant/30">
                <div className="flex items-center gap-2">
                  <Icon name="sensors" size="xs" className="text-secondary" />
                  <span className="font-mono text-[13px] text-on-surface">{t.operationalHealth.sensorFleetStatus}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  <span className="font-mono text-[10px] text-secondary font-bold">
                    {mockSystemTelemetry.sensorGridStatus}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Icon name="memory" size="xs" className="text-secondary" />
                  <span className="font-mono text-[13px] text-on-surface">Data Pipeline</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-primary font-bold">
                    {mockSystemTelemetry.dataPipelineUptimePct}% UPTIME
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
