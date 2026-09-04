export type StoryStatus = 'Ongoing' | 'Completed' | 'Hiatus';
export type StoryType = 'Manhwa' | 'Story Book' | 'Web Novel' | 'Light Novel';

export interface Chapter {
  id: string;
  storyId: string;
  number: number;
  title: string;
  releaseDate: string; // ISO date string or relative
  readTimeMinutes?: number;
  wordCount?: number;
  // Content can be rich story text or panels/images
  content: string[]; // array of paragraphs or image panels
  likes?: number;
  views?: number;
}

export interface Review {
  id: string;
  storyId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userBadge?: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  likes: number;
  hasSpoiler?: boolean;
}

export interface Comment {
  id: string;
  chapterId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  comment: string;
  createdAt: string;
  likes: number;
}

export interface StoryBook {
  id: string;
  title: string;
  alternativeTitle?: string;
  slug: string;
  coverImage: string;
  bannerImage?: string;
  synopsis: string;
  author: string;
  artist?: string;
  rating: number; // e.g., 9.85
  ratingCount: number;
  genres: string[];
  status: StoryStatus;
  type: StoryType;
  releaseYear: number;
  totalChapters: number;
  views: number;
  bookmarksCount: number;
  isTrending?: boolean;
  isHot?: boolean;
  isFeatured?: boolean;
  ranking?: number;
  chapters: Chapter[];
  reviews: Review[];
  customImported?: boolean;
}

export type BookmarkFolder = 'Reading' | 'Plan to Read' | 'Completed' | 'On Hold';

export interface UserBookmark {
  storyId: string;
  folder: BookmarkFolder;
  lastReadChapterId?: string;
  lastReadChapterNumber?: number;
  progressPercent: number;
  updatedAt: string;
}

export type BookmarkItem = UserBookmark;

export interface OfflineDownloadedChapter {
  chapterId: string;
  storyId: string;
  storyTitle: string;
  storyCover: string;
  chapterNumber: number;
  chapterTitle: string;
  downloadedAt: string;
  content: string[];
  sizeKb: number;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  role: 'Reader' | 'VIP Reader' | 'Scholar' | 'Author';
  level: number;
  levelTitle: string;
  xp: number;
  nextLevelXp: number;
  chaptersReadCount: number;
  readingStreakDays: number;
  readingTimeMinutes: number;
  dailyGoalChapters: number;
  dailyGoalProgress: number;
  joinedDate: string;
  badges: string[];
  bio?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'chapter_release' | 'bookmark_update' | 'system' | 'social';
  storyId?: string;
  chapterId?: string;
  timestamp: string;
  read: boolean;
  coverUrl?: string;
}

export interface ReadingProgressRecord {
  storyId: string;
  chapterId: string;
  chapterNumber: number;
  storyTitle: string;
  storyCover: string;
  scrollPositionPercent: number;
  timestamp: string;
}
