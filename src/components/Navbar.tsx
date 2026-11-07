import React from 'react';
import {
  BookA,
  BookOpen,
  Brain,
  Download,
  Moon,
  Sun,
  User,
  Shield,
  Wifi,
  WifiOff,
  Cloud
} from 'lucide-react';
import { StudentProfile } from '../services/authService';

interface NavbarProps {
  activeTab: 'home' | 'textbooks' | 'novels' | 'dictionary' | 'study-guide' | 'offline' | 'reader';
  setActiveTab: (tab: 'home' | 'textbooks' | 'novels' | 'dictionary' | 'study-guide' | 'offline') => void;
  downloadedCount: number;
  isOnline: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  currentStudent: StudentProfile | null;
  onOpenStudentModal: () => void;
  onOpenAdminModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  downloadedCount,
  isOnline,
  isDarkMode,
  toggleDarkMode,
  currentStudent,
  onOpenStudentModal,
  onOpenAdminModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand Wordmark with Generated Logo */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-md shrink-0"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-900 border border-emerald-500/30 flex items-center justify-center shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <img
              src="/src/assets/images/school_build_logo_1794028364308.jpg"
              alt="School Build Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">
              School Build
            </div>
            <div className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 leading-tight">
              ডিজিটাল পাঠ্যবই ও মুক্ত লাইব্রেরি
            </div>
          </div>
        </button>

        {/* Zone 2: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'home'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            বই সম্ভার
          </button>
          
          <button
            onClick={() => setActiveTab('textbooks')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'textbooks'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            সকল পাঠ্যবই
          </button>

          <button
            onClick={() => setActiveTab('novels')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'novels'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            উপন্যাস ও গল্প
          </button>

          <button
            onClick={() => setActiveTab('dictionary')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'dictionary'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookA className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>শব্দকোষ ও অভিধান</span>
          </button>

          <button
            onClick={() => setActiveTab('study-guide')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'study-guide'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>পড়াশোনার গাইড</span>
          </button>

          <button
            onClick={() => setActiveTab('offline')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'offline'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>অফলাইন শেলফ</span>
            {downloadedCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-600 text-white rounded-full font-bold">
                {downloadedCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Actions & Auth Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          
          {/* Connection status */}
          <div
            title={isOnline ? 'অনলাইন সংযোগ সক্রিয়' : 'অফলাইন মোড'}
            className="hidden sm:flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400"
          >
            {isOnline ? (
              <Wifi className="w-4 h-4 text-emerald-500" />
            ) : (
              <WifiOff className="w-4 h-4 text-amber-500" />
            )}
          </div>

          {/* Dark Mode toggle */}
          <button
            onClick={toggleDarkMode}
            aria-label="থিম পরিবর্তন করুন"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Student Profile / Google Drive Sync Button */}
          <button
            onClick={onOpenStudentModal}
            title={currentStudent ? `${currentStudent.displayName} - গুগল ড্রাইভ ব্যাকআপ সক্রিয়` : 'স্টুডেন্ট সাইন-ইন ও ড্রাইভ ব্যাকআপ'}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-all"
          >
            {currentStudent?.photoURL ? (
              <img
                src={currentStudent.photoURL}
                alt="Profile"
                className="w-4 h-4 rounded-full object-cover"
              />
            ) : (
              <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            )}
            <span className="hidden sm:inline max-w-[80px] truncate">
              {currentStudent ? currentStudent.displayName.split(' ')[0] : 'স্টুডেন্ট'}
            </span>
            <Cloud className="w-3 h-3 text-emerald-500" />
          </button>

          {/* Admin Login Button */}
          <button
            onClick={onOpenAdminModal}
            title="এডমিন অ্যানালিটিক্স ও ড্যাশবোর্ড"
            className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 font-semibold text-xs flex items-center gap-1 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">এডমিন</span>
          </button>

          {/* Primary CTA: Offline Library button */}
          <button
            onClick={() => setActiveTab('offline')}
            className="hidden sm:flex px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-sm transition-all items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>অফলাইন ({downloadedCount})</span>
          </button>
        </div>

      </div>

      {/* Mobile navigation tab strip */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-200 dark:border-slate-800 py-2 px-1 bg-white dark:bg-slate-900 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('home')}
          className={`py-1 px-2 font-medium rounded whitespace-nowrap ${activeTab === 'home' ? 'text-emerald-600 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
        >
          হোম
        </button>
        <button
          onClick={() => setActiveTab('textbooks')}
          className={`py-1 px-2 font-medium rounded whitespace-nowrap ${activeTab === 'textbooks' ? 'text-emerald-600 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
        >
          পাঠ্যবই
        </button>
        <button
          onClick={() => setActiveTab('novels')}
          className={`py-1 px-2 font-medium rounded whitespace-nowrap ${activeTab === 'novels' ? 'text-emerald-600 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
        >
          উপন্যাস
        </button>
        <button
          onClick={() => setActiveTab('dictionary')}
          className={`py-1 px-2 font-medium rounded whitespace-nowrap ${activeTab === 'dictionary' ? 'text-indigo-600 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
        >
          অভিধান
        </button>
        <button
          onClick={() => setActiveTab('study-guide')}
          className={`py-1 px-2 font-medium rounded whitespace-nowrap ${activeTab === 'study-guide' ? 'text-emerald-600 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
        >
          গাইড
        </button>
        <button
          onClick={() => setActiveTab('offline')}
          className={`py-1 px-2 font-medium rounded whitespace-nowrap flex items-center gap-1 ${activeTab === 'offline' ? 'text-emerald-600 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
        >
          অফলাইন ({downloadedCount})
        </button>
      </div>
    </header>
  );
};
