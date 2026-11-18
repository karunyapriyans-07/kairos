import React, { useState, useEffect } from 'react';
import { 
  GitCompare, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  ArrowRight, 
  Sparkles, 
  Briefcase, 
  Clock, 
  TrendingUp,
  Target
} from 'lucide-react';
import { getInternships, getSkillGapAnalysis, generateRoadmap } from '../api';

export default function SkillGapView({ user, onRoadmapCreated }) {
  const [internships, setInternships] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [gapData, setGapData] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingGap, setLoadingGap] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    async function loadList() {
      try {
        const data = await getInternships();
        setInternships(data);
        if (data.length > 0) {
          setSelectedId(data[0].id);
        }
      } catch (err) {
        console.error('Error fetching internships list:', err);
      } finally {
        setLoadingList(false);
      }
    }
    loadList();
  }, [user]);

  useEffect(() => {
    if (!selectedId) return;
    async function loadGap() {
      setLoadingGap(true);
      try {
        const res = await getSkillGapAnalysis(selectedId);
        setGapData(res);
      } catch (err) {
        console.error('Failed to load skill gap data:', err);
      } finally {
        setLoadingGap(false);
      }
    }
    loadGap();
  }, [selectedId]);

  const handleBuildRoadmap = async () => {
    if (!selectedId || !gapData) return;
    setGenerating(true);
    try {
      await generateRoadmap(selectedId, gapData.title, gapData.high_priority_missing);
      setSuccessMsg(`Personalized 4-week roadmap generated for ${gapData.title}!`);
      setTimeout(() => {
        setSuccessMsg('');
        if (onRoadmapCreated) onRoadmapCreated();
      }, 1500);
    } catch (err) {
      alert('Error creating roadmap: ' + err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 mb-2">
            <GitCompare className="w-3.5 h-3.5" />
            <span>Profile vs Requirements Comparison</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Skill Gap Analyzer</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Compare your verified skill set against any internship listing to identify high-priority missing skills.
          </p>
        </div>

        {/* Target Internship Dropdown Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 whitespace-nowrap">Target Role:</label>
          <select
            value={selectedId || ''}
            onChange={(e) => setSelectedId(Number(e.target.value))}
            className="w-full sm:w-72 px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white truncate"
          >
            {internships.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title} ({item.company_name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-200 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {loadingGap ? (
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-semibold">Comparing verified skills against job requirements...</p>
        </div>
      ) : gapData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Summary Stats & Roadmap Button */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{gapData.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{gapData.company_name}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    {gapData.match_percentage}%
                  </span>
                  <span className="text-[10px] font-bold block text-slate-400 uppercase">Current Match</span>
                </div>
              </div>

              {/* Counters */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block mb-1">
                    Matched Skills
                  </span>
                  <span className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">
                    {gapData.matched_count}
                  </span>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">Verified on profile</p>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300 block mb-1">
                    Missing Skills
                  </span>
                  <span className="text-2xl font-extrabold text-rose-700 dark:text-rose-300">
                    {gapData.missing_count}
                  </span>
                  <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-0.5">
                    {gapData.high_priority_missing?.length || 0} high priority
                  </p>
                </div>
              </div>

              {/* High Priority Callout */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900">
                <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-200 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>High-Priority Gaps to Target</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {gapData.high_priority_missing.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Button to Build Roadmap */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleBuildRoadmap}
                disabled={generating}
                className="w-full py-3 rounded-2xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
              >
                <Layers className="w-4 h-4" />
                <span>{generating ? 'Generating 4-Week Plan...' : 'Build My Roadmap'}</span>
                {!generating && <ArrowRight className="w-4 h-4" />}
              </button>
              <p className="text-[10px] text-center text-slate-400 mt-2">
                Converts missing skills into structured weekly learning milestones
              </p>
            </div>
          </div>

          {/* Right 2 Columns: Visual Comparison Table */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Detailed Skill Comparison Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Side-by-side verification of required qualifications vs student profile
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Skill Name</th>
                    <th className="pb-3">Candidate Status</th>
                    <th className="pb-3">Your Proficiency</th>
                    <th className="pb-3">Priority Level</th>
                    <th className="pb-3">Role Requirement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {gapData.comparison_table.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 font-bold text-slate-900 dark:text-white">
                        {row.skill}
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                          row.status === 'Matched'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {row.status === 'Matched' ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <AlertCircle className="w-3 h-3 text-rose-600" />}
                          <span>{row.status}</span>
                        </span>
                      </td>
                      <td className="py-3 font-medium text-slate-600 dark:text-slate-300">
                        {row.proficiency}
                      </td>
                      <td className="py-3">
                        {row.priority !== '—' ? (
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                            row.priority === 'High'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {row.priority} Priority
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-3 font-semibold text-slate-500 dark:text-slate-400">
                        {row.importance}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
