'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { AdminHeader, AdminTab } from '@/components/admin/AdminHeader';
import { SensorFleetManager } from '@/components/admin/SensorFleetManager';
import { SatelliteIntelligenceView } from '@/components/admin/SatelliteIntelligenceView';
import { DataIntegrationConnectors } from '@/components/admin/DataIntegrationConnectors';
import { SystemConfigurationConsole } from '@/components/admin/SystemConfigurationConsole';
import { UserAccessManager } from '@/components/admin/UserAccessManager';
import { ModelAuditTrailView } from '@/components/admin/ModelAuditTrailView';
import { PlatformAuditLogView } from '@/components/admin/PlatformAuditLogView';
import { ReportExportPanel } from '@/components/admin/ReportExportPanel';

import { mockSensorFleetNodes } from '@/lib/mock/sensor-fleet-data';
import { mockSatellitePasses } from '@/lib/mock/satellite-data';
import { mockAgencyConnectors } from '@/lib/mock/integration-data';
import { initialSystemConfig } from '@/lib/mock/config-data';
import { mockOperatorAccounts } from '@/lib/mock/operator-data';
import { mockModelAuditEntries, mockPlatformAuditRecords } from '@/lib/mock/audit-data';
import { mockReportExports } from '@/lib/mock/report-data';

import {
  SensorFleetNode,
  SatellitePassInfo,
  AgencyConnector,
  SystemConfigState,
  UserOperatorAccount,
  PlatformAuditRecord,
  ReportExportRequest,
} from '@/lib/types/glof';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('sensors');
  const [sensorNodes, setSensorNodes] = useState<SensorFleetNode[]>(mockSensorFleetNodes);
  const [satellites, setSatellites] = useState<SatellitePassInfo[]>(mockSatellitePasses);
  const [connectors, setConnectors] = useState<AgencyConnector[]>(mockAgencyConnectors);
  const [systemConfig, setSystemConfig] = useState<SystemConfigState>(initialSystemConfig);
  const [operators, setOperators] = useState<UserOperatorAccount[]>(mockOperatorAccounts);
  const [auditRecords, setAuditRecords] = useState<PlatformAuditRecord[]>(mockPlatformAuditRecords);
  const [reports, setReports] = useState<ReportExportRequest[]>(mockReportExports);

  // Sensor Calibration Action Handler
  const handleCalibrateNode = (nodeId: string) => {
    setSensorNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              status: 'ONLINE',
              batteryPct: Math.min(100, n.batteryPct + 5),
              lastCalibrationDate: '2026-08-10 (Calibrated)',
              packetLossPct: 0.0,
            }
          : n
      )
    );

    const newLog: PlatformAuditRecord = {
      id: `AUD-2026-${1045 + auditRecords.length}`,
      timestampUTC: '14:37:10 UTC',
      actor: 'DEMO OPS-04 (Lead Controller)',
      action: 'SENSOR_NODE_CALIBRATION_TRIGGER',
      targetResource: nodeId,
      originEndpoint: 'DEMO SEOC NOC (TERMINAL 04)',
      status: 'SUCCESS',
      details: `Triggered zero-offset recalibration cycle for node ${nodeId}. Status restored to ONLINE.`,
    };
    setAuditRecords((prev) => [newLog, ...prev]);
  };

  // Sensor Registration Handler
  const handleRegisterNode = (newNode: SensorFleetNode) => {
    setSensorNodes((prev) => [newNode, ...prev]);
    const newLog: PlatformAuditRecord = {
      id: `AUD-2026-${1045 + auditRecords.length}`,
      timestampUTC: '14:37:25 UTC',
      actor: 'DEMO OPS-04 (Lead Controller)',
      action: 'SENSOR_NODE_PROVISIONED',
      targetResource: `${newNode.id} // ${newNode.code}`,
      originEndpoint: 'DEMO SEOC NOC (TERMINAL 04)',
      status: 'SUCCESS',
      details: `Provisioned new IoT telemetry station ${newNode.name} on ${newNode.lakeName}.`,
    };
    setAuditRecords((prev) => [newLog, ...prev]);
  };

  // Satellite Reprocess Action Handler
  const handleTriggerReprocess = (satId: string) => {
    setSatellites((prev) =>
      prev.map((s) =>
        s.id === satId
          ? {
              ...s,
              pipelineProgressPct: 100,
              agreementPct: Math.min(99.5, s.agreementPct + 0.5),
            }
          : s
      )
    );

    const newLog: PlatformAuditRecord = {
      id: `AUD-2026-${1045 + auditRecords.length}`,
      timestampUTC: '14:37:40 UTC',
      actor: 'DEMO OPS-04 (Lead Controller)',
      action: 'SATELLITE_PASS_REPROCESS_PIPELINE',
      targetResource: satId,
      originEndpoint: 'DEMO SEOC NOC (TERMINAL 04)',
      status: 'SUCCESS',
      details: `Initiated L2A interferogram and surface area reprocessing on ${satId}.`,
    };
    setAuditRecords((prev) => [newLog, ...prev]);
  };

  // Agency Connector Sync Trigger
  const handleSyncConnector = (connectorId: string) => {
    setConnectors((prev) =>
      prev.map((c) =>
        c.id === connectorId
          ? {
              ...c,
              status: 'ONLINE',
              syncRatePct: 100,
              latencyMs: Math.min(c.latencyMs, 65),
              lastSyncUTC: '14:38:12 UTC',
            }
          : c
      )
    );

    const newLog: PlatformAuditRecord = {
      id: `AUD-2026-${1045 + auditRecords.length}`,
      timestampUTC: '14:38:12 UTC',
      actor: 'DEMO OPS-04 (Lead Controller)',
      action: 'AGENCY_INGEST_MANUAL_SYNC',
      targetResource: connectorId,
      originEndpoint: 'DEMO SEOC NOC (TERMINAL 04)',
      status: 'SUCCESS',
      details: `Synchronized telemetry pipeline and cleared buffer latency for ${connectorId}.`,
    };
    setAuditRecords((prev) => [newLog, ...prev]);
  };

  // API Key Rotation
  const handleRotateKey = (connectorId: string) => {
    setConnectors((prev) =>
      prev.map((c) =>
        c.id === connectorId
          ? {
              ...c,
              activeKeyMasked: `${c.activeKeyMasked.slice(0, 8)}...rot_${Math.floor(c.latencyMs * 11)}`,
            }
          : c
      )
    );

    const newLog: PlatformAuditRecord = {
      id: `AUD-2026-${1045 + auditRecords.length}`,
      timestampUTC: '14:38:25 UTC',
      actor: 'DEMO OPS-04 (Lead Controller)',
      action: 'API_KEY_ROTATION_APPLIED',
      targetResource: connectorId,
      originEndpoint: 'DEMO SEOC NOC (TERMINAL 04)',
      status: 'SUCCESS',
      details: `Rotated HMAC secret token for agency gateway ${connectorId}.`,
    };
    setAuditRecords((prev) => [newLog, ...prev]);
  };

  // System Configuration Commit
  const handleCommitConfig = (updated: SystemConfigState) => {
    setSystemConfig(updated);

    const newLog: PlatformAuditRecord = {
      id: `AUD-2026-${1045 + auditRecords.length}`,
      timestampUTC: updated.lastCommittedUTC,
      actor: 'DEMO OPS-04 (Lead Controller)',
      action: 'SYSTEM_CONFIGURATION_COMMITTED',
      targetResource: 'GLOBAL_SYSTEM_PARAMS',
      originEndpoint: 'DEMO SEOC NOC (TERMINAL 04)',
      status: 'SUCCESS',
      details: `Updated risk tier thresholds (Amber: ${updated.amberThreshold.toFixed(3)}, Red: ${updated.redThreshold.toFixed(3)}) and failover mode (${updated.failoverMode}).`,
    };
    setAuditRecords((prev) => [newLog, ...prev]);
  };

  // Operator Duty Status Toggle
  const handleToggleOperatorStatus = (operatorId: string) => {
    setOperators((prev) =>
      prev.map((op) =>
        op.id === operatorId
          ? {
              ...op,
              status: op.status === 'ACTIVE' ? 'STANDBY' : 'ACTIVE',
            }
          : op
      )
    );

    const newLog: PlatformAuditRecord = {
      id: `AUD-2026-${1045 + auditRecords.length}`,
      timestampUTC: '14:38:40 UTC',
      actor: 'DEMO OPS-04 (Lead Controller)',
      action: 'OPERATOR_DUTY_STATUS_CHANGED',
      targetResource: operatorId,
      originEndpoint: 'DEMO SEOC NOC (TERMINAL 04)',
      status: 'SUCCESS',
      details: `Toggled duty status for operator account ${operatorId}.`,
    };
    setAuditRecords((prev) => [newLog, ...prev]);
  };

  // Operator MFA Toggle
  const handleToggleMfa = (operatorId: string) => {
    setOperators((prev) =>
      prev.map((op) =>
        op.id === operatorId
          ? {
              ...op,
              mfaEnabled: !op.mfaEnabled,
            }
          : op
      )
    );

    const newLog: PlatformAuditRecord = {
      id: `AUD-2026-${1045 + auditRecords.length}`,
      timestampUTC: '14:38:50 UTC',
      actor: 'DEMO OPS-04 (Lead Controller)',
      action: 'OPERATOR_MFA_POLICY_TOGGLED',
      targetResource: operatorId,
      originEndpoint: 'DEMO SEOC NOC (TERMINAL 04)',
      status: 'SUCCESS',
      details: `Toggled FIDO2 MFA enforcement for operator account ${operatorId}.`,
    };
    setAuditRecords((prev) => [newLog, ...prev]);
  };

  // Report Export Generation Handler
  const handleGenerateReport = (newReport: ReportExportRequest) => {
    setReports((prev) => [newReport, ...prev]);

    const newLog: PlatformAuditRecord = {
      id: `AUD-2026-${1045 + auditRecords.length}`,
      timestampUTC: newReport.generatedAtUTC,
      actor: 'DEMO OPS-04 (Lead Controller)',
      action: 'GLOF_REPORT_DOSSIER_COMPILED',
      targetResource: `${newReport.id} // ${newReport.title}`,
      originEndpoint: 'DEMO SEOC NOC (TERMINAL 04)',
      status: 'SUCCESS',
      details: `Compiled automated ${newReport.format} incident dossier package for ${newReport.lakeName}.`,
    };
    setAuditRecords((prev) => [newLog, ...prev]);
  };

  const onlineSensorsCount = sensorNodes.filter((n) => n.status === 'ONLINE').length;
  const activeSatellitesCount = satellites.filter((s) => s.status === 'ACTIVE_NOMINAL').length;
  const activeConnectorsCount = connectors.filter((c) => c.status === 'ONLINE').length;

  return (
    <AppShell>
      <div className="space-y-4">
        {/* Master Admin Header with Tab Navigation */}
        <AdminHeader
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onlineSensorsCount={onlineSensorsCount}
          totalSensorsCount={sensorNodes.length}
          activeSatellitesCount={activeSatellitesCount}
          activeConnectorsCount={activeConnectorsCount}
        />

        {/* Tab 1: Sensor Fleet Management */}
        {activeTab === 'sensors' && (
          <SensorFleetManager
            nodes={sensorNodes}
            onCalibrateNode={handleCalibrateNode}
            onRegisterNode={handleRegisterNode}
          />
        )}

        {/* Tab 2: Satellite Intelligence & Fusion */}
        {activeTab === 'satellite' && (
          <SatelliteIntelligenceView
            satellites={satellites}
            onTriggerReprocess={handleTriggerReprocess}
          />
        )}

        {/* Tab 3: Agency Data Feeds & Ingest Pipelines (Phase 7) */}
        {activeTab === 'integrations' && (
          <DataIntegrationConnectors
            connectors={connectors}
            onSyncConnector={handleSyncConnector}
            onRotateKey={handleRotateKey}
          />
        )}

        {/* Tab 4: System Configuration & Thresholds (Phase 7) */}
        {activeTab === 'config' && (
          <SystemConfigurationConsole
            config={systemConfig}
            onCommitConfig={handleCommitConfig}
            onResetDefaults={() => setSystemConfig(initialSystemConfig)}
          />
        )}

        {/* Tab 5: Operator Access & Jurisdiction (Phase 7) */}
        {activeTab === 'access' && (
          <UserAccessManager
            operators={operators}
            onToggleStatus={handleToggleOperatorStatus}
            onToggleMfa={handleToggleMfa}
          />
        )}

        {/* Tab 6: Model & Platform Audit Logs */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <ModelAuditTrailView auditEntries={mockModelAuditEntries} />
            <PlatformAuditLogView auditRecords={auditRecords} />
          </div>
        )}

        {/* Tab 7: Report & CAP Export Workstation */}
        {activeTab === 'reports' && (
          <ReportExportPanel
            reports={reports}
            onGenerateReport={handleGenerateReport}
          />
        )}
      </div>
    </AppShell>
  );
}
