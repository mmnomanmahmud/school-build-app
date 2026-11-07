import { StudentProfile } from './authService';

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  type: 'login' | 'download' | 'read' | 'backup' | 'restore';
  userName: string;
  userRole: 'student' | 'admin';
  description: string;
  details?: string;
}

export interface SystemAnalytics {
  totalRegisteredUsers: number;
  currentActiveUsers: number;
  totalBooksDownloaded: number;
  totalTimeSpentSeconds: number;
  totalReadingSessions: number;
  students: StudentProfile[];
  activityLogs: ActivityLogItem[];
  topBooks: { id: string; title: string; category: string; downloadsCount: number; readsCount: number }[];
}

const ANALYTICS_STORAGE_KEY = 'school_build_system_analytics';
const CURRENT_SESSION_START_KEY = 'school_build_session_start';

// Initial Mock Seed for realistic school environment if empty
const DEFAULT_STUDENTS: StudentProfile[] = [
  {
    uid: 'std-101',
    displayName: 'মুহাম্মদ তানভীর আহমেদ',
    email: 'tanvir.student@schoolbuild.edu',
    studentClass: '১০ম শ্রেণী (SSC)',
    rollNo: '০১',
    joinedAt: '২০২৬-০১-১০T০৯:০০:০০Z',
    lastActive: 'আজ, ৫ মিনিট আগে',
    totalTimeSpentMinutes: 245, // ~4 hours 5 mins
    totalDownloadsCount: 14,
    lastBackupDate: '২০২৬-০৩-০৫T১৪:২০:০০Z',
  },
  {
    uid: 'std-102',
    displayName: 'ফাতিমা তুজ জোহরা',
    email: 'fatima.zohra@gmail.com',
    studentClass: '৯ম শ্রেণী',
    rollNo: '০৩',
    joinedAt: '২০২৬-০১-১২T১০:৩০:০০Z',
    lastActive: 'আজ, ১২ মিনিট আগে',
    totalTimeSpentMinutes: 380, // ~6 hours 20 mins
    totalDownloadsCount: 22,
    lastBackupDate: '২০২৬-০৩-০৬T১১:১০:০০Z',
  },
  {
    uid: 'std-103',
    displayName: 'সৌমেন রায়',
    email: 'soumen.roy2026@gmail.com',
    studentClass: '৮ম শ্রেণী',
    rollNo: '০৫',
    joinedAt: '২০২৬-০১-১৫T১১:১৫:০০Z',
    lastActive: 'গতকাল, সন্ধ্যা ৭:৩০',
    totalTimeSpentMinutes: 190, // ~3 hours 10 mins
    totalDownloadsCount: 9,
  },
  {
    uid: 'std-104',
    displayName: 'আফরিন জাহান মৌমি',
    email: 'afrin.moumi@yahoo.com',
    studentClass: '১১শ শ্রেণী (HSC)',
    rollNo: '০২',
    joinedAt: '২০২৬-০১-২০T০৮:৪৫:০০Z',
    lastActive: 'আজ, ২০ মিনিট আগে',
    totalTimeSpentMinutes: 410, // ~6 hours 50 mins
    totalDownloadsCount: 28,
    lastBackupDate: '২০২৬-০৩-০৪T১৬:৩০:০০Z',
  },
  {
    uid: 'std-105',
    displayName: 'প্রতীক চাকমা',
    email: 'protik.chakma@gmail.com',
    studentClass: '৭ম শ্রেণী',
    rollNo: '০৭',
    joinedAt: '২০২৬-০১-২২T১৪:০০:০০Z',
    lastActive: 'আজ, ১ ঘণ্টা আগে',
    totalTimeSpentMinutes: 155, // ~2.5 hours
    totalDownloadsCount: 11,
  },
];

const DEFAULT_LOGS: ActivityLogItem[] = [
  {
    id: 'log-1',
    timestamp: 'আজ, ২ মিনিট আগে',
    type: 'download',
    userName: 'মুহাম্মদ তানভীর আহমেদ',
    userRole: 'student',
    description: "'পদার্থবিজ্ঞান - ৯ম-১০ম শ্রেণী' অফলাইনে ডাউনলোড করেছেন",
  },
  {
    id: 'log-2',
    timestamp: 'আজ, ৮ মিনিট আগে',
    type: 'backup',
    userName: 'ফাতিমা তুজ জোহরা',
    userRole: 'student',
    description: 'গুগল ড্রাইভে ২২টি বই ও পড়ার অগ্রগতি ব্যাকআপ সম্পন্ন হয়েছে',
  },
  {
    id: 'log-3',
    timestamp: 'আজ, ১৫ মিনিট আগে',
    type: 'read',
    userName: 'আফরিন জাহান মৌমি',
    userRole: 'student',
    description: "'পথের পাঁচালী' অধ্যায় ৩ পড়া শেষ করেছেন",
  },
  {
    id: 'log-4',
    timestamp: 'আজ, ২৫ মিনিট আগে',
    type: 'login',
    userName: 'প্রতীক চাকমা',
    userRole: 'student',
    description: 'মোবাইল ডিভাইস থেকে সফলভাবে সাইন ইন করেছেন',
  },
];

export const analyticsService = {
  // Get all analytics data
  getAnalytics(): SystemAnalytics {
    try {
      const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {}

    const initial: SystemAnalytics = {
      totalRegisteredUsers: 1420,
      currentActiveUsers: 84,
      totalBooksDownloaded: 3840,
      totalTimeSpentSeconds: 1420000, // ~394 hours aggregate
      totalReadingSessions: 5920,
      students: DEFAULT_STUDENTS,
      activityLogs: DEFAULT_LOGS,
      topBooks: [
        { id: 'tb-class-9-physics', title: 'পদার্থবিজ্ঞান - ৯ম-১০ম শ্রেণী (SSC)', category: 'বিজ্ঞান', downloadsCount: 642, readsCount: 1850 },
        { id: 'novel-pather-panchali', title: 'পথের পাঁচালী', category: 'উপন্যাস', downloadsCount: 520, readsCount: 1640 },
        { id: 'feluda-badshahi-angti', title: 'ফেলুদা: বাদশাহী আংটি', category: 'গোয়েন্দা', downloadsCount: 485, readsCount: 1420 },
        { id: 'tb-class-11-ict', title: 'তথ্য ও যোগাযোগ প্রযুক্তি (HSC)', category: 'বিজ্ঞান', downloadsCount: 460, readsCount: 1290 },
        { id: 'novel-chander-pahar', title: 'চাঁদের পাহাড়', category: 'উপন্যাস', downloadsCount: 430, readsCount: 1180 },
      ],
    };

    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  },

  // Save analytics state
  saveAnalytics(data: SystemAnalytics) {
    try {
      localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Failed to save analytics', err);
    }
  },

  // Record a new activity log
  logActivity(type: ActivityLogItem['type'], userName: string, description: string, userRole: 'student' | 'admin' = 'student') {
    const data = this.getAnalytics();
    const newLog: ActivityLogItem = {
      id: `log-${Date.now()}`,
      timestamp: 'এইমাত্র',
      type,
      userName,
      userRole,
      description,
    };
    data.activityLogs = [newLog, ...data.activityLogs.slice(0, 49)]; // keep 50 logs
    this.saveAnalytics(data);
  },

  // Increment download count
  recordDownload(bookTitle: string, studentName: string) {
    const data = this.getAnalytics();
    data.totalBooksDownloaded += 1;
    this.logActivity('download', studentName, `'${bookTitle}' বইটি অফলাইনে ডাউনলোড করা হয়েছে`);
    this.saveAnalytics(data);
  },

  // Track session duration in seconds and add to total time
  recordSessionTime(seconds: number) {
    const data = this.getAnalytics();
    data.totalTimeSpentSeconds += seconds;
    this.saveAnalytics(data);
  },

  // Format seconds into Bengali string (e.g. "৩ ঘণ্টা ২০ মিনিট")
  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours} ঘণ্টা ${minutes} মিনিট`;
    }
    return `${minutes} মিনিট`;
  },
};
