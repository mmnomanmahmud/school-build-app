import React from 'react';
import { BookOpen, CheckCircle, Download, Sparkles, WifiOff } from 'lucide-react';

interface HeroSectionProps {
  onExploreTextbooks: () => void;
  onExploreNovels: () => void;
  onOpenStudyGuide?: () => void;
  onOpenOffline: () => void;
  totalBooksCount: number;
  offlineCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreTextbooks,
  onExploreNovels,
  onOpenStudyGuide,
  onOpenOffline,
  totalBooksCount,
  offlineCount,
}) => {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm mb-10">
      
      {/* 2-column hero split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        
        {/* Left Content Column */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
          <div>
            {/* Lead text kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-3">
              <Sparkles className="w-4 h-4" />
              <span>স্কুল বিল্ড উন্মুক্ত ডিজিটাল লাইব্রেরি ও ই-রিডার</span>
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight text-balance">
              জ্ঞানের দিগন্ত উন্মোচিত হোক,{' '}
              <span className="text-emerald-600 dark:text-emerald-400">
                ইন্টারনেট ছাড়াই
              </span>{' '}
              পড়ুন যেকোনো বই।
            </h1>

            {/* Subtitle */}
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              ১ম থেকে দ্বাদশ শ্রেণীর সকল পাঠ্যবই, শতাধিক কালজয়ী বাংলা উপন্যাস, মজার ছোটগল্প এবং
              বিজ্ঞান-গণিতের বই এখন এক ঠিকানায়। খুব দ্রুত বই ডাউনলোড করে অফলাইনে পড়ার সম্পূর্ণ সুবিধা।
            </p>

            {/* Feature Highlights */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>সকল শ্রেণীর পাঠ্যবই ও ক্ষুদ্র নৃগোষ্ঠীর ভাষা</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>১০০+ অমর উপন্যাস ও ছোটগল্প সম্ভার</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>সুপার ফাস্ট ডাউনলোড ও অফলাইন রিডার</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>পড়াশোনার নির্দেশিকা ও ফোকাস টাইমার</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
            <button
              onClick={onExploreTextbooks}
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>পাঠ্যবই দেখুন</span>
            </button>

            <button
              onClick={onExploreNovels}
              className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              উপন্যাস ও গল্প (১০০+)
            </button>

            {onOpenStudyGuide && (
              <button
                onClick={onOpenStudyGuide}
                className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-xl transition-colors"
              >
                পড়াশোনার নির্দেশিকা
              </button>
            )}

            <button
              onClick={onOpenOffline}
              className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>আমার অফলাইন শেলফ ({offlineCount})</span>
            </button>
          </div>
        </div>

        {/* Right Visual Image Column */}
        <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src="/src/assets/images/school_build_banner_1794026099800.jpg"
            alt="School Build Digital Library"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover lg:absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-white/20 lg:via-transparent lg:to-transparent" />
          
          {/* Subtle floating trust marker */}
          <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
              <WifiOff className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold">অফলাইনে পড়ার শতভাগ নিশ্চয়তা</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              ১০০% ফ্রি
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
