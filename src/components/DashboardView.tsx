import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Flame, 
  BookOpen, 
  Clock, 
  Target, 
  Trophy, 
  RefreshCw, 
  Download, 
  Trash2, 
  Smartphone, 
  Laptop, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  Check, 
  Copy, 
  FileText,
  Sliders,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BookmarkItem, OfflineDownloadedChapter } from '../types';

export const DashboardView: React.FC = () => {
  const { 
    user, 
    stories, 
    bookmarks, 
    openReader, 
    setSelectedBook,
    offlineChapters, 
    removeOfflineChapter, 
    offlineStorageSizeKb,
    syncStatus, 
    lastSyncedAt, 
    syncKey, 
    triggerSync, 
    exportUserDataJson,
    importUserDataJson,
    isOfflineMode,
    toggleOfflineMode,
    updateUserProfile
  } = useApp();

  const [copiedKey, setCopiedKey] = useState(false);
  const [importInput, setImportInput] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);
  const [dailyGoalInput, setDailyGoalInput] = useState(user?.dailyGoalChapters || 5);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(syncKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleExportBackup = () => {
    const jsonStr = exportUserDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kweng_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleApplyImport = () => {
    if (!importInput.trim()) return;
    const ok = importUserDataJson(importInput);
    if (ok) {
      alert('Data imported and synchronized successfully across devices!');
      setShowImportBox(false);
      setImportInput('');
    } else {
      alert('Invalid JSON format. Please paste a valid Kweng backup file.');
    }
  };

  // Continue reading stories
  const continueReadingList = (Object.values(bookmarks) as BookmarkItem[])
    .filter((b) => b.progressPercent > 0 || b.lastReadChapterId)
    .map((bm) => {
      const story = stories.find((s) => s.id === bm.storyId);
      return { bm, story };
    })
    .filter((item): item is { bm: BookmarkItem; story: NonNullable<typeof item.story> } => !!item.story);

  // Weekly dummy reading distribution
  const weeklyActivity = [
    { day: 'Mon', chapters: 6, height: '60%' },
    { day: 'Tue', chapters: 8, height: '80%' },
    { day: 'Wed', chapters: 4, height: '40%' },
    { day: 'Thu', chapters: 11, height: '95%' },
    { day: 'Fri', chapters: 7, height: '70%' },
    { day: 'Sat', chapters: 12, height: '100%' },
    { day: 'Sun', chapters: 5, height: '50%' },
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. Header Profile Banner & Level Tracker */}
      <div className="p-5 sm:p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                alt={user?.name}
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl object-cover ring-2 ring-indigo-500/30 shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded text-[10px] font-black uppercase bg-indigo-600 text-white shadow">
                Lv. {user?.level || 1}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  {user?.name || 'Fellow Reader'}
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-indigo-950/40 text-indigo-400 border border-indigo-800/40">
                  {user?.levelTitle || 'Monarch of Chapters'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Member since {user?.joinedDate || '2024'} • {user?.badges.length || 5} Badges Unlocked
              </p>
              
              {/* XP Progress Bar */}
              <div className="pt-2 w-48 sm:w-64 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                  <span>EXP: {user?.xp || 0} / {user?.nextLevelXp || 4000}</span>
                  <span className="text-indigo-400 font-bold">
                    {Math.round(((user?.xp || 0) / (user?.nextLevelXp || 4000)) * 100)}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{ width: `${Math.min(100, Math.round(((user?.xp || 0) / (user?.nextLevelXp || 4000)) * 100))}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick sync & offline status pill */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <button
              onClick={triggerSync}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
              <span>Sync All Devices</span>
            </button>
            <button
              onClick={toggleOfflineMode}
              className={`px-4 py-2 rounded-md text-xs font-semibold border transition-colors ${
                isOfflineMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              {isOfflineMode ? '⚡ Offline Active' : 'Go Offline'}
            </button>
          </div>

        </div>
      </div>

      {/* 2. Four High-Impact Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Chapters Read */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Chapters Read</span>
            <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white">
            {user?.chaptersReadCount || 384}
          </p>
          <p className="text-[10px] text-indigo-400 font-medium">
            +18 this week
          </p>
        </div>

        {/* Reading Streak */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Reading Streak</span>
            <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-400">
              <Flame className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-1.5">
            <span>{user?.readingStreakDays || 14}</span>
            <span className="text-sm text-amber-400 font-semibold">Days</span>
          </p>
          <p className="text-[10px] text-amber-400 font-medium">
            🔥 Keep your streak alive!
          </p>
        </div>

        {/* Total Time Read */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Reading Time</span>
            <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white">
            {((user?.readingTimeMinutes || 1840) / 60).toFixed(1)} <span className="text-xs font-normal text-slate-400">hrs</span>
          </p>
          <p className="text-[10px] text-indigo-400 font-medium">
            ~25 mins / daily average
          </p>
        </div>

        {/* Daily Chapter Target */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Daily Goal</span>
            <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-400">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl sm:text-3xl font-bold text-white">
              {user?.dailyGoalProgress || 3} / {user?.dailyGoalChapters || 5}
            </p>
            <span className="text-xs font-bold text-indigo-400">
              {Math.round(((user?.dailyGoalProgress || 3) / (user?.dailyGoalChapters || 5)) * 100)}%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-500"
              style={{ width: `${Math.min(100, Math.round(((user?.dailyGoalProgress || 3) / (user?.dailyGoalChapters || 5)) * 100))}%` }}
            />
          </div>
        </div>

      </div>

      {/* 3. Continue Reading Shelf */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center">
            <span className="w-1 h-5 bg-indigo-500 mr-2.5 rounded-full shrink-0"></span>
            Continue Reading
          </h2>
          <span className="text-xs text-slate-400">
            {continueReadingList.length} Active in Progress
          </span>
        </div>

        {continueReadingList.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs">
            No active reading sessions yet. Start reading any chapter to track your scroll position here!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {continueReadingList.map(({ bm, story }) => {
              const chapter = story.chapters.find((c) => c.id === bm.lastReadChapterId) || story.chapters[0];
              return (
                <div
                  key={story.id}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 shadow-md flex gap-3.5 items-center hover:border-indigo-500/40 transition-all"
                >
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-16 h-20 object-cover rounded-lg shadow flex-shrink-0 cursor-pointer bg-slate-800"
                    onClick={() => setSelectedBook(story)}
                  />
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <h4
                      onClick={() => setSelectedBook(story)}
                      className="text-xs font-bold text-white truncate hover:text-indigo-400 cursor-pointer"
                    >
                      {story.title}
                    </h4>
                    <p className="text-[11px] text-indigo-400 font-medium">
                      Chapter {bm.lastReadChapterNumber || 1} • {bm.progressPercent}% Read
                    </p>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-500"
                        style={{ width: `${bm.progressPercent}%` }}
                      />
                    </div>
                    <button
                      onClick={() => openReader(story, chapter)}
                      className="mt-1 text-[11px] font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded-md transition-colors flex items-center gap-1 shadow"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>Resume Chapter</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Reading Activity Visuals & Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Activity Bar Chart */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
                <span className="w-1 h-4 bg-indigo-500 mr-2 rounded-full"></span>
                Weekly Reading Activity
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Chapters completed past 7 days</p>
            </div>
            <span className="text-xs font-semibold text-indigo-400 bg-indigo-950/40 border border-indigo-800/40 px-2.5 py-1 rounded-md">
              53 Chapters Total
            </span>
          </div>

          <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2">
            {weeklyActivity.map((item) => (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                  {item.chapters}
                </span>
                <div className="w-full max-w-[36px] bg-slate-800 rounded-t-md overflow-hidden h-32 flex items-end">
                  <div
                    className="w-full bg-indigo-600 rounded-t-md transition-all duration-500 group-hover:bg-indigo-500"
                    style={{ height: item.height }}
                  />
                </div>
                <span className="text-xs font-medium text-slate-400 group-hover:text-white">
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Favorite Genres Distribution */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
            <span className="w-1 h-4 bg-indigo-500 mr-2 rounded-full"></span>
            Top Reading Genres
          </h3>
          <div className="space-y-3 pt-2">
            {[
              { genre: 'Action / Fantasy', percent: 45, color: 'bg-indigo-500' },
              { genre: 'Murim / Martial Arts', percent: 30, color: 'bg-indigo-600' },
              { genre: 'System & Reincarnation', percent: 15, color: 'bg-slate-600' },
              { genre: 'Romance & Mystery', percent: 10, color: 'bg-slate-700' },
            ].map((g) => (
              <div key={g.genre} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-300">{g.genre}</span>
                  <span className="text-slate-400 font-bold">{g.percent}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${g.color}`}
                    style={{ width: `${g.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 5. Secure Cross-Device Data Synchronization & Backup Center */}
      <div className="p-5 sm:p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Cross-Device Data Synchronization
              </h3>
              <p className="text-xs text-slate-400">
                Keep your reading progress, bookmarks, and settings in real-time sync across mobile, tablet, and PC.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-md text-xs font-semibold bg-indigo-950/40 text-indigo-400 border border-indigo-800/40 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              Status: {syncStatus === 'synced' ? 'Synchronized' : 'Syncing'}
            </span>
          </div>
        </div>

        {/* Sync Key Bar */}
        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-left w-full md:w-auto">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              Personal Device Sync Key
            </span>
            <div className="font-mono text-xs sm:text-sm font-bold text-indigo-400 bg-slate-900 px-3 py-1.5 rounded-md border border-slate-800">
              {syncKey}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={handleCopyKey}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
            >
              {copiedKey ? <Check className="w-3.5 h-3.5 text-indigo-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey ? 'Copied!' : 'Copy Key'}</span>
            </button>

            <button
              onClick={handleExportBackup}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Backup JSON</span>
            </button>

            <button
              onClick={() => setShowImportBox((prev) => !prev)}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Import Backup</span>
            </button>
          </div>
        </div>

        {/* Import JSON Box */}
        {showImportBox && (
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white">Paste Kweng Backup JSON from another device:</h4>
            <textarea
              value={importInput}
              onChange={(e) => setImportInput(e.target.value)}
              placeholder='Paste exported JSON string here...'
              rows={3}
              className="w-full p-3 rounded-md bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowImportBox(false)}
                className="px-3 py-1.5 rounded-md text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyImport}
                className="px-4 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow"
              >
                Apply & Sync
              </button>
            </div>
          </div>
        )}

        {/* Connected devices simulation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-3">
            <Laptop className="w-5 h-5 text-indigo-400" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">Current Desktop Web</p>
              <p className="text-[10px] text-indigo-400">Active Now • Synced</p>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-slate-500" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">Mobile PWA / Safari</p>
              <p className="text-[10px] text-slate-500">Synced 12 mins ago</p>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-3">
            <Laptop className="w-5 h-5 text-slate-500" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">Tablet E-Reader</p>
              <p className="text-[10px] text-slate-500">Synced 1 hour ago</p>
            </div>
          </div>
        </div>

      </div>

      {/* 6. Offline Storage & Downloaded Content Manager */}
      <div className="p-5 sm:p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Download className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                Offline Storage & Cached Chapters
              </h3>
              <p className="text-xs text-slate-400">
                Manage downloaded chapters stored locally in your browser for offline reading.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-300 bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700">
            Storage: {offlineStorageSizeKb} KB Used
          </span>
        </div>

        {Object.keys(offlineChapters).length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 bg-slate-950 rounded-lg">
            No offline chapters downloaded yet. You can download individual chapters or whole books by clicking the download icon on any chapter.
          </div>
        ) : (
          <div className="divide-y divide-slate-800 max-h-60 overflow-y-auto">
            {(Object.values(offlineChapters) as OfflineDownloadedChapter[]).map((dl) => (
              <div key={dl.chapterId} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={dl.storyCover} alt={dl.storyTitle} className="w-8 h-10 object-cover rounded shadow flex-shrink-0 bg-slate-800" />
                  <div className="truncate">
                    <p className="font-bold text-white truncate">{dl.storyTitle}</p>
                    <p className="text-[11px] text-slate-500">Chapter {dl.chapterNumber} • {dl.sizeKb} KB</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-800/40">Ready Offline</span>
                  <button
                    onClick={() => removeOfflineChapter(dl.chapterId)}
                    title="Remove from offline storage"
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
