import React from 'react';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  X, 
  Clock, 
  Layers, 
  Award, 
  Target, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { markNotificationRead, markAllNotificationsRead } from '../api';

export default function NotificationCenter({ notifications, unreadCount, onClose, onRefresh, onNavigate }) {
  const handleMarkRead = async (id, link) => {
    try {
      await markNotificationRead(id);
      onRefresh();
      if (link) {
        onClose();
        if (link.includes('application')) onNavigate('applications');
        else if (link.includes('roadmap')) onNavigate('roadmap');
        else if (link.includes('mentor') || link.includes('feedback')) onNavigate('progress');
        else if (link.includes('internship')) onNavigate('internships');
      }
    } catch (err) {
      console.error('Error marking notification read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      onRefresh();
    } catch (err) {
      console.error('Error marking all read:', err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'deadline': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'roadmap': return <Layers className="w-4 h-4 text-violet-500" />;
      case 'feedback': return <Award className="w-4 h-4 text-emerald-500" />;
      case 'report': return <Award className="w-4 h-4 text-indigo-500" />;
      case 'match': return <Target className="w-4 h-4 text-electric-500" />;
      default: return <Bell className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Notifications ({unreadCount} unread)
          </h4>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark All Read</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
        {notifications.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-400 italic">
            No notifications at the moment
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleMarkRead(item.id, item.link)}
              className={`p-4 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-start gap-3 ${
                !item.is_read ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                {getIcon(item.type)}
              </div>

              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h5 className={`font-bold ${!item.is_read ? 'text-indigo-950 dark:text-indigo-200' : 'text-slate-800 dark:text-slate-200'}`}>
                    {item.title}
                  </h5>
                  <span className="text-[10px] text-slate-400">{item.created_at}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                  {item.message}
                </p>
              </div>

              {!item.is_read && (
                <span className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0 mt-2" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
