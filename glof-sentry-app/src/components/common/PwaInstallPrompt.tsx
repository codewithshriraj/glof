'use client';

import React, { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PwaInstallPromptProps {
  variant?: 'button' | 'banner' | 'sidebar';
  className?: string;
}

export const PwaInstallPrompt: React.FC<PwaInstallPromptProps> = ({
  variant = 'button',
  className,
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isIos, setIsIos] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if already in standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIos(isIosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowModal(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Show instructional modal (especially for iOS or manual install)
      setShowModal(true);
    }
  };

  if (isInstalled) {
    return null;
  }

  if (variant === 'sidebar') {
    return (
      <>
        <div className={cn('p-3 rounded-[4px] bg-surface-container-low hud-border space-y-2', className)}>
          <div className="flex items-center gap-2 text-secondary font-bold text-[11px] uppercase">
            <Icon name="download_for_offline" size="xs" />
            <span>INSTALL WORKSTATION</span>
          </div>
          <p className="text-[10px] text-outline leading-tight">
            Install GLOF Sentry as a standalone desktop/tablet application with offline capability.
          </p>
          <Button
            onClick={handleInstallClick}
            variant="primary"
            size="sm"
            className="w-full font-bold text-[10px] py-1"
          >
            <Icon name="install_desktop" size="xs" />
            INSTALL PWA
          </Button>
        </div>

        {showModal && <InstallModal isIos={isIos} onClose={() => setShowModal(false)} />}
      </>
    );
  }

  if (variant === 'banner') {
    return (
      <>
        <div className={cn('bg-secondary/10 border-b border-secondary/30 px-4 py-2 flex items-center justify-between gap-3 text-[11px] font-mono', className)}>
          <div className="flex items-center gap-2 text-secondary">
            <Icon name="app_shortcut" size="xs" />
            <span>INSTALL GLOF SENTRY ON YOUR HOME SCREEN FOR INSTANT OFFLINE ACCESS</span>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleInstallClick} variant="primary" size="sm" className="font-bold text-[10px] py-0.5 px-2.5">
              INSTALL
            </Button>
          </div>
        </div>

        {showModal && <InstallModal isIos={isIos} onClose={() => setShowModal(false)} />}
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] font-mono text-[10px] font-bold border transition-all text-secondary border-secondary/40 bg-secondary/10 hover:bg-secondary/20 touch-manipulation cursor-pointer min-h-[36px]',
          className
        )}
        title="Install GLOF Sentry as standalone app"
      >
        <Icon name="install_mobile" size="xs" />
        <span className="hidden sm:inline">INSTALL APP</span>
      </button>

      {showModal && <InstallModal isIos={isIos} onClose={() => setShowModal(false)} />}
    </>
  );
};

interface InstallModalProps {
  isIos: boolean;
  onClose: () => void;
}

const InstallModal: React.FC<InstallModalProps> = ({ isIos, onClose }) => {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn cursor-pointer touch-manipulation"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="data-card hud-border p-6 rounded-[6px] max-w-md w-full space-y-4 font-mono text-[11px] cursor-default"
      >
        <div className="flex justify-between items-start hud-border-b pb-2">
          <div className="flex items-center gap-2 text-secondary font-bold text-[13px] uppercase">
            <Icon name="download" size="sm" />
            <span>INSTALL GLOF SENTRY PWA</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors touch-manipulation cursor-pointer"
            aria-label="Close Modal"
          >
            <Icon name="close" size="xs" />
          </button>
        </div>

        <p className="text-on-surface-variant text-[11px] leading-relaxed">
          Install the platform directly to your home screen or desktop application drawer for fast offline access, full-screen map surveillance, and instant hazard alerts.
        </p>

        {isIos ? (
          <div className="bg-surface-container-lowest p-3 rounded hud-border space-y-2 text-[10px]">
            <span className="font-bold text-secondary block">APPLE iOS SAFARI INSTRUCTIONS:</span>
            <div className="flex items-center gap-2">
              <span className="bg-surface-container px-1.5 py-0.5 rounded font-bold text-primary">1</span>
              <span>Tap the <strong className="text-on-surface">Share button</strong> in Safari’s toolbar.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-surface-container px-1.5 py-0.5 rounded font-bold text-primary">2</span>
              <span>Scroll down and select <strong className="text-secondary">“Add to Home Screen”</strong>.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-surface-container px-1.5 py-0.5 rounded font-bold text-primary">3</span>
              <span>Tap <strong className="text-on-surface">“Add”</strong> in the top right corner.</span>
            </div>
          </div>
        ) : (
          <div className="bg-surface-container-lowest p-3 rounded hud-border space-y-2 text-[10px]">
            <span className="font-bold text-secondary block">DESKTOP / ANDROID INSTRUCTIONS:</span>
            <div className="flex items-center gap-2">
              <span className="bg-surface-container px-1.5 py-0.5 rounded font-bold text-primary">1</span>
              <span>Look for the <strong className="text-secondary">Install icon</strong> in your browser address bar.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-surface-container px-1.5 py-0.5 rounded font-bold text-primary">2</span>
              <span>Or click browser settings (⋮) &rarr; <strong className="text-on-surface">“Install GLOF Sentry”</strong>.</span>
            </div>
          </div>
        )}

        <div className="pt-2 hud-border-t flex justify-end">
          <Button onClick={onClose} variant="primary" size="sm" className="font-bold">
            UNDERSTOOD
          </Button>
        </div>
      </div>
    </div>
  );
};
