'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { GlacialLake } from '@/lib/types/glof';

interface LakeHeaderActionsProps {
  lake: GlacialLake;
}

export const LakeHeaderActions: React.FC<LakeHeaderActionsProps> = ({ lake }) => {
  const [downloaded, setDownloaded] = useState(false);

  const handleExportGeoJson = () => {
    const geoData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [lake.coordinates.lng, lake.coordinates.lat],
          },
          properties: {
            id: lake.id,
            code: lake.code,
            name: lake.name,
            basin: lake.basin,
            elevationM: lake.coordinates.elevationM,
            surfaceAreaKm2: lake.surfaceAreaKm2,
            volumeMCM: lake.estimatedVolumeMCM,
            freeboardM: lake.freeboardM,
            riskScore: lake.riskScore,
            riskLevel: lake.riskLevel,
            riskStatus: lake.riskStatus,
            exportedAtUTC: new Date().toISOString(),
          },
        },
      ],
    };

    const blob = new Blob([JSON.stringify(geoData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GLOF_${lake.code.replace(/\s+/g, '_')}_telemetry.geojson`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto">
      <Button
        onClick={handleExportGeoJson}
        variant="outline"
        size="sm"
        className="font-mono text-[10px] min-h-[36px] flex-1 sm:flex-initial"
      >
        <Icon name={downloaded ? 'check_circle' : 'download'} size="xs" className={downloaded ? 'text-secondary' : ''} />
        <span>{downloaded ? 'GEOJSON EXPORTED' : 'EXPORT GEOJSON'}</span>
      </Button>

      <Link href="/dispatch" className="flex-1 sm:flex-initial">
        <Button
          variant="primary"
          size="sm"
          className="font-mono text-[10px] min-h-[36px] w-full"
        >
          <Icon name="crisis_alert" size="xs" filled />
          <span>DISPATCH ALERT →</span>
        </Button>
      </Link>
    </div>
  );
};
