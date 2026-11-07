import React, { useState, useEffect, useRef } from 'react';
import {
  Brain,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Clock,
  Target,
  Coffee,
  Eye,
  ShieldCheck,
  Zap,
  Lightbulb,
  Award,
  ChevronRight,
  Sun,
  Flame,
  Volume2,
  VolumeX
} from 'lucide-react';

export const StudyGuide: React.FC = () => {
  // -------------------------------------------------------------
  // Pomodoro Focus Timer State
  // -------------------------------------------------------------
  const [timerMode, setTimerMode] = useState<'study' | 'shortBreak' | 'longBreak'>('study');
  const studyDuration = 25 * 60; // 25 mins
  const shortBreakDuration = 5 * 60; // 5 mins
  const longBreakDuration = 15 * 60; // 15 mins

  const [timeLeft, setTimeLeft] = useState<number>(studyDuration);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Active section tab in Study Guide
  const [activeGuideTab, setActiveGuideTab] = useState<'all' | 'focus' | 'retention' | 'timer' | 'exam' | 'health'>('all');

  // Interactive Focus Checklist
  const [checklist, setChecklist] = useState<{ [key: string]: boolean }>({
    deskClean: false,
    phoneSilent: false,
    waterReady: false,
    singleTaskGoal: false,
    timerSet: false,
  });

  // Sound synthesis via Web Audio API (Pleasant Chime)
  const playAlertSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch {
      // AudioContext fallback
    }
  };

  // Timer Interval Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      playAlertSound();
      if (timerMode === 'study') {
        const nextCount = completedSessions + 1;
        setCompletedSessions(nextCount);
        if (nextCount % 4 === 0) {
          setTimerMode('longBreak');
          setTimeLeft(longBreakDuration);
        } else {
          setTimerMode('shortBreak');
          setTimeLeft(shortBreakDuration);
        }
      } else {
        setTimerMode('study');
        setTimeLeft(studyDuration);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, timerMode, completedSessions]);

  // Format time display MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Switch Timer Mode
  const handleSwitchMode = (mode: 'study' | 'shortBreak' | 'longBreak') => {
    setIsRunning(false);
    setTimerMode(mode);
    if (mode === 'study') setTimeLeft(studyDuration);
    if (mode === 'shortBreak') setTimeLeft(shortBreakDuration);
    if (mode === 'longBreak') setTimeLeft(longBreakDuration);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (timerMode === 'study') setTimeLeft(studyDuration);
    if (timerMode === 'shortBreak') setTimeLeft(shortBreakDuration);
    if (timerMode === 'longBreak') setTimeLeft(longBreakDuration);
  };

  const toggleChecklistItem = (key: string) => {
    setChecklist((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const totalCurrentDuration =
    timerMode === 'study' ? studyDuration : timerMode === 'shortBreak' ? shortBreakDuration : longBreakDuration;
  const progressPercent = Math.round(((totalCurrentDuration - timeLeft) / totalCurrentDuration) * 100);

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-8 sm:p-10 border border-emerald-900/40 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-4 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>বিজ্ঞানসম্মত মেধা বিকাশ ও পড়াশোনার পূর্ণাঙ্গ গাইডলাইন</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            পড়াশোনায় গভীর মনোযোগ ও দ্রুত শেখার বৈজ্ঞানিক কৌশল
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            মুখস্থ না করে সহজেই যেকোনো কঠিন বিষয় আজীবন মনে রাখা, মনোযোগ নষ্টকারী ডিস্ট্র্যাকশন দূরীকরণ এবং
            পরীক্ষার ভয় জয় করার প্রমাণিত আন্তর্জাতিক বৈজ্ঞানিক পদ্ধতিসমূহ।
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-emerald-200">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>ফেইনম্যান মেথড</span>
            </div>
            <span className="text-emerald-500/40">·</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>অ্যাক্টিভ রিকল</span>
            </div>
            <span className="text-emerald-500/40">·</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>স্পেসড রিপিটেশন</span>
            </div>
            <span className="text-emerald-500/40">·</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>পোমোডোরো ফোকাস টাইমার</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Pomodoro Focus & Prep Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Pomodoro Study Timer */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Timer className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  পোমোডোরো ফোকাস টাইমার
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  ২৫ মিনিট গভীর পড়াশোনা + ৫ মিনিট মানসিক প্রশান্তির বিরতি
                </p>
              </div>
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'সাউন্ড অ্যালার্ট বন্ধ করুন' : 'সাউন্ড অ্যালার্ট চালু করুন'}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-rose-500" />}
            </button>
          </div>

          {/* Mode Selector Tabs */}
          <div className="grid grid-cols-3 gap-2 mt-6 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
            <button
              onClick={() => handleSwitchMode('study')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                timerMode === 'study'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              পড়ার সময় (২৫ মি.)
            </button>
            <button
              onClick={() => handleSwitchMode('shortBreak')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                timerMode === 'shortBreak'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              সংক্ষিপ্ত বিরতি (৫ মি.)
            </button>
            <button
              onClick={() => handleSwitchMode('longBreak')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                timerMode === 'longBreak'
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              দীর্ঘ বিরতি (১৫ মি.)
            </button>
          </div>

          {/* Main Digital Clock Display */}
          <div className="my-8 text-center">
            <div className="text-6xl sm:text-7xl font-extrabold tracking-tight font-mono text-slate-900 dark:text-white">
              {formatTime(timeLeft)}
            </div>
            
            {/* Slim progress bar */}
            <div className="w-full max-w-md mx-auto mt-6 bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  timerMode === 'study'
                    ? 'bg-emerald-600'
                    : timerMode === 'shortBreak'
                    ? 'bg-blue-600'
                    : 'bg-purple-600'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-xs text-slate-400 mt-2">
              {progressPercent}% সম্পন্ন
            </div>
          </div>

          {/* Action Control Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-8 py-3.5 rounded-xl font-bold text-sm shadow-md flex items-center gap-2 transition-all transform active:scale-95 ${
                isRunning
                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5" />
                  <span>বিরতি দিন</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>শুরু করুন</span>
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="টাইমার রিসেট করুন"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {/* Session Counter */}
          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>আজকের সম্পন্ন সেশন:</span>
              <span className="font-bold text-slate-900 dark:text-white px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">
                {completedSessions} টি
              </span>
            </div>
            <span>প্রতি ৪ সেশন পর ১৫ মিনিট দীর্ঘ বিরতি নিন</span>
          </div>

        </div>

        {/* Right Column: Pre-Study Focus Checklist */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                পড়ার আগে ফোকাস চেকলিস্ট
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                মনোযোগ ১০০% ধরে রাখতে ৫টি প্রস্তুতি টিক দিন
              </p>
            </div>
          </div>

          <div className="space-y-3.5 mt-6">
            
            <label
              onClick={() => toggleChecklistItem('deskClean')}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                checklist.deskClean
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300'
              }`}
            >
              <input
                type="checkbox"
                checked={checklist.deskClean}
                onChange={() => {}}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <div className="text-xs leading-relaxed">
                <span className="font-semibold block">পড়ার টেবিল পরিষ্কার ও পরিপাটি</span>
                <span className="text-[11px] opacity-80">
                  টেবিলে কেবল যে বইটি পড়ব সেটি ছাড়া অন্য কোনো অপ্রয়োজনীয় খাতা বা খেলনা থাকবে না।
                </span>
              </div>
            </label>

            <label
              onClick={() => toggleChecklistItem('phoneSilent')}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                checklist.phoneSilent
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300'
              }`}
            >
              <input
                type="checkbox"
                checked={checklist.phoneSilent}
                onChange={() => {}}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <div className="text-xs leading-relaxed">
                <span className="font-semibold block">মোবাইলের নোটিফিকেশন সাইলেন্ট ও দূরে রাখা</span>
                <span className="text-[11px] opacity-80">
                  ফোন চোখের সীমানার বাইরে অন্য টেবিলে বা ব্যাগের ভেতরে রাখুন।
                </span>
              </div>
            </label>

            <label
              onClick={() => toggleChecklistItem('waterReady')}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                checklist.waterReady
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300'
              }`}
            >
              <input
                type="checkbox"
                checked={checklist.waterReady}
                onChange={() => {}}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <div className="text-xs leading-relaxed">
                <span className="font-semibold block">এক গ্লাস সুপেয় পানি টেবিলে রাখা</span>
                <span className="text-[11px] opacity-80">
                  মস্তিষ্কের কর্মক্ষমতার জন্য পর্যাপ্ত হাইড্রেশন অপরিহার্য।
                </span>
              </div>
            </label>

            <label
              onClick={() => toggleChecklistItem('singleTaskGoal')}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                checklist.singleTaskGoal
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300'
              }`}
            >
              <input
                type="checkbox"
                checked={checklist.singleTaskGoal}
                onChange={() => {}}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <div className="text-xs leading-relaxed">
                <span className="font-semibold block">নির্দিষ্ট একক লক্ষ্য (Single-Task Goal) নির্ধারণ</span>
                <span className="text-[11px] opacity-80">
                  "আজকের এই ২৫ মিনিটে পদার্থবিজ্ঞান অধ্যায় ৪-এর কেবল ৩টি অঙ্ক শেষ করব।"
                </span>
              </div>
            </label>

          </div>
        </div>

      </div>

      {/* Guide Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveGuideTab('all')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeGuideTab === 'all'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          সবগুলো নির্দেশিকা
        </button>

        <button
          onClick={() => setActiveGuideTab('focus')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeGuideTab === 'focus'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          মনোযোগ ধরে রাখার বিজ্ঞান
        </button>

        <button
          onClick={() => setActiveGuideTab('retention')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeGuideTab === 'retention'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          দ্রুত শেখা ও মনে রাখার কৌশল
        </button>

        <button
          onClick={() => setActiveGuideTab('exam')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeGuideTab === 'exam'
              ? 'bg-purple-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          পরীক্ষার ভয় দূরীকরণ
        </button>

        <button
          onClick={() => setActiveGuideTab('health')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeGuideTab === 'health'
              ? 'bg-amber-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          চোখের যত্ন ও দেহভঙ্গি
        </button>
      </div>

      {/* Structured Study Masterclass Cards */}
      <div className="space-y-8">
        
        {/* Module 1: মনোযোগ ধরে রাখা ও ডিস্ট্র্যাকশন প্রতিরোধ */}
        {(activeGuideTab === 'all' || activeGuideTab === 'focus') && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  ১. কেন পড়াশোনায় মনোযোগ নষ্ট হয় এবং কীভাবে তা প্রতিরোধ করবেন?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  ডোপামিন নিয়ন্ত্রণ ও গভীর মনোযোগের (Deep Focus) বৈজ্ঞানিক কলাকৌশল
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <div className="space-y-3 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center">১</span>
                  <span>'অদৃশ্য নোটিফিকেশন' পলিসি (ফোনকে আড়াল করা)</span>
                </h4>
                <p>
                  হার্ভার্ড বিশ্ববিদ্যালয়ের গবেষণায় দেখা গেছে, মোবাইল ফোন যদি আপনার টেবিলের ওপর সাইলেন্ট মোডেও রাখা থাকে, তবু
                  মস্তিষ্কের সাবকনশাস অংশ বারবার সেটির দিকে মনোযোগ দেয়। ফোনকে পড়ার টেবিল থেকে অন্তত ১০ ফুট দূরে অন্য ঘরে রেখে
                  পড়তে বসলে মনোযোগ তাৎক্ষণিকভাবে ৪০% বৃদ্ধি পায়।
                </p>
              </div>

              <div className="space-y-3 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center">২</span>
                  <span>২ মিনিটের জাদু রুল (The 2-Minute Rule)</span>
                </h4>
                <p>
                  পড়তে বসার সবচেয়ে কঠিন অংশ হলো শুরু করা। যখনই আলসেমি লাগবে, নিজেকে বলুন: "আমি মাত্র ২ মিনিট একটি প্যারাগ্রাফ
                  পড়ব, তারপর ইচ্ছা হলে উঠে যাব।" বিজ্ঞানের ভাষায় একে বলে 'ইনর্শিয়া ব্রেকিং'। একবার ২ মিনিট শুরু করলে মস্তিষ্ক
                  স্বভাবতই সেই পড়ায় নিমগ্ন হয়ে পড়ে এবং পরবর্তী ৩০ মিনিট সহজেই পড়া চালিয়ে নেওয়া যায়।
                </p>
              </div>

              <div className="space-y-3 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center">৩</span>
                  <span>ডিস্ট্র্যাকশন শিট মেথড (মন ঘুরে যাওয়ার প্রতিষেধক)</span>
                </h4>
                <p>
                  পড়ার মাঝে হঠাৎ বন্ধুদের কথা, কোনো গান বা ইউটিউব ভিডিওর চিন্তা মাথায় আসা স্বাভাবিক। পড়ার টেবিলের পাশে একটি সাদা
                  কাগজ রাখুন। অপ্রাসঙ্গিক কোনো চিন্তা এলেই তা কাগজে এক লাইনে লিখে রাখুন এবং নিজেকে বলুন—"পড়া শেষ করে এ নিয়ে ভাবব।"
                  এতে মস্তিষ্কের অস্থিরতা শান্ত হয়ে যাবে।
                </p>
              </div>

              <div className="space-y-3 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center">৪</span>
                  <span>বিছানায় নয়, সর্বদা সোজা হয়ে চেয়ার-টেবিলে বসা</span>
                </h4>
                <p>
                  বিছানা আমাদের মস্তিষ্ককে ঘুমের সিগন্যাল দেয়। শুয়ে বা হেলান দিয়ে পড়লে রক্তচাপ কমে আসে এবং ৩০ মিনিটের মধ্যে চোখের
                  পাতা ভারী হয়ে যায়। সর্বদা পিঠ সোজা রেখে ভালো আলোযুক্ত টেবিলে বসা ফোকাস বহুগুণ বাড়িয়ে দেয়।
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Module 2: দ্রুত শেখা ও আজীবন মনে রাখার বৈজ্ঞানিক কৌশল */}
        {(activeGuideTab === 'all' || activeGuideTab === 'retention') && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  ২. দ্রুত শেখা ও আজীবন মনে রাখার ৩টি বৈজ্ঞানিক পদ্ধতি
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  নোবেলজয়ী বিজ্ঞানীদের ব্যবহৃত আন্তর্জাতিক লার্নিং ফ্রেমওয়ার্ক
                </p>
              </div>
            </div>

            <div className="space-y-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              
              {/* Method A: Feynman Technique */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50/60 to-indigo-50/60 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-900/40">
                <div className="flex items-center gap-2 text-sm font-bold text-blue-900 dark:text-blue-300 mb-2">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>কৌশল ১: ফেইনম্যান টেকনিক (The Feynman Technique)</span>
                </div>
                <p className="mb-3 text-slate-700 dark:text-slate-300">
                  পদার্থবিজ্ঞানী রিচার্ড ফেইনম্যানের এই পদ্ধতি হলো জটিল ধারণাকে সহজ করার শ্রেষ্ঠ উপায়:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-[11px]">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-blue-100 dark:border-blue-900/50">
                    <span className="font-bold block text-blue-600 dark:text-blue-400 mb-1">ধাপ ১: টপিক নির্বাচন</span>
                    যে বিষয়টি বুঝতে চান তা খাতায় উপরে বড় করে লিখুন।
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-blue-100 dark:border-blue-900/50">
                    <span className="font-bold block text-blue-600 dark:text-blue-400 mb-1">ধাপ ২: শিশুকে বোঝান</span>
                    একটি ছোট বাচ্চাকে যেভাবে সহজ ভাষায় গল্প আকারে বোঝানো যায়, সেভাবে খসড়া করে লিখুন। কোনো কঠিন শব্দ ব্যবহার করবেন না।
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-blue-100 dark:border-blue-900/50">
                    <span className="font-bold block text-blue-600 dark:text-blue-400 mb-1">ধাপ ৩: দুর্বলতা চিহ্নিত</span>
                    বোঝাতে গিয়ে যেখানে হোঁচট খাচ্ছেন, বই খুলে মূল কনসেপ্টটি পুনরায় স্পষ্ট করে নিন।
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-blue-100 dark:border-blue-900/50">
                    <span className="font-bold block text-blue-600 dark:text-blue-400 mb-1">ধাপ ৪: উপমা ব্যবহার</span>
                    বাস্তব জীবনের কোনো মজাদার উপমা তৈরি করুন (যেমন: পরমাণুর নিউক্লিয়াসকে সূর্যের সাথে মেলানো)।
                  </div>
                </div>
              </div>

              {/* Method B: Active Recall */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50/60 to-teal-50/60 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-900/40">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-900 dark:text-emerald-300 mb-2">
                  <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>কৌশল ২: অ্যাক্টিভ রিকল (Active Recall - প্যাসিভ রিডিং বর্জন)</span>
                </div>
                <p className="mb-2 text-slate-700 dark:text-slate-300">
                  সাধারণ শিক্ষার্থীরা বারবার বইয়ের লাইনে চোখ বুলায় বা মার্কার দিয়ে দাগায়—বিজ্ঞানের ভাষায় এটি 'প্যাসিভ রিডিং' যা
                  স্মৃতিতে দীর্ঘস্থায়ী হয় না।
                </p>
                <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-emerald-100 dark:border-emerald-900/50 text-[11px] leading-relaxed">
                  <strong className="text-emerald-700 dark:text-emerald-300 block mb-1">সঠিক পদ্ধতি:</strong>
                  একটি পরিচ্ছেদ পড়ার পর সাথে সাথে বই বন্ধ করুন। এবার নিজেকে প্রশ্ন করুন—"এই পৃষ্ঠায় মূল ৩টি বিষয় কী ছিল?"
                  এরপর নিজের খাতায় পয়েন্টগুলো মুখস্থ না দেখে লিখে ফেলুন। মস্তিষ্ক যখন জোর খাটিয়ে স্মৃতি থেকে তথ্য বের করতে বাধ্য
                  হয়, তখন নিউরাল পথ চিরস্থায়ী রূপ নেয়।
                </div>
              </div>

              {/* Method C: Spaced Repetition */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-50/60 to-pink-50/60 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-200 dark:border-purple-900/40">
                <div className="flex items-center gap-2 text-sm font-bold text-purple-900 dark:text-purple-300 mb-2">
                  <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>কৌশল ৩: স্পেসড রিপিটেশন (Spaced Repetition - বিস্মৃতির বক্ররেখা জয়)</span>
                </div>
                <p className="mb-3 text-slate-700 dark:text-slate-300">
                  জার্মান মনস্তত্ত্ববিদ হারম্যান এবিংহসের 'ফরগেটিং কার্ভ' অনুযায়ী, নতুন কোনো পড়ার ৮০% আমরা ২৪ ঘণ্টার মধ্যে ভুলে যাই।
                  কিন্তু যদি নিচের নির্দিষ্ট বিরতিতে পুনরাবৃত্তি করা হয়, তবে তা আজীবন মনে থাকে:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-center">
                  <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-purple-100 dark:border-purple-900/40">
                    <div className="font-bold text-purple-600 dark:text-purple-400">১ম রিভিশন</div>
                    <div className="text-slate-500 mt-0.5">পড়ার ২৪ ঘণ্টার মধ্যে (১০ মি.)</div>
                  </div>
                  <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-purple-100 dark:border-purple-900/40">
                    <div className="font-bold text-purple-600 dark:text-purple-400">২য় রিভিশন</div>
                    <div className="text-slate-500 mt-0.5">৩য় দিনে (৫ মি.)</div>
                  </div>
                  <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-purple-100 dark:border-purple-900/40">
                    <div className="font-bold text-purple-600 dark:text-purple-400">৩য় রিভিশন</div>
                    <div className="text-slate-500 mt-0.5">৭ম দিনে (৩ মি.)</div>
                  </div>
                  <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-purple-100 dark:border-purple-900/40">
                    <div className="font-bold text-purple-600 dark:text-purple-400">৪র্থ রিভিশন</div>
                    <div className="text-slate-500 mt-0.5">৩০তম দিনে (এক ঝলক)</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Module 3: পরীক্ষার ভয় ও মানসিক চাপ নিয়ন্ত্রণ */}
        {(activeGuideTab === 'all' || activeGuideTab === 'exam') && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  ৩. পরীক্ষার ভয়, ব্ল্যাঙ্ক হয়ে যাওয়া ও মানসিক চাপ দূরীকরণ
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  পরীক্ষার হলে সর্বোচ্চ আত্মবিশ্বাস ও শান্ত মন ধরে রাখার কলাকৌশল
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                  বক্স ব্রিদিং (Box Breathing)
                </h4>
                <p>
                  পরীক্ষার হলে প্রশ্নপত্র পাওয়ার পর বুক ধড়ফড় করলে এই নেভি-সিল টেকনিক ব্যবহার করুন:
                  <br />
                  ১. ৪ সেকেন্ড ধরে নাক দিয়ে গভীর শ্বাস নিন।
                  <br />
                  ২. ৪ সেকেন্ড শ্বাস আটকে রাখুন।
                  <br />
                  ৩. ৪ সেকেন্ড ধরে মুখ দিয়ে ধীরে ধীরে শ্বাস ছাড়ুন।
                  <br />
                  ৪. ৪ সেকেন্ড খালি পেটে অপেক্ষা করুন।
                  <br />
                  মাত্র ৩ বার করলেই মস্তিষ্কে কর্টিসল (চাপের হরমোন) নেমে স্বাভাবিক হয়ে আসে।
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                  পরীক্ষার আগের রাতের ঘুম অপরিহার্য
                </h4>
                <p>
                  অনেকে সারা রাত জেগে পরীক্ষার সকালে যায়। এটি সবচেয়ে বড় ভুল। গবেষণায় প্রমাণিত যে রাতে যখন আমরা গভীর ঘুমে থাকি,
                  তখনই মস্তিষ্ক দিনের পড়াকে শর্ট-টার্ম মেমোরি থেকে লং-টার্ম মেমোরিতে সেভ করে। অন্তত ৭ ঘণ্টা না ঘুমালে পরীক্ষার
                  হলে জানা জিনিসও মনে পড়ে না।
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                  প্রশ্নপত্রের সহজ অংশ দিয়ে শুরু
                </h4>
                <p>
                  প্রশ্ন পাওয়ার পর প্রথম ৫ মিনিট সম্পূর্ণ প্রশ্নটি শান্তভাবে চোখ বুলিয়ে নিন। যে প্রশ্নটি আপনার সবচেয়ে ভালো জানা,
                  সবার আগে সেই উত্তরটি লিখুন। একটি সফল উত্তর লিখলেই আত্মবিশ্বাস লাফিয়ে বেড়ে যায় এবং ভয় পুরোপুরি উধাও হয়ে যায়।
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Module 4: শারীরিক সুস্থতা ও চোখের যত্ন */}
        {(activeGuideTab === 'all' || activeGuideTab === 'health') && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  ৪. পড়ার সময় চোখের যত্ন, সঠিক দেহভঙ্গি ও মস্তিষ্কের খাদ্য
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  ক্লান্তিমুক্তভাবে দীর্ঘক্ষণ সুস্থ দেহে পড়াশোনা করার স্বাস্থ্যবিধি
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                  ২০-২০-২০ চোখের আরাম নীতি
                </h4>
                <p>
                  বই বা স্ক্রিনে পড়ার সময় চোখের পলক পড়ার হার কমে যায়, যার ফলে চোখ লাল হয় ও মাথা ব্যথা করে। প্রতি ২০ মিনিট পড়ার
                  পর ২০ ফুট দূরের কোনো সবুজ গাছ বা দূরদিগন্তের দিকে ২০ সেকেন্ড অপলক তাকিয়ে থাকুন। এতে চোখের পেশির টান তাৎক্ষণিক
                  শিথিল হয়ে দৃষ্টিশক্তি সুস্থ থাকে।
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                  মস্তিষ্কের জ্বালানি: পানি ও সুষম খাদ্য
                </h4>
                <p>
                  আমাদের মানব মস্তিষ্কের প্রায় ৭৫-৮০% উপাদানই পানি। শরীরে মাত্র ২% পানির ঘাটতি হলেই মনোযোগ ও স্মৃতিশক্তি ২০%
                  হ্রাস পায়। তাই পড়ার সময় প্রতি ঘণ্টায় কয়েক চুমুক পানি পান করুন। অতিরিক্ত চিনিযুক্ত খাবার বা কোমল পানীয় পরিহার করে
                  ডিম, বাদাম, দুধ ও তাজা ফলমূল গ্রহণ করুন যা স্মৃতিশক্তি সতেজ রাখে।
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
