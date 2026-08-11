import React from 'react';
import { mockBathymetryBands } from '@/lib/mock/historical-data';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils/cn';

interface BathymetryViewerProps {
  maxDepthM?: number;
  totalVolumeMCM?: number;
  className?: string;
}

export const BathymetryViewer: React.FC<BathymetryViewerProps> = ({
  maxDepthM = 128.4,
  totalVolumeMCM = 68.4,
  className,
}) => {
  return (
    <div className={cn('data-card hud-border flex flex-col rounded-[4px]', className)}>
      {/* Header */}
      <div className="p-3 hud-border-b bg-surface-container-low/80 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <Icon name="layers" size="xs" className="text-secondary" />
          <span className="font-sans text-[11px] font-bold tracking-wider text-on-surface uppercase">
            BATHYMETRIC CONTOURS & SUB-SURFACE MORPHOLOGY
          </span>
        </div>
        <div className="font-mono text-[9px] text-outline flex items-center gap-2">
          <span>ACOUSTIC SOUNDING GRID</span>
          <span className="text-primary font-bold bg-primary/10 px-1.5 py-0.5 rounded-[2px] border border-primary/30">
            DEMO BATHYMETRY
          </span>
        </div>
      </div>

      {/* Main Content: SVG Cross Section & Iso-Depth Profile */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left: Cross-Sectional Depth Profile SVG (8 cols) */}
        <div className="md:col-span-8 flex flex-col gap-2">
          <div className="flex justify-between items-center font-mono text-[10px] text-outline">
            <span>NW LATERAL MORAINE</span>
            <span className="text-secondary font-bold">LAKE WATER SURFACE: 5,240.4 m a.s.l.</span>
            <span>SE GLACIER TERMINUS</span>
          </div>

          <div className="relative w-full h-[180px] bg-surface-container-lowest hud-border rounded-[3px] overflow-hidden">
            {/* Topographic & Subaquatic Cross Section */}
            <svg
              viewBox="0 0 500 160"
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="waterDepthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22b8cf" stopOpacity="0.6" />
                  <stop offset="40%" stopColor="#4c6ef5" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#0c141c" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="bedrockGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#232b33" stopOpacity="1" />
                  <stop offset="100%" stopColor="#141c24" stopOpacity="1" />
                </linearGradient>
              </defs>

              {/* Water Surface Line */}
              <line x1="30" y1="30" x2="470" y2="30" stroke="#5de6ff" strokeWidth="2" strokeDasharray="6 3" />

              {/* Bathymetric Lake Basin Fill */}
              <path
                d="M 30 30 Q 80 50 140 90 T 260 140 T 360 110 Q 420 60 470 30 Z"
                fill="url(#waterDepthGrad)"
              />

              {/* Surrounding Bedrock & Moraine Profile */}
              <path
                d="M 0 10 L 30 30 Q 80 50 140 90 T 260 140 T 360 110 Q 420 60 470 30 L 500 0 L 500 160 L 0 160 Z"
                fill="url(#bedrockGrad)"
                stroke="#444654"
                strokeWidth="1.5"
              />

              {/* Depth Iso-lines */}
              <path d="M 50 55 Q 150 75 250 85 T 450 55" fill="none" stroke="#22b8cf" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
              <path d="M 90 90 Q 180 110 260 115 T 410 90" fill="none" stroke="#4c6ef5" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

              {/* Sounder Marker at Max Depth Point */}
              <circle cx="260" cy="140" r="4" fill="#ff6b6b" className="pulse-ping" />
              <circle cx="260" cy="140" r="2" fill="#fff" />
              <line x1="260" y1="30" x2="260" y2="136" stroke="#ff6b6b" strokeWidth="1" strokeDasharray="2 2" />

              {/* Sounder Beacon on Surface */}
              <rect x="254" y="24" width="12" height="6" fill="#141c24" stroke="#ff6b6b" strokeWidth="1" rx="1" />
            </svg>

            {/* Depth Labels Overlay */}
            <div className="absolute top-2 left-3 font-mono text-[9px] text-secondary">
              SURFACE LEVEL: 0m
            </div>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-surface-container-high/90 px-2 py-0.5 hud-border rounded-[2px] font-mono text-[9px] text-critical font-bold flex items-center gap-1">
              <span>MAX OVERDEEPENING: -{maxDepthM}m</span>
            </div>
          </div>
        </div>

        {/* Right: Volumetric Depth Bands Table (4 cols) */}
        <div className="md:col-span-4 flex flex-col justify-between gap-2">
          <span className="font-sans text-[10px] font-bold text-outline uppercase tracking-wider">
            DEPTH STRATIFICATION
          </span>

          <div className="flex flex-col gap-1.5 font-mono text-[10px]">
            {mockBathymetryBands.map((band, idx) => (
              <div
                key={idx}
                className="bg-surface-container-high/70 p-2 hud-border rounded-[2px] flex justify-between items-center"
              >
                <div>
                  <div className="text-on-surface font-sans font-medium text-[10px]">{band.zoneLabel}</div>
                  <div className="text-secondary font-bold">{band.depthRangeM}</div>
                </div>
                <div className="text-right">
                  <div className="text-on-surface font-bold">{band.areaCoveragePct}% Area</div>
                  <div className="text-outline text-[9px]">{band.estimatedVolumeMCM} MCM</div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 hud-border-t font-mono text-[10px] flex justify-between text-on-surface">
            <span>TOTAL ESTIMATED STORAGE:</span>
            <span className="text-secondary font-bold">{totalVolumeMCM} MCM</span>
          </div>
        </div>
      </div>
    </div>
  );
};
