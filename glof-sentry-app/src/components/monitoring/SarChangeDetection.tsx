'use client';

import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils/cn';
import { Icon } from '@/components/ui/Icon';

interface SarChangeDetectionProps {
  title?: string;
  baselineDate?: string;
  currentDate?: string;
  sourceTag?: string;
  className?: string;
}

export const SarChangeDetection: React.FC<SarChangeDetectionProps> = ({
  title = 'SYNTHETIC APERTURE RADAR (SAR) // CHANGE DETECTION',
  baselineDate = 'T-0: 2023-09-15',
  currentDate = 'T-1: 2023-10-04',
  sourceTag = 'Sentinel-1 SAR · 10:45 UTC',
  className,
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0 to 100
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos(Math.round((x / rect.width) * 100));
  }, []);

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.buttons === 1) {
      handleMove(e.clientX);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    handleMove(e.clientX);
  };

  return (
    <div className={cn('data-card hud-border flex flex-col flex-grow relative overflow-hidden group rounded-[4px]', className)}>
      <div className="hud-border-b px-4 py-2.5 flex flex-col sm:flex-row justify-between sm:items-center gap-2 bg-surface-container">
        <span className="font-sans text-[11px] font-bold tracking-[0.1em] text-on-surface uppercase">
          {title}
        </span>
        <div className="flex gap-4 font-mono text-[10px]">
          <span className="text-outline flex items-center gap-1.5">
            <span className="w-2 h-2 bg-on-surface rounded-full inline-block" /> {baselineDate}
          </span>
          <span className="text-secondary flex items-center gap-1.5">
            <span className="w-2 h-2 bg-secondary rounded-full inline-block" /> {currentDate}
          </span>
        </div>
      </div>

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onClick={handleClick}
        className="relative w-full aspect-video flex-grow bg-surface-dim overflow-hidden flex items-center justify-center cursor-ew-resize select-none touch-none"
      >
        {/* Dark High-Contrast Terrain Canvas */}
        <div className="absolute inset-0 bg-[#070f16] bg-[radial-gradient(circle_at_center,_#141c24_0%,_#070f16_100%)]" />

        {/* 1px Digital Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(35,43,51,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(35,43,51,0.4)_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* Baseline Lake Boundary Layer (Left Side) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 240">
          <path d="M 40 40 Q 120 20 200 60 T 360 40" fill="none" stroke="#232b33" strokeWidth="1" />
          <path d="M 30 100 Q 140 70 240 120 T 380 90" fill="none" stroke="#232b33" strokeWidth="1" />
          <path d="M 20 180 Q 150 140 260 200 T 370 170" fill="none" stroke="#232b33" strokeWidth="1" />

          {/* Baseline Lake Outline */}
          <polygon
            points="140,80 220,70 260,110 240,160 170,170 120,130"
            fill="#12171d"
            stroke="#8e90a0"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
        </svg>

        {/* Post-Expansion Layer (Clipped by slider position) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
        >
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 240">
            {/* Expanded Lake Area Highlight (Cyan Glow) */}
            <polygon
              points="120,70 240,55 290,110 270,180 160,190 100,140"
              fill="rgba(93, 230, 255, 0.22)"
              stroke="#5de6ff"
              strokeWidth="2"
            />
            {/* Moraine Breach Vulnerability Zone */}
            <circle cx="270" cy="180" r="8" fill="none" stroke="#ff6b6b" strokeWidth="2" strokeDasharray="2 2" />
            <text x="285" y="184" fill="#ff6b6b" fontSize="10" fontFamily="monospace">MORAINE DAM TOE</text>
          </svg>
        </div>

        {/* Center Split Slider Indicator Handle */}
        <div
          className="absolute inset-y-0 w-[2px] bg-secondary/90 flex items-center justify-center pointer-events-none transition-all duration-75"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="w-7 h-7 bg-surface-container hud-border rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(93,230,255,0.7)] text-secondary">
            <Icon name="drag_indicator" size="xs" />
          </div>
        </div>

        {/* Data Provenance Badge */}
        <div className="absolute bottom-2 right-2 bg-surface-container-high/90 px-2 py-1 hud-border font-mono text-[10px] text-on-surface-variant backdrop-blur-sm rounded-[2px] pointer-events-none">
          {sourceTag} · SLIDE TO COMPARE
        </div>
      </div>
    </div>
  );
};
