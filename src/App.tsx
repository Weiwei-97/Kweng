import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { NotificationDrawer } from './components/NotificationDrawer';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { BrowseView } from './components/BrowseView';
import { BookmarksView } from './components/BookmarksView';
import { EbooksView } from './components/EbooksView';
import { UsersView } from './components/UsersView';
import { DashboardView } from './components/DashboardView';
import { ReaderView } from './components/ReaderView';
import { BookDetailModal } from './components/BookDetailModal';
import { AuthModal } from './components/AuthModal';
import { ImportModal } from './components/ImportModal';
import { DeviceSyncModal } from './components/DeviceSyncModal';
import { WifiOff, AlertTriangle } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { 
    activeTab, 
    readingChapter, 
    isOfflineMode, 
    toggleOfflineMode 
  } = useApp();

  // If user is currently in immersive reading mode, show ReaderView
  if (readingChapter) {
    return <ReaderView />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* Offline Alert Banner if offline mode is toggled */}
      {isOfflineMode && (
        <div className="bg-amber-950/40 border-b border-amber-800/50 text-amber-300 px-4 py-2 text-xs flex items-center justify-between z-40">
          <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
            <WifiOff className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="font-semibold">
              Kweng Offline Reading Active — Only downloaded chapters and cached story books are currently accessible.
            </span>
            <button
              onClick={toggleOfflineMode}
              className="ml-auto underline text-xs font-bold hover:text-white transition-colors"
            >
              Resume Online
            </button>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar />

      {/* Dynamic Content Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'bookmarks' && <BookmarksView />}
        {activeTab === 'browse' && <BrowseView />}
        {activeTab === 'ebooks' && <EbooksView />}
        {activeTab === 'users' && <UsersView />}
        {activeTab === 'dashboard' && <DashboardView />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Slide-out & Modal Layers */}
      <NotificationDrawer />
      <BookDetailModal />
      <AuthModal />
      <ImportModal />
      <DeviceSyncModal />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
