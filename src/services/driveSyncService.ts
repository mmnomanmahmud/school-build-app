import { storageService, DownloadedBookRecord } from './storageService';
import { Bookmark, ReaderNote, ReadingProgress } from '../types/book';

const BACKUP_FILENAME = 'schoolbuild_cloud_backup.json';

export interface CloudBackupData {
  appName: string;
  version: string;
  exportedAt: string;
  studentEmail?: string;
  studentName?: string;
  downloadedBooks: DownloadedBookRecord[];
  readingProgress: ReadingProgress[];
  bookmarks: Bookmark[];
  notes: ReaderNote[];
  favoriteBookIds: string[];
}

export const driveSyncService = {
  // -----------------------------------------------------------
  // Check if access token is available or request fresh token
  // -----------------------------------------------------------
  async findBackupFile(accessToken: string): Promise<string | null> {
    try {
      const query = encodeURIComponent(`name = '${BACKUP_FILENAME}' and trashed = false`);
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,modifiedTime,size)`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Google Drive API error: ${response.status}`);
      }

      const data = await response.json();
      if (data.files && data.files.length > 0) {
        return data.files[0].id;
      }
      return null;
    } catch (err) {
      console.error('Failed to query Google Drive files', err);
      throw err;
    }
  },

  // -----------------------------------------------------------
  // Backup Local Data to User's Google Drive
  // -----------------------------------------------------------
  async backupToGoogleDrive(
    accessToken: string,
    studentName?: string,
    studentEmail?: string
  ): Promise<{ success: boolean; fileId: string; timestamp: string }> {
    // Gather all local state from IndexedDB
    const downloadedBooks = await storageService.getAllDownloadedBooks();
    const readingProgress = await storageService.getAllProgress();
    const bookmarks = await storageService.getAllBookmarks();
    const notes = await storageService.getAllNotes();

    // Gather favorites
    let favoriteBookIds: string[] = [];
    try {
      const favsRaw = localStorage.getItem('school_build_favorites');
      if (favsRaw) favoriteBookIds = JSON.parse(favsRaw);
    } catch {}

    const payload: CloudBackupData = {
      appName: 'School Build',
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      studentName: studentName || 'শিক্ষার্থী',
      studentEmail: studentEmail || '',
      downloadedBooks,
      readingProgress,
      bookmarks,
      notes,
      favoriteBookIds,
    };

    const fileContent = JSON.stringify(payload, null, 2);
    const existingFileId = await this.findBackupFile(accessToken);

    if (existingFileId) {
      // Update existing file in Google Drive
      const updateRes = await fetch(
        `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=media`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: fileContent,
        }
      );

      if (!updateRes.ok) {
        throw new Error(`Failed to update backup file on Drive: ${updateRes.status}`);
      }

      return {
        success: true,
        fileId: existingFileId,
        timestamp: new Date().toISOString(),
      };
    } else {
      // Create new file via multipart upload
      const metadata = {
        name: BACKUP_FILENAME,
        mimeType: 'application/json',
        description: 'School Build ডিজিটাল পাঠ্যবই অ্যাপের ক্লাউড ব্যাকআপ ফাইল',
      };

      const boundary = '-------314159265358979323846';
      const delimiter = `\r\n--${boundary}\r\n`;
      const closeDelimiter = `\r\n--${boundary}--`;

      const multipartRequestBody =
        delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        fileContent +
        closeDelimiter;

      const createRes = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': `multipart/related; boundary=${boundary}`,
          },
          body: multipartRequestBody,
        }
      );

      if (!createRes.ok) {
        throw new Error(`Failed to create backup file on Drive: ${createRes.status}`);
      }

      const resData = await createRes.json();
      return {
        success: true,
        fileId: resData.id,
        timestamp: new Date().toISOString(),
      };
    }
  },

  // -----------------------------------------------------------
  // Restore Data from Google Drive back into Applet IndexedDB
  // -----------------------------------------------------------
  async restoreFromGoogleDrive(accessToken: string): Promise<CloudBackupData> {
    const fileId = await this.findBackupFile(accessToken);
    if (!fileId) {
      throw new Error('গুগল ড্রাইভে কোনো সংরক্ষিত ব্যাকআপ ফাইল পাওয়া যায়নি!');
    }

    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download backup from Google Drive: ${response.status}`);
    }

    const backupData: CloudBackupData = await response.json();

    // Restore into IndexedDB
    if (backupData.downloadedBooks && Array.isArray(backupData.downloadedBooks)) {
      for (const rec of backupData.downloadedBooks) {
        if (rec.bookData) {
          await storageService.saveBookForOffline(rec.bookData);
        }
      }
    }

    if (backupData.readingProgress && Array.isArray(backupData.readingProgress)) {
      for (const p of backupData.readingProgress) {
        await storageService.saveProgress(p);
      }
    }

    if (backupData.bookmarks && Array.isArray(backupData.bookmarks)) {
      for (const bm of backupData.bookmarks) {
        await storageService.addBookmark(bm);
      }
    }

    if (backupData.notes && Array.isArray(backupData.notes)) {
      for (const n of backupData.notes) {
        await storageService.saveNote(n);
      }
    }

    if (backupData.favoriteBookIds && Array.isArray(backupData.favoriteBookIds)) {
      localStorage.setItem('school_build_favorites', JSON.stringify(backupData.favoriteBookIds));
    }

    return backupData;
  },

  // -----------------------------------------------------------
  // Export backup as offline .json file for manual download
  // -----------------------------------------------------------
  async exportLocalBackupFile(): Promise<void> {
    const downloadedBooks = await storageService.getAllDownloadedBooks();
    const readingProgress = await storageService.getAllProgress();
    const bookmarks = await storageService.getAllBookmarks();
    const notes = await storageService.getAllNotes();

    let favoriteBookIds: string[] = [];
    try {
      const favsRaw = localStorage.getItem('school_build_favorites');
      if (favsRaw) favoriteBookIds = JSON.parse(favsRaw);
    } catch {}

    const payload: CloudBackupData = {
      appName: 'School Build',
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      downloadedBooks,
      readingProgress,
      bookmarks,
      notes,
      favoriteBookIds,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SchoolBuild_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};
