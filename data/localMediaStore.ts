const dbName = 'gold-house-local-media';
const storeName = 'mediaFiles';
const dbVersion = 1;
const localMediaReferencePrefix = 'gold-house-local-media://';

type StoredMedia = {
  id: string;
  blob: Blob;
  mimeType: string;
  fileName: string;
  createdAt: string;
};

export function createLocalMediaReference(id: string) {
  return `${localMediaReferencePrefix}${id}`;
}

export function getLocalMediaReferenceId(uri?: string | null) {
  if (!uri?.startsWith(localMediaReferencePrefix)) {
    return null;
  }

  return uri.slice(localMediaReferencePrefix.length);
}

function canUseIndexedDb() {
  return typeof indexedDB !== 'undefined';
}

function openMediaDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (!canUseIndexedDb()) {
      reject(new Error('IndexedDB is not available'));
      return;
    }

    const request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveLocalMediaBlob(id: string, file: File | Blob, fileName = 'media') {
  const db = await openMediaDb();

  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const item: StoredMedia = {
      id,
      blob: file,
      mimeType: file.type,
      fileName,
      createdAt: new Date().toISOString(),
    };

    store.put(item);
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

export async function loadLocalMediaBlobUrl(id: string) {
  const db = await openMediaDb();

  return new Promise<string | null>((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(id);

    request.onsuccess = () => {
      db.close();
      const item = request.result as StoredMedia | undefined;
      resolve(item?.blob ? URL.createObjectURL(item.blob) : null);
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

export async function deleteLocalMediaBlob(id: string) {
  const db = await openMediaDb();

  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    transaction.objectStore(storeName).delete(id);
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}
