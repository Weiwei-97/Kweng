import React, { useState, useMemo } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Star, 
  Bookmark, 
  BookOpen, 
  Filter, 
  Sparkles,
  ArrowUpDown,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GENRES_LIST } from '../data/mockStories';
import { StoryType, StoryStatus } from '../types';

export const BrowseView: React.FC = () => {
  const { stories, setSelectedBook, openReader, toggleBookmark, isBookmarked } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'latest' | 'alphabetical'>('popular');

  // Filtered stories
  const filteredStories = useMemo(() => {
    return stories.filter((story) => {
      // Query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = story.title.toLowerCase().includes(query);
        const matchesAlt = story.alternativeTitle?.toLowerCase().includes(query);
        const matchesAuthor = story.author.toLowerCase().includes(query);
        if (!matchesTitle && !matchesAlt && !matchesAuthor) return false;
      }

      // Genre filter
      if (selectedGenre !== 'All' && !story.genres.includes(selectedGenre)) {
        return false;
      }

      // Type filter
      if (selectedType !== 'All' && story.type !== selectedType) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'All' && story.status !== selectedStatus) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'popular') return b.views - a.views;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'latest') return (b.chapters[0]?.number || 0) - (a.chapters[0]?.number || 0);
      if (sortBy === 'alphabetical') return a.title.localeCompare(b.title);
      return 0;
    });
  }, [stories, searchQuery, selectedGenre, selectedType, selectedStatus, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedGenre('All');
    setSelectedType('All');
    setSelectedStatus('All');
    setSortBy('popular');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wider flex items-center">
            <span className="w-1 h-6 bg-indigo-500 mr-3 rounded-full shrink-0"></span>
            Browse Story Library
          </h1>
          <p className="text-xs text-slate-400 mt-1 pl-4">
            Explore our curated index of action manhwa, story books, and fantasy web novels
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-indigo-400 bg-indigo-950/40 px-3 py-1.5 rounded-lg border border-indigo-800/40">
            {filteredStories.length} Titles Found
          </span>
          {(selectedGenre !== 'All' || selectedType !== 'All' || selectedStatus !== 'All' || searchQuery) && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-md bg-slate-800 border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar Container */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        
        {/* Row 1: Search & Sorting */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          {/* Search Box */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by title, alternative title, or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="relative">
            <ArrowUpDown className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full pl-10 pr-8 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none transition-colors"
            >
              <option value="popular">Sort: Most Popular</option>
              <option value="rating">Sort: Highest Rated</option>
              <option value="latest">Sort: Latest Chapters</option>
              <option value="alphabetical">Sort: Alphabetical (A-Z)</option>
            </select>
          </div>

        </div>

        {/* Row 2: Status & Type Pills */}
        <div className="flex flex-wrap items-center gap-4 text-xs pt-1 border-t border-slate-800">
          
          {/* Format Type */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium text-xs">Format:</span>
            <div className="flex flex-wrap gap-1">
              {['All', 'Manhwa', 'Web Novel', 'Story Book', 'Light Novel'].map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    selectedType === t
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium text-xs">Status:</span>
            <div className="flex gap-1">
              {['All', 'Ongoing', 'Completed'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedStatus(s)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    selectedStatus === s
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Row 3: Genres Scrollable Tags */}
        <div className="pt-1">
          <div className="flex items-center gap-2 text-xs mb-2 text-slate-400 font-medium">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <span>Filter by Genre:</span>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
            {GENRES_LIST.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-2.5 py-1 rounded-md text-xs transition-all ${
                  selectedGenre === genre
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700/60'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Grid of Stories */}
      {filteredStories.length === 0 ? (
        <div className="p-16 text-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 space-y-3">
          <Sparkles className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No stories match your criteria</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search keywords, clearing selected genres, or resetting your filter options.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="group rounded-xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-indigo-500/50 shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              {/* Cover Card */}
              <div
                onClick={() => setSelectedBook(story)}
                className="aspect-[3/4] w-full overflow-hidden relative cursor-pointer bg-slate-800"
              >
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Status & Type Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-950/80 text-slate-200 backdrop-blur-md">
                    {story.status}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-indigo-600/90 text-white shadow">
                    {story.type}
                  </span>
                </div>

                {/* Bookmark overlay icon */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(story.id);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-md bg-slate-950/70 text-slate-300 hover:text-indigo-400 backdrop-blur-sm transition-colors"
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isBookmarked(story.id) ? 'fill-indigo-400 text-indigo-400' : ''}`} />
                </button>

                {/* Rating at bottom */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-xs text-white">
                  <span className="flex items-center gap-1 bg-slate-950/70 px-1.5 py-0.5 rounded backdrop-blur-md font-bold text-amber-400 text-[10px]">
                    <Star className="w-3 h-3 fill-amber-400" /> {story.rating}
                  </span>
                  <span className="text-[10px] bg-slate-950/70 px-1.5 py-0.5 rounded text-slate-300">
                    Ch. {story.chapters[0]?.number || story.totalChapters}
                  </span>
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    onClick={() => setSelectedBook(story)}
                    className="text-xs font-bold text-white line-clamp-2 hover:text-indigo-400 cursor-pointer transition-colors"
                  >
                    {story.title}
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-1 truncate">
                    {story.genres.slice(0, 2).join(' • ')}
                  </p>
                </div>

                {/* Read Button */}
                <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => {
                      if (story.chapters[0]) {
                        openReader(story, story.chapters[0]);
                      } else {
                        setSelectedBook(story);
                      }
                    }}
                    className="w-full py-1.5 rounded-md bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read Latest</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
