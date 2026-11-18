import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardOverview from './components/DashboardOverview';
import StudentProfile from './components/StudentProfile';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import FindInternships from './components/FindInternships';
import MatchingEngineView from './components/MatchingEngineView';
import SkillGapView from './components/SkillGapView';
import RoadmapView from './components/RoadmapView';
import ApplicationTracker from './components/ApplicationTracker';
import InternshipProgress from './components/InternshipProgress';
import CareerAnalytics from './components/CareerAnalytics';
import MentorDashboard from './components/MentorDashboard';
import ExplainableModal from './components/ExplainableModal';
import { authLogin, getNotifications } from './api';

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('internpath_user')) || null;
    } catch {
      return null;
    }
  });

  const [currentView, setCurrentView] = useState('overview');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState('login');

  // Explainable modal state
  const [explainInternshipId, setExplainInternshipId] = useState(null);
  const [explainModalOpen, setExplainModalOpen] = useState(false);

  // Theme state
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('internpath_theme') === 'dark';
  });

  // Notifications state
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('internpath_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('internpath_theme', 'light');
    }
  }, [isDark]);

  const toggleDark = () => setIsDark(prev => !prev);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const data = await getNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unread_count || 0);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      if (user.role === 'mentor') {
        setCurrentView('mentor-overview');
      } else {
        setCurrentView('overview');
      }
    }
  }, [user]);

  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    if (authenticatedUser.role === 'mentor') {
      setCurrentView('mentor-overview');
    } else {
      setCurrentView('overview');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('internpath_user');
    setUser(null);
    setCurrentView('overview');
  };

  const handleQuickSwitchUser = async (demoEmail, demoPassword) => {
    try {
      const res = await authLogin(demoEmail, demoPassword);
      localStorage.setItem('internpath_user', JSON.stringify(res.user));
      setUser(res.user);
      if (res.user.role === 'mentor') {
        setCurrentView('mentor-overview');
      } else {
        setCurrentView('overview');
      }
    } catch (err) {
      alert('Error switching demo account: ' + err.message);
    }
  };

  const handleOpenExplainModal = (internshipId) => {
    setExplainInternshipId(internshipId);
    setExplainModalOpen(true);
  };

  // If unauthenticated, render Public Landing Page
  if (!user) {
    return (
      <>
        <LandingPage
          onOpenAuth={(mode) => {
            setAuthInitialMode(mode);
            setAuthModalOpen(true);
          }}
          onExploreInternships={() => {
            // Log in as student demo to explore directly
            handleQuickSwitchUser('student@internpath.demo', 'Student123!');
          }}
          isDark={isDark}
          toggleDark={toggleDark}
        />

        <AuthModal
          isOpen={authModalOpen}
          initialMode={authInitialMode}
          onClose={() => setAuthModalOpen(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  return (
    <div className={`min-h-screen flex ${isDark ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onNavigate={setCurrentView}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header
          user={user}
          currentView={currentView}
          onQuickSwitchUser={handleQuickSwitchUser}
          isDark={isDark}
          toggleDark={toggleDark}
          notifications={notifications}
          unreadCount={unreadCount}
          onRefreshNotifications={fetchNotifications}
          onNavigate={setCurrentView}
        />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {/* Student Views */}
          {user.role !== 'mentor' && (
            <>
              {currentView === 'overview' && (
                <DashboardOverview
                  user={user}
                  onNavigate={setCurrentView}
                  onOpenExplainModal={handleOpenExplainModal}
                />
              )}

              {currentView === 'profile' && (
                <StudentProfile
                  user={user}
                  onProfileUpdated={fetchNotifications}
                />
              )}

              {currentView === 'resume' && (
                <ResumeAnalyzer
                  onSkillsSynced={() => {
                    fetchNotifications();
                    setCurrentView('profile');
                  }}
                />
              )}

              {currentView === 'internships' && (
                <FindInternships
                  user={user}
                  onOpenExplainModal={handleOpenExplainModal}
                  onNavigateToApplications={() => setCurrentView('applications')}
                />
              )}

              {currentView === 'matching' && (
                <MatchingEngineView
                  user={user}
                  onOpenExplainModal={handleOpenExplainModal}
                  onNavigateToRoadmap={() => setCurrentView('roadmap')}
                />
              )}

              {currentView === 'skill-gap' && (
                <SkillGapView
                  user={user}
                  onRoadmapCreated={() => setCurrentView('roadmap')}
                />
              )}

              {currentView === 'roadmap' && (
                <RoadmapView
                  user={user}
                  onNavigateToInternships={() => setCurrentView('internships')}
                />
              )}

              {currentView === 'applications' && (
                <ApplicationTracker
                  user={user}
                  onNavigateToInternships={() => setCurrentView('internships')}
                />
              )}

              {currentView === 'progress' && (
                <InternshipProgress
                  user={user}
                  onNavigateToFeedback={() => setCurrentView('progress')}
                />
              )}

              {currentView === 'analytics' && (
                <CareerAnalytics
                  user={user}
                  onNavigateToRoadmap={() => setCurrentView('roadmap')}
                  onNavigateToInternships={() => setCurrentView('internships')}
                />
              )}
            </>
          )}

          {/* Mentor Views */}
          {user.role === 'mentor' && (
            <MentorDashboard user={user} />
          )}
        </main>
      </div>

      {/* Global Explainable Match Modal */}
      <ExplainableModal
        internshipId={explainInternshipId}
        isOpen={explainModalOpen}
        onClose={() => setExplainModalOpen(false)}
        onRoadmapCreated={() => setCurrentView('roadmap')}
      />
    </div>
  );
}
