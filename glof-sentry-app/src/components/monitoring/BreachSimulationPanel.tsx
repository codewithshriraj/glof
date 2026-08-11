'use client';

import React, { useState, useMemo } from 'react';
import { mockBreachScenarios, calculateBreachHydrograph, mockDownstreamImpactNodes } from '@/lib/mock/simulation-data';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

interface BreachSimulationPanelProps {
  initialLakeVolumeMCM?: number;
  className?: string;
}

export const BreachSimulationPanel: React.FC<BreachSimulationPanelProps> = ({
  initialLakeVolumeMCM = 68.4,
  className,
}) => {
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<'baseline' | 'moderate' | 'high' | 'extreme'>('high');
  const [breachWidthM, setBreachWidthM] = useState<number>(45);
  const [breachDepthM, setBreachDepthM] = useState<number>(12);
  const durationMin = 180;
  const [timelineScrubMin, setTimelineScrubMin] = useState<number>(38);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  React.useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTimelineScrubMin((prev) => {
        if (prev >= durationMin) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 2;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [isPlaying, durationMin]);

  // Handle Preset Selection
  const handleSelectPreset = (key: 'baseline' | 'moderate' | 'high' | 'extreme') => {
    setSelectedScenarioKey(key);
    const preset = mockBreachScenarios[key];
    setBreachWidthM(preset.breachWidthM);
    setBreachDepthM(preset.breachDepthM);
    setTimelineScrubMin(preset.timeToPeakMin);
  };

  // Deterministically Calculate Simulation Outputs
  const simResult = useMemo(() => {
    return calculateBreachHydrograph(breachWidthM, breachDepthM, initialLakeVolumeMCM, durationMin);
  }, [breachWidthM, breachDepthM, initialLakeVolumeMCM, durationMin]);

  // SVG Hydrograph dimensions
  const svgWidth = 540;
  const svgHeight = 160;
  const padX = 40;
  const padY = 20;
  const plotW = svgWidth - padX * 2;
  const plotH = svgHeight - padY * 2;

  const maxQ = Math.max(...simResult.points.map((p) => p.dischargeM3s), 1000);
  const hydroPoints = simResult.points.map((p) => {
    const x = padX + (p.timeMin / durationMin) * plotW;
    const y = padY + plotH - (p.dischargeM3s / maxQ) * plotH;
    return { x, y, ...p };
  });

  const polylineStr = hydroPoints.map((p) => `${p.x},${p.y}`).join(' ');
  const polygonStr = `${hydroPoints[0].x},${svgHeight - padY} ${polylineStr} ${hydroPoints[hydroPoints.length - 1].x},${svgHeight - padY}`;

  // Current scrubbed point
  const scrubbedX = padX + (timelineScrubMin / durationMin) * plotW;
  const currentScrubbedDischarge = Math.round(
    simResult.points.find((p) => Math.abs(p.timeMin - timelineScrubMin) <= 10)?.dischargeM3s || simResult.peakDischargeM3s
  );

  return (
    <div className={cn('data-card hud-border flex flex-col rounded-[4px]', className)}>
      {/* Header with Demo Disclaimer */}
      <div className="p-3 hud-border-b bg-surface-container-low/90 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <Icon name="water_damage" size="xs" className="text-critical pulse-critical" />
          <span className="font-sans text-[11px] font-bold tracking-wider text-on-surface uppercase">
            HYDRODYNAMIC DAM BREACH SIMULATION // MODEL v4.2
          </span>
          <span className="font-mono text-[9px] text-critical bg-critical/10 px-1.5 py-0.5 rounded-[2px] border border-critical/40 font-bold">
            TIER: {breachWidthM > 35 ? 'L4 CRITICAL' : breachWidthM > 15 ? 'L2 WATCH' : 'L1 NOMINAL'}
          </span>
        </div>

        <div className="font-mono text-[9px] text-outline flex items-center gap-2">
          <span>NDMA-CWC HYDRAULIC SOLVER</span>
          <span className="text-secondary font-bold bg-secondary/10 px-1.5 py-0.5 rounded-[2px] border border-secondary/30">
            DEMO SIMULATION
          </span>
        </div>
      </div>

      {/* Preset Scenario Selectors */}
      <div className="p-3 bg-surface-container-lowest/80 hud-border-b flex flex-wrap items-center justify-between gap-2">
        <span className="font-sans text-[10px] font-bold text-outline uppercase tracking-wider">
          SCENARIO PRESETS:
        </span>
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
          {(['baseline', 'moderate', 'high', 'extreme'] as const).map((key) => {
            const isSelected = selectedScenarioKey === key;
            return (
              <button
                type="button"
                key={key}
                onClick={() => handleSelectPreset(key)}
                className={cn(
                  'px-2.5 py-1 rounded-[2px] font-bold uppercase transition-colors border touch-manipulation cursor-pointer min-h-[32px]',
                  isSelected
                    ? key === 'extreme' || key === 'high'
                      ? 'bg-critical/20 text-critical border-critical/50 shadow-sm'
                      : 'bg-secondary/20 text-secondary border-secondary/50 shadow-sm'
                    : 'bg-surface-container text-outline hover:text-on-surface border-surface-high'
                )}
              >
                {mockBreachScenarios[key].name.split('//')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Body Grid */}
      <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Interactive Parameters & Hydrograph (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Sliders Box */}
          <div className="bg-surface-container-high/60 hud-border p-3 rounded-[3px] flex flex-col gap-3 font-mono text-[11px]">
            {/* Breach Width Slider */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-sans text-on-surface font-bold">MORAINE BREACH WIDTH</span>
                <span className="text-secondary font-bold">{breachWidthM} m</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="1"
                value={breachWidthM}
                onChange={(e) => setBreachWidthM(Number(e.target.value))}
                className="range-slider"
              />
              <div className="flex justify-between text-[8px] text-outline">
                <span>5m (Piping)</span>
                <span>25m (Partial)</span>
                <span>45m (Full)</span>
                <span>60m (Catastrophic)</span>
              </div>
            </div>

            {/* Breach Depth Slider */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-sans text-on-surface font-bold">BREACH EROSION DEPTH</span>
                <span className="text-secondary font-bold">{breachDepthM} m</span>
              </div>
              <input
                type="range"
                min="2"
                max="20"
                step="0.5"
                value={breachDepthM}
                onChange={(e) => setBreachDepthM(Number(e.target.value))}
                className="range-slider"
              />
              <div className="flex justify-between text-[8px] text-outline">
                <span>2m (Crest)</span>
                <span>10m (Intermediate)</span>
                <span>20m (Full Incision)</span>
              </div>
            </div>
          </div>

          {/* SVG Outflow Hydrograph Curve */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center font-mono text-[10px]">
              <span className="text-outline uppercase">BREACH OUTFLOW HYDROGRAPH [Q(t)]</span>
              <span className="text-critical font-bold">
                PEAK DISCHARGE: {simResult.peakDischargeM3s.toLocaleString()} m³/s @ T+{simResult.timeToPeakMin}m
              </span>
            </div>

            <div className="relative w-full h-[180px] bg-surface-container-lowest hud-border rounded-[3px] overflow-hidden p-2">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-full"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="hydroGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff6b6b" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#ff6b6b" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1={padX} y1={padY} x2={svgWidth - padX} y2={padY} stroke="#232b33" strokeWidth="1" />
                <line x1={padX} y1={padY + plotH / 2} x2={svgWidth - padX} y2={padY + plotH / 2} stroke="#232b33" strokeWidth="1" strokeDasharray="2 2" />
                <line x1={padX} y1={svgHeight - padY} x2={svgWidth - padX} y2={svgHeight - padY} stroke="#232b33" strokeWidth="1" />

                {/* Critical Threshold line */}
                <line
                  x1={padX}
                  y1={padY + plotH * 0.35}
                  x2={svgWidth - padX}
                  y2={padY + plotH * 0.35}
                  stroke="#ff6b6b"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />

                {/* Hydrograph Area & Stroke */}
                <polygon points={polygonStr} fill="url(#hydroGrad)" />
                <polyline
                  points={polylineStr}
                  fill="none"
                  stroke="#ff6b6b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Peak Discharge Marker */}
                {hydroPoints.length > 0 && (
                  <circle
                    cx={padX + (simResult.timeToPeakMin / durationMin) * plotW}
                    cy={padY + plotH - (simResult.peakDischargeM3s / maxQ) * plotH}
                    r="5"
                    fill="#ff6b6b"
                    className="pulse-ping"
                  />
                )}

                {/* Timeline scrubber vertical line */}
                <line
                  x1={scrubbedX}
                  y1={padY}
                  x2={scrubbedX}
                  y2={svgHeight - padY}
                  stroke="#5de6ff"
                  strokeWidth="1.5"
                />
              </svg>

              {/* Time Scrubber Slider on Hydrograph */}
              <div className="absolute bottom-1 left-10 right-10 flex justify-between font-mono text-[8px] text-outline">
                <span>T+0m</span>
                <span>T+60m</span>
                <span>T+120m</span>
                <span>T+180m</span>
              </div>
            </div>

            {/* Scrubber Control Bar */}
            <div className="flex items-center gap-3 bg-surface-container-high/60 p-2 hud-border rounded-[3px]">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 flex items-center justify-center hud-border bg-surface-container hover:bg-surface-container-highest text-secondary rounded-[2px] touch-manipulation cursor-pointer"
                aria-label={isPlaying ? 'Pause Simulation' : 'Play Simulation'}
              >
                <Icon name={isPlaying ? 'pause' : 'play_arrow'} size="xs" />
              </button>
              <input
                type="range"
                min="0"
                max={durationMin}
                value={timelineScrubMin}
                onChange={(e) => setTimelineScrubMin(Number(e.target.value))}
                className="range-slider flex-grow"
              />
              <span className="font-mono text-[10px] text-secondary font-bold whitespace-nowrap min-w-[70px] text-right">
                T+{timelineScrubMin} min
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Calculated Outputs & Downstream Propagation (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {/* Key Metric Scorecard (2x2) */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-surface-container-high/80 hud-border p-2.5 rounded-[3px]">
              <span className="font-sans text-[9px] font-bold text-outline uppercase block">
                PEAK DISCHARGE
              </span>
              <div className="font-mono text-[18px] font-bold text-critical">
                {simResult.peakDischargeM3s.toLocaleString()} <span className="text-[9px] text-outline">m³/s</span>
              </div>
              <span className="font-mono text-[8px] text-outline">AT DAM TOE</span>
            </div>

            <div className="bg-surface-container-high/80 hud-border p-2.5 rounded-[3px]">
              <span className="font-sans text-[9px] font-bold text-outline uppercase block">
                PEAK FLOOD DEPTH
              </span>
              <div className="font-mono text-[18px] font-bold text-critical">
                {simResult.maxDepthM} <span className="text-[9px] text-outline">m</span>
              </div>
              <span className="font-mono text-[8px] text-outline">IN GORGE SECTION</span>
            </div>

            <div className="bg-surface-container-high/80 hud-border p-2.5 rounded-[3px]">
              <span className="font-sans text-[9px] font-bold text-outline uppercase block">
                WAVE FLOW VELOCITY
              </span>
              <div className="font-mono text-[18px] font-bold text-warning">
                {simResult.flowVelocityMs} <span className="text-[9px] text-outline">m/s</span>
              </div>
              <span className="font-mono text-[8px] text-outline">~{(simResult.flowVelocityMs * 3.6).toFixed(0)} km/h</span>
            </div>

            <div className="bg-surface-container-high/80 hud-border p-2.5 rounded-[3px]">
              <span className="font-sans text-[9px] font-bold text-outline uppercase block">
                INUNDATION EXTENT
              </span>
              <div className="font-mono text-[18px] font-bold text-secondary">
                {simResult.inundationAreaKm2} <span className="text-[9px] text-outline">km²</span>
              </div>
              <span className="font-mono text-[8px] text-outline">VALLEY CORRIDOR</span>
            </div>
          </div>

          {/* Downstream Propagation & Impact Sequence */}
          <div className="bg-surface-container-high/80 hud-border p-3 rounded-[3px] flex flex-col flex-grow">
            <span className="font-sans text-[10px] font-bold text-outline uppercase tracking-wider mb-2">
              DOWNSTREAM PROPAGATION TIMELINE
            </span>

            <div className="flex flex-col gap-2 font-mono text-[10px]">
              {mockDownstreamImpactNodes.slice(0, 4).map((node) => (
                <div
                  key={node.id}
                  className="bg-surface-container-lowest/80 p-2 hud-border rounded-[2px] flex justify-between items-center"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full',
                        node.severity === 'CRITICAL'
                          ? 'bg-critical pulse-ping'
                          : 'bg-warning'
                      )}
                    />
                    <div>
                      <div className="font-sans font-bold text-on-surface text-[10px]">{node.name}</div>
                      <div className="text-[8px] text-outline">{node.chainageKm} · Lead Time: {node.arrivalLeadTime}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-critical">{node.peakDischargeM3s}</div>
                    <div className="text-[8px] text-secondary">Depth: {node.estimatedFloodDepth}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="px-4 py-2.5 hud-border-t bg-surface-container-lowest text-[10px] font-mono text-outline flex justify-between items-center">
        <span>* Synthetic scenario for interface and workflow demonstration. Not an operational forecast.</span>
        <span className="text-secondary font-bold">MODEL ACCURACY: ±12% HYDRAULIC MARGIN</span>
      </div>
    </div>
  );
};
