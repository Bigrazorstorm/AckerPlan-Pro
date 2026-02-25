/**
 * Sync Status Indicator Component
 * Shows current sync status and pending changes count
 */

'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Wifi, WifiOff, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { syncManager } from '@/lib/sync-manager';
import { getPendingSyncItems, isIndexedDBAvailable } from '@/lib/indexeddb';

export function SyncStatusIndicator() {
  const t = useTranslations('PWA');
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // Monitor online status
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Monitor sync status
  useEffect(() => {
    if (typeof window === 'undefined' || !isIndexedDBAvailable()) return;

    const unsubscribe = syncManager.addListener((status) => {
      setIsSyncing(status === 'syncing');
      
      if (status === 'idle') {
        // Show success briefly after sync completes
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        
        // Update pending count
        updatePendingCount();
      }
    });

    // Initial pending count
    updatePendingCount();

    // Update pending count every 10 seconds
    const interval = setInterval(updatePendingCount, 10000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const updatePendingCount = async () => {
    if (!isIndexedDBAvailable()) return;
    
    try {
      const items = await getPendingSyncItems();
      setPendingCount(items.length);
    } catch (error) {
      console.error('Failed to get pending sync items:', error);
    }
  };

  const handleManualSync = async () => {
    if (!isOnline || isSyncing) return;
    
    try {
      await syncManager.triggerSync();
    } catch (error) {
      console.error('Manual sync failed:', error);
    }
  };

  // Don't render if no IndexedDB support
  if (!isIndexedDBAvailable()) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {/* Connection Status Icon */}
      {isOnline ? (
        <Wifi className="h-4 w-4 text-green-600" />
      ) : (
        <WifiOff className="h-4 w-4 text-orange-600" />
      )}

      {/* Status Text & Indicators */}
      <div className="flex items-center gap-2">
        {isSyncing ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
            <span className="text-sm text-muted-foreground">
              {t('syncing')}
            </span>
          </>
        ) : showSuccess ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-600">
              {t('syncComplete')}
            </span>
          </>
        ) : pendingCount > 0 ? (
          <>
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <span className="text-sm text-muted-foreground">
              {t('syncPending', { count: pendingCount })}
            </span>
          </>
        ) : (
          <span className="text-sm text-muted-foreground">
            {isOnline ? t('online') : t('offline')}
          </span>
        )}
      </div>

      {/* Manual Sync Button */}
      {isOnline && pendingCount > 0 && !isSyncing && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleManualSync}
          className="h-8 px-2"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          {t('manualSync')}
        </Button>
      )}
    </div>
  );
}

/**
 * Compact version for mobile/header
 */
export function SyncStatusBadge() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !isIndexedDBAvailable()) return;

    const unsubscribe = syncManager.addListener((status) => {
      setIsSyncing(status === 'syncing');
      
      if (status === 'idle') {
        updatePendingCount();
      }
    });

    updatePendingCount();
    const interval = setInterval(updatePendingCount, 30000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const updatePendingCount = async () => {
    if (!isIndexedDBAvailable()) return;
    
    try {
      const items = await getPendingSyncItems();
      setPendingCount(items.length);
    } catch (error) {
      console.error('Failed to get pending sync items:', error);
    }
  };

  if (!isIndexedDBAvailable()) {
    return null;
  }

  return (
    <div className="relative">
      {/* Status Icon */}
      {isSyncing ? (
        <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
      ) : isOnline ? (
        <Wifi className="h-4 w-4 text-green-600" />
      ) : (
        <WifiOff className="h-4 w-4 text-orange-600" />
      )}

      {/* Pending Count Badge */}
      {pendingCount > 0 && !isSyncing && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold text-white">
          {pendingCount > 9 ? '9+' : pendingCount}
        </span>
      )}
    </div>
  );
}
