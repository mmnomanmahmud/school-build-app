import React, { useState } from 'react';
import { Book, ReadingProgress } from '../types/book';
import { BookOpen, Check, CheckCircle2, Download, FileText, Loader2, Sparkles, Star } from 'lucide-react';

interface BookCardProps {
  book: Book;
  isDownloaded: boolean;
  readingProgress?: ReadingProgress;
  onRead: (book: Book) => void;
  onDownload: (book: Book) => Promise<void>;
  onExportFile?: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  isDownloaded,
  readingProgress,
  onRead,
  onDownload,
  onExportFile,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const handleDownloadClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDownloaded || downloading) return;

    setDownloading(true);
    setDownloadProgress(20);

    // Fast visual progress for user gratification
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 120);

    try {
      await onDownload(book);
      clearInterval(interval);
      setDownloadProgress(100);
      setTimeout(() => setDownloading(false), 300);
    } catch {
      clearInterval(interval);
      setDownloading(false);
      setDownloadProgress(0);
    }
  };

  return (
    <div
      onClick={() => onRead(book)}
      className="group relative flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
    >
      {/* Book Cover Area */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div
            className={`w-full h-full p-6 flex flex-col justify-between bg-gradient-to-br ${
              book.coverBgColor || 'from-emerald-700 to-slate-900'
            } text-white`}
          >
            <div className="flex items-center justify-between text-xs opacity-80 font-medium">
              <span>{book.className || book.categoryName}</span>
              <BookOpen className="w-4 h-4" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold leading-snug line-clamp-2">
                {book.title}
              </h3>
              <p className="text-xs opacity-90 line-clamp-1">{book.author}</p>
            </div>

            <div className="text-[11px] opacity-75 font-mono">
              School Build Edition
            </div>
          </div>
        )}

        {/* Offline indicator badge (top right) */}
        {isDownloaded && (
          <div className="absolute top-2.5 right-2.5 px-2 py-1 bg-emerald-600/95 backdrop-blur-sm text-white rounded text-[11px] font-medium flex items-center gap-1 shadow-sm">
            <Check className="w-3 h-3 stroke-[2.5]" />
            <span>অফলাইন প্রস্তুত</span>
          </div>
        )}

        {/* Reading progress badge on cover (top left) */}
        {readingProgress && readingProgress.percentageCompleted > 0 && (
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-slate-900/80 backdrop-blur-sm text-white rounded text-[11px] font-semibold tabular-nums flex items-center gap-1 shadow-sm">
            <BookOpen className="w-3 h-3 text-emerald-400" />
            <span>{readingProgress.percentageCompleted}% সম্পন্ন</span>
          </div>
        )}

        {/* Slim progress bar along bottom of cover */}
        {readingProgress && readingProgress.percentageCompleted > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${readingProgress.percentageCompleted}%` }}
            />
          </div>
        )}

        {/* Download progress overlay if active */}
        {downloading && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-white">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-400 mb-2" />
            <span className="text-xs font-semibold">ডাউনলোড হচ্ছে... {downloadProgress}%</span>
            <div className="w-3/4 bg-white/20 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-emerald-400 h-full transition-all duration-150 rounded-full"
                style={{ width: `${downloadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Book Information (Zero-pill metadata discipline) */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata line with typographic separators */}
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-medium flex-wrap">
            <span>{book.className || book.categoryName}</span>
            <span aria-hidden="true">·</span>
            <span>{book.totalChapters} অধ্যায়</span>
            <span aria-hidden="true">·</span>
            <span>{book.fileSizeEstimate}</span>
          </div>

          {/* Book Title */}
          <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
            {book.title}
          </h3>

          {/* Author */}
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-1">
            {book.author}
          </p>

          {/* Description snippet */}
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {book.description}
          </p>

          {/* Reading Progress Indicator */}
          {readingProgress && readingProgress.percentageCompleted > 0 && (
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 mb-1 font-medium">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>পড়ার অগ্রগতি</span>
                </span>
                <span className="font-mono tabular-nums text-emerald-600 dark:text-emerald-400 font-bold">
                  {readingProgress.percentageCompleted}%
                </span>
              </div>
              
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${readingProgress.percentageCompleted}%` }}
                />
              </div>

              <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 flex items-center justify-between">
                <span>
                  {readingProgress.completedChapterIds?.length || 0} / {book.totalChapters} অধ্যায় সম্পন্ন
                </span>
                {readingProgress.percentageCompleted === 100 && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                    <Check className="w-3 h-3" /> সম্পূর্ণ পঠিত
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          
          {/* Rating */}
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{book.rating}</span>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-1.5">
            {/* Quick Export/Download file button */}
            {onExportFile && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onExportFile(book);
                }}
                title="ফাইল হিসেবে ডিভাইসে সেভ করুন (.html)"
                className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
              >
                <FileText className="w-4 h-4" />
              </button>
            )}

            {/* Offline Save Button */}
            {!isDownloaded ? (
              <button
                type="button"
                onClick={handleDownloadClick}
                disabled={downloading}
                title="অফলাইনে পড়ার জন্য সংরক্ষণ করুন"
                className="px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors flex items-center gap-1 border border-slate-200 dark:border-slate-700"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">ডাউনলোড</span>
              </button>
            ) : (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium px-1 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">সংরক্ষিত</span>
              </span>
            )}

            {/* Read Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRead(book);
              }}
              className="px-3 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded transition-colors flex items-center gap-1 shadow-sm"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>পড়ুন</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
