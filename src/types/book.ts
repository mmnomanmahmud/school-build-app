export type BookCategory = 
  | 'textbook' // পাঠ্যবই
  | 'novel' // উপন্যাস
  | 'story' // গল্প ও কিশোর সাহিত্য
  | 'science' // বিজ্ঞান ও প্রযুক্তি
  | 'math' // গণিত ও অলিম্পিয়াড
  | 'gk' // সাধারণ জ্ঞান ও কুইজ
  | 'english' // ইংরেজি শিক্ষা
  | 'history' // ইতিহাস ও সংস্কৃতি
  | 'minority'; // ক্ষুদ্র নৃগোষ্ঠীর মাতৃভাষা ও সাহিত্য

export type SchoolClass = 
  | 'class_1'
  | 'class_2'
  | 'class_3'
  | 'class_4'
  | 'class_5'
  | 'class_6'
  | 'class_7'
  | 'class_8'
  | 'class_9_10'
  | 'class_11_12'
  | 'general';

export interface Chapter {
  id: string;
  title: string;
  subtitle?: string;
  content: string; // Detailed Bengali text content
  pageNumber?: number;
}

export interface Book {
  id: string;
  title: string;
  englishTitle?: string;
  author: string;
  category: BookCategory;
  categoryName: string;
  schoolClass?: SchoolClass;
  className?: string; // e.g. "৭ম শ্রেণী", "৯ম-১০ম শ্রেণী", "সাধারণ"
  description: string;
  coverImage?: string;
  coverBgColor?: string;
  publishedYear?: string;
  totalChapters: number;
  chapters: Chapter[];
  fileSizeEstimate: string; // e.g. "1.2 MB"
  rating: number;
  readersCount: number;
  tags: string[];
}

export interface DownloadedBookRecord {
  bookId: string;
  downloadedAt: number;
  bookData: Book;
  sizeBytes: number;
}

export interface ReadingProgress {
  bookId: string;
  currentChapterId: string;
  scrollPercentage: number;
  lastReadTimestamp: number;
  totalChapters: number;
  currentChapterIndex: number;
  completedChapterIds: string[];
  percentageCompleted: number;
}

export interface Bookmark {
  id: string;
  bookId: string;
  chapterId: string;
  chapterTitle: string;
  snippet: string;
  createdAt: number;
}

export interface ReaderNote {
  id: string;
  bookId: string;
  chapterId: string;
  text: string;
  selectedQuote?: string;
  createdAt: number;
}

export interface ReaderSettings {
  fontSize: number; // 14 to 28
  lineHeight: number; // 1.5 to 2.2
  theme: 'light' | 'sepia' | 'dark';
  fontFamily: 'bangla' | 'sans' | 'serif';
  autoScrollSpeed: number; // 0 = off, 1 to 5
}
