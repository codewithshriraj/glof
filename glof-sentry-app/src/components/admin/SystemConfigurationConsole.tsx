'use client';

import React, { useState } from 'react';
import { SystemConfigState } from '@/lib/types/glof';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

interface SystemConfigurationConsoleProps {
  config: SystemConfigState;
  onCommitConfig: (updated: SystemConfigState) => void;
  onResetDefaults: () => void;
  className?: string;
}

export const SystemConfigurationConsole: React.FC<SystemConfigurationConsoleProps> = ({
  config,
  onCommitConfig,
  onResetDefaults,
  className,
}) => {
  const [currentConfig, setCurrentConfig] = useState<SystemConfigState>(config);
  const [saveBanner, setSaveBanner] = useState<string | null>(null);

  const handleSliderChange = (key: keyof SystemConfigState, value: number) => {
    setCurrentConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    const updated = {
      ...currentConfig,
      lastCommittedUTC: '14:38:00 UTC',
    };
    onCommitConfig(updated);
    setSaveBanner('Configuration committed and broadcast to all SEOC nodes.');
    setTimeout(() => setSaveBanner(null), 4000);
  };

  const handleReset = () => {
    onResetDefaults();
    setCurrentConfig({
      amberThreshold: 0.600,
      redThreshold: 0.800,
      freeboardWeightPct: 26,
      expansionWeightPct: 22,
      seepageWeightPct: 20,
      iceCoreWeightPct: 18,
      slopeWeightPct: 14,
      capPollingIntervalSec: 10,
      maxRetryAttempts: 3,
      failoverMode: 'PRIMARY_SEOC_ACTIVE',
      autoEscalationEnabled: true,
      lastCommittedUTC: '14:30:00 UTC',
    });
    setSaveBanner('Reset to baseline National Defense default parameters.');
    setTimeout(() => setSaveBanner(null), 4000);
  };

  return (
    <div className={cn('space-y-4 font-mono text-[11px]', className)}>
      {/* Header Banner */}
      <div className="data-card hud-border p-3.5 rounded-[4px] bg-surface-container-low flex flex-wrap justify-between items-center gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Icon name="tune" size="sm" className="text-secondary" />
            <h2 className="font-sans font-bold text-on-surface text-[14px] uppercase tracking-wider">
              SYSTEM CONFIGURATION // GLOBAL THRESHOLDS &amp; ESCALATION RULES
            </h2>
          </div>
          <span className="text-outline text-[10px]">
            LAST COMMITTED: {currentConfig.lastCommittedUTC} · STATUS: OPERATIONAL DEFENSE COMPLIANT
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            className="font-bold text-[10px]"
          >
            <Icon name="restart_alt" size="xs" />
            RESET TO DEFAULTS
          </Button>

          <Button
            onClick={handleSave}
            variant="primary"
            size="sm"
            className="font-bold text-[10px] shadow-[0_0_12px_rgba(93,230,255,0.4)]"
          >
            <Icon name="save" size="xs" />
            COMMIT CONFIGURATION
          </Button>
        </div>
      </div>

      {saveBanner && (
        <div className="bg-secondary/10 border border-secondary/40 p-2.5 rounded text-secondary font-bold text-[10px] flex items-center gap-2 animate-fadeIn">
          <Icon name="check_circle" size="xs" />
          <span>{saveBanner}</span>
        </div>
      )}

      {/* Grid: 3 Main Configuration Pillars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Module 1: Risk Tier Thresholds (6 cols) */}
        <div className="lg:col-span-6 data-card hud-border rounded-[4px] p-4 flex flex-col justify-between gap-4">
          <div>
            <div className="flex justify-between items-center hud-border-b pb-2 mb-3">
              <span className="font-sans font-bold text-secondary text-[12px] uppercase flex items-center gap-1.5">
                <Icon name="warning" size="xs" /> RISK TIER THRESHOLDS
              </span>
              <span className="text-outline text-[9px]">SYS-PARAM-01</span>
            </div>

            <div className="space-y-4">
              {/* Amber Level Slider */}
              <div className="space-y-2 bg-surface-container-lowest p-3 rounded hud-border">
                <div className="flex justify-between items-baseline">
                  <span className="font-sans font-bold text-on-surface text-[11px]">AMBER ADVISORY LEVEL</span>
                  <span className="text-tertiary font-bold text-[14px] font-mono">
                    {currentConfig.amberThreshold.toFixed(3)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.300"
                  max="0.750"
                  step="0.005"
                  value={currentConfig.amberThreshold}
                  onChange={(e) => handleSliderChange('amberThreshold', parseFloat(e.target.value))}
                  className="w-full accent-secondary cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-outline">
                  <span>0.300 (SENSITIVE)</span>
                  <span className="text-secondary">AUTO-TRIGGER SECTOR ADVISORY</span>
                  <span>0.750 (CONSERVATIVE)</span>
                </div>
              </div>

              {/* Red Critical Level Slider */}
              <div className="space-y-2 bg-surface-container-lowest p-3 rounded hud-border">
                <div className="flex justify-between items-baseline">
                  <span className="font-sans font-bold text-on-surface text-[11px]">RED CRITICAL LEVEL</span>
                  <span className="text-error font-bold text-[14px] font-mono">
                    {currentConfig.redThreshold.toFixed(3)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.700"
                  max="0.950"
                  step="0.005"
                  value={currentConfig.redThreshold}
                  onChange={(e) => handleSliderChange('redThreshold', parseFloat(e.target.value))}
                  className="w-full accent-error cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-outline">
                  <span>0.700 (EARLY EVAC)</span>
                  <span className="text-error">AUTO-TRIGGER TIER 4 EVACUATION</span>
                  <span>0.950 (CONFIRMED BREACH)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[9px] text-outline pt-2 border-t border-surface-high">
            * Threshold deviations trigger immediate synthetic simulation recalculations.
          </div>
        </div>

        {/* Module 2: GSI Feature Weight Coefficients (6 cols) */}
        <div className="lg:col-span-6 data-card hud-border rounded-[4px] p-4 flex flex-col justify-between gap-4">
          <div>
            <div className="flex justify-between items-center hud-border-b pb-2 mb-3">
              <span className="font-sans font-bold text-secondary text-[12px] uppercase flex items-center gap-1.5">
                <Icon name="calculate" size="xs" /> GSI SENSITIVITY COEFFICIENTS
              </span>
              <span className="text-outline text-[9px]">
                TOTAL: {currentConfig.freeboardWeightPct + currentConfig.expansionWeightPct + currentConfig.seepageWeightPct + currentConfig.iceCoreWeightPct + currentConfig.slopeWeightPct}%
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                { label: 'Freeboard Deficit (Hydrostatic)', key: 'freeboardWeightPct' as const, val: currentConfig.freeboardWeightPct },
                { label: 'YoY Area Expansion (InSAR)', key: 'expansionWeightPct' as const, val: currentConfig.expansionWeightPct },
                { label: 'Moraine Seepage Anomaly', key: 'seepageWeightPct' as const, val: currentConfig.seepageWeightPct },
                { label: 'Dead-Ice Core Degradation (TIR)', key: 'iceCoreWeightPct' as const, val: currentConfig.iceCoreWeightPct },
                { label: 'Downslope Valley Gradient', key: 'slopeWeightPct' as const, val: currentConfig.slopeWeightPct },
              ].map((item) => (
                <div key={item.key} className="flex justify-between items-center bg-surface-container-lowest p-2 rounded hud-border">
                  <span className="text-on-surface-variant text-[10px]">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="5"
                      max="40"
                      value={item.val}
                      onChange={(e) => handleSliderChange(item.key, parseInt(e.target.value) || 0)}
                      className="w-14 bg-surface-container hud-border text-secondary text-right p-1 rounded font-mono font-bold text-[10px] outline-none"
                    />
                    <span className="text-outline text-[10px]">%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[9px] text-outline pt-2 border-t border-surface-high">
            * Adjusts the multi-criteria analytical hierarchy process (AHP) matrix weights.
          </div>
        </div>

        {/* Module 3: Failover Mode & Emergency CAP Distribution (12 cols) */}
        <div className="lg:col-span-12 data-card hud-border rounded-[4px] p-4 flex flex-col md:flex-row justify-between gap-6">
          {/* Left: Failover Mode */}
          <div className="flex-1 space-y-3">
            <div className="font-sans font-bold text-on-surface text-[12px] uppercase flex items-center gap-1.5 border-b border-surface-high pb-1.5">
              <Icon name="dns" size="xs" className="text-secondary" /> HIGH-AVAILABILITY FAILOVER MODE
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {[
                { mode: 'PRIMARY_SEOC_ACTIVE' as const, title: 'PRIMARY SEOC (NEW DELHI NOC)', desc: 'Primary cloud data center with active load balancing.' },
                { mode: 'SECONDARY_FIELD_NOC' as const, title: 'FIELD NOC (GANGTOK EOC)', desc: 'Tactical field operations center cold-failover ready.' },
                { mode: 'HOT_STANDBY' as const, title: 'DUAL HOT STANDBY (SYNC)', desc: 'Full active-active mirror over satellite telemetry pipe.' },
              ].map((f) => (
                <button
                  type="button"
                  key={f.mode}
                  onClick={() => setCurrentConfig((p) => ({ ...p, failoverMode: f.mode }))}
                  className={cn(
                    'p-3 rounded-[3px] border text-left transition-all touch-manipulation cursor-pointer min-h-[44px]',
                    currentConfig.failoverMode === f.mode
                      ? 'bg-secondary/15 border-secondary text-on-surface'
                      : 'bg-surface-container-lowest border-surface-high text-outline hover:text-on-surface'
                  )}
                >
                  <span className="font-bold text-[10px] text-secondary block mb-1">{f.title}</span>
                  <span className="text-[9px] leading-tight block">{f.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: CAP Protocol Parameters */}
          <div className="w-full md:w-80 space-y-3">
            <div className="font-sans font-bold text-on-surface text-[12px] uppercase flex items-center gap-1.5 border-b border-surface-high pb-1.5">
              <Icon name="campaign" size="xs" className="text-secondary" /> CAP ENGINE DISTRIBUTION
            </div>
            <div className="space-y-2 bg-surface-container-lowest p-2.5 rounded hud-border text-[10px]">
              <div className="flex justify-between items-center">
                <span className="text-outline">POLLING INTERVAL:</span>
                <span className="text-secondary font-bold font-mono">{currentConfig.capPollingIntervalSec} SEC</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-outline">MAX RETRY ATTEMPTS:</span>
                <span className="text-on-surface font-bold font-mono">{currentConfig.maxRetryAttempts} RETRIES</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-surface-high">
                <span className="text-outline">AUTO-ESCALATION:</span>
                <span className="text-advisory font-bold font-mono">
                  {currentConfig.autoEscalationEnabled ? 'ENABLED' : 'DISABLED'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
