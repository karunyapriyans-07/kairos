import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  Send, 
  FileText, 
  AlertCircle, 
  Award, 
  Plus, 
  ExternalLink, 
  Calendar,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { getProgressReports, submitProgressReport, getProgressMilestones } from '../api';

export default function InternshipProgress({ user, onNavigateToFeedback }) {
  const [reports, setReports] = useState([]);
  const [milestonesData, setMilestonesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Weekly report form state
  const [weekNumber, setWeekNumber] = useState(4);
  const [hoursWorked, setHoursWorked] = useState(20);
  const [tasksCompleted, setTasksCompleted] = useState('');
  const [skillsLearned, setSkillsLearned] = useState('');
  const [projectUpdates, setProjectUpdates] = useState('');
  const [challengesFaced, setChallengesFaced] = useState('');
  const [nextWeekGoals, setNextWeekGoals] = useState('');
  const [evidenceLinks, setEvidenceLinks] = useState('');

  async function loadData() {
    setLoading(true);
    try {
      const [reps, miles] = await Promise.all([
        getProgressReports(),
        getProgressMilestones()
      ]);
      setReports(reps);
      setMilestonesData(miles);
      if (reps.length > 0) {
        setWeekNumber(reps[0].week_number + 1);
      }
    } catch (err) {
      console.error('Failed to load progress data:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [user]);

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!tasksCompleted.trim()) return;
    setSubmitting(true);
    try {
      await submitProgressReport({
        week_number: Number(weekNumber),
        hours_worked: Number(hoursWorked),
        tasks_completed: tasksCompleted,
        skills_learned: skillsLearned,
        project_updates: projectUpdates,
        challenges_faced: challengesFaced,
        next_week_goals: nextWeekGoals,
        evidence_links: evidenceLinks
      });
      setShowSubmitModal(false);
      setToastMsg(`Week ${weekNumber} Progress Report successfully submitted to your mentor!`);
      setTimeout(() => setToastMsg(''), 4000);
      loadData();
    } catch (err) {
      alert('Error submitting report: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Active Internship Tracking</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Internship Progress & Weekly Reports</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Log weekly sprint tasks, track cumulative hours, and receive mentor evaluations across standard rubrics.
          </p>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Weekly Report</span>
        </button>
      </div>

      {toastMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-200 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Milestones & Total Hours Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Logged Time</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400">
                {milestonesData?.total_hours_logged || 67.5}
              </span>
              <span className="text-sm font-bold text-slate-400">Hours</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {milestonesData?.reports_approved || 2} reports approved by mentor
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500 block mb-1">Completion Trajectory</span>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-2 rounded-full"
                style={{ width: `${milestonesData?.overall_progress_pct || 50}%` }}
              />
            </div>
            <span className="text-[11px] text-emerald-600 font-bold block mt-1">
              {milestonesData?.overall_progress_pct || 50}% of semester milestone target
            </span>
          </div>
        </div>

        {/* 6 Stage Milestone Checklist */}
        <div className="lg:col-span-3 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Milestone Progress Trajectory</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {(milestonesData?.milestones || []).map((ms, idx) => (
              <div
                key={ms.id}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  ms.completed
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-400'
                }`}
              >
                <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center font-bold text-xs ${
                  ms.completed ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}>
                  {ms.completed ? '✓' : idx + 1}
                </div>
                <div className="text-xs font-bold leading-tight">{ms.title}</div>
                <div className="text-[10px] mt-1 text-slate-400">{ms.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submission History */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Weekly Progress Report History</h3>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading submission records...</div>
        ) : reports.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">No reports submitted yet. Submit your Week 1 report above!</div>
        ) : (
          <div className="space-y-4">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/60 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-xl text-xs font-black bg-indigo-600 text-white">
                      Week {rep.week_number}
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Logged {rep.hours_worked} Hours
                    </span>
                    <span className="text-xs text-slate-400">• Submitted {rep.submission_date}</span>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    rep.status === 'Approved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                    rep.status === 'Submitted' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                    'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {rep.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                      Tasks Completed
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {rep.tasks_completed}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                      Skills Learned & Tools
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {rep.skills_learned || '—'}
                    </p>
                  </div>
                </div>

                {rep.challenges_faced && (
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    <strong className="text-slate-700 dark:text-slate-300">Challenges:</strong> {rep.challenges_faced}
                  </div>
                )}

                {/* Mentor Feedback Attachment */}
                {rep.feedback ? (
                  <div className="mt-3 p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-indigo-600" />
                        <span>Mentor Feedback from {rep.feedback.mentor_name}</span>
                      </span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                        Rating: {rep.feedback.overall_score} / 5.0
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 italic">
                      "{rep.feedback.comments}"
                    </p>
                  </div>
                ) : (
                  <div className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Awaiting mentor evaluation & rubrics scoring</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SUBMIT WEEKLY REPORT MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Submit Weekly Internship Report</h4>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Week Number</label>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    required
                    value={weekNumber}
                    onChange={(e) => setWeekNumber(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Hours Worked</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={hoursWorked}
                    onChange={(e) => setHoursWorked(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Tasks Completed & Deliverables</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail sprint tickets, feature branches merged, bugfixes..."
                  value={tasksCompleted}
                  onChange={(e) => setTasksCompleted(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Skills & Tools Learned</label>
                <input
                  type="text"
                  placeholder="e.g. React hooks, Docker healthchecks, Redis caching"
                  value={skillsLearned}
                  onChange={(e) => setSkillsLearned(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Project Updates & Milestones</label>
                <input
                  type="text"
                  placeholder="e.g. Completed Sprint 2 demo ahead of schedule"
                  value={projectUpdates}
                  onChange={(e) => setProjectUpdates(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Challenges Faced & Resolutions</label>
                <input
                  type="text"
                  placeholder="e.g. CORS preflight issues on auth endpoints, solved with FastAPI middleware"
                  value={challengesFaced}
                  onChange={(e) => setChallengesFaced(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Evidence Links (GitHub PR, Loom demo, Figma)</label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={evidenceLinks}
                  onChange={(e) => setEvidenceLinks(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Submitting Report...' : 'Submit to Mentor'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
