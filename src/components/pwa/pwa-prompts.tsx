'use client';

import { useState, useEffect } from 'react';
import { X, Download, RefreshCw, WifiOff, Wifi } from 'lucide-react';
import { usePWA } from '@/hooks/use-pwa';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export function PWAPrompts() {
  const { isInstallable, isOnline, updateAvailable, installApp, updateApp } = usePWA();
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [showOfflineNotice, setShowOfflineNotice] = useState(false);
  const t = useTranslations('PWA');

  useEffect(() => {
    // Show install prompt if installable
    if (isInstallable) {
      const installDismissed = localStorage.getItem('pwa_install_dismissed');
      if (!installDismissed) {
        setShowInstallPrompt(true);
      }
    }
  }, [isInstallable]);

  useEffect(() => {
    // Show update prompt if update available
    if (updateAvailable) {
      setShowUpdatePrompt(true);
    }
  }, [updateAvailable]);

  useEffect(() => {
    // Show offline notice
    if (!isOnline) {
      setShowOfflineNotice(true);
    } else {
      setShowOfflineNotice(false);
    }
  }, [isOnline]);

  const handleInstallDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa_install_dismissed', 'true');
  };

  const handleInstall = () => {
    installApp();
    setShowInstallPrompt(false);
  };

  const handleUpdate = () => {
    updateApp();
    setShowUpdatePrompt(false);
  };

  if (!showInstallPrompt && !showUpdatePrompt && !showOfflineNotice) {
    return null;
  }

  return (
    <>
      {/* Install Prompt */}
      {showInstallPrompt && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom-5">
          <div className="bg-card border rounded-lg shadow-lg p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Download className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">
                    {t('installTitle') || 'App installieren'}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t('installDescription') || 'Installieren Sie AckerPlan Pro für schnelleren Zugriff und Offline-Nutzung'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleInstallDismiss}
                className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Schließen"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleInstall}
                className="flex-1"
                size="sm"
              >
                {t('install') || 'Installieren'}
              </Button>
              <Button
                onClick={handleInstallDismiss}
                variant="outline"
                size="sm"
              >
                {t('later') || 'Später'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Update Prompt */}
      {showUpdatePrompt && (
        <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-top-5">
          <div className="bg-card border rounded-lg shadow-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <RefreshCw className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">
                  {t('updateTitle') || 'Update verfügbar'}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t('updateDescription') || 'Eine neue Version ist verfügbar. Jetzt aktualisieren?'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleUpdate}
                className="flex-1"
                size="sm"
              >
                {t('update') || 'Aktualisieren'}
              </Button>
              <Button
                onClick={() => setShowUpdatePrompt(false)}
                variant="outline"
                size="sm"
              >
                {t('later') || 'Später'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Offline Notice */}
      {showOfflineNotice && (
        <div className="fixed top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-96 z-50 animate-in slide-in-from-top-5">
          <div className="bg-warning/10 border border-warning rounded-lg shadow-lg p-3">
            <div className="flex items-center gap-3">
              <WifiOff className="h-5 w-5 text-warning flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-warning">
                  {t('offline') || 'Offline-Modus'}
                </p>
                <p className="text-xs text-warning/80 mt-0.5">
                  {t('offlineDescription') || 'Sie arbeiten im Offline-Modus. Einige Funktionen sind eingeschränkt.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Online Notice (brief) */}
      {!showOfflineNotice && isOnline && (
        <div className="fixed top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-96 z-50 animate-in slide-in-from-top-5 duration-500 animate-out fade-out delay-2000">
          <div className="bg-success/10 border border-success rounded-lg shadow-lg p-3">
            <div className="flex items-center gap-3">
              <Wifi className="h-5 w-5 text-success flex-shrink-0" />
              <p className="text-sm font-medium text-success">
                {t('online') || 'Verbindung wiederhergestellt'}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
