import React, { useState, useEffect, useMemo } from 'react';
import { Book, BookCategory, ReadingProgress, SchoolClass } from './types/book';
import { BOOKS_DATA } from './data/booksData';
import { storageService } from './services/storageService';
import {
  StudentProfile,
  getStoredStudentProfile,
  saveStoredStudentProfile,
  initAuth
} from './services/authService';
import { analyticsService } from './services/analyticsService';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoryFilter } from './components/CategoryFilter';
import { BookCard } from './components/BookCard';
import { BookReader } from './components/BookReader';
import { MyLibrary } from './components/MyLibrary';
import { StudyGuide } from './components/StudyGuide';
import { DictionarySection } from './components/DictionarySection';
import { StudentProfileModal } from './components/StudentProfileModal';
import { AdminDashboard } from './components/AdminDashboard';
import {
  BookOpen,
  CheckCircle,
  Download,
  GraduationCap,
  Sparkles,
  Wifi,
  WifiOff,
  Search,
  Bookmark,
  Layers,
  ArrowRight,
  Brain,
  BookA
} from 'lucide-react';

export default function App() {
  // Navigation & View
  const [activeTab, setActiveTab] = useState<'home' | 'textbooks' | 'novels' | 'dictionary' | 'study-guide' | 'offline' | 'reader'>('home');
  const [activeReadingBook, setActiveReadingBook] = useState<Book | null>(null);
  const [initialReadingChapterId, setInitialReadingChapterId] = useState<string | undefined>(undefined);

  // Authentication & Modals
  const [currentStudent, setCurrentStudent] = useState<StudentProfile | null>(getStoredStudentProfile);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<SchoolClass | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<BookCategory | 'all'>('all');

  // Offline / Download state
  const [downloadedBookIds, setDownloadedBookIds] = useState<Set<string>>(new Set());
  const [readingProgressMap, setReadingProgressMap] = useState<Map<string, ReadingProgress>>(new Map());
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [notification, setNotification] = useState<string | null>(null);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Sync dark mode class on <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Online / Offline network listeners & Initial load
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial load from storage
    refreshDownloadedBooks();
    refreshReadingProgress();

    // Init Firebase Auth state
    const unsubscribeAuth = initAuth((user, token) => {
      if (user && !currentStudent) {
        const profile: StudentProfile = {
          uid: user.uid,
          displayName: user.displayName || 'শিক্ষার্থী',
          email: user.email || '',
          photoURL: user.photoURL || undefined,
          studentClass: '১০ম শ্রেণী (SSC)',
          rollNo: '০১',
          joinedAt: new Date().toISOString(),
          lastActive: 'এইমাত্র',
          totalTimeSpentMinutes: 25,
          totalDownloadsCount: 0,
        };
        setCurrentStudent(profile);
        saveStoredStudentProfile(profile);
      }
    });

    // Usage duration heartbeat tracker (every 30 seconds)
    const timeTrackerInterval = setInterval(() => {
      analyticsService.recordSessionTime(30);
      setCurrentStudent((prev) => {
        if (!prev) return null;
        const updated = {
          ...prev,
          totalTimeSpentMinutes: prev.totalTimeSpentMinutes + 0.5,
          lastActive: 'এইমাত্র',
        };
        saveStoredStudentProfile(updated);
        return updated;
      });
    }, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (unsubscribeAuth) unsubscribeAuth();
      clearInterval(timeTrackerInterval);
    };
  }, []);

  const refreshDownloadedBooks = async () => {
    try {
      const records = await storageService.getAllDownloadedBooks();
      setDownloadedBookIds(new Set(records.map((r) => r.bookId)));
    } catch (err) {
      console.error('Failed to load downloaded books', err);
    }
  };

  const refreshReadingProgress = async () => {
    try {
      const progressList = await storageService.getAllProgress();
      const map = new Map<string, ReadingProgress>();
      progressList.forEach((p) => {
        map.set(p.bookId, p);
      });
      setReadingProgressMap(map);
    } catch (err) {
      console.error('Failed to load reading progress', err);
    }
  };

  // Toast notification helper
  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 3500);
  };

  // Download book handler (Fast IndexedDB saving + Analytics)
  const handleDownloadBook = async (book: Book) => {
    try {
      await storageService.saveBookForOffline(book);
      await refreshDownloadedBooks();
      analyticsService.recordDownload(book.title, currentStudent?.displayName || 'শিক্ষার্থী');
      showToast(`'${book.title}' সফলভাবে অফলাইনে পড়ার জন্য ডাউনলোড হয়েছে!`);
    } catch (err) {
      console.error('Download failed', err);
      showToast('ডাউনলোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    }
  };

  // Export as standalone file
  const handleExportFile = (book: Book) => {
    storageService.exportBookAsFile(book, 'html');
    showToast(`'${book.title}' ফাইল ডাউনলোড শুরু হয়েছে!`);
  };

  // Read book handler
  const handleReadBook = (book: Book, chapterId?: string) => {
    setActiveReadingBook(book);
    setInitialReadingChapterId(chapterId);
    setActiveTab('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered books logic
  const filteredBooks = useMemo(() => {
    return BOOKS_DATA.filter((b) => {
      // Tab based filter
      if (activeTab === 'textbooks' && !b.schoolClass) {
        return false;
      }
      if (activeTab === 'novels' && b.category !== 'novel' && b.category !== 'story') {
        return false;
      }

      // Class filter
      if (selectedClass !== 'all') {
        if (selectedClass === 'general') {
          if (b.schoolClass) return false;
        } else if (b.schoolClass !== selectedClass) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all' && b.category !== selectedCategory) {
        return false;
      }

      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = b.title.toLowerCase().includes(q);
        const inAuthor = b.author.toLowerCase().includes(q);
        const inClass = b.className?.toLowerCase().includes(q);
        const inCategory = b.categoryName.toLowerCase().includes(q);
        const inTags = b.tags.some((t) => t.toLowerCase().includes(q));
        const inChapters = b.chapters.some(
          (c) => c.title.toLowerCase().includes(q) || c.content.toLowerCase().includes(q)
        );

        if (!inTitle && !inAuthor && !inClass && !inCategory && !inTags && !inChapters) {
          return false;
        }
      }

      return true;
    });
  }, [activeTab, selectedClass, selectedCategory, searchQuery]);

  // Section collections
  const textbooksList = useMemo(() => BOOKS_DATA.filter((b) => !!b.schoolClass), []);
  const novelsList = useMemo(() => BOOKS_DATA.filter((b) => b.category === 'novel' || b.category === 'story'), []);
  const scienceMathList = useMemo(() => BOOKS_DATA.filter((b) => b.category === 'science' || b.category === 'math' || b.category === 'gk'), []);

  // When Reader view is active
  if (activeTab === 'reader' && activeReadingBook) {
    return (
      <BookReader
        book={activeReadingBook}
        initialChapterId={initialReadingChapterId}
        onBack={() => {
          setActiveTab('home');
          setActiveReadingBook(null);
          refreshReadingProgress();
        }}
        isDownloaded={downloadedBookIds.has(activeReadingBook.id)}
        onDownload={handleDownloadBook}
        onProgressChange={(updatedProgress) => {
          setReadingProgressMap((prev) => new Map(prev).set(updatedProgress.bookId, updatedProgress));
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedCategory('all');
        }}
        downloadedCount={downloadedBookIds.size}
        isOnline={isOnline}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        currentStudent={currentStudent}
        onOpenStudentModal={() => setIsStudentModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
      />

      {/* Floating Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Offline notice bar if user is currently offline */}
        {!isOnline && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>
                আপনি বর্তমানে অফলাইনে আছেন। আপনার অফলাইন শেলফে সংরক্ষিত বইগুলো এখনই নিরবচ্ছিন্নভাবে পড়তে
                পারবেন।
              </span>
            </div>
            <button
              onClick={() => setActiveTab('offline')}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium whitespace-nowrap"
            >
              অফলাইন বই দেখুন
            </button>
          </div>
        )}

        {/* VIEW 1: MY OFFLINE LIBRARY VIEW */}
        {activeTab === 'offline' && (
          <MyLibrary
            onReadBook={handleReadBook}
            downloadedBookIds={downloadedBookIds}
            onRefreshDownloads={refreshDownloadedBooks}
            onExportFile={handleExportFile}
          />
        )}

        {/* VIEW 2: STUDY GUIDE & FOCUS MASTERY VIEW */}
        {activeTab === 'study-guide' && <StudyGuide />}

        {/* VIEW 3: BILINGUAL DICTIONARY & WORD EXPLORER VIEW */}
        {activeTab === 'dictionary' && <DictionarySection />}

        {/* VIEW 4: HOME / TEXTBOOKS / NOVELS BROWSING */}
        {activeTab !== 'offline' && activeTab !== 'study-guide' && activeTab !== 'dictionary' && (
          <div className="space-y-8">
            
            {/* Hero Banner (Shown primarily on home) */}
            {activeTab === 'home' && !searchQuery && (
              <HeroSection
                onExploreTextbooks={() => {
                  setActiveTab('textbooks');
                  setSelectedCategory('all');
                }}
                onExploreNovels={() => {
                  setActiveTab('novels');
                  setSelectedCategory('all');
                }}
                onOpenStudyGuide={() => {
                  setActiveTab('study-guide');
                }}
                onOpenOffline={() => setActiveTab('offline')}
                totalBooksCount={BOOKS_DATA.length}
                offlineCount={downloadedBookIds.size}
              />
            )}

            {/* Header Title for specific tabs */}
            {activeTab === 'textbooks' && (
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                  <GraduationCap className="w-4 h-4" />
                  <span>জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB)</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  সকল শ্রেণীর পাঠ্যবই (১ম থেকে ১২শ শ্রেণী)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  প্রাথমিক, মাধ্যমিক, উচ্চ মাধ্যমিক ও ক্ষুদ্র নৃগোষ্ঠীর ভাষার সকল পাঠ্যবই পড়ুন ও অফলাইনে ডাউনলোড করুন।
                </p>
              </div>
            )}

            {activeTab === 'novels' && (
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                  <BookOpen className="w-4 h-4" />
                  <span>বাংলা সাহিত্য ও কালজয়ী উপন্যাস (১০০+ সংগ্রহ)</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  উপন্যাস ও ছোটগল্প সম্ভার
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  রবীন্দ্রনাথ, শরৎচন্দ্র, বঙ্কিমচন্দ্র, বিভূতিভূষণ, সত্যজিৎ রায় (ফেলুদা), ব্যোমকেশ ও জাফর ইকবালের অমর সাহিত্যকর্ম।
                </p>
              </div>
            )}

            {/* Live Filter & Search Controls */}
            <CategoryFilter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedClass={selectedClass}
              setSelectedClass={setSelectedClass}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              totalResults={filteredBooks.length}
            />

            {/* Filtered Books Grid */}
            {filteredBooks.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
                <Search className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  কোনো বই খুঁজে পাওয়া যায়নি
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  অন্য কোনো শব্দ দিয়ে অনুসন্ধান করুন অথবা শ্রেণী ও ক্যাটাগরি ফিল্টার রিসেট করুন।
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedClass('all');
                    setSelectedCategory('all');
                  }}
                  className="mt-4 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-medium"
                >
                  ফিল্টার রিসেট করুন
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    isDownloaded={downloadedBookIds.has(book.id)}
                    readingProgress={readingProgressMap.get(book.id)}
                    onRead={handleReadBook}
                    onDownload={handleDownloadBook}
                    onExportFile={handleExportFile}
                  />
                ))}
              </div>
            )}

            {/* Home Tab: Curated Sections when not searching */}
            {activeTab === 'home' && !searchQuery && selectedClass === 'all' && selectedCategory === 'all' && (
              <div className="space-y-12 pt-8">
                
                {/* 1. পাঠ্যবই সেকশন */}
                <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-emerald-600" />
                        <span>শ্রেণীভিত্তিক জনপ্রিয় পাঠ্যবই</span>
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        ১ম থেকে ১২শ শ্রেণীর প্রয়োজনীয় পাঠ্যবই
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('textbooks');
                        setSelectedCategory('textbook');
                      }}
                      className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <span>সকল পাঠ্যবই</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {textbooksList.slice(0, 4).map((book) => (
                      <BookCard
                        key={book.id}
                        book={book}
                        isDownloaded={downloadedBookIds.has(book.id)}
                        readingProgress={readingProgressMap.get(book.id)}
                        onRead={handleReadBook}
                        onDownload={handleDownloadBook}
                        onExportFile={handleExportFile}
                      />
                    ))}
                  </div>
                </div>

                {/* 2. উপন্যাস ও গল্প সেকশন */}
                <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        <span>চিরন্তন উপন্যাস ও কিশোর সাহিত্য (১০০+ বই)</span>
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        পথের পাঁচালী, চাঁদের পাহাড়, দেবদাস, ফেলুদা ও ব্যোমকেশ সিরিজ
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('novels');
                        setSelectedCategory('all');
                      }}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <span>সব সাহিত্যগ্রন্থ</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {novelsList.slice(0, 4).map((book) => (
                      <BookCard
                        key={book.id}
                        book={book}
                        isDownloaded={downloadedBookIds.has(book.id)}
                        readingProgress={readingProgressMap.get(book.id)}
                        onRead={handleReadBook}
                        onDownload={handleDownloadBook}
                        onExportFile={handleExportFile}
                      />
                    ))}
                  </div>
                </div>

                {/* 3. বিজ্ঞান ও অলিম্পিয়াড সেকশন */}
                <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        <span>বিজ্ঞান, মহাকাশ ও গণিত অলিম্পিয়াড</span>
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        মহাবিশ্বের রহস্য, দ্রুত হিসাবের শর্টকাট কৌশল ও সাধারণ জ্ঞান
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {scienceMathList.map((book) => (
                      <BookCard
                        key={book.id}
                        book={book}
                        isDownloaded={downloadedBookIds.has(book.id)}
                        readingProgress={readingProgressMap.get(book.id)}
                        onRead={handleReadBook}
                        onDownload={handleDownloadBook}
                        onExportFile={handleExportFile}
                      />
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </main>

      {/* Student Profile & Google Drive Backup Modal */}
      <StudentProfileModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        currentStudent={currentStudent}
        onStudentChange={(p) => setCurrentStudent(p)}
        onDataRestored={() => {
          refreshDownloadedBooks();
          refreshReadingProgress();
          showToast('সকল বই ও অগ্রগতি সফলভাবে রিস্টোর করা হয়েছে!');
        }}
        showToast={showToast}
      />

      {/* Admin Dashboard Modal */}
      <AdminDashboard
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        showToast={showToast}
      />

      {/* Quiet Footer */}
      <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md overflow-hidden bg-slate-900">
              <img
                src="/src/assets/images/school_build_logo_1794028364308.jpg"
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              School Build
            </span>
            <span aria-hidden="true">·</span>
            <span>উন্মুক্ত ডিজিটাল পাঠাগার ও অফলাইন রিডার</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span>সকল শ্রেণীর পাঠ্যবই</span>
            <span aria-hidden="true">·</span>
            <span>গুগল ড্রাইভ ক্লাউড ব্যাকআপ</span>
            <span aria-hidden="true">·</span>
            <span>বাংলা ও ইংরেজি শব্দকোষ</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
