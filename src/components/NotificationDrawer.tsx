import React from 'react';
import { 
  Bell, 
  CheckCheck, 
  Sparkles, 
  Clock, 
  ExternalLink, 
  Send,
  Sliders,
  Check,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NotificationDrawer: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    pushNotificationsEnabled, 
    togglePushNotifications, 
    requestPushNotifications,
    simulateNewChapterAlert,
    stories,
    setSelectedBook,
    openReader
  } = useApp();

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    markNotificationAsRead(notif.id);
    if (notif.storyId) {
      const foundStory = stories.find((s) => s.id === notif.storyId);
      if (foundStory) {
        if (notif.chapterId) {
          const foundChapter = foundStory.chapters.find((c) => c.id === notif.chapterId);
          if (foundChapter) {
            openReader(foundStory, foundChapter);
            onClose();
            return;
          }
        }
        setSelectedBook(foundStory);
        onClose();
      }
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
      {/* Header */}
      <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Notifications</h3>
          <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-indigo-950/40 text-indigo-400 border border-indigo-800/40">
            Real-time
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={markAllNotificationsAsRead}
            title="Mark all as read"
            className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Push Notification Controls & Test Bar */}
      <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-300 font-medium text-[11px]">Push Alerts:</span>
          <button
            onClick={() => {
              if (!pushNotificationsEnabled) {
                requestPushNotifications();
              } else {
                togglePushNotifications();
              }
            }}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
              pushNotificationsEnabled
                ? 'bg-indigo-950/50 text-indigo-400 border border-indigo-800/50'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            {pushNotificationsEnabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {/* Real-time simulation button */}
        <button
          onClick={simulateNewChapterAlert}
          title="Simulate incoming chapter release push"
          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-600/25 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/40 font-semibold transition-colors text-[11px]"
        >
          <Sparkles className="w-3 h-3" />
          <span>Simulate Drop</span>
        </button>
      </div>

      {/* Notification List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-800">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            No notifications right now. Click "Simulate Drop" to test new chapter push alerts!
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-3 flex items-start gap-3 cursor-pointer transition-colors ${
                notif.read
                  ? 'bg-transparent hover:bg-slate-800/40 opacity-75'
                  : 'bg-indigo-950/20 hover:bg-indigo-950/30'
              }`}
            >
              {notif.coverUrl ? (
                <img
                  src={notif.coverUrl}
                  alt="cover"
                  className="w-10 h-14 object-cover rounded-md shadow-md flex-shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-md bg-indigo-950/40 border border-indigo-800/40 flex items-center justify-center flex-shrink-0">
                  <Bell className="w-4 h-4 text-indigo-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-bold text-white truncate">
                    {notif.title}
                  </h4>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0"></span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                  {notif.message}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>{notif.timestamp}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
