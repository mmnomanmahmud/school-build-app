import React, { useState } from 'react';
import {
  StudentProfile,
  googleSignIn,
  quickStudentLogin,
  logoutStudent,
  getAccessToken
} from '../services/authService';
import { driveSyncService } from '../services/driveSyncService';
import { analyticsService } from '../services/analyticsService';
import {
  Cloud,
  Download,
  Upload,
  User,
  CheckCircle2,
  AlertCircle,
  LogOut,
  RefreshCw,
  FolderSync,
  FileCheck,
  Shield,
  Smartphone,
  ExternalLink,
  Loader2
} from 'lucide-react';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStudent: StudentProfile | null;
  onStudentChange: (profile: StudentProfile | null) => void;
  onDataRestored: () => void;
  showToast: (msg: string) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  currentStudent,
  onStudentChange,
  onDataRestored,
  showToast,
}) => {
  // Login form states
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showQuickForm, setShowQuickForm] = useState(false);
  const [quickName, setQuickName] = useState('');
  const [quickClass, setQuickClass] = useState('১০ম শ্রেণী (SSC)');
  const [quickRoll, setQuickRoll] = useState('');

  // Backup & Restore states
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);

  if (!isOpen) return null;

  // Handle Google Sign-in with Drive Scope
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const { user } = await googleSignIn();
      const updatedProfile: StudentProfile = {
        uid: user.uid,
        displayName: user.displayName || 'শিক্ষার্থী',
        email: user.email || '',
        photoURL: user.photoURL || undefined,
        studentClass: '১০ম শ্রেণী (SSC)',
        rollNo: '০১',
        joinedAt: new Date().toISOString(),
        lastActive: 'এইমাত্র',
        totalTimeSpentMinutes: 30,
        totalDownloadsCount: 0,
      };
      onStudentChange(updatedProfile);
      analyticsService.logActivity('login', updatedProfile.displayName, 'গুগল অ্যাকাউন্ট দিয়ে সফলভাবে সাইন ইন করেছেন');
      showToast(`স্বাগতম, ${updatedProfile.displayName}! গুগল ড্রাইভ ব্যাকআপ সক্রিয় হয়েছে।`);
    } catch (err: any) {
      console.error('Google Sign-in failed', err);
      showToast('গুগল সাইন-ইন সম্পন্ন করা সম্ভব হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Handle Quick Student Login
  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim()) return;

    const profile = quickStudentLogin(quickName, quickClass, quickRoll);
    onStudentChange(profile);
    analyticsService.logActivity('login', profile.displayName, 'শিক্ষার্থী প্রোফাইল দিয়ে লগইন করেছেন');
    showToast(`স্বাগতম, ${profile.displayName}! আপনার শিক্ষার্থী প্রোফাইল সংরক্ষিত হয়েছে।`);
    setShowQuickForm(false);
  };

  // Backup to Google Drive
  const handleBackupToDrive = async () => {
    setIsBackingUp(true);
    try {
      let token = await getAccessToken();
      if (!token) {
        // Prompt Google Sign-in to get fresh token with drive.file scope
        const res = await googleSignIn();
        token = res.accessToken;
      }

      const res = await driveSyncService.backupToGoogleDrive(
        token,
        currentStudent?.displayName,
        currentStudent?.email
      );

      if (res.success) {
        if (currentStudent) {
          const updated: StudentProfile = {
            ...currentStudent,
            lastBackupDate: new Date().toISOString(),
          };
          onStudentChange(updated);
        }
        analyticsService.logActivity(
          'backup',
          currentStudent?.displayName || 'শিক্ষার্থী',
          'গুগল ড্রাইভে বই ও পড়ার অগ্রগতি ক্লাউড ব্যাকআপ সংরক্ষণ করেছেন'
        );
        showToast('আপনার সকল বই, পড়ার অগ্রগতি ও বুকমার্ক গুগল ড্রাইভে সফলভাবে ব্যাকআপ রাখা হয়েছে!');
      }
    } catch (err: any) {
      console.error('Drive backup failed', err);
      showToast('গুগল ড্রাইভে ব্যাকআপ রাখতে সমস্যা হয়েছে। গুগল সাইন ইন নিশ্চিত করুন।');
    } finally {
      setIsBackingUp(false);
    }
  };

  // Restore from Google Drive (Mandatory Confirmation Dialog)
  const confirmRestoreFromDrive = async () => {
    setShowRestoreConfirm(false);
    setIsRestoring(true);
    try {
      let token = await getAccessToken();
      if (!token) {
        const res = await googleSignIn();
        token = res.accessToken;
      }

      const backup = await driveSyncService.restoreFromGoogleDrive(token);
      analyticsService.logActivity(
        'restore',
        currentStudent?.displayName || 'শিক্ষার্থী',
        'গুগল ড্রাইভ থেকে আগের ডিভাইস/সেশনের ব্যাকআপ রিস্টোর করেছেন'
      );
      onDataRestored();
      showToast(`গুগল ড্রাইভ থেকে ${backup.downloadedBooks.length}টি বই ও পড়ার অগ্রগতি রিস্টোর সফল হয়েছে!`);
    } catch (err: any) {
      console.error('Drive restore failed', err);
      showToast('গুগল ড্রাইভ থেকে ব্যাকআপ রিস্টোর করা যায়নি। ফাইলের অস্তিত্ব নিশ্চিত করুন।');
    } finally {
      setIsRestoring(false);
    }
  };

  const handleLogout = async () => {
    await logoutStudent();
    onStudentChange(null);
    showToast('সফলভাবে লগআউট করা হয়েছে।');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                শিক্ষার্থী প্রোফাইল ও ক্লাউড সিঙ্ক
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                গুগল ড্রাইভ ব্যাকআপের মাধ্যমে ডিভাইস বদলালেও কোনো বই হারাবে না
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Content Area */}
        <div className="mt-6 space-y-6 text-xs text-slate-700 dark:text-slate-300">
          
          {/* STATE 1: Logged In Student */}
          {currentStudent ? (
            <div className="space-y-6">
              
              {/* Profile Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {currentStudent.photoURL ? (
                    <img
                      src={currentStudent.photoURL}
                      alt={currentStudent.displayName}
                      className="w-12 h-12 rounded-full border border-emerald-500 object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-base">
                      {currentStudent.displayName.charAt(0)}
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {currentStudent.displayName}
                    </h3>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {currentStudent.email || `${currentStudent.studentClass} · রোল: ${currentStudent.rollNo}`}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>গুগল ড্রাইভ সিঙ্ক সংযুক্ত</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="লগআউট"
                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* Google Drive Cloud Backup Box */}
              <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-bold text-xs">
                    <Cloud className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>গুগল ড্রাইভ ক্লাউড ব্যাকআপ স্ট্যাটাস</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-semibold">
                    সক্রিয়
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  আপনার ডাউনলোডকৃত সকল পাঠ্যবই ও উপন্যাস, প্রতিটি বইয়ের পড়ার শতকরা অগ্রগতি এবং বুকমার্কসমূহ
                  আপনার ব্যক্তিগত গুগল ড্রাইভে সুরক্ষিত থাকে।
                </p>

                {currentStudent.lastBackupDate && (
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-mono">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>সর্বশেষ ব্যাকআপ: {new Date(currentStudent.lastBackupDate).toLocaleString('bn-BD')}</span>
                  </div>
                )}

                {/* Backup & Restore Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <button
                    onClick={handleBackupToDrive}
                    disabled={isBackingUp}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    {isBackingUp ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>ড্রাইভে আপলোড হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>ড্রাইভে ব্যাকআপ রাখুন</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setShowRestoreConfirm(true)}
                    disabled={isRestoring}
                    className="w-full py-2.5 px-3 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    {isRestoring ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                        <span>রিস্টোর হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>ড্রাইভ থেকে রিস্টোর</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Local File Fallback */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
                <span>মোবাইল পরিবর্তন বা অফলাইন ফাইল ব্যাকআপ:</span>
                <button
                  onClick={() => driveSyncService.exportLocalBackupFile()}
                  className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>.json ফাইল ডাউনলোড</span>
                </button>
              </div>

            </div>
          ) : (
            /* STATE 2: Not Logged In - Sign-in Options */
            <div className="space-y-6">
              
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed flex items-start gap-2.5">
                <Smartphone className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold mb-0.5">গুগল ড্রাইভ ব্যাকআপ সুবিধা:</strong>
                  একবার গুগল আইডি দিয়ে সাইন ইন করলে মোবাইল পরিবর্তন করলেও একই জিমেইলে আপনার সকল ডাউনলোডকৃত বই
                  এবং রিডিং মোড স্বয়ংক্রিয়ভাবে ফিরে আসবে।
                </div>
              </div>

              {/* Primary: Google Sign-in Button (GSI Material Style) */}
              <div>
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading}
                  className="w-full py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-white font-semibold flex items-center justify-center gap-3 shadow-sm hover:shadow transition-all"
                >
                  {isGoogleLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                  )}
                  <span>গুগল দিয়ে সাইন ইন ও ড্রাইভ ব্যাকআপ</span>
                </button>
              </div>

              {/* Alternative: Quick Student Login without Google */}
              <div className="pt-2">
                {!showQuickForm ? (
                  <button
                    onClick={() => setShowQuickForm(true)}
                    className="w-full text-center text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline font-medium"
                  >
                    অথবা সরাসরি রোল ও নাম দিয়ে শিক্ষার্থী প্রোফাইল তৈরি করুন
                  </button>
                ) : (
                  <form onSubmit={handleQuickSubmit} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        আপনার নাম:
                      </label>
                      <input
                        type="text"
                        required
                        value={quickName}
                        onChange={(e) => setQuickName(e.target.value)}
                        placeholder="যেমন: আরিয়ান আহমেদ"
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          শ্রেণী:
                        </label>
                        <select
                          value={quickClass}
                          onChange={(e) => setQuickClass(e.target.value)}
                          className="w-full px-2.5 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        >
                          <option value="৬ষ্ঠ শ্রেণী">৬ষ্ঠ শ্রেণী</option>
                          <option value="৭ম শ্রেণী">৭ম শ্রেণী</option>
                          <option value="৮ম শ্রেণী">৮ম শ্রেণী</option>
                          <option value="৯ম শ্রেণী">৯ম শ্রেণী</option>
                          <option value="১০ম শ্রেণী (SSC)">১০ম শ্রেণী (SSC)</option>
                          <option value="১১শ-১২শ শ্রেণী (HSC)">১১শ-১২শ শ্রেণী (HSC)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          রোল নম্বর:
                        </label>
                        <input
                          type="text"
                          value={quickRoll}
                          onChange={(e) => setQuickRoll(e.target.value)}
                          placeholder="যেমন: ০৫"
                          className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowQuickForm(false)}
                        className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                      >
                        বাতিল
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                      >
                        প্রোফাইল সংরক্ষণ
                      </button>
                    </div>
                  </form>
                )}
              </div>

            </div>
          )}

        </div>

        {/* Confirmation Modal for Google Drive Restore (Destructive operation check) */}
        {showRestoreConfirm && (
          <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-amber-300 dark:border-amber-800 animate-in zoom-in-95">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                গুগল ড্রাইভ থেকে রিস্টোর নিশ্চিত করুন
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                গুগল ড্রাইভ ব্যাকআপ থেকে রিস্টোর করলে আপনার পূর্ববর্তী সংরক্ষিত বই, শতকরা পড়ার অগ্রগতি ও বুকমার্ক বর্তমান ডিভাইসে যুক্ত হবে। আপনি কি রিস্টোর করতে চান?
              </p>
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowRestoreConfirm(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  বাতিল
                </button>
                <button
                  onClick={confirmRestoreFromDrive}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  হ্যাঁ, রিস্টোর করুন
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
