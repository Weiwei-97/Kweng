import React, { useState } from 'react';
import { 
  Star, 
  Flame, 
  Clock, 
  Bookmark, 
  BookOpen, 
  ChevronRight, 
  TrendingUp, 
  Eye, 
  Sparkles, 
  Download, 
  Check, 
  Upload,
  MessageCircle,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StoryBook } from '../types';

export const HomeView: React.FC = () => {
  const { 
    stories, 
    setSelectedBook, 
    openReader, 
    toggleBookmark, 
    isBookmarked,
    isChapterDownloaded,
    downloadChapterForOffline,
    setIsImportModalOpen,
    isOfflineMode,
    getDownloadedChaptersForBook
  } = useApp();

  const [filterType, setFilterType] = useState<'All' | 'Manhwa' | 'Web Novel' | 'Story Book'>('All');
  const [rankingPeriod, setRankingPeriod] = useState<'today' | 'week' | 'all'>('today');

  // Featured story for hero spotlight
  const featuredStory = stories.find((s) => s.isFeatured) || stories[0];

  // Popular / Trending stories
  const trendingStories = stories.filter((s) => s.isTrending || s.isHot).slice(0, 5);

  // Latest updates list (filtered)
  const filteredStories = stories.filter((s) => {
    if (isOfflineMode) {
      // In offline mode, only show stories that have at least one downloaded chapter
      return getDownloadedChaptersForBook(s.id).length > 0;
    }
    if (filterType === 'All') return true;
    return s.type === filterType;
  });

  // Top Ranked Sidebar stories
  const rankedStories = [...stories].sort((a, b) => {
    if (rankingPeriod === 'today') return b.views - a.views;
    if (rankingPeriod === 'week') return b.bookmarksCount - a.bookmarksCount;
    return b.rating - a.rating;
  }).slice(0, 7);

  return (
    <div className="space-y-10">
      
      {/* Offline Mode Banner Notice if Active */}
      {isOfflineMode && (
        <div className="bg-amber-950/30 border border-amber-800/50 rounded-xl p-4 flex items-center justify-between text-amber-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center font-bold text-sm">
              ⚡
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-200">Offline Reading Mode Active</h4>
              <p className="text-[11px] text-amber-300/80">
                Viewing cached stories and downloaded chapters directly from browser storage.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded bg-green-900/30 text-green-400 border border-green-800/50">
            Offline Ready
          </span>
        </div>
      )}

      {/* 1. HERO SPOTLIGHT BANNER (Clean Minimalism Signature Showcase) */}
      {featuredStory && !isOfflineMode && (
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-900">
          {/* Background Art with Subtle Dark Gradient */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20 filter blur-md scale-105"
            style={{ backgroundImage: `url(${featuredStory.bannerImage || featuredStory.coverImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

          {/* Banner Content */}
          <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 sm:gap-8">
            {/* Cover art */}
            <div 
              onClick={() => setSelectedBook(featuredStory)}
              className="w-44 sm:w-52 aspect-[3/4] rounded-xl overflow-hidden shadow-2xl ring-1 ring-indigo-500/40 flex-shrink-0 cursor-pointer group relative"
            >
              <img
                src={featuredStory.coverImage}
                alt={featuredStory.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-black uppercase bg-indigo-600 text-white shadow">
                Featured
              </div>
            </div>

            {/* Metadata & CTAs */}
            <div className="flex-1 text-left space-y-3.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-900/30 text-indigo-300 border border-indigo-800/50 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-indigo-400" /> TRENDING NOW
                </span>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  {featuredStory.status}
                </span>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-800 text-indigo-400 border border-slate-700">
                  {featuredStory.type}
                </span>
              </div>

              <div>
                <h1 
                  onClick={() => setSelectedBook(featuredStory)}
                  className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight cursor-pointer hover:text-indigo-400 transition-colors"
                >
                  {featuredStory.title}
                </h1>
                {featuredStory.alternativeTitle && (
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    {featuredStory.alternativeTitle}
                  </p>
                )}
              </div>

              {/* Rating & Stats */}
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1 font-bold text-amber-400 bg-slate-800 px-2 py-1 rounded-md border border-slate-700">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {featuredStory.rating}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-slate-500" /> {(featuredStory.views / 1000000).toFixed(1)}M Views
                </span>
                <span className="flex items-center gap-1">
                  <Bookmark className="w-3.5 h-3.5 text-slate-500" /> {(featuredStory.bookmarksCount / 1000).toFixed(0)}k Bookmarks
                </span>
              </div>

              {/* Synopsis snippet */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3 max-w-3xl">
                {featuredStory.synopsis}
              </p>

              {/* Genre Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {featuredStory.genres.map((g) => (
                  <span key={g} className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                    {g}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {featuredStory.chapters[0] && (
                  <button
                    id="hero-read-latest-btn"
                    onClick={() => openReader(featuredStory, featuredStory.chapters[0])}
                    className="flex items-center gap-2 px-4 py-2 rounded-md font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read Latest (Ch. {featuredStory.chapters[0].number})</span>
                  </button>
                )}

                {featuredStory.chapters.length > 1 && (
                  <button
                    id="hero-read-first-btn"
                    onClick={() => openReader(featuredStory, featuredStory.chapters[featuredStory.chapters.length - 1])}
                    className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                  >
                    <span>Read Ch. 1</span>
                  </button>
                )}

                <button
                  id="hero-bookmark-btn"
                  onClick={() => toggleBookmark(featuredStory.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-xs border transition-colors ${
                    isBookmarked(featuredStory.id)
                      ? 'bg-indigo-900/30 text-indigo-400 border-indigo-800/50'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isBookmarked(featuredStory.id) ? 'fill-indigo-400' : ''}`} />
                  <span>{isBookmarked(featuredStory.id) ? 'Bookmarked' : 'Bookmark'}</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 2. POPULAR TODAY CAROUSEL */}
      {!isOfflineMode && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="w-1 h-6 bg-indigo-500 mr-3 rounded-full shrink-0"></span>
              <div>
                <h2 className="text-lg font-bold text-white uppercase tracking-wider">
                  Popular Today
                </h2>
                <p className="text-[11px] text-slate-500">Most read story books & manhwa across Kweng</p>
              </div>
            </div>
            <span 
              onClick={() => {}}
              className="text-xs text-indigo-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              Top Ranked <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {trendingStories.map((story, idx) => (
              <div
                key={story.id}
                onClick={() => setSelectedBook(story)}
                className="group relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 cursor-pointer shadow-md hover:border-indigo-500/50 transition-all duration-200 flex flex-col"
              >
                {/* Ranking Pill */}
                <div className="absolute top-2 left-2 z-10 w-5 h-5 rounded bg-indigo-600 font-extrabold text-[10px] text-white flex items-center justify-center shadow">
                  #{idx + 1}
                </div>

                {/* Cover with hover zoom */}
                <div className="aspect-[3/4] w-full overflow-hidden relative bg-slate-800">
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-white font-semibold">
                    <span className="flex items-center gap-1 bg-slate-950/70 px-1.5 py-0.5 rounded backdrop-blur-sm">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {story.rating}
                    </span>
                    <span className="bg-indigo-600/80 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold">
                      {story.type}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <h3 className="text-xs font-bold text-white line-clamp-2 group-hover:text-indigo-400 transition-colors">
                    {story.title}
                  </h3>
                  <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="text-indigo-400 font-medium">
                      Ch. {story.chapters[0]?.number || story.totalChapters}
                    </span>
                    <span>{story.chapters[0]?.releaseDate || 'Recent'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. TWO-COLUMN LAYOUT: LATEST RELEASES + SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: LATEST UPDATES (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Header & Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center">
              <span className="w-1 h-6 bg-slate-500 mr-3 rounded-full shrink-0"></span>
              <h2 className="text-lg font-bold text-white uppercase tracking-wider">
                {isOfflineMode ? 'Downloaded Offline Stories' : 'Recent Chapter Updates'}
              </h2>
            </div>

            {/* Type selector tabs */}
            {!isOfflineMode && (
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
                {(['All', 'Manhwa', 'Web Novel', 'Story Book'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                      filterType === t
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Stories Grid with Chapter Rows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredStories.map((story) => {
              const latestChapters = story.chapters.slice(0, 2);
              const downloadedCount = getDownloadedChaptersForBook(story.id).length;

              return (
                <div
                  key={story.id}
                  className="flex gap-3.5 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all shadow-md group relative"
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
                    {story.isHot && (
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-indigo-600 text-white shadow">
                        NEW
                      </span>
                    )}
                    {downloadedCount > 0 && (
                      <span className="absolute bottom-1 right-1 p-1 rounded bg-green-600 text-white shadow" title={`${downloadedCount} chapters downloaded offline`}>
                        <Download className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>

                  {/* Info & Chapter Links */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      {/* Title & Bookmark */}
                      <div className="flex items-start justify-between gap-1">
                        <h3
                          onClick={() => setSelectedBook(story)}
                          className="text-xs font-bold text-white line-clamp-2 hover:text-indigo-400 cursor-pointer transition-colors"
                        >
                          {story.title}
                        </h3>
                        <button
                          onClick={() => toggleBookmark(story.id)}
                          title="Bookmark"
                          className="p-1 text-slate-400 hover:text-indigo-400 transition-colors flex-shrink-0"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked(story.id) ? 'fill-indigo-400 text-indigo-400' : ''}`} />
                        </button>
                      </div>

                      {/* Genre & Rating */}
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                        <span className="text-amber-400 flex items-center gap-0.5 font-medium">
                          <Star className="w-3 h-3 fill-amber-400" /> {story.rating}
                        </span>
                        <span>•</span>
                        <span className="truncate">{story.genres[0]}</span>
                        <span>•</span>
                        <span>{story.type}</span>
                      </div>
                    </div>

                    {/* Chapter Quick Links */}
                    <div className="space-y-1 mt-2 pt-2 border-t border-slate-800">
                      {latestChapters.map((ch) => {
                        const isDownloaded = isChapterDownloaded(ch.id);
                        return (
                          <div
                            key={ch.id}
                            className="flex items-center justify-between text-xs py-1 px-2 rounded-md bg-slate-800/80 hover:bg-slate-700/80 group/ch cursor-pointer transition-colors"
                          >
                            <span 
                              onClick={() => openReader(story, ch)}
                              className="font-medium text-slate-300 group-hover/ch:text-indigo-400 truncate flex-1"
                            >
                              Chapter {ch.number}
                            </span>
                            
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 flex-shrink-0">
                              <span>{ch.releaseDate}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  downloadChapterForOffline(story, ch);
                                }}
                                title={isDownloaded ? "Saved offline" : "Download for offline reading"}
                                className={`p-1 rounded ${isDownloaded ? 'text-green-400' : 'text-slate-500 hover:text-indigo-400'}`}
                              >
                                {isDownloaded ? <Check className="w-3 h-3" /> : <Download className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {filteredStories.length === 0 && (
            <div className="p-12 text-center bg-slate-900 rounded-xl border border-slate-800 text-slate-400">
              <p>No story books found matching the selected filter.</p>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: SIDEBAR (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 1. TOP RANKED WIDGET */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-xs text-white uppercase tracking-wider">
                  Popular Rank
                </h3>
              </div>

              {/* Period Tabs: Today / Week / All */}
              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-md text-[11px] border border-slate-700">
                {(['today', 'week', 'all'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setRankingPeriod(p)}
                    className={`px-2 py-0.5 rounded capitalize font-medium ${
                      rankingPeriod === p
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Ranked stories list */}
            <div className="divide-y divide-slate-800 mt-2">
              {rankedStories.map((story, index) => (
                <div
                  key={story.id}
                  onClick={() => setSelectedBook(story)}
                  className="py-2.5 flex items-center gap-3 cursor-pointer group hover:bg-slate-800/60 px-1 rounded-lg transition-colors"
                >
                  {/* Rank Number */}
                  <span className={`w-5 text-center font-black text-xs flex-shrink-0 ${
                    index === 0 ? 'text-indigo-400 font-bold' :
                    index === 1 ? 'text-slate-300' :
                    index === 2 ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {index + 1}
                  </span>

                  {/* Thumbnail */}
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-9 h-12 object-cover rounded flex-shrink-0 shadow"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate group-hover:text-indigo-400 transition-colors">
                      {story.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {story.genres.slice(0, 2).join(', ')}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-indigo-400 font-medium mt-0.5">
                      <span>★ {story.rating}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-500">{(story.views / 1000).toFixed(0)}k views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. THIRD-PARTY CONTENT IMPORT CALLOUT */}
          <div className="rounded-xl p-4 bg-slate-900 border border-slate-800 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-indigo-400">
              <Upload className="w-4 h-4" />
              <h4 className="font-bold text-xs text-white uppercase tracking-wider">Import Stories</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Connect external RSS, web novel APIs, or custom JSON to seamlessly ingest stories into Kweng.
            </p>
            <button
              id="sidebar-import-btn"
              onClick={() => setIsImportModalOpen(true)}
              className="w-full py-2 px-3 rounded-md bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs text-white shadow transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Import Story or Novel</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 3. COMMUNITY & ONLINE READERS CARD */}
          <div className="rounded-xl p-4 bg-slate-900 border border-slate-800 shadow space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-indigo-400" />
                <h4 className="font-bold text-xs text-white uppercase tracking-wider">
                  Community
                </h4>
              </div>
              <span className="flex items-center gap-1.5 text-[10px] text-indigo-400 font-semibold bg-indigo-950/50 border border-indigo-800/40 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                18,420 Active
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Discuss raw chapter theories, translations, and character rankings with fellow readers.
            </p>
            <div className="pt-1">
              <button
                onClick={() => alert("Welcome to Kweng Community! Join the chapter discussion tabs inside any story.")}
                className="w-full py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors"
              >
                Open Reader Discussions
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
