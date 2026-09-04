import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  StoryBook, 
  Chapter, 
  UserBookmark, 
  OfflineDownloadedChapter, 
  UserProfile, 
  NotificationItem, 
  BookmarkFolder,
  Review
} from '../types';
import { INITIAL_STORIES, DEFAULT_USER } from '../data/mockStories';

interface AppContextType {
  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Active views / navigation
  activeTab: 'home' | 'browse' | 'bookmarks' | 'ebooks' | 'dashboard' | 'users';
  setActiveTab: (tab: 'home' | 'browse' | 'bookmarks' | 'ebooks' | 'dashboard' | 'users') => void;

  // Modal / Reader State
  selectedBook: StoryBook | null;
  setSelectedBook: (book: StoryBook | null) => void;
  readingChapter: { book: StoryBook; chapter: Chapter } | null;
  openReader: (book: StoryBook, chapter: Chapter) => void;
  closeReader: () => void;

  // Modals
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authMode: 'signin' | 'signup';
  setAuthMode: (mode: 'signin' | 'signup') => void;
  isImportModalOpen: boolean;
  setIsImportModalOpen: (open: boolean) => void;
  isSyncModalOpen: boolean;
  setIsSyncModalOpen: (open: boolean) => void;

  // Stories
  stories: StoryBook[];
  importStory: (newStory: StoryBook) => void;
  addReview: (storyId: string, rating: number, comment: string) => void;
  likeReview: (storyId: string, reviewId: string) => void;

  // User & Auth
  user: UserProfile | null;
  signIn: (email: string, name?: string) => void;
  signUp: (name: string, email: string, avatar?: string) => void;
  signOut: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;

  // Bookmarks & Progress
  bookmarks: Record<string, UserBookmark>;
  toggleBookmark: (storyId: string, folder?: BookmarkFolder) => void;
  updateReadingProgress: (storyId: string, chapterId: string, chapterNumber: number, progressPercent: number) => void;
  isBookmarked: (storyId: string) => boolean;

  // Offline Reading
  isOfflineMode: boolean;
  toggleOfflineMode: () => void;
  offlineChapters: Record<string, OfflineDownloadedChapter>; // key: chapterId
  downloadChapterForOffline: (book: StoryBook, chapter: Chapter) => void;
  removeOfflineChapter: (chapterId: string) => void;
  isChapterDownloaded: (chapterId: string) => boolean;
  getDownloadedChaptersForBook: (storyId: string) => OfflineDownloadedChapter[];
  offlineStorageSizeKb: number;

  // Push Notifications & Real-Time Alerts
  pushNotificationsEnabled: boolean;
  requestPushNotifications: () => Promise<boolean>;
  togglePushNotifications: () => void;
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  simulateNewChapterAlert: () => void;

  // Cross-device sync
  syncStatus: 'synced' | 'syncing' | 'offline';
  lastSyncedAt: string;
  syncKey: string;
  triggerSync: () => Promise<void>;
  exportUserDataJson: () => string;
  importUserDataJson: (jsonStr: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  THEME: 'kweng_theme',
  USER: 'kweng_user',
  STORIES: 'kweng_custom_stories',
  BOOKMARKS: 'kweng_bookmarks',
  OFFLINE: 'kweng_offline_chapters',
  NOTIFICATIONS: 'kweng_notifications',
  PUSH_ENABLED: 'kweng_push_enabled',
  SYNC_KEY: 'kweng_sync_key',
  LAST_SYNCED: 'kweng_last_synced',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME);
    return saved !== null ? saved === 'true' : true; // Default dark Asura-scans style
  });

  // Navigation
  const [activeTab, setActiveTab] = useState<'home' | 'browse' | 'bookmarks' | 'ebooks' | 'dashboard' | 'users'>('home');

  // Reader & Modal states
  const [selectedBook, setSelectedBook] = useState<StoryBook | null>(null);
  const [readingChapter, setReadingChapter] = useState<{ book: StoryBook; chapter: Chapter } | null>(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  // User state
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  // Stories
  const [stories, setStories] = useState<StoryBook[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.STORIES);
      const custom = saved ? JSON.parse(saved) : [];
      return [...INITIAL_STORIES, ...custom];
    } catch {
      return INITIAL_STORIES;
    }
  });

  // Bookmarks: storyId -> UserBookmark
  const [bookmarks, setBookmarks] = useState<Record<string, UserBookmark>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.BOOKMARKS);
      if (saved) return JSON.parse(saved);
      // default seed
      return {
        'story-1': {
          storyId: 'story-1',
          folder: 'Reading',
          lastReadChapterId: 'ch-1-128',
          lastReadChapterNumber: 128,
          progressPercent: 75,
          updatedAt: new Date().toISOString()
        },
        'story-2': {
          storyId: 'story-2',
          folder: 'Reading',
          lastReadChapterId: 'ch-2-142',
          lastReadChapterNumber: 142,
          progressPercent: 100,
          updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        'story-4': {
          storyId: 'story-4',
          folder: 'Plan to Read',
          progressPercent: 0,
          updatedAt: new Date(Date.now() - 86400000).toISOString()
        }
      };
    } catch {
      return {};
    }
  });

  // Offline downloaded chapters
  const [offlineChapters, setOfflineChapters] = useState<Record<string, OfflineDownloadedChapter>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.OFFLINE);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Push notifications
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState<boolean>(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.PUSH_ENABLED) === 'true';
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS);
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'notif-1',
          title: '🔥 New Chapter 128 Released!',
          message: 'Solo Resurrection Chapter 128 is now available to read on Kweng.',
          type: 'chapter_release',
          storyId: 'story-1',
          chapterId: 'ch-1-128',
          timestamp: '15 mins ago',
          read: false,
          coverUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=100&auto=format&fit=crop&q=80'
        },
        {
          id: 'notif-2',
          title: '⚔️ Chapter 142 Dropped!',
          message: 'Return of the Mount Hua Sword Saint Chapter 142: Plum Petals Scatter.',
          type: 'chapter_release',
          storyId: 'story-2',
          chapterId: 'ch-2-142',
          timestamp: '45 mins ago',
          read: false,
          coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=100&auto=format&fit=crop&q=80'
        },
        {
          id: 'notif-3',
          title: '☁️ Cloud Sync Active',
          message: 'Your reading bookmarks and progress synced across all authorized devices.',
          type: 'system',
          timestamp: '2 hours ago',
          read: true
        }
      ];
    } catch {
      return [];
    }
  });

  // Cross-device sync state
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');
  const [lastSyncedAt, setLastSyncedAt] = useState<string>(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_SYNCED) || 'Just now';
  });
  const [syncKey] = useState<string>(() => {
    const existing = localStorage.getItem(LOCAL_STORAGE_KEYS.SYNC_KEY);
    if (existing) return existing;
    const generated = 'KWENG-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    localStorage.setItem(LOCAL_STORAGE_KEYS.SYNC_KEY, generated);
    return generated;
  });

  // Sync dark mode class with HTML document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, String(isDarkMode));
  }, [isDarkMode]);

  // Persist User
  useEffect(() => {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
    }
  }, [user]);

  // Persist Bookmarks
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Persist Offline chapters
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.OFFLINE, JSON.stringify(offlineChapters));
  }, [offlineChapters]);

  // Persist Notifications
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  // Save push enabled
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PUSH_ENABLED, String(pushNotificationsEnabled));
  }, [pushNotificationsEnabled]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const toggleOfflineMode = () => {
    setIsOfflineMode((prev) => !prev);
  };

  // Reader launcher
  const openReader = (book: StoryBook, chapter: Chapter) => {
    setReadingChapter({ book, chapter });
    // Update progress
    updateReadingProgress(book.id, chapter.id, chapter.number, 10);
  };

  const closeReader = () => {
    setReadingChapter(null);
  };

  // Bookmarking
  const toggleBookmark = (storyId: string, folder: BookmarkFolder = 'Reading') => {
    setBookmarks((prev) => {
      const next = { ...prev };
      if (next[storyId]) {
        delete next[storyId];
      } else {
        next[storyId] = {
          storyId,
          folder,
          progressPercent: 0,
          updatedAt: new Date().toISOString()
        };
      }
      return next;
    });
  };

  const isBookmarked = useCallback((storyId: string) => {
    return !!bookmarks[storyId];
  }, [bookmarks]);

  // Update progress
  const updateReadingProgress = (storyId: string, chapterId: string, chapterNumber: number, progressPercent: number) => {
    setBookmarks((prev) => {
      const existing = prev[storyId] || {
        storyId,
        folder: 'Reading' as BookmarkFolder,
        progressPercent: 0,
        updatedAt: new Date().toISOString()
      };

      return {
        ...prev,
        [storyId]: {
          ...existing,
          lastReadChapterId: chapterId,
          lastReadChapterNumber: chapterNumber,
          progressPercent: Math.max(existing.progressPercent, progressPercent),
          updatedAt: new Date().toISOString()
        }
      };
    });

    // Update user stats
    if (user) {
      setUser((prev) => {
        if (!prev) return prev;
        const newXp = prev.xp + 20;
        const leveledUp = newXp >= prev.nextLevelXp;
        return {
          ...prev,
          chaptersReadCount: prev.chaptersReadCount + 1,
          readingTimeMinutes: prev.readingTimeMinutes + 5,
          dailyGoalProgress: Math.min(prev.dailyGoalChapters, prev.dailyGoalProgress + 1),
          xp: leveledUp ? newXp - prev.nextLevelXp : newXp,
          level: leveledUp ? prev.level + 1 : prev.level,
          nextLevelXp: leveledUp ? Math.round(prev.nextLevelXp * 1.25) : prev.nextLevelXp,
        };
      });
    }
  };

  // Offline capabilities
  const downloadChapterForOffline = (book: StoryBook, chapter: Chapter) => {
    const contentText = chapter.content.join(' ');
    const sizeKb = Math.max(12, Math.round(contentText.length / 1024));

    const downloadedItem: OfflineDownloadedChapter = {
      chapterId: chapter.id,
      storyId: book.id,
      storyTitle: book.title,
      storyCover: book.coverImage,
      chapterNumber: chapter.number,
      chapterTitle: chapter.title,
      downloadedAt: new Date().toLocaleDateString(),
      content: chapter.content,
      sizeKb
    };

    setOfflineChapters((prev) => ({
      ...prev,
      [chapter.id]: downloadedItem
    }));
  };

  const removeOfflineChapter = (chapterId: string) => {
    setOfflineChapters((prev) => {
      const next = { ...prev };
      delete next[chapterId];
      return next;
    });
  };

  const isChapterDownloaded = (chapterId: string) => {
    return !!offlineChapters[chapterId];
  };

  const getDownloadedChaptersForBook = (storyId: string) => {
    return (Object.values(offlineChapters) as OfflineDownloadedChapter[]).filter((item) => item.storyId === storyId);
  };

  const offlineStorageSizeKb = (Object.values(offlineChapters) as OfflineDownloadedChapter[]).reduce((sum, item) => sum + item.sizeKb, 0);

  // Push notification permissions & triggers
  const requestPushNotifications = async () => {
    try {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setPushNotificationsEnabled(true);
          return true;
        }
      }
      setPushNotificationsEnabled(true);
      return true;
    } catch {
      setPushNotificationsEnabled(true);
      return true;
    }
  };

  const togglePushNotifications = () => {
    setPushNotificationsEnabled((prev) => !prev);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const simulateNewChapterAlert = () => {
    const randomStory = stories[Math.floor(Math.random() * stories.length)];
    const nextChapterNum = (randomStory.chapters[0]?.number || 100) + 1;
    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: `⚡ Chapter ${nextChapterNum} Released!`,
      message: `${randomStory.title} Chapter ${nextChapterNum} is out now. Read the newest developments!`,
      type: 'chapter_release',
      storyId: randomStory.id,
      timestamp: 'Just now',
      read: false,
      coverUrl: randomStory.coverImage
    };

    setNotifications((prev) => [newNotif, ...prev]);

    // Show native browser notification if granted
    if (pushNotificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`Kweng - ${randomStory.title}`, {
          body: `Chapter ${nextChapterNum} is now available to read!`,
          icon: randomStory.coverImage
        });
      } catch {
        // Safe fallback in iframe
      }
    }
  };

  // Cross-device sync
  const triggerSync = async () => {
    setSyncStatus('syncing');
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSyncStatus('synced');
    const now = 'Just now';
    setLastSyncedAt(now);
    localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_SYNCED, now);
  };

  const exportUserDataJson = () => {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      user,
      bookmarks,
      notifications
    };
    return JSON.stringify(backup, null, 2);
  };

  const importUserDataJson = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.bookmarks) {
        setBookmarks((prev) => ({ ...prev, ...parsed.bookmarks }));
      }
      if (parsed.user) {
        setUser((prev) => ({ ...prev, ...parsed.user }));
      }
      triggerSync();
      return true;
    } catch {
      return false;
    }
  };

  // Third-party content import
  const importStory = (newStory: StoryBook) => {
    setStories((prev) => {
      const updated = [newStory, ...prev];
      // Save custom ones
      const customOnes = updated.filter((s) => s.customImported);
      localStorage.setItem(LOCAL_STORAGE_KEYS.STORIES, JSON.stringify(customOnes));
      return updated;
    });
  };

  // Reviews & Comments
  const addReview = (storyId: string, rating: number, commentText: string) => {
    const newReview: Review = {
      id: 'rev-' + Date.now(),
      storyId,
      userId: user?.id || 'guest',
      userName: user?.name || 'Fellow Reader',
      userAvatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      userBadge: user?.role || 'Reader',
      rating,
      comment: commentText,
      createdAt: 'Just now',
      likes: 1
    };

    setStories((prev) =>
      prev.map((story) => {
        if (story.id === storyId) {
          const updatedReviews = [newReview, ...story.reviews];
          const newRatingCount = story.ratingCount + 1;
          const newRating = Number(((story.rating * story.ratingCount + rating * 2) / newRatingCount).toFixed(2));
          return {
            ...story,
            reviews: updatedReviews,
            ratingCount: newRatingCount,
            rating: Math.min(10, newRating)
          };
        }
        return story;
      })
    );
  };

  const likeReview = (storyId: string, reviewId: string) => {
    setStories((prev) =>
      prev.map((story) => {
        if (story.id === storyId) {
          return {
            ...story,
            reviews: story.reviews.map((r) => (r.id === reviewId ? { ...r, likes: r.likes + 1 } : r))
          };
        }
        return story;
      })
    );
  };

  // User auth actions
  const signIn = (email: string, name?: string) => {
    const newUser: UserProfile = {
      ...DEFAULT_USER,
      email,
      name: name || email.split('@')[0],
      username: email.split('@')[0].toLowerCase()
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
  };

  const signUp = (name: string, email: string, avatar?: string) => {
    const newUser: UserProfile = {
      ...DEFAULT_USER,
      name,
      email,
      username: name.toLowerCase().replace(/\s+/g, '_'),
      avatar: avatar || DEFAULT_USER.avatar,
      level: 1,
      levelTitle: 'Novice Reader',
      xp: 0,
      nextLevelXp: 100,
      chaptersReadCount: 0,
      readingStreakDays: 1,
      readingTimeMinutes: 0,
      badges: ['New Recruit']
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
  };

  const signOut = () => {
    setUser(null);
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        activeTab,
        setActiveTab,
        selectedBook,
        setSelectedBook,
        readingChapter,
        openReader,
        closeReader,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        isImportModalOpen,
        setIsImportModalOpen,
        isSyncModalOpen,
        setIsSyncModalOpen,
        stories,
        importStory,
        addReview,
        likeReview,
        user,
        signIn,
        signUp,
        signOut,
        updateUserProfile,
        bookmarks,
        toggleBookmark,
        updateReadingProgress,
        isBookmarked,
        isOfflineMode,
        toggleOfflineMode,
        offlineChapters,
        downloadChapterForOffline,
        removeOfflineChapter,
        isChapterDownloaded,
        getDownloadedChaptersForBook,
        offlineStorageSizeKb,
        pushNotificationsEnabled,
        requestPushNotifications,
        togglePushNotifications,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        simulateNewChapterAlert,
        syncStatus,
        lastSyncedAt,
        syncKey,
        triggerSync,
        exportUserDataJson,
        importUserDataJson
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
