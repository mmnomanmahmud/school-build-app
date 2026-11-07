import React, { useState, useMemo } from 'react';
import { DICTIONARY_DATABASE, DictionaryWord } from '../data/dictionaryData';
import {
  BookA,
  Search,
  Volume2,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Filter,
  Lightbulb,
  FileText
} from 'lucide-react';

export const DictionarySection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedWord, setSelectedWord] = useState<DictionaryWord | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Audio Speech Synthesis for Word Pronunciation
  const handlePronounce = (text: string, lang: 'bn-BD' | 'en-US' = 'bn-BD') => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // Copy Definition
  const handleCopyDefinition = (word: DictionaryWord) => {
    const text = `${word.word} (${word.englishWord})\nউচ্চারণ: ${word.pronunciation}\nপদ: ${word.partOfSpeech}\nঅর্থ: ${word.banglaMeaning}\nEnglish: ${word.englishMeaning}\n\nব্যাখ্যা:\n${word.detailedExplanation}\n\nবাক্যে প্রয়োগ:\nবাংলা: ${word.exampleBangla}\nEnglish: ${word.exampleEnglish}\n\n[উৎস: School Build অভিধান]`;
    navigator.clipboard.writeText(text);
    setCopiedId(word.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Filtered words
  const filteredWords = useMemo(() => {
    return DICTIONARY_DATABASE.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inWord = item.word.toLowerCase().includes(q);
        const inEnglish = item.englishWord.toLowerCase().includes(q);
        const inBanglaMeaning = item.banglaMeaning.toLowerCase().includes(q);
        const inEnglishMeaning = item.englishMeaning.toLowerCase().includes(q);
        const inExplanation = item.detailedExplanation.toLowerCase().includes(q);
        const inSynonyms = item.synonyms.some((s) => s.toLowerCase().includes(q));

        if (!inWord && !inEnglish && !inBanglaMeaning && !inEnglishMeaning && !inExplanation && !inSynonyms) {
          return false;
        }
      }
      return true;
    });
  }, [searchQuery, selectedCategory]);

  const wordOfTheDay = DICTIONARY_DATABASE[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white p-8 sm:p-10 border border-indigo-900/40 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-4 backdrop-blur-sm">
            <BookA className="w-4 h-4 text-indigo-400" />
            <span>দ্বিভাষিক শব্দকোষ ও শিক্ষামূলক অভিধান</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            বাংলা ও ইংরেজি সকল শব্দের অর্থ, উচ্চারণ ও বিশদ ব্যাখ্যা
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            পাঠ্যবইয়ের জটিল বৈজ্ঞানিক পরিভাষা, ব্যাকরণ, ধ্রুপদী সাহিত্যের শব্দ এবং উচ্চশিক্ষার প্রয়োজনীয় ইংরেজি
            শব্দভাণ্ডারের পূর্ণাঙ্গ অভিধান। সার্চ করুন বাংলা বা ইংরেজিতে।
          </p>
        </div>
      </div>

      {/* Featured: Word of the Day */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/30 dark:border-emerald-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>আজকের নির্বাচিত শিক্ষণীয় শব্দ (Word of the Day)</span>
          </div>
          <div className="flex items-baseline gap-3">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {wordOfTheDay.word}
            </h3>
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              ({wordOfTheDay.englishWord})
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-medium">
              {wordOfTheDay.partOfSpeech}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
            {wordOfTheDay.banglaMeaning}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePronounce(wordOfTheDay.word, 'bn-BD')}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-sm"
          >
            <Volume2 className="w-4 h-4 text-emerald-500" />
            <span>উচ্চারণ শুনুন</span>
          </button>
          <button
            onClick={() => setSelectedWord(wordOfTheDay)}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5"
          >
            <span>সম্পূর্ণ ব্যাখ্যা দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="যেকোনো শব্দ লিখুন (যেমন: সালোকসংশ্লেষণ, মহাকর্ষ, সমাস, Resilience, Metaphor)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              মুছুন
            </button>
          )}
        </div>

        {/* Categories strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            সকল শব্দ ({DICTIONARY_DATABASE.length})
          </button>
          <button
            onClick={() => setSelectedCategory('science')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              selectedCategory === 'science'
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            বিজ্ঞান ও প্রযুক্তি
          </button>
          <button
            onClick={() => setSelectedCategory('math')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              selectedCategory === 'math'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            গণিত ও যুক্তিবিদ্যা
          </button>
          <button
            onClick={() => setSelectedCategory('literature')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              selectedCategory === 'literature'
                ? 'bg-purple-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            সাহিত্য ও ব্যাকরণ
          </button>
          <button
            onClick={() => setSelectedCategory('english')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              selectedCategory === 'english'
                ? 'bg-amber-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            ইংরেজি ও উচ্চশিক্ষা
          </button>
          <button
            onClick={() => setSelectedCategory('general')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              selectedCategory === 'general'
                ? 'bg-rose-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            ইতিহাস ও সমাজ
          </button>
        </div>

      </div>

      {/* Words Grid */}
      {filteredWords.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
          <BookA className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            অভিধানে কোনো শব্দ খুঁজে পাওয়া যায়নি
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            বানান পরীক্ষা করুন অথবা অন্য কোনো শব্দ দিয়ে অনুসন্ধান করুন।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWords.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedWord(item)}
              className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                    {item.categoryName}
                  </span>
                  <span>{item.partOfSpeech}</span>
                </div>

                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {item.word}
                  </h3>
                  <span className="text-xs font-semibold text-slate-500 font-mono">
                    {item.englishWord}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  উচ্চারণ: {item.pronunciation}
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                  {item.banglaMeaning}
                </p>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 italic line-clamp-1">
                  {item.englishMeaning}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold group-hover:underline flex items-center gap-1">
                  <span>বিস্তারিত ও উদাহরণ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePronounce(item.word);
                  }}
                  title="উচ্চারণ শুনুন"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Word Detail Modal */}
      {selectedWord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold">
                    {selectedWord.categoryName}
                  </span>
                  <span className="text-xs text-slate-500">
                    {selectedWord.partOfSpeech}
                  </span>
                </div>
                <div className="flex items-baseline gap-3">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                    {selectedWord.word}
                  </h2>
                  <span className="text-lg font-semibold text-slate-500">
                    ({selectedWord.englishWord})
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono mt-1">
                  উচ্চারণ: {selectedWord.pronunciation}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePronounce(selectedWord.word)}
                  title="উচ্চারণ শুনুন"
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <Volume2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </button>

                <button
                  onClick={() => handleCopyDefinition(selectedWord)}
                  title="সংজ্ঞা কপি করুন"
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {copiedId === selectedWord.id ? (
                    <Check className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>

                <button
                  onClick={() => setSelectedWord(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="space-y-6 mt-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              
              {/* Bengali & English Meaning */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-2">
                <div>
                  <span className="font-bold text-indigo-950 dark:text-indigo-200 block text-xs mb-0.5">
                    বাংলা অর্থ:
                  </span>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {selectedWord.banglaMeaning}
                  </p>
                </div>
                <div>
                  <span className="font-bold text-indigo-950 dark:text-indigo-200 block text-xs mb-0.5">
                    English Definition:
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                    {selectedWord.englishMeaning}
                  </p>
                </div>
              </div>

              {/* Detailed Explanation */}
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>অর্থের বিশদ ব্যাখ্যা ও প্রয়োগসূত্র:</span>
                </h4>
                <p className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs leading-relaxed">
                  {selectedWord.detailedExplanation}
                </p>
              </div>

              {/* Synonyms & Antonyms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-xs text-emerald-700 dark:text-emerald-400 block mb-2">
                    সমার্থক শব্দ (Synonyms):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedWord.synonyms.map((s, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-emerald-100/60 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-[11px]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-xs text-rose-700 dark:text-rose-400 block mb-2">
                    বিপরীত শব্দ (Antonyms):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedWord.antonyms.map((a, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-rose-100/60 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 text-[11px]"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Example Sentences */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
                <span className="font-bold text-xs text-slate-900 dark:text-white block mb-1">
                  বাক্যে প্রয়োগ (Example Sentences):
                </span>
                <div className="text-xs">
                  <strong className="text-slate-600 dark:text-slate-400">বাংলা: </strong>
                  <span>"{selectedWord.exampleBangla}"</span>
                </div>
                <div className="text-xs">
                  <strong className="text-slate-600 dark:text-slate-400">English: </strong>
                  <span className="italic">"{selectedWord.exampleEnglish}"</span>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedWord(null)}
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90"
              >
                বন্ধ করুন
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
