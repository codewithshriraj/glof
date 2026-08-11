/**
 * IndexedDB Client-Side Storage Manager for Field Incident Reporting
 * 
 * Complies with offline-first safety requirements:
 * Stores complex binary photo data, GPS telemetry, severity, and sync queues
 * that survive page refreshes and offline connectivity lapses.
 */

export interface FieldIncidentRecord {
  id: string;
  title: string;
  lakeId: string;
  lakeName: string;
  severity: 'OBSERVATION' | 'SEEPAGE_SPIKE' | 'DEBRIS_SLIDE' | 'MORAINE_CREEP' | 'IMMINENT_BREACH';
  description: string;
  latitude: number | null;
  longitude: number | null;
  accuracyM: number | null;
  altitudeM: number | null;
  timestampUTC: string;
  photoDataUrl: string | null;
  operatorCallsign: string;
  syncStatus: 'DRAFT' | 'SYNC_PENDING' | 'SYNCING' | 'SYNCED' | 'SYNC_FAILED';
  retryCount: number;
  lastSyncAttemptUTC: string | null;
}

const DB_NAME = 'GLOFSentry_Field_DB';
const DB_VERSION = 1;
const STORE_NAME = 'field_incidents';

export function openIncidentDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported on this platform'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('syncStatus', 'syncStatus', { unique: false });
        store.createIndex('timestampUTC', 'timestampUTC', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

export async function getAllIncidents(): Promise<FieldIncidentRecord[]> {
  try {
    const db = await openIncidentDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => {
        resolve(req.result || []);
      };

      req.onerror = () => {
        reject(req.error);
      };
    });
  } catch {
    return [];
  }
}

export async function saveIncident(record: FieldIncidentRecord): Promise<void> {
  const db = await openIncidentDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(record);

    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function updateIncidentStatus(
  id: string,
  status: FieldIncidentRecord['syncStatus'],
  timestampUTC?: string
): Promise<void> {
  const db = await openIncidentDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const getReq = store.get(id);

    getReq.onsuccess = () => {
      const record: FieldIncidentRecord = getReq.result;
      if (record) {
        record.syncStatus = status;
        if (timestampUTC) {
          record.lastSyncAttemptUTC = timestampUTC;
        }
        if (status === 'SYNC_FAILED') {
          record.retryCount = (record.retryCount || 0) + 1;
        }
        store.put(record);
      }
      resolve();
    };

    getReq.onerror = () => reject(getReq.error);
  });
}

export async function deleteIncident(id: string): Promise<void> {
  const db = await openIncidentDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);

    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}
