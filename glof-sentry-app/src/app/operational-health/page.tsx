'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { SectionHeader } from '@/components/hud/SectionHeader';
import { SparklinePlaceholder } from '@/components/monitoring/SparklinePlaceholder';
import { TelemetryLog } from '@/components/monitoring/TelemetryLog';
import { Icon } from '@/components/ui/Icon';
import {
  mockSystemTelemetry,
  mockOperationalComponents,
  mockTelemetryLogs,
  mockUptimeBarHeights,
} from '@/lib/mock/seed-data';
import { useLanguage } from '@/i18n';

export default function OperationalHealthPage() {
  const { t, language } = useLanguage();

  return (
    <AppShell>
      <div className="space-y-4">
        {/* Header Section */}
        <SectionHeader
          title={t.operationalHealth.title}
          subtitle={t.operationalHealth.subtitle}
          rightElement={
            <div className="text-right">
              <div className="font-mono text-[10px] text-outline mb-1 uppercase tracking-wider font-sans">
                {t.operationalHealth.systemUptime30d}
              </div>
              <div className="font-mono text-[22px] font-bold text-secondary">
                {mockSystemTelemetry.dataPipelineUptimePct}%
              </div>
            </div>
          }
        />

        {/* Top Modules: Uptime Chart + Node Status */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Uptime Chart Module (Span 8) */}
          <div className="md:col-span-8">
            <SparklinePlaceholder
              title={t.operationalHealth.dataPipelineUptime}
              sourceTag="SOURCE: AWS-CW-1"
              heights={mockUptimeBarHeights}
              slaThresholdPct={50}
            />
          </div>

          {/* Global Node Status Module (Span 4) */}
          <div className="md:col-span-4 data-card p-4 flex flex-col justify-between rounded-[4px]">
            <div className="flex justify-between items-center hud-border-b pb-2 mb-4">
              <h3 className="font-sans text-[11px] font-bold tracking-[0.1em] text-on-surface uppercase">
                {t.operationalHealth.nodeStatus}
              </h3>
              <span className="font-mono text-[10px] text-outline">REG: US-WEST-2</span>
            </div>

            <div className="flex-grow flex flex-col justify-center items-center py-6">
              <div className="relative">
                <Icon
                  name="language"
                  size="xl"
                  className="text-secondary opacity-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 blur-md"
                />
                <Icon name="language" size="xl" className="text-secondary relative z-10" />
              </div>
              <div className="mt-6 text-center">
                <div className="font-sans text-[18px] md:text-[22px] font-bold text-secondary tracking-tight">
                  {t.operationalHealth.allSystemsNominal}
                </div>
                <div className="font-mono text-[13px] text-on-surface-variant mt-1.5 font-sans">
                  {t.operationalHealth.activeNodes}: {mockSystemTelemetry.totalActiveNodes.toLocaleString()} / {mockSystemTelemetry.totalActiveNodes.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="hud-border-t pt-2 flex justify-between text-[10px] font-mono text-outline font-sans">
              <span>{language === 'hi' ? 'विलंबता: 18ms औसत' : 'LATENCY: 18ms AVG'}</span>
              <span className="text-secondary font-bold">{t.operationalHealth.healthCheckPass}</span>
            </div>
          </div>
        </div>

        {/* Bottom Modules: System Components Table + Telemetry Logs */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* System Components Table (Span 8) */}
          <div className="md:col-span-8 data-card p-4 flex flex-col rounded-[4px] overflow-hidden">
            <div className="flex justify-between items-center hud-border-b pb-2 mb-4">
              <h3 className="font-sans text-[11px] font-bold tracking-[0.1em] text-on-surface uppercase">
                {t.operationalHealth.systemComponents}
              </h3>
              <span className="font-mono text-[10px] text-outline">{language === 'hi' ? 'रीफ्रेश: 5s' : 'REFRESH: 5s'}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-[13px] min-w-[550px]">
                <thead>
                  <tr className="hud-border-b text-[10px] text-outline uppercase font-sans font-bold tracking-wider">
                    <th className="py-2.5 px-3">{language === 'hi' ? 'घटक' : 'COMPONENT'}</th>
                    <th className="py-2.5 px-3">{t.common.status}</th>
                    <th className="py-2.5 px-3 text-right">{language === 'hi' ? 'विलंबता' : 'LATENCY'}</th>
                    <th className="py-2.5 px-3 text-right">{language === 'hi' ? 'लोड' : 'LOAD'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-high">
                  {mockOperationalComponents.map((comp) => {
                    const isDegraded = comp.status === 'DEGRADED';
                    return (
                      <tr key={comp.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="py-3 px-3 flex items-center gap-2.5 text-on-surface font-sans">
                          <Icon name={comp.icon} size="sm" className="text-primary" />
                          <span>{comp.name}</span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isDegraded ? 'bg-primary-fixed' : 'bg-secondary'
                              }`}
                            />
                            <span
                              className={`font-mono text-[10px] font-bold ${
                                isDegraded ? 'text-primary-fixed' : 'text-secondary'
                              }`}
                            >
                              {comp.status}
                            </span>
                          </div>
                        </td>
                        <td
                          className={`py-3 px-3 text-right ${
                            isDegraded ? 'text-primary-fixed font-bold' : 'text-on-surface'
                          }`}
                        >
                          {comp.latencyMs}ms
                        </td>
                        <td className="py-3 px-3 text-right text-on-surface">{comp.loadPct}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Live Telemetry Log Stream (Span 4) */}
          <div className="md:col-span-4">
            <TelemetryLog title={t.common.liveTelemetry} logs={mockTelemetryLogs} maxHeight="h-[260px]" />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
