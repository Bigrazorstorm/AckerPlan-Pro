/**
 * Sync Manager for Background Synchronization
 * Handles syncing data between IndexedDB and backend API
 */

import {
  STORES,
  getPendingSyncItems,
  markSynced,
  getAll,
  putMany,
  type SyncQueueItem,
  type StoreName,
} from './indexeddb';

type SyncStatus = 'idle' | 'syncing' | 'error';

class SyncManager {
  private syncStatus: SyncStatus = 'idle';
  private listeners: Set<(status: SyncStatus) => void> = new Set();
  private syncInterval: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      // Listen for online/offline events
      window.addEventListener('online', () => this.triggerSync());
      
      // Start periodic sync (every 5 minutes when online)
      this.startPeriodicSync();
    }
  }

  /**
   * Add listener for sync status changes
   */
  addListener(callback: (status: SyncStatus) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Get current sync status
   */
  getStatus(): SyncStatus {
    return this.syncStatus;
  }

  /**
   * Set sync status and notify listeners
   */
  private setStatus(status: SyncStatus): void {
    this.syncStatus = status;
    this.listeners.forEach((callback) => callback(status));
  }

  /**
   * Start periodic background sync
   */
  startPeriodicSync(): void {
    if (this.syncInterval) {
      return;
    }

    this.syncInterval = setInterval(() => {
      if (navigator.onLine && this.syncStatus === 'idle') {
        this.triggerSync();
      }
    }, 5 * 60 * 1000); // 5 minutes
  }

  /**
   * Stop periodic sync
   */
  stopPeriodicSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  /**
   * Trigger manual sync
   */
  async triggerSync(): Promise<void> {
    if (!navigator.onLine) {
      console.log('Offline - sync deferred');
      return;
    }

    if (this.syncStatus === 'syncing') {
      console.log('Sync already in progress');
      return;
    }

    this.setStatus('syncing');

    try {
      // Step 1: Push local changes to server
      await this.pushChanges();

      // Step 2: Pull latest data from server
      await this.pullData();

      this.setStatus('idle');
      console.log('Sync completed successfully');
    } catch (error) {
      console.error('Sync error:', error);
      this.setStatus('error');
      
      // Reset to idle after 30 seconds
      setTimeout(() => {
        if (this.syncStatus === 'error') {
          this.setStatus('idle');
        }
      }, 30000);
    }
  }

  /**
   * Push local changes to backend
   */
  private async pushChanges(): Promise<void> {
    const pendingItems = await getPendingSyncItems();

    if (pendingItems.length === 0) {
      return;
    }

    console.log(`Syncing ${pendingItems.length} pending items`);

    for (const item of pendingItems) {
      try {
        await this.syncItem(item);
        if (item.id) {
          await markSynced(item.id);
        }
      } catch (error) {
        console.error('Failed to sync item:', item, error);
        // Continue with next item
      }
    }
  }

  /**
   * Sync a single item to backend
   */
  private async syncItem(item: SyncQueueItem): Promise<void> {
    const endpoint = this.getEndpoint(item.storeName);
    
    switch (item.action) {
      case 'create':
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.data),
        });
        break;

      case 'update':
        await fetch(`${endpoint}/${item.data.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.data),
        });
        break;

      case 'delete':
        await fetch(`${endpoint}/${item.data.id}`, {
          method: 'DELETE',
        });
        break;
    }
  }

  /**
   * Pull latest data from backend and update IndexedDB
   */
  private async pullData(): Promise<void> {
    const stores: StoreName[] = [
      STORES.FIELDS,
      STORES.OPERATIONS,
      STORES.OBSERVATIONS,
      STORES.PERSONNEL,
      STORES.MACHINERY,
      STORES.WAREHOUSE,
    ];

    for (const storeName of stores) {
      try {
        await this.pullStoreData(storeName);
      } catch (error) {
        console.error(`Failed to pull ${storeName}:`, error);
        // Continue with next store
      }
    }
  }

  /**
   * Pull data for a specific store
   */
  private async pullStoreData(storeName: StoreName): Promise<void> {
    const endpoint = this.getEndpoint(storeName);
    
    const response = await fetch(endpoint, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${storeName}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Update IndexedDB with server data
    if (Array.isArray(data)) {
      await putMany(storeName, data);
    }
  }

  /**
   * Get API endpoint for a store
   */
  private getEndpoint(storeName: StoreName): string {
    const baseUrl = '/api';
    
    switch (storeName) {
      case STORES.FIELDS:
        return `${baseUrl}/fields`;
      case STORES.OPERATIONS:
        return `${baseUrl}/operations`;
      case STORES.OBSERVATIONS:
        return `${baseUrl}/observations`;
      case STORES.PERSONNEL:
        return `${baseUrl}/personnel`;
      case STORES.MACHINERY:
        return `${baseUrl}/machinery`;
      case STORES.WAREHOUSE:
        return `${baseUrl}/warehouse`;
      default:
        throw new Error(`Unknown store: ${storeName}`);
    }
  }

  /**
   * Clear all offline data (use with caution)
   */
  async clearOfflineData(): Promise<void> {
    console.warn('Clearing all offline data');
    
    const stores: StoreName[] = [
      STORES.FIELDS,
      STORES.OPERATIONS,
      STORES.OBSERVATIONS,
      STORES.PERSONNEL,
      STORES.MACHINERY,
      STORES.WAREHOUSE,
      STORES.SYNC_QUEUE,
    ];

    const { clear } = await import('./indexeddb');
    for (const storeName of stores) {
      await clear(storeName);
    }
  }
}

// Singleton instance
export const syncManager = new SyncManager();

// Hook for React components
export function useSyncManager() {
  if (typeof window === 'undefined') {
    return {
      status: 'idle' as SyncStatus,
      triggerSync: async () => {},
      clearOfflineData: async () => {},
    };
  }

  return {
    status: syncManager.getStatus(),
    triggerSync: () => syncManager.triggerSync(),
    clearOfflineData: () => syncManager.clearOfflineData(),
  };
}
