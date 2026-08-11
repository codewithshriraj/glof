'use client';

import React, { useState } from 'react';
import { DispatchOrder, DispatchStatus, ResponseTeam } from '@/lib/types/glof';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { useLanguage } from '@/i18n';

interface DispatchOrderPanelProps {
  activeOrder: DispatchOrder;
  availableTeams: ResponseTeam[];
  selectedTeamIds: string[];
  onTransmitDispatch: (order: DispatchOrder) => void;
  className?: string;
}

const DISPATCH_LIFECYCLE: DispatchStatus[] = [
  'UNASSIGNED',
  'TEAM_SELECTED',
  'DISPATCH_QUEUED',
  'DISPATCHED',
  'ACKNOWLEDGED',
  'EN_ROUTE',
  'ON_SCENE',
  'STANDBY',
  'RESOLVED',
];

export const DispatchOrderPanel: React.FC<DispatchOrderPanelProps> = ({
  activeOrder,
  availableTeams,
  selectedTeamIds,
  onTransmitDispatch,
  className,
}) => {
  const { t, language } = useLanguage();
  const [targetSector, setTargetSector] = useState<string>(activeOrder.targetSector);
  const [priority, setPriority] = useState<'IMMEDIATE' | 'HIGH' | 'PRECAUTIONARY'>(activeOrder.evacuationPriority);
  const [currentStatus, setCurrentStatus] = useState<DispatchStatus>(activeOrder.status);

  const handleUpdateStatus = (nextStatus: DispatchStatus) => {
    setCurrentStatus(nextStatus);
    onTransmitDispatch({
      ...activeOrder,
      targetSector,
      evacuationPriority: priority,
      assignedTeamIds: selectedTeamIds.length > 0 ? selectedTeamIds : activeOrder.assignedTeamIds,
      status: nextStatus,
    });
  };

  const handleTransmit = () => {
    handleUpdateStatus('EN_ROUTE');
  };

  const assignedTeams = availableTeams.filter((t) =>
    selectedTeamIds.length > 0 ? selectedTeamIds.includes(t.id) : activeOrder.assignedTeamIds.includes(t.id)
  );

  const isEnRouteOrOnScene = currentStatus === 'EN_ROUTE' || currentStatus === 'ON_SCENE' || currentStatus === 'DISPATCHED';

  return (
    <div className={cn('data-card hud-border flex flex-col rounded-[4px]', className)}>
      {/* Header */}
      <div className="p-3 hud-border-b bg-surface-container-low/80 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <Icon name="local_shipping" size="xs" className="text-secondary" />
          <span className="font-sans text-[11px] font-bold tracking-wider text-on-surface uppercase">
            {t.dispatch.orderGeneration}
          </span>
          <span className="font-mono text-[10px] text-secondary font-bold">
            {activeOrder.id}
          </span>
        </div>
        <span
          className={cn(
            'font-mono text-[9px] font-bold px-2 py-0.5 rounded-[2px] border',
            isEnRouteOrOnScene
              ? 'text-critical border-critical/50 bg-critical/15 pulse-dot'
              : currentStatus === 'RESOLVED' || currentStatus === 'STANDBY'
              ? 'text-advisory border-advisory/50 bg-advisory/15'
              : 'text-warning border-warning/50 bg-warning/15'
          )}
        >
          {t.common.status}: {currentStatus}
        </span>
      </div>

      {/* Form & Specs */}
      <div className="p-4 flex flex-col gap-4 font-mono text-[11px]">
        {/* Incident Headline */}
        <div>
          <span className="font-sans text-[10px] font-bold text-outline uppercase tracking-wider block mb-1">
            {t.dispatch.targetIncident}
          </span>
          <div className="font-sans text-[14px] font-bold text-critical uppercase bg-critical/10 p-2.5 hud-border rounded-[3px]">
            {activeOrder.incidentTitle}
          </div>
        </div>

        {/* Dispatch Lifecycle Stepper */}
        <div className="bg-surface-container-lowest/80 p-2.5 hud-border rounded-[3px] flex flex-col gap-1.5 font-mono text-[10px]">
          <div className="flex justify-between items-center">
            <span className="font-sans text-[9px] font-bold text-outline uppercase tracking-wider">
              {t.dispatch.lifecycleProgression}
            </span>
            <span className="text-[9px] text-secondary font-bold">
              {t.common.status}: {currentStatus}
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1">
            {DISPATCH_LIFECYCLE.map((st) => (
              <button
                type="button"
                key={st}
                onClick={() => handleUpdateStatus(st)}
                className={cn(
                  'p-1.5 rounded-[2px] font-bold text-[8px] border transition-colors text-center truncate touch-manipulation cursor-pointer min-h-[32px]',
                  currentStatus === st
                    ? st === 'DISPATCHED' || st === 'EN_ROUTE' || st === 'ON_SCENE'
                      ? 'bg-critical/20 text-critical border-critical'
                      : st === 'RESOLVED' || st === 'STANDBY'
                      ? 'bg-advisory/20 text-advisory border-advisory'
                      : 'bg-secondary/20 text-secondary border-secondary'
                    : 'bg-surface-container/60 text-outline border-surface-high hover:text-on-surface hover:bg-surface-container'
                )}
                title={st}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Sector & Priority Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <span className="font-sans text-[10px] font-bold text-outline uppercase">{t.dispatch.targetSector}</span>
            <input
              type="text"
              value={targetSector}
              onChange={(e) => setTargetSector(e.target.value)}
              className="bg-surface-container-lowest hud-border text-on-surface p-2 rounded-[2px] outline-none focus:border-secondary font-sans"
            />
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-sans text-[10px] font-bold text-outline uppercase">{t.dispatch.priorityTier}</span>
            <div className="grid grid-cols-3 gap-1">
              {(['IMMEDIATE', 'HIGH', 'PRECAUTIONARY'] as const).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPriority(p)}
                  className={cn(
                    'p-2 rounded-[2px] font-bold text-[9px] border transition-colors touch-manipulation cursor-pointer min-h-[36px]',
                    priority === p
                      ? p === 'IMMEDIATE'
                        ? 'bg-critical/20 text-critical border-critical'
                        : 'bg-secondary/20 text-secondary border-secondary'
                      : 'bg-surface-container text-outline border-surface-high'
                  )}
                >
                  {p === 'IMMEDIATE' ? (language === 'hi' ? 'तत्काल' : 'IMMEDIATE') : p === 'HIGH' ? (language === 'hi' ? 'उच्च' : 'HIGH') : (language === 'hi' ? 'एहतियाती' : 'PRECAUTIONARY')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Assigned Units Summary */}
        <div className="bg-surface-container-high/60 p-3 hud-border rounded-[3px] flex flex-col gap-2">
          <div className="flex justify-between items-center text-[10px]">
            <span className="font-sans font-bold text-on-surface">{t.dispatch.assignedUnits} ({assignedTeams.length})</span>
            <span className="text-secondary font-bold">{t.dispatch.personnelCount}: {assignedTeams.reduce((a, b) => a + b.personnelCount, 0)}</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {assignedTeams.map((t) => (
              <span
                key={t.id}
                className="bg-surface-container-lowest px-2 py-1 rounded-[2px] hud-border text-[10px] text-on-surface flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                <span className="font-bold text-secondary">{t.code}</span> ({t.personnelCount} pax)
              </span>
            ))}
          </div>
        </div>

        {/* Population at Risk Readout */}
        <div className="flex justify-between items-center bg-surface-container-lowest p-2.5 hud-border rounded-[2px] text-[10px]">
          <span className="text-outline">{t.dispatch.affectedPopulation}:</span>
          <span className="font-bold text-critical text-[13px]">{activeOrder.affectedPopulation.toLocaleString()} {language === 'hi' ? 'नागरिक' : 'RESIDENTS'}</span>
        </div>

        {/* Action Button */}
        <div className="pt-2 hud-border-t flex flex-wrap justify-between items-center gap-2">
          <div className="text-[9px] text-outline">
            {language === 'hi' ? 'प्राधिकृतकर्ता:' : 'AUTH:'} {activeOrder.authorizedBy}
          </div>
          <Button
            onClick={handleTransmit}
            variant={isEnRouteOrOnScene ? 'primary' : 'critical'}
            size="md"
            className="font-bold"
          >
            <Icon name={isEnRouteOrOnScene ? 'check_circle' : 'send'} size="xs" />
            {isEnRouteOrOnScene ? t.dispatch.confirmTransmission : t.dispatch.confirmTransmission}
          </Button>
        </div>
      </div>
    </div>
  );
};
