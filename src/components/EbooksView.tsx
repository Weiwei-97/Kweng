import React, { useState } from 'react';
import { 
  BookMarked, 
  BookOpen, 
  Download, 
  Sparkles, 
  Check, 
  Clock, 
  FileText, 
  Star,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const EbooksView: React.FC = () => {
  const { stories, setSelectedBook, openReader, isChapterDownloaded, downloadChapterForOffline } = useApp();

  // Filter only story books and web novels
  const ebookStories = stories.filter((s) => s.type === 'Story Book' || s.type === 'Web Novel' || s.type === 'Light Novel');

  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  const handleDownloadFullEbook = (story: typeof stories[0]) => {
    // Download all chapters of the ebook for offline reading
    story.chapters.forEach((ch) => {
      downloadChapterForOffline(story, ch);
    });
    setDownloadSuccessId(story.id);
    setTimeout(() => setDownloadSuccessId(null), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wider flex items-center">
            <span className="w-1 h-6 bg-indigo-500 mr-3 rounded-full shrink-0"></span>
            Ebooks & Story Books
          </h1>
          <p className="text-xs text-slate-400 mt-1 pl-4">
            Complete story books, web novels, and light novels formatted for rich typography & offline reading
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-indigo-950/40 text-indigo-400 border border-indigo-800/40 font-semibold">
            {ebookStories.length} E-Books Available
          </span>
        </div>
      </div>

      {/* Hero Ebook Highlights Banner */}
      <div className="p-5 sm:p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Kweng Ebook Reader Engine</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Offline Novel Reading & Custom Typography
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Switch effortlessly between dark OLED, warm sepia, and daylight modes with adjustable font sizes, line heights, and margin controls. Download entire novel volumes for uninterrupted offline reading.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="px-3 py-1.5 rounded-md bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300">
            ⚡ Instant Offline Caching
          </span>
        </div>
      </div>

      {/* Ebooks Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ebookStories.map((story) => {
          const totalWords = story.chapters.reduce((acc, c) => acc + (c.wordCount || 1200), 0) * 15;
          const readTimeHours = Math.max(2, Math.round(totalWords / 15000));
          const isDownloaded = downloadSuccessId === story.id;

          return (
            <div
              key={story.id}
              className="p-4 sm:p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-md flex flex-col sm:flex-row gap-5 hover:border-indigo-500/40 transition-all"
            >
              {/* Book Cover */}
              <div 
                onClick={() => setSelectedBook(story)}
                className="w-full sm:w-36 aspect-[3/4] rounded-lg overflow-hidden flex-shrink-0 cursor-pointer shadow relative group bg-slate-800"
              >
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-indigo-600 text-white shadow">
                  {story.type}
                </div>
              </div>

              {/* Info & Metadata */}
              <div className="flex-1 min-w-0 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      onClick={() => setSelectedBook(story)}
                      className="text-sm font-bold text-white line-clamp-2 hover:text-indigo-400 cursor-pointer transition-colors"
                    >
                      {story.title}
                    </h3>
                  </div>

                  <p className="text-xs text-indigo-400 font-medium mt-1">
                    By {story.author}
                  </p>

                  <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    {story.synopsis}
                  </p>

                  {/* Novel Specs */}
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800 text-center">
                    <div className="p-1.5 rounded-md bg-slate-800 border border-slate-700/60">
                      <span className="block text-[10px] text-slate-400">Chapters</span>
                      <span className="text-xs font-bold text-white">
                        {story.totalChapters}
                      </span>
                    </div>
                    <div className="p-1.5 rounded-md bg-slate-800 border border-slate-700/60">
                      <span className="block text-[10px] text-slate-400">Est. Reading</span>
                      <span className="text-xs font-bold text-white">
                        ~{readTimeHours}h
                      </span>
                    </div>
                    <div className="p-1.5 rounded-md bg-slate-800 border border-slate-700/60">
                      <span className="block text-[10px] text-slate-400">Rating</span>
                      <span className="text-xs font-bold text-amber-400 flex items-center justify-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400" /> {story.rating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      if (story.chapters[0]) {
                        openReader(story, story.chapters[0]);
                      } else {
                        setSelectedBook(story);
                      }
                    }}
                    className="flex-1 py-1.5 px-3 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read Book</span>
                  </button>

                  <button
                    onClick={() => handleDownloadFullEbook(story)}
                    title="Download entire book for offline reading"
                    className={`py-1.5 px-3 rounded-md border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                      isDownloaded
                        ? 'bg-indigo-950/50 text-indigo-400 border-indigo-800/50'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                    }`}
                  >
                    {isDownloaded ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
