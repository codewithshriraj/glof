'use client';

import React from 'react';
import { mockEvacuationZones } from '@/lib/mock/dispatch-data';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils/cn';
import { useLanguage } from '@/i18n';

interface EvacuationZoneViewProps {
  className?: string;
}

export const EvacuationZoneView: React.FC<EvacuationZoneViewProps> = ({ className }) => {
  const { t, language } = useLanguage();

  return (
    <div className={cn('data-card hud-border flex flex-col rounded-[4px]', className)}>
      {/* Header */}
      <div className="p-3 hud-border-b bg-surface-container-low/80 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <Icon name="shield" size="xs" className="text-secondary" />
          <span className="font-sans text-[11px] font-bold tracking-wider text-on-surface uppercase">
            {t.dispatch.evacuationZones}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] text-primary bg-primary/10 px-1.5 py-0.5 rounded-[2px] border border-primary/30 font-bold">
            {language === 'hi' ? 'डेमो निकासी क्षेत्र' : 'DEMO EVACUATION ZONES'}
          </span>
        </div>
      </div>

      {/* Disclaimer Banner */}
      <div className="bg-surface-container-lowest px-4 py-1.5 hud-border-b font-mono text-[9px] text-outline flex items-center gap-2">
        <span className="text-warning font-bold">{language === 'hi' ? '[डेमो सूचना]' : '[DEMO NOTICE]'}</span>
        <span className="font-sans">{language === 'hi' ? 'सिंथेटिक निकासी ज्यामिति। आधिकारिक अनुमोदित सीमा नहीं।' : 'Synthetic evacuation geometry. Not an officially approved evacuation boundary.'}</span>
      </div>

      {/* Sectors List */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[11px]">
        {mockEvacuationZones.map((zone) => {
          const isRed = zone.tier === 'RED_EXCLUSION';
          const isAmber = zone.tier === 'AMBER_HAZARD';

          return (
            <div
              key={zone.id}
              className={cn(
                'p-3 hud-border rounded-[3px] flex flex-col justify-between gap-2 border-l-4',
                isRed
                  ? 'border-l-critical bg-critical/5'
                  : isAmber
                  ? 'border-l-warning bg-warning/5'
                  : 'border-l-advisory bg-advisory/5'
              )}
            >
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span
                    className={cn(
                      'text-[9px] font-bold px-1.5 py-0.5 rounded-[2px] border',
                      isRed
                        ? 'text-critical border-critical/40 bg-critical/15'
                        : isAmber
                        ? 'text-warning border-warning/40 bg-warning/15'
                        : 'text-advisory border-advisory/40 bg-advisory/15'
                    )}
                  >
                    {zone.status === 'DEMO_EVACUATION_SCENARIO' ? (language === 'hi' ? 'डेमो निकासी परिदृश्य' : 'DEMO EVACUATION SCENARIO') : zone.tier.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-outline font-bold">
                    {zone.population.toLocaleString()} {language === 'hi' ? 'जनसंख्या' : 'POP.'}
                  </span>
                </div>

                <div className="font-sans font-bold text-[12px] text-on-surface uppercase">
                  {zone.name}
                </div>
                <div className="text-[10px] text-secondary mt-0.5">{zone.sector}</div>
              </div>

              <div className="pt-2 hud-border-t text-[10px] flex flex-col gap-1 text-on-surface-variant font-sans">
                <div className="flex justify-between font-mono text-[9px] text-outline">
                  <span>{language === 'hi' ? 'चेतावनी अग्रिम समय:' : 'LEAD TIME:'}</span>
                  <span className={isRed ? 'text-critical font-bold' : 'text-on-surface'}>
                    {zone.estimatedLeadTime}
                  </span>
                </div>
                <div className="text-[10px] leading-tight text-on-surface">
                  <span className="font-bold text-outline font-mono text-[9px]">{language === 'hi' ? 'मार्ग: ' : 'ROUTE: '}</span>
                  {zone.evacuationRoute}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
