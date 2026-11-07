import React, { useState, useEffect, useRef } from 'react';
import { Book, Chapter, ReaderSettings, Bookmark, ReaderNote, ReadingProgress } from '../types/book';
import { storageService } from '../services/storageService';
import {
  ArrowLeft,
  Bookmark as BookmarkIcon,
  BookmarkCheck,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  FileDown,
  List,
  Maximize,
  Minimize,
  Moon,
  Pause,
  Play,
  RotateCcw,
  Search,
  Settings,
  Sparkles,
  Square,
  Sun,
  Volume2,
  X,
  FileEdit,
  Trash2
} from 'lucide-react';

interface BookReaderProps {
  book: Book;
  initialChapterId?: string;
  onBack: () => void;
  isDownloaded: boolean;
  onDownload: (book: Book) => Promise<void>;
  onProgressChange?: (progress: ReadingProgress) => void;
}

export const BookReader: React.FC<BookReaderProps> = ({
  book,
  initialChapterId,
  onBack,
  isDownloaded,
  onDownload,
  onProgressChange,
}) => {
  // Current chapter state
  const [currentChapterIndex, setCurrentChapterIndex] = useState(() => {
    if (initialChapterId) {
      const idx = book.chapters.findIndex((c) => c.id === initialChapterId);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  const currentChapter: Chapter = book.chapters[currentChapterIndex] || book.chapters[0];

  // Reading progress state
  const [completedChapterIds, setCompletedChapterIds] = useState<string[]>([]);

  // Reader Settings
  const [settings, setSettings] = useState<ReaderSettings>({
    fontSize: 18,
    lineHeight: 1.8,
    theme: 'light',
    fontFamily: 'bangla',
    autoScrollSpeed: 0,
  });

  // UI Panels
  const [showChaptersDrawer, setShowChaptersDrawer] = useState(false);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [showNotesDrawer, setShowNotesDrawer] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Search inside chapter
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Bookmarks & Notes
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [notes, setNotes] = useState<ReaderNote[]>([]);
  const [newNoteText, setNewNoteText] = useState('');

  // Audio / Speech Synthesis (TTS)
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Content scroll ref
  const contentContainerRef = useRef<HTMLDivElement>(null);

  // Load bookmarks, notes, and progress for this book from IndexedDB
  useEffect(() => {
    storageService.getBookmarks(book.id).then(setBookmarks);
    storageService.getNotes(book.id).then(setNotes);

    // Load saved reading progress
    storageService.getProgress(book.id).then((progress) => {
      if (progress) {
        if (progress.completedChapterIds && progress.completedChapterIds.length > 0) {
          setCompletedChapterIds(progress.completedChapterIds);
        }
        if (!initialChapterId) {
          const idx = book.chapters.findIndex((c) => c.id === progress.currentChapterId);
          if (idx >= 0) {
            setCurrentChapterIndex(idx);
          }
        }
      }
    });

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [book.id, initialChapterId]);

  // Percentage of chapters completed
  const percentageCompleted = book.chapters.length > 0
    ? Math.round((completedChapterIds.length / book.chapters.length) * 100)
    : 0;

  const isCurrentChapterCompleted = completedChapterIds.includes(currentChapter.id);

  // Mark/unmark chapter as completed
  const markChapterCompleted = async (chapterId: string, completed: boolean) => {
    let nextCompleted: string[];
    if (completed) {
      nextCompleted = Array.from(new Set([...completedChapterIds, chapterId]));
    } else {
      nextCompleted = completedChapterIds.filter((id) => id !== chapterId);
    }
    setCompletedChapterIds(nextCompleted);

    const pct = Math.round((nextCompleted.length / book.chapters.length) * 100);
    const updatedProgress = {
      bookId: book.id,
      currentChapterId: currentChapter.id,
      currentChapterIndex,
      totalChapters: book.chapters.length,
      scrollPercentage: 0,
      lastReadTimestamp: Date.now(),
      completedChapterIds: nextCompleted,
      percentageCompleted: pct,
    };

    await storageService.saveProgress(updatedProgress);
    if (onProgressChange) {
      onProgressChange(updatedProgress);
    }
  };

  const toggleCurrentChapterCompleted = () => {
    markChapterCompleted(currentChapter.id, !isCurrentChapterCompleted);
  };

  // Track progress when chapter changes (automatically register as read)
  useEffect(() => {
    if (currentChapter) {
      setCompletedChapterIds((prev) => {
        const updated = Array.from(new Set([...prev, currentChapter.id]));
        const pct = Math.round((updated.length / book.chapters.length) * 100);
        const progress = {
          bookId: book.id,
          currentChapterId: currentChapter.id,
          currentChapterIndex,
          totalChapters: book.chapters.length,
          scrollPercentage: 0,
          lastReadTimestamp: Date.now(),
          completedChapterIds: updated,
          percentageCompleted: pct,
        };
        storageService.saveProgress(progress);
        if (onProgressChange) {
          onProgressChange(progress);
        }
        return updated;
      });

      // Scroll to top of chapter
      if (contentContainerRef.current) {
        contentContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
    // Cancel speaking if chapter changes
    if (window.speechSynthesis && isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, [currentChapterIndex, book.id]);

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Bookmark toggle
  const isCurrentChapterBookmarked = bookmarks.some((b) => b.chapterId === currentChapter.id);

  const toggleBookmark = async () => {
    if (isCurrentChapterBookmarked) {
      const b = bookmarks.find((item) => item.chapterId === currentChapter.id);
      if (b) {
        await storageService.removeBookmark(b.id);
        setBookmarks((prev) => prev.filter((item) => item.id !== b.id));
      }
    } else {
      const newBm: Bookmark = {
        id: `bm-${Date.now()}`,
        bookId: book.id,
        chapterId: currentChapter.id,
        chapterTitle: currentChapter.title,
        snippet: currentChapter.content.slice(0, 100) + '...',
        createdAt: Date.now(),
      };
      await storageService.addBookmark(newBm);
      setBookmarks((prev) => [...prev, newBm]);
    }
  };

  // Add Note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const newNote: ReaderNote = {
      id: `note-${Date.now()}`,
      bookId: book.id,
      chapterId: currentChapter.id,
      text: newNoteText.trim(),
      createdAt: Date.now(),
    };

    await storageService.saveNote(newNote);
    setNotes((prev) => [newNote, ...prev]);
    setNewNoteText('');
  };

  const handleDeleteNote = async (noteId: string) => {
    await storageService.deleteNote(noteId);
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  // Text-To-Speech (Web Speech API)
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('আপনার ব্রাউজারে স্পিচ সিন্থেসিস অডিও সমর্থিত নয়।');
      return;
    }

    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      return;
    }

    if (isSpeaking && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      return;
    }

    // Start fresh speech
    window.speechSynthesis.cancel();
    const utteranceText = `${currentChapter.title}. ${currentChapter.subtitle || ''}. ${currentChapter.content}`;
    const utterance = new SpeechSynthesisUtterance(utteranceText);

    // Try finding Bengali voice
    const voices = window.speechSynthesis.getVoices();
    const bnVoice = voices.find((v) => v.lang.startsWith('bn') || v.lang.includes('BD') || v.lang.includes('IN'));
    if (bnVoice) {
      utterance.voice = bnVoice;
    }
    utterance.rate = 0.95;
    utterance.pitch = 1;

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsPaused(false);
  };

  const handleStopSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
  };

  // Download directly as file for user's offline storage
  const handleExportFile = (format: 'html' | 'txt') => {
    storageService.exportBookAsFile(book, format);
  };

  // Theme styles
  const getThemeClasses = () => {
    switch (settings.theme) {
      case 'sepia':
        return 'bg-[#F7EFE2] text-[#342416] selection:bg-amber-300 selection:text-amber-950';
      case 'dark':
        return 'bg-[#0F172A] text-[#E2E8F0] selection:bg-emerald-600 selection:text-white';
      case 'light':
      default:
        return 'bg-white text-slate-800 selection:bg-emerald-200 selection:text-emerald-950';
    }
  };

  const getHeaderClasses = () => {
    switch (settings.theme) {
      case 'sepia':
        return 'bg-[#EFE3D0]/95 border-[#DFD0B8] text-[#342416]';
      case 'dark':
        return 'bg-[#1E293B]/95 border-slate-800 text-slate-100';
      case 'light':
      default:
        return 'bg-white/95 border-slate-200 text-slate-900';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${getThemeClasses()} transition-colors duration-200`}>
      {/* Reader Top Bar */}
      <header
        className={`sticky top-0 z-30 px-4 h-14 border-b flex items-center justify-between backdrop-blur-md ${getHeaderClasses()}`}
      >
        {/* Left slot: Back + Title */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center gap-1 text-sm font-medium"
            title="লাইব্রেরিতে ফিরে যান"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">লাইব্রেরি</span>
          </button>

          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1 hidden sm:block" />

          <div className="truncate">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold truncate leading-tight">{book.title}</h1>
              <span className="text-[11px] font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                {percentageCompleted}%
              </span>
            </div>
            <p className="text-[11px] opacity-75 truncate leading-tight">
              {currentChapter.title}
            </p>
          </div>
        </div>

        {/* Right slot: Controls (TTS, Bookmarks, Drawer triggers, Settings) */}
        <div className="flex items-center gap-1 sm:gap-2">
          
          {/* Audio TTS Narration Button */}
          <div className="flex items-center">
            <button
              onClick={handleToggleSpeech}
              title={isSpeaking ? (isPaused ? 'পুনরায় শুনুন' : 'থামান') : 'শুনুন (টেক্সট-টু-স্পিচ)'}
              className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                isSpeaking
                  ? 'bg-emerald-600 text-white'
                  : 'hover:bg-black/5 dark:hover:bg-white/10'
              }`}
            >
              {isSpeaking && !isPaused ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span className="hidden md:inline text-xs">
                {isSpeaking ? (isPaused ? 'চালান' : 'পড়ছে...') : 'শুনুন'}
              </span>
            </button>
            {isSpeaking && (
              <button
                onClick={handleStopSpeech}
                title="অডিও বন্ধ করুন"
                className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg ml-0.5"
              >
                <Square className="w-3 h-3 fill-current" />
              </button>
            )}
          </div>

          {/* Quick Search */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            title="অধ্যায়ে অনুসন্ধান"
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Table of Contents */}
          <button
            onClick={() => setShowChaptersDrawer(true)}
            title="সূচিপত্র ও অধ্যায় তালিকা"
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center gap-1"
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline text-xs font-medium">সূচিপত্র</span>
          </button>

          {/* Bookmark */}
          <button
            onClick={toggleBookmark}
            title={isCurrentChapterBookmarked ? 'বুকমার্ক সরানো হয়েছে' : 'এই অধ্যায় বুকমার্ক করুন'}
            className={`p-2 rounded-lg transition-colors ${
              isCurrentChapterBookmarked ? 'text-amber-500 fill-amber-500' : 'hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            {isCurrentChapterBookmarked ? (
              <BookmarkCheck className="w-4 h-4 fill-amber-500 text-amber-500" />
            ) : (
              <BookmarkIcon className="w-4 h-4" />
            )}
          </button>

          {/* Notes drawer trigger */}
          <button
            onClick={() => setShowNotesDrawer(true)}
            title="নোট লিখুন"
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors relative"
          >
            <FileEdit className="w-4 h-4" />
            {notes.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </button>

          {/* Reader Settings Drawer */}
          <button
            onClick={() => setShowSettingsDrawer(true)}
            title="রিডার সেটিংস ও ফন্ট সাইজ"
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'ফুলস্ক্রিন থেকে বের হন' : 'ফুলস্ক্রিনে পড়ুন'}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors hidden md:block"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Full-width Reading Progress Bar */}
      <div className="h-1 w-full bg-slate-200/60 dark:bg-slate-800/60 overflow-hidden sticky top-14 z-20">
        <div
          className="h-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${percentageCompleted}%` }}
          title={`পড়ার অগ্রগতি: ${percentageCompleted}%`}
        />
      </div>

      {/* Search Input Bar (if open) */}
      {showSearch && (
        <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="বর্তমান অধ্যায়ে শব্দ খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm border-none focus:outline-none"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              পরিষ্কার
            </button>
          )}
          <button
            onClick={() => setShowSearch(false)}
            className="p-1 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Reading Canvas */}
      <main
        ref={contentContainerRef}
        className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-12 py-8 max-w-3xl mx-auto w-full"
      >
        {/* Chapter Header with Progress Tracker */}
        <div className="mb-8 pb-6 border-b border-black/10 dark:border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="text-xs font-semibold opacity-60 uppercase tracking-wider">
              {book.title} · অধ্যায় {currentChapterIndex + 1}/{book.chapters.length}
            </div>

            {/* Reading progress indicator and completion toggle button */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/80 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{percentageCompleted}% সম্পন্ন ({completedChapterIds.length}/{book.chapters.length} অধ্যায়)</span>
              </span>

              <button
                type="button"
                onClick={toggleCurrentChapterCompleted}
                title={isCurrentChapterCompleted ? 'সম্পন্ন হিসেবে চিহ্নিত' : 'অধ্যায়টি সমাপ্ত হিসেবে চিহ্নিত করুন'}
                className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                  isCurrentChapterCompleted
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'border border-black/20 dark:border-white/20 text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isCurrentChapterCompleted ? 'অধ্যায় পঠিত' : 'পঠিত চিহ্নিত করুন'}</span>
              </button>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            {currentChapter.title}
          </h2>
          {currentChapter.subtitle && (
            <p className="text-base opacity-80 italic">
              {currentChapter.subtitle}
            </p>
          )}
        </div>

        {/* Chapter Text Body */}
        <div
          className="space-y-6 select-text transition-all duration-150 leading-relaxed font-normal"
          style={{
            fontSize: `${settings.fontSize}px`,
            lineHeight: settings.lineHeight,
          }}
        >
          {currentChapter.content.split('\n\n').map((paragraph, pIdx) => {
            // Highlight search query if active
            if (searchQuery.trim()) {
              const regex = new RegExp(`(${searchQuery.trim()})`, 'gi');
              const parts = paragraph.split(regex);
              return (
                <p key={pIdx} className="text-justify">
                  {parts.map((part, i) =>
                    regex.test(part) ? (
                      <mark key={i} className="bg-amber-300 text-slate-900 px-0.5 rounded">
                        {part}
                      </mark>
                    ) : (
                      part
                    )
                  )}
                </p>
              );
            }

            return (
              <p key={pIdx} className="text-justify">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Bottom Chapter Navigation Bar */}
        <div className="mt-14 pt-8 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
          <button
            disabled={currentChapterIndex === 0}
            onClick={() => setCurrentChapterIndex((prev) => Math.max(0, prev - 1))}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>পূর্ববর্তী অধ্যায়</span>
          </button>

          {/* Center: Mark as completed button */}
          <button
            type="button"
            onClick={toggleCurrentChapterCompleted}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              isCurrentChapterCompleted
                ? 'bg-emerald-600 text-white'
                : 'border border-black/20 dark:border-white/20 hover:bg-black/5 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>{isCurrentChapterCompleted ? 'এই অধ্যায় সম্পন্ন হয়েছে' : 'অধ্যায় সম্পন্ন হিসেবে চিহ্নিত করুন'}</span>
          </button>

          <button
            disabled={currentChapterIndex >= book.chapters.length - 1}
            onClick={() => {
              if (!isCurrentChapterCompleted) {
                markChapterCompleted(currentChapter.id, true);
              }
              setCurrentChapterIndex((prev) => Math.min(book.chapters.length - 1, prev + 1));
            }}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span>পরবর্তী অধ্যায়</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Offline & Download info box at bottom of reader */}
        <div className="mt-8 p-4 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>
              {isDownloaded
                ? 'এই বইটি আপনার অফলাইন শেলফে সংরক্ষিত রয়েছে। ইন্টারনেট ছাড়াও পড়তে পারবেন।'
                : 'বইটি আপনার ডিভাইসে সেভ করুন যাতে ইন্টারনেট ছাড়াও পড়তে পারেন।'}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!isDownloaded && (
              <button
                onClick={() => onDownload(book)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium transition-colors"
              >
                অফলাইন সেভ
              </button>
            )}
            <button
              onClick={() => handleExportFile('html')}
              className="px-3 py-1.5 border border-black/20 dark:border-white/20 hover:bg-black/5 rounded font-medium flex items-center gap-1"
              title="এইচটিএমএল ফাইল হিসেবে ডাউনলোড করুন"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>ফাইল ডাউনলোড (.html)</span>
            </button>
          </div>
        </div>
      </main>

      {/* Table of Contents Drawer */}
      {showChaptersDrawer && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowChaptersDrawer(false)}
          />
          <div className="relative w-80 max-w-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-5 overflow-y-auto flex flex-col h-full z-10 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <List className="w-4 h-4 text-emerald-600" />
                <span>সূচিপত্র ({book.chapters.length} অধ্যায়)</span>
              </h3>
              <button
                onClick={() => setShowChaptersDrawer(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Overall Book Reading Progress Card */}
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 mb-4">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-1.5">
                <span>বই পড়ার অগ্রগতি</span>
                <span className="font-mono tabular-nums text-base">{percentageCompleted}%</span>
              </div>
              <div className="w-full bg-emerald-200 dark:bg-emerald-900/80 h-2 rounded-full overflow-hidden mb-1.5">
                <div
                  className="bg-emerald-600 dark:bg-emerald-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${percentageCompleted}%` }}
                />
              </div>
              <div className="text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center justify-between font-medium">
                <span>{completedChapterIds.length} / {book.chapters.length} টি অধ্যায় সম্পন্ন</span>
                {percentageCompleted === 100 && (
                  <span className="font-bold flex items-center gap-0.5">
                    <Check className="w-3 h-3" /> সম্পূর্ণ পঠিত
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1.5 flex-1 overflow-y-auto">
              {book.chapters.map((chap, idx) => {
                const isChapDone = completedChapterIds.includes(chap.id);
                return (
                  <div
                    key={chap.id}
                    onClick={() => {
                      setCurrentChapterIndex(idx);
                      setShowChaptersDrawer(false);
                    }}
                    className={`w-full text-left p-3 rounded-lg text-sm transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                      currentChapterIndex === idx
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          markChapterCompleted(chap.id, !isChapDone);
                        }}
                        title={isChapDone ? 'সম্পন্ন হয়েছে (ক্লিক করে আনমার্ক করুন)' : 'সম্পন্ন চিহ্নিত করুন'}
                        className={`mt-0.5 p-0.5 rounded-full transition-colors ${
                          isChapDone
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-300 dark:text-slate-600 hover:text-slate-400'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 fill-current/10" />
                      </button>
                      <div className="min-w-0">
                        <div className="line-clamp-2 leading-snug">{chap.title}</div>
                        {chap.subtitle && (
                          <div className="text-[11px] opacity-75 mt-0.5 line-clamp-1">
                            {chap.subtitle}
                          </div>
                        )}
                      </div>
                    </div>
                    {currentChapterIndex === idx && (
                      <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold shrink-0">
                        পড়ছেন
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bookmarks in this book */}
            {bookmarks.length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <BookmarkIcon className="w-3.5 h-3.5 text-amber-500" />
                  <span>সংরক্ষিত বুকমার্ক</span>
                </h4>
                <div className="space-y-1">
                  {bookmarks.map((bm) => (
                    <div
                      key={bm.id}
                      className="p-2 rounded bg-amber-50 dark:bg-amber-950/30 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between"
                    >
                      <button
                        onClick={() => {
                          const idx = book.chapters.findIndex((c) => c.id === bm.chapterId);
                          if (idx >= 0) setCurrentChapterIndex(idx);
                          setShowChaptersDrawer(false);
                        }}
                        className="truncate text-left flex-1 hover:underline"
                      >
                        {bm.chapterTitle}
                      </button>
                      <button
                        onClick={() => {
                          storageService.removeBookmark(bm.id);
                          setBookmarks((prev) => prev.filter((item) => item.id !== bm.id));
                        }}
                        className="p-1 hover:text-red-500"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reader Settings Drawer */}
      {showSettingsDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSettingsDrawer(false)}
          />
          <div className="relative w-80 max-w-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-5 overflow-y-auto flex flex-col h-full z-10 shadow-xl text-slate-900 dark:text-white">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Settings className="w-4 h-4 text-emerald-600" />
                <span>রিডার ও পড়ার সুবিধা</span>
              </h3>
              <button
                onClick={() => setShowSettingsDrawer(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Color Theme Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2.5">
                  পড়ার ব্যাকগ্রাউন্ড থিম
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSettings({ ...settings, theme: 'light' })}
                    className={`py-2 px-3 rounded-lg border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                      settings.theme === 'light'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-white text-slate-800'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-white border border-slate-300 shadow-inner" />
                    <span>শুভ্র (Day)</span>
                  </button>

                  <button
                    onClick={() => setSettings({ ...settings, theme: 'sepia' })}
                    className={`py-2 px-3 rounded-lg border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                      settings.theme === 'sepia'
                        ? 'border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20'
                        : 'border-amber-200 bg-[#F7EFE2] text-[#342416]'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-[#F7EFE2] border border-amber-300" />
                    <span>সেপিয়া</span>
                  </button>

                  <button
                    onClick={() => setSettings({ ...settings, theme: 'dark' })}
                    className={`py-2 px-3 rounded-lg border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                      settings.theme === 'dark'
                        ? 'border-emerald-500 bg-slate-800 text-white ring-2 ring-emerald-500/20'
                        : 'border-slate-700 bg-slate-900 text-slate-200'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-slate-950 border border-slate-700" />
                    <span>নাইট মোড</span>
                  </button>
                </div>
              </div>

              {/* Font Size Adjuster */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  <span>ফন্ট সাইজ (অক্ষরের আকার)</span>
                  <span className="font-mono text-emerald-600">{settings.fontSize}px</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold">ছোট</span>
                  <input
                    type="range"
                    min="14"
                    max="26"
                    step="1"
                    value={settings.fontSize}
                    onChange={(e) =>
                      setSettings({ ...settings, fontSize: Number(e.target.value) })
                    }
                    className="w-full accent-emerald-600"
                  />
                  <span className="text-base font-bold">বড়</span>
                </div>
              </div>

              {/* Line Spacing */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  <span>লাইনের ব্যবধান</span>
                  <span className="font-mono text-emerald-600">{settings.lineHeight}x</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'কমপ্যাক্ট', val: 1.6 },
                    { label: 'আরামদায়ক', val: 1.8 },
                    { label: 'খোলামেলা', val: 2.1 },
                  ].map((item) => (
                    <button
                      key={item.val}
                      onClick={() => setSettings({ ...settings, lineHeight: item.val })}
                      className={`py-1.5 text-xs rounded border transition-colors ${
                        settings.lineHeight === item.val
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Offline Export options */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                  ডিভাইসে অফলাইন ফাইল সংরক্ষণ
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => handleExportFile('html')}
                    className="w-full py-2 px-3 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2"
                  >
                    <FileDown className="w-4 h-4 text-emerald-600" />
                    <span>এইচটিএমএল বই ফাইল ডাউনলোড (.html)</span>
                  </button>
                  <button
                    onClick={() => handleExportFile('txt')}
                    className="w-full py-2 px-3 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2"
                  >
                    <FileDown className="w-4 h-4 text-blue-600" />
                    <span>টেক্সট ফাইল ডাউনলোড (.txt)</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Notes Drawer */}
      {showNotesDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowNotesDrawer(false)}
          />
          <div className="relative w-84 max-w-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-5 overflow-y-auto flex flex-col h-full z-10 shadow-xl text-slate-900 dark:text-white">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
              <h3 className="font-bold text-base flex items-center gap-2">
                <FileEdit className="w-4 h-4 text-emerald-600" />
                <span>আমার পড়ার নোট</span>
              </h3>
              <button
                onClick={() => setShowNotesDrawer(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Note Input */}
            <form onSubmit={handleAddNote} className="mb-4">
              <textarea
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="এই অধ্যায় সম্পর্কিত জরুরি পয়েন্ট বা নোট লিখুন..."
                rows={3}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={!newNoteText.trim()}
                className="mt-2 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium transition-colors disabled:opacity-40"
              >
                নোট যোগ করুন
              </button>
            </form>

            {/* Notes List */}
            <div className="space-y-2.5 flex-1 overflow-y-auto">
              {notes.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">
                  এখনো কোনো নোট লেখা হয়নি।
                </p>
              ) : (
                notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs flex flex-col justify-between"
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{note.text}</p>
                    <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{new Date(note.createdAt).toLocaleDateString('bn-BD')}</span>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="নোট মুছুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
