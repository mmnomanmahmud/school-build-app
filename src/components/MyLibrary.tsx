import React, { useState, useEffect } from 'react';
import { Book, DownloadedBookRecord, ReadingProgress } from '../types/book';
import { storageService } from '../services/storageService';
import { BookCard } from './BookCard';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Download,
  FileDown,
  HardDrive,
  PlusCircle,
  RefreshCw,
  Trash2,
  Upload,
  WifiOff
} from 'lucide-react';

interface MyLibraryProps {
  onReadBook: (book: Book, chapterId?: string) => void;
  downloadedBookIds: Set<string>;
  onRefreshDownloads: () => Promise<void>;
  onExportFile: (book: Book) => void;
}

export const MyLibrary: React.FC<MyLibraryProps> = ({
  onReadBook,
  downloadedBookIds,
  onRefreshDownloads,
  onExportFile,
}) => {
  const [downloadedRecords, setDownloadedRecords] = useState<DownloadedBookRecord[]>([]);
  const [readingProgressList, setReadingProgressList] = useState<ReadingProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Custom Book Upload State
  const [customTitle, setCustomTitle] = useState('');
  const [customAuthor, setCustomAuthor] = useState('');
  const [customCategory, setCustomCategory] = useState('সাধারণ');
  const [customContent, setCustomContent] = useState('');
  const [uploadError, setUploadError] = useState('');

  // Load records
  const loadData = async () => {
    setLoading(true);
    try {
      const records = await storageService.getAllDownloadedBooks();
      setDownloadedRecords(records);
      const progress = await storageService.getAllProgress();
      setReadingProgressList(progress);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [downloadedBookIds.size]);

  // Total storage calculated
  const totalSizeBytes = downloadedRecords.reduce((acc, curr) => acc + (curr.sizeBytes || 0), 0);
  const totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(2);

  const handleDeleteDownloaded = async (bookId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('আপনি কি এই বইটি অফলাইন শেলফ থেকে মুছে ফেলতে চান?')) {
      await storageService.deleteDownloadedBook(bookId);
      await onRefreshDownloads();
      await loadData();
    }
  };

  // Find last read book
  const lastReadProgress = [...readingProgressList].sort(
    (a, b) => b.lastReadTimestamp - a.lastReadTimestamp
  )[0];

  const lastReadBookRecord = lastReadProgress
    ? downloadedRecords.find((r) => r.bookId === lastReadProgress.bookId)
    : null;

  // Handle custom file upload (e.g. .txt, .html, .md)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setCustomContent(text);
        if (!customTitle) {
          const fileName = file.name.replace(/\.[^/.]+$/, '');
          setCustomTitle(fileName);
        }
      }
    };
    reader.readAsText(file);
  };

  // Save custom book to offline library
  const handleSaveCustomBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customContent.trim()) {
      setUploadError('অনুগ্রহ করে বইয়ের শিরোনাম এবং বিষয়বস্তু প্রদান করুন।');
      return;
    }

    const newCustomBook: Book = {
      id: `custom-book-${Date.now()}`,
      title: customTitle.trim(),
      author: customAuthor.trim() || 'নিজস্ব বই',
      category: 'story',
      categoryName: customCategory,
      className: 'ব্যবহারকারীর নিজস্ব বই',
      description: 'অফলাইনে পড়ার জন্য ব্যবহারকারী কর্তৃক সংযুক্ত নিজস্ব বই।',
      coverBgColor: 'from-teal-800 to-slate-900',
      totalChapters: 1,
      fileSizeEstimate: `${(new Blob([customContent]).size / 1024).toFixed(1)} KB`,
      rating: 5.0,
      readersCount: 1,
      tags: ['কাস্টম বই', 'অফলাইন'],
      chapters: [
        {
          id: `custom-chap-${Date.now()}`,
          title: `${customTitle} (সম্পূর্ণ পাঠ)`,
          content: customContent.trim(),
        },
      ],
    };

    await storageService.saveBookForOffline(newCustomBook);
    await onRefreshDownloads();
    await loadData();

    // Reset form
    setCustomTitle('');
    setCustomAuthor('');
    setCustomContent('');
    setUploadError('');
    setShowUploadModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Storage Stats */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>১০০% অফলাইন সুবিধা সম্পন্ন</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              আমার অফলাইন শেলফ
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              এখানে আপনার ডাউনলোড করা সকল পাঠ্যবই ও উপন্যাস সংরক্ষিত রয়েছে। ইন্টারনেট সংযোগ
              ছাড়াই আপনি যেকোনো স্থানে যেকোনো সময় এগুলো নিরবচ্ছিন্নভাবে পড়তে পারবেন।
            </p>
          </div>

          {/* Quick Metrics (Zero-pill text representation) */}
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shrink-0">
            <div className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">ব্যবহৃত স্পেস</div>
                <div className="text-base font-bold text-slate-900 dark:text-white font-mono">
                  {totalSizeMB} MB
                </div>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />

            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">সংরক্ষিত বই</div>
                <div className="text-base font-bold text-slate-900 dark:text-white font-mono">
                  {downloadedRecords.length} টি
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowUploadModal(true)}
              className="ml-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">বই যোগ করুন</span>
            </button>
          </div>
        </div>

        {/* Continue Reading Card if available */}
        {lastReadBookRecord && lastReadProgress && (
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  সর্বশেষ পড়া চালিয়ে যান
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                  {lastReadBookRecord.bookData.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {lastReadBookRecord.bookData.chapters.find((c) => c.id === lastReadProgress.currentChapterId)?.title || 'অধ্যায় ১'}
                </p>
              </div>
            </div>

            <button
              onClick={() => onReadBook(lastReadBookRecord.bookData, lastReadProgress.currentChapterId)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm whitespace-nowrap"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>পড়া চালিয়ে যান</span>
            </button>
          </div>
        )}
      </div>

      {/* Downloaded Books Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>সংরক্ষিত বইসমূহ</span>
            <span className="text-xs font-normal text-slate-500">
              ({downloadedRecords.length} টি বই সংরক্ষিত)
            </span>
          </h3>

          <button
            onClick={loadData}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>রিফ্রেশ</span>
          </button>
        </div>

        {downloadedRecords.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
            <WifiOff className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">
              এখনো কোনো বই ডাউনলোড করা হয়নি
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              লাইব্রেরি থেকে আপনার পছন্দের পাঠ্যবই বা উপন্যাসের নিচের "ডাউনলোড" বাটনে চাপ দিন,
              যাতে কোনো ইন্টারনেট সংযোগ ছাড়াই দ্রুত পড়তে পারেন।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {downloadedRecords.map((record) => (
              <div key={record.bookId} className="relative group">
                <BookCard
                  book={record.bookData}
                  isDownloaded={true}
                  readingProgress={readingProgressList.find((p) => p.bookId === record.bookId)}
                  onRead={() => onReadBook(record.bookData)}
                  onDownload={async () => {}}
                  onExportFile={onExportFile}
                />
                {/* Delete button from offline shelf */}
                <button
                  type="button"
                  onClick={(e) => handleDeleteDownloaded(record.bookId, e)}
                  title="অফলাইন শেলফ থেকে মুছুন"
                  className="absolute top-2 left-2 p-1.5 rounded-lg bg-black/60 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Custom Book Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowUploadModal(false)}
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl z-10 text-slate-900 dark:text-white">
            <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
              <Upload className="w-5 h-5 text-emerald-600" />
              <span>নিজস্ব বই বা নোট যুক্ত করুন</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              আপনার কাছে থাকা কোনো নোট, পাঠ্য বা বই এখানে লিখে বা ফাইল আপলোড করে অফলাইনে পড়ার জন্য
              সংরক্ষণ করতে পারেন।
            </p>

            {uploadError && (
              <div className="p-2.5 mb-4 text-xs text-red-600 bg-red-50 dark:bg-red-950/40 rounded-lg">
                {uploadError}
              </div>
            )}

            <form onSubmit={handleSaveCustomBook} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  বইয়ের নাম *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: গণিত সূত্রাবলী বা ছোটগল্প"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    লেখক
                  </label>
                  <input
                    type="text"
                    placeholder="লেখকের নাম"
                    value={customAuthor}
                    onChange={(e) => setCustomAuthor(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    ক্যাটাগরি
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: পাঠ্যনোট, গল্প"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Upload file directly */}
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  টেক্সট বা ফাইল আপলোড করুন (.txt / .html)
                </label>
                <input
                  type="file"
                  accept=".txt,.html,.md,.text"
                  onChange={handleFileUpload}
                  className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
              </div>

              {/* Or Paste Content */}
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  বইয়ের টেক্সট / অধ্যায় বিষয়বস্তু *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="বইয়ের টেক্সট এখানে লিখুন বা পেস্ট করুন..."
                  value={customContent}
                  onChange={(e) => setCustomContent(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
