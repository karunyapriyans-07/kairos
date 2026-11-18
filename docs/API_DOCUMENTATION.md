# InternPath AI — REST API Documentation

InternPath AI provides a complete RESTful API built with Python FastAPI and SQLite/SQLAlchemy.

Base URL: `http://127.0.0.1:8000/api`

---

## 1. Authentication Endpoints

### Register User
- **POST** `/auth/register`
- **Body**:
  ```json
  {
    "name": "Aarav Sharma",
    "email": "student@internpath.demo",
    "password": "Student123!",
    "role": "student",
    "college": "IIIT",
    "degree": "B.Tech",
    "department": "Computer Science",
    "graduation_year": 2025,
    "preferred_domain": "Web Development"
  }
  ```
- **Response**: `{ "status": "success", "user": { ... } }`

### Login User
- **POST** `/auth/login`
- **Body**: `{ "email": "student@internpath.demo", "password": "Student123!" }`
- **Response**: `{ "status": "success", "user": { "id": 1, "name": "...", "role": "student", "token": "user_1" } }`

### Current User Profile
- **GET** `/auth/me`
- **Headers**: `X-User-Id: <user_id>`

---

## 2. Student Profile Endpoints

### Get Full Student Profile
- **GET** `/student/profile`
- Returns user info, academic background, preferences, skills list, projects, and certifications.

### Update Profile Info
- **PUT** `/student/profile`
- **Body**: `{ "college": "...", "degree": "...", "preferred_role": "...", "about_me": "..." }`

### Skills Management
- **POST** `/student/skills` — Add skill `{ "skill_name": "Docker", "proficiency": "Intermediate" }`
- **PUT** `/student/skills/{id}` — Update proficiency `{ "proficiency": "Advanced" }`
- **DELETE** `/student/skills/{id}` — Remove skill

### Projects Management
- **POST** `/student/projects` — Add project `{ "title": "...", "description": "...", "tech_stack": "...", "github_url": "..." }`
- **DELETE** `/student/projects/{id}` — Remove project

### Certifications Management
- **POST** `/student/certifications` — Add certification `{ "name": "...", "issuer": "...", "issue_date": "..." }`
- **DELETE** `/student/certifications/{id}` — Remove certification

---

## 3. AI Resume Analyzer Endpoints

### Upload and Analyze PDF Resume
- **POST** `/resume/upload`
- **Content-Type**: `multipart/form-data`
- **File**: PDF resume file (max 5MB)
- Returns extracted skills, transparent resume score (0-100), 6-category score breakdown, strengths, missing sections, and suggestions.

### Analyze Raw Text
- **POST** `/resume/analyze-text`
- **Body**: `{ "text": "Raw resume text..." }`

### Sync Extracted Data to Profile
- **POST** `/resume/save-extracted`
- **Body**: `{ "skills": [...], "degree": "B.Tech", "graduation_year": 2025 }`

---

## 4. Internships & AI Matching

### List Internships
- **GET** `/internships?search=...&domain=...&work_mode=...`
- Returns 20+ realistic listings with live calculated compatibility match percentages.

### Internship Detail
- **GET** `/internships/{id}`

### Bookmark / Save Internship
- **POST** `/internships/{id}/save`

### Apply for Internship
- **POST** `/internships/{id}/apply`
- **Body**: `{ "notes": "..." }`
- Enforces duplicate prevention.

### Personalized Recommendations
- **GET** `/matching/recommendations?tab=best&sort_by=match`
- Tabs: `best` (>=65%), `all`, `saved`, `applied`
- Sort: `match`, `deadline`, `stipend`

### Explainable Match ("Why This Match?")
- **GET** `/matching/explain/{id}`
- Returns full point breakdown across 5 weighted vectors:
  - Skill Match (45%)
  - Project Experience (20%)
  - Domain Interest (15%)
  - Eligibility (10%)
  - Availability (10%)
- Lists matched skills with proficiency, missing skills with priority, and a dynamic natural language explanation based on actual scoring data.

### Skill Gap Matrix
- **GET** `/skill-gap/{id}`
- Side-by-side comparison table between student profile and required qualifications.

---

## 5. Learning Roadmap Endpoints

### Get Current Roadmap
- **GET** `/roadmap`
- Returns active 4-week roadmap with task objectives, duration, and completion statuses.

### Generate Personalized Roadmap
- **POST** `/roadmap/generate`
- **Body**: `{ "internship_id": 1, "target_role": "Full Stack Developer", "missing_skills": ["Docker", "Redis"] }`

### Toggle Task Completion
- **PUT** `/roadmap/tasks/{id}/toggle`
- **Body**: `{ "is_completed": true }`
- Persists completion status and timestamp to database.

---

## 6. Applications Tracker Endpoints

### List Applications
- **GET** `/applications`
- Returns applications across all Kanban stages with next actions, notes, and deadlines.

### Update Application Stage
- **PUT** `/applications/{id}/status`
- **Body**: `{ "status": "Interview", "interview_date": "2026-11-24", "notes": "..." }`

### Delete Application
- **DELETE** `/applications/{id}`

---

## 7. Internship Progress & Mentorship

### List Weekly Reports
- **GET** `/progress/reports`

### Submit Weekly Report
- **POST** `/progress/reports`
- **Body**:
  ```json
  {
    "week_number": 3,
    "hours_worked": 24.0,
    "tasks_completed": "Constructed interactive Kanban board component...",
    "skills_learned": "Optimistic UI updates, Drag-and-Drop",
    "challenges_faced": "Drop animation glitch resolved",
    "evidence_links": "https://github.com/..."
  }
  ```

### Get Milestone Checklist
- **GET** `/progress/milestones`

### Mentor Dashboard Stats
- **GET** `/mentor/dashboard`

### Mentor Review Queue
- **GET** `/mentor/reports`

### Submit Mentor Review & Rubrics
- **POST** `/mentor/reports/{id}/review`
- **Body**:
  ```json
  {
    "status": "Approved",
    "technical_score": 5,
    "communication_score": 5,
    "problem_solving_score": 4,
    "task_completion_score": 5,
    "initiative_score": 4,
    "comments": "Outstanding production velocity. Clean commits and PR documentation."
  }
  ```

---

## 8. Career Readiness & Notifications

### Career Readiness Index
- **GET** `/analytics/readiness`
- Returns 0-100 score, classification tier, 5 category weights, and historical score trend.

### Dashboard Analytics Summary
- **GET** `/analytics/dashboard`

### Notifications
- **GET** `/notifications`
- **PUT** `/notifications/{id}/read`
- **PUT** `/notifications/read-all`
