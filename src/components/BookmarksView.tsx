import React, { useState } from 'react';
import { 
  Bookmark, 
  BookOpen, 
  Trash2, 
  FolderHeart, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Download, 
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BookmarkFolder, BookmarkItem } from '../types';

export const BookmarksView: React.FC = () => {
  const { 
    stories, 
    bookmarks, 
    toggleBookmark, 
    setSelectedBook, 
    openReader, 
    isChapterDownloaded,
    getDownloadedChaptersForBook,
    triggerSync,
    syncStatus,
    lastSyncedAt,
    setActiveTab
  } = useApp();

  const [activeFolder, setActiveFolder] = useState<string>('All');

  // Map stories that are in user's bookmarks
  const bookmarkList = Object.values(bookmarks) as BookmarkItem[];
  const bookmarkedStories = bookmarkList.map((bm: BookmarkItem) => {
    const story = stories.find((s) => s.id === bm.storyId);
    return {
      bookmark: bm,
      story
    };
  }).filter((item): item is { bookmark: BookmarkItem; story: NonNullable<typeof item.story> } => !!item.story);

  // Filter by folder
  const filteredList = bookmarkedStories.filter(({ bookmark, story }) => {
    if (activeFolder === 'All') return true;
    if (activeFolder === 'Offline') {
      return getDownloadedChaptersForBook(story.id).length > 0;
    }
    return bookmark.folder === activeFolder;
  });

  const folders: (BookmarkFolder | 'All' | 'Offline')[] = ['All', 'Reading', 'Plan to Read', 'Completed', 'On Hold', 'Offline'];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wider flex items-center">
            <span className="w-1 h-6 bg-indigo-500 mr-3 rounded-full shrink-0"></span>
            My Bookmarks
          </h1>
          <p className="text-xs text-slate-400 mt-1 pl-4">
            Track reading progress, saved series, and offline downloaded content across all your devices
          </p>
        </div>

        {/* Sync Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={triggerSync}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncStatus === 'syncing' ? 'animate-spin text-indigo-400' : ''}`} />
            <span>Sync Cloud ({lastSyncedAt})</span>
          </button>
        </div>
      </div>

      {/* Folders Tab Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        {folders.map((f) => {
          const count = bookmarkedStories.filter(({ bookmark, story }) => {
            if (f === 'All') return true;
            if (f === 'Offline') return getDownloadedChaptersForBook(story.id).length > 0;
            return bookmark.folder === f;
          }).length;

          return (
            <button
              key={f}
              onClick={() => setActiveFolder(f)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                activeFolder === f
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              <span>{f}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeFolder === f ? 'bg-slate-950/40 text-white' : 'bg-slate-700 text-slate-300'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredList.length === 0 ? (
        <div className="p-16 text-center rounded-xl bg-slate-900 border border-slate-800 shadow space-y-4">
          <FolderHeart className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">
            No bookmarks in "{activeFolder}"
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Browse our story catalog and hit the bookmark button on any title to save it to your reading collection.
          </p>
          <button
            onClick={() => setActiveTab('browse')}
            className="px-5 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white shadow transition-colors"
          >
            Explore Library
          </button>
        </div>
      ) : (
        /* Grid of Bookmarked Stories */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredList.map(({ bookmark, story }) => {
            const downloadedChapters = getDownloadedChaptersForBook(story.id);
            const lastChapterToRead = story.chapters.find((c) => c.id === bookmark.lastReadChapterId) || story.chapters[0];

            return (
              <div
                key={story.id}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 shadow-md flex gap-3.5 relative group hover:border-indigo-500/50 transition-all"
              >
                {/* Book Cover */}
                <div
                  onClick={() => setSelectedBook(story)}
                  className="w-24 sm:w-28 aspect-[3/4] rounded-lg overflow-hidden flex-shrink-0 cursor-pointer relative shadow bg-slate-800"
                >
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-950/80 text-slate-200 backdrop-blur-sm">
                    {bookmark.folder}
                  </div>
                  {downloadedChapters.length > 0 && (
                    <div className="absolute bottom-1 right-1 p-1 rounded bg-green-600 text-white shadow text-[9px]">
                      <Download className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>

                {/* Info & Progress */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h3
                        onClick={() => setSelectedBook(story)}
                        className="text-xs sm:text-sm font-bold text-white line-clamp-2 hover:text-indigo-400 cursor-pointer transition-colors"
                      >
                        {story.title}
                      </h3>
                      <button
                        onClick={() => toggleBookmark(story.id)}
                        title="Remove bookmark"
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-500 mt-1">
                      {story.genres[0]} • Total {story.totalChapters} Chs
                    </p>

                    {/* Progress bar */}
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                        <span>Progress: Ch. {bookmark.lastReadChapterNumber || 1}</span>
                        <span className="text-indigo-400 font-bold">{bookmark.progressPercent}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-indigo-500 transition-all duration-300"
                          style={{ width: `${Math.max(5, bookmark.progressPercent)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 pt-2 border-t border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (lastChapterToRead) {
                          openReader(story, lastChapterToRead);
                        } else {
                          setSelectedBook(story);
                        }
                      }}
                      className="flex-1 py-1.5 px-3 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Continue Ch. {bookmark.lastReadChapterNumber || 1}</span>
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
