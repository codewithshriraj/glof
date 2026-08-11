'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { LiveRiskMap } from '@/components/map/LiveRiskMap';

export default function MapPage() {
  return (
    <AppShell noPadding={true}>
      <div className="relative w-full h-full min-h-[380px] overflow-hidden bg-[#0c141c]">
        <LiveRiskMap />
      </div>
    </AppShell>
  );
}
