'use client';

import React, { useState } from 'react';
import { PlatformAuditRecord } from '@/lib/types/glof';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils/cn';

interface PlatformAuditLogViewProps {
  auditRecords: PlatformAuditRecord[];
  className?: string;
}

export const PlatformAuditLogView: React.FC<PlatformAuditLogViewProps> = ({
  auditRecords,
  className,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredRecords = auditRecords.filter(
    (r) =>
      r.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.targetResource.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={cn('data-card hud-border rounded-[4px] flex flex-col font-mono text-[11px]', className)}>
      {/* Header & Search */}
      <div className="p-3 hud-border-b bg-surface-container-low/80 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <Icon name="verified_user" size="xs" className="text-advisory" />
          <span className="font-sans font-bold text-on-surface uppercase">
            IMMUTABLE PLATFORM SECURITY & AUDIT TRAIL
          </span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="SEARCH AUDIT STREAM..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-surface-container-lowest hud-border text-on-surface px-2.5 py-1 rounded-[2px] text-[10px] outline-none focus:border-secondary w-48"
          />
          <span className="text-[10px] text-outline">SHA256 SIGNED</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-[10px] border-collapse min-w-[640px]">
          <thead>
            <tr className="bg-surface-container-lowest/80 text-outline text-[9px] uppercase tracking-wider hud-border-b">
              <th className="p-2.5">EVENT ID</th>
              <th className="p-2.5">TIMESTAMP (UTC)</th>
              <th className="p-2.5">OPERATOR / ACTOR</th>
              <th className="p-2.5">ACTION TYPE</th>
              <th className="p-2.5">TARGET RESOURCE</th>
              <th className="p-2.5">ORIGIN / WORKSTATION</th>
              <th className="p-2.5 text-center">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-high">
            {filteredRecords.map((r) => (
              <tr key={r.id} className="hover:bg-surface-container-high/60 transition-colors">
                <td className="p-2.5 font-bold text-secondary">{r.id}</td>
                <td className="p-2.5 text-outline">{r.timestampUTC}</td>
                <td className="p-2.5 text-on-surface font-sans">{r.actor}</td>
                <td className="p-2.5 font-bold text-primary">
                  <span className="bg-surface-container px-1.5 py-0.5 rounded-[2px] border border-surface-high">
                    {r.action}
                  </span>
                </td>
                <td className="p-2.5 text-on-surface-variant font-medium">{r.targetResource}</td>
                <td className="p-2.5 text-outline text-[9px]">{r.originEndpoint}</td>
                <td className="p-2.5 text-center">
                  <span
                    className={cn(
                      'px-1.5 py-0.5 rounded-[2px] font-bold text-[8px] border',
                      r.status === 'SUCCESS'
                        ? 'text-advisory border-advisory/40 bg-advisory/10'
                        : 'text-warning border-warning/40 bg-warning/10'
                    )}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
