'use client';

import React from 'react';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils/cn';
import { useLanguage } from '@/i18n';

export type AdminTab = 'sensors' | 'satellite' | 'integrations' | 'config' | 'access' | 'audit' | 'reports';

interface AdminHeaderProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onlineSensorsCount: number;
  totalSensorsCount: number;
  activeSatellitesCount: number;
  activeConnectorsCount: number;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab,
  onSelectTab,
  onlineSensorsCount,
  totalSensorsCount,
  activeSatellitesCount,
  activeConnectorsCount,
}) => {
  const { t, language } = useLanguage();

  return (
    <div className="space-y-3">
      {/* Top Disclaimer Banner */}
      <div className="bg-surface-container-high/80 border border-surface-high p-2.5 rounded-[4px] flex flex-wrap justify-between items-center gap-2 font-mono text-[10px]">
        <div className="flex items-center gap-2 text-primary font-bold">
          <Icon name="admin_panel_settings" size="xs" className="text-primary" />
          <span className="font-sans">{t.admin.subtitle}</span>
        </div>
        <div className="text-outline font-sans">
          * {language === 'hi' ? 'सिंथेटिक प्रदर्शन वातावरण — टेलीमेट्री कैलिब्रेशन और रिपोर्ट उत्पादन सिम्युलेटेड हैं।' : 'Synthetic demonstration environment — telemetry calibration, threshold tuning, and report generation are simulated.'}
        </div>
      </div>

      {/* Main Title Card */}
      <div className="data-card hud-border p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-[4px]">
        <div>
          <div className="flex items-center gap-2">
            <Icon name="tune" size="sm" className="text-secondary" />
            <h1 className="font-sans text-[20px] md:text-[22px] font-bold tracking-tight text-on-surface uppercase">
              {t.admin.title}
            </h1>
          </div>
          <p className="font-mono text-[11px] text-outline mt-1 font-sans">
            {t.admin.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
          <div className="bg-surface-container border border-surface-high text-secondary px-2.5 py-1 rounded-[2px] font-bold flex items-center gap-1.5 font-sans">
            <Icon name="sensors" size="xs" />
            <span>{t.admin.sensors}: {onlineSensorsCount}/{totalSensorsCount} {t.common.online}</span>
          </div>
          <div className="bg-surface-container border border-surface-high text-primary px-2.5 py-1 rounded-[2px] font-bold flex items-center gap-1.5 font-sans">
            <Icon name="satellite_alt" size="xs" />
            <span>{t.admin.satellites}: {activeSatellitesCount} {t.common.active}</span>
          </div>
          <div className="bg-surface-container border border-surface-high text-secondary px-2.5 py-1 rounded-[2px] font-bold flex items-center gap-1.5 font-sans">
            <Icon name="hub" size="xs" />
            <span>{t.admin.agencyFeeds}: {activeConnectorsCount} {t.operationalHealth.allSystemsNominal}</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-1.5 font-mono text-[11px] hud-border-b pb-2">
        <button
          type="button"
          onClick={() => onSelectTab('sensors')}
          className={cn(
            'px-3 py-2 rounded-[3px] font-bold flex items-center gap-1.5 transition-colors border touch-manipulation cursor-pointer font-sans',
            activeTab === 'sensors'
              ? 'bg-secondary/20 text-secondary border-secondary'
              : 'bg-surface-container text-outline border-surface-high hover:text-on-surface hover:bg-surface-container-high'
          )}
        >
          <Icon name="sensors" size="xs" />
          <span>1. {t.admin.sensors}</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('satellite')}
          className={cn(
            'px-3 py-2 rounded-[3px] font-bold flex items-center gap-1.5 transition-colors border touch-manipulation cursor-pointer font-sans',
            activeTab === 'satellite'
              ? 'bg-primary/20 text-primary border-primary'
              : 'bg-surface-container text-outline border-surface-high hover:text-on-surface hover:bg-surface-container-high'
          )}
        >
          <Icon name="satellite_alt" size="xs" />
          <span>2. {t.admin.satellites}</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('integrations')}
          className={cn(
            'px-3 py-2 rounded-[3px] font-bold flex items-center gap-1.5 transition-colors border touch-manipulation cursor-pointer font-sans',
            activeTab === 'integrations'
              ? 'bg-secondary/20 text-secondary border-secondary'
              : 'bg-surface-container text-outline border-surface-high hover:text-on-surface hover:bg-surface-container-high'
          )}
        >
          <Icon name="hub" size="xs" />
          <span>3. {t.admin.agencyFeeds}</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('config')}
          className={cn(
            'px-3 py-2 rounded-[3px] font-bold flex items-center gap-1.5 transition-colors border touch-manipulation cursor-pointer font-sans',
            activeTab === 'config'
              ? 'bg-primary/20 text-primary border-primary'
              : 'bg-surface-container text-outline border-surface-high hover:text-on-surface hover:bg-surface-container-high'
          )}
        >
          <Icon name="tune" size="xs" />
          <span>4. {t.admin.systemConfig}</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('access')}
          className={cn(
            'px-3 py-2 rounded-[3px] font-bold flex items-center gap-1.5 transition-colors border touch-manipulation cursor-pointer font-sans',
            activeTab === 'access'
              ? 'bg-secondary/20 text-secondary border-secondary'
              : 'bg-surface-container text-outline border-surface-high hover:text-on-surface hover:bg-surface-container-high'
          )}
        >
          <Icon name="badge" size="xs" />
          <span>5. {t.admin.operators}</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('audit')}
          className={cn(
            'px-3 py-2 rounded-[3px] font-bold flex items-center gap-1.5 transition-colors border touch-manipulation cursor-pointer font-sans',
            activeTab === 'audit'
              ? 'bg-advisory/20 text-advisory border-advisory'
              : 'bg-surface-container text-outline border-surface-high hover:text-on-surface hover:bg-surface-container-high'
          )}
        >
          <Icon name="receipt_long" size="xs" />
          <span>6. {t.admin.auditTrails}</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('reports')}
          className={cn(
            'px-3 py-2 rounded-[3px] font-bold flex items-center gap-1.5 transition-colors border touch-manipulation cursor-pointer font-sans',
            activeTab === 'reports'
              ? 'bg-secondary/20 text-secondary border-secondary'
              : 'bg-surface-container text-outline border-surface-high hover:text-on-surface hover:bg-surface-container-high'
          )}
        >
          <Icon name="summarize" size="xs" />
          <span>7. {t.admin.dossierExports}</span>
        </button>
      </div>
    </div>
  );
};
