from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

# Auth Schemas
class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    role: str = "student"
    college: Optional[str] = "Demo Institute of Technology"
    degree: Optional[str] = "B.Tech"
    department: Optional[str] = "Computer Science"
    graduation_year: Optional[int] = 2025
    preferred_domain: Optional[str] = "Web Development"

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    role: str
    profile_id: Optional[int] = None
    created_at: Optional[datetime] = None

# Skill Schemas
class SkillCreate(BaseModel):
    skill_name: str
    proficiency: str = "Intermediate"

class SkillResponse(BaseModel):
    id: int
    skill_name: str
    proficiency: str

# Project Schemas
class ProjectCreate(BaseModel):
    title: str
    description: str
    tech_stack: str
    github_url: Optional[str] = ""
    live_url: Optional[str] = ""

class ProjectResponse(BaseModel):
    id: int
    title: str
    description: str
    tech_stack: str
    github_url: Optional[str] = ""
    live_url: Optional[str] = ""

# Certification Schemas
class CertificationCreate(BaseModel):
    name: str
    issuer: str
    issue_date: Optional[str] = ""
    credential_url: Optional[str] = ""

class CertificationResponse(BaseModel):
    id: int
    name: str
    issuer: str
    issue_date: Optional[str] = ""
    credential_url: Optional[str] = ""

# Profile Update
class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    college: Optional[str] = None
    degree: Optional[str] = None
    department: Optional[str] = None
    graduation_year: Optional[int] = None
    preferred_role: Optional[str] = None
    preferred_domain: Optional[str] = None
    location_preference: Optional[str] = None
    internship_duration: Optional[str] = None
    availability: Optional[str] = None
    about_me: Optional[str] = None
    profile_pic: Optional[str] = None

# Roadmap Schemas
class RoadmapGenerateRequest(BaseModel):
    internship_id: Optional[int] = None
    target_role: Optional[str] = "Full Stack Developer"
    missing_skills: Optional[List[str]] = []

class TaskToggleRequest(BaseModel):
    is_completed: bool

# Application Schemas
class ApplicationCreate(BaseModel):
    internship_id: int
    notes: Optional[str] = ""

class ApplicationStatusUpdate(BaseModel):
    status: str # Saved, Applied, Assessment, Interview, Selected, Rejected
    notes: Optional[str] = None
    interview_date: Optional[str] = None
    next_action: Optional[str] = None

# Weekly Report Schemas
class WeeklyReportCreate(BaseModel):
    internship_id: Optional[int] = None
    week_number: int
    tasks_completed: str
    hours_worked: float
    skills_learned: Optional[str] = ""
    project_updates: Optional[str] = ""
    challenges_faced: Optional[str] = ""
    next_week_goals: Optional[str] = ""
    evidence_links: Optional[str] = ""

class MentorReviewCreate(BaseModel):
    status: str # Approved, Needs Revision
    technical_score: int
    communication_score: int
    problem_solving_score: int
    task_completion_score: int
    initiative_score: int
    comments: str
