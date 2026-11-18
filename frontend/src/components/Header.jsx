import React, { useState } from 'react';
import { 
  Bell, 
  Sun, 
  Moon, 
  Award, 
  Sparkles, 
  UserCheck, 
  Compass,
  ArrowRight
} from 'lucide-react';
import NotificationCenter from './NotificationCenter';

export default function Header({ 
  user, 
  currentView, 
  onQuickSwitchUser, 
  isDark, 
  toggleDark, 
  notifications, 
  unreadCount, 
  onRefreshNotifications, 
  onNavigate 
}) {
  const [showNotifications, setShowNotifications] = useState(false);

  const getPageTitle = (view) => {
    switch (view) {
      case 'overview': return 'Student Overview Dashboard';
      case 'profile': return 'Profile Management & Verified Skills';
      case 'resume': return 'AI Resume Analyzer & Parser';
      case 'internships': return 'Internship Discovery & Compatibility';
      case 'matching': return 'AI Matching Engine & Explainability';
      case 'skill-gap': return 'Skill Gap Matrix & Priority Analyzer';
      case 'roadmap': return 'Personalized 4-Week Skill Roadmap';
      case 'applications': return 'Internship Application Pipeline';
      case 'progress': return 'Sprint Progress & Weekly Reports';
      case 'analytics': return 'Career Readiness & Analytics';
      case 'mentor-overview': return 'Mentor Overview & Cohort Stats';
      case 'mentor-students': return 'Assigned Students Management';
      case 'mentor-reports': return 'Weekly Report Reviews & Rubrics';
      default: return 'Dashboard';
    }
  };

  return (
    <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
      <div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
          {getPageTitle(currentView)}
        </h2>
        <p className="text-[11px] text-slate-400 hidden sm:block">
          InternPath AI Career Intelligence Engine • Active Session
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Fast Persona Switcher for Hackathon Judges */}
        <div className="hidden lg:flex items-center gap-1.5 p-1 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-900">
          <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase px-2 flex items-center gap-1">
            <Award className="w-3 h-3 text-amber-500" />
            <span>Judge Switcher:</span>
          </span>
          <button
            onClick={() => onQuickSwitchUser('student@internpath.demo', 'Student123!')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-xl transition-all ${
              user?.email === 'student@internpath.demo'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-indigo-900 dark:text-indigo-200 hover:bg-indigo-100 dark:hover:bg-indigo-900'
            }`}
          >
            Student A (Web)
          </button>
          <button
            onClick={() => onQuickSwitchUser('student2@internpath.demo', 'Student123!')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-xl transition-all ${
              user?.email === 'student2@internpath.demo'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-indigo-900 dark:text-indigo-200 hover:bg-indigo-100 dark:hover:bg-indigo-900'
            }`}
          >
            Student B (AI)
          </button>
          <button
            onClick={() => onQuickSwitchUser('mentor@internpath.demo', 'Mentor123!')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-xl transition-all ${
              user?.email === 'mentor@internpath.demo'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-indigo-900 dark:text-indigo-200 hover:bg-indigo-100 dark:hover:bg-indigo-900'
            }`}
          >
            Mentor Lead
          </button>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleDark}
          className="p-2.5 rounded-2xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 transition-colors"
          title="Toggle Light/Dark Theme"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-2xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center border-2 border-white dark:border-slate-900">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <NotificationCenter
              notifications={notifications}
              unreadCount={unreadCount}
              onClose={() => setShowNotifications(false)}
              onRefresh={onRefreshNotifications}
              onNavigate={onNavigate}
            />
          )}
        </div>
      </div>
    </header>
  );
}
