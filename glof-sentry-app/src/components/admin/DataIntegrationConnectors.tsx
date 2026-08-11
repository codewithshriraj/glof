'use client';

import React, { useState } from 'react';
import { AgencyConnector } from '@/lib/types/glof';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

interface DataIntegrationConnectorsProps {
  connectors: AgencyConnector[];
  onSyncConnector: (connectorId: string) => void;
  onRotateKey: (connectorId: string) => void;
  className?: string;
}

export const DataIntegrationConnectors: React.FC<DataIntegrationConnectorsProps> = ({
  connectors,
  onSyncConnector,
  onRotateKey,
  className,
}) => {
  const [selectedConnectorId, setSelectedConnectorId] = useState<string>(connectors[0]?.id || '');
  const selectedConn = connectors.find((c) => c.id === selectedConnectorId) || connectors[0];

  const onlineCount = connectors.filter((c) => c.status === 'ONLINE').length;
  const degradedCount = connectors.filter((c) => c.status === 'DEGRADED').length;

  return (
    <div className={cn('space-y-4 font-mono text-[11px]', className)}>
      {/* Overview Status Banner */}
      <div className="data-card hud-border p-3 rounded-[4px] bg-surface-container-low flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <Icon name="hub" size="sm" className="text-secondary" />
          <div>
            <span className="font-sans font-bold text-on-surface text-[13px] uppercase block">
              NATIONAL & INTERNATIONAL AGENCY DATA INGEST PIPELINES
            </span>
            <span className="text-outline text-[10px]">
              Active real-time connectors for satellite radar, hydrometric telemetry, and weather Doppler
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[10px]">
          <div className="flex items-center gap-1.5 bg-surface-container px-2 py-1 rounded border border-surface-high">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-on-surface font-bold">{onlineCount} NOMINAL</span>
          </div>
          {degradedCount > 0 && (
            <div className="flex items-center gap-1.5 bg-error/10 px-2 py-1 rounded border border-error/30">
              <span className="w-2 h-2 rounded-full bg-error" />
              <span className="text-error font-bold">{degradedCount} DEGRADED</span>
            </div>
          )}
        </div>
      </div>

      {/* Grid: Connectors Bento Grid (7 cols) + Selected Connector Inspector (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Connector Cards Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-3">
          {connectors.map((conn) => (
            <div
              key={conn.id}
              onClick={() => setSelectedConnectorId(conn.id)}
              className={cn(
                'data-card hud-border p-3.5 rounded-[4px] flex flex-col justify-between cursor-pointer transition-all hover:bg-surface-container-high/60',
                selectedConnectorId === conn.id ? 'border-secondary ring-1 ring-secondary/40 bg-surface-container-high' : '',
                conn.status === 'DEGRADED' ? 'border-error/40 shadow-[inset_0_0_15px_rgba(255,180,171,0.05)]' : ''
              )}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <Icon
                      name={conn.category === 'SATELLITE_SAR' ? 'satellite_alt' : conn.category === 'HYDROLOGY' ? 'water_drop' : 'cloud'}
                      size="xs"
                      className={conn.status === 'DEGRADED' ? 'text-error' : 'text-secondary'}
                    />
                    <span className="font-sans font-bold text-on-surface text-[12px] uppercase">
                      {conn.agency}
                    </span>
                  </div>
                  <span
                    className={cn(
                      'px-1.5 py-0.5 rounded-[2px] font-bold text-[8px] border',
                      conn.status === 'ONLINE'
                        ? 'text-advisory border-advisory/40 bg-advisory/10'
                        : conn.status === 'DEGRADED'
                        ? 'text-error border-error/40 bg-error/10'
                        : 'text-outline border-surface-high'
                    )}
                  >
                    {conn.status}
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="font-sans text-[11px] font-medium text-on-surface-variant line-clamp-1">
                    {conn.name}
                  </div>
                  <div className="flex justify-between items-baseline border-b border-surface-high pb-1.5 text-[10px]">
                    <span className="text-outline">LATENCY</span>
                    <span className={cn('font-bold', conn.latencyMs > 500 ? 'text-error' : 'text-secondary')}>
                      {conn.latencyMs} ms
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-surface-high pb-1.5 text-[10px]">
                    <span className="text-outline">SYNC RATE</span>
                    <span className="font-bold text-on-surface">{conn.syncRatePct}%</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-surface-high flex justify-between items-center text-[9px] text-outline">
                <span>THROUGHPUT: {conn.packetThroughputKBs} KB/s</span>
                <span className="text-secondary hover:underline">DETAILS &rarr;</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Selected Connector Workstation */}
        <div className="lg:col-span-5 data-card hud-border rounded-[4px] p-4 flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <div className="flex justify-between items-start hud-border-b pb-2">
              <div>
                <span className="font-sans font-bold text-on-surface text-[14px] block">
                  {selectedConn.name}
                </span>
                <span className="text-outline text-[10px]">ID: {selectedConn.id} · PROTOCOL: {selectedConn.protocol}</span>
              </div>
              <span className="font-bold text-secondary text-[12px] bg-secondary/10 px-2 py-0.5 rounded border border-secondary/30">
                {selectedConn.agency}
              </span>
            </div>

            <p className="text-[10px] text-on-surface-variant leading-relaxed bg-surface-container-lowest p-2.5 rounded hud-border">
              {selectedConn.description}
            </p>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-surface-container-lowest p-2 rounded hud-border">
                <span className="text-outline text-[9px] block">PING LATENCY</span>
                <span className={cn('font-bold text-[13px]', selectedConn.latencyMs > 500 ? 'text-error' : 'text-secondary')}>
                  {selectedConn.latencyMs} ms
                </span>
              </div>
              <div className="bg-surface-container-lowest p-2 rounded hud-border">
                <span className="text-outline text-[9px] block">SYNC EFFICIENCY</span>
                <span className="font-bold text-[13px] text-on-surface">{selectedConn.syncRatePct}%</span>
              </div>
              <div className="bg-surface-container-lowest p-2 rounded hud-border col-span-2">
                <span className="text-outline text-[9px] block">DATA FEED INGEST ENDPOINT</span>
                <span className="text-secondary text-[10px] truncate block">{selectedConn.dataFeedUrl}</span>
              </div>
              <div className="bg-surface-container-lowest p-2 rounded hud-border col-span-2">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-outline text-[9px]">ACTIVE AUTH KEY ID</span>
                  <span className="text-[8px] text-advisory font-bold">HMAC-SHA256</span>
                </div>
                <div className="text-on-surface font-mono text-[10px] bg-background p-1.5 rounded truncate">
                  {selectedConn.activeKeyMasked}
                </div>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="pt-3 hud-border-t flex flex-wrap justify-between items-center gap-2">
            <Button
              onClick={() => onRotateKey(selectedConn.id)}
              variant="outline"
              size="sm"
              className="font-bold"
            >
              <Icon name="key" size="xs" />
              ROTATE API KEY
            </Button>

            <Button
              onClick={() => onSyncConnector(selectedConn.id)}
              variant="primary"
              size="sm"
              className="font-bold"
            >
              <Icon name="sync" size="xs" />
              TRIGGER MANUAL SYNC
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
