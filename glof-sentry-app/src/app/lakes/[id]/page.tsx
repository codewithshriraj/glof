'use client';

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { LakeMetricGrid } from '@/components/monitoring/LakeMetricGrid';
import { SarChangeDetection } from '@/components/monitoring/SarChangeDetection';
import { BathymetryViewer } from '@/components/monitoring/BathymetryViewer';
import { SensorStatusPanel } from '@/components/monitoring/SensorStatusPanel';
import { HistoricalMetricChart } from '@/components/monitoring/HistoricalMetricChart';
import { BreachSimulationPanel } from '@/components/monitoring/BreachSimulationPanel';
import { ScenarioComparisonTable } from '@/components/monitoring/ScenarioComparisonTable';
import { HistoricalBacktestTable } from '@/components/monitoring/HistoricalBacktestTable';
import { RiskContributionPanel } from '@/components/monitoring/RiskContributionPanel';
import { LakeHeaderActions } from '@/components/monitoring/LakeHeaderActions';
import { Icon } from '@/components/ui/Icon';
import { mockGlacialLakes } from '@/lib/mock/seed-data';
import { mockSouthLhonakHistory, mockSouthLhonakSensors } from '@/lib/mock/historical-data';
import { useLanguage } from '@/i18n';

interface LakeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function LakeDetailPage({ params }: LakeDetailPageProps) {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;
  const { t, language } = useLanguage();

  // Lookup lake by slug or ID
  const lake =
    mockGlacialLakes.find(
      (l) => l.slug === id || l.id === id || l.code.toLowerCase().replace(/\s+/g, '-') === id
    ) || mockGlacialLakes[0]; // fallback to South Lhonak if not found

  if (!lake) {
    notFound();
  }

  const isCritical = lake.riskLevel === 'L4';

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Navigation Breadcrumb & Quick Actions */}
        <div className="flex flex-wrap justify-between items-center gap-2 font-mono text-[11px] text-outline font-sans">
          <div className="flex items-center gap-2">
            <Link href="/command" className="hover:text-secondary transition-colors flex items-center gap-1 font-bold">
              <Icon name="arrow_back" size="xs" />
              {t.nav.command}
            </Link>
            <span>/</span>
            <span className="text-on-surface uppercase font-bold">{lake.name} ({lake.code})</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-primary bg-primary/10 px-2 py-0.5 rounded-[2px] border border-primary/30 font-bold font-sans">
              {language === 'hi' ? 'डेमो / मॉक निगरानी डेटासेट' : 'DEMO / MOCK MONITORING DATASET'}
            </span>
            <Link
              href="/map"
              className="text-secondary hover:text-white flex items-center gap-1 font-bold underline font-sans"
            >
              <Icon name="map" size="xs" />
              {t.lakeDetail.viewOnLiveMap}
            </Link>
          </div>
        </div>

        {/* Lake Identity Master Header */}
        <div className="data-card hud-border p-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 rounded-[4px]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-secondary font-bold bg-secondary/10 px-2 py-0.5 rounded-[2px] hud-border">
                {lake.code}
              </span>
              <h1 className="font-sans text-[20px] md:text-[24px] font-bold tracking-tight text-on-surface uppercase">
                {lake.name}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 font-mono text-[11px] font-sans">
              <span className="text-secondary flex items-center gap-1 font-mono">
                <Icon name="location_on" size="xs" />
                {lake.coordinates.formatted} · {lake.coordinates.elevationM}{t.lakeDetail.masl}
              </span>
              <span
                className={`flex items-center gap-1 font-bold ${
                  isCritical ? 'text-critical' : 'text-warning'
                }`}
              >
                <Icon
                  name="warning"
                  size="xs"
                  className={isCritical ? 'text-critical pulse-critical' : 'text-warning'}
                />
                {t.common.status}: {lake.riskStatus} ({lake.riskLevel})
              </span>
              <span className="text-outline">
                {t.lakeDetail.basin}: {lake.basin}
              </span>
              <span className="text-outline">
                {t.lakeDetail.lastPass}: {lake.lastSatellitePassUTC}
              </span>
              <span className="text-primary font-mono">
                {t.lakeDetail.sources}: {lake.satelliteSource} · IoT GRID
              </span>
            </div>
          </div>

          <LakeHeaderActions lake={lake} />
        </div>

        {/* Technical Metric 8-Tile Grid */}
        <LakeMetricGrid lake={lake} />

        {/* Primary Monitoring Grid: SAR Change Detection & Risk Factor Contributions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 flex flex-col gap-4">
            <SarChangeDetection
              title={t.lakeDetail.sarTitle}
              baselineDate="T-0: 2023-09-15"
              currentDate="T-1: 2023-10-04"
              sourceTag={lake.satelliteSource}
            />
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4">
            <RiskContributionPanel />
          </div>
        </div>

        {/* Sub-surface Bathymetry Visualization */}
        <BathymetryViewer
          maxDepthM={128.4}
          totalVolumeMCM={lake.estimatedVolumeMCM}
        />

        {/* Ground Sensor Telemetry Network */}
        <SensorStatusPanel sensors={mockSouthLhonakSensors} />

        {/* Multi-Temporal Cryosphere Historical Trends */}
        <HistoricalMetricChart data={mockSouthLhonakHistory} />

        {/* Hydrodynamic Dam Breach Simulation Workstation */}
        <div className="space-y-4">
          <div className="hud-border-b pb-2 flex justify-between items-center">
            <h2 className="font-sans text-[14px] font-bold text-on-surface uppercase tracking-wider flex items-center gap-2">
              <Icon name="water_damage" size="sm" className="text-critical" />
              {t.lakeDetail.breachSimulationTitle}
            </h2>
            <span className="font-mono text-[10px] text-outline font-sans">
              ISRO-CWC 2D DEFORMATION MATRIX
            </span>
          </div>

          <BreachSimulationPanel initialLakeVolumeMCM={lake.estimatedVolumeMCM} />
          <ScenarioComparisonTable />
        </div>

        {/* Historical Backtesting & Evaluation Suite */}
        <div className="space-y-4">
          <div className="hud-border-b pb-2 flex justify-between items-center">
            <h2 className="font-sans text-[14px] font-bold text-on-surface uppercase tracking-wider flex items-center gap-2">
              <Icon name="history_edu" size="sm" className="text-secondary" />
              {t.lakeDetail.historicalBacktestTitle}
            </h2>
            <span className="font-mono text-[10px] text-outline font-sans">
              USGS-CWC HISTORICAL CATALOG (1985 — 2023)
            </span>
          </div>

          <HistoricalBacktestTable />
        </div>
      </div>
    </AppShell>
  );
}
