import React from 'react';
import { 
  Compass, 
  LayoutDashboard, 
  User, 
  FileText, 
  Search, 
  Target, 
  GitCompare, 
  Layers, 
  Briefcase, 
  CheckSquare, 
  TrendingUp, 
  LogOut,
  Award,
  Users,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ currentView, onNavigate, user, onLogout }) {
  const isMentor = user?.role === 'mentor';

  const studentNav = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'profile', label: 'My Profile', icon: User },
    { key: 'resume', label: 'Resume Analyzer', icon: FileText },
    { key: 'internships', label: 'Find Internships', icon: Search },
    { key: 'matching', label: 'Matching Engine', icon: Target },
    { key: 'skill-gap', label: 'Skill Gap Analysis', icon: GitCompare },
    { key: 'roadmap', label: 'Learning Roadmap', icon: Layers },
    { key: 'applications', label: 'My Applications', icon: Briefcase },
    { key: 'progress', label: 'Internship Progress', icon: CheckSquare },
    { key: 'analytics', label: 'Career Analytics', icon: TrendingUp },
  ];

  const mentorNav = [
    { key: 'mentor-overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'mentor-students', label: 'Assigned Students', icon: Users },
    { key: 'mentor-reports', label: 'Weekly Reports', icon: FileText },
  ];

  const navItems = isMentor ? mentorNav : studentNav;

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200/90 dark:border-slate-800 flex flex-col justify-between flex-shrink-0 transition-colors">
      <div>
        {/* Brand */}
        <div className="h-20 px-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-electric-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-indigo-700 to-electric-600 dark:from-indigo-400 dark:to-electric-400 bg-clip-text text-transparent">
              InternPath <span className="text-indigo-500">AI</span>
            </span>
            <span className="block text-[9px] uppercase tracking-wider font-semibold text-slate-400">
              {isMentor ? 'Mentor Intelligence' : 'Student Portal'}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = currentView === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 mb-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-xs flex-shrink-0">
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>
          <div className="overflow-hidden">
            <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.name}</h5>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize block truncate">
              {isMentor ? 'Industry Mentor' : user?.preferred_role || 'Student'}
            </span>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full py-2 px-3 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
