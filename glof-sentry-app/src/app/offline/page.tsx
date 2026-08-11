'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/i18n';
import { LanguageSelector } from '@/components/common/LanguageSelector';

export default function OfflinePage() {
  const { t, language } = useLanguage();

  const handleRetry = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col justify-center items-center p-4 font-mono select-none">
      <div className="max-w-md w-full data-card hud-border p-6 rounded-[6px] space-y-5 text-center">
        {/* Top Language Toggle */}
        <div className="flex justify-end">
          <LanguageSelector variant="compact" />
        </div>

        {/* Radar Offline Beacon */}
        <div className="w-16 h-16 rounded-full bg-error/10 border border-error/40 flex items-center justify-center mx-auto text-error">
          <Icon name="wifi_off" size="lg" className="animate-pulse" />
        </div>

        <div>
          <div className="flex items-center justify-center gap-1.5 text-error font-bold text-[11px] uppercase tracking-wider mb-1 font-sans">
            <span className="w-2 h-2 rounded-full bg-error" />
            <span>{language === 'hi' ? 'संचार लिंक विच्छेदित // ऑफलाइन मोड' : 'COMMUNICATION LINK SEVERED // OFFLINE MODE'}</span>
          </div>
          <h1 className="font-sans font-bold text-[18px] text-on-surface uppercase">
            {t.pwa.offlineTitle}
          </h1>
          <p className="text-[11px] text-outline mt-2 leading-relaxed font-sans">
            {t.pwa.offlineDesc}
          </p>
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="bg-warning/10 border border-warning/30 p-3 rounded text-[10px] text-warning text-left space-y-1">
          <div className="font-bold flex items-center gap-1.5 font-sans">
            <Icon name="warning" size="xs" />
            <span>{language === 'hi' ? 'आपदा सुरक्षा सूचना:' : 'DISASTER SAFETY NOTICE:'}</span>
          </div>
          <p className="text-[9px] text-on-surface-variant leading-tight font-sans">
            {language === 'hi'
              ? 'सक्रिय बाढ़ आपातकाल के दौरान कैश्ड जल स्तर पर निर्भर न रहें। फील्ड कर्मियों को वीएचएफ रेडियो बैकअप चैनलों का उपयोग करना चाहिए।'
              : 'Do not rely on cached water levels during an active flood emergency. Field personnel should refer to VHF radio backup channels.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex flex-col gap-2">
          <Button onClick={handleRetry} variant="primary" size="md" className="w-full font-bold font-sans">
            <Icon name="refresh" size="xs" />
            {t.pwa.offlineRetry}
          </Button>

          <Link href="/command" className="w-full">
            <Button variant="outline" size="md" className="w-full font-bold text-[11px] font-sans">
              <Icon name="dashboard" size="xs" />
              {language === 'hi' ? 'कैश्ड कमांड सेंटर पर लौटें' : 'RETURN TO CACHED COMMAND CENTER'}
            </Button>
          </Link>
        </div>

        <div className="text-[9px] text-outline pt-2 border-t border-surface-high font-sans">
          {language === 'hi' ? 'अंतिम ज्ञात स्थानीय सिंक: कैश्ड ऐप शेल तैयार' : 'LAST KNOWN LOCAL SYNC: CACHED APP SHELL READY'}
        </div>
      </div>
    </div>
  );
}
