import React, { useState, useEffect } from 'react';
import { 
  Kanban, 
  Table as TableIcon, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Briefcase, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  ChevronRight, 
  Edit3, 
  Trash2, 
  ExternalLink,
  Target
} from 'lucide-react';
import { getApplications, updateApplicationStatus, deleteApplication } from '../api';

const STAGES = [
  { key: 'Saved', label: 'Saved', color: 'slate' },
  { key: 'Applied', label: 'Applied', color: 'indigo' },
  { key: 'Assessment', label: 'Assessment', color: 'blue' },
  { key: 'Interview', label: 'Interview', color: 'amber' },
  { key: 'Selected', label: 'Selected / Offer', color: 'emerald' },
  { key: 'Rejected', label: 'Rejected', color: 'rose' }
];

export default function ApplicationTracker({ user, onNavigateToInternships }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'table'
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Edit / Notes modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [editNotes, setEditNotes] = useState('');
  const [editNextAction, setEditNextAction] = useState('');
  const [editInterviewDate, setEditInterviewDate] = useState('');
  const [editStatus, setEditStatus] = useState('');

  async function loadApplications() {
    setLoading(true);
    try {
      const data = await getApplications();
      setApplications(data);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, [user]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await updateApplicationStatus(appId, newStatus);
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    } catch (err) {
      alert('Error changing status: ' + err.message);
    }
  };

  const handleDeleteApp = async (appId) => {
    if (!confirm('Are you sure you want to withdraw/remove this application?')) return;
    try {
      await deleteApplication(appId);
      setApplications(prev => prev.filter(a => a.id !== appId));
    } catch (err) {
      alert('Error removing application: ' + err.message);
    }
  };

  const handleOpenEdit = (app) => {
    setSelectedApp(app);
    setEditStatus(app.status);
    setEditNotes(app.notes || '');
    setEditNextAction(app.next_action || '');
    setEditInterviewDate(app.interview_date || '');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;
    try {
      await updateApplicationStatus(selectedApp.id, editStatus, editNotes, editNextAction, editInterviewDate);
      setSelectedApp(null);
      loadApplications();
    } catch (err) {
      alert('Error updating application details: ' + err.message);
    }
  };

  const filteredApps = applications.filter(app => {
    const matchesSearch = search === '' || 
      app.title.toLowerCase().includes(search.toLowerCase()) || 
      app.company_name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Internship Application Tracker</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitor and manage your application pipeline across stages with interview dates and notes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search applications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          {/* View Mode Switcher */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-semibold">Loading your application pipeline...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">No applications yet</h4>
          <p className="text-xs text-slate-500 mt-1 mb-4">Discover internships that match your skills and submit applications.</p>
          <button
            onClick={onNavigateToInternships}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Find Internships
          </button>
        </div>
      ) : viewMode === 'kanban' ? (
        /* KANBAN BOARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {STAGES.map((col) => {
            const colApps = filteredApps.filter(a => a.status === col.key);

            return (
              <div
                key={col.key}
                className="p-3.5 rounded-3xl bg-slate-100/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 min-w-[240px] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 px-1">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {col.label}
                    </span>
                    <span className="w-5 h-5 rounded-full bg-white dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center justify-center shadow-sm">
                      {colApps.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {colApps.map((app) => (
                      <div
                        key={app.id}
                        onClick={() => handleOpenEdit(app)}
                        className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500 cursor-pointer transition-all space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{app.title}</h4>
                          <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                            {app.match_percentage}%
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {app.company_name}
                        </p>

                        {app.interview_date && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-lg">
                            <Calendar className="w-3 h-3" />
                            <span>Interview: {app.interview_date}</span>
                          </div>
                        )}

                        {app.next_action && (
                          <p className="text-[10px] text-slate-600 dark:text-slate-300 italic line-clamp-1">
                            Next: {app.next_action}
                          </p>
                        )}

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                          <span>{app.application_date}</span>
                          <span className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                            Edit →
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {colApps.length === 0 && (
                  <div className="py-8 text-center text-[11px] text-slate-400 italic">
                    Empty Stage
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3">Role & Company</th>
                <th className="pb-3">Domain</th>
                <th className="pb-3">Stage / Status</th>
                <th className="pb-3">Match</th>
                <th className="pb-3">Next Action</th>
                <th className="pb-3">Date</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3.5">
                    <div className="font-bold text-slate-900 dark:text-white">{app.title}</div>
                    <div className="text-[11px] text-slate-500">{app.company_name}</div>
                  </td>
                  <td className="py-3.5 font-medium text-slate-600 dark:text-slate-300">
                    {app.domain}
                  </td>
                  <td className="py-3.5">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className="px-2.5 py-1 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                    >
                      {STAGES.map(s => (
                        <option key={s.key} value={s.key}>{s.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3.5">
                    <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                      {app.match_percentage}%
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-600 dark:text-slate-300 italic max-w-xs truncate">
                    {app.next_action || '—'}
                  </td>
                  <td className="py-3.5 text-slate-400">
                    {app.application_date}
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(app)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteApp(app.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* EDIT APPLICATION MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{selectedApp.title}</h4>
                <p className="text-xs text-slate-500">{selectedApp.company_name}</p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Stage / Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {STAGES.map(s => (
                    <option key={s.key} value={s.key}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Interview Date (if applicable)</label>
                <input
                  type="date"
                  value={editInterviewDate}
                  onChange={(e) => setEditInterviewDate(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Next Action Item</label>
                <input
                  type="text"
                  placeholder="e.g. Prepare system design & database questions"
                  value={editNextAction}
                  onChange={(e) => setEditNextAction(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Application Notes</label>
                <textarea
                  rows={3}
                  placeholder="Takeaways from recruiter call, technical assessment notes..."
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
