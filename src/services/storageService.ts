import { Book, DownloadedBookRecord, ReadingProgress, Bookmark, ReaderNote } from '../types/book';

export type { DownloadedBookRecord };

const DB_NAME = 'SchoolBuildOfflineDB';
const DB_VERSION = 1;
const STORE_BOOKS = 'downloaded_books';
const STORE_PROGRESS = 'reading_progress';
const STORE_BOOKMARKS = 'bookmarks';
const STORE_NOTES = 'notes';

class StorageService {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private openDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_BOOKS)) {
          db.createObjectStore(STORE_BOOKS, { keyPath: 'bookId' });
        }
        if (!db.objectStoreNames.contains(STORE_PROGRESS)) {
          db.createObjectStore(STORE_PROGRESS, { keyPath: 'bookId' });
        }
        if (!db.objectStoreNames.contains(STORE_BOOKMARKS)) {
          const bookmarkStore = db.createObjectStore(STORE_BOOKMARKS, { keyPath: 'id' });
          bookmarkStore.createIndex('bookId', 'bookId', { unique: false });
        }
        if (!db.objectStoreNames.contains(STORE_NOTES)) {
          const notesStore = db.createObjectStore(STORE_NOTES, { keyPath: 'id' });
          notesStore.createIndex('bookId', 'bookId', { unique: false });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });

    return this.dbPromise;
  }

  // --- Download & Offline Books ---

  async saveBookForOffline(book: Book): Promise<DownloadedBookRecord> {
    const db = await this.openDB();
    const jsonStr = JSON.stringify(book);
    const sizeBytes = new Blob([jsonStr]).size;

    const record: DownloadedBookRecord = {
      bookId: book.id,
      downloadedAt: Date.now(),
      bookData: book,
      sizeBytes,
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_BOOKS, 'readwrite');
      const store = tx.objectStore(STORE_BOOKS);
      const req = store.put(record);

      req.onsuccess = () => resolve(record);
      req.onerror = () => reject(req.error);
    });
  }

  async getDownloadedBook(bookId: string): Promise<DownloadedBookRecord | null> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_BOOKS, 'readonly');
      const store = tx.objectStore(STORE_BOOKS);
      const req = store.get(bookId);

      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async getAllDownloadedBooks(): Promise<DownloadedBookRecord[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_BOOKS, 'readonly');
      const store = tx.objectStore(STORE_BOOKS);
      const req = store.getAll();

      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async isBookDownloaded(bookId: string): Promise<boolean> {
    const record = await this.getDownloadedBook(bookId);
    return !!record;
  }

  async deleteDownloadedBook(bookId: string): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_BOOKS, 'readwrite');
      const store = tx.objectStore(STORE_BOOKS);
      const req = store.delete(bookId);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // --- Reading Progress ---

  async saveProgress(progress: ReadingProgress): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_PROGRESS, 'readwrite');
      const store = tx.objectStore(STORE_PROGRESS);
      const req = store.put(progress);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async getProgress(bookId: string): Promise<ReadingProgress | null> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_PROGRESS, 'readonly');
      const store = tx.objectStore(STORE_PROGRESS);
      const req = store.get(bookId);

      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async getAllProgress(): Promise<ReadingProgress[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_PROGRESS, 'readonly');
      const store = tx.objectStore(STORE_PROGRESS);
      const req = store.getAll();

      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  // --- Bookmarks ---

  async addBookmark(bookmark: Bookmark): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_BOOKMARKS, 'readwrite');
      const store = tx.objectStore(STORE_BOOKMARKS);
      const req = store.put(bookmark);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async getBookmarks(bookId: string): Promise<Bookmark[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_BOOKMARKS, 'readonly');
      const store = tx.objectStore(STORE_BOOKMARKS);
      const index = store.index('bookId');
      const req = index.getAll(bookId);

      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async removeBookmark(bookmarkId: string): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_BOOKMARKS, 'readwrite');
      const store = tx.objectStore(STORE_BOOKMARKS);
      const req = store.delete(bookmarkId);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // --- Notes ---

  async saveNote(note: ReaderNote): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NOTES, 'readwrite');
      const store = tx.objectStore(STORE_NOTES);
      const req = store.put(note);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async getNotes(bookId: string): Promise<ReaderNote[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NOTES, 'readonly');
      const store = tx.objectStore(STORE_NOTES);
      const index = store.index('bookId');
      const req = index.getAll(bookId);

      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async deleteNote(noteId: string): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NOTES, 'readwrite');
      const store = tx.objectStore(STORE_NOTES);
      const req = store.delete(noteId);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async getAllBookmarks(): Promise<Bookmark[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_BOOKMARKS, 'readonly');
      const store = tx.objectStore(STORE_BOOKMARKS);
      const req = store.getAll();

      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async getAllNotes(): Promise<ReaderNote[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NOTES, 'readonly');
      const store = tx.objectStore(STORE_NOTES);
      const req = store.getAll();

      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  // --- Export file helper (Download as HTML/TXT file for device storage) ---
  exportBookAsFile(book: Book, format: 'html' | 'txt' = 'html') {
    let content = '';
    let mimeType = 'text/plain;charset=utf-8';
    let extension = 'txt';

    if (format === 'html') {
      mimeType = 'text/html;charset=utf-8';
      extension = 'html';
      content = `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <title>${book.title} - ${book.author} | School Build Offline Reader</title>
  <style>
    body { font-family: 'Hind Siliguri', 'Segoe UI', system-ui, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.8; color: #1e293b; background: #fafaf9; }
    h1 { color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; }
    h2 { color: #0284c7; margin-top: 36px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 6px; }
    .meta { color: #64748b; font-size: 0.9em; margin-bottom: 30px; }
    p { margin: 16px 0; font-size: 1.1em; text-align: justify; }
    .badge { display: inline-block; padding: 4px 10px; background: #e0f2fe; color: #0369a1; border-radius: 4px; font-size: 0.85em; font-weight: bold; }
    footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 0.85em; }
  </style>
</head>
<body>
  <div class="badge">${book.className || book.categoryName}</div>
  <h1>${book.title}</h1>
  <div class="meta">লেখক: ${book.author} | ক্যাটাগরি: ${book.categoryName} | স্কুল বিল্ড ডিজিটাল সংস্করণ</div>
  ${book.chapters.map(c => `
    <section>
      <h2>${c.title}</h2>
      ${c.subtitle ? `<p><em>${c.subtitle}</em></p>` : ''}
      <div>${c.content.split('\n\n').map(p => `<p>${p}</p>`).join('')}</div>
    </section>
  `).join('')}
  <footer>সংগৃহীত: School Build ডিজিটাল লাইব্রেরি ও অফলাইন রিডার</footer>
</body>
</html>`;
    } else {
      content = `${book.title}\nলেখক: ${book.author}\nক্যাটাগরি: ${book.categoryName}\n\n=================================\n\n` +
        book.chapters.map(c => `${c.title}\n${'-'.repeat(c.title.length)}\n${c.content}\n\n`).join('\n');
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${book.title.replace(/\s+/g, '_')}_SchoolBuild.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const storageService = new StorageService();
