import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Star, 
  Send, 
  Clock, 
  ExternalLink, 
  BookOpen, 
  Award,
  ChevronRight,
  X
} from 'lucide-react';
import { getMentorDashboard, getMentorStudents, getMentorReports, reviewMentorReport } from '../api';

export default function MentorDashboard({ user }) {
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reports'); // 'reports' or 'students'

  // Review Modal State
  const [selectedReport, setSelectedReport] = useState(null);
  const [reviewStatus, setReviewStatus] = useState('Approved');
  const [techScore, setTechScore] = useState(5);
  const [commScore, setCommScore] = useState(5);
  const [probScore, setProbScore] = useState(4);
  const [taskScore, setTaskScore] = useState(5);
  const [initScore, setInitScore] = useState(4);
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  async function loadMentorData() {
    setLoading(true);
    try {
      const [dashRes, stuRes, repRes] = await Promise.all([
        getMentorDashboard(),
        getMentorStudents(),
        getMentorReports()
      ]);
      setStats(dashRes);
      setStudents(stuRes);
      setReports(repRes);
    } catch (err) {
      console.error('Error loading mentor dashboard:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMentorData();
  }, [user]);

  const handleOpenReview = (report) => {
    setSelectedReport(report);
    setReviewStatus(report.status === 'Needs Revision' ? 'Needs Revision' : 'Approved');
    if (report.feedback) {
      setTechScore(report.feedback.technical_score);
      setCommScore(report.feedback.communication_score);
      setProbScore(report.feedback.problem_solving_score);
      setTaskScore(report.feedback.task_completion_score);
      setInitScore(report.feedback.initiative_score);
      setComments(report.feedback.comments);
    } else {
      setTechScore(5);
      setCommScore(4);
      setProbScore(5);
      setTaskScore(5);
      setInitScore(4);
      setComments('Strong engineering rigor on this week deliverables. Clean commits and great proactive communication.');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedReport) return;
    setSubmitting(true);
    try {
      await reviewMentorReport(selectedReport.id, {
        status: reviewStatus,
        technical_score: techScore,
        communication_score: commScore,
        problem_solving_score: probScore,
        task_completion_score: taskScore,
        initiative_score: initScore,
        comments: comments
      });
      setSelectedReport(null);
      setSuccessToast(`Week ${selectedReport.week_number} review submitted successfully as ${reviewStatus}!`);
      setTimeout(() => setSuccessToast(''), 4000);
      loadMentorData();
    } catch (err) {
      alert('Error submitting review: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mentor Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-navy-950 via-indigo-950 to-indigo-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/15 text-indigo-200 mb-2">
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>Senior Technical Mentorship Portal</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome, {user?.name || 'Dr. Rajesh Kumar'}
          </h2>
          <p className="text-xs text-indigo-200/90 mt-1">
            {stats?.designation || 'Principal Staff Engineer'} • {stats?.organization || 'Nexus Dynamics'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            Cohort Active
          </span>
        </div>
      </div>

      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-200 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successToast}</span>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
            <span>Assigned Interns</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {stats?.stats?.assigned_students || 2}
          </div>
          <span className="text-[11px] font-semibold text-emerald-600 mt-1 block">Active students in track</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
            <span>Pending Reviews</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600">
            {stats?.stats?.reports_pending_review || 1}
          </div>
          <span className="text-[11px] font-semibold text-amber-600 mt-1 block">Reports awaiting review</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
            <span>On Track</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {stats?.stats?.students_on_track || 2}
          </div>
          <span className="text-[11px] font-semibold text-slate-400 mt-1 block">Meeting sprint milestones</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
            <span>Reviews Done</span>
            <Award className="w-4 h-4 text-violet-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {stats?.stats?.total_reviews_completed || 2}
          </div>
          <span className="text-[11px] font-semibold text-violet-600 mt-1 block">Evaluations completed</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 max-w-xs">
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'reports'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-500'
          }`}
        >
          Weekly Reports ({reports.length})
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'students'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-500'
          }`}
        >
          Assigned Students ({students.length})
        </button>
      </div>

      {/* Reports Queue */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-xs">
                    W{rep.week_number}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{rep.student_name}</h4>
                    <p className="text-xs text-slate-400">
                      Logged {rep.hours_worked} hrs • Submitted on {rep.submission_date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    rep.status === 'Approved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                    rep.status === 'Submitted' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                    'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {rep.status}
                  </span>

                  <button
                    onClick={() => handleOpenReview(rep)}
                    className="px-4 py-1.5 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-md"
                  >
                    {rep.feedback ? 'Edit Feedback' : 'Review & Evaluate'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                    Tasks Completed & Output
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    {rep.tasks_completed}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                    Technical Skills & Tools Applied
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    {rep.skills_learned || '—'}
                  </p>
                </div>
              </div>

              {rep.challenges_faced && (
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-800 dark:text-slate-200">Challenges:</strong> {rep.challenges_faced}
                </div>
              )}

              {rep.evidence_links && (
                <div className="text-xs">
                  <span className="font-bold text-slate-500 mr-2">PR / Evidence Link:</span>
                  <a href={rep.evidence_links} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline inline-flex items-center gap-1 font-semibold">
                    <span>{rep.evidence_links}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Existing Feedback View */}
              {rep.feedback && (
                <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-indigo-900 dark:text-indigo-200">
                      Your Current Rubric Evaluation
                    </span>
                    <span className="font-black text-emerald-600 text-sm">
                      Rating: {rep.feedback.overall_score} / 5.0
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 italic mb-2">
                    "{rep.feedback.comments}"
                  </p>
                  <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-bold text-slate-600 dark:text-slate-300 pt-2 border-t border-indigo-200/60 dark:border-indigo-900">
                    <div>Tech: {rep.feedback.technical_score}/5</div>
                    <div>Comm: {rep.feedback.communication_score}/5</div>
                    <div>Problem: {rep.feedback.problem_solving_score}/5</div>
                    <div>Tasks: {rep.feedback.task_completion_score}/5</div>
                    <div>Initiative: {rep.feedback.initiative_score}/5</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Assigned Students List */}
      {activeTab === 'students' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {students.map((st) => (
            <div
              key={st.student_id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={st.profile_pic || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                  alt={st.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-600"
                />
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">{st.name}</h4>
                  <p className="text-xs text-slate-500">{st.degree} in {st.department}</p>
                  <p className="text-xs text-indigo-600 font-semibold">{st.college}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                <div className="text-slate-500 font-semibold mb-1">Track & Role:</div>
                <div className="font-bold text-slate-900 dark:text-white">{st.internship_title}</div>
                <div className="text-[11px] text-slate-400">{st.company_name}</div>
              </div>

              <div className="flex flex-wrap gap-1">
                {st.skills.map((sk, idx) => (
                  <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {sk}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-500">
                  {st.total_reports} weekly reports logged
                </span>
                <span className={`px-2.5 py-0.5 rounded-full font-bold ${
                  st.pending_reports > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {st.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* REVIEW & EVALUATION MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Evaluate Week {selectedReport.week_number} Report
                </h4>
                <p className="text-xs text-slate-500">Candidate: {selectedReport.student_name}</p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Report Status Decision
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewStatus('Approved')}
                    className={`py-2 rounded-xl font-bold transition-all ${
                      reviewStatus === 'Approved'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    Approve Report ✓
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewStatus('Needs Revision')}
                    className={`py-2 rounded-xl font-bold transition-all ${
                      reviewStatus === 'Needs Revision'
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    Request Revision ⚠
                  </button>
                </div>
              </div>

              {/* 5 Criteria Rubric Sliders / Stars */}
              <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500 block mb-2">
                  5 Industry Rubric Criteria (1 to 5 Stars)
                </span>

                {[
                  { label: '1. Technical Proficiency', val: techScore, set: setTechScore },
                  { label: '2. Communication & Standups', val: commScore, set: setCommScore },
                  { label: '3. Problem-Solving Rigor', val: probScore, set: setProbScore },
                  { label: '4. Task Completion Velocity', val: taskScore, set: setTaskScore },
                  { label: '5. Initiative & Proactivity', val: initScore, set: setInitScore }
                ].map((crit, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{crit.label}</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => crit.set(star)}
                          className={`p-1 rounded ${crit.val >= star ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Mentor Written Feedback & Growth Recommendations
                </label>
                <textarea
                  rows={3}
                  required
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Provide concrete engineering feedback, commend strengths, and suggest improvements..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
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
                  <span>{submitting ? 'Submitting...' : 'Submit Evaluation'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
