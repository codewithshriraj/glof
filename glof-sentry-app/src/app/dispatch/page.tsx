'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { ResponseTeamList } from '@/components/dispatch/ResponseTeamList';
import { DispatchOrderPanel } from '@/components/dispatch/DispatchOrderPanel';
import { EvacuationZoneView } from '@/components/dispatch/EvacuationZoneView';
import { NotificationChannelPanel } from '@/components/dispatch/NotificationChannelPanel';
import { NotificationDeliveryLog } from '@/components/dispatch/NotificationDeliveryLog';
import { mockResponseTeams, mockActiveDispatchOrders } from '@/lib/mock/dispatch-data';
import { mockSimulatedDeliveries } from '@/lib/mock/notification-data';
import { ResponseTeam, DispatchOrder, NotificationDelivery, NotificationChannel } from '@/lib/types/glof';
import { Icon } from '@/components/ui/Icon';
import { useLanguage } from '@/i18n';

export default function DispatchPage() {
  const { t, language } = useLanguage();
  const [teams, setTeams] = useState<ResponseTeam[]>(mockResponseTeams);
  const [activeOrder, setActiveOrder] = useState<DispatchOrder>(mockActiveDispatchOrders[0]);
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>(mockActiveDispatchOrders[0].assignedTeamIds);
  const [deliveries, setDeliveries] = useState<NotificationDelivery[]>(mockSimulatedDeliveries);

  const handleToggleTeam = (teamId: string) => {
    setSelectedTeamIds((prev) =>
      prev.includes(teamId) ? prev.filter((id) => id !== teamId) : [...prev, teamId]
    );
  };

  const handleTransmitDispatch = (order: DispatchOrder) => {
    setActiveOrder(order);
    // Mark assigned teams as EN_ROUTE
    setTeams((prev) =>
      prev.map((t) =>
        order.assignedTeamIds.includes(t.id) ? { ...t, status: 'EN_ROUTE' } : t
      )
    );
  };

  const handleSimulateBroadcast = (channels: NotificationChannel[], message: string) => {
    const newDeliveries: NotificationDelivery[] = channels.map((ch, i) => ({
      id: `MSG-2026-${1040 + i}`,
      channel: ch,
      targetAudience: 'Simulated Target Audience Group',
      messageText: message,
      recipientCount: ch === 'SMS' ? 2400 : ch === 'PUBLIC_DISPLAY' ? 8 : 350,
      sentTimestampUTC: '14:35:45 UTC',
      status: 'SIMULATED / DELIVERED',
      ackRatePct: 96.5,
      retryCount: 0,
    }));

    setDeliveries((prev) => [...newDeliveries, ...prev]);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Navigation Breadcrumb & Back Link */}
        <div className="flex flex-wrap justify-between items-center gap-2 font-mono text-[11px] text-outline">
          <div className="flex items-center gap-2">
            <Link href="/alerts" className="hover:text-secondary transition-colors flex items-center gap-1">
              <Icon name="arrow_back" size="xs" />
              {t.nav.alerts}
            </Link>
            <span>/</span>
            <span className="text-on-surface uppercase font-bold">{t.dispatch.title}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-primary bg-primary/10 px-2 py-0.5 rounded-[2px] border border-primary/30 font-bold">
              {language === 'hi' ? 'डेमो आपातकालीन डिस्पैच' : 'DEMO EMERGENCY DISPATCH'}
            </span>
            <Link
              href="/map"
              className="text-secondary hover:text-white flex items-center gap-1 font-bold underline"
            >
              <Icon name="map" size="xs" />
              {t.nav.map} →
            </Link>
          </div>
        </div>

        {/* Master Header */}
        <div className="data-card hud-border p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-[4px]">
          <div>
            <div className="flex items-center gap-2">
              <Icon name="local_shipping" size="sm" className="text-critical" />
              <h1 className="font-sans text-[20px] md:text-[22px] font-bold tracking-tight text-on-surface uppercase">
                {t.dispatch.title}
              </h1>
            </div>
            <p className="font-mono text-[11px] text-outline mt-1 font-sans">
              {t.dispatch.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="text-critical bg-critical/15 px-2.5 py-1 rounded-[2px] border border-critical/50 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-critical pulse-ping" />
              {language === 'hi' ? 'सेक्टर 1 सक्रिय' : 'SECTOR 1 ACTIVE'}
            </span>
          </div>
        </div>

        {/* Dispatch Order Creation & Response Team Selection Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <DispatchOrderPanel
              activeOrder={activeOrder}
              availableTeams={teams}
              selectedTeamIds={selectedTeamIds}
              onTransmitDispatch={handleTransmitDispatch}
            />
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4">
            <ResponseTeamList
              teams={teams}
              selectedTeamIds={selectedTeamIds}
              onToggleTeam={handleToggleTeam}
            />
          </div>
        </div>

        {/* Evacuation Zones Matrix */}
        <EvacuationZoneView />

        {/* Multi-Channel Warning Composer & Live Previews */}
        <NotificationChannelPanel onSimulateBroadcast={handleSimulateBroadcast} />

        {/* Transmission Delivery Log */}
        <NotificationDeliveryLog deliveries={deliveries} />
      </div>
    </AppShell>
  );
}
