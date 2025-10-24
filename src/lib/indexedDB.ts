import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface GalleryDB extends DBSchema {
  images: {
    key: string;
    value: {
      id: string;
      blob: Blob;
      category: string;
      timestamp: number;
      width: number;
      height: number;
      sizeBytes: number;
    };
    indexes: { 'by-category': string; 'by-timestamp': number };
  };
  categories: {
    key: string;
    value: {
      id: string;
      name: string;
      color: string;
      count: number;
    };
  };
}

let dbInstance: IDBPDatabase<GalleryDB> | null = null;

export async function getDB() {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<GalleryDB>('memo-gallery', 1, {
    upgrade(db) {
      // Images store
      if (!db.objectStoreNames.contains('images')) {
        const imageStore = db.createObjectStore('images', { keyPath: 'id' });
        imageStore.createIndex('by-category', 'category');
        imageStore.createIndex('by-timestamp', 'timestamp');
      }

      // Categories store
      if (!db.objectStoreNames.contains('categories')) {
        db.createObjectStore('categories', { keyPath: 'id' });
      }
    },
  });

  return dbInstance;
}

// Image operations
export async function saveImage(
  id: string,
  blob: Blob,
  category: string,
  width: number,
  height: number
) {
  const db = await getDB();
  await db.put('images', {
    id,
    blob,
    category,
    timestamp: Date.now(),
    width,
    height,
    sizeBytes: blob.size,
  });
}

export async function getImage(id: string) {
  const db = await getDB();
  return db.get('images', id);
}

export async function getAllImages() {
  const db = await getDB();
  return db.getAll('images');
}

export async function getImagesByCategory(category: string) {
  const db = await getDB();
  return db.getAllFromIndex('images', 'by-category', category);
}

export async function deleteImage(id: string) {
  const db = await getDB();
  await db.delete('images', id);
}

export async function deleteImages(ids: string[]) {
  const db = await getDB();
  const tx = db.transaction('images', 'readwrite');
  await Promise.all([
    ...ids.map(id => tx.store.delete(id)),
    tx.done,
  ]);
}

// Category operations
export async function saveCategory(id: string, name: string, color: string) {
  const db = await getDB();
  await db.put('categories', { id, name, color, count: 0 });
}

export async function getAllCategories() {
  const db = await getDB();
  return db.getAll('categories');
}

export async function deleteCategory(id: string) {
  const db = await getDB();
  await db.delete('categories', id);
}

export async function updateCategoryCounts() {
  const db = await getDB();
  const categories = await db.getAll('categories');
  const images = await db.getAll('images');

  const counts = images.reduce((acc, img) => {
    acc[img.category] = (acc[img.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const tx = db.transaction('categories', 'readwrite');
  await Promise.all([
    ...categories.map(cat =>
      tx.store.put({ ...cat, count: counts[cat.id] || 0 })
    ),
    tx.done,
  ]);
}
