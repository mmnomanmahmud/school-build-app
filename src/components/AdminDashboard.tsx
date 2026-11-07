import React, { useState, useEffect } from 'react';
import { adminLogin, isAdminLoggedIn, adminLogout } from '../services/authService';
import { analyticsService, SystemAnalytics } from '../services/analyticsService';
import {
  ShieldAlert,
  Users,
  Radio,
  Download,
  Clock,
  BookOpen,
  Activity,
  LogOut,
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  Award,
  KeyRound,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  showToast,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isAdminLoggedIn());
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [analytics, setAnalytics] = useState<SystemAnalytics>(() => analyticsService.getAnalytics());
  const [searchStudent, setSearchStudent] = useState('');

  useEffect(() => {
    if (isOpen) {
      setIsAuthenticated(isAdminLoggedIn());
      setAnalytics(analyticsService.getAnalytics());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Admin Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(passwordInput)) {
      setIsAuthenticated(true);
      setAuthError('');
      showToast('এডমিন প্যানেলে সফলভাবে লগইন হয়েছে!');
    } else {
      setAuthError('ভুল পাসওয়ার্ড! (ডিফল্ট পাসওয়ার্ড: admin123)');
    }
  };

  const handleAdminLogout = () => {
    adminLogout();
    setIsAuthenticated(false);
    setPasswordInput('');
    showToast('এডমিন সেশন থেকে লগআউট করা হয়েছে।');
  };

  // Filter students
  const filteredStudents = analytics.students.filter((std) => {
    if (!searchStudent.trim()) return true;
    const q = searchStudent.toLowerCase().trim();
    return (
      std.displayName.toLowerCase().includes(q) ||
      std.email.toLowerCase().includes(q) ||
      std.studentClass?.toLowerCase().includes(q) ||
      std.rollNo?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>School Build এডমিন অ্যানালিটিক্স ড্যাশবোর্ড</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold">
                  Secure Admin Panel
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ব্যবহারকারী পরিসংখ্যান, সক্রিয় শিক্ষার্থী, মোট ডাউনলোড ও সময় মনিটরিং
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* STATE 1: Password Login Form */}
        {!isAuthenticated ? (
          <div className="py-12 max-w-sm mx-auto text-center">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center mb-4">
              <KeyRound className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              এডমিন পাসওয়ার্ড দিন
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              স্কুল বিল্ডের প্রশাসনিক তথ্য ও অ্যানালিটিক্স দেখতে এডমিন পাসওয়ার্ড প্রবেশ করান
            </p>

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
              <div>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="এডমিন পাসওয়ার্ড লিখুন (যেমন: admin123)"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {authError && (
                  <p className="text-[11px] text-rose-500 font-semibold mt-1.5">{authError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
              >
                এডমিন প্যানেলে প্রবেশ করুন
              </button>
            </form>
          </div>
        ) : (
          /* STATE 2: Logged In Admin Dashboard */
          <div className="space-y-8 mt-6">
            
            {/* Top Bar Status */}
            <div className="flex items-center justify-between text-xs pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  লাইভ অ্যানালিটিক্স ফিড সক্রিয়
                </span>
              </div>

              <button
                onClick={handleAdminLogout}
                className="text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>এডমিন লগআউট</span>
              </button>
            </div>

            {/* 4 Core KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Stat 1: কতজন ইউজ করছে */}
              <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40">
                <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">মোট ব্যবহারকারী</span>
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                  {analytics.totalRegisteredUsers.toLocaleString('bn-BD')} জন
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  নিবন্ধিত শিক্ষার্থী ও পাঠক
                </div>
              </div>

              {/* Stat 2: কতজন অ্যাক্টিভ আছে */}
              <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">বর্তমানে অ্যাক্টিভ</span>
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums flex items-baseline gap-2">
                  <span>{analytics.currentActiveUsers} জন</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded">
                    Live
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  অ্যাপে বই ও পাঠে রত শিক্ষার্থী
                </div>
              </div>

              {/* Stat 3: মোট কতগুলো বই ডাউনলোড করা হয়েছে */}
              <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
                <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">মোট বই ডাউনলোড</span>
                  <Download className="w-5 h-5" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                  {analytics.totalBooksDownloaded.toLocaleString('bn-BD')} টি
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  অফলাইনে পাঠযোগ্য সংগৃহীত বই
                </div>
              </div>

              {/* Stat 4: কে কত সময় ব্যবহার করেছে (Aggregate Time) */}
              <div className="p-5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40">
                <div className="flex items-center justify-between text-purple-600 dark:text-purple-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">মোট ব্যবহারের সময়</span>
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                  {analyticsService.formatDuration(analytics.totalTimeSpentSeconds)}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  শিক্ষার্থীদের মোট পাঠ সময়কাল
                </div>
              </div>

            </div>

            {/* Students Table: কে কত সময় ব্যবহার করেছে ও সক্রিয়তার বিস্তারিত */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-indigo-600" />
                    <span>শিক্ষার্থীদের ব্যবহারের সময় ও সক্রিয়তা তালিকা</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    প্রতিটি শিক্ষার্থী কত সময় পড়েছে এবং কয়টি বই ডাউনলোড করেছে
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchStudent}
                    onChange={(e) => setSearchStudent(e.target.value)}
                    placeholder="শিক্ষার্থীর নাম বা রোল খুঁজুন..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-3 px-4">শিক্ষার্থীর নাম</th>
                      <th className="py-3 px-4">শ্রেণী ও রোল</th>
                      <th className="py-3 px-4">মোট ব্যবহারের সময়</th>
                      <th className="py-3 px-4">ডাউনলোড বই</th>
                      <th className="py-3 px-4">সর্বশেষ সক্রিয়</th>
                      <th className="py-3 px-4">গুগল ড্রাইভ সিঙ্ক</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredStudents.map((std) => (
                      <tr key={std.uid} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                          <div>{std.displayName}</div>
                          <div className="text-[11px] font-normal text-slate-400">{std.email}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                          {std.studentClass || '১০ম শ্রেণী'} · রোল: {std.rollNo || '০১'}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-purple-600 dark:text-purple-400 tabular-nums">
                          {Math.floor(std.totalTimeSpentMinutes / 60)} ঘণ্টা {std.totalTimeSpentMinutes % 60} মিনিট
                        </td>
                        <td className="py-3 px-4 tabular-nums font-semibold text-slate-700 dark:text-slate-200">
                          {std.totalDownloadsCount} টি বই
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {std.lastActive}
                        </td>
                        <td className="py-3 px-4">
                          {std.lastBackupDate ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>ব্যাকআপ সম্পন্ন</span>
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400">লোকাল ডিভাইস</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2-Column Split: Top Books Leaderboard & Live Activity Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Leaderboard */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>শীর্ষ ডাউনলোড ও পঠিত বই</span>
                  </h4>
                  <span className="text-xs text-slate-400">র‍্যাংকিং</span>
                </div>

                <div className="space-y-2.5">
                  {analytics.topBooks.map((b, i) => (
                    <div key={b.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200">{b.title}</div>
                          <div className="text-[10px] text-slate-400">{b.category}</div>
                        </div>
                      </div>
                      <div className="text-right font-mono text-[11px]">
                        <div className="font-bold text-emerald-600 dark:text-emerald-400">{b.downloadsCount} ডাউনলোড</div>
                        <div className="text-slate-400">{b.readsCount} বার পঠিত</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Activity Logs */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    <span>রিসেন্ট অ্যাক্টিভিটি লগ (Live Stream)</span>
                  </h4>
                  <span className="text-xs text-slate-400">রিয়েল-টাইম</span>
                </div>

                <div className="space-y-2.5">
                  {analytics.activityLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{log.userName}</span>
                        <span>{log.timestamp}</span>
                      </div>
                      <div className="text-slate-600 dark:text-slate-300">
                        {log.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
