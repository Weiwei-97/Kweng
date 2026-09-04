import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Bookmark, 
  BookOpen, 
  Download, 
  Share2, 
  Calendar, 
  Eye, 
  Check, 
  MessageSquare, 
  ThumbsUp, 
  ArrowDownUp, 
  Search,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StoryBook, Chapter, BookmarkFolder } from '../types';

export const BookDetailModal: React.FC = () => {
  const { 
    selectedBook, 
    setSelectedBook, 
    openReader, 
    toggleBookmark, 
    isBookmarked,
    bookmarks,
    isChapterDownloaded,
    downloadChapterForOffline,
    addReview,
    likeReview,
    user
  } = useApp();

  const [activeTab, setActiveTab] = useState<'chapters' | 'reviews'>('chapters');
  const [chapterSearch, setChapterSearch] = useState('');
  const [sortDesc, setSortDesc] = useState(true);

  // Review form state
  const [newRating, setNewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [hasSpoiler, setHasSpoiler] = useState(false);
  const [showReviewSuccess, setShowReviewSuccess] = useState(false);

  if (!selectedBook) return null;

  const currentBookmark = bookmarks[selectedBook.id];
  const isSaved = isBookmarked(selectedBook.id);

  // Filter and sort chapters
  const filteredChapters = selectedBook.chapters
    .filter((ch) => 
      chapterSearch ? ch.number.toString().includes(chapterSearch) || ch.title.toLowerCase().includes(chapterSearch.toLowerCase()) : true
    )
    .sort((a, b) => (sortDesc ? b.number - a.number : a.number - b.number));

  const handleDownloadAll = () => {
    selectedBook.chapters.forEach((ch) => {
      downloadChapterForOffline(selectedBook, ch);
    });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    addReview(selectedBook.id, newRating, reviewComment.trim());
    setReviewComment('');
    setShowReviewSuccess(true);
    setTimeout(() => setShowReviewSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Close button */}
        <button
          onClick={() => setSelectedBook(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-md bg-black/60 hover:bg-black/80 text-white hover:text-indigo-400 transition-colors backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Banner with blur */}
        <div className="relative h-44 sm:h-60 overflow-hidden flex-shrink-0">
          <img
            src={selectedBook.bannerImage || selectedBook.coverImage}
            alt="banner"
            className="w-full h-full object-cover filter blur-sm scale-105 opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
          
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-indigo-600 text-white shadow">
                {selectedBook.status}
              </span>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-slate-800 border border-slate-700 text-slate-200 shadow">
                {selectedBook.type}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white">
              <span className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 px-2.5 py-1 rounded-md backdrop-blur-sm font-semibold text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" /> {selectedBook.rating} ({selectedBook.ratingCount.toLocaleString()} votes)
              </span>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* Main Info Row */}
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Book Cover */}
            <div className="w-36 sm:w-44 aspect-[3/4] rounded-lg overflow-hidden shadow-2xl flex-shrink-0 -mt-16 sm:-mt-24 ring-4 ring-slate-900 relative z-10 bg-slate-800">
              <img
                src={selectedBook.coverImage}
                alt={selectedBook.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Title, Synopsis, Authors */}
            <div className="flex-1 min-w-0 space-y-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide leading-tight">
                  {selectedBook.title}
                </h2>
                {selectedBook.alternativeTitle && (
                  <p className="text-xs text-slate-400 mt-1 font-normal">
                    {selectedBook.alternativeTitle}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
                <span>Author: <strong className="text-white">{selectedBook.author}</strong></span>
                {selectedBook.artist && (
                  <span>Artist: <strong className="text-white">{selectedBook.artist}</strong></span>
                )}
                <span>Views: <strong className="text-indigo-400">{(selectedBook.views / 1000000).toFixed(2)}M</strong></span>
                <span>Bookmarks: <strong className="text-indigo-400">{selectedBook.bookmarksCount.toLocaleString()}</strong></span>
              </div>

              {/* Genre Chips */}
              <div className="flex flex-wrap gap-1.5">
                {selectedBook.genres.map((g) => (
                  <span key={g} className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-indigo-400 border border-slate-700/60">
                    {g}
                  </span>
                ))}
              </div>

              {/* Synopsis */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                {selectedBook.synopsis}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {selectedBook.chapters[0] && (
                  <button
                    onClick={() => {
                      openReader(selectedBook, selectedBook.chapters[0]);
                      setSelectedBook(null);
                    }}
                    className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow transition-all flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Read Latest (Ch. {selectedBook.chapters[0].number})</span>
                  </button>
                )}

                <button
                  onClick={() => toggleBookmark(selectedBook.id)}
                  className={`px-3.5 py-2 rounded-md font-medium text-xs border transition-colors flex items-center gap-2 ${
                    isSaved
                      ? 'bg-indigo-950/40 text-indigo-400 border-indigo-800/40'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-400' : ''}`} />
                  <span>{isSaved ? 'Bookmarked' : 'Add to Bookmark'}</span>
                </button>

                <button
                  onClick={handleDownloadAll}
                  className="px-3.5 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download All Chapters</span>
                </button>
              </div>

            </div>
          </div>

          {/* Navigation Tabs: Chapters vs Reviews */}
          <div className="border-b border-slate-800 flex items-center gap-6 text-sm font-semibold">
            <button
              onClick={() => setActiveTab('chapters')}
              className={`pb-2.5 border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'chapters'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <span>Chapters ({selectedBook.chapters.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-2.5 border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'reviews'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <span>Reviews & Ratings ({selectedBook.reviews.length})</span>
            </button>
          </div>

          {/* TAB 1: CHAPTERS LIST */}
          {activeTab === 'chapters' && (
            <div className="space-y-4">
              {/* Filter & Sorting Bar */}
              <div className="flex items-center justify-between gap-3">
                <div className="relative flex-1 max-w-xs">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search chapter..."
                    value={chapterSearch}
                    onChange={(e) => setChapterSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-md bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  onClick={() => setSortDesc((prev) => !prev)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  <ArrowDownUp className="w-3.5 h-3.5" />
                  <span>{sortDesc ? 'Newest First' : 'Oldest First'}</span>
                </button>
              </div>

              {/* Chapters List */}
              <div className="divide-y divide-slate-800 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden max-h-96 overflow-y-auto">
                {filteredChapters.map((ch) => {
                  const isDownloaded = isChapterDownloaded(ch.id);
                  const isLastRead = currentBookmark?.lastReadChapterId === ch.id;

                  return (
                    <div
                      key={ch.id}
                      className={`p-3 sm:p-3.5 flex items-center justify-between gap-3 hover:bg-slate-800/60 cursor-pointer transition-colors ${
                        isLastRead ? 'bg-indigo-950/25' : ''
                      }`}
                    >
                      <div 
                        onClick={() => {
                          openReader(selectedBook, ch);
                          setSelectedBook(null);
                        }}
                        className="flex-1 min-w-0"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white hover:text-indigo-400 transition-colors">
                            Chapter {ch.number}: {ch.title}
                          </span>
                          {isLastRead && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-600 text-white">
                              Last Read
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                          <span>{ch.releaseDate}</span>
                          {ch.readTimeMinutes && <span>• {ch.readTimeMinutes} min read</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadChapterForOffline(selectedBook, ch);
                          }}
                          title={isDownloaded ? "Downloaded for offline" : "Download chapter for offline reading"}
                          className={`p-2 rounded-md transition-colors ${
                            isDownloaded
                              ? 'bg-indigo-950/40 text-indigo-400 border border-indigo-800/40'
                              : 'bg-slate-800 text-slate-400 hover:text-indigo-400'
                          }`}
                        >
                          {isDownloaded ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => {
                            openReader(selectedBook, ch);
                            setSelectedBook(null);
                          }}
                          className="px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow"
                        >
                          Read
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: REVIEWS & RATINGS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              
              {/* Write Review Form */}
              <form onSubmit={handleSubmitReview} className="p-4 rounded-lg bg-slate-800/60 border border-slate-700/80 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Write Your Review for {selectedBook.title}
                </h4>

                {/* 5-star rating selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Your Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= newRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-amber-400 ml-1">
                    {newRating}.0 / 5.0
                  </span>
                </div>

                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your thoughts on the pacing, translation, art style, and character development..."
                  rows={3}
                  className="w-full p-3 rounded-md bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasSpoiler}
                      onChange={(e) => setHasSpoiler(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-indigo-500 focus:ring-0"
                    />
                    <span>Contains chapter spoilers</span>
                  </label>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow transition-colors"
                  >
                    Post Review
                  </button>
                </div>

                {showReviewSuccess && (
                  <p className="text-xs text-indigo-400 font-semibold animate-in fade-in">
                    ✓ Your review was posted successfully!
                  </p>
                )}
              </form>

              {/* Reviews List */}
              <div className="space-y-3">
                {selectedBook.reviews.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No reviews yet. Be the first to leave a review!
                  </div>
                ) : (
                  selectedBook.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-lg bg-slate-800/60 border border-slate-700/80 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={rev.userAvatar}
                            alt={rev.userName}
                            className="w-8 h-8 rounded-md object-cover ring-1 ring-indigo-500/40"
                          />
                          <div>
                            <span className="text-xs font-bold text-white block">{rev.userName}</span>
                            <span className="text-[10px] text-slate-400">{rev.createdAt}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{rev.rating}.0</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed pt-1">
                        "{rev.comment}"
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-750 text-[11px] text-slate-400">
                        <span className="text-indigo-400 font-medium">{rev.userBadge}</span>
                        <button
                          onClick={() => likeReview(selectedBook.id, rev.id)}
                          className="flex items-center gap-1 hover:text-indigo-400 transition-colors"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>Helpful ({rev.likes})</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
