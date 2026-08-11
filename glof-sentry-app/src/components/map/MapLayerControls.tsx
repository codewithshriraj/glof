'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { Icon } from '@/components/ui/Icon';
import { useLanguage } from '@/i18n';

export interface MapLayerState {
  sar: boolean;
  optical: boolean;
  terrain: boolean;
  inundation: boolean;
  sensors: boolean;
  hazardBuffers: boolean;
}

interface MapLayerControlsProps {
  layers: MapLayerState;
  onToggleLayer: (layerKey: keyof MapLayerState) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectLake: (lakeId: string) => void;
  searchResults: { id: string; name: string; code: string; riskLevel: string }[];
  className?: string;
}

export const MapLayerControls: React.FC<MapLayerControlsProps> = ({
  layers,
  onToggleLayer,
  searchQuery,
  onSearchChange,
  onSelectLake,
  searchResults,
  className,
}) => {
  const { t, language } = useLanguage();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className={cn('w-72 sm:w-80 flex flex-col gap-2 z-[400] pointer-events-auto', className)}>
      {/* Search Bar & Mobile Controls Toggle */}
      <div className="bg-surface-container-high/95 backdrop-blur-md hud-border flex flex-col rounded-[4px] shadow-xl relative">
        <div className="flex items-center p-2 sm:p-2.5">
          <Icon name="search" size="xs" className="text-on-surface-variant mr-2" />
          <input
            className="bg-transparent border-none text-on-surface font-mono text-[11px] focus:ring-0 w-full placeholder-on-surface-variant/70 outline-none uppercase font-sans"
            placeholder={language === 'hi' ? 'झील स्थल / निर्देशांक खोजें...' : 'SEARCH SITE / COORDS...'}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="text-outline hover:text-on-surface text-[12px] px-1.5 min-h-[36px] min-w-[36px] flex items-center justify-center touch-manipulation cursor-pointer"
              aria-label="Clear Search"
            >
              ✕
            </button>
          )}

          {/* Mobile Collapse/Expand Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="sm:hidden ml-1 p-1 text-secondary font-mono text-[10px] font-bold bg-secondary/10 border border-secondary/30 rounded flex items-center gap-1 min-h-[36px] min-w-[36px] touch-manipulation cursor-pointer"
            aria-label="Toggle Layers Menu"
          >
            <Icon name="layers" size="xs" />
            <span>{isMobileOpen ? '▲' : '▼'}</span>
          </button>
        </div>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="hud-border-t bg-surface-container-lowest/95 p-1 max-h-48 overflow-y-auto divide-y divide-surface-high">
            {searchResults.map((result) => (
              <button
                type="button"
                key={result.id}
                onClick={() => {
                  onSelectLake(result.id);
                  onSearchChange('');
                }}
                className="w-full text-left p-2 hover:bg-surface-container-high/80 transition-colors flex items-center justify-between rounded-[2px] min-h-[44px] touch-manipulation cursor-pointer"
              >
                <div>
                  <div className="font-mono text-[11px] font-bold text-secondary">{result.code}</div>
                  <div className="font-sans text-[11px] text-on-surface">{result.name}</div>
                </div>
                <span
                  className={cn(
                    'font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-[2px] border',
                    result.riskLevel === 'L4'
                      ? 'bg-critical/20 text-critical border-critical/40'
                      : result.riskLevel === 'L3'
                      ? 'bg-warning/20 text-warning border-warning/40'
                      : 'bg-secondary/20 text-secondary border-secondary/40'
                  )}
                >
                  {result.riskLevel}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Collapsible Layer Selector Box */}
      <div
        className={cn(
          'bg-surface-container-high/95 backdrop-blur-md hud-border rounded-[4px] shadow-xl overflow-hidden transition-all duration-200',
          isMobileOpen ? 'block' : 'hidden sm:block'
        )}
      >
        <div className="px-3 py-2 hud-border-b bg-surface-container-low/60 flex justify-between items-center">
          <span className="font-sans text-[10px] font-bold tracking-[0.1em] text-on-surface-variant uppercase">
            {t.map.layers}
          </span>
          <span className="font-mono text-[9px] text-secondary font-bold">{t.common.active}</span>
        </div>

        <div className="p-2 flex flex-col gap-1.5 font-mono text-[11px]">
          {/* Dark Terrain Base */}
          <button
            type="button"
            onClick={() => onToggleLayer('terrain')}
            className={cn(
              'flex items-center justify-between p-2 rounded-[3px] transition-colors hud-border min-h-[40px] touch-manipulation cursor-pointer',
              layers.terrain ? 'bg-surface-container border-secondary/40' : 'bg-transparent border-transparent opacity-60'
            )}
          >
            <div className="flex items-center gap-2">
              <Icon name="terrain" size="xs" className={layers.terrain ? 'text-secondary' : 'text-outline'} />
              <span className="text-on-surface font-sans text-[11px] font-medium">{t.map.layerTerrain}</span>
            </div>
            <Icon
              name={layers.terrain ? 'check_box' : 'check_box_outline_blank'}
              size="xs"
              className={layers.terrain ? 'text-secondary' : 'text-outline'}
            />
          </button>

          {/* SAR Radar */}
          <button
            type="button"
            onClick={() => onToggleLayer('sar')}
            className={cn(
              'flex items-center justify-between p-2 rounded-[3px] transition-colors hud-border min-h-[40px] touch-manipulation cursor-pointer',
              layers.sar ? 'bg-surface-container border-secondary/40' : 'bg-transparent border-transparent opacity-60'
            )}
          >
            <div className="flex items-center gap-2">
              <Icon name="satellite_alt" size="xs" className={layers.sar ? 'text-secondary' : 'text-outline'} />
              <span className="text-on-surface font-sans text-[11px] font-medium">{t.map.layerRadar}</span>
            </div>
            <Icon
              name={layers.sar ? 'check_box' : 'check_box_outline_blank'}
              size="xs"
              className={layers.sar ? 'text-secondary' : 'text-outline'}
            />
          </button>

          {/* Active Inundation Simulation Flow */}
          <button
            type="button"
            onClick={() => onToggleLayer('inundation')}
            className={cn(
              'flex items-center justify-between p-2 rounded-[3px] transition-colors hud-border min-h-[40px] touch-manipulation cursor-pointer',
              layers.inundation ? 'bg-critical/10 border-critical/40' : 'bg-transparent border-transparent opacity-60'
            )}
          >
            <div className="flex items-center gap-2">
              <Icon name="waves" size="xs" className={layers.inundation ? 'text-critical' : 'text-outline'} />
              <span className="text-on-surface font-sans text-[11px] font-medium">{t.map.layerInundation}</span>
            </div>
            <Icon
              name={layers.inundation ? 'check_box' : 'check_box_outline_blank'}
              size="xs"
              className={layers.inundation ? 'text-critical' : 'text-outline'}
            />
          </button>

          {/* Hazard Buffer Zones */}
          <button
            type="button"
            onClick={() => onToggleLayer('hazardBuffers')}
            className={cn(
              'flex items-center justify-between p-2 rounded-[3px] transition-colors hud-border min-h-[40px] touch-manipulation cursor-pointer',
              layers.hazardBuffers ? 'bg-surface-container border-warning/40' : 'bg-transparent border-transparent opacity-60'
            )}
          >
            <div className="flex items-center gap-2">
              <Icon name="shield" size="xs" className={layers.hazardBuffers ? 'text-warning' : 'text-outline'} />
              <span className="text-on-surface font-sans text-[11px] font-medium">{t.map.layerHazardBuffers}</span>
            </div>
            <Icon
              name={layers.hazardBuffers ? 'check_box' : 'check_box_outline_blank'}
              size="xs"
              className={layers.hazardBuffers ? 'text-warning' : 'text-outline'}
            />
          </button>

          {/* IoT Sensor Nodes */}
          <button
            type="button"
            onClick={() => onToggleLayer('sensors')}
            className={cn(
              'flex items-center justify-between p-2 rounded-[3px] transition-colors hud-border min-h-[40px] touch-manipulation cursor-pointer',
              layers.sensors ? 'bg-surface-container border-primary/40' : 'bg-transparent border-transparent opacity-60'
            )}
          >
            <div className="flex items-center gap-2">
              <Icon name="sensors" size="xs" className={layers.sensors ? 'text-primary' : 'text-outline'} />
              <span className="text-on-surface font-sans text-[11px] font-medium">{t.map.layerSensors}</span>
            </div>
            <Icon
              name={layers.sensors ? 'check_box' : 'check_box_outline_blank'}
              size="xs"
              className={layers.sensors ? 'text-primary' : 'text-outline'}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
