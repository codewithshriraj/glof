'use client';

import React, { useState } from 'react';
import { UserOperatorAccount } from '@/lib/types/glof';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

interface UserAccessManagerProps {
  operators: UserOperatorAccount[];
  onToggleStatus: (operatorId: string) => void;
  onToggleMfa: (operatorId: string) => void;
  className?: string;
}

export const UserAccessManager: React.FC<UserAccessManagerProps> = ({
  operators,
  onToggleStatus,
  onToggleMfa,
  className,
}) => {
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredOperators = operators.filter((op) => {
    const matchesRole = selectedRoleFilter === 'ALL' || op.role === selectedRoleFilter;
    const matchesQuery =
      op.callsign.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.jurisdiction.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesQuery;
  });

  return (
    <div className={cn('space-y-4 font-mono text-[11px]', className)}>
      {/* Top Banner */}
      <div className="data-card hud-border p-3 rounded-[4px] bg-surface-container-low flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <Icon name="badge" size="sm" className="text-secondary" />
          <div>
            <span className="font-sans font-bold text-on-surface text-[13px] uppercase block">
              OPERATOR JURISDICTION &amp; SECURITY ACCESS CONTROL
            </span>
            <span className="text-outline text-[10px]">
              Multi-tiered role permissions, biometric MFA tokens, and regional river basin jurisdictions
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-outline">TOTAL ACTIVE OPERATORS:</span>
          <span className="font-bold text-secondary text-[12px] bg-secondary/10 px-2 py-0.5 rounded border border-secondary/30">
            {operators.filter((o) => o.status === 'ACTIVE').length} / {operators.length}
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap gap-2 justify-between items-center bg-surface-container-lowest p-2 rounded hud-border">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['ALL', 'LEAD_CONTROLLER', 'HYDROLOGIST', 'FIELD_COORDINATOR', 'GIS_ANALYST'].map((role) => (
            <button
              type="button"
              key={role}
              onClick={() => setSelectedRoleFilter(role)}
              className={cn(
                'px-2.5 py-1 rounded text-[10px] font-bold border transition-colors whitespace-nowrap touch-manipulation cursor-pointer min-h-[32px]',
                selectedRoleFilter === role
                  ? 'bg-secondary/20 text-secondary border-secondary'
                  : 'bg-surface-container text-outline border-surface-high hover:text-on-surface'
              )}
            >
              {role.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 bg-surface-container px-2 py-1 rounded hud-border">
          <Icon name="search" size="xs" className="text-outline" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="FILTER BY CALLSIGN OR JURISDICTION..."
            className="bg-transparent text-[10px] text-on-surface outline-none w-56 placeholder-outline"
          />
        </div>
      </div>

      {/* Operators Table */}
      <div className="data-card hud-border rounded-[4px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[10px] border-collapse min-w-[640px]">
          <thead>
            <tr className="bg-surface-container-lowest/80 text-outline text-[9px] uppercase tracking-wider hud-border-b">
              <th className="p-2.5">OPERATOR ID</th>
              <th className="p-2.5">CALLSIGN &amp; NAME</th>
              <th className="p-2.5">ROLE PERMISSION</th>
              <th className="p-2.5">ASSIGNED JURISDICTION</th>
              <th className="p-2.5 text-center">MFA STATUS</th>
              <th className="p-2.5 text-center">DUTY STATUS</th>
              <th className="p-2.5 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-high">
            {filteredOperators.map((op) => (
              <tr key={op.id} className="hover:bg-surface-container-high/40 transition-colors">
                <td className="p-2.5 font-bold text-secondary">{op.id}</td>
                <td className="p-2.5">
                  <span className="font-bold text-on-surface block">{op.callsign}</span>
                  <span className="text-[9px] text-outline">{op.name}</span>
                </td>
                <td className="p-2.5">
                  <span className="bg-surface-container px-1.5 py-0.5 rounded text-[9px] font-bold text-primary border border-surface-high">
                    {op.role}
                  </span>
                </td>
                <td className="p-2.5 text-on-surface-variant max-w-[200px] truncate">
                  {op.jurisdiction}
                </td>
                <td className="p-2.5 text-center">
                  <button
                    type="button"
                    onClick={() => onToggleMfa(op.id)}
                    className={cn(
                      'px-1.5 py-0.5 rounded text-[8px] font-bold border transition-colors touch-manipulation cursor-pointer min-h-[28px]',
                      op.mfaEnabled
                        ? 'bg-advisory/10 text-advisory border-advisory/30'
                        : 'bg-error/10 text-error border-error/30'
                    )}
                  >
                    {op.mfaEnabled ? 'ENABLED (FIDO2)' : 'DISABLED'}
                  </button>
                </td>
                <td className="p-2.5 text-center">
                  <span
                    className={cn(
                      'px-1.5 py-0.5 rounded text-[8px] font-bold border',
                      op.status === 'ACTIVE'
                        ? 'bg-secondary/10 text-secondary border-secondary/30'
                        : op.status === 'STANDBY'
                        ? 'bg-tertiary/10 text-tertiary border-tertiary/30'
                        : 'bg-surface-container text-outline border-surface-high'
                    )}
                  >
                    {op.status}
                  </span>
                </td>
                <td className="p-2.5 text-right">
                  <Button
                    onClick={() => onToggleStatus(op.id)}
                    variant="outline"
                    size="sm"
                    className="text-[9px] py-0.5 px-2"
                  >
                    {op.status === 'ACTIVE' ? 'STANDBY' : 'ACTIVATE'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};
