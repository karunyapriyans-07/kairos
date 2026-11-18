const API_BASE = '/api';

function getHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const user = JSON.parse(localStorage.getItem('internpath_user') || 'null');
  if (user && user.id) {
    headers['X-User-Id'] = user.id.toString();
    headers['Authorization'] = `Bearer ${user.token || user.id}`;
  }
  return headers;
}

export async function request(endpoint, options = {}) {
  const isFormData = options.body instanceof FormData;
  const headers = isFormData ? {} : getHeaders();
  
  if (isFormData) {
    const user = JSON.parse(localStorage.getItem('internpath_user') || 'null');
    if (user && user.id) {
      headers['X-User-Id'] = user.id.toString();
      headers['Authorization'] = `Bearer ${user.token || user.id}`;
    }
  }

  const config = {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {})
    }
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  if (!response.ok) {
    let errorMsg = 'An error occurred';
    try {
      const errData = await response.json();
      errorMsg = errData.detail || errData.message || errorMsg;
    } catch {
      errorMsg = await response.text();
    }
    throw new Error(errorMsg);
  }
  return await response.json();
}

// Authentication
export const authLogin = (email, password) =>
  request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const authRegister = (data) =>
  request('/auth/register', { method: 'POST', body: JSON.stringify(data) });

export const authMe = () =>
  request('/auth/me', { method: 'GET' });

// Student Profile & Skills
export const getStudentProfile = () => request('/student/profile');
export const updateStudentProfile = (data) =>
  request('/student/profile', { method: 'PUT', body: JSON.stringify(data) });
export const addStudentSkill = (skill_name, proficiency) =>
  request('/student/skills', { method: 'POST', body: JSON.stringify({ skill_name, proficiency }) });
export const deleteStudentSkill = (id) =>
  request(`/student/skills/${id}`, { method: 'DELETE' });
export const addStudentProject = (data) =>
  request('/student/projects', { method: 'POST', body: JSON.stringify(data) });
export const deleteStudentProject = (id) =>
  request(`/student/projects/${id}`, { method: 'DELETE' });
export const addStudentCert = (data) =>
  request('/student/certifications', { method: 'POST', body: JSON.stringify(data) });
export const deleteStudentCert = (id) =>
  request(`/student/certifications/${id}`, { method: 'DELETE' });

// Resume Analyzer
export const uploadResumePdf = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return request('/resume/upload', { method: 'POST', body: formData });
};
export const analyzeResumeText = (text) =>
  request('/resume/analyze-text', { method: 'POST', body: JSON.stringify({ text }) });
export const saveExtractedResumeData = (data) =>
  request('/resume/save-extracted', { method: 'POST', body: JSON.stringify(data) });

// Internships
export const getInternships = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request(`/internships${qs ? `?${qs}` : ''}`);
};
export const getInternshipDetail = (id) => request(`/internships/${id}`);
export const toggleSaveInternship = (id) =>
  request(`/internships/${id}/save`, { method: 'POST' });
export const applyInternship = (id, notes = '') =>
  request(`/internships/${id}/apply`, { method: 'POST', body: JSON.stringify({ notes }) });

// AI Matching & Skill Gap
export const getMatchingRecommendations = (tab = 'best', sortBy = 'match') =>
  request(`/matching/recommendations?tab=${tab}&sort_by=${sortBy}`);
export const getMatchExplanation = (id) =>
  request(`/matching/explain/${id}`);
export const getSkillGapAnalysis = (id) =>
  request(`/skill-gap/${id}`);

// Learning Roadmap
export const getRoadmap = () => request('/roadmap');
export const generateRoadmap = (internship_id, target_role, missing_skills = []) =>
  request('/roadmap/generate', {
    method: 'POST',
    body: JSON.stringify({ internship_id, target_role, missing_skills })
  });
export const toggleRoadmapTask = (taskId, is_completed) =>
  request(`/roadmap/tasks/${taskId}/toggle`, {
    method: 'PUT',
    body: JSON.stringify({ is_completed })
  });

// Applications
export const getApplications = () => request('/applications');
export const updateApplicationStatus = (appId, status, notes = '', next_action = '', interview_date = '') =>
  request(`/applications/${appId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, notes, next_action, interview_date })
  });
export const deleteApplication = (appId) =>
  request(`/applications/${appId}`, { method: 'DELETE' });

// Progress Monitoring
export const getProgressReports = () => request('/progress/reports');
export const submitProgressReport = (data) =>
  request('/progress/reports', { method: 'POST', body: JSON.stringify(data) });
export const getProgressMilestones = () => request('/progress/milestones');

// Mentor
export const getMentorDashboard = () => request('/mentor/dashboard');
export const getMentorStudents = () => request('/mentor/students');
export const getMentorReports = () => request('/mentor/reports');
export const reviewMentorReport = (reportId, reviewData) =>
  request(`/mentor/reports/${reportId}/review`, {
    method: 'POST',
    body: JSON.stringify(reviewData)
  });

// Analytics
export const getCareerReadiness = () => request('/analytics/readiness');
export const getDashboardAnalytics = () => request('/analytics/dashboard');

// Notifications
export const getNotifications = () => request('/notifications');
export const markNotificationRead = (id) =>
  request(`/notifications/${id}/read`, { method: 'PUT' });
export const markAllNotificationsRead = () =>
  request('/notifications/read-all', { method: 'PUT' });
