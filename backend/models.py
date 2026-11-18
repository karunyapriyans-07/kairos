from sqlalchemy import Column, Integer, String, Text, Boolean, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="student") # student, mentor, admin
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    student_profile = relationship("StudentProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    mentor_profile = relationship("MentorProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")

class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    college = Column(String(255), default="Demo Institute of Technology")
    degree = Column(String(100), default="B.Tech")
    department = Column(String(100), default="Computer Science & Engineering")
    graduation_year = Column(Integer, default=2025)
    preferred_role = Column(String(100), default="Full Stack Developer")
    preferred_domain = Column(String(100), default="Web Development")
    location_preference = Column(String(100), default="Remote / Hybrid")
    internship_duration = Column(String(50), default="3-6 Months")
    availability = Column(String(100), default="Immediate (Full-time)")
    about_me = Column(Text, default="")
    profile_pic = Column(String(255), default="")
    resume_path = Column(String(255), default="")
    resume_score = Column(Float, default=78.0)
    resume_analysis_json = Column(Text, default="{}")

    user = relationship("User", back_populates="student_profile")
    skills = relationship("StudentSkill", back_populates="student", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="student", cascade="all, delete-orphan")
    certifications = relationship("Certification", back_populates="student", cascade="all, delete-orphan")
    saved_internships = relationship("SavedInternship", back_populates="student", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="student", cascade="all, delete-orphan")
    roadmaps = relationship("Roadmap", back_populates="student", cascade="all, delete-orphan")
    weekly_reports = relationship("WeeklyReport", back_populates="student", cascade="all, delete-orphan")
    readiness_history = relationship("ReadinessHistory", back_populates="student", cascade="all, delete-orphan")

class MentorProfile(Base):
    __tablename__ = "mentor_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    designation = Column(String(100), default="Senior Engineering Lead")
    organization = Column(String(255), default="TechCorp Global")
    department = Column(String(100), default="Engineering & Innovation")
    expertise = Column(String(255), default="Full Stack, Cloud & Python")
    bio = Column(Text, default="Mentoring passionate students to build high-impact production engineering careers.")

    user = relationship("User", back_populates="mentor_profile")
    assignments = relationship("MentorAssignment", back_populates="mentor", cascade="all, delete-orphan")
    feedback_given = relationship("MentorFeedback", back_populates="mentor", cascade="all, delete-orphan")

class StudentSkill(Base):
    __tablename__ = "student_skills"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
    skill_name = Column(String(100), nullable=False)
    proficiency = Column(String(50), default="Intermediate") # Beginner, Intermediate, Advanced

    student = relationship("StudentProfile", back_populates="skills")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    tech_stack = Column(String(255), nullable=False)
    github_url = Column(String(255), default="")
    live_url = Column(String(255), default="")

    student = relationship("StudentProfile", back_populates="projects")

class Certification(Base):
    __tablename__ = "certifications"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    issuer = Column(String(255), nullable=False)
    issue_date = Column(String(100), default="")
    credential_url = Column(String(255), default="")

    student = relationship("StudentProfile", back_populates="certifications")

class Internship(Base):
    __tablename__ = "internships"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    company_name = Column(String(255), nullable=False)
    logo_url = Column(String(255), default="")
    description = Column(Text, nullable=False)
    domain = Column(String(100), nullable=False) # AI / Machine Learning, Python Development, Web Development, Data Analytics, UI/UX Design, Cybersecurity, Java Development, Cloud Computing
    duration = Column(String(50), default="3 Months")
    location = Column(String(100), default="Bangalore, India")
    work_mode = Column(String(50), default="Remote") # Remote, Hybrid, Onsite
    stipend = Column(String(100), default="₹25,000 / month")
    eligibility = Column(String(255), default="Pre-final or Final year students in CS/IT or related field")
    application_deadline = Column(String(100), default="2026-12-15")
    responsibilities = Column(Text, default="")
    required_project_experience = Column(Text, default="")
    required_skills = Column(Text, default="") # Comma-separated
    preferred_skills = Column(Text, default="") # Comma-separated
    is_sample = Column(Boolean, default=True)

    saved_by = relationship("SavedInternship", back_populates="internship", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="internship", cascade="all, delete-orphan")

class SavedInternship(Base):
    __tablename__ = "saved_internships"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
    internship_id = Column(Integer, ForeignKey("internships.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("StudentProfile", back_populates="saved_internships")
    internship = relationship("Internship", back_populates="saved_by")

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
    internship_id = Column(Integer, ForeignKey("internships.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(50), default="Applied") # Saved, Applied, Assessment, Interview, Selected, Rejected
    application_date = Column(String(50), default=datetime.utcnow().strftime("%Y-%m-%d"))
    deadline = Column(String(50), default="")
    notes = Column(Text, default="")
    next_action = Column(String(255), default="Review technical round questions")
    interview_date = Column(String(50), default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    student = relationship("StudentProfile", back_populates="applications")
    internship = relationship("Internship", back_populates="applications")

class Roadmap(Base):
    __tablename__ = "roadmaps"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
    internship_id = Column(Integer, ForeignKey("internships.id", ondelete="SET NULL"), nullable=True)
    target_role = Column(String(255), nullable=False)
    title = Column(String(255), default="Skill Mastery Roadmap")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    student = relationship("StudentProfile", back_populates="roadmaps")
    tasks = relationship("RoadmapTask", back_populates="roadmap", cascade="all, delete-orphan", order_by="RoadmapTask.week_number")

class RoadmapTask(Base):
    __tablename__ = "roadmap_tasks"

    id = Column(Integer, primary_key=True, index=True)
    roadmap_id = Column(Integer, ForeignKey("roadmaps.id", ondelete="CASCADE"), nullable=False)
    week_number = Column(Integer, default=1)
    skill_name = Column(String(100), nullable=False)
    objective = Column(String(255), nullable=False)
    estimated_duration = Column(String(50), default="5-8 hours")
    task_description = Column(Text, nullable=False)
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)

    roadmap = relationship("Roadmap", back_populates="tasks")

class WeeklyReport(Base):
    __tablename__ = "weekly_reports"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
    internship_id = Column(Integer, ForeignKey("internships.id", ondelete="SET NULL"), nullable=True)
    week_number = Column(Integer, nullable=False)
    tasks_completed = Column(Text, nullable=False)
    hours_worked = Column(Float, default=20.0)
    skills_learned = Column(String(255), default="")
    project_updates = Column(Text, default="")
    challenges_faced = Column(Text, default="")
    next_week_goals = Column(Text, default="")
    evidence_links = Column(String(255), default="")
    submission_date = Column(String(50), default=datetime.utcnow().strftime("%Y-%m-%d"))
    mentor_id = Column(Integer, ForeignKey("mentor_profiles.id", ondelete="SET NULL"), nullable=True)
    status = Column(String(50), default="Submitted") # Submitted, Approved, Needs Revision
    reviewed_at = Column(DateTime, nullable=True)

    student = relationship("StudentProfile", back_populates="weekly_reports")
    feedback = relationship("MentorFeedback", back_populates="report", uselist=False, cascade="all, delete-orphan")

class MentorAssignment(Base):
    __tablename__ = "mentor_assignments"

    id = Column(Integer, primary_key=True, index=True)
    mentor_id = Column(Integer, ForeignKey("mentor_profiles.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(Integer, ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
    internship_id = Column(Integer, ForeignKey("internships.id", ondelete="SET NULL"), nullable=True)
    assigned_at = Column(DateTime, default=datetime.utcnow)

    mentor = relationship("MentorProfile", back_populates="assignments")
    student = relationship("StudentProfile")
    internship = relationship("Internship")

class MentorFeedback(Base):
    __tablename__ = "mentor_feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("weekly_reports.id", ondelete="CASCADE"), nullable=False)
    mentor_id = Column(Integer, ForeignKey("mentor_profiles.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(Integer, ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
    technical_score = Column(Integer, default=4) # 1 to 5
    communication_score = Column(Integer, default=5) # 1 to 5
    problem_solving_score = Column(Integer, default=4) # 1 to 5
    task_completion_score = Column(Integer, default=5) # 1 to 5
    initiative_score = Column(Integer, default=4) # 1 to 5
    overall_score = Column(Float, default=4.4)
    comments = Column(Text, default="Great progress on the sprint deliverables!")
    submitted_at = Column(DateTime, default=datetime.utcnow)

    report = relationship("WeeklyReport", back_populates="feedback")
    mentor = relationship("MentorProfile", back_populates="feedback_given")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="info") # deadline, roadmap, feedback, report, status, match
    is_read = Column(Boolean, default=False)
    link = Column(String(255), default="")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")

class ReadinessHistory(Base):
    __tablename__ = "readiness_history"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
    score = Column(Float, nullable=False)
    skill_score = Column(Float, default=0.0)
    project_score = Column(Float, default=0.0)
    resume_score = Column(Float, default=0.0)
    learning_score = Column(Float, default=0.0)
    application_score = Column(Float, default=0.0)
    recorded_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("StudentProfile", back_populates="readiness_history")
