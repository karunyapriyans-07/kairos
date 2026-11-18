import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Target, 
  Calendar, 
  Award,
  Circle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getRoadmap, toggleRoadmapTask, generateRoadmap } from '../api';

export default function RoadmapView({ user, onNavigateToInternships }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  async function loadRoadmapData() {
    setLoading(true);
    try {
      const res = await getRoadmap();
      setData(res);
    } catch (err) {
      console.error('Failed to load roadmap:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRoadmapData();
  }, [user]);

  const handleToggleTask = async (taskId, currentStatus) => {
    setUpdatingTaskId(taskId);
    const newStatus = !currentStatus;
    try {
      await toggleRoadmapTask(taskId, newStatus);
      // Trigger confetti if completed
      if (newStatus) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
      loadRoadmapData();
    } catch (err) {
      alert('Error updating task: ' + err.message);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const handleRegenerate = async () => {
    if (!confirm('Regenerate your roadmap with updated skills from your profile?')) return;
    setLoading(true);
    try {
      await generateRoadmap(null, 'Full Stack Cloud Engineer', ['Docker Containerization', 'Async APIs', 'Database Indexing', 'System Design']);
      loadRoadmapData();
    } catch (err) {
      alert('Error generating roadmap: ' + err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    );
  }

  const roadmap = data?.roadmap;
  const progressPct = roadmap?.progress_percentage || 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>4-Week Skill Acceleration Roadmap</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {roadmap?.title || 'Personalized Learning Roadmap'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Targeting: <strong className="text-indigo-600 dark:text-indigo-400">{roadmap?.target_role || 'Full Stack Engineer'}</strong> • Bridging your high-priority missing skills
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRegenerate}
            className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Regenerate Roadmap</span>
          </button>
        </div>
      </div>

      {/* Progress Metric Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900 dark:text-white">Overall Roadmap Progress</span>
            <span className="text-xs font-semibold text-slate-400">
              ({roadmap?.completed_tasks || 0} of {roadmap?.total_tasks || 4} tasks completed)
            </span>
          </div>
          <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">{progressPct}%</span>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
          <div
            className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500 h-full rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {progressPct === 100 && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 text-xs font-bold flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Congratulations! You completed all 4 weeks of this skill roadmap! Your Career Readiness Index received a boost.</span>
          </div>
        )}
      </div>

      {/* 4-Week Milestone Timeline Cards */}
      <div className="space-y-4">
        {(roadmap?.tasks || []).map((task) => {
          const isDone = task.is_completed;

          return (
            <div
              key={task.id}
              className={`p-6 rounded-3xl border transition-all ${
                isDone
                  ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                  : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  {/* Custom Completion Checkbox Button */}
                  <button
                    onClick={() => handleToggleTask(task.id, isDone)}
                    disabled={updatingTaskId === task.id}
                    className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all flex-shrink-0 mt-0.5 ${
                      isDone
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : 'border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-500 text-transparent'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </button>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        Week {task.week_number}
                      </span>
                      <h4 className={`text-base font-bold ${isDone ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                        {task.skill_name}
                      </h4>
                      {isDone && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          Completed ✓
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                      Objective: {task.objective}
                    </p>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {task.task_description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-start gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{task.estimated_duration}</span>
                  </div>

                  <button
                    onClick={() => handleToggleTask(task.id, isDone)}
                    disabled={updatingTaskId === task.id}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isDone
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                    }`}
                  >
                    {isDone ? 'Mark Incomplete' : 'Mark Task Complete'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
