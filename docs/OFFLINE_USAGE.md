# Offline Data Usage Guide

## Overview

The offline data system uses IndexedDB for local storage and automatic background synchronization. When online, data syncs automatically with the backend. When offline, all changes are queued and synced when connectivity is restored.

## Available Hooks

### Generic Hook: `useOfflineData<T>`

```typescript
import { useOfflineData, STORES } from '@/hooks/use-offline-data';

const {
  data,           // Array of items from IndexedDB
  loading,        // Loading state
  error,          // Error if any
  refetch,        // Manually refetch data
  getItem,        // Get single item by ID
  createItem,     // Create new item
  updateItem,     // Update existing item
  deleteItem,     // Delete item
  isOnline,       // Online/offline status
  isSyncing,      // Sync in progress
} = useOfflineData<Field>({
  storeName: STORES.FIELDS,
  companyId: 'company-123',  // Optional filter
  autoSync: true,            // Auto-sync on mount (default: true)
});
```

### Convenience Hooks

```typescript
import {
  useOfflineFields,
  useOfflineOperations,
  useOfflineObservations,
  useOfflinePersonnel,
  useOfflineMachinery,
  useOfflineWarehouse,
} from '@/hooks/use-offline-data';

// Usage example
const { data: fields, createItem, updateItem, deleteItem } = useOfflineFields('company-123');
```

## Example: Fields Component with Offline Support

```typescript
'use client';

import { useState } from 'react';
import { useOfflineFields } from '@/hooks/use-offline-data';
import { useSession } from '@/context/session-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

export function FieldsWithOffline() {
  const { activeCompany } = useSession();
  const {
    data: fields,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    isOnline,
    isSyncing,
    refetch,
  } = useOfflineFields(activeCompany?.id);

  const handleCreateField = async () => {
    const newField = {
      id: `field-${Date.now()}`,
      companyId: activeCompany?.id || '',
      name: 'New Field',
      area: 10.5,
      cropType: 'wheat',
      status: 'active',
      // ... other properties
    };

    try {
      await createItem(newField);
      // Item is saved to IndexedDB and queued for sync
    } catch (err) {
      console.error('Failed to create field:', err);
    }
  };

  const handleUpdateField = async (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;

    try {
      await updateItem({
        ...field,
        name: 'Updated Name',
      });
    } catch (err) {
      console.error('Failed to update field:', err);
    }
  };

  const handleDeleteField = async (fieldId: string) => {
    try {
      await deleteItem(fieldId);
    } catch (err) {
      console.error('Failed to delete field:', err);
    }
  };

  return (
    <div>
      {/* Connection Status */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="h-4 w-4 text-green-600" />
          ) : (
            <WifiOff className="h-4 w-4 text-orange-600" />
          )}
          <span className="text-sm text-muted-foreground">
            {isOnline ? 'Online' : 'Offline Mode'}
          </span>
        </div>

        {/* Sync Status */}
        {isSyncing && (
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Syncing...</span>
          </div>
        )}

        {/* Manual Refresh */}
        <Button
          variant="outline"
          size="sm"
          onClick={refetch}
          disabled={loading || isSyncing}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Fields List */}
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : (
        <div className="grid gap-4">
          {fields.map((field) => (
            <Card key={field.id}>
              <h3>{field.name}</h3>
              <p>{field.area} ha</p>
              <Button onClick={() => handleUpdateField(field.id)}>
                Edit
              </Button>
              <Button onClick={() => handleDeleteField(field.id)}>
                Delete
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* Create Button */}
      <Button onClick={handleCreateField}>
        Create Field
      </Button>
    </div>
  );
}
```

## Data Flow

### Create Operation (Online)
1. User creates item → `createItem()`
2. Item saved to IndexedDB
3. Action added to sync queue
4. Sync triggered automatically
5. Item sent to backend API
6. Sync queue item marked as synced

### Create Operation (Offline)
1. User creates item → `createItem()`
2. Item saved to IndexedDB
3. Action added to sync queue
4. User continues working offline
5. When connection restored:
   - Sync manager automatically triggers
   - Queued items sent to backend
   - Local data updated with server responses

### Update/Delete Operations
Same flow as create - changes are queued and synced when online.

## Sync Manager

The sync manager runs automatically in the background:

```typescript
import { syncManager } from '@/lib/sync-manager';

// Manual sync trigger
await syncManager.triggerSync();

// Listen to sync status
const unsubscribe = syncManager.addListener((status) => {
  console.log('Sync status:', status); // 'idle' | 'syncing' | 'error'
});

// Clear all offline data (use with caution)
await syncManager.clearOfflineData();
```

### Auto-Sync Behavior
- Syncs automatically when online event fires
- Periodic sync every 5 minutes (when online)
- Syncs after create/update/delete operations
- Pulls latest data from server

## IndexedDB Direct Access

For advanced use cases, access IndexedDB directly:

```typescript
import {
  STORES,
  getAll,
  getById,
  getByIndex,
  put,
  putMany,
  remove,
  clear,
  addToSyncQueue,
} from '@/lib/indexeddb';

// Get all fields
const fields = await getAll(STORES.FIELDS);

// Get by ID
const field = await getById(STORES.FIELDS, 'field-123');

// Get by company
const companyFields = await getByIndex(STORES.FIELDS, 'companyId', 'company-123');

// Create/update
await put(STORES.FIELDS, {
  id: 'field-123',
  name: 'Field Name',
  // ...
});

// Bulk insert
await putMany(STORES.FIELDS, [field1, field2, field3]);

// Delete
await remove(STORES.FIELDS, 'field-123');

// Clear store
await clear(STORES.FIELDS);

// Add to sync queue manually
await addToSyncQueue({
  action: 'create',
  storeName: STORES.FIELDS,
  data: field,
});
```

## PWA Integration

The offline system integrates with the PWA Service Worker:

### Service Worker Events
- **Install**: Precaches essential assets
- **Fetch**: Cache-first strategy for assets, network-first for API
- **Sync**: Background sync events (future enhancement)

### Offline Fallback
When offline and navigating, users see `/offline` page with:
- Status explanation
- Available offline features
- Link to return to app

## Best Practices

### 1. Always Check Online Status
```typescript
if (isOnline) {
  // Call API directly for real-time data
} else {
  // Use cached data from IndexedDB
}
```

### 2. Show Sync Status to Users
Let users know when data is syncing:
```typescript
{isSyncing && <SyncIndicator />}
```

### 3. Handle Conflicts
When data changes both offline and online, the last-write-wins strategy is used by default. For critical data, implement custom conflict resolution.

### 4. Validate Data Before Sync
Ensure data is valid before queuing for sync to avoid backend errors.

### 5. Use companyId Filter
Filter data by company to avoid loading unnecessary data:
```typescript
useOfflineFields(activeCompany.id); // Only this company's fields
```

## Performance Tips

- IndexedDB operations are async - batch operations when possible
- Use `putMany()` for bulk inserts instead of multiple `put()` calls
- Clear old data periodically to prevent IndexedDB bloat
- Use indexes (companyId, updatedAt) for faster queries

## Debugging

### Chrome DevTools
1. Open DevTools → Application tab
2. IndexedDB → `ackerplan_pro_offline`
3. View stores: fields, operations, observations, sync_queue
4. Inspect stored data and sync queue

### Console Logs
The sync manager logs all operations:
```
[Sync Manager] Syncing 5 pending items
[Sync Manager] Sync completed successfully
```

### Force Offline Mode
Chrome DevTools → Network tab → Throttling → Offline

## Migration from Mock Services

To migrate existing components:

1. **Replace service import**:
   ```typescript
   // Before
   import { mockFieldService } from '@/services/mock-field-service';
   
   // After
   import { useOfflineFields } from '@/hooks/use-offline-data';
   ```

2. **Replace useEffect with hook**:
   ```typescript
   // Before
   const [fields, setFields] = useState([]);
   useEffect(() => {
     mockFieldService.getFields(companyId).then(setFields);
   }, [companyId]);
   
   // After
   const { data: fields } = useOfflineFields(companyId);
   ```

3. **Replace CRUD calls**:
   ```typescript
   // Before
   await mockFieldService.createField(newField);
   
   // After
   await createItem(newField);
   ```

## Security Considerations

- IndexedDB data is stored locally in the browser
- Data is NOT encrypted by default
- For sensitive data, implement encryption before storing
- Sync uses existing API authentication
- Clear IndexedDB on logout for shared devices

## Troubleshooting

### Data Not Syncing
1. Check browser console for errors
2. Verify `navigator.onLine` is true
3. Check sync queue: `await getAll(STORES.SYNC_QUEUE)`
4. Manually trigger: `await syncManager.triggerSync()`

### IndexedDB Quota Exceeded
- Browser storage limits: ~50-60% of available disk space
- Clear old data: `await syncManager.clearOfflineData()`
- Implement data retention policy

### Sync Conflicts
- Current strategy: last-write-wins
- For custom resolution, implement conflict detection in sync manager
- Consider adding `version` or `updatedAt` timestamp to all records
