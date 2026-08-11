'use client';

import React from 'react';
import { Icon } from '@/components/ui/Icon';
import { useLanguage } from '@/i18n';

interface AlertOperationsHeaderProps {
  activeCount: number;
  criticalCount: number;
  unacknowledgedCount: number;
}

export const AlertOperationsHeader: React.FC<AlertOperationsHeaderProps> = ({
  activeCount,
  criticalCount,
  unacknowledgedCount,
}) => {
  const { t, language } = useLanguage();

  return (
    <div className="space-y-2">
      {/* Top Banner with Demo Warning Disclaimer */}
      <div className="bg-critical/10 border border-critical/40 p-2.5 rounded-[4px] flex flex-wrap justify-between items-center gap-2 font-mono text-[10px]">
        <div className="flex items-center gap-2 text-critical font-bold">
          <span className="w-2 h-2 rounded-full bg-critical pulse-critical inline-block" />
          <span>{language === 'hi' ? 'डेमो अलर्ट संचालन // सिंथेटिक आपातकालीन कार्यप्रवाह कंसोल' : 'DEMO ALERT OPERATIONS // SYNTHETIC EMERGENCY WORKFLOW CONSOLE'}</span>
        </div>
        <div className="text-outline">
          * {language === 'hi' ? 'सिंथेटिक कार्यप्रवाह प्रदर्शन — वास्तविक आपातकालीन बुनियादी ढांचे से कनेक्टेड नहीं।' : 'Synthetic workflow demonstration — not connected to operational emergency warning infrastructure.'}
        </div>
      </div>

      {/* Main Title & HUD Status Readouts */}
      <div className="data-card hud-border p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-[4px]">
        <div>
          <div className="flex items-center gap-2">
            <Icon name="crisis_alert" size="sm" className="text-critical" />
            <h1 className="font-sans text-[20px] md:text-[22px] font-bold tracking-tight text-on-surface uppercase">
              {t.alerts.title}
            </h1>
          </div>
          <p className="font-mono text-[11px] text-outline mt-1">
            {t.alerts.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
          <div className="bg-critical/15 border border-critical/50 text-critical px-2.5 py-1 rounded-[2px] font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-critical pulse-ping" />
            {t.alerts.severityCritical}: {criticalCount.toString().padStart(2, '0')}
          </div>
          <div className="bg-warning/15 border border-warning/50 text-warning px-2.5 py-1 rounded-[2px] font-bold">
            {t.alerts.statusNew}: {unacknowledgedCount.toString().padStart(2, '0')}
          </div>
          <div className="bg-secondary/15 border border-secondary/50 text-secondary px-2.5 py-1 rounded-[2px] font-bold">
            {t.alerts.activeCount}: {activeCount.toString().padStart(2, '0')}
          </div>
        </div>
      </div>
    </div>
  );
};
