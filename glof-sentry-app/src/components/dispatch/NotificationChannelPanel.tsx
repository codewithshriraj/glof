'use client';

import React, { useState } from 'react';
import { NotificationChannel } from '@/lib/types/glof';
import { mockMultilingualTemplates } from '@/lib/mock/notification-data';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { useLanguage } from '@/i18n';

interface NotificationChannelPanelProps {
  onSimulateBroadcast: (channels: NotificationChannel[], message: string) => void;
  className?: string;
}

export const NotificationChannelPanel: React.FC<NotificationChannelPanelProps> = ({
  onSimulateBroadcast,
  className,
}) => {
  const { t, language } = useLanguage();
  const [selectedChannels, setSelectedChannels] = useState<NotificationChannel[]>([
    'SMS',
    'MOBILE_PUSH',
    'RADIO',
    'PUBLIC_DISPLAY',
  ]);
  const [activeLang, setActiveLang] = useState<'en' | 'hi' | 'ne'>('en');
  const [messageText, setMessageText] = useState<string>(mockMultilingualTemplates.en.text);
  const [isBroadcasted, setIsBroadcasted] = useState<boolean>(false);

  const toggleChannel = (channel: NotificationChannel) => {
    setSelectedChannels((prev) =>
      prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]
    );
  };

  const handleLangChange = (lang: 'en' | 'hi' | 'ne') => {
    setActiveLang(lang);
    setMessageText(mockMultilingualTemplates[lang].text);
  };

  const handleBroadcast = () => {
    setIsBroadcasted(true);
    onSimulateBroadcast(selectedChannels, messageText);
  };

  return (
    <div className={cn('data-card hud-border flex flex-col rounded-[4px]', className)}>
      {/* Header */}
      <div className="p-3 hud-border-b bg-surface-container-low/80 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <Icon name="cell_tower" size="xs" className="text-secondary" />
          <span className="font-sans text-[11px] font-bold tracking-wider text-on-surface uppercase">
            {t.dispatch.warningComposer}
          </span>
        </div>
        <span className="font-mono text-[9px] text-primary bg-primary/10 px-1.5 py-0.5 rounded-[2px] border border-primary/30 font-bold">
          {language === 'hi' ? 'केवल सिम्युलेटेड चेतावनियां' : 'SIMULATED WARNINGS ONLY'}
        </span>
      </div>

      {/* Main Grid */}
      <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 font-mono text-[11px]">
        {/* Left Area: Channels & Composer (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Channel Selectors */}
          <div className="flex flex-col gap-2">
            <span className="font-sans text-[10px] font-bold text-outline uppercase tracking-wider">
              {t.dispatch.selectChannels} ({selectedChannels.length}/6 {t.common.active})
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {(
                [
                  { id: 'SMS', label: 'SMS (SIMULATED)', icon: 'sms' },
                  { id: 'MOBILE_PUSH', label: 'MOBILE PUSH (SIMULATED)', icon: 'notifications_active' },
                  { id: 'RADIO', label: 'RADIO (SIMULATED)', icon: 'radio' },
                  { id: 'PUBLIC_DISPLAY', label: 'PUBLIC DISPLAY (SIMULATED)', icon: 'volume_up' },
                  { id: 'EMAIL', label: 'EMAIL (SIMULATED)', icon: 'mail' },
                  { id: 'WEB_ALERT', label: 'WEB ALERT (SIMULATED)', icon: 'language' },
                ] as const
              ).map((ch) => {
                const isSelected = selectedChannels.includes(ch.id);
                return (
                  <button
                    type="button"
                    key={ch.id}
                    onClick={() => toggleChannel(ch.id)}
                    className={cn(
                      'p-2 rounded-[2px] border flex items-center justify-between text-[10px] transition-colors touch-manipulation cursor-pointer min-h-[36px]',
                      isSelected
                        ? 'bg-secondary/15 border-secondary text-secondary font-bold'
                        : 'bg-surface-container-lowest border-surface-high text-outline hover:text-on-surface'
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <Icon name={ch.icon} size="xs" />
                      <span>{ch.label}</span>
                    </div>
                    <Icon
                      name={isSelected ? 'check_box' : 'check_box_outline_blank'}
                      size="xs"
                      className={isSelected ? 'text-secondary' : 'text-outline'}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Multilingual Selector & Textarea */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="font-sans text-[10px] font-bold text-outline uppercase tracking-wider">
                {t.dispatch.payloadComposition}
              </span>
              <div className="flex gap-1 text-[9px]">
                {(['en', 'hi', 'ne'] as const).map((l) => (
                  <button
                    type="button"
                    key={l}
                    onClick={() => handleLangChange(l)}
                    className={cn(
                      'px-2 py-0.5 rounded-[2px] font-bold uppercase border transition-colors touch-manipulation cursor-pointer min-h-[28px]',
                      activeLang === l
                        ? 'bg-primary/20 text-primary border-primary'
                        : 'bg-surface-container text-outline border-surface-high'
                    )}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full bg-surface-container-lowest hud-border text-on-surface font-mono text-[11px] p-3 rounded-[3px] focus:border-secondary outline-none h-24 resize-none leading-relaxed font-sans"
            />
            <div className="flex justify-between text-[9px] text-outline">
              <span>{language === 'hi' ? 'वर्ण संख्या:' : 'CHARACTERS:'} {messageText.length} / 160</span>
              <span className="text-secondary">{language === 'hi' ? 'लक्ष्य: डेमो दर्शक सेक्टर 1' : 'TARGET: DEMO AUDIENCE SECTOR 1'}</span>
            </div>
          </div>

          {/* Broadcast Trigger */}
          <div className="pt-2 hud-border-t flex justify-between items-center">
            <span className="text-[9px] text-outline font-sans">
              * {language === 'hi' ? 'कोई वास्तविक संदेश प्रसारित नहीं' : 'NO REAL MESSAGES TRANSMITTED'}
            </span>
            <Button
              onClick={handleBroadcast}
              variant={isBroadcasted ? 'primary' : 'critical'}
              size="sm"
              className="font-bold"
            >
              <Icon name={isBroadcasted ? 'check_circle' : 'broadcast_on_personal'} size="xs" />
              {isBroadcasted ? (language === 'hi' ? 'सिम्युलेटेड प्रसारण कतारबद्ध' : 'SIMULATED BROADCAST QUEUED') : t.dispatch.broadcastWarnings}
            </Button>
          </div>
        </div>

        {/* Right Area: Live Simulated Channel Previews (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <span className="font-sans text-[10px] font-bold text-outline uppercase tracking-wider">
            {t.dispatch.simulatedPreviews}
          </span>

          {/* SMS Bubble Preview */}
          <div className="bg-surface-container-lowest p-3 hud-border rounded-[3px] flex flex-col gap-1">
            <div className="flex justify-between items-center text-[9px] text-outline border-b border-surface-container-highest pb-1">
              <span className="flex items-center gap-1 text-secondary font-bold">
                <Icon name="sms" size="xs" /> SMS (SIMULATED)
              </span>
              <span className="text-warning font-bold">[{language === 'hi' ? 'सिम्युलेटेड संदेश' : 'SIMULATED MESSAGE'}]</span>
            </div>
            <div className="bg-surface-container-high/80 p-2 rounded text-[10px] text-on-surface mt-1 border-l-2 border-l-critical font-sans">
              <div className="text-critical font-bold text-[9px] mb-0.5 font-mono">DEMO-GLOF-ALERT</div>
              {messageText}
            </div>
          </div>

          {/* Push Notification Card Preview */}
          <div className="bg-surface-container-lowest p-3 hud-border rounded-[3px] flex flex-col gap-1">
            <div className="flex justify-between items-center text-[9px] text-outline border-b border-surface-container-highest pb-1">
              <span className="flex items-center gap-1 text-secondary font-bold">
                <Icon name="notifications_active" size="xs" /> MOBILE PUSH (SIMULATED)
              </span>
              <span className="text-warning font-bold">[{language === 'hi' ? 'सिम्युलेटेड संदेश' : 'SIMULATED MESSAGE'}]</span>
            </div>
            <div className="bg-surface-card p-2 rounded text-[10px] text-on-surface mt-1 border border-surface-high flex items-start gap-2 font-sans">
              <div className="w-5 h-5 rounded bg-critical flex items-center justify-center text-background text-[10px] font-bold mt-0.5">
                !
              </div>
              <div className="flex-grow">
                <div className="font-bold text-critical text-[10px] font-mono">GLOF Sentry // DEMO WARNING</div>
                <div className="text-on-surface-variant text-[9px] line-clamp-2">{messageText}</div>
              </div>
            </div>
          </div>

          {/* Public Siren Tower Display Preview */}
          <div className="bg-surface-container-lowest p-3 hud-border rounded-[3px] flex flex-col gap-1">
            <div className="flex justify-between items-center text-[9px] text-outline border-b border-surface-container-highest pb-1">
              <span className="flex items-center gap-1 text-critical font-bold">
                <Icon name="volume_up" size="xs" /> PUBLIC DISPLAY / SIREN (SIMULATED)
              </span>
              <span className="text-warning font-bold">[{language === 'hi' ? 'सिम्युलेटेड संदेश' : 'SIMULATED MESSAGE'}]</span>
            </div>
            <div className="bg-critical/15 text-critical p-2 rounded text-[10px] font-bold mt-1 border border-critical/40 text-center uppercase tracking-wider flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-critical pulse-ping" />
              <span>{language === 'hi' ? 'डेमो निकासी सायरन अनुक्रम सक्रिय' : 'DEMO EVACUATION TONE SEQUENCE ACTIVE'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
