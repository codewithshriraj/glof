'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { SectionHeader } from '@/components/hud/SectionHeader';
import { RiskMatrixGrid } from '@/components/monitoring/RiskMatrixGrid';
import { Icon } from '@/components/ui/Icon';
import { mockGsiFactors, mockRegionalRisks } from '@/lib/mock/seed-data';
import { useLanguage } from '@/i18n';

export default function RiskIntelligencePage() {
  const { t, language } = useLanguage();

  return (
    <AppShell>
      <div className="space-y-4">
        {/* Header Section */}
        <SectionHeader
          title={t.riskIntelligence.title}
          subtitle={t.riskIntelligence.subtitle}
          rightElement={
            <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-[4px] hud-border">
              <div className="w-2 h-2 rounded-full bg-secondary pulse-ping" />
              <span className="font-mono text-[10px] text-secondary font-bold uppercase tracking-wider">
                {t.riskIntelligence.liveFeedActive}
              </span>
            </div>
          }
        />

        {/* Main Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Composite GSI Breakdown Card (Span 4) */}
          <div className="md:col-span-12 xl:col-span-4 data-card hud-border flex flex-col rounded-[4px] min-h-[340px]">
            <div className="hud-border-b p-3 flex justify-between items-center bg-surface-container-low/40">
              <span className="font-sans text-[11px] font-bold tracking-[0.1em] text-on-surface uppercase">
                {t.riskIntelligence.compositeGsi}
              </span>
              <Icon name="radar" size="xs" className="text-outline" />
            </div>

            <div className="flex-grow p-4 flex flex-col justify-between">
              <div className="space-y-4">
                {mockGsiFactors.map((factor) => {
                  const barColor =
                    factor.statusColor === 'error'
                      ? 'bg-critical'
                      : factor.statusColor === 'secondary'
                      ? 'bg-secondary'
                      : 'bg-primary';

                  const textColor =
                    factor.statusColor === 'error'
                      ? 'text-critical'
                      : factor.statusColor === 'secondary'
                      ? 'text-secondary'
                      : 'text-primary';

                  return (
                    <div key={factor.name}>
                      <div className="flex justify-between font-mono text-[11px] mb-1.5">
                        <span className="text-on-surface-variant font-sans">{factor.name}</span>
                        <span className={`font-bold ${textColor}`}>
                          {factor.score.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full bg-surface-container-high h-1.5 rounded-[1px] overflow-hidden">
                        <div
                          className={`h-full ${barColor} transition-all duration-500`}
                          style={{ width: `${factor.score * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 hud-border-t flex justify-between items-end">
                <div>
                  <span className="block font-mono text-[10px] text-outline uppercase font-sans">
                    {t.riskIntelligence.nationalAvgGsi}
                  </span>
                  <span className="font-mono text-[22px] font-bold text-on-surface">
                    0.695
                  </span>
                </div>
                <span className="font-mono text-[10px] text-outline">Model: HMA-v4</span>
              </div>
            </div>
          </div>

          {/* National Risk Matrix (Span 8) */}
          <div className="md:col-span-12 xl:col-span-8">
            <RiskMatrixGrid items={mockRegionalRisks} />
          </div>
        </div>

        {/* Regional Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {mockRegionalRisks.map((reg) => {
            const isCritical = reg.statusColor === 'critical';
            const isSecondary = reg.statusColor === 'secondary';

            return (
              <div
                key={reg.region}
                className="data-card p-3.5 flex flex-col justify-between h-28 rounded-[4px] relative overflow-hidden group hover:border-secondary/50 transition-colors"
              >
                {reg.icon && (
                  <div
                    className={`absolute top-0 right-0 w-8 h-8 flex items-center justify-center rounded-bl-[6px] ${
                      isCritical ? 'bg-critical/10 text-critical' : 'bg-secondary/10 text-secondary'
                    }`}
                  >
                    <Icon name={reg.icon} size="xs" />
                  </div>
                )}

                <span className="font-sans text-[11px] font-bold tracking-[0.1em] text-on-surface uppercase">
                  {reg.region}
                </span>

                <div className="flex items-end justify-between mt-auto">
                  <span
                    className={`font-mono text-[20px] font-bold ${
                      isCritical
                        ? 'text-critical'
                        : isSecondary
                        ? 'text-secondary'
                        : reg.statusColor === 'primary'
                        ? 'text-primary'
                        : 'text-outline'
                    }`}
                  >
                    {reg.score.toFixed(3)}
                  </span>
                  <span
                    className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-[2px] border ${
                      isCritical
                        ? 'text-critical border-critical/40 bg-critical/10'
                        : isSecondary
                        ? 'text-secondary border-secondary/40 bg-secondary/10'
                        : reg.statusColor === 'primary'
                        ? 'text-primary border-primary/40 bg-primary/10'
                        : 'text-outline border-outline/40 bg-surface-container'
                    }`}
                  >
                    {reg.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
