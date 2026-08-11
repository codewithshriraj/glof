'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { OperationalAlert, AlertStatus } from '@/lib/types/glof';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { useLanguage } from '@/i18n';

interface AlertDetailPanelProps {
  alert: OperationalAlert;
  onUpdateStatus: (alertId: string, nextStatus: OperationalAlert['status'], note?: string) => void;
  className?: string;
}

const LIFECYCLE_STATES: AlertStatus[] = [
  'NEW',
  'ACKNOWLEDGED',
  'ASSESSING',
  'ESCALATED',
  'DISPATCHED',
  'RESOLVED',
];

export const AlertDetailPanel: React.FC<AlertDetailPanelProps> = ({
  alert,
  onUpdateStatus,
  className,
}) => {
  const { t, language } = useLanguage();
  const [operatorNote, setOperatorNote] = useState<string>(alert.operatorNote || '');
  const isCritical = alert.severity === 'L4';

  const handleSetStatus = (status: AlertStatus) => {
    onUpdateStatus(alert.id, status, operatorNote);
  };

  return (
    <div className={cn('data-card hud-border flex flex-col rounded-[4px]', className)}>
      {/* Header */}
      <div className="p-3 hud-border-b bg-surface-container-low/90 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <Icon name="biotech" size="xs" className="text-secondary" />
          <span className="font-sans text-[11px] font-bold tracking-wider text-on-surface uppercase">
            {t.alerts.incidentInvestigation}
          </span>
          <span className="font-mono text-[10px] text-secondary font-bold">
            {alert.id}
          </span>
        </div>
        <span
          className={cn(
            'font-mono text-[9px] font-bold px-2 py-0.5 rounded-[2px] border',
            isCritical
              ? 'text-critical border-critical/50 bg-critical/15'
              : 'text-warning border-warning/50 bg-warning/15'
          )}
        >
          {alert.severity} {'//'} {alert.status}
        </span>
      </div>

      {/* Incident Summary Card */}
      <div className="p-4 flex flex-col gap-4">
        <div>
          <h2 className="font-sans text-[16px] font-bold text-on-surface uppercase">
            {alert.lakeName} ({alert.lakeCode}) — {alert.title}
          </h2>
          <div className="flex flex-wrap items-center gap-3 mt-1.5 font-mono text-[10px] text-outline">
            <span className="text-secondary flex items-center gap-1">
              <Icon name="location_on" size="xs" />
              {alert.region}
            </span>
            <span>{t.common.createdAt}: {alert.createdAtUTC}</span>
            <span>{language === 'hi' ? 'नियुक्त ऑपरेटर:' : 'ASSIGNED:'} {alert.assignedOperator}</span>
          </div>
        </div>

        {/* Lifecycle Stepper / State Selector */}
        <div className="bg-surface-container-lowest/80 p-2.5 hud-border rounded-[3px] flex flex-col gap-1.5 font-mono text-[10px]">
          <div className="flex justify-between items-center">
            <span className="font-sans text-[9px] font-bold text-outline uppercase tracking-wider">
              {t.alerts.lifecycleTransitions}
            </span>
            <span className="text-[9px] text-secondary font-bold">
              {t.common.status}: {alert.status}
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
            {LIFECYCLE_STATES.map((st) => (
              <button
                type="button"
                key={st}
                onClick={() => handleSetStatus(st)}
                className={cn(
                  'p-1.5 rounded-[2px] font-bold text-[9px] border transition-colors text-center touch-manipulation cursor-pointer min-h-[36px]',
                  alert.status === st
                    ? st === 'ESCALATED' || st === 'DISPATCHED'
                      ? 'bg-critical/20 text-critical border-critical'
                      : st === 'RESOLVED'
                      ? 'bg-advisory/20 text-advisory border-advisory'
                      : 'bg-secondary/20 text-secondary border-secondary'
                    : 'bg-surface-container/60 text-outline border-surface-high hover:text-on-surface hover:bg-surface-container'
                )}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Trigger Condition Box */}
        <div className="bg-surface-container-high/80 p-3 hud-border rounded-[3px] flex flex-col gap-1">
          <span className="font-sans text-[10px] font-bold text-outline uppercase tracking-wider">
            {t.alerts.anomalousTrigger}
          </span>
          <p className="font-mono text-[11px] text-critical font-medium">
            {alert.triggerCondition}
          </p>
        </div>

        {/* Multi-Source Evidence Grid */}
        <div className="flex flex-col gap-2">
          <span className="font-sans text-[10px] font-bold text-outline uppercase tracking-wider">
            {t.alerts.multiSourceEvidence}
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-[10px]">
            {/* Satellite Pass */}
            <div className="bg-surface-container-lowest/80 p-2.5 hud-border rounded-[2px]">
              <div className="flex items-center gap-1.5 text-secondary font-bold mb-1">
                <Icon name="satellite_alt" size="xs" />
                <span>{t.alerts.evidenceSatellite}</span>
              </div>
              <p className="text-on-surface-variant text-[10px]">{alert.evidence.satellitePass}</p>
            </div>

            {/* Sensor Telemetry */}
            <div className="bg-surface-container-lowest/80 p-2.5 hud-border rounded-[2px]">
              <div className="flex items-center gap-1.5 text-secondary font-bold mb-1">
                <Icon name="sensors" size="xs" />
                <span>{t.alerts.evidenceSensor}</span>
              </div>
              <p className="text-on-surface-variant text-[10px]">{alert.evidence.sensorAnomaly}</p>
            </div>

            {/* Simulation Outflow */}
            <div className="bg-surface-container-lowest/80 p-2.5 hud-border rounded-[2px]">
              <div className="flex items-center gap-1.5 text-critical font-bold mb-1">
                <Icon name="water_damage" size="xs" />
                <span>{t.alerts.evidenceSimulation}</span>
              </div>
              <p className="text-on-surface-variant text-[10px]">{alert.evidence.simulationDischarge}</p>
            </div>

            {/* Risk Contribution */}
            <div className="bg-surface-container-lowest/80 p-2.5 hud-border rounded-[2px]">
              <div className="flex items-center gap-1.5 text-warning font-bold mb-1">
                <Icon name="psychology" size="xs" />
                <span>{t.alerts.evidenceRisk}</span>
              </div>
              <p className="text-on-surface-variant text-[10px]">{alert.evidence.riskFactor}</p>
            </div>
          </div>
        </div>

        {/* Operator Notes Input Area */}
        <div className="flex flex-col gap-1.5">
          <span className="font-sans text-[10px] font-bold text-outline uppercase tracking-wider">
            {t.alerts.operatorLogNote}
          </span>
          <textarea
            value={operatorNote}
            onChange={(e) => setOperatorNote(e.target.value)}
            placeholder={language === 'hi' ? 'जांच नोट्स या आदेश दर्ज करें...' : 'ENTER INVESTIGATION NOTES OR ORDERS (DEMO)...'}
            className="w-full bg-surface-container-lowest hud-border text-on-surface font-mono text-[11px] p-2.5 rounded-[3px] focus:border-secondary outline-none h-20 resize-none font-sans"
          />
        </div>

        {/* Action Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 hud-border-t">
          <div className="flex items-center gap-2">
            {alert.status === 'NEW' && (
              <Button onClick={() => handleSetStatus('ACKNOWLEDGED')} variant="outline" size="sm">
                <Icon name="check_circle" size="xs" />
                {t.alerts.acknowledgeIncident}
              </Button>
            )}
            <Button onClick={() => handleSetStatus('ESCALATED')} variant="critical" size="sm">
              <Icon name="warning" size="xs" />
              {t.alerts.escalateTier4}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/lakes/${alert.lakeId === 'lake-022' ? 'ghepang-gath' : alert.lakeId === 'lake-008' ? 'imja-tsho' : 'south-lhonak'}`}>
              <Button variant="outline" size="sm">
                <Icon name="analytics" size="xs" />
                {t.alerts.lakeDossier}
              </Button>
            </Link>
            <Link href="/dispatch">
              <Button variant="primary" size="sm">
                <Icon name="local_shipping" size="xs" filled />
                {t.alerts.dispatchConsole} →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
