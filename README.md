# InternPath AI — AI-Powered Internship Matching, Skill Gap Analysis & Progress Platform

> **Hackathon Prototype** — A modern, fully functional full-stack web application designed to bridge the gap between student skills, intelligent internship matching, personalized skill roadmaps, and structured mentor evaluations.

---

## 🌟 Key Highlights & Innovations

1. **Intelligent 5-Factor Weighted Matching (Python Backend)**:
   - Evaluates compatibility using exact weights: **Skill Match (45%)**, **Project Experience (20%)**, **Domain Interest (15%)**, **Eligibility (10%)**, **Availability (10%)**.
   - Distinct candidate profiles yield genuinely different recommendations and compatibility scores.
2. **Explainable AI Engine ("Why This Match?")**:
   - Every opportunity presents a transparent breakdown of points earned in all 5 vectors, matched skills with proficiency, missing skills with priority, and dynamically generated explanations from actual scoring data.
3. **AI Resume Analyzer & Scorer**:
   - Real-time PDF parsing using `pypdf` across 150+ technical skills taxonomy.
   - Calculates a transparent resume score (0–100) across 6 categories (Skills, Projects, Experience, Certifications, Education, Structure) with 1-click sync to profile.
4. **Skill Gap Analyzer & Auto-Generated 4-Week Roadmaps**:
   - Side-by-side comparison matrix (Matched vs Missing skills with High/Medium/Low priority).
   - Generates tailored 4-week learning plans with persistent task completion checkboxes and celebration confetti.
5. **Kanban & Table Application Tracker**:
   - Organizes applications across 6 stages: *Saved*, *Applied*, *Assessment*, *Interview*, *Selected*, *Rejected*.
   - Enforces duplicate application prevention.
6. **Internship Progress Monitoring & Mentor Portal**:
   - Students submit weekly sprint reports logging hours, deliverables, challenges, and PR links.
   - Industry mentors review submissions with 1–5 star rubrics across 5 criteria (Technical, Communication, Problem-Solving, Task Completion, Initiative) plus written feedback.
7. **Career Readiness Index**:
   - Transparent 0–100 index tracking employability across 5 classification tiers (*Building Foundations* to *Highly Prepared*).

---

## 🔑 Hackathon Demo Credentials

The platform is preloaded with realistic demo personas. You can use the **1-Click Judge Switcher** bar at the top of the interface or log in manually:

| Persona | Email | Password | Profile Focus |
| :--- | :--- | :--- | :--- |
| **Student A** | `student@internpath.demo` | `Student123!` | Full-Stack & Python Development (React, FastAPI, SQL, Cloud) |
| **Student B** | `student2@internpath.demo` | `Student123!` | Data Analytics & AI (Python, SQL, Power BI, Scikit-Learn) |
| **Mentor** | `mentor@internpath.demo` | `Mentor123!` | Dr. Rajesh Kumar (Principal Staff Engineer & Industry Mentor) |

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Recharts (Area, Donut, Bar charts), Canvas Confetti.
- **Backend**: Python 3.14, FastAPI, SQLAlchemy 2, Pydantic, PyPDF, Uvicorn.
- **Database**: SQLite (persisted in `database/internpath.db`).
- **Architecture**: Unified SPA serving from FastAPI or standalone Vite proxy.

---

## 🚀 Quickstart & Run Instructions

### Prerequisites
- Python 3.10+ (with `pip`)
- Node.js v18+ and `npm`

### 1. Install Backend Dependencies
```bash
py -m pip install fastapi uvicorn sqlalchemy pydantic python-multipart pypdf
```

### 2. Seed Database
```bash
cd backend
py seed_data.py
```
*(Seeds 2 student profiles, 1 mentor, 20 realistic sample internships across 8 domains, existing applications, roadmaps, and reports).*

### 3. Build & Run Frontend (Optional if running unified server)
```bash
cd frontend
npm install
npm run build
```

### 4. Start the Application Server
Run the unified FastAPI server from the `backend/` directory:
```bash
cd backend
py -m uvicorn main:app --host 127.0.0.1 --port 8000
```

Open your browser and navigate to:
👉 **[http://127.0.0.1:8000](http://127.0.0.1:8000)**

---

## 🧪 Automated Acceptance Test Suite

Run the full end-to-end acceptance test suite covering all 12 platform workflows:
```bash
cd backend
py test_flows.py
```

Expected output:
```
============================================================
ALL 12 ACCEPTANCE TESTS PASSED WITH 100% SUCCESS!
============================================================
```

---

## 📁 Project Directory Structure

```
ai marine/
├── backend/
│   ├── main.py               # FastAPI application with REST API & SPA fallback
│   ├── database.py           # SQLite & SQLAlchemy engine
│   ├── models.py             # ORM models (Users, Profiles, Internships, Reports, etc.)
│   ├── schemas.py            # Pydantic request/response models
│   ├── matching_engine.py    # 5-factor weighted matching algorithm (45-20-15-10-10)
│   ├── resume_analyzer.py    # PDF & text resume parser with 100-pt rubric
│   ├── career_readiness.py   # Career Readiness Index (0-100) calculator
│   ├── seed_data.py          # Database seeder with 20 internships & demo users
│   └── test_flows.py         # Automated end-to-end acceptance tests
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LandingPage.jsx         # Public landing page with hero, features & stats
│   │   │   ├── AuthModal.jsx           # Sign in, register & 1-click demo logins
│   │   │   ├── Sidebar.jsx             # Role-based sidebar navigation
│   │   │   ├── Header.jsx              # Topbar with judge switcher & notifications
│   │   │   ├── DashboardOverview.jsx   # Student KPI cards & visual charts
│   │   │   ├── StudentProfile.jsx      # Skills, proficiencies, projects & certs
│   │   │   ├── ResumeAnalyzer.jsx      # PDF upload, score breakdown & profile sync
│   │   │   ├── FindInternships.jsx     # 20+ listings, domain filters & apply modal
│   │   │   ├── MatchingEngineView.jsx  # Compatibility tabs & explainability
│   │   │   ├── ExplainableModal.jsx    # "Why This Match?" 5-vector breakdown
│   │   │   ├── SkillGapView.jsx        # Matched vs missing skill matrix
│   │   │   ├── RoadmapView.jsx         # 4-week learning milestones & task toggle
│   │   │   ├── ApplicationTracker.jsx  # Kanban board & table across 6 stages
│   │   │   ├── InternshipProgress.jsx  # Weekly sprint report submission & milestones
│   │   │   ├── CareerAnalytics.jsx     # Career Readiness Index & pipeline charts
│   │   │   ├── MentorDashboard.jsx     # Review queue & 5-criteria rubric evaluation
│   │   │   └── NotificationCenter.jsx  # In-app notifications with mark-as-read
│   │   ├── api.js                      # REST API client
│   │   ├── App.jsx                     # Root application coordinator
│   │   └── main.jsx                    # React DOM entry
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── database/
│   └── internpath.db         # SQLite database file
└── docs/
    ├── API_DOCUMENTATION.md   # Comprehensive REST API reference
    └── MATCHING_ALGORITHM.md  # Mathematical formulas & weighting rubric
```

---

## ⚖️ Disclaimer

*InternPath AI is a software platform prototype built for demonstration purposes. All company listings, applicant metrics, and career readiness scores are sample data intended for hackathon evaluation.*
