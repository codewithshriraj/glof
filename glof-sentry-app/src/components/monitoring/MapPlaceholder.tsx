'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';
import Link from 'next/link';
import { useLanguage } from '@/i18n';

interface MapPlaceholderProps {
  title?: string;
  sourceTag?: string;
  className?: string;
}

export const MapPlaceholder: React.FC<MapPlaceholderProps> = ({
  title,
  sourceTag = 'USGS-G1 // TERA-9',
  className,
}) => {
  const { t } = useLanguage();
  const displayTitle = title || t.map.himalayanGis;

  return (
    <section className={cn('data-card hud-border p-4 h-[400px] flex flex-col relative overflow-hidden group rounded-[4px]', className)}>
      <div className="flex justify-between items-center mb-3 hud-border-b pb-2 z-10 relative">
        <Link href="/map" className="hover:text-secondary transition-colors">
          <h2 className="font-sans text-[11px] font-bold tracking-[0.1em] text-on-surface uppercase hover:text-secondary">
            {displayTitle}
          </h2>
        </Link>
        <Link
          href="/map"
          className="font-mono text-[10px] text-secondary bg-secondary/10 hover:bg-secondary/25 px-2 py-0.5 rounded-[2px] hud-border transition-colors flex items-center gap-1.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-secondary pulse-ping" />
          {t.command.viewLakeTelemetry} →
        </Link>
      </div>

      <div className="flex-grow relative border border-outline-variant/30 rounded-[3px] bg-surface-container-lowest overflow-hidden">
        {/* Technical Topographic Terrain Map Visualizer */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
          style={{
            backgroundImage: `radial-gradient(circle at 45% 30%, #1e293b 0%, #0c141c 70%)`,
          }}
        />

        {/* Contour & Topography SVG Vector Overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 0 100 Q 150 40 300 120 T 600 80 T 900 140 T 1200 100" fill="none" stroke="#22b8cf" strokeWidth="0.8" strokeDasharray="3 3" />
          <path d="M 0 160 Q 200 90 400 180 T 800 130 T 1200 190" fill="none" stroke="#4c6ef5" strokeWidth="0.6" />
          <path d="M 0 240 Q 250 150 500 260 T 1000 200 T 1200 280" fill="none" stroke="#8e90a0" strokeWidth="0.5" strokeDasharray="2 2" />
          <path d="M 0 320 Q 300 220 600 340 T 1200 300" fill="none" stroke="#232b33" strokeWidth="1" />
        </svg>

        {/* Grid Overlay for Technical Feel */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(35,43,51,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(35,43,51,0.3)_1px,transparent_1px)] bg-[size:20px_20px]" />

        {/* Active Alert Pins (South Lhonak Site 014) */}
        <Link
          href="/lakes/south-lhonak"
          className="absolute top-[30%] left-[45%] flex items-center justify-center group/pin cursor-pointer z-20"
        >
          <div className="w-3 h-3 rounded-full bg-critical relative z-10 shadow-[0_0_10px_rgba(255,107,107,0.8)]" />
          <div className="absolute w-7 h-7 rounded-full border border-critical animate-ping opacity-75" />
          <span className="absolute left-6 font-mono text-[10px] font-bold text-critical bg-surface-container-high px-1.5 py-0.5 border border-critical/50 whitespace-nowrap rounded-[2px] shadow-lg group-hover/pin:bg-critical group-hover/pin:text-background transition-colors">
            SITE 014 // SOUTH LHONAK
          </span>
        </Link>

        {/* Ghepang Gath (Site 022) Pin */}
        <div className="absolute top-[60%] left-[20%] flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-warning relative z-10 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
          <div
            className="absolute w-5 h-5 rounded-full border border-warning animate-ping opacity-75"
            style={{ animationDelay: '0.5s' }}
          />
          <span className="absolute left-5 font-mono text-[9px] text-warning bg-surface-container px-1 border border-warning/40 whitespace-nowrap rounded-[2px]">
            SITE 022
          </span>
        </div>

        {/* Imja Tsho (Site 008) Pin */}
        <div className="absolute top-[45%] left-[70%] flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-secondary relative z-10 shadow-[0_0_8px_rgba(93,230,255,0.8)]" />
          <div
            className="absolute w-5 h-5 rounded-full border border-secondary animate-ping opacity-75"
            style={{ animationDelay: '1.2s' }}
          />
          <span className="absolute left-5 font-mono text-[9px] text-secondary bg-surface-container px-1 border border-secondary/40 whitespace-nowrap rounded-[2px]">
            SITE 008
          </span>
        </div>

        {/* Attribution tag */}
        <div className="absolute bottom-2 right-2 font-mono text-[10px] text-outline bg-surface-container-lowest/80 px-2 py-0.5 hud-border">
          {sourceTag}
        </div>
      </div>
    </section>
  );
};
