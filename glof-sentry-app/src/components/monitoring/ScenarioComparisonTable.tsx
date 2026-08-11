import React from 'react';
import { mockBreachScenarios } from '@/lib/mock/simulation-data';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils/cn';

interface ScenarioComparisonTableProps {
  className?: string;
}

export const ScenarioComparisonTable: React.FC<ScenarioComparisonTableProps> = ({ className }) => {
  const scenarios = Object.values(mockBreachScenarios);

  return (
    <div className={cn('data-card hud-border flex flex-col rounded-[4px]', className)}>
      {/* Header */}
      <div className="p-3 hud-border-b bg-surface-container-low/80 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Icon name="compare_arrows" size="xs" className="text-secondary" />
          <span className="font-sans text-[11px] font-bold tracking-wider text-on-surface uppercase">
            HYDRODYNAMIC SCENARIO COMPARISON MATRIX
          </span>
        </div>
        <span className="font-mono text-[9px] text-outline">4 SIMULATION PROFILES</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-[11px] border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-surface-container-lowest/80 text-outline text-[9px] uppercase tracking-wider hud-border-b">
              <th className="p-2.5">PARAMETER</th>
              {scenarios.map((sc) => (
                <th key={sc.id} className="p-2.5 text-center">
                  <span
                    className={cn(
                      'font-bold px-1.5 py-0.5 rounded-[2px] border text-[9px]',
                      sc.riskTier === 'L4'
                        ? 'text-critical border-critical/40 bg-critical/10'
                        : sc.riskTier === 'L2'
                        ? 'text-secondary border-secondary/40 bg-secondary/10'
                        : 'text-advisory border-advisory/40 bg-advisory/10'
                    )}
                  >
                    {sc.id.toUpperCase()}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-high">
            <tr className="hover:bg-surface-container-high/60 transition-colors">
              <td className="p-2.5 font-sans font-medium text-on-surface">Breach Width (m)</td>
              {scenarios.map((sc) => (
                <td key={sc.id} className="p-2.5 text-center font-bold text-secondary">
                  {sc.breachWidthM} m
                </td>
              ))}
            </tr>
            <tr className="hover:bg-surface-container-high/60 transition-colors">
              <td className="p-2.5 font-sans font-medium text-on-surface">Breach Depth (m)</td>
              {scenarios.map((sc) => (
                <td key={sc.id} className="p-2.5 text-center text-on-surface">
                  {sc.breachDepthM} m
                </td>
              ))}
            </tr>
            <tr className="hover:bg-surface-container-high/60 transition-colors bg-critical/5">
              <td className="p-2.5 font-sans font-medium text-critical font-bold">Peak Discharge (Qp)</td>
              {scenarios.map((sc) => (
                <td key={sc.id} className="p-2.5 text-center font-bold text-critical">
                  {sc.peakDischargeM3s.toLocaleString()} m³/s
                </td>
              ))}
            </tr>
            <tr className="hover:bg-surface-container-high/60 transition-colors">
              <td className="p-2.5 font-sans font-medium text-on-surface">Time to Peak (Tp)</td>
              {scenarios.map((sc) => (
                <td key={sc.id} className="p-2.5 text-center text-on-surface">
                  T+{sc.timeToPeakMin} min
                </td>
              ))}
            </tr>
            <tr className="hover:bg-surface-container-high/60 transition-colors">
              <td className="p-2.5 font-sans font-medium text-on-surface">Peak Inundation Depth</td>
              {scenarios.map((sc) => (
                <td key={sc.id} className="p-2.5 text-center text-on-surface">
                  {sc.maxDownstreamDepthM} m
                </td>
              ))}
            </tr>
            <tr className="hover:bg-surface-container-high/60 transition-colors">
              <td className="p-2.5 font-sans font-medium text-on-surface">Chungthang Dam Arrival</td>
              {scenarios.map((sc) => (
                <td key={sc.id} className="p-2.5 text-center text-secondary font-bold">
                  {sc.arrivalChungthang}
                </td>
              ))}
            </tr>
            <tr className="hover:bg-surface-container-high/60 transition-colors">
              <td className="p-2.5 font-sans font-medium text-on-surface">Mangan Village Arrival</td>
              {scenarios.map((sc) => (
                <td key={sc.id} className="p-2.5 text-center text-on-surface">
                  {sc.arrivalMangan}
                </td>
              ))}
            </tr>
            <tr className="hover:bg-surface-container-high/60 transition-colors">
              <td className="p-2.5 font-sans font-medium text-on-surface">Inundation Extent (km²)</td>
              {scenarios.map((sc) => (
                <td key={sc.id} className="p-2.5 text-center text-on-surface">
                  {sc.inundationAreaKm2} km²
                </td>
              ))}
            </tr>
            <tr className="hover:bg-surface-container-high/60 transition-colors">
              <td className="p-2.5 font-sans font-medium text-on-surface">Risk Classification</td>
              {scenarios.map((sc) => (
                <td key={sc.id} className="p-2.5 text-center font-bold">
                  <span
                    className={cn(
                      'text-[9px] px-1.5 py-0.5 rounded-[2px] border',
                      sc.riskTier === 'L4'
                        ? 'text-critical border-critical/40 bg-critical/10'
                        : sc.riskTier === 'L2'
                        ? 'text-secondary border-secondary/40 bg-secondary/10'
                        : 'text-advisory border-advisory/40 bg-advisory/10'
                    )}
                  >
                    {sc.riskTier}
                  </span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
