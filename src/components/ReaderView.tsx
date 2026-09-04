import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  Download, 
  Settings, 
  Sun, 
  Moon, 
  Share2, 
  MessageSquare, 
  Send, 
  Check, 
  CheckCircle2, 
  Sliders,
  Type,
  Maximize,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { Comment } from '../types';

export const ReaderView: React.FC = () => {
  const { 
    readingChapter, 
    closeReader, 
    openReader, 
    toggleBookmark, 
    isBookmarked,
    isChapterDownloaded, 
    downloadChapterForOffline,
    updateReadingProgress,
    user
  } = useApp();

  if (!readingChapter) return null;

  const { book, chapter } = readingChapter;

  // Reader Customization settings
  const [fontSize, setFontSize] = useState<number>(18);
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif' | 'mono'>('sans');
  const [themeMode, setThemeMode] = useState<'dark-oled' | 'slate' | 'sepia' | 'light'>('dark-oled');
  const [showSettings, setShowSettings] = useState(false);
  const [readingMode, setReadingMode] = useState<'novel' | 'webtoon'>('novel');

  // Scroll Progress
  const [scrollProgress, setScrollProgress] = useState(0);

  // Chapter Comments
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 'c-1',
      chapterId: chapter.id,
      userId: 'u-99',
      userName: 'DemonSlayerX',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      comment: 'THE CHILLS! When he called out his shadow legion, that was peak fiction.',
      createdAt: '25 mins ago',
      likes: 42
    },
    {
      id: 'c-2',
      chapterId: chapter.id,
      userId: 'u-100',
      userName: 'AriaReading',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      comment: 'The translation on Kweng is so crisp compared to other aggregator sites. Thank you scan team!',
      createdAt: '1 hour ago',
      likes: 19
    }
  ]);

  const [newCommentText, setNewCommentText] = useState('');

  // Find next and prev chapter
  const sortedChapters = [...book.chapters].sort((a, b) => a.number - b.number);
  const currentIndex = sortedChapters.findIndex((c) => c.id === chapter.id);
  const prevChapter = currentIndex > 0 ? sortedChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < sortedChapters.length - 1 ? sortedChapters[currentIndex + 1] : null;

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const progress = Math.min(100, Math.round((scrollTop / docHeight) * 100));
        setScrollProgress(progress);
        updateReadingProgress(book.id, chapter.id, chapter.number, progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [book.id, chapter.id, chapter.number]);

  const handleNextChapter = () => {
    if (nextChapter) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      openReader(book, nextChapter);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.8 }
      });
    }
  };

  const handlePrevChapter = () => {
    if (prevChapter) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      openReader(book, prevChapter);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const created: Comment = {
      id: 'c-' + Date.now(),
      chapterId: chapter.id,
      userId: user?.id || 'guest',
      userName: user?.name || 'Fellow Reader',
      userAvatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      comment: newCommentText.trim(),
      createdAt: 'Just now',
      likes: 1
    };

    setComments((prev) => [created, ...prev]);
    setNewCommentText('');
  };

  // Theme color styles
  const themeStyles = {
    'dark-oled': 'bg-slate-950 text-slate-200 border-slate-800',
    'slate': 'bg-slate-900 text-slate-200 border-slate-800',
    'sepia': 'bg-[#f4ecd8] text-[#3c2f24] border-[#d9ceb2]',
    'light': 'bg-[#ffffff] text-[#1a1a1a] border-[#e5e7eb]'
  };

  const isDarkCanvas = themeMode === 'dark-oled' || themeMode === 'slate';
  const isSaved = isBookmarked(book.id);
  const isDownloaded = isChapterDownloaded(chapter.id);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${themeStyles[themeMode]}`}>
      
      {/* Scroll Progress Bar at very top */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-black/20">
        <div
          className="h-full bg-indigo-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Reader Sticky Header */}
      <header className={`sticky top-0 z-40 w-full border-b backdrop-blur-md px-4 py-2.5 flex items-center justify-between gap-4 ${
        isDarkCanvas ? 'bg-slate-950/95 border-slate-800' : 'bg-white/95 border-gray-200'
      }`}>
        
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={closeReader}
            className={`p-2 rounded-md transition-colors ${
              isDarkCanvas ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="truncate">
            <h2 className={`text-xs sm:text-sm font-bold truncate ${isDarkCanvas ? 'text-white' : 'text-gray-900'}`}>
              {book.title}
            </h2>
            <p className="text-[11px] text-indigo-400 font-semibold truncate">
              Chapter {chapter.number}: {chapter.title}
            </p>
          </div>
        </div>

        {/* Center: Chapter Quick Selector */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={handlePrevChapter}
            disabled={!prevChapter}
            className={`p-1.5 rounded-md border text-xs font-semibold flex items-center gap-1 disabled:opacity-30 disabled:pointer-events-none ${
              isDarkCanvas ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-100 border-gray-300 text-gray-800'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>

          <select
            value={chapter.id}
            onChange={(e) => {
              const target = book.chapters.find((c) => c.id === e.target.value);
              if (target) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                openReader(book, target);
              }
            }}
            className={`px-3 py-1.5 rounded-md border text-xs font-semibold cursor-pointer appearance-none ${
              isDarkCanvas ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-100 border-gray-300 text-gray-800'
            }`}
          >
            {sortedChapters.map((c) => (
              <option key={c.id} value={c.id}>
                Chapter {c.number}: {c.title.substring(0, 30)}
              </option>
            ))}
          </select>

          <button
            onClick={handleNextChapter}
            disabled={!nextChapter}
            className={`p-1.5 rounded-md border text-xs font-semibold flex items-center gap-1 disabled:opacity-30 disabled:pointer-events-none ${
              isDarkCanvas ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-100 border-gray-300 text-gray-800'
            }`}
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right Actions: Settings, Offline Download, Bookmark */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadChapterForOffline(book, chapter)}
            title={isDownloaded ? "Chapter saved offline" : "Download chapter for offline reading"}
            className={`p-2 rounded-md border text-xs font-medium transition-colors ${
              isDownloaded
                ? 'bg-indigo-950/40 text-indigo-400 border-indigo-800/40'
                : isDarkCanvas
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                : 'bg-gray-100 border-gray-300 text-gray-700'
            }`}
          >
            {isDownloaded ? <Check className="w-4 h-4 text-indigo-400" /> : <Download className="w-4 h-4" />}
          </button>

          <button
            onClick={() => toggleBookmark(book.id)}
            title="Bookmark this story"
            className={`p-2 rounded-md border text-xs font-medium transition-colors ${
              isSaved
                ? 'bg-indigo-950/40 text-indigo-400 border-indigo-800/40'
                : isDarkCanvas
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                : 'bg-gray-100 border-gray-300 text-gray-700'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-400 text-indigo-400' : ''}`} />
          </button>

          {/* Reader Settings Drawer Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowSettings((prev) => !prev)}
              className={`p-2 rounded-md border text-xs font-medium transition-colors ${
                showSettings
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : isDarkCanvas
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  : 'bg-gray-100 border-gray-300 text-gray-700'
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Settings Flyout */}
            {showSettings && (
              <div className="absolute right-0 mt-2 w-72 p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4 z-50 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-white uppercase tracking-wider text-[11px]">Reader Preferences</span>
                  <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                {/* Font Size */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-slate-300">
                    <span>Font Size</span>
                    <span className="font-bold text-indigo-400">{fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min={14}
                    max={26}
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                {/* Font Family */}
                <div className="space-y-1.5">
                  <span className="text-slate-300 block">Typography</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'sans', label: 'Modern' },
                      { id: 'serif', label: 'Book' },
                      { id: 'mono', label: 'Mono' }
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setFontFamily(f.id as any)}
                        className={`py-1 px-2 rounded-md font-medium border text-center text-xs ${
                          fontFamily === f.id
                            ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme Tint */}
                <div className="space-y-1.5">
                  <span className="text-slate-300 block">Color Theme</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'dark-oled', label: 'OLED', bg: 'bg-slate-950' },
                      { id: 'slate', label: 'Slate', bg: 'bg-slate-900' },
                      { id: 'sepia', label: 'Sepia', bg: 'bg-[#e8dcbe] text-stone-900' },
                      { id: 'light', label: 'Day', bg: 'bg-white text-gray-900' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setThemeMode(t.id as any)}
                        className={`py-1 px-1 rounded-md text-[10px] font-bold border ${t.bg} ${
                          themeMode === t.id ? 'ring-2 ring-indigo-500 border-indigo-500' : 'border-slate-700'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>

      </header>

      {/* Main Chapter Content Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
        
        {/* Chapter Title Heading */}
        <div className="text-center space-y-2 pb-6 border-b border-current/10">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
            {book.title}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Chapter {chapter.number}: {chapter.title}
          </h1>
          <div className="flex items-center justify-center gap-3 text-xs opacity-60">
            <span>{chapter.releaseDate}</span>
            <span>•</span>
            <span>{chapter.wordCount || 1350} words</span>
            <span>•</span>
            <span>~{chapter.readTimeMinutes || 5} min read</span>
          </div>
        </div>

        {/* Content Paragraphs with custom typography */}
        <article
          className={`space-y-6 leading-relaxed transition-all ${
            fontFamily === 'serif' ? 'font-serif' : fontFamily === 'mono' ? 'font-mono' : 'font-sans'
          }`}
          style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
        >
          {chapter.content.map((paragraph, idx) => (
            <p key={idx} className="tracking-normal">
              {paragraph}
            </p>
          ))}
        </article>

        {/* Chapter Completion Bar & Next Action */}
        <div className="pt-8 border-t border-current/10 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePrevChapter}
              disabled={!prevChapter}
              className="flex items-center gap-2 px-4 py-2 rounded-md border border-current/20 font-semibold text-xs hover:bg-current/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Chapter</span>
            </button>

            {nextChapter ? (
              <button
                onClick={handleNextChapter}
                className="flex items-center gap-2 px-5 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow transition-all hover:scale-105"
              >
                <span>Next Chapter {nextChapter.number}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-950/40 text-indigo-400 font-semibold text-xs border border-indigo-800/40">
                <CheckCircle2 className="w-4 h-4" />
                <span>You're caught up to latest!</span>
              </div>
            )}
          </div>
        </div>

        {/* Social Features: Chapter Discussion & Comments */}
        <section className="pt-10 border-t border-current/10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold">
                Chapter Discussion ({comments.length})
              </h3>
            </div>
            <span className="text-xs opacity-60">Join the reader community</span>
          </div>

          {/* New Comment Input Form */}
          <form onSubmit={handleAddComment} className="flex gap-3">
            <input
              type="text"
              placeholder="Leave a comment on Chapter..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="flex-1 px-4 py-2 rounded-md bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post</span>
            </button>
          </form>

          {/* Comments stream */}
          <div className="space-y-3">
            {comments.map((comm) => (
              <div
                key={comm.id}
                className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={comm.userAvatar} alt={comm.userName} className="w-6 h-6 rounded-md object-cover" />
                    <span className="font-bold text-white">{comm.userName}</span>
                  </div>
                  <span className="opacity-50 text-[10px]">{comm.createdAt}</span>
                </div>
                <p className="leading-relaxed opacity-90">{comm.comment}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

    </div>
  );
};
