import React from 'react';
import { LakeSensorStation } from '@/lib/types/glof';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils/cn';

interface SensorStatusPanelProps {
  sensors: LakeSensorStation[];
  className?: string;
}

export const SensorStatusPanel: React.FC<SensorStatusPanelProps> = ({
  sensors,
  className,
}) => {
  return (
    <div className={cn('data-card hud-border flex flex-col rounded-[4px]', className)}>
      {/* Header */}
      <div className="p-3 hud-border-b bg-surface-container-low/80 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <Icon name="sensors" size="xs" className="text-secondary" />
          <span className="font-sans text-[11px] font-bold tracking-wider text-on-surface uppercase">
            GROUND SENSOR TELEMETRY ARRAY
          </span>
          <span className="font-mono text-[9px] text-secondary bg-secondary/10 px-1.5 py-0.5 rounded-[2px] hud-border">
            {sensors.filter((s) => s.status === 'ONLINE').length}/{sensors.length} ACTIVE
          </span>
        </div>
        <div className="font-mono text-[9px] text-outline flex items-center gap-2">
          <span>UPLINK: IRIDIUM SBD</span>
          <span className="text-primary font-bold bg-primary/10 px-1.5 py-0.5 rounded-[2px] border border-primary/30">
            DEMO TELEMETRY
          </span>
        </div>
      </div>

      {/* Sensor Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-[11px] border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-surface-container-lowest/80 text-outline text-[9px] uppercase tracking-wider hud-border-b">
              <th className="p-2.5">SENSOR CODE</th>
              <th className="p-2.5">STATION NAME</th>
              <th className="p-2.5">CATEGORY</th>
              <th className="p-2.5">LAST READING</th>
              <th className="p-2.5">TIMESTAMP (UTC)</th>
              <th className="p-2.5">SIGNAL</th>
              <th className="p-2.5">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-high">
            {sensors.map((sensor) => {
              const isOnline = sensor.status === 'ONLINE';
              const isDegraded = sensor.status === 'DEGRADED';

              return (
                <tr
                  key={sensor.id}
                  className="hover:bg-surface-container-high/60 transition-colors"
                >
                  <td className="p-2.5 font-bold text-secondary">{sensor.code}</td>
                  <td className="p-2.5 font-sans text-on-surface font-medium">{sensor.name}</td>
                  <td className="p-2.5">
                    <span className="text-outline bg-surface-container px-1.5 py-0.5 rounded-[2px] text-[10px]">
                      {sensor.category}
                    </span>
                  </td>
                  <td className="p-2.5 font-bold text-on-surface">
                    {sensor.lastReading}
                  </td>
                  <td className="p-2.5 text-on-surface-variant">{sensor.timestampUTC}</td>
                  <td className="p-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 h-1.5 bg-surface-container-high rounded-[1px] overflow-hidden">
                        <div
                          className={cn(
                            'h-full',
                            sensor.signalQualityPct > 80 ? 'bg-secondary' : 'bg-warning'
                          )}
                          style={{ width: `${sensor.signalQualityPct}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-outline">{sensor.signalQualityPct}%</span>
                    </div>
                  </td>
                  <td className="p-2.5">
                    <span
                      className={cn(
                        'font-bold text-[9px] px-2 py-0.5 rounded-[2px] border inline-flex items-center gap-1',
                        isOnline
                          ? 'text-advisory border-advisory/40 bg-advisory/10'
                          : isDegraded
                          ? 'text-warning border-warning/40 bg-warning/10'
                          : 'text-critical border-critical/40 bg-critical/10'
                      )}
                    >
                      <span
                        className={cn(
                          'w-1.5 h-1.5 rounded-full',
                          isOnline ? 'bg-advisory pulse-dot' : 'bg-warning'
                        )}
                      />
                      {sensor.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
