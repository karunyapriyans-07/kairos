import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  DollarSign, 
  Bookmark, 
  BookmarkCheck, 
  Target, 
  ArrowRight, 
  Calendar, 
  Briefcase, 
  CheckCircle2, 
  Sparkles,
  ExternalLink,
  X,
  AlertCircle
} from 'lucide-react';
import { getInternships, toggleSaveInternship, applyInternship, getInternshipDetail } from '../api';

const DOMAINS = [
  'All',
  'AI / Machine Learning',
  'Python Development',
  'Web Development',
  'Data Analytics',
  'UI/UX Design',
  'Cybersecurity',
  'Java Development',
  'Cloud Computing'
];

export default function FindInternships({ user, onOpenExplainModal, onNavigateToApplications }) {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState('All');
  
  // Selected internship modal
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [applyNotes, setApplyNotes] = useState('');
  const [applying, setApplying] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  async function fetchInternships() {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedDomain !== 'All') params.domain = selectedDomain;
      if (selectedWorkMode !== 'All') params.work_mode = selectedWorkMode;
      const data = await getInternships(params);
      setInternships(data);
    } catch (err) {
      console.error('Error fetching internships:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInternships();
  }, [selectedDomain, selectedWorkMode]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchInternships();
  };

  const handleToggleSave = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      const res = await toggleSaveInternship(id);
      setInternships(prev => prev.map(item => item.id === id ? { ...item, is_saved: res.is_saved } : item));
      if (selectedInternship && selectedInternship.id === id) {
        setSelectedInternship(prev => ({ ...prev, is_saved: res.is_saved }));
      }
    } catch (err) {
      alert('Error updating bookmark: ' + err.message);
    }
  };

  const handleOpenDetail = async (id) => {
    setModalLoading(true);
    try {
      const data = await getInternshipDetail(id);
      setSelectedInternship(data);
    } catch (err) {
      alert('Failed to load internship detail: ' + err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleApply = async (id) => {
    setApplying(true);
    try {
      await applyInternship(id, applyNotes || 'Submitted through InternPath AI');
      setToastMessage('Application submitted successfully! Track it in your Application Kanban.');
      setTimeout(() => setToastMessage(''), 4000);
      fetchInternships();
      if (selectedInternship) {
        setSelectedInternship(prev => ({
          ...prev,
          application: { status: 'Applied', application_date: 'Today' }
        }));
      }
    } catch (err) {
      alert(err.message || 'Error submitting application');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Discover & Match Internships</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing {internships.length} sample opportunities matching your profile criteria
            </p>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search title, skills or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </form>
        </div>

        {/* Work Mode & Domain Filter Pills */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Domain Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Domain:
            </span>
            {DOMAINS.map((domain) => (
              <button
                key={domain}
                onClick={() => setSelectedDomain(domain)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedDomain === domain
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {domain}
              </button>
            ))}
          </div>

          {/* Work Mode Filter */}
          <div className="flex items-center gap-2 pt-1 text-xs">
            <span className="font-bold text-slate-400">Work Mode:</span>
            {['All', 'Remote', 'Hybrid', 'Onsite'].map((mode) => (
              <button
                key={mode}
                onClick={() => setSelectedWorkMode(mode)}
                className={`px-2.5 py-0.5 rounded-lg font-semibold transition-all ${
                  selectedWorkMode === mode
                    ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-200 text-xs font-bold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={onNavigateToApplications}
            className="underline hover:text-emerald-900 font-extrabold"
          >
            View Applications →
          </button>
        </div>
      )}

      {/* Internship Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
        </div>
      ) : internships.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">No matching internships found</h4>
          <p className="text-xs text-slate-500 mt-1">Try resetting your domain or search filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {internships.map((item) => {
            const matchScore = item.match_percentage || 75;
            const matchTier = item.match_tier || 'strong';

            return (
              <div
                key={item.id}
                className="group relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="p-5">
                  {/* Card Header: Company Logo, Domain & Match Badge */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {item.logo_url ? (
                          <img src={item.logo_url} alt={item.company_name} className="w-full h-full object-cover" />
                        ) : (
                          <Briefcase className="w-5 h-5 text-indigo-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{item.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{item.company_name}</p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleToggleSave(item.id, e)}
                      className={`p-2 rounded-xl transition-colors ${
                        item.is_saved
                          ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950'
                          : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                      title={item.is_saved ? 'Remove Bookmark' : 'Save Internship'}
                    >
                      {item.is_saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Compatibility Badge Bar */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Match Compatibility:</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-indigo-700 dark:text-indigo-300">{matchScore}%</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        matchScore >= 80 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                        matchScore >= 65 ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' :
                        'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {item.match_label}
                      </span>
                    </div>
                  </div>

                  {/* Key Metadata Pills */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 mb-3">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{item.location} ({item.work_mode})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400 col-span-2">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>{item.stipend}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {item.description}
                  </p>

                  {/* Required Skills Tags */}
                  <div className="flex flex-wrap gap-1">
                    {item.required_skills.slice(0, 4).map((sk, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        {sk}
                      </span>
                    ))}
                    {item.required_skills.length > 4 && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded text-slate-400">
                        +{item.required_skills.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenExplainModal(item.id)}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Why Match?</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenDetail(item.id)}
                      className="px-3 py-1.5 text-xs font-bold rounded-xl text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      Details
                    </button>
                    {item.application_status ? (
                      <span className="px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {item.application_status}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApply(item.id)}
                        className="px-3.5 py-1.5 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAILED INTERNSHIP MODAL */}
      {selectedInternship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {selectedInternship.logo_url ? (
                    <img src={selectedInternship.logo_url} alt={selectedInternship.company_name} className="w-full h-full object-cover" />
                  ) : (
                    <Briefcase className="w-6 h-6 text-indigo-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedInternship.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedInternship.company_name} • {selectedInternship.location} ({selectedInternship.work_mode})
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      {selectedInternship.stipend}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
                      Duration: {selectedInternship.duration}
                    </span>
                    <span className="text-xs font-semibold text-amber-600 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950">
                      Deadline: {selectedInternship.application_deadline}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedInternship(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Match Summary */}
              {selectedInternship.match && (
                <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-extrabold text-indigo-900 dark:text-indigo-200">
                      Profile Compatibility: {selectedInternship.match.match_percentage}% ({selectedInternship.match.match_label})
                    </span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                      {selectedInternship.match.explanation}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const id = selectedInternship.id;
                      setSelectedInternship(null);
                      onOpenExplainModal(id);
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 flex-shrink-0 ml-3"
                  >
                    Detailed Analysis
                  </button>
                </div>
              )}

              <div>
                <h5 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-1.5">
                  About the Opportunity
                </h5>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedInternship.description}
                </p>
              </div>

              {selectedInternship.responsibilities && (
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-1.5">
                    Responsibilities
                  </h5>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {selectedInternship.responsibilities}
                  </p>
                </div>
              )}

              {selectedInternship.required_project_experience && (
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-1.5">
                    Required Project Experience
                  </h5>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {selectedInternship.required_project_experience}
                  </p>
                </div>
              )}

              <div>
                <h5 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-1.5">
                  Eligibility Criteria
                </h5>
                <p className="text-slate-600 dark:text-slate-300">
                  {selectedInternship.eligibility}
                </p>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-2">
                  Required & Preferred Skills
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {selectedInternship.required_skills?.map((sk, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200">
                      {sk} (Required)
                    </span>
                  ))}
                  {selectedInternship.preferred_skills?.map((sk, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {sk} (Preferred)
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-850">
              <button
                onClick={(e) => handleToggleSave(selectedInternship.id, e)}
                className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5"
              >
                {selectedInternship.is_saved ? <BookmarkCheck className="w-4 h-4 text-indigo-600" /> : <Bookmark className="w-4 h-4" />}
                <span>{selectedInternship.is_saved ? 'Bookmarked' : 'Save'}</span>
              </button>

              {selectedInternship.application ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Already Applied</span>
                  <span className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Status: {selectedInternship.application.status}
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => handleApply(selectedInternship.id)}
                  disabled={applying}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{applying ? 'Submitting Application...' : 'Apply Now'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
