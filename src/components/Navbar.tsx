import React, { useState } from 'react';
import { 
  BookOpen, 
  Bookmark, 
  Compass, 
  BookMarked, 
  LayoutDashboard, 
  Users, 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  User, 
  Menu, 
  X,
  Upload,
  SlidersHorizontal,
  Star,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NotificationDrawer } from './NotificationDrawer';

export const Navbar: React.FC = () => {
  const { 
    isDarkMode, 
    toggleDarkMode, 
    activeTab, 
    setActiveTab, 
    stories, 
    setSelectedBook, 
    openReader,
    user, 
    setIsAuthModalOpen, 
    setAuthMode,
    signOut,
    unreadNotificationCount,
    isOfflineMode,
    toggleOfflineMode,
    syncStatus,
    setIsSyncModalOpen,
    setIsImportModalOpen,
    offlineStorageSizeKb
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Filtered search results
  const searchResults = searchQuery.trim()
    ? stories.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase())) ||
          s.author.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSelectSearchResult = (story: typeof stories[0]) => {
    setSelectedBook(story);
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  const navLinks = [
    { id: 'home', label: 'Home', icon: BookOpen },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    { id: 'browse', label: 'Browse', icon: Compass },
    { id: 'ebooks', label: 'Ebooks', icon: BookMarked },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Community', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors duration-200 bg-slate-900/95 border-slate-800 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo - Clean Minimalism */}
          <div className="flex items-center gap-6">
            <button
              id="kweng-brand-logo-btn"
              onClick={() => { setActiveTab('home'); setSelectedBook(null); }}
              className="flex items-center gap-3 group cursor-pointer focus:outline-none"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/20 group-hover:bg-indigo-500 transition-colors">
                <span className="text-white font-black text-lg tracking-tighter">KW</span>
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-indigo-500 tracking-tighter">
                    KWENG
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                    Pro
                  </span>
                </div>
                <span className="text-[10px] tracking-widest uppercase font-medium text-slate-500 -mt-1">
                  Books & Web Novels
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    id={`nav-link-${link.id}`}
                    onClick={() => { setActiveTab(link.id as any); setSelectedBook(null); }}
                    className={`flex items-center gap-1.5 py-1 transition-colors ${
                      isActive
                        ? 'text-white border-b-2 border-indigo-500 font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Search Bar with Live Suggestions Dropdown */}
          <div className="flex-1 max-w-xs md:max-w-sm relative hidden md:block">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                id="kweng-search-input"
                type="text"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-full bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Search Dropdown Results */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden z-50">
                <div className="p-2.5 border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-between">
                  <span>Matching Books ({searchResults.length})</span>
                  <span className="text-indigo-400">Kweng Index</span>
                </div>
                <div className="divide-y divide-slate-800 max-h-80 overflow-y-auto">
                  {searchResults.map((story) => (
                    <div
                      key={story.id}
                      onMouseDown={() => handleSelectSearchResult(story)}
                      className="flex items-center gap-3 p-2.5 hover:bg-slate-800/80 cursor-pointer transition-colors"
                    >
                      <img
                        src={story.coverImage}
                        alt={story.title}
                        className="w-9 h-12 object-cover rounded shadow flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">
                          {story.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span className="text-indigo-400 font-medium flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-indigo-400" /> {story.rating}
                          </span>
                          <span>•</span>
                          <span>Ch. {story.chapters[0]?.number || story.totalChapters}</span>
                          <span>•</span>
                          <span className="truncate">{story.genres[0]}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Third-Party Content Import Button */}
            <button
              id="kweng-import-btn"
              onClick={() => setIsImportModalOpen(true)}
              title="Import Third-Party Content"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-indigo-400 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import</span>
            </button>

            {/* Offline Mode Status / Toggle */}
            <button
              id="kweng-offline-toggle-btn"
              onClick={toggleOfflineMode}
              title={isOfflineMode ? "Offline Mode active: Only downloaded books accessible" : "Online Mode active: Click to toggle offline preview"}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all border ${
                isOfflineMode
                  ? 'bg-amber-950/30 text-amber-400 border-amber-800/50'
                  : 'bg-green-900/30 text-green-400 border-green-800/50 hover:bg-green-900/40'
              }`}
            >
              {isOfflineMode ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Offline Mode</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-green-400" />
                  <span className="hidden sm:inline">Offline Ready</span>
                </>
              )}
            </button>

            {/* Cross-Device Sync Status Trigger */}
            <button
              id="kweng-device-sync-btn"
              onClick={() => setIsSyncModalOpen(true)}
              title={`Cloud Sync: ${syncStatus}. Click to manage sync.`}
              className="p-2 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors relative"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncStatus === 'syncing' ? 'animate-spin text-indigo-400' : ''}`} />
              {syncStatus === 'synced' && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              )}
            </button>

            {/* Notification Bell with Badge & Dropdown */}
            <div className="relative">
              <button
                id="kweng-notifications-btn"
                onClick={() => setIsNotifOpen((prev) => !prev)}
                title="Chapter Releases & Alerts"
                className="p-2 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors relative"
              >
                <Bell className="w-3.5 h-3.5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <NotificationDrawer onClose={() => setIsNotifOpen(false)} />
              )}
            </div>

            {/* Dark/Light Mode Switcher */}
            <button
              id="kweng-theme-toggle-btn"
              onClick={toggleDarkMode}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
              className="p-2 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-amber-400 transition-colors"
            >
              {isDarkMode ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
              )}
            </button>

            {/* User Profile / Auth Button */}
            {user ? (
              <div className="relative">
                <button
                  id="kweng-user-profile-btn"
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 p-1 rounded-md hover:bg-slate-800 transition-colors focus:outline-none"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-md object-cover ring-1 ring-indigo-500/50 shadow"
                  />
                  <div className="hidden xl:flex flex-col text-left">
                    <span className="text-xs font-semibold text-white leading-none">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-indigo-400 font-medium mt-0.5">
                      Lv. {user.level} {user.role}
                    </span>
                  </div>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 rounded-xl border border-slate-800 shadow-2xl p-2 z-50">
                    <div className="p-2 border-b border-slate-800">
                      <p className="text-xs font-bold text-white">{user.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                      <div className="mt-2 flex items-center justify-between text-[10px]">
                        <span className="text-indigo-400 font-semibold">{user.levelTitle}</span>
                        <span className="text-slate-400 font-medium">Lv. {user.level}</span>
                      </div>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => { setActiveTab('dashboard'); setIsUserMenuOpen(false); }}
                        className="w-full text-left px-3 py-2 text-xs font-medium rounded-md text-slate-300 hover:bg-slate-800 hover:text-indigo-400 flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        Reading Dashboard
                      </button>
                      <button
                        onClick={() => { setActiveTab('bookmarks'); setIsUserMenuOpen(false); }}
                        className="w-full text-left px-3 py-2 text-xs font-medium rounded-md text-slate-300 hover:bg-slate-800 hover:text-indigo-400 flex items-center gap-2"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        My Bookmarks ({Object.keys(useApp().bookmarks).length})
                      </button>
                      <button
                        onClick={() => { setIsSyncModalOpen(true); setIsUserMenuOpen(false); }}
                        className="w-full text-left px-3 py-2 text-xs font-medium rounded-md text-slate-300 hover:bg-slate-800 hover:text-indigo-400 flex items-center gap-2"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Device Sync & Backup
                      </button>
                    </div>
                    <div className="pt-1 border-t border-slate-800">
                      <button
                        onClick={() => { signOut(); setIsUserMenuOpen(false); }}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-md"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="kweng-signin-btn"
                  onClick={() => { setAuthMode('signin'); setIsAuthModalOpen(true); }}
                  className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Sign In
                </button>
                <button
                  id="kweng-signup-btn"
                  onClick={() => { setAuthMode('signup'); setIsAuthModalOpen(true); }}
                  className="text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2 rounded-md transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Hamburger Menu */}
            <button
              id="kweng-mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-2 rounded-md bg-slate-800 text-slate-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-900 px-4 py-4 space-y-3">
          {/* Mobile search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveTab(link.id as any);
                    setSelectedBook(null);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-md text-xs font-semibold ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                      : 'text-slate-300 bg-slate-800 hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <button
              onClick={() => { setIsImportModalOpen(true); setIsMobileMenuOpen(false); }}
              className="text-xs text-indigo-400 font-medium flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4" /> Import Content
            </button>
            <button
              onClick={() => { setIsSyncModalOpen(true); setIsMobileMenuOpen(false); }}
              className="text-xs text-slate-400 font-medium flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" /> Cloud Sync
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
