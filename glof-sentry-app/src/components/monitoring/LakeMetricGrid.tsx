'use client';

import React from 'react';
import { GlacialLake } from '@/lib/types/glof';
import { Icon } from '@/components/ui/Icon';
import { useLanguage } from '@/i18n';

interface LakeMetricGridProps {
  lake: GlacialLake;
}

export const LakeMetricGrid: React.FC<LakeMetricGridProps> = ({ lake }) => {
  const { t, language } = useLanguage();
  const isCritical = lake.riskLevel === 'L4';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {/* 1. Estimated Volume */}
      <div className="data-card hud-border p-3 flex flex-col justify-between rounded-[4px]">
        <div className="hud-border-b pb-1 mb-1.5 flex justify-between items-center">
          <span className="font-sans text-[10px] font-bold tracking-wider text-outline uppercase">
            {t.lakeDetail.waterVolume}
          </span>
          <Icon name="water" size="xs" className="text-secondary" />
        </div>
        <div className="font-mono text-[18px] font-bold text-on-surface">
          {lake.estimatedVolumeMCM} <span className="text-[10px] text-outline">MCM</span>
        </div>
        <div className="font-mono text-[9px] text-secondary mt-1">
          ~{(lake.estimatedVolumeMCM * 1000000).toLocaleString()} m³
        </div>
      </div>

      {/* 2. Moraine Freeboard */}
      <div className="data-card hud-border p-3 flex flex-col justify-between border-l-2 border-l-critical rounded-[4px]">
        <div className="hud-border-b pb-1 mb-1.5 flex justify-between items-center">
          <span className="font-sans text-[10px] font-bold tracking-wider text-outline uppercase">
            {t.lakeDetail.moraineFreeboard}
          </span>
          <Icon name="height" size="xs" className="text-critical" />
        </div>
        <div className="font-mono text-[18px] font-bold text-critical">
          {lake.freeboardM.toFixed(1)} <span className="text-[10px] text-outline">m</span>
        </div>
        <div className="font-mono text-[9px] text-critical mt-1 font-bold font-sans">
          {language === 'hi' ? 'सुरक्षा सीमा < 5.0m' : 'SAFETY CRITICAL < 5.0m'}
        </div>
      </div>

      {/* 3. Surface Area & YoY Expansion */}
      <div className="data-card hud-border p-3 flex flex-col justify-between rounded-[4px]">
        <div className="hud-border-b pb-1 mb-1.5 flex justify-between items-center">
          <span className="font-sans text-[10px] font-bold tracking-wider text-outline uppercase">
            {t.lakeDetail.surfaceArea}
          </span>
          <Icon name="aspect_ratio" size="xs" className="text-primary" />
        </div>
        <div className="font-mono text-[18px] font-bold text-on-surface">
          {lake.surfaceAreaKm2.toFixed(3)} <span className="text-[10px] text-outline">km²</span>
        </div>
        <div className="font-mono text-[9px] text-critical mt-1 flex items-center gap-1 font-bold">
          <Icon name="trending_up" size="xs" /> +{lake.yoyExpansionPct}% {language === 'hi' ? 'वार्षिक' : 'YoY'}
        </div>
      </div>

      {/* 4. Composite Risk Score */}
      <div className="data-card hud-border p-3 flex flex-col justify-between border-l-2 border-l-critical rounded-[4px]">
        <div className="hud-border-b pb-1 mb-1.5 flex justify-between items-center">
          <span className="font-sans text-[10px] font-bold tracking-wider text-outline uppercase">
            {t.lakeDetail.compositeGsiScore}
          </span>
          <Icon name="psychology" size="xs" className="text-critical" />
        </div>
        <div className="font-mono text-[18px] font-bold text-critical">
          {lake.riskScore.toFixed(3)}
        </div>
        <div className="font-mono text-[9px] text-critical mt-1 font-bold font-sans">
          {language === 'hi' ? 'स्तर L4 // उच्च जोखिम' : 'LEVEL L4 // HIGH HAZARD'}
        </div>
      </div>

      {/* 5. Ice-Core Degradation */}
      <div className="data-card hud-border p-3 flex flex-col justify-between rounded-[4px]">
        <div className="hud-border-b pb-1 mb-1.5 flex justify-between items-center">
          <span className="font-sans text-[10px] font-bold tracking-wider text-outline uppercase">
            {t.lakeDetail.iceCoreDegradation}
          </span>
          <Icon name="ac_unit" size="xs" className="text-warning" />
        </div>
        <div className="font-mono text-[18px] font-bold text-warning">
          {lake.iceCoreDegradationPct}%
        </div>
        <div className="font-mono text-[9px] text-outline mt-1 font-sans">
          {language === 'hi' ? 'थर्मोकार्स्ट रिक्त स्थान' : 'THERMOKARST VOIDS'}
        </div>
      </div>

      {/* 6. Seepage Accelerance Index */}
      <div className="data-card hud-border p-3 flex flex-col justify-between border-l-2 border-l-secondary rounded-[4px]">
        <div className="hud-border-b pb-1 mb-1.5 flex justify-between items-center">
          <span className="font-sans text-[10px] font-bold tracking-wider text-outline uppercase">
            {t.lakeDetail.seepageIndex}
          </span>
          <Icon name="opacity" size="xs" className="text-secondary" />
        </div>
        <div className="font-mono text-[18px] font-bold text-secondary">
          {lake.seepageIndex.toFixed(2)}
        </div>
        <div className="font-mono text-[9px] text-secondary mt-1 font-sans">
          {language === 'hi' ? 'आंतरिक रिसाव संसूचित' : 'INTERNAL PIPING DETECTED'}
        </div>
      </div>

      {/* 7. Dam Crest Elevation */}
      <div className="data-card hud-border p-3 flex flex-col justify-between rounded-[4px]">
        <div className="hud-border-b pb-1 mb-1.5 flex justify-between items-center">
          <span className="font-sans text-[10px] font-bold tracking-wider text-outline uppercase">
            {t.lakeDetail.damCrestLevel}
          </span>
          <Icon name="terrain" size="xs" className="text-tertiary" />
        </div>
        <div className="font-mono text-[18px] font-bold text-on-surface">
          5,244.6 <span className="text-[10px] text-outline">{t.lakeDetail.masl}</span>
        </div>
        <div className="font-mono text-[9px] text-outline mt-1 font-sans">
          {language === 'hi' ? 'टर्मिनल मोरेन शिखा' : 'TERMINAL MORAINE CREST'}
        </div>
      </div>

      {/* 8. Active Sensor Nodes */}
      <div className="data-card hud-border p-3 flex flex-col justify-between border-l-2 border-l-primary rounded-[4px]">
        <div className="hud-border-b pb-1 mb-1.5 flex justify-between items-center">
          <span className="font-sans text-[10px] font-bold tracking-wider text-outline uppercase">
            {t.lakeDetail.surveillanceGrid}
          </span>
          <Icon name="sensors" size="xs" className="text-primary" />
        </div>
        <div className="font-mono text-[18px] font-bold text-primary">
          06 / 06 <span className="text-[10px] text-outline">{t.common.online}</span>
        </div>
        <div className="font-mono text-[9px] text-primary mt-1 font-sans">
          IRIDIUM + LORA UPLINKS
        </div>
      </div>
    </div>
  );
};
