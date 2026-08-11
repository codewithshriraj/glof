'use client';

import React, { useState } from 'react';
import { mockBacktestEvents, mockBacktestScorecard } from '@/lib/mock/historical-data';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils/cn';

interface HistoricalBacktestTableProps {
  className?: string;
}

export const HistoricalBacktestTable: React.FC<HistoricalBacktestTableProps> = ({ className }) => {
  const [selectedEventId, setSelectedEventId] = useState<string>(mockBacktestEvents[0].id);
  const [selectedModel, setSelectedModel] = useState<'v3.2' | 'v4.1'>('v4.1');

  const selectedEvent = mockBacktestEvents.find((e) => e.id === selectedEventId) || mockBacktestEvents[0];

  return (
    <div className={cn('data-card hud-border flex flex-col rounded-[4px]', className)}>
      {/* Header */}
      <div className="p-3 hud-border-b bg-surface-container-low/80 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <Icon name="history_edu" size="xs" className="text-secondary" />
          <span className="font-sans text-[11px] font-bold tracking-wider text-on-surface uppercase">
            HISTORICAL BACKTESTING & MODEL EVALUATION CONSOLE
          </span>
        </div>
        <div className="font-mono text-[9px] text-outline flex items-center gap-2">
          <span>SRC: CWC-USGS HISTORICAL CATALOG</span>
          <span className="text-primary font-bold bg-primary/10 px-1.5 py-0.5 rounded-[2px] border border-primary/30">
            DEMO BACKTEST
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Sidebar: Controls & Event Metadata (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          {/* Event Selector */}
          <div className="bg-surface-container-high/60 hud-border p-3 rounded-[3px] flex flex-col gap-2">
            <span className="font-sans text-[10px] font-bold text-outline uppercase tracking-wider">
              SELECT HISTORICAL GLOF EVENT
            </span>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="bg-surface-container-lowest hud-border text-on-surface font-mono text-[11px] p-2 rounded-[2px] outline-none focus:border-secondary"
            >
              {mockBacktestEvents.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.name} ({evt.eventDate.split('-')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Model Selector */}
          <div className="bg-surface-container-high/60 hud-border p-3 rounded-[3px] flex flex-col gap-2">
            <span className="font-sans text-[10px] font-bold text-outline uppercase tracking-wider">
              MODEL GENERATION
            </span>
            <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
              <button
                type="button"
                onClick={() => setSelectedModel('v3.2')}
                className={cn(
                  'p-2 rounded-[2px] border transition-colors flex flex-col touch-manipulation cursor-pointer min-h-[40px]',
                  selectedModel === 'v3.2'
                    ? 'bg-secondary/15 border-secondary/50 text-secondary font-bold'
                    : 'bg-surface-container-lowest border-surface-high text-outline hover:text-on-surface'
                )}
              >
                <span>HMA-v3.2</span>
                <span className="text-[8px] opacity-70">LEGACY 2D</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedModel('v4.1')}
                className={cn(
                  'p-2 rounded-[2px] border transition-colors flex flex-col touch-manipulation cursor-pointer min-h-[40px]',
                  selectedModel === 'v4.1'
                    ? 'bg-primary/20 border-primary/50 text-primary font-bold'
                    : 'bg-surface-container-lowest border-surface-high text-outline hover:text-on-surface'
                )}
              >
                <span>HMA-v4.1</span>
                <span className="text-[8px] opacity-70">ENSEMBLE 3D</span>
              </button>
            </div>
          </div>

          {/* Selected Event Details Card */}
          <div className="bg-surface-container-high/80 hud-border p-3 rounded-[3px] flex flex-col gap-2 font-mono text-[10px]">
            <span className="font-sans text-[10px] font-bold text-outline uppercase tracking-wider">
              EVENT METADATA // {selectedEvent.eventDate}
            </span>
            <div className="flex justify-between border-b border-surface-container-highest pb-1">
              <span className="text-outline">TRIGGER MECHANISM</span>
              <span className="text-on-surface text-right font-medium">{selectedEvent.triggerType}</span>
            </div>
            <div className="flex justify-between border-b border-surface-container-highest pb-1">
              <span className="text-outline">EST. LAKE VOLUME</span>
              <span className="text-secondary font-bold">{selectedEvent.lakeVolumeMCM} MCM</span>
            </div>
            <div className="flex justify-between border-b border-surface-container-highest pb-1">
              <span className="text-outline">OBSERVED PEAK</span>
              <span className="text-critical font-bold">{selectedEvent.observedPeakDischargeM3s.toLocaleString()} m³/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-outline">MODEL LEAD TIME</span>
              <span className="text-primary font-bold">+{selectedEvent.leadTimeHours} hrs prior</span>
            </div>
          </div>
        </div>

        {/* Right Area: Performance Bento & Historical Validation Table (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Performance Scorecard Bento */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
            <div className="bg-surface-container-high/80 hud-border p-2.5 rounded-[3px]">
              <span className="font-sans text-[9px] font-bold text-outline uppercase block">PRECISION</span>
              <div className="text-[18px] font-bold text-secondary">{mockBacktestScorecard.precision}</div>
              <span className="text-[8px] text-primary">+0.04 vs baseline</span>
            </div>

            <div className="bg-surface-container-high/80 hud-border p-2.5 rounded-[3px]">
              <span className="font-sans text-[9px] font-bold text-outline uppercase block">RECALL</span>
              <div className="text-[18px] font-bold text-secondary">{mockBacktestScorecard.recall}</div>
              <span className="text-[8px] text-primary">+0.07 vs baseline</span>
            </div>

            <div className="bg-surface-container-high/80 hud-border p-2.5 rounded-[3px]">
              <span className="font-sans text-[9px] font-bold text-outline uppercase block">MATCH RATE</span>
              <div className="text-[18px] font-bold text-advisory">{mockBacktestScorecard.scenarioMatchRatePct}%</div>
              <span className="text-[8px] text-outline">N=5 HIMALAYAN EVENTS</span>
            </div>

            <div className="bg-surface-container-high/80 hud-border p-2.5 rounded-[3px]">
              <span className="font-sans text-[9px] font-bold text-outline uppercase block">MEAN TIMING ERROR</span>
              <div className="text-[18px] font-bold text-on-surface">±{mockBacktestScorecard.meanTimingErrorMin} min</div>
              <span className="text-[8px] text-outline">AT DAM TOE</span>
            </div>
          </div>

          {/* Events Validation Table */}
          <div className="overflow-x-auto hud-border rounded-[3px] bg-surface-container-lowest">
            <table className="w-full text-left font-mono text-[10px] border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-surface-container-high/80 text-outline text-[9px] uppercase tracking-wider hud-border-b">
                  <th className="p-2">EVENT NAME</th>
                  <th className="p-2">DATE</th>
                  <th className="p-2 text-right">OBSERVED Q</th>
                  <th className="p-2 text-right">PREDICTED Q</th>
                  <th className="p-2 text-center">ERROR</th>
                  <th className="p-2 text-center">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-high">
                {mockBacktestEvents.map((evt) => {
                  const isMatch = evt.status === 'MATCH';
                  const isSelected = evt.id === selectedEventId;

                  return (
                    <tr
                      key={evt.id}
                      onClick={() => setSelectedEventId(evt.id)}
                      className={cn(
                        'cursor-pointer transition-colors',
                        isSelected
                          ? 'bg-secondary/10'
                          : 'hover:bg-surface-container-high/60'
                      )}
                    >
                      <td className="p-2 font-sans font-bold text-on-surface">{evt.name}</td>
                      <td className="p-2 text-outline">{evt.eventDate}</td>
                      <td className="p-2 text-right font-bold text-on-surface">
                        {evt.observedPeakDischargeM3s.toLocaleString()} m³/s
                      </td>
                      <td className="p-2 text-right font-bold text-secondary">
                        {evt.predictedPeakDischargeM3s.toLocaleString()} m³/s
                      </td>
                      <td className="p-2 text-center text-outline">
                        {evt.errorMarginPct > 0 ? `+${evt.errorMarginPct}` : evt.errorMarginPct}%
                      </td>
                      <td className="p-2 text-center">
                        <span
                          className={cn(
                            'px-1.5 py-0.5 rounded-[2px] font-bold text-[8px] border',
                            isMatch
                              ? 'text-advisory border-advisory/40 bg-advisory/10'
                              : 'text-warning border-warning/40 bg-warning/10'
                          )}
                        >
                          {evt.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
