import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Target, 
  TrendingUp, 
  BookOpen, 
  Calendar, 
  Clock, 
  Briefcase,
  ArrowRight
} from 'lucide-react';
import { getMatchExplanation, generateRoadmap } from '../api';

export default function ExplainableModal({ internshipId, isOpen, onClose, onRoadmapCreated }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false);
  const [roadmapSuccess, setRoadmapSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen || !internshipId) return;
    setLoading(true);
    async function fetchExplanation() {
      try {
        const res = await getMatchExplanation(internshipId);
        setData(res);
      } catch (err) {
        console.error('Failed to load match explanation:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchExplanation();
  }, [internshipId, isOpen]);

  if (!isOpen) return null;

  const handleCreateRoadmap = async () => {
    setGeneratingRoadmap(true);
    try {
      const missingSkillsList = (data?.match?.missing_skills || []).map(m => m.skill);
      await generateRoadmap(internshipId, data?.internship?.title, missingSkillsList);
      setRoadmapSuccess(true);
      setTimeout(() => {
        setRoadmapSuccess(false);
        onClose();
        if (onRoadmapCreated) onRoadmapCreated();
      }, 1500);
    } catch (err) {
      alert('Error creating roadmap: ' + err.message);
    } finally {
      setGeneratingRoadmap(false);
    }
  };

  const match = data?.match;
  const breakdown = match?.breakdown;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-electric-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Explainable Match Intelligence</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transparent 5-Vector Scoring Analysis for {data?.internship?.title || 'Internship'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {loading ? (
            <div className="py-16 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-3" />
              <p className="text-xs text-slate-500 font-semibold">Running 5-vector Python weighted evaluation...</p>
            </div>
          ) : match ? (
            <>
              {/* Natural Language AI Summary Box */}
              <div className="p-5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    Algorithmic Match Verdict
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-indigo-700 dark:text-indigo-300">
                      {match.match_percentage}%
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700">
                      {match.match_label}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                  {match.explanation}
                </p>
              </div>

              {/* 5-Factor Weighted Score Breakdown */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Weighted Vector Scoring Breakdown (Total = 100%)
                  </h4>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    Status: {match.eligibility_status}
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Vector 1: Skill Match (45%) */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        1. Technical Skill Overlap (Weight: 45%)
                      </span>
                      <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                        {breakdown?.skill_match?.score} / 45.0 pts
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${breakdown?.skill_match?.percentage}%` }} />
                    </div>
                  </div>

                  {/* Vector 2: Project Experience (20%) */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        2. Project & Portfolio Relevance (Weight: 20%)
                      </span>
                      <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                        {breakdown?.project_experience?.score} / 20.0 pts
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-electric-500 h-2 rounded-full" style={{ width: `${breakdown?.project_experience?.percentage}%` }} />
                    </div>
                  </div>

                  {/* Vector 3: Domain Interest (15%) */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        3. Career Domain Alignment (Weight: 15%)
                      </span>
                      <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                        {breakdown?.domain_interest?.score} / 15.0 pts
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-violet-500 h-2 rounded-full" style={{ width: `${breakdown?.domain_interest?.percentage}%` }} />
                    </div>
                  </div>

                  {/* Vector 4: Eligibility (10%) */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        4. Academic Eligibility Criteria (Weight: 10%)
                      </span>
                      <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                        {breakdown?.eligibility?.score} / 10.0 pts
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${breakdown?.eligibility?.percentage}%` }} />
                    </div>
                  </div>

                  {/* Vector 5: Availability (10%) */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        5. Work Mode & Availability Timeline (Weight: 10%)
                      </span>
                      <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                        {breakdown?.availability?.score} / 10.0 pts
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${breakdown?.availability?.percentage}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Matched vs Missing Skills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Matched Skills */}
                <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900">
                  <h5 className="font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Skills You Have ({match.matched_skills.length})</span>
                  </h5>
                  <div className="space-y-1.5">
                    {match.matched_skills.map((s, idx) => (
                      <div key={idx} className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <span>{s.skill}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">
                          {s.proficiency}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900">
                  <h5 className="font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>Missing Skills to Learn ({match.missing_skills.length})</span>
                  </h5>
                  <div className="space-y-1.5">
                    {match.missing_skills.length > 0 ? (
                      match.missing_skills.map((s, idx) => (
                        <div key={idx} className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                          <span>{s.skill}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300">
                            Priority: {s.priority}
                          </span>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-500 italic">No missing required skills! Complete match.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actionable Improvement Suggestions */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                <h5 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-2">
                  Suggestions to Boost This Match Score
                </h5>
                <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                  {match.suggestions.map((sug, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-500 font-bold">•</span>
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : null}
        </div>

        {/* Modal Footer: Generate Roadmap CTA */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            Target Role: <strong>{data?.internship?.title}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 text-slate-600 border border-slate-200 dark:border-slate-700"
            >
              Close
            </button>
            <button
              onClick={handleCreateRoadmap}
              disabled={generatingRoadmap || roadmapSuccess}
              className="px-5 py-2.5 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-md flex items-center gap-1.5 transition-all"
            >
              <Layers className="w-4 h-4" />
              <span>
                {roadmapSuccess
                  ? 'Roadmap Created!'
                  : generatingRoadmap
                  ? 'Building Roadmap...'
                  : 'Build Roadmap For This Role'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
