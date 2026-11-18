import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Sparkles, 
  Filter, 
  ArrowUpDown, 
  BookmarkCheck, 
  Bookmark, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  CheckCircle2, 
  ChevronRight,
  Clock
} from 'lucide-react';
import { getMatchingRecommendations, toggleSaveInternship, applyInternship } from '../api';

export default function MatchingEngineView({ user, onOpenExplainModal, onNavigateToRoadmap }) {
  const [activeTab, setActiveTab] = useState('best'); // 'best', 'all', 'saved', 'applied'
  const [sortBy, setSortBy] = useState('match'); // 'match', 'deadline', 'stipend'
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadRecommendations() {
    setLoading(true);
    try {
      const data = await getMatchingRecommendations(activeTab, sortBy);
      setRecommendations(data);
    } catch (err) {
      console.error('Failed to load matching recommendations:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecommendations();
  }, [activeTab, sortBy, user]);

  const handleToggleSave = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await toggleSaveInternship(id);
      setRecommendations(prev => prev.map(item => item.id === id ? { ...item, is_saved: res.is_saved } : item));
    } catch (err) {
      alert('Error updating bookmark: ' + err.message);
    }
  };

  const handleApply = async (id) => {
    try {
      await applyInternship(id, 'Applied via Matching Engine');
      alert('Application submitted successfully!');
      loadRecommendations();
    } catch (err) {
      alert(err.message || 'Error submitting application');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Engine Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 mb-2">
            <Target className="w-3.5 h-3.5" />
            <span>5-Factor Weighted Compatibility Engine</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">AI Internship Matching Engine</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time weighted score calculation across 45% Skills, 20% Projects, 15% Domain, 10% Eligibility & 10% Availability.
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="match">Highest Compatibility Match</option>
            <option value="deadline">Approaching Deadline</option>
            <option value="stipend">Highest Stipend</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 max-w-md">
        {[
          { key: 'best', label: 'Best Matches (≥65%)' },
          { key: 'all', label: 'All Internships' },
          { key: 'saved', label: 'Saved' },
          { key: 'applied', label: 'Applied' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === tab.key
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Recommendations List */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-semibold">Running multi-vector matching evaluation...</p>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <Target className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">No opportunities in this category</h4>
          <p className="text-xs text-slate-500 mt-1">Switch to "All Internships" to discover more matches.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((item) => {
            const match = item.match;
            const score = match?.match_percentage || 70;

            return (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {item.logo_url ? (
                      <img src={item.logo_url} alt={item.company_name} className="w-full h-full object-cover" />
                    ) : (
                      <Briefcase className="w-6 h-6 text-indigo-600" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">{item.title}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {item.domain}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {item.company_name} • {item.location} ({item.work_mode}) • {item.duration} • <span className="font-bold text-emerald-600 dark:text-emerald-400">{item.stipend}</span>
                    </p>

                    {/* Matched vs Missing preview */}
                    <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-[11px] font-semibold text-slate-400">Skills Overlap:</span>
                      {match?.matched_skills?.slice(0, 3).map((ms, idx) => (
                        <span key={idx} className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>{ms.skill}</span>
                        </span>
                      ))}
                      {match?.missing_skills?.slice(0, 2).map((mg, idx) => (
                        <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                          Missing: {mg.skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Match Score & Action Buttons */}
                <div className="flex items-center md:flex-col md:items-end justify-between gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{score}%</span>
                        <span className="text-[11px] font-bold text-slate-400">Match</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        score >= 80 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                        score >= 65 ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' :
                        'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {match?.match_label}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleToggleSave(item.id, e)}
                      className={`p-2.5 rounded-xl transition-colors ${
                        item.is_saved
                          ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950'
                          : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {item.is_saved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenExplainModal(item.id)}
                      className="px-3.5 py-2 text-xs font-bold rounded-xl text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Why This Match?</span>
                    </button>

                    {item.application_status ? (
                      <span className="px-3 py-2 text-xs font-bold rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {item.application_status}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApply(item.id)}
                        className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all"
                      >
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
