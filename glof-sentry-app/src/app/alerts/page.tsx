'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { AlertOperationsHeader } from '@/components/alerts/AlertOperationsHeader';
import { AlertDashboardSummary } from '@/components/alerts/AlertDashboardSummary';
import { AlertQueue } from '@/components/alerts/AlertQueue';
import { AlertDetailPanel } from '@/components/alerts/AlertDetailPanel';
import { AlertTimeline } from '@/components/alerts/AlertTimeline';
import { mockOperationalAlerts, mockAlertTimelines } from '@/lib/mock/alert-data';
import { mockActiveDispatchOrders, mockResponseTeams, mockEvacuationZones } from '@/lib/mock/dispatch-data';
import { mockSimulatedDeliveries } from '@/lib/mock/notification-data';
import { OperationalAlert, AlertTimelineEvent } from '@/lib/types/glof';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<OperationalAlert[]>(mockOperationalAlerts);
  const [selectedAlertId, setSelectedAlertId] = useState<string>(mockOperationalAlerts[0].id);
  const [timelines, setTimelines] = useState<Record<string, AlertTimelineEvent[]>>(mockAlertTimelines);

  const selectedAlert = alerts.find((a) => a.id === selectedAlertId) || alerts[0];
  const activeTimeline = timelines[selectedAlertId] || [
    {
      id: 'default-tl-1',
      alertId: selectedAlertId,
      timestampUTC: selectedAlert.createdAtUTC,
      actor: 'SYSTEM // GSI ENGINE',
      action: `INCIDENT LOGGED [${selectedAlert.severity}]`,
      details: selectedAlert.triggerCondition,
      severity: selectedAlert.severity === 'L4' ? 'critical' : 'warn',
    },
  ];

  const handleUpdateStatus = (
    alertId: string,
    nextStatus: OperationalAlert['status'],
    note?: string
  ) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              status: nextStatus,
              operatorNote: note || a.operatorNote,
            }
          : a
      )
    );

    // Append event to timeline
    const existingEvents = timelines[alertId] || [];
    const newEvent: AlertTimelineEvent = {
      id: `tl-evt-${alertId}-${existingEvents.length + 1}`,
      alertId,
      timestampUTC: '14:35:10 UTC',
      actor: 'DEMO OPS-04 (Lead Controller)',
      action: `STATUS TRANSITIONED TO ${nextStatus}`,
      details: note || `Operator updated incident status to ${nextStatus}.`,
      severity: nextStatus === 'ESCALATED' ? 'critical' : 'info',
    };

    setTimelines((prev) => ({
      ...prev,
      [alertId]: [...(prev[alertId] || []), newEvent],
    }));
  };

  const activeAlertsCount = alerts.filter((a) => a.status !== 'RESOLVED').length;
  const criticalCount = alerts.filter((a) => a.severity === 'L4').length;
  const unackCount = alerts.filter((a) => a.status === 'NEW').length;
  const escalatedCount = alerts.filter((a) => a.status === 'ESCALATED').length;

  return (
    <AppShell>
      <div className="space-y-4">
        {/* Operations Header */}
        <AlertOperationsHeader
          activeCount={alerts.length}
          criticalCount={criticalCount}
          unacknowledgedCount={unackCount}
        />

        {/* Dashboard Summary KPIs (8 metrics) */}
        <AlertDashboardSummary
          activeAlertsCount={activeAlertsCount}
          criticalCount={criticalCount}
          unacknowledgedCount={unackCount}
          escalatedCount={escalatedCount}
          activeDispatchesCount={mockActiveDispatchOrders.length}
          simulatedWarningsCount={mockSimulatedDeliveries.length}
          responseTeamsCount={mockResponseTeams.length}
          evacuationZonesCount={mockEvacuationZones.length}
        />

        {/* Alert Triage Grid: Queue (5 cols) & Investigation Dossier (7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5 flex flex-col gap-4">
            <AlertQueue
              alerts={alerts}
              selectedAlertId={selectedAlertId}
              onSelectAlert={setSelectedAlertId}
            />
          </div>

          <div className="lg:col-span-7 flex flex-col gap-4">
            <AlertDetailPanel
              alert={selectedAlert}
              onUpdateStatus={handleUpdateStatus}
            />
            <AlertTimeline events={activeTimeline} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
