'use client';

import React, { useState } from 'react';
import { TopAppBar } from '@/components/navigation/TopAppBar';
import { SidebarNav } from '@/components/navigation/SidebarNav';
import { BottomNavBar } from '@/components/navigation/BottomNavBar';
import { MobileDrawer } from '@/components/navigation/MobileDrawer';
import { ConnectionStatusIndicator } from '@/components/common/ConnectionStatusIndicator';
import { FieldIncidentReportModal } from '@/components/field/FieldIncidentReportModal';
import { useServiceWorker } from '@/lib/hooks/useServiceWorker';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';

interface AppShellProps {
  children: React.ReactNode;
  noPadding?: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({ children, noPadding = false }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isFieldReportOpen, setIsFieldReportOpen] = useState<boolean>(false);
  const { isUpdateAvailable, updateServiceWorker } = useServiceWorker();

  return (
    <div className="min-h-screen flex flex-col pt-16 pb-16 lg:pb-0 relative bg-background selection:bg-secondary/20 selection:text-secondary">
      {/* 1. Global Offline / Network Status Banner */}
      <ConnectionStatusIndicator />

      {/* 2. Service Worker Update Notification Toast */}
      {isUpdateAvailable && (
        <div className="bg-primary/20 border-b border-primary/40 px-4 py-2 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-primary z-50 animate-fadeIn">
          <div className="flex items-center gap-2">
            <Icon name="system_update" size="xs" />
            <span>NEW GLOF SENTRY VERSION DEPLOYED — UPDATE READY</span>
          </div>
          <Button
            onClick={updateServiceWorker}
            variant="primary"
            size="sm"
            className="text-[10px] py-0.5 px-2.5 font-bold"
          >
            REFRESH &amp; UPDATE
          </Button>
        </div>
      )}

      {/* 3. Top App Bar */}
      <TopAppBar
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenFieldReport={() => setIsFieldReportOpen(true)}
      />

      {/* 4. Main Body Canvas: Desktop Sidebar + Content Workstation */}
      <div className="flex-1 flex w-full max-w-[1920px] mx-auto">
        {/* Persistent Desktop Sidebar */}
        <SidebarNav onOpenFieldReport={() => setIsFieldReportOpen(true)} />

        {/* Dynamic Page Content */}
        <main
          className={
            noPadding
              ? 'flex-1 relative w-full h-[calc(100dvh-128px)] lg:h-[calc(100dvh-64px)] min-h-[380px] overflow-hidden'
              : 'flex-1 p-3 sm:p-4 md:p-6 w-full min-w-0 relative z-10 overflow-x-hidden'
          }
        >
          {children}
        </main>
      </div>

      {/* 5. Mobile Navigation Bar */}
      <BottomNavBar
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenFieldReport={() => setIsFieldReportOpen(true)}
      />

      {/* 6. Mobile Slide-out Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenFieldReport={() => setIsFieldReportOpen(true)}
      />

      {/* 7. Field Incident Report Modal */}
      <FieldIncidentReportModal
        isOpen={isFieldReportOpen}
        onClose={() => setIsFieldReportOpen(false)}
      />
    </div>
  );
};
