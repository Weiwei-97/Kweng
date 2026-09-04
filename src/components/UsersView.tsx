import React, { useState } from 'react';
import { 
  Users, 
  Trophy, 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  Award, 
  Sparkles, 
  BookOpen, 
  Flame, 
  ShieldCheck 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const UsersView: React.FC = () => {
  const { user, stories, setSelectedBook, likeReview } = useApp();

  // Mock community readers
  const communityUsers = [
    {
      id: 'u-1',
      name: 'Sung Jin-Woo',
      username: 'shadow_monarch',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      level: 24,
      levelTitle: 'Monarch of Chapters',
      chaptersRead: 890,
      streak: 42,
      badge: 'Mythic Reader',
      favoriteGenre: 'Action / Fantasy'
    },
    {
      id: 'u-2',
      name: 'Chung Myung',
      username: 'plum_saint',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      level: 21,
      levelTitle: 'Sword Venerable',
      chaptersRead: 742,
      streak: 35,
      badge: 'Grandmaster',
      favoriteGenre: 'Murim'
    },
    {
      id: 'u-3',
      name: 'Rosaline Heliodor',
      username: 'royal_archivist',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      level: 19,
      levelTitle: 'Grand Chronicler',
      chaptersRead: 615,
      streak: 28,
      badge: 'Scholar Prime',
      favoriteGenre: 'Story Books & Mystery'
    },
    {
      id: 'u-4',
      name: 'Ethan Vance',
      username: 'chrono_mage',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      level: 16,
      levelTitle: 'Archmage',
      chaptersRead: 490,
      streak: 19,
      badge: 'Spell Weaver',
      favoriteGenre: 'Magic & Sci-Fi'
    },
    {
      id: 'u-5',
      name: 'Lucas Traumen',
      username: 'frey_blake',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      level: 15,
      levelTitle: 'Circle Master',
      chaptersRead: 410,
      streak: 14,
      badge: 'Elder Sage',
      favoriteGenre: 'Fantasy'
    }
  ];

  // Collect all community reviews from stories
  const allReviews = stories.flatMap((s) =>
    s.reviews.map((r) => ({
      ...r,
      storyTitle: s.title,
      storyCover: s.coverImage,
      storyId: s.id
    }))
  );

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wider flex items-center">
            <span className="w-1 h-6 bg-indigo-500 mr-3 rounded-full shrink-0"></span>
            Kweng Community & Users
          </h1>
          <p className="text-xs text-slate-400 mt-1 pl-4">
            Connect with fellow webtoon lovers, share reviews, and climb the reader leaderboard
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-indigo-950/40 text-indigo-400 border border-indigo-800/40 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
            18,420 Readers Online
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 7 cols: Leaderboard */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h2 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                Weekly Reader Leaderboard
              </h2>
            </div>
            <span className="text-xs text-slate-400">Updates every Sunday midnight</span>
          </div>

          <div className="rounded-xl bg-slate-900 border border-slate-800 shadow-md overflow-hidden divide-y divide-slate-800">
            {communityUsers.map((u, idx) => (
              <div
                key={u.id}
                className="p-3.5 sm:p-4 flex items-center gap-3 sm:gap-4 hover:bg-slate-800/50 transition-colors"
              >
                {/* Rank Badge */}
                <div className={`w-7 text-center font-bold text-sm sm:text-base flex-shrink-0 ${
                  idx === 0 ? 'text-amber-400 text-lg' :
                  idx === 1 ? 'text-slate-300' :
                  idx === 2 ? 'text-amber-600' : 'text-slate-500'
                }`}>
                  #{idx + 1}
                </div>

                {/* Avatar */}
                <img
                  src={u.avatar}
                  alt={u.name}
                  className="w-10 h-10 rounded-lg object-cover ring-1 ring-slate-700 shadow flex-shrink-0"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-white truncate">
                      {u.name}
                    </h3>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-indigo-950/40 text-indigo-400 border border-indigo-800/40 flex-shrink-0">
                      Lv. {u.level}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    {u.levelTitle} • Fav: {u.favoriteGenre}
                  </p>
                </div>

                {/* Stats */}
                <div className="text-right flex-shrink-0">
                  <span className="text-xs sm:text-sm font-bold text-white block">
                    {u.chaptersRead} Chs
                  </span>
                  <span className="text-[10px] text-amber-400 font-medium flex items-center justify-end gap-0.5">
                    <Flame className="w-3 h-3 fill-amber-400" /> {u.streak}d streak
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 cols: Community Reviews Stream */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
              <h2 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                Latest Reviews & Critiques
              </h2>
            </div>
            <span className="text-xs text-slate-400">{allReviews.length} Reviews</span>
          </div>

          <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
            {allReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-3"
              >
                {/* Header with reviewer & story */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={rev.userAvatar}
                      alt={rev.userName}
                      className="w-8 h-8 rounded-md object-cover ring-1 ring-indigo-500/30"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        {rev.userName}
                      </h4>
                      <span className="text-[10px] text-slate-400">{rev.createdAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{rev.rating}.0</span>
                  </div>
                </div>

                {/* Target Story */}
                <div
                  onClick={() => {
                    const found = stories.find((s) => s.id === rev.storyId);
                    if (found) setSelectedBook(found);
                  }}
                  className="flex items-center gap-2 p-1.5 rounded-md bg-slate-800 border border-slate-700/60 hover:border-indigo-500/40 cursor-pointer transition-colors"
                >
                  <img src={rev.storyCover} alt="cover" className="w-6 h-8 object-cover rounded shadow flex-shrink-0" />
                  <span className="text-[11px] font-semibold text-indigo-400 truncate flex-1">
                    {rev.storyTitle}
                  </span>
                </div>

                {/* Comment Text */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  "{rev.comment}"
                </p>

                {/* Helpful count */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                  <span className="text-indigo-400 font-medium">{rev.userBadge}</span>
                  <button
                    onClick={() => likeReview(rev.storyId, rev.id)}
                    className="flex items-center gap-1 hover:text-indigo-400 transition-colors"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>Helpful ({rev.likes})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
