'use client';

import React, { useState } from 'react';
import { SatellitePassInfo } from '@/lib/types/glof';
import { mockCloudObscurationSectors, mockSpectralIndices } from '@/lib/mock/satellite-data';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

interface SatelliteIntelligenceViewProps {
  satellites: SatellitePassInfo[];
  onTriggerReprocess: (satelliteId: string) => void;
  className?: string;
}

export const SatelliteIntelligenceView: React.FC<SatelliteIntelligenceViewProps> = ({
  satellites,
  onTriggerReprocess,
  className,
}) => {
  const [selectedSatelliteId, setSelectedSatelliteId] = useState<string>(satellites[0]?.id || '');
  const selectedSat = satellites.find((s) => s.id === selectedSatelliteId) || satellites[0];

  return (
    <div className={cn('space-y-4', className)}>
      {/* Top Constellation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-[11px]">
        {satellites.map((sat) => (
          <div
            key={sat.id}
            onClick={() => setSelectedSatelliteId(sat.id)}
            className={cn(
              'data-card hud-border p-3 rounded-[4px] flex flex-col justify-between cursor-pointer transition-all hover:bg-surface-container-high/70',
              selectedSatelliteId === sat.id ? 'border-primary bg-surface-container-high ring-1 ring-primary/40' : ''
            )}
          >
            <div>
              <div className="flex justify-between items-center hud-border-b pb-1.5 mb-2">
                <span className="font-sans font-bold text-on-surface text-[12px] uppercase">
                  {sat.name}
                </span>
                <Icon name="satellite_alt" size="xs" className="text-primary" />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px]">
                  <span className="text-outline">STATUS</span>
                  <span className="font-bold text-advisory">{sat.status}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-outline">NEXT PASS</span>
                  <span className="font-bold text-primary">{sat.tMinus}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-outline">RESOLUTION</span>
                  <span className="font-bold text-secondary">{sat.resolutionM}m GSD</span>
                </div>
              </div>
            </div>

            {/* Pipeline Stage Bar */}
            <div className="mt-3 pt-2 hud-border-t">
              <div className="flex justify-between text-[9px] text-outline mb-1">
                <span className="truncate">{sat.pipelineStage}</span>
                <span>{sat.pipelineProgressPct}%</span>
              </div>
              <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-300"
                  style={{ width: `${sat.pipelineProgressPct}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Analysis Grid: SAR vs Optical Fusion (6 cols) + Cloud Obscuration & Spectral Indices (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: SAR vs Optical Agreement & InSAR Interferometry */}
        <div className="lg:col-span-6 data-card hud-border rounded-[4px] p-4 flex flex-col gap-4 font-mono text-[11px]">
          <div className="flex justify-between items-center hud-border-b pb-2">
            <div className="flex items-center gap-2">
              <Icon name="compare" size="xs" className="text-secondary" />
              <span className="font-sans text-[12px] font-bold text-on-surface uppercase">
                SAR-VS-OPTICAL AGREEMENT & SENSOR FUSION
              </span>
            </div>
            <span className="text-secondary font-bold text-[10px]">CORRELATION: 94.2%</span>
          </div>

          {/* Big Metric Box */}
          <div className="grid grid-cols-2 gap-3 bg-surface-container-low p-3 hud-border rounded-[3px]">
            <div className="border-r border-surface-high pr-3">
              <span className="text-outline text-[9px] block mb-1">FUSION CONFIDENCE SCORE</span>
              <div className="font-sans text-[26px] font-bold text-secondary">94.2%</div>
              <span className="text-[9px] text-advisory font-bold mt-1 block">HIGH CONVERGENCE (+1.2%)</span>
            </div>
            <div className="pl-1 space-y-2">
              <div>
                <div className="flex justify-between text-[9px] text-outline mb-0.5">
                  <span>NORTH SIKKIM (SECTOR 1)</span>
                  <span className="text-secondary font-bold">98.2%</span>
                </div>
                <div className="w-full bg-surface-container-highest h-1 rounded-full">
                  <div className="bg-secondary h-full w-[98.2%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[9px] text-outline mb-0.5">
                  <span>HIMACHAL (SECTOR 2)</span>
                  <span className="text-primary font-bold">91.8%</span>
                </div>
                <div className="w-full bg-surface-container-highest h-1 rounded-full">
                  <div className="bg-primary h-full w-[91.8%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Selected Satellite Dossier */}
          <div className="bg-surface-container-lowest p-3 hud-border rounded-[3px] space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-sans font-bold text-on-surface text-[12px]">{selectedSat.name}</span>
              <span className="text-primary text-[10px] font-bold">{selectedSat.sensorType}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <span className="text-outline block">ORBIT:</span>
                <span className="text-on-surface-variant">{selectedSat.orbitType}</span>
              </div>
              <div>
                <span className="text-outline block">SWATH WIDTH:</span>
                <span className="text-on-surface-variant">{selectedSat.swathWidthKm} km Swath</span>
              </div>
              <div className="col-span-2">
                <span className="text-outline block">SPECTRAL / POLARIMETRIC BANDS:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedSat.spectralBands.map((b) => (
                    <span key={b} className="bg-surface-container px-1.5 py-0.5 rounded-[2px] border border-surface-high text-[9px] text-secondary">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 hud-border-t">
            <span className="text-[9px] text-outline">ORBITAL PASS: {selectedSat.nextPassUTC}</span>
            <Button onClick={() => onTriggerReprocess(selectedSat.id)} variant="outline" size="sm" className="font-bold">
              <Icon name="refresh" size="xs" />
              REPROCESS L2A PASS
            </Button>
          </div>
        </div>

        {/* Right Column: Regional Cloud Obscuration Matrix & Multi-Spectral Indices */}
        <div className="lg:col-span-6 data-card hud-border rounded-[4px] p-4 flex flex-col gap-4 font-mono text-[11px]">
          <div className="flex justify-between items-center hud-border-b pb-2">
            <div className="flex items-center gap-2">
              <Icon name="cloud" size="xs" className="text-warning" />
              <span className="font-sans text-[12px] font-bold text-on-surface uppercase">
                REGIONAL CLOUD COVERAGE & OPTICAL OBSCURATION
              </span>
            </div>
            <span className="text-warning font-bold text-[10px]">REAL-TIME METEOROLOGY</span>
          </div>

          {/* Sector Cloud Matrix */}
          <div className="grid grid-cols-2 gap-2">
            {mockCloudObscurationSectors.map((sec) => (
              <div key={sec.sector} className="bg-surface-container-low p-2.5 hud-border rounded-[2px] flex flex-col justify-between">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] text-outline font-bold truncate max-w-[130px]">{sec.sector}</span>
                  <span
                    className={cn(
                      'font-bold text-[12px]',
                      sec.obscurationPct > 70 ? 'text-critical' : sec.obscurationPct > 30 ? 'text-primary' : 'text-secondary'
                    )}
                  >
                    {sec.obscurationPct}%
                  </span>
                </div>
                <div className="text-[9px] text-on-surface-variant">{sec.note}</div>
              </div>
            ))}
          </div>

          {/* Multi-Spectral Glaciological Indices */}
          <div className="space-y-2">
            <span className="font-sans text-[10px] font-bold text-outline uppercase tracking-wider block">
              MULTI-SPECTRAL GLACIOLOGICAL INDICES (SENTINEL-2 / LANDSAT-9)
            </span>

            <div className="divide-y divide-surface-high bg-surface-container-lowest hud-border rounded-[3px]">
              {mockSpectralIndices.map((idx) => (
                <div key={idx.index} className="p-2 flex justify-between items-center text-[10px]">
                  <div>
                    <span className="font-bold text-on-surface block">{idx.index}</span>
                    <span className="text-[9px] text-outline">{idx.interpretation}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-secondary text-[12px]">{idx.value}</span>
                    <span className="text-[9px] text-outline block">BASE: {idx.baseline}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
