import React from 'react';
import { BookOpen, ShieldCheck, Heart, Sparkles, MessageSquare, Twitter, Github } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <footer className="mt-16 border-t border-slate-800 bg-slate-900 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-600/20">
                KW
              </div>
              <span className="text-xl font-black text-white tracking-wider">
                KWENG
              </span>
              <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                Story Books & Novels
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-lg">
              Kweng is a minimalist reading portal for story books, light novels, and manhwa. Featuring offline caching, reading progress synchronization across devices, and instant chapter updates.
            </p>
            <div className="flex items-center gap-3 pt-2 text-[11px]">
              <span className="flex items-center gap-1.5 text-indigo-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> Secure Sync Active
              </span>
              <span className="text-slate-700">•</span>
              <span className="flex items-center gap-1.5 text-green-400 font-medium">
                <Sparkles className="w-3.5 h-3.5" /> Offline Ready
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">
              Navigation
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => setActiveTab('home')}
                  className="hover:text-white transition-colors"
                >
                  Home & Updates
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="hover:text-white transition-colors"
                >
                  Browse Library
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('bookmarks')}
                  className="hover:text-white transition-colors"
                >
                  My Bookmarks
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('ebooks')}
                  className="hover:text-white transition-colors"
                >
                  Ebooks & Novels
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="hover:text-white transition-colors"
                >
                  Reading Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Genres & Formats */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">
              Popular Tags
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {['Action', 'Fantasy', 'Murim', 'System', 'Reincarnation', 'Magic', 'Comedy', 'Cyberpunk', 'Romance'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTab('browse')}
                  className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-indigo-400 border border-slate-700 transition-colors text-[11px]"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Disclaimer & Copyright with Clean Minimalism status bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-500 uppercase tracking-widest">
          <div>&copy; 2026 KWENG BOOKS • ALL RIGHTS RESERVED</div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="flex items-center">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></span>
              API CONNECTED
            </span>
            <span className="flex items-center">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
              DEVICE SYNCED
            </span>
            <span className="flex items-center">
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full mr-2"></span>
              V2.4.0-STABLE
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
