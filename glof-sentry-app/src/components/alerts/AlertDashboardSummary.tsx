'use client';

import React from 'react';
import { Icon } from '@/components/ui/Icon';
import { useLanguage } from '@/i18n';

interface AlertDashboardSummaryProps {
  activeAlertsCount: number;
  criticalCount: number;
  unacknowledgedCount: number;
  escalatedCount: number;
  activeDispatchesCount: number;
  simulatedWarningsCount: number;
  responseTeamsCount: number;
  evacuationZonesCount: number;
}

export const AlertDashboardSummary: React.FC<AlertDashboardSummaryProps> = ({
  activeAlertsCount,
  criticalCount,
  unacknowledgedCount,
  escalatedCount,
  activeDispatchesCount,
  simulatedWarningsCount,
  responseTeamsCount,
  evacuationZonesCount,
}) => {
  const { t, language } = useLanguage();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 font-mono">
      {/* 1. Active Alerts */}
      <div className="data-card hud-border p-2.5 flex flex-col justify-between rounded-[4px] border-l-2 border-l-secondary">
        <div className="hud-border-b pb-1 mb-1 flex justify-between items-center">
          <span className="font-sans text-[9px] font-bold tracking-wider text-secondary uppercase">
            {t.alerts.activeCount}
          </span>
          <Icon name="crisis_alert" size="xs" className="text-secondary" />
        </div>
        <div className="font-mono text-[18px] font-bold text-secondary">
          {activeAlertsCount.toString().padStart(2, '0')}
        </div>
        <span className="font-mono text-[8px] text-outline truncate">
          {language === 'hi' ? 'कुल निगरानी' : 'TOTAL MONITORED'}
        </span>
      </div>

      {/* 2. Critical Alerts */}
      <div className="data-card hud-border p-2.5 flex flex-col justify-between rounded-[4px] border-l-2 border-l-critical">
        <div className="hud-border-b pb-1 mb-1 flex justify-between items-center">
          <span className="font-sans text-[9px] font-bold tracking-wider text-critical uppercase">
            {t.alerts.severityCritical}
          </span>
          <Icon name="warning" size="xs" className="text-critical pulse-critical" />
        </div>
        <div className="font-mono text-[18px] font-bold text-critical">
          {criticalCount.toString().padStart(2, '0')}
        </div>
        <span className="font-mono text-[8px] text-outline truncate">
          {language === 'hi' ? 'स्तर 4 प्राथमिकता' : 'TIER 4 PRIORITY'}
        </span>
      </div>

      {/* 3. Alerts Awaiting Acknowledgement */}
      <div className="data-card hud-border p-2.5 flex flex-col justify-between rounded-[4px] border-l-2 border-l-warning">
        <div className="hud-border-b pb-1 mb-1 flex justify-between items-center">
          <span className="font-sans text-[9px] font-bold tracking-wider text-warning uppercase">
            {t.alerts.statusNew}
          </span>
          <Icon name="mark_email_unread" size="xs" className="text-warning" />
        </div>
        <div className="font-mono text-[18px] font-bold text-warning">
          {unacknowledgedCount.toString().padStart(2, '0')}
        </div>
        <span className="font-mono text-[8px] text-outline truncate">
          {language === 'hi' ? 'ट्राइएज लंबित' : 'PENDING TRIAGE'}
        </span>
      </div>

      {/* 4. Escalated Alerts */}
      <div className="data-card hud-border p-2.5 flex flex-col justify-between rounded-[4px] border-l-2 border-l-critical">
        <div className="hud-border-b pb-1 mb-1 flex justify-between items-center">
          <span className="font-sans text-[9px] font-bold tracking-wider text-critical uppercase">
            {t.alerts.statusEscalated}
          </span>
          <Icon name="trending_up" size="xs" className="text-critical" />
        </div>
        <div className="font-mono text-[18px] font-bold text-critical">
          {escalatedCount.toString().padStart(2, '0')}
        </div>
        <span className="font-mono text-[8px] text-outline truncate">
          {language === 'hi' ? 'सक्रिय वृद्धि' : 'ACTIVE ESCALATIONS'}
        </span>
      </div>

      {/* 5. Active Dispatches */}
      <div className="data-card hud-border p-2.5 flex flex-col justify-between rounded-[4px] border-l-2 border-l-secondary">
        <div className="hud-border-b pb-1 mb-1 flex justify-between items-center">
          <span className="font-sans text-[9px] font-bold tracking-wider text-secondary uppercase">
            {t.dispatch.activeOrders}
          </span>
          <Icon name="local_shipping" size="xs" className="text-secondary" />
        </div>
        <div className="font-mono text-[18px] font-bold text-secondary">
          {activeDispatchesCount.toString().padStart(2, '0')}
        </div>
        <span className="font-mono text-[8px] text-outline truncate">
          {language === 'hi' ? 'सक्रिय डिस्पैच' : 'SECTOR 1 ACTIVE'}
        </span>
      </div>

      {/* 6. Simulated Warnings */}
      <div className="data-card hud-border p-2.5 flex flex-col justify-between rounded-[4px] border-l-2 border-l-warning">
        <div className="hud-border-b pb-1 mb-1 flex justify-between items-center">
          <span className="font-sans text-[9px] font-bold tracking-wider text-warning uppercase">
            {language === 'hi' ? 'सिम चेतावनी' : 'SIM WARNINGS'}
          </span>
          <Icon name="cell_tower" size="xs" className="text-warning" />
        </div>
        <div className="font-mono text-[18px] font-bold text-warning">
          {simulatedWarningsCount.toString().padStart(2, '0')}
        </div>
        <span className="font-mono text-[8px] text-outline truncate">
          {language === 'hi' ? '6 डेमो चैनल' : '6 DEMO CHANNELS'}
        </span>
      </div>

      {/* 7. Response Teams */}
      <div className="data-card hud-border p-2.5 flex flex-col justify-between rounded-[4px] border-l-2 border-l-primary">
        <div className="hud-border-b pb-1 mb-1 flex justify-between items-center">
          <span className="font-sans text-[9px] font-bold tracking-wider text-primary uppercase">
            {t.dispatch.responseUnits}
          </span>
          <Icon name="groups" size="xs" className="text-primary" />
        </div>
        <div className="font-mono text-[18px] font-bold text-primary">
          {responseTeamsCount.toString().padStart(2, '0')}
        </div>
        <span className="font-mono text-[8px] text-outline truncate">
          {language === 'hi' ? 'डेमो इकाइयां' : 'DEMO UNITS'}
        </span>
      </div>

      {/* 8. Evacuation Zones */}
      <div className="data-card hud-border p-2.5 flex flex-col justify-between rounded-[4px] border-l-2 border-l-advisory">
        <div className="hud-border-b pb-1 mb-1 flex justify-between items-center">
          <span className="font-sans text-[9px] font-bold tracking-wider text-advisory uppercase">
            {t.dispatch.evacuationZones}
          </span>
          <Icon name="map" size="xs" className="text-advisory" />
        </div>
        <div className="font-mono text-[18px] font-bold text-advisory">
          {evacuationZonesCount.toString().padStart(2, '0')}
        </div>
        <span className="font-mono text-[8px] text-outline truncate">
          {language === 'hi' ? 'डेमो क्षेत्र' : 'DEMO SECTORS'}
        </span>
      </div>
    </div>
  );
};
