'use client';

import React, { useState } from 'react';
import { ModelAuditEntry } from '@/lib/types/glof';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils/cn';

interface ModelAuditTrailViewProps {
  auditEntries: ModelAuditEntry[];
  className?: string;
}

export const ModelAuditTrailView: React.FC<ModelAuditTrailViewProps> = ({
  auditEntries,
  className,
}) => {
  const [selectedEntryId, setSelectedEntryId] = useState<string>(auditEntries[0]?.id || '');
  const selectedEntry = auditEntries.find((e) => e.id === selectedEntryId) || auditEntries[0];

  return (
    <div className={cn('space-y-4 font-mono text-[11px]', className)}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Table: Model Inference Ledger (6 cols) */}
        <div className="lg:col-span-6 data-card hud-border rounded-[4px] flex flex-col overflow-hidden">
          <div className="p-3 hud-border-b bg-surface-container-low/80 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Icon name="psychology" size="xs" className="text-secondary" />
              <span className="font-sans font-bold text-on-surface uppercase">
                EXPLAINABLE AI GSI INFERENCE LEDGER
              </span>
            </div>
            <span className="text-[10px] text-outline">ENSEMBLE v4.2</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[10px] border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-surface-container-lowest/80 text-outline text-[9px] uppercase tracking-wider hud-border-b">
                  <th className="p-2.5">AUDIT ID</th>
                  <th className="p-2.5">LAKE</th>
                  <th className="p-2.5">TIMESTAMP</th>
                  <th className="p-2.5 text-center">TIER</th>
                  <th className="p-2.5 text-center">CONFIDENCE</th>
                  <th className="p-2.5 text-right">SCORE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-high">
                {auditEntries.map((e) => (
                  <tr
                    key={e.id}
                    onClick={() => setSelectedEntryId(e.id)}
                    className={cn(
                      'cursor-pointer transition-colors hover:bg-surface-container-high/60',
                      selectedEntryId === e.id ? 'bg-surface-container-high border-l-2 border-l-secondary' : ''
                    )}
                  >
                    <td className="p-2.5 font-bold text-secondary">{e.id}</td>
                    <td className="p-2.5 text-on-surface font-sans">{e.lakeName}</td>
                    <td className="p-2.5 text-outline">{e.timestampUTC}</td>
                    <td className="p-2.5 text-center">
                      <span
                        className={cn(
                          'px-1.5 py-0.5 rounded-[2px] font-bold text-[8px] border',
                          e.riskTier === 'L4'
                            ? 'text-critical border-critical/40 bg-critical/10'
                            : e.riskTier === 'L3'
                            ? 'text-warning border-warning/40 bg-warning/10'
                            : 'text-secondary border-secondary/40 bg-secondary/10'
                        )}
                      >
                        {e.riskTier}
                      </span>
                    </td>
                    <td className="p-2.5 text-center text-advisory font-bold">{e.confidencePct}%</td>
                    <td className="p-2.5 text-right font-bold text-on-surface">
                      {e.compositeRiskScore.toFixed(3)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel: Factor Decomposition & Shapley Weights (6 cols) */}
        <div className="lg:col-span-6 data-card hud-border rounded-[4px] p-4 flex flex-col gap-4">
          <div className="flex justify-between items-center hud-border-b pb-2">
            <div>
              <div className="font-sans text-[14px] font-bold text-on-surface">{selectedEntry.lakeName}</div>
              <div className="text-outline text-[10px]">MODEL: {selectedEntry.modelVersion} · INFERENCE: {selectedEntry.executionTimeMs}ms</div>
            </div>
            <span className="font-bold text-critical text-[14px] bg-critical/10 px-2.5 py-1 rounded-[2px] border border-critical/30">
              GSI: {selectedEntry.compositeRiskScore.toFixed(3)} ({selectedEntry.riskTier})
            </span>
          </div>

          {/* Primary Driver Banner */}
          <div className="bg-surface-container-high p-3 hud-border rounded-[3px]">
            <span className="text-outline text-[9px] uppercase tracking-wider block mb-1">
              PRIMARY DETECTED RISK DRIVER
            </span>
            <div className="font-sans text-[13px] font-bold text-critical">
              {selectedEntry.primaryDriver}
            </div>
          </div>

          {/* Feature Sensitivity / Shapley Factor Contributions */}
          <div className="space-y-3">
            <span className="font-sans text-[10px] font-bold text-outline uppercase tracking-wider block">
              FACTOR SENSITIVITY & WEIGHT DECOMPOSITION
            </span>

            <div className="space-y-2">
              {selectedEntry.factorContributions.map((fc) => (
                <div key={fc.factor} className="bg-surface-container-lowest p-2.5 hud-border rounded-[2px]">
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="font-bold text-on-surface">{fc.factor}</span>
                    <span className="text-secondary font-bold">{fc.weightPct}% WEIGHT</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden mb-1.5">
                    <div
                      className={cn(
                        'h-full',
                        fc.direction === 'INCREASING' ? 'bg-critical' : fc.direction === 'DECREASING' ? 'bg-advisory' : 'bg-primary'
                      )}
                      style={{ width: `${fc.weightPct * 3}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-outline">
                    <span>{fc.value}</span>
                    <span
                      className={cn(
                        'font-bold',
                        fc.direction === 'INCREASING' ? 'text-critical' : 'text-advisory'
                      )}
                    >
                      {fc.direction}
                    </span>
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
