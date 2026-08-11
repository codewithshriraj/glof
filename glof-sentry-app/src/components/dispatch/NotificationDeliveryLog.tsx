'use client';

import React from 'react';
import { NotificationDelivery } from '@/lib/types/glof';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils/cn';
import { useLanguage } from '@/i18n';

interface NotificationDeliveryLogProps {
  deliveries: NotificationDelivery[];
  className?: string;
}

export const NotificationDeliveryLog: React.FC<NotificationDeliveryLogProps> = ({
  deliveries,
  className,
}) => {
  const { t, language } = useLanguage();

  return (
    <div className={cn('data-card hud-border flex flex-col rounded-[4px]', className)}>
      {/* Header */}
      <div className="p-3 hud-border-b bg-surface-container-low/80 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Icon name="receipt_long" size="xs" className="text-secondary" />
          <span className="font-sans text-[11px] font-bold tracking-wider text-on-surface uppercase">
            {t.dispatch.deliveryLog}
          </span>
        </div>
        <span className="font-mono text-[9px] text-outline">{language === 'hi' ? 'डेमो CAP ऑडिट लॉग स्ट्रीम' : 'DEMO CAP AUDIT LOG STREAM'}</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-[10px] border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-surface-container-lowest/80 text-outline text-[9px] uppercase tracking-wider hud-border-b font-sans font-bold">
              <th className="p-2.5">{language === 'hi' ? 'संदेश ID' : 'MESSAGE ID'}</th>
              <th className="p-2.5">{t.dispatch.channels}</th>
              <th className="p-2.5">{language === 'hi' ? 'लक्षित दर्शक' : 'TARGET AUDIENCE'}</th>
              <th className="p-2.5 text-center">{t.dispatch.recipientCount}</th>
              <th className="p-2.5">{language === 'hi' ? 'समय (UTC)' : 'TIMESTAMP (UTC)'}</th>
              <th className="p-2.5 text-center">{t.common.status}</th>
              <th className="p-2.5 text-center">{language === 'hi' ? 'पुनः प्रयास' : 'RETRY'}</th>
              <th className="p-2.5 text-right">{language === 'hi' ? 'स्वीकृति दर' : 'ACK RATE'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-high">
            {deliveries.map((del) => (
              <tr key={del.id} className="hover:bg-surface-container-high/60 transition-colors">
                <td className="p-2.5 font-bold text-secondary">{del.id}</td>
                <td className="p-2.5 font-bold text-on-surface">
                  <span className="bg-surface-container px-1.5 py-0.5 rounded-[2px] border border-surface-high font-sans text-[9px]">
                    {del.channel}
                  </span>
                </td>
                <td className="p-2.5 font-sans text-on-surface-variant">{del.targetAudience}</td>
                <td className="p-2.5 text-center font-bold text-on-surface">
                  {del.recipientCount.toLocaleString()}
                </td>
                <td className="p-2.5 text-outline">{del.sentTimestampUTC}</td>
                <td className="p-2.5 text-center">
                  <span
                    className={cn(
                      'px-1.5 py-0.5 rounded-[2px] font-bold text-[8px] border font-sans',
                      del.status.includes('DELIVERED') || del.status.includes('ACKNOWLEDGED')
                        ? 'text-advisory border-advisory/40 bg-advisory/10'
                        : 'text-warning border-warning/40 bg-warning/10'
                    )}
                  >
                    {del.status}
                  </span>
                </td>
                <td className="p-2.5 text-center font-mono text-outline">
                  {del.retryCount ?? 0}x
                </td>
                <td className="p-2.5 text-right font-bold text-secondary">
                  {del.ackRatePct}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
