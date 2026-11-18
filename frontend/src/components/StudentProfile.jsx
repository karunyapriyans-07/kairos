import React, { useState, useEffect } from 'react';
import { 
  User, 
  School, 
  BookOpen, 
  Calendar, 
  MapPin, 
  Clock, 
  Briefcase, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  GitBranch, 
  Award, 
  Save, 
  Sparkles,
  Camera
} from 'lucide-react';
import { 
  getStudentProfile, 
  updateStudentProfile, 
  addStudentSkill, 
  deleteStudentSkill, 
  addStudentProject, 
  deleteStudentProject, 
  addStudentCert, 
  deleteStudentCert 
} from '../api';

export default function StudentProfile({ user, onProfileUpdated }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Edit form state
  const [formData, setFormData] = useState({});

  // Skill Add Modal / Form
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProf, setNewSkillProf] = useState('Intermediate');

  // Project Add Modal
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projTech, setProjTech] = useState('');
  const [projGithub, setProjGithub] = useState('');
  const [projLive, setProjLive] = useState('');

  // Cert Add Modal
  const [showCertModal, setShowCertModal] = useState(false);
  const [certName, setCertName] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certDate, setCertDate] = useState('');
  const [certUrl, setCertUrl] = useState('');

  async function loadProfile() {
    try {
      const res = await getStudentProfile();
      setProfile(res);
      setFormData({
        name: res.name || '',
        college: res.college || '',
        degree: res.degree || 'B.Tech',
        department: res.department || '',
        graduation_year: res.graduation_year || 2025,
        preferred_role: res.preferred_role || '',
        preferred_domain: res.preferred_domain || '',
        location_preference: res.location_preference || 'Remote / Hybrid',
        internship_duration: res.internship_duration || '3-6 Months',
        availability: res.availability || 'Immediate (Full-time)',
        about_me: res.about_me || '',
        profile_pic: res.profile_pic || ''
      });
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, [user]);

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    try {
      await updateStudentProfile(formData);
      setIsEditingInfo(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      loadProfile();
      if (onProfileUpdated) onProfileUpdated();
    } catch (err) {
      alert('Error updating profile: ' + err.message);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    try {
      await addStudentSkill(newSkillName.trim(), newSkillProf);
      setNewSkillName('');
      setShowSkillModal(false);
      loadProfile();
    } catch (err) {
      alert('Error adding skill: ' + err.message);
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await deleteStudentSkill(id);
      loadProfile();
    } catch (err) {
      alert('Error removing skill: ' + err.message);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!projTitle.trim()) return;
    try {
      await addStudentProject({
        title: projTitle,
        description: projDesc,
        tech_stack: projTech,
        github_url: projGithub,
        live_url: projLive
      });
      setProjTitle('');
      setProjDesc('');
      setProjTech('');
      setProjGithub('');
      setProjLive('');
      setShowProjectModal(false);
      loadProfile();
    } catch (err) {
      alert('Error adding project: ' + err.message);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm('Are you sure you want to remove this project?')) return;
    try {
      await deleteStudentProject(id);
      loadProfile();
    } catch (err) {
      alert('Error removing project: ' + err.message);
    }
  };

  const handleAddCert = async (e) => {
    e.preventDefault();
    if (!certName.trim()) return;
    try {
      await addStudentCert({
        name: certName,
        issuer: certIssuer,
        issue_date: certDate,
        credential_url: certUrl
      });
      setCertName('');
      setCertIssuer('');
      setCertDate('');
      setCertUrl('');
      setShowCertModal(false);
      loadProfile();
    } catch (err) {
      alert('Error adding certification: ' + err.message);
    }
  };

  const handleDeleteCert = async (id) => {
    try {
      await deleteStudentCert(id);
      loadProfile();
    } catch (err) {
      alert('Error removing certification: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const completion = profile?.profile_completion || 85;

  return (
    <div className="space-y-6">
      {/* Top Banner with Profile Completeness */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img
              src={profile?.profile_pic || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
              alt={profile?.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-600 shadow-md"
            />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{profile?.name}</h2>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                {profile?.degree} • Class of {profile?.graduation_year}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {profile?.preferred_role} • {profile?.college}
            </p>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
              Domain Preference: {profile?.preferred_domain}
            </p>
          </div>
        </div>

        {/* Profile Completion Bar */}
        <div className="w-full md:w-72 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-slate-700 dark:text-slate-300">Profile Completion</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">{completion}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-electric-500 h-2 rounded-full transition-all duration-500" style={{ width: `${completion}%` }} />
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5">
            {completion >= 90 ? 'High profile quality unlocks top internship matches' : 'Add projects and skills to reach 100%'}
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile changes updated and saved to database!</span>
        </div>
      )}

      {/* Main Profile Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Academic & Preference Info */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Academic & Preferences</h3>
            <button
              onClick={() => setIsEditingInfo(!isEditingInfo)}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingInfo ? 'Cancel' : 'Edit Info'}</span>
            </button>
          </div>

          {isEditingInfo ? (
            <form onSubmit={handleUpdateInfo} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">College / Institute</label>
                <input
                  type="text"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Degree</label>
                  <input
                    type="text"
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Grad Year</label>
                  <input
                    type="number"
                    value={formData.graduation_year}
                    onChange={(e) => setFormData({ ...formData, graduation_year: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Preferred Role</label>
                <input
                  type="text"
                  value={formData.preferred_role}
                  onChange={(e) => setFormData({ ...formData, preferred_role: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Domain Preference</label>
                <select
                  value={formData.preferred_domain}
                  onChange={(e) => setFormData({ ...formData, preferred_domain: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="Python Development">Python Development</option>
                  <option value="AI / Machine Learning">AI / Machine Learning</option>
                  <option value="Data Analytics">Data Analytics</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Java Development">Java Development</option>
                  <option value="Cloud Computing">Cloud Computing</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">About Me</label>
                <textarea
                  rows={3}
                  value={formData.about_me}
                  onChange={(e) => setFormData({ ...formData, about_me: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md flex items-center justify-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </form>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <School className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-500 dark:text-slate-400 block">Institution</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{profile?.college}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <BookOpen className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-500 dark:text-slate-400 block">Degree & Major</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{profile?.degree} in {profile?.department}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-500 dark:text-slate-400 block">Graduation Batch</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{profile?.graduation_year}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Briefcase className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-500 dark:text-slate-400 block">Preferred Role & Domain</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{profile?.preferred_role} ({profile?.preferred_domain})</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-500 dark:text-slate-400 block">Work Mode & Duration</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{profile?.location_preference} • {profile?.internship_duration}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-500 dark:text-slate-400 block">Availability</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{profile?.availability}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-500 dark:text-slate-400 block mb-1">About Me</span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  "{profile?.about_me || 'Passionate software engineering intern focused on building production applications.'}"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right 2 Columns: Skills, Projects, Certifications */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. SKILLS SECTION */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Technical Skills ({profile?.skills?.length || 0})</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Used by the 45% skill match algorithm</p>
              </div>
              <button
                onClick={() => setShowSkillModal(true)}
                className="px-3 py-1.5 rounded-xl font-bold text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {(profile?.skills || []).map((sk) => (
                <div
                  key={sk.id}
                  className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-xs transition-all hover:border-indigo-400"
                >
                  <span className="font-bold text-slate-900 dark:text-white">{sk.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                    sk.proficiency === 'Advanced' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                    sk.proficiency === 'Intermediate' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' :
                    'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {sk.proficiency}
                  </span>
                  <button
                    onClick={() => handleDeleteSkill(sk.id)}
                    className="text-slate-400 hover:text-rose-500 ml-1 transition-colors"
                    title="Remove Skill"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Skill Modal */}
            {showSkillModal && (
              <div className="mt-4 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 animate-fadeIn">
                <form onSubmit={handleAddSkill} className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Skill name (e.g. Docker, TypeScript, PyTorch)"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    className="w-full sm:flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <select
                    value={newSkillProf}
                    onChange={(e) => setNewSkillProf(e.target.value)}
                    className="w-full sm:w-36 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSkillModal(false)}
                      className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* 2. PROJECTS SECTION */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Portfolio Projects ({profile?.projects?.length || 0})</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Used by the 20% project experience scoring vector</p>
              </div>
              <button
                onClick={() => setShowProjectModal(true)}
                className="px-3 py-1.5 rounded-xl font-bold text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>
            </div>

            <div className="space-y-4">
              {(profile?.projects || []).map((proj) => (
                <div
                  key={proj.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 relative group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{proj.title}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{proj.description}</p>
                      
                      <div className="mt-2.5 flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Tech:</span>
                        {proj.tech_stack.split(',').map((t, idx) => (
                          <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400">
                            {t.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {proj.github_url && (
                        <a href={proj.github_url} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-700">
                          <GitBranch className="w-4 h-4" />
                        </a>
                      )}
                      {proj.live_url && (
                        <a href={proj.live_url} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-700">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Project Modal */}
            {showProjectModal && (
              <div className="mt-4 p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 animate-fadeIn">
                <form onSubmit={handleAddProject} className="space-y-3 text-xs">
                  <h4 className="font-bold text-slate-900 dark:text-white">Add New Showcase Project</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <input
                        type="text"
                        required
                        placeholder="Project Title (e.g. Distributed Task Queue)"
                        value={projTitle}
                        onChange={(e) => setProjTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="col-span-2">
                      <textarea
                        required
                        rows={2}
                        placeholder="Project description, architecture highlights, and impact..."
                        value={projDesc}
                        onChange={(e) => setProjDesc(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="text"
                        required
                        placeholder="Technologies (e.g. React, Python, PostgreSQL, Redis)"
                        value={projTech}
                        onChange={(e) => setProjTech(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <input
                        type="url"
                        placeholder="GitHub URL (https://...)"
                        value={projGithub}
                        onChange={(e) => setProjGithub(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <input
                        type="url"
                        placeholder="Live Demo URL (https://...)"
                        value={projLive}
                        onChange={(e) => setProjLive(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setShowProjectModal(false)}
                      className="px-4 py-2 rounded-xl font-semibold text-slate-600 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md"
                    >
                      Save Project
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* 3. CERTIFICATIONS SECTION */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Certifications ({profile?.certifications?.length || 0})</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Industry verified credentials</p>
              </div>
              <button
                onClick={() => setShowCertModal(true)}
                className="px-3 py-1.5 rounded-xl font-bold text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Certification</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(profile?.certifications || []).map((cert) => (
                <div
                  key={cert.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-2.5">
                    <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white">{cert.name}</h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{cert.issuer} {cert.issue_date && `• ${cert.issue_date}`}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteCert(cert.id)}
                    className="text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Certification Modal */}
            {showCertModal && (
              <div className="mt-4 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 animate-fadeIn">
                <form onSubmit={handleAddCert} className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <input
                        type="text"
                        required
                        placeholder="Certification Title (e.g. AWS Certified Developer)"
                        value={certName}
                        onChange={(e) => setCertName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Issuer (e.g. AWS, Meta, Google)"
                        value={certIssuer}
                        onChange={(e) => setCertIssuer(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Issue Date (e.g. 2024-05)"
                        value={certDate}
                        onChange={(e) => setCertDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => setShowCertModal(false)}
                      className="px-3 py-1.5 rounded-xl font-semibold text-slate-600 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md"
                    >
                      Save Certification
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
