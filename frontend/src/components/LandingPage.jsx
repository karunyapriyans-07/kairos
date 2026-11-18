import React from 'react';
import { 
  Sparkles, 
  Compass, 
  Target, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Users, 
  ShieldCheck, 
  Award, 
  TrendingUp, 
  Briefcase,
  Layers,
  ChevronRight,
  Code2,
  Cpu,
  GraduationCap
} from 'lucide-react';

export default function LandingPage({ onOpenAuth, onExploreInternships, isDark, toggleDark }) {
  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* 1. PUBLIC NAVBAR */}
      <header className="sticky top-0 z-40 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-electric-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-700 via-indigo-600 to-electric-600 dark:from-indigo-400 dark:to-electric-400 bg-clip-text text-transparent">
                InternPath <span className="font-extrabold text-indigo-500 dark:text-indigo-400">AI</span>
              </span>
              <span className="block text-[10px] tracking-widest uppercase font-semibold text-slate-600 dark:text-slate-300">
                Career Intelligence Platform
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">How It Works</a>
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a>
            <button onClick={onExploreInternships} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Explore Internships
            </button>
            <a href="#matching-preview" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">AI Matching</a>
            <a href="#demo-stats" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Platform Stats</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDark}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Theme"
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            <button
              onClick={() => onOpenAuth('login')}
              className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Login
            </button>

            <button
              onClick={() => onOpenAuth('signup')}
              className="px-5 py-2.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-electric-600 hover:from-indigo-700 hover:to-electric-700 shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all transform hover:-translate-y-0.5"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-24 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[250px] bg-electric-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>AI-Powered Career Matching & Progress Monitoring</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Your Skills. Your Future. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-electric-600 bg-clip-text text-transparent">
                Your Internship.
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Stop applying randomly. Discover internships that match your actual skills, understand what you're missing, and build your transparent path to career readiness.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onExploreInternships}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Find My Internship</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#how-it-works"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors flex items-center justify-center gap-2"
              >
                <span>Explore How It Works</span>
              </a>

              <button
                onClick={() => onOpenAuth('demo')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Demo Login (Judges)</span>
              </button>
            </div>
          </div>

          {/* HERO VISUAL DASHBOARD MOCKUP */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="relative rounded-2xl p-2 bg-gradient-to-b from-indigo-500/20 via-slate-200/50 to-transparent dark:from-indigo-500/20 dark:via-slate-800/50 dark:to-transparent shadow-2xl">
              <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-inner p-6">
                {/* Top browser/window bar */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-400" />
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="ml-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
                      InternPath AI — Live Career Intelligence Engine
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      Live Algorithmic Matching Active
                    </span>
                  </div>
                </div>

                {/* Grid of Dashboard Preview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Card 1: Internship Match Score */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                      <span>Top Match Score</span>
                      <Target className="w-4 h-4 text-indigo-500" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-slate-900 dark:text-white">92%</span>
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Excellent Match</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 truncate">
                      Full Stack Developer Intern @ PixelCraft
                    </p>
                    <div className="mt-3 w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>

                  {/* Card 2: Skills Analysis */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                      <span>Skills Analysis</span>
                      <Code2 className="w-4 h-4 text-electric-500" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-slate-900 dark:text-white">8/10</span>
                      <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Core Verified</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Python ✓</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">React ✓</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">Docker +</span>
                    </div>
                  </div>

                  {/* Card 3: Career Readiness Index */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                      <span>Career Readiness</span>
                      <TrendingUp className="w-4 h-4 text-violet-500" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-slate-900 dark:text-white">83</span>
                      <span className="text-xs font-bold text-violet-600 dark:text-violet-400">Strong Candidate</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Tier 4 of 5 (Ranked Top 12%)
                    </p>
                    <div className="mt-3 w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-1.5 rounded-full" style={{ width: '83%' }} />
                    </div>
                  </div>

                  {/* Card 4: Personalized Roadmap */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                      <span>Active Roadmap</span>
                      <Layers className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-slate-900 dark:text-white">W3</span>
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">50% Complete</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 truncate">
                      Docker & Database Optimization
                    </p>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                      <span>2 of 4 tasks done</span>
                      <span>Next: Sprint PR</span>
                    </div>
                  </div>
                </div>

                {/* Banner inside preview */}
                <div className="mt-4 p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                    <p className="text-xs text-indigo-900 dark:text-indigo-200 font-medium">
                      <strong className="font-bold">Explainable AI Insights:</strong> "You match 92% for Full Stack Web Developer because you have advanced React, Python & verified projects. Complete the Docker task to reach 98%."
                    </p>
                  </div>
                  <button 
                    onClick={onExploreInternships}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex-shrink-0 ml-4"
                  >
                    View Matching Roles →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROBLEM & SOLUTION SECTION */}
      <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold tracking-widest uppercase text-indigo-600 dark:text-indigo-400 mb-3">
              The Fundamental Challenge
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Why Traditional Internship Applications Fail Students
            </h3>
            <p className="mt-4 text-slate-600 dark:text-slate-300">
              Students waste hundreds of hours applying blindly with generic resumes, while mentors struggle to track progress once interns are hired.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Old Broken Way */}
            <div className="p-8 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/50">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-lg">✕</span>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">The Old Disconnected Way</h4>
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">Random applications & zero feedback</p>
                </div>
              </div>
              <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold mt-0.5">•</span>
                  <span><strong>Blind shotgun applications:</strong> Submitting to 50+ roles without knowing if your skills match or why you get rejected.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold mt-0.5">•</span>
                  <span><strong>Unknown skill gaps:</strong> No idea which specific missing skills cost you the shortlist.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold mt-0.5">•</span>
                  <span><strong>Scattered progress tracking:</strong> Reports, tasks, PRs, and mentor feedback spread across emails, Slack, and spreadsheets.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold mt-0.5">•</span>
                  <span><strong>No career readiness indicator:</strong> No objective measure of when a student is genuinely qualified to interview.</span>
                </li>
              </ul>
            </div>

            {/* The InternPath AI Way */}
            <div className="p-8 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-900/50">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">✓</span>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">The InternPath AI Solution</h4>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Intelligent matching, explainability & progress</p>
                </div>
              </div>
              <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Weighted 5-factor matching:</strong> 45% Skills, 20% Projects, 15% Domain, 10% Eligibility, 10% Availability.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Explainable AI ("Why This Match?"):</strong> Transparent breakdowns explaining exact points earned and gaps to bridge.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Automated Learning Roadmaps:</strong> Auto-generated 4-week structured milestones targeting your missing skills.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Integrated Mentor Feedback:</strong> Weekly progress reports, hours tracking, and 5-criteria rubric reviews in one portal.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold tracking-widest uppercase text-indigo-600 dark:text-indigo-400 mb-3">
              How InternPath AI Works
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              From Profile Creation to Mentor-Approved Internships
            </h3>
            <p className="mt-4 text-slate-600 dark:text-slate-300">
              A 4-step continuous intelligence loop designed to guide students and mentors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Profile & Resume Analysis',
                desc: 'Upload your PDF resume or add skills manually. Our AI extracts programming languages, tools, frameworks, and projects.',
                icon: FileText
              },
              {
                step: '02',
                title: 'Weighted Compatibility',
                desc: 'The Python matching engine calculates your match percentage across 5 weighted criteria with explainable score breakdowns.',
                icon: Target
              },
              {
                step: '03',
                title: 'Skill Gap & Roadmap',
                desc: 'Identify high-priority missing skills. Generate a personalized 4-week learning roadmap with step-by-step tasks.',
                icon: Layers
              },
              {
                step: '04',
                title: 'Progress & Mentorship',
                desc: 'Track applications via Kanban, log weekly sprint hours, and receive structured mentor evaluations across 5 industry rubrics.',
                icon: Award
              }
            ].map((st, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative group hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors">
                <div className="text-4xl font-black text-slate-200 dark:text-slate-800 mb-4 group-hover:text-indigo-100 dark:group-hover:text-indigo-950 transition-colors">
                  {st.step}
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                  <st.icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">{st.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. KEY PLATFORM FEATURES */}
      <section id="features" className="py-20 bg-slate-100/70 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold tracking-widest uppercase text-indigo-600 dark:text-indigo-400 mb-3">
              Platform Features
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Engineered for Modern Engineering Careers
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Explainable AI Matching</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                No black-box recommendations. Click "Why This Match?" to see points scored for skills (45%), projects (20%), domain (15%), eligibility (10%), and availability (10%).
              </p>
              <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">4-Tier Classification: Excellent, Strong, Moderate, Low</div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-electric-50 dark:bg-electric-950 text-electric-600 dark:text-electric-400 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">AI Resume Analyzer</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                Upload your PDF resume. Extracts technical skills across 150+ frameworks, scores your resume out of 100, detects missing sections, and suggests improvements.
              </p>
              <div className="text-xs font-semibold text-electric-600 dark:text-electric-400">One-click sync of extracted skills to your profile</div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Automated Learning Roadmaps</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                Select any dream internship and our system analyzes your skill gaps, generating a 4-week action plan with learning objectives, estimated hours, and tasks.
              </p>
              <div className="text-xs font-semibold text-violet-600 dark:text-violet-400">Real-time task completion persistence</div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Kanban Application Tracker</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                Organize applications across 6 stages: Saved, Applied, Assessment, Interview, Selected, Rejected. Track deadlines, notes, and prevent accidental duplicate applications.
              </p>
              <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">Interactive board with quick status dropdowns</div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Progress & Mentor Reviews</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                Submit weekly reports logging hours worked, PR links, and challenges faced. Industry mentors review reports with 5-criteria rubrics and written feedback.
              </p>
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Technical, Communication & Task rubrics</div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Career Readiness Index</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                A transparent 0-100 index combining Skill Readiness (35%), Project Experience (25%), Resume Quality (15%), Learning Progress (15%), and Application Engagement (10%).
              </p>
              <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Actionable steps to reach next classification tier</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PLATFORM DEMO STATISTICS (Clearly labeled demo data) */}
      <section id="demo-stats" className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              Hackathon Prototype Demonstration Metrics
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <div className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">20+</div>
              <div className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">Sample Internships</div>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Across 8 tech domains</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <div className="text-4xl font-extrabold text-electric-600 dark:text-electric-400">150+</div>
              <div className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">Tech Taxonomy Skills</div>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Languages, frameworks, cloud</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <div className="text-4xl font-extrabold text-violet-600 dark:text-violet-400">5</div>
              <div className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">Matching Vectors</div>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Weighted 45-20-15-10-10</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <div className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">100%</div>
              <div className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">Functional & Explainable</div>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Real Python backend logic</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CTA SECTION */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-indigo-950 to-navy-950 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to Experience Transparent Internship Intelligence?
          </h2>
          <p className="mt-5 text-indigo-200 max-w-2xl mx-auto text-base sm:text-lg">
            Try the hackathon demo now using preloaded Student or Mentor credentials, or create your own profile.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onOpenAuth('signup')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-xl shadow-black/20 transition-all"
            >
              Get Started for Free
            </button>
            <button
              onClick={() => onOpenAuth('demo')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/40 shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>One-Click Judge Demo</span>
            </button>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="py-12 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-slate-800 dark:text-slate-200">InternPath AI</span>
            <span>— AI-Powered Internship Matching, Skill Gap Analysis & Progress Platform</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[11px] text-slate-400">Demo Prototype • Built for Hackathon Demo</span>
            <a href="#how-it-works" className="hover:text-indigo-600">How It Works</a>
            <a href="#features" className="hover:text-indigo-600">Features</a>
            <button onClick={onExploreInternships} className="hover:text-indigo-600">Internships</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
