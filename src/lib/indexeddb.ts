/**
 * IndexedDB Utilities for Offline Storage
 * Provides offline caching for fields, operations, observations
 */

const DB_NAME = 'ackerplan_pro_offline';
const DB_VERSION = 1;

// Store names
export const STORES = {
  FIELDS: 'fields',
  OPERATIONS: 'operations',
  OBSERVATIONS: 'observations',
  PERSONNEL: 'personnel',
  MACHINERY: 'machinery',
  WAREHOUSE: 'warehouse',
  SYNC_QUEUE: 'sync_queue',
} as const;

export type StoreName = typeof STORES[keyof typeof STORES];

// Initialize database
export async function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object stores
      if (!db.objectStoreNames.contains(STORES.FIELDS)) {
        const fieldStore = db.createObjectStore(STORES.FIELDS, { keyPath: 'id' });
        fieldStore.createIndex('companyId', 'companyId', { unique: false });
        fieldStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.OPERATIONS)) {
        const opStore = db.createObjectStore(STORES.OPERATIONS, { keyPath: 'id' });
        opStore.createIndex('companyId', 'companyId', { unique: false });
        opStore.createIndex('fieldId', 'fieldId', { unique: false });
        opStore.createIndex('status', 'status', { unique: false });
        opStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.OBSERVATIONS)) {
        const obsStore = db.createObjectStore(STORES.OBSERVATIONS, { keyPath: 'id' });
        obsStore.createIndex('companyId', 'companyId', { unique: false });
        obsStore.createIndex('fieldId', 'fieldId', { unique: false });
        obsStore.createIndex('date', 'date', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.PERSONNEL)) {
        const persStore = db.createObjectStore(STORES.PERSONNEL, { keyPath: 'id' });
        persStore.createIndex('companyId', 'companyId', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.MACHINERY)) {
        const machStore = db.createObjectStore(STORES.MACHINERY, { keyPath: 'id' });
        machStore.createIndex('companyId', 'companyId', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.WAREHOUSE)) {
        const wareStore = db.createObjectStore(STORES.WAREHOUSE, { keyPath: 'id' });
        wareStore.createIndex('companyId', 'companyId', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
        const syncStore = db.createObjectStore(STORES.SYNC_QUEUE, { keyPath: 'id', autoIncrement: true });
        syncStore.createIndex('timestamp', 'timestamp', { unique: false });
        syncStore.createIndex('synced', 'synced', { unique: false });
      }
    };
  });
}

// Generic CRUD operations
export async function getAll<T>(storeName: StoreName): Promise<T[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getById<T>(storeName: StoreName, id: string): Promise<T | undefined> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getByIndex<T>(
  storeName: StoreName,
  indexName: string,
  value: string | number
): Promise<T[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const index = store.index(indexName);
    const request = index.getAll(value);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function put<T>(storeName: StoreName, item: T): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(item);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function putMany<T>(storeName: StoreName, items: T[]): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);

    let completed = 0;
    items.forEach((item) => {
      const request = store.put(item);
      request.onsuccess = () => {
        completed++;
        if (completed === items.length) {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });

    if (items.length === 0) {
      resolve();
    }
  });
}

export async function remove(storeName: StoreName, id: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function clear(storeName: StoreName): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Sync queue operations
export interface SyncQueueItem {
  id?: number;
  action: 'create' | 'update' | 'delete';
  storeName: StoreName;
  data: any;
  timestamp: number;
  synced: boolean;
}

export async function addToSyncQueue(item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'synced'>): Promise<void> {
  const queueItem: SyncQueueItem = {
    ...item,
    timestamp: Date.now(),
    synced: false,
  };
  await put(STORES.SYNC_QUEUE, queueItem);
}

export async function getPendingSyncItems(): Promise<SyncQueueItem[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.SYNC_QUEUE, 'readonly');
    const store = transaction.objectStore(STORES.SYNC_QUEUE);
    const index = store.index('synced');
    const request = index.getAll(IDBKeyRange.only(false));

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function markSynced(id: number): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.SYNC_QUEUE, 'readwrite');
    const store = transaction.objectStore(STORES.SYNC_QUEUE);
    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const item = getRequest.result;
      if (item) {
        item.synced = true;
        const putRequest = store.put(item);
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
      } else {
        resolve();
      }
    };
    getRequest.onerror = () => reject(getRequest.error);
  });
}

// Helper to check if IndexedDB is available
export function isIndexedDBAvailable(): boolean {
  return typeof window !== 'undefined' && 'indexedDB' in window;
}
