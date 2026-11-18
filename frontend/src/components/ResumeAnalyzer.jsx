import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Award, 
  ArrowRight, 
  RefreshCw, 
  Layers, 
  ExternalLink,
  Code2,
  Check,
  Zap
} from 'lucide-react';
import { uploadResumePdf, analyzeResumeText, saveExtractedResumeData } from '../api';

export default function ResumeAnalyzer({ onSkillsSynced }) {
  const [file, setFile] = useState(null);
  const [pastedText, setPastedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'paste'

  // Pre-loaded realistic sample resume text for 1-click test in demo
  const sampleResumeText = `AARAV SHARMA
Email: aarav.sharma@iiit.edu | GitHub: github.com/aarav-dev | LinkedIn: linkedin.com/in/aaravsharma
Bachelor of Technology in Computer Science & Engineering (Graduation: 2025)

TECHNICAL SKILLS:
Languages: Python, JavaScript, TypeScript, SQL, HTML5, CSS3
Frameworks & Libraries: React, Node.js, Express, FastAPI, Tailwind CSS, Redux
Databases & Cloud: PostgreSQL, SQLite, MongoDB, Docker, Git, GitHub, REST API, AWS

PROJECTS:
1. Microservices E-Commerce Cloud Suite: Designed and implemented scalable catalog and checkout services using React, Node.js, and MongoDB with Stripe payment integration.
2. AI Resume Vector Matcher: Engineered high-accuracy candidate scoring tool in Python and FastAPI utilizing scikit-learn TF-IDF matrices.

CERTIFICATIONS:
Meta Front-End Developer Professional Certificate (Coursera)
AWS Certified Cloud Practitioner (Amazon Web Services)`;

  const handleFileUpload = async (selectedFile) => {
    if (!selectedFile) return;
    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a PDF format resume file.');
      return;
    }
    setFile(selectedFile);
    setError('');
    setLoading(true);

    try {
      const res = await uploadResumePdf(selectedFile);
      setAnalysis(res.analysis);
    } catch (err) {
      setError(err.message || 'Error parsing resume');
    } finally {
      setLoading(false);
    }
  };

  const handleTextAnalyze = async () => {
    const textToAnalyze = pastedText.trim() || sampleResumeText;
    setError('');
    setLoading(true);

    try {
      const res = await analyzeResumeText(textToAnalyze);
      setAnalysis(res.analysis);
    } catch (err) {
      setError(err.message || 'Error analyzing resume text');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncToProfile = async () => {
    if (!analysis) return;
    try {
      await saveExtractedResumeData({
        skills: analysis.extracted_skills,
        degree: analysis.degrees[0] || 'B.Tech',
        graduation_year: analysis.graduation_year || 2025
      });
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3500);
      if (onSkillsSynced) onSkillsSynced();
    } catch (err) {
      alert('Error syncing to profile: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Parser & Resume Scorer</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">AI Resume Analyzer</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Upload your PDF resume to extract skills, calculate your resume quality score, and discover missing sections.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setPastedText(sampleResumeText);
              setActiveTab('paste');
            }}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Load Sample Demo Resume</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {syncSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>All extracted skills and education details synced directly to your profile!</span>
        </div>
      )}

      {/* Input Selection Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload & Paste Control Box */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'upload'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Upload PDF
            </button>
            <button
              onClick={() => setActiveTab('paste')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'paste'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Paste Text
            </button>
          </div>

          {activeTab === 'upload' ? (
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-2xl p-6 text-center transition-colors">
              <input
                type="file"
                id="pdf-upload"
                accept=".pdf"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files[0])}
              />
              <label htmlFor="pdf-upload" className="cursor-pointer block">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {file ? file.name : 'Choose PDF Resume'}
                </h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Drag and drop or click to browse (Max 5MB)
                </p>
                <div className="mt-4 px-4 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl inline-block">
                  Select File
                </div>
              </label>
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                rows={10}
                placeholder="Paste plain resume text here..."
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
              <button
                onClick={handleTextAnalyze}
                disabled={loading}
                className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md flex items-center justify-center gap-1.5"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{loading ? 'Analyzing Content...' : 'Run AI Analysis'}</span>
              </button>
            </div>
          )}

          {loading && (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2" />
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                Extracting technical taxonomy & calculating weighted score...
              </p>
            </div>
          )}
        </div>

        {/* Right 2 Columns: Analysis Results */}
        <div className="lg:col-span-2 space-y-6">
          {analysis ? (
            <>
              {/* Score & Breakdown Card */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-indigo-50 dark:bg-indigo-950 border-2 border-indigo-500 flex flex-col items-center justify-center shadow-inner">
                      <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{analysis.score}</span>
                      <span className="text-[10px] font-bold text-slate-400">/ 100</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Resume Quality Score</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          analysis.score >= 80 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                          analysis.score >= 65 ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' :
                          'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {analysis.score >= 80 ? 'High Quality' : analysis.score >= 65 ? 'Competitive' : 'Needs Optimization'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Extracted {analysis.extracted_skills.length} skills • {analysis.degrees[0] || 'B.Tech'} candidate
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleSyncToProfile}
                    className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Sync Extracted Skills to Profile</span>
                  </button>
                </div>

                {/* 6 Category Breakdown */}
                <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(analysis.score_breakdown).map(([key, val]) => (
                    <div key={key} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1 truncate">{val.label}</span>
                      <div className="flex items-baseline justify-between">
                        <span className="text-base font-extrabold text-slate-900 dark:text-white">{val.score}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">/ {val.max}</span>
                      </div>
                      <div className="mt-2 w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-1 rounded-full"
                          style={{ width: `${(val.score / val.max) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Extracted Skills Section */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Extracted Technical Skills ({analysis.extracted_skills.length})</span>
                  </h4>
                  <span className="text-xs text-slate-400 font-medium">Ready to review & sync</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {analysis.extracted_skills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800 flex items-center gap-1.5"
                    >
                      <Check className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                      <span>{sk.name}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Strengths & Missing Sections */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="p-5 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-3 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Detected Strengths</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    {analysis.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold mt-0.5">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Missing Sections */}
                <div className="p-5 rounded-3xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-3 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Missing / Recommended Sections</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    {analysis.missing_sections.length > 0 ? (
                      analysis.missing_sections.map((m, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-500 font-bold mt-0.5">•</span>
                          <span>{m}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-500 italic">No critical sections missing. Solid structure!</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Improvement Suggestions */}
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Actionable Improvement Recommendations</span>
                </h4>
                <div className="space-y-2">
                  {analysis.improvement_suggestions.map((sug, idx) => (
                    <div key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                      <span className="font-bold text-indigo-500">{idx + 1}.</span>
                      <span>{sug}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">No Resume Analyzed Yet</h4>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Upload your resume PDF or click "Load Sample Demo Resume" to run the extraction engine and generate your quality score.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
