'use client';

import React, { useState } from 'react';
import { LakeHistoricalMetricPoint } from '@/lib/types/glof';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils/cn';

interface HistoricalMetricChartProps {
  data: LakeHistoricalMetricPoint[];
  className?: string;
}

type MetricKey = 'surfaceAreaKm2' | 'freeboardM' | 'waterLevelM' | 'expansionRatePct' | 'temperatureAnomalyC' | 'seepageIndex';

interface MetricConfig {
  label: string;
  unit: string;
  color: string;
  strokeColor: string;
  threshold?: number;
  thresholdLabel?: string;
  isThresholdMax?: boolean;
}

const METRIC_CONFIGS: Record<MetricKey, MetricConfig> = {
  surfaceAreaKm2: {
    label: 'SURFACE AREA',
    unit: 'km²',
    color: 'from-secondary/25 to-transparent',
    strokeColor: '#5de6ff',
    threshold: 1.50,
    thresholdLabel: 'HIGH EXPANSION THRESHOLD (1.50 km²)',
    isThresholdMax: true,
  },
  freeboardM: {
    label: 'MORAINE FREEBOARD',
    unit: 'm',
    color: 'from-critical/25 to-transparent',
    strokeColor: '#ff6b6b',
    threshold: 5.0,
    thresholdLabel: 'CRITICAL OVERTOPPING SAFETY LIMIT (< 5.0m)',
    isThresholdMax: false,
  },
  waterLevelM: {
    label: 'WATER STAGE',
    unit: 'm a.s.l.',
    color: 'from-primary/25 to-transparent',
    strokeColor: '#b8c4ff',
    threshold: 5238.0,
    thresholdLabel: 'HIGH WATER LEVEL (5,238m)',
    isThresholdMax: true,
  },
  expansionRatePct: {
    label: 'YoY EXPANSION',
    unit: '%',
    color: 'from-warning/25 to-transparent',
    strokeColor: '#f59e0b',
    threshold: 6.0,
    thresholdLabel: 'ELEVATED EXPANSION (> 6.0%)',
    isThresholdMax: true,
  },
  temperatureAnomalyC: {
    label: 'THERMAL ANOMALY',
    unit: '°C',
    color: 'from-critical/25 to-transparent',
    strokeColor: '#ff6b6b',
    threshold: 1.2,
    thresholdLabel: 'HEAT ANOMALY WARNING (> +1.2°C)',
    isThresholdMax: true,
  },
  seepageIndex: {
    label: 'SEEPAGE INDEX',
    unit: '',
    color: 'from-secondary/25 to-transparent',
    strokeColor: '#5de6ff',
    threshold: 0.35,
    thresholdLabel: 'INTERNAL PIPING ALERT (> 0.35)',
    isThresholdMax: true,
  },
};

export const HistoricalMetricChart: React.FC<HistoricalMetricChartProps> = ({
  data,
  className,
}) => {
  const [activeMetric, setActiveMetric] = useState<MetricKey>('surfaceAreaKm2');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const config = METRIC_CONFIGS[activeMetric];
  const values = data.map((d) => d[activeMetric]);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;
  const padding = range * 0.15;
  const chartMin = minVal - padding;
  const chartMax = maxVal + padding;
  const chartRange = chartMax - chartMin;

  // Chart dimensions in SVG coordinates
  const svgWidth = 600;
  const svgHeight = 200;
  const padX = 40;
  const padY = 25;
  const plotWidth = svgWidth - padX * 2;
  const plotHeight = svgHeight - padY * 2;

  // Calculate SVG point coordinates
  const points = data.map((d, idx) => {
    const val = d[activeMetric];
    const x = padX + (idx / (data.length - 1)) * plotWidth;
    const y = padY + plotHeight - ((val - chartMin) / chartRange) * plotHeight;
    return { x, y, val, label: d.dateLabel };
  });

  const polylineStr = points.map((p) => `${p.x},${p.y}`).join(' ');
  const polygonStr = `${points[0].x},${svgHeight - padY} ${polylineStr} ${points[points.length - 1].x},${svgHeight - padY}`;

  // Threshold Y coordinate
  let thresholdY: number | null = null;
  if (config.threshold !== undefined && config.threshold >= chartMin && config.threshold <= chartMax) {
    thresholdY = padY + plotHeight - ((config.threshold - chartMin) / chartRange) * plotHeight;
  }

  const latestVal = values[values.length - 1];

  return (
    <div className={cn('data-card hud-border flex flex-col rounded-[4px]', className)}>
      {/* Chart Header & Metric Selector */}
      <div className="p-3 hud-border-b bg-surface-container-low/80 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <Icon name="monitoring" size="xs" className="text-secondary" />
          <span className="font-sans text-[11px] font-bold tracking-wider text-on-surface uppercase">
            MULTI-TEMPORAL CRYOSPHERE TRENDS (2019 — 2024)
          </span>
        </div>

        {/* Metric Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1 font-mono text-[9px]">
          {(Object.keys(METRIC_CONFIGS) as MetricKey[]).map((key) => {
            const isSelected = activeMetric === key;
            return (
              <button
                type="button"
                key={key}
                onClick={() => setActiveMetric(key)}
                className={cn(
                  'px-2 py-1 rounded-[2px] transition-colors uppercase font-bold border touch-manipulation cursor-pointer min-h-[30px]',
                  isSelected
                    ? 'bg-secondary/15 text-secondary border-secondary/50 shadow-sm'
                    : 'bg-surface-container text-outline hover:text-on-surface border-surface-high'
                )}
              >
                {METRIC_CONFIGS[key].label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chart Body */}
      <div className="p-4 flex flex-col">
        {/* Readout Bar */}
        <div className="flex justify-between items-end mb-2">
          <div>
            <span className="font-mono text-[9px] text-outline uppercase block">
              {config.label} TELEMETRY HISTORY
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-mono text-[22px] font-bold text-on-surface">
                {hoveredIndex !== null ? data[hoveredIndex][activeMetric] : latestVal}
              </span>
              <span className="font-mono text-[11px] text-secondary font-bold">
                {config.unit}
              </span>
              <span className="font-mono text-[10px] text-outline ml-2">
                [EPOCH: {hoveredIndex !== null ? data[hoveredIndex].dateLabel : '2024-NOW'}]
              </span>
            </div>
          </div>

          {config.thresholdLabel && (
            <div className="text-right hidden sm:block">
              <span className="font-mono text-[9px] text-critical font-bold flex items-center justify-end gap-1">
                <span className="w-2.5 h-0.5 bg-critical inline-block border-b border-dashed" />
                {config.thresholdLabel}
              </span>
            </div>
          )}
        </div>

        {/* SVG Canvas */}
        <div className="relative w-full h-[220px] bg-surface-container-lowest/80 hud-border rounded-[3px] overflow-hidden p-2">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={config.strokeColor} stopOpacity="0.28" />
                <stop offset="100%" stopColor={config.strokeColor} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            <line x1={padX} y1={padY} x2={svgWidth - padX} y2={padY} stroke="#232b33" strokeWidth="1" />
            <line x1={padX} y1={padY + plotHeight / 2} x2={svgWidth - padX} y2={padY + plotHeight / 2} stroke="#232b33" strokeWidth="1" strokeDasharray="3 3" />
            <line x1={padX} y1={svgHeight - padY} x2={svgWidth - padX} y2={svgHeight - padY} stroke="#232b33" strokeWidth="1" />

            {/* Safety Threshold Line */}
            {thresholdY !== null && (
              <line
                x1={padX}
                y1={thresholdY}
                x2={svgWidth - padX}
                y2={thresholdY}
                stroke="#ff6b6b"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            )}

            {/* Filled Area */}
            <polygon points={polygonStr} fill="url(#metricGradient)" />

            {/* Main Polyline Stroke */}
            <polyline
              points={polylineStr}
              fill="none"
              stroke={config.strokeColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Data Points */}
            {points.map((p, idx) => (
              <g key={idx} className="cursor-pointer">
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={hoveredIndex === idx ? 6 : 4}
                  fill="#0c141c"
                  stroke={config.strokeColor}
                  strokeWidth="2"
                />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={16}
                  fill="transparent"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onTouchStart={() => setHoveredIndex(idx)}
                  onClick={() => setHoveredIndex(idx)}
                />
              </g>
            ))}
          </svg>

          {/* Time Labels on X-Axis */}
          <div className="flex justify-between px-10 pt-1 font-mono text-[9px] text-outline">
            {data.map((d, i) => (
              <span
                key={i}
                className={cn(
                  hoveredIndex === i ? 'text-secondary font-bold' : 'text-outline'
                )}
              >
                {d.dateLabel}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
