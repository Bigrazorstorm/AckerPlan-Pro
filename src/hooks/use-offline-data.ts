/**
 * React Hook for Offline Data Management
 * Provides CRUD operations with IndexedDB caching and background sync
 */

import { useState, useEffect, useCallback } from 'react';
import {
  STORES,
  getAll,
  getById,
  getByIndex,
  put,
  remove,
  addToSyncQueue,
  isIndexedDBAvailable,
  type StoreName,
} from '@/lib/indexeddb';
import { syncManager } from '@/lib/sync-manager';

interface UseOfflineDataOptions<T> {
  storeName: StoreName;
  companyId?: string;
  autoSync?: boolean;
}

interface UseOfflineDataReturn<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  getItem: (id: string) => Promise<T | undefined>;
  createItem: (item: T) => Promise<void>;
  updateItem: (item: T) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  isOnline: boolean;
  isSyncing: boolean;
}

export function useOfflineData<T extends { id: string; companyId?: string }>(
  options: UseOfflineDataOptions<T>
): UseOfflineDataReturn<T> {
  const { storeName, companyId, autoSync = true } = options;
  
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isSyncing, setIsSyncing] = useState(false);

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
    if (typeof window === 'undefined') return;

    const unsubscribe = syncManager.addListener((status) => {
      setIsSyncing(status === 'syncing');
    });

    return unsubscribe;
  }, []);

  // Load data from IndexedDB
  const loadData = useCallback(async () => {
    if (!isIndexedDBAvailable()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let items: T[];
      
      if (companyId) {
        items = await getByIndex<T>(storeName, 'companyId', companyId);
      } else {
        items = await getAll<T>(storeName);
      }

      setData(items);
    } catch (err) {
      setError(err as Error);
      console.error(`Failed to load ${storeName}:`, err);
    } finally {
      setLoading(false);
    }
  }, [storeName, companyId]);

  // Initial load and sync
  useEffect(() => {
    loadData();

    // Trigger sync if online and autoSync enabled
    if (isOnline && autoSync) {
      syncManager.triggerSync().then(() => {
        // Reload data after sync
        loadData();
      });
    }
  }, [loadData, isOnline, autoSync]);

  // Get single item
  const getItem = useCallback(async (id: string): Promise<T | undefined> => {
    if (!isIndexedDBAvailable()) {
      return undefined;
    }

    try {
      return await getById<T>(storeName, id);
    } catch (err) {
      console.error(`Failed to get item ${id}:`, err);
      return undefined;
    }
  }, [storeName]);

  // Create item
  const createItem = useCallback(async (item: T) => {
    if (!isIndexedDBAvailable()) {
      throw new Error('IndexedDB not available');
    }

    try {
      // Add to IndexedDB
      await put(storeName, item);

      // Add to sync queue
      await addToSyncQueue({
        action: 'create',
        storeName,
        data: item,
      });

      // Update local state
      setData((prev) => [...prev, item]);

      // Trigger sync if online
      if (isOnline) {
        syncManager.triggerSync();
      }
    } catch (err) {
      console.error('Failed to create item:', err);
      throw err;
    }
  }, [storeName, isOnline]);

  // Update item
  const updateItem = useCallback(async (item: T) => {
    if (!isIndexedDBAvailable()) {
      throw new Error('IndexedDB not available');
    }

    try {
      // Update in IndexedDB
      await put(storeName, item);

      // Add to sync queue
      await addToSyncQueue({
        action: 'update',
        storeName,
        data: item,
      });

      // Update local state
      setData((prev) =>
        prev.map((existingItem) =>
          existingItem.id === item.id ? item : existingItem
        )
      );

      // Trigger sync if online
      if (isOnline) {
        syncManager.triggerSync();
      }
    } catch (err) {
      console.error('Failed to update item:', err);
      throw err;
    }
  }, [storeName, isOnline]);

  // Delete item
  const deleteItem = useCallback(async (id: string) => {
    if (!isIndexedDBAvailable()) {
      throw new Error('IndexedDB not available');
    }

    try {
      // Remove from IndexedDB
      await remove(storeName, id);

      // Add to sync queue
      await addToSyncQueue({
        action: 'delete',
        storeName,
        data: { id },
      });

      // Update local state
      setData((prev) => prev.filter((item) => item.id !== id));

      // Trigger sync if online
      if (isOnline) {
        syncManager.triggerSync();
      }
    } catch (err) {
      console.error('Failed to delete item:', err);
      throw err;
    }
  }, [storeName, isOnline]);

  // Refetch data
  const refetch = useCallback(async () => {
    await loadData();
  }, [loadData]);

  return {
    data,
    loading,
    error,
    refetch,
    getItem,
    createItem,
    updateItem,
    deleteItem,
    isOnline,
    isSyncing,
  };
}

// Convenience hooks for specific stores
export function useOfflineFields(companyId?: string) {
  return useOfflineData({
    storeName: STORES.FIELDS,
    companyId,
  });
}

export function useOfflineOperations(companyId?: string) {
  return useOfflineData({
    storeName: STORES.OPERATIONS,
    companyId,
  });
}

export function useOfflineObservations(companyId?: string) {
  return useOfflineData({
    storeName: STORES.OBSERVATIONS,
    companyId,
  });
}

export function useOfflinePersonnel(companyId?: string) {
  return useOfflineData({
    storeName: STORES.PERSONNEL,
    companyId,
  });
}

export function useOfflineMachinery(companyId?: string) {
  return useOfflineData({
    storeName: STORES.MACHINERY,
    companyId,
  });
}

export function useOfflineWarehouse(companyId?: string) {
  return useOfflineData({
    storeName: STORES.WAREHOUSE,
    companyId,
  });
}
