import React from 'react';
import { BookCategory, SchoolClass } from '../types/book';
import { Search, X, SlidersHorizontal, BookOpen, GraduationCap, Sparkles } from 'lucide-react';

interface CategoryFilterProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedClass: SchoolClass | 'all';
  setSelectedClass: (cls: SchoolClass | 'all') => void;
  selectedCategory: BookCategory | 'all';
  setSelectedCategory: (cat: BookCategory | 'all') => void;
  totalResults: number;
}

const CLASS_OPTIONS: { id: SchoolClass | 'all'; label: string }[] = [
  { id: 'all', label: 'সব শ্রেণী' },
  { id: 'class_1', label: '১ম শ্রেণী' },
  { id: 'class_2', label: '২য় শ্রেণী' },
  { id: 'class_3', label: '৩য় শ্রেণী' },
  { id: 'class_4', label: '৪র্থ শ্রেণী' },
  { id: 'class_5', label: '৫ম শ্রেণী' },
  { id: 'class_6', label: '৬ষ্ঠ শ্রেণী' },
  { id: 'class_7', label: '৭ম শ্রেণী' },
  { id: 'class_8', label: '৮ম শ্রেণী' },
  { id: 'class_9_10', label: '৯ম-১০ম (SSC)' },
  { id: 'class_11_12', label: '১১শ-১২শ (HSC)' },
  { id: 'general', label: 'সাধারণ সাহিত্য' },
];

const CATEGORY_OPTIONS: { id: BookCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'সকল বই' },
  { id: 'textbook', label: 'সকল পাঠ্যবই' },
  { id: 'minority', label: 'ক্ষুদ্র নৃগোষ্ঠীর মাতৃভাষা' },
  { id: 'english', label: 'ইংরেজি' },
  { id: 'math', label: 'গণিত' },
  { id: 'science', label: 'বিজ্ঞান' },
  { id: 'novel', label: 'উপন্যাস' },
  { id: 'story', label: 'ছোটগল্প' },
  { id: 'gk', label: 'সাধারণ জ্ঞান' },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  searchQuery,
  setSearchQuery,
  selectedClass,
  setSelectedClass,
  selectedCategory,
  setSelectedCategory,
  totalResults,
}) => {
  return (
    <div className="space-y-4">
      {/* Search Input Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="বইয়ের নাম, লেখক, শ্রেণী বা বিষয়বস্তু খুঁজুন (যেমন: পদার্থবিজ্ঞান, পথের পাঁচালী, ৭ম শ্রেণী)..."
          className="w-full pl-10 pr-10 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Class Level Selector (Horizontal Scrolling Segmented Bar) */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0">
          <GraduationCap className="w-4 h-4 text-emerald-600" />
          <span>শ্রেণী নির্বাচন:</span>
        </span>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
          {CLASS_OPTIONS.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedClass(item.id)}
              className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedClass === item.id
                  ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills (Interactive segmented buttons with clear active state) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORY_OPTIONS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results Counter */}
        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          পাওয়া গেছে: <span className="font-bold text-slate-900 dark:text-white font-mono">{totalResults}</span> টি বই
        </div>
      </div>
    </div>
  );
};
