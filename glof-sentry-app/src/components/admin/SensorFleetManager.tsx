'use client';

import React, { useState } from 'react';
import { SensorFleetNode } from '@/lib/types/glof';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

interface SensorFleetManagerProps {
  nodes: SensorFleetNode[];
  onCalibrateNode: (nodeId: string) => void;
  onRegisterNode: (node: SensorFleetNode) => void;
  className?: string;
}

export const SensorFleetManager: React.FC<SensorFleetManagerProps> = ({
  nodes,
  onCalibrateNode,
  onRegisterNode,
  className,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(nodes[0]?.id || '');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [showRegisterForm, setShowRegisterForm] = useState<boolean>(false);

  // New Node Form State
  const [newCode, setNewCode] = useState<string>('WL-STAGE-05');
  const [newName, setNewName] = useState<string>('Teesta Stage IV Siphon Sounder');
  const [newLake, setNewLake] = useState<string>('South Lhonak Lake');
  const [newCategory, setNewCategory] = useState<SensorFleetNode['category']>('WATER_LEVEL');
  const [newUplink, setNewUplink] = useState<SensorFleetNode['uplinkType']>('IRIDIUM_SATELLITE');

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  const filteredNodes = nodes.filter((n) =>
    categoryFilter === 'ALL' ? true : n.category === categoryFilter
  );

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newNode: SensorFleetNode = {
      id: `SN-NODE-014-${nodes.length + 1}`,
      code: newCode,
      name: newName,
      category: newCategory,
      lakeId: 'south-lhonak',
      lakeName: newLake,
      region: 'North Sikkim, India',
      status: 'ONLINE',
      batteryPct: 100,
      signalDbm: -64,
      uplinkType: newUplink,
      samplingIntervalSec: 60,
      lastReading: '5,241.00 m (Calibrated Stage)',
      numericValue: 5241.0,
      unit: 'm',
      lastPingUTC: '14:36:00 UTC',
      lastCalibrationDate: '2026-08-10',
      firmwareVersion: 'v4.2.0-GLOF',
      packetLossPct: 0.0,
      rawPacketSample: '0xFA140208C94A0000000000000000000000000000',
    };
    onRegisterNode(newNode);
    setSelectedNodeId(newNode.id);
    setShowRegisterForm(false);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Category Filter Toolbar & Actions */}
      <div className="flex flex-wrap justify-between items-center gap-2 font-mono text-[11px]">
        <div className="flex flex-wrap gap-1">
          {(['ALL', 'WATER_LEVEL', 'DEFORMATION', 'WEATHER', 'SEISMIC', 'THERMAL'] as const).map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                'px-2.5 py-1 rounded-[2px] font-bold border transition-colors touch-manipulation cursor-pointer min-h-[32px]',
                categoryFilter === cat
                  ? 'bg-secondary/20 text-secondary border-secondary'
                  : 'bg-surface-container text-outline border-surface-high hover:text-on-surface'
              )}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        <Button
          onClick={() => setShowRegisterForm(!showRegisterForm)}
          variant={showRegisterForm ? 'outline' : 'primary'}
          size="sm"
          className="font-bold"
        >
          <Icon name={showRegisterForm ? 'close' : 'add'} size="xs" />
          {showRegisterForm ? 'CANCEL REGISTRATION' : 'REGISTER SENSOR NODE'}
        </Button>
      </div>

      {/* Registration Form Modal/Card */}
      {showRegisterForm && (
        <form
          onSubmit={handleRegisterSubmit}
          className="data-card hud-border p-4 rounded-[4px] bg-surface-container-low/90 space-y-3 font-mono text-[11px]"
        >
          <div className="flex justify-between items-center hud-border-b pb-2">
            <span className="font-sans text-[12px] font-bold text-secondary uppercase">
              NEW IoT TELEMETRY NODE PROVISIONING
            </span>
            <span className="text-outline text-[10px]">* DEMO REGISTRATION</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-outline text-[10px] block mb-1">NODE CODE / CALLSIGN</label>
              <input
                type="text"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                className="w-full bg-surface-container-lowest hud-border text-on-surface p-2 rounded-[2px] outline-none focus:border-secondary"
                required
              />
            </div>
            <div>
              <label className="text-outline text-[10px] block mb-1">STATION NAME</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-surface-container-lowest hud-border text-on-surface p-2 rounded-[2px] outline-none focus:border-secondary"
                required
              />
            </div>
            <div>
              <label className="text-outline text-[10px] block mb-1">TARGET GLACIAL LAKE</label>
              <input
                type="text"
                value={newLake}
                onChange={(e) => setNewLake(e.target.value)}
                className="w-full bg-surface-container-lowest hud-border text-on-surface p-2 rounded-[2px] outline-none focus:border-secondary"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-outline text-[10px] block mb-1">SENSOR CATEGORY</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as SensorFleetNode['category'])}
                className="w-full bg-surface-container-lowest hud-border text-on-surface p-2 rounded-[2px] outline-none focus:border-secondary"
              >
                <option value="WATER_LEVEL">WATER_LEVEL (Acoustic / Radar Stage)</option>
                <option value="DEFORMATION">DEFORMATION (GNSS / Piezometer)</option>
                <option value="WEATHER">WEATHER (AWS Climate Station)</option>
                <option value="SEISMIC">SEISMIC (Broadband Cryo-Seismo)</option>
                <option value="THERMAL">THERMAL (Thermal Optical Camera)</option>
              </select>
            </div>
            <div>
              <label className="text-outline text-[10px] block mb-1">TELEMETRY UPLINK PROTOCOL</label>
              <select
                value={newUplink}
                onChange={(e) => setNewUplink(e.target.value as SensorFleetNode['uplinkType'])}
                className="w-full bg-surface-container-lowest hud-border text-on-surface p-2 rounded-[2px] outline-none focus:border-secondary"
              >
                <option value="IRIDIUM_SATELLITE">IRIDIUM_SATELLITE (SBD Transceiver)</option>
                <option value="LORA_WAN">LORA_WAN (915 MHz Gateway Relay)</option>
                <option value="CELLULAR_4G">CELLULAR_4G (High-Altitude LTE Band)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="sm" className="font-bold">
              <Icon name="save" size="xs" />
              CONFIRM & PROVISION NODE
            </Button>
          </div>
        </form>
      )}

      {/* Main Grid: Sensor Roster Table (7 cols) + Selected Node Telemetry Dossier (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Table: Sensor Roster */}
        <div className="lg:col-span-7 data-card hud-border rounded-[4px] flex flex-col overflow-hidden">
          <div className="p-3 hud-border-b bg-surface-container-low/80 flex justify-between items-center font-mono text-[11px]">
            <div className="flex items-center gap-2">
              <Icon name="sensors" size="xs" className="text-secondary" />
              <span className="font-sans font-bold text-on-surface uppercase">
                GROUND SENSOR FLEET ROSTER ({filteredNodes.length} NODES)
              </span>
            </div>
            <span className="text-[10px] text-outline">AUTO-SYNC: 10s</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[10px] border-collapse min-w-[640px]">
              <thead>
                <tr className="bg-surface-container-lowest/80 text-outline text-[9px] uppercase tracking-wider hud-border-b">
                  <th className="p-2.5">CALLSIGN</th>
                  <th className="p-2.5">STATION NAME</th>
                  <th className="p-2.5">LAKE</th>
                  <th className="p-2.5">STATUS</th>
                  <th className="p-2.5 text-center">BATTERY</th>
                  <th className="p-2.5 text-right">LAST READING</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-high">
                {filteredNodes.map((n) => (
                  <tr
                    key={n.id}
                    onClick={() => setSelectedNodeId(n.id)}
                    className={cn(
                      'cursor-pointer transition-colors hover:bg-surface-container-high/60',
                      selectedNodeId === n.id ? 'bg-surface-container-high border-l-2 border-l-secondary' : ''
                    )}
                  >
                    <td className="p-2.5 font-bold text-secondary">{n.code}</td>
                    <td className="p-2.5 text-on-surface font-sans">{n.name}</td>
                    <td className="p-2.5 text-outline truncate max-w-[120px]">{n.lakeName}</td>
                    <td className="p-2.5">
                      <span
                        className={cn(
                          'px-1.5 py-0.5 rounded-[2px] font-bold text-[8px] border',
                          n.status === 'ONLINE'
                            ? 'text-advisory border-advisory/40 bg-advisory/10'
                            : n.status === 'DEGRADED'
                            ? 'text-warning border-warning/40 bg-warning/10'
                            : 'text-critical border-critical/40 bg-critical/10'
                        )}
                      >
                        {n.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-center font-bold text-on-surface">
                      <span className={cn(n.batteryPct < 50 ? 'text-warning' : 'text-advisory')}>
                        {n.batteryPct}%
                      </span>
                    </td>
                    <td className="p-2.5 text-right text-on-surface-variant font-bold">
                      {n.lastReading}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel: Selected Node Telemetry & Calibration Workstation */}
        <div className="lg:col-span-5 data-card hud-border rounded-[4px] p-4 flex flex-col gap-4 font-mono text-[11px]">
          <div className="flex justify-between items-center hud-border-b pb-2">
            <div>
              <div className="font-sans text-[14px] font-bold text-on-surface">{selectedNode.name}</div>
              <div className="text-outline text-[10px]">ID: {selectedNode.id} · {selectedNode.region}</div>
            </div>
            <span className="font-bold text-secondary text-[12px] bg-secondary/10 px-2 py-0.5 rounded-[2px] border border-secondary/30">
              {selectedNode.code}
            </span>
          </div>

          {/* Telemetry Metrics Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-surface-container-lowest p-2.5 hud-border rounded-[2px]">
              <span className="text-outline text-[9px] block mb-0.5">UPLINK CARRIER</span>
              <span className="font-bold text-secondary text-[11px] flex items-center gap-1">
                <Icon name="cell_tower" size="xs" />
                {selectedNode.uplinkType.replace('_', ' ')}
              </span>
            </div>
            <div className="bg-surface-container-lowest p-2.5 hud-border rounded-[2px]">
              <span className="text-outline text-[9px] block mb-0.5">SIGNAL POWER</span>
              <span className="font-bold text-on-surface text-[11px]">{selectedNode.signalDbm} dBm (RSSI)</span>
            </div>
            <div className="bg-surface-container-lowest p-2.5 hud-border rounded-[2px]">
              <span className="text-outline text-[9px] block mb-0.5">SAMPLING FREQUENCY</span>
              <span className="font-bold text-on-surface text-[11px]">Every {selectedNode.samplingIntervalSec}s</span>
            </div>
            <div className="bg-surface-container-lowest p-2.5 hud-border rounded-[2px]">
              <span className="text-outline text-[9px] block mb-0.5">PACKET LOSS</span>
              <span className="font-bold text-advisory text-[11px]">{selectedNode.packetLossPct}%</span>
            </div>
          </div>

          {/* Current Reading Hero */}
          <div className="bg-surface-container-high p-3 hud-border rounded-[3px]">
            <div className="text-outline text-[9px] uppercase mb-1">LATEST STAGE / TELEMETRY READOUT</div>
            <div className="font-sans text-[18px] font-bold text-secondary">
              {selectedNode.lastReading}
            </div>
            <div className="text-outline text-[10px] mt-1 flex justify-between">
              <span>PING: {selectedNode.lastPingUTC}</span>
              <span>CALIB: {selectedNode.lastCalibrationDate}</span>
            </div>
          </div>

          {/* Raw Packet Stream View */}
          <div className="bg-surface-container-lowest p-2.5 hud-border rounded-[2px] flex flex-col gap-1">
            <div className="flex justify-between items-center text-[9px] text-outline">
              <span className="font-bold uppercase">RAW TELEMETRY PACKET HEX</span>
              <span className="text-secondary">CRC32 OK</span>
            </div>
            <div className="text-[10px] text-on-surface-variant font-mono bg-background p-1.5 rounded break-all">
              {selectedNode.rawPacketSample}
            </div>
          </div>

          {/* Calibration Action */}
          <div className="pt-2 hud-border-t flex justify-between items-center">
            <div className="text-[9px] text-outline">
              FIRMWARE: {selectedNode.firmwareVersion}
            </div>
            <Button
              onClick={() => onCalibrateNode(selectedNode.id)}
              variant="outline"
              size="sm"
              className="font-bold"
            >
              <Icon name="tune" size="xs" />
              TRIGGER ZERO-CALIBRATION
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
