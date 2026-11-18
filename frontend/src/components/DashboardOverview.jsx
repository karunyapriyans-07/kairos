import React, { useState, useEffect } from 'react';
import { 
  Award, 
  TrendingUp, 
  Briefcase, 
  CheckCircle2, 
  Layers, 
  Clock, 
  Target, 
  ArrowRight, 
  Sparkles, 
  ChevronRight,
  Calendar,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar,
  Legend
} from 'recharts';
import { getDashboardAnalytics, getCareerReadiness, getMatchingRecommendations } from '../api';

const COLORS = ['#6366f1', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
const PROF_COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

export default function DashboardOverview({ user, onNavigate, onOpenExplainModal }) {
  const [data, setData] = useState(null);
  const [readiness, setReadiness] = useState(null);
  const [topMatches, setTopMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [dashRes, readRes, matchRes] = await Promise.all([
          getDashboardAnalytics(),
          getCareerReadiness(),
          getMatchingRecommendations('best', 'match')
        ]);
        setData(dashRes);
        setReadiness(readRes);
        setTopMatches(matchRes.slice(0, 3));
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const score = readiness?.readiness?.readiness_index || data?.career_readiness_score || 83;
  const classification = readiness?.readiness?.classification || "Strong Candidate";
  const historyData = readiness?.history || [];

  return (
    <div className="space-y-6">
      {/* 1. WELCOME & PERSONALIZED ADVICE BANNER */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-indigo-900 via-indigo-800 to-electric-900 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/15 text-indigo-200 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Career Readiness Assistant</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || data?.student_name || 'Scholar'}!
            </h1>
            <p className="mt-2 text-sm text-indigo-100/90 leading-relaxed">
              {data?.personalized_recommendation || "Your profile is showing strong growth. Complete your pending roadmap milestones to unlock top tier 90%+ match opportunities."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('internships')}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-white text-indigo-900 hover:bg-indigo-50 shadow-lg shadow-black/15 transition-all flex items-center gap-1.5"
            >
              <span>Explore Matches</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('roadmap')}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md transition-all flex items-center gap-1.5"
            >
              <span>My Roadmap</span>
              <Layers className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. CORE METRICS KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Career Readiness Score Card */}
        <div 
          onClick={() => onNavigate('analytics')}
          className="col-span-2 sm:col-span-1 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-500 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
            <span>Readiness Index</span>
            <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{score}</span>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">/ 100</span>
          </div>
          <div className="mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 truncate">
            {classification}
          </div>
          <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${score}%` }} />
          </div>
        </div>

        {/* Total Internships Recommended */}
        <div 
          onClick={() => onNavigate('internships')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-500 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
            <span>Recommended</span>
            <Target className="w-4 h-4 text-electric-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {data?.total_recommended || 20}
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {data?.high_matches || 8} high matches (&gt;70%)
          </p>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-electric-600 dark:text-electric-400">
            <span>View Opportunities</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* Applications in Pipeline */}
        <div 
          onClick={() => onNavigate('applications')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-500 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
            <span>Applications</span>
            <Briefcase className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {data?.applications_submitted || 4}
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Active in Kanban pipeline
          </p>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
            <span>Track Stages</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* Interviews Scheduled */}
        <div 
          onClick={() => onNavigate('applications')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-500 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
            <span>Interviews</span>
            <Calendar className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {data?.interviews_scheduled || 1}
          </div>
          <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold truncate">
            Nov 24 • System Design
          </p>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            <span>Interview Prep</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* Verified Skills */}
        <div 
          onClick={() => onNavigate('profile')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-500 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
            <span>Verified Skills</span>
            <CheckCircle2 className="w-4 h-4 text-violet-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {data?.skills_verified || 10}
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Across languages & tools
          </p>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-violet-600 dark:text-violet-400">
            <span>Edit Skills</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* 3. CHARTS ROW: READINESS GROWTH & APPLICATION PIPELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Career Readiness Growth Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Career Readiness Growth</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Historical trend across sprint milestones</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              +{score - (historyData[0]?.score || 60)} pts this month
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis domain={[40, 100]} tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderRadius: '12px', 
                    color: '#fff', 
                    border: 'none', 
                    fontSize: '12px' 
                  }} 
                />
                <Area type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#scoreGrad)" name="Readiness Index" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Proficiency Distribution */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Skill Distribution</h3>
              <button onClick={() => onNavigate('profile')} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                View All
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Breakdown by current proficiency level</p>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.skills_distribution || [
                      { proficiency: 'Advanced', count: 6 },
                      { proficiency: 'Intermediate', count: 3 },
                      { proficiency: 'Beginner', count: 1 }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="count"
                    nameKey="proficiency"
                  >
                    {(data?.skills_distribution || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PROF_COLORS[index % PROF_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
            {(data?.skills_distribution || [
              { proficiency: 'Advanced', count: 6 },
              { proficiency: 'Intermediate', count: 3 },
              { proficiency: 'Beginner', count: 1 }
            ]).map((s, idx) => (
              <div key={idx} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-[10px] font-bold block text-slate-500 dark:text-slate-400 uppercase">{s.proficiency}</span>
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. TOP RECOMMENDED MATCHES & ACTIVE ROADMAP SPRINT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Recommended Internships */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Top Compatibility Recommendations</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Ranked by weighted 5-factor compatibility algorithm</p>
            </div>
            <button
              onClick={() => onNavigate('internships')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Explore All ({data?.total_recommended || 20})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {topMatches.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {item.logo_url ? (
                      <img src={item.logo_url} alt={item.company_name} className="w-full h-full object-cover" />
                    ) : (
                      <Briefcase className="w-6 h-6 text-indigo-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.company_name} • {item.work_mode} • {item.stipend}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {item.required_skills.slice(0, 3).map((sk, idx) => (
                        <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Match:</span>
                    <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">
                      {item.match?.match_percentage || 85}%
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenExplainModal(item.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 transition-colors"
                    >
                      Why Match?
                    </button>
                    <button
                      onClick={() => onNavigate('internships')}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Internship & Weekly Activity */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Milestone</h3>
              <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                In Progress
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 mb-4">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider block mb-1">
                Full Stack Web Developer Intern
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                PixelCraft Studios • Mentored by Dr. Rajesh Kumar
              </p>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Week 3 Report Status:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">Submitted for Review</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  Sprint Hours Logged
                </span>
                <span className="font-extrabold text-slate-900 dark:text-white">67.5 hrs</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-slate-400" />
                  Latest Mentor Rating
                </span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">4.8 / 5.0</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-slate-400" />
                  Milestone Progress
                </span>
                <span className="font-extrabold text-indigo-600 dark:text-indigo-400">Stage 3 of 6</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onNavigate('progress')}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Manage Internship Progress</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
