import os
import json
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any

from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form, Header, Query
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import desc

from database import engine, get_db, Base
import models
import schemas
from seed_data import hash_password, verify_password, seed_database
from matching_engine import calculate_internship_match
from resume_analyzer import extract_text_from_pdf, parse_resume_content
from career_readiness import calculate_career_readiness

# Ensure DB and seeds exist
Base.metadata.create_all(bind=engine)
db_init = next(get_db())
try:
    seed_database(db_init)
finally:
    db_init.close()

app = FastAPI(
    title="InternPath AI API",
    description="Backend API for AI-Powered Internship Matching, Skill Gap Analysis & Progress Monitoring Platform",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Upload directory
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Helper function to get current user
def get_current_user(
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> models.User:
    user_id = None
    if x_user_id and x_user_id.isdigit():
        user_id = int(x_user_id)
    elif authorization:
        parts = authorization.split(" ")
        token = parts[1] if len(parts) > 1 else parts[0]
        if token.isdigit():
            user_id = int(token)
        elif token.startswith("user_"):
            try:
                user_id = int(token.replace("user_", ""))
            except:
                pass
    
    # Default to Student A (ID: 1) if no header provided for seamless demo browsing
    if not user_id:
        user = db.query(models.User).filter(models.User.email == "student@internpath.demo").first()
        if user:
            return user
        user = db.query(models.User).first()
        return user

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid user authentication")
    return user

# ==========================================
# 1. AUTHENTICATION ENDPOINTS
# ==========================================

@app.post("/api/auth/register")
def register_user(req: schemas.UserRegister, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == req.email.lower().strip()).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    new_user = models.User(
        email=req.email.lower().strip(),
        password_hash=hash_password(req.password),
        name=req.name,
        role=req.role.lower()
    )
    db.add(new_user)
    db.flush()

    if req.role.lower() == "student":
        student_prof = models.StudentProfile(
            user_id=new_user.id,
            college=req.college or "Demo Institute of Technology",
            degree=req.degree or "B.Tech",
            department=req.department or "Computer Science",
            graduation_year=req.graduation_year or 2025,
            preferred_domain=req.preferred_domain or "Web Development",
            preferred_role="Software Engineering Intern",
            about_me=f"Aspiring software engineer interested in {req.preferred_domain or 'tech'}."
        )
        db.add(student_prof)
        db.flush()
        # Seed 2 baseline skills
        db.add(models.StudentSkill(student_id=student_prof.id, skill_name="Python", proficiency="Intermediate"))
        db.add(models.StudentSkill(student_id=student_prof.id, skill_name="Git", proficiency="Intermediate"))
    elif req.role.lower() == "mentor":
        mentor_prof = models.MentorProfile(
            user_id=new_user.id,
            designation="Senior Technical Mentor",
            organization="Tech Leaders Academy",
            expertise="Software Architecture, Mentorship",
            bio="Dedicated to developing next-generation engineering talent."
        )
        db.add(mentor_prof)

    db.add(models.Notification(
        user_id=new_user.id,
        title="Welcome to InternPath AI!",
        message="Your account is active. Explore internships and discover matches based on your skills.",
        type="info"
    ))

    db.commit()

    return {
        "status": "success",
        "message": "Registration successful",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "role": new_user.role,
            "token": f"user_{new_user.id}"
        }
    }

@app.post("/api/auth/login")
def login_user(req: schemas.UserLogin, db: Session = Depends(get_db)):
    email_clean = req.email.lower().strip()
    user = db.query(models.User).filter(models.User.email == email_clean).first()

    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    profile_data = {}
    if user.role == "student" and user.student_profile:
        profile_data = {
            "profile_id": user.student_profile.id,
            "college": user.student_profile.college,
            "degree": user.student_profile.degree,
            "department": user.student_profile.department,
            "preferred_role": user.student_profile.preferred_role,
            "preferred_domain": user.student_profile.preferred_domain,
            "profile_pic": user.student_profile.profile_pic
        }
    elif user.role == "mentor" and user.mentor_profile:
        profile_data = {
            "profile_id": user.mentor_profile.id,
            "designation": user.mentor_profile.designation,
            "organization": user.mentor_profile.organization
        }

    return {
        "status": "success",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "token": f"user_{user.id}",
            **profile_data
        }
    }

@app.get("/api/auth/me")
def get_auth_me(current_user: models.User = Depends(get_current_user)):
    profile_data = {}
    if current_user.role == "student" and current_user.student_profile:
        profile_data = {
            "profile_id": current_user.student_profile.id,
            "college": current_user.student_profile.college,
            "degree": current_user.student_profile.degree,
            "department": current_user.student_profile.department,
            "graduation_year": current_user.student_profile.graduation_year,
            "preferred_role": current_user.student_profile.preferred_role,
            "preferred_domain": current_user.student_profile.preferred_domain,
            "profile_pic": current_user.student_profile.profile_pic
        }
    elif current_user.role == "mentor" and current_user.mentor_profile:
        profile_data = {
            "profile_id": current_user.mentor_profile.id,
            "designation": current_user.mentor_profile.designation,
            "organization": current_user.mentor_profile.organization,
            "expertise": current_user.mentor_profile.expertise
        }

    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "token": f"user_{current_user.id}",
        **profile_data
    }

# ==========================================
# 2. STUDENT PROFILE & CRUD
# ==========================================

@app.get("/api/student/profile")
def get_student_profile(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.student_profile
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found.")

    skills = [{"id": s.id, "name": s.skill_name, "proficiency": s.proficiency} for s in profile.skills]
    projects = [{
        "id": p.id,
        "title": p.title,
        "description": p.description,
        "tech_stack": p.tech_stack,
        "github_url": p.github_url,
        "live_url": p.live_url
    } for p in profile.projects]
    certs = [{
        "id": c.id,
        "name": c.name,
        "issuer": c.issuer,
        "issue_date": c.issue_date,
        "credential_url": c.credential_url
    } for c in profile.certifications]

    # Calculate profile completion percentage
    completion_checks = [
        bool(current_user.name),
        bool(profile.college),
        bool(profile.degree),
        bool(profile.preferred_role),
        bool(profile.about_me),
        len(skills) >= 3,
        len(projects) >= 1,
        len(certs) >= 1,
        bool(profile.resume_score > 0)
    ]
    completion_pct = round((sum(1 for c in completion_checks if c) / len(completion_checks)) * 100)

    analysis_data = {}
    try:
        if profile.resume_analysis_json:
            analysis_data = json.loads(profile.resume_analysis_json)
    except:
        pass

    return {
        "id": profile.id,
        "user_id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "college": profile.college,
        "degree": profile.degree,
        "department": profile.department,
        "graduation_year": profile.graduation_year,
        "preferred_role": profile.preferred_role,
        "preferred_domain": profile.preferred_domain,
        "location_preference": profile.location_preference,
        "internship_duration": profile.internship_duration,
        "availability": profile.availability,
        "about_me": profile.about_me,
        "profile_pic": profile.profile_pic,
        "resume_score": profile.resume_score,
        "resume_analysis": analysis_data,
        "profile_completion": completion_pct,
        "skills": skills,
        "projects": projects,
        "certifications": certs
    }

@app.put("/api/student/profile")
def update_student_profile(
    req: schemas.ProfileUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.student_profile
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found.")

    if req.name is not None:
        current_user.name = req.name
    if req.college is not None:
        profile.college = req.college
    if req.degree is not None:
        profile.degree = req.degree
    if req.department is not None:
        profile.department = req.department
    if req.graduation_year is not None:
        profile.graduation_year = req.graduation_year
    if req.preferred_role is not None:
        profile.preferred_role = req.preferred_role
    if req.preferred_domain is not None:
        profile.preferred_domain = req.preferred_domain
    if req.location_preference is not None:
        profile.location_preference = req.location_preference
    if req.internship_duration is not None:
        profile.internship_duration = req.internship_duration
    if req.availability is not None:
        profile.availability = req.availability
    if req.about_me is not None:
        profile.about_me = req.about_me
    if req.profile_pic is not None:
        profile.profile_pic = req.profile_pic

    db.commit()
    return {"status": "success", "message": "Profile updated successfully"}

@app.post("/api/student/skills")
def add_student_skill(
    req: schemas.SkillCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.student_profile
    # Check duplicate
    existing = db.query(models.StudentSkill).filter(
        models.StudentSkill.student_id == profile.id,
        models.StudentSkill.skill_name.ilike(req.skill_name.strip())
    ).first()
    if existing:
        existing.proficiency = req.proficiency
        db.commit()
        return {"status": "success", "message": "Skill proficiency updated", "id": existing.id}

    new_skill = models.StudentSkill(
        student_id=profile.id,
        skill_name=req.skill_name.strip(),
        proficiency=req.proficiency
    )
    db.add(new_skill)
    db.commit()
    return {"status": "success", "message": "Skill added successfully", "id": new_skill.id}

@app.put("/api/student/skills/{skill_id}")
def update_student_skill(
    skill_id: int,
    req: schemas.SkillCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.student_profile
    skill = db.query(models.StudentSkill).filter(
        models.StudentSkill.id == skill_id,
        models.StudentSkill.student_id == profile.id
    ).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    skill.skill_name = req.skill_name.strip()
    skill.proficiency = req.proficiency
    db.commit()
    return {"status": "success", "message": "Skill updated"}

@app.delete("/api/student/skills/{skill_id}")
def delete_student_skill(
    skill_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.student_profile
    skill = db.query(models.StudentSkill).filter(
        models.StudentSkill.id == skill_id,
        models.StudentSkill.student_id == profile.id
    ).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    db.delete(skill)
    db.commit()
    return {"status": "success", "message": "Skill removed"}

@app.post("/api/student/projects")
def add_student_project(
    req: schemas.ProjectCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.student_profile
    project = models.Project(
        student_id=profile.id,
        title=req.title,
        description=req.description,
        tech_stack=req.tech_stack,
        github_url=req.github_url or "",
        live_url=req.live_url or ""
    )
    db.add(project)
    db.commit()
    return {"status": "success", "message": "Project added", "id": project.id}

@app.delete("/api/student/projects/{project_id}")
def delete_student_project(
    project_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.student_profile
    proj = db.query(models.Project).filter(
        models.Project.id == project_id,
        models.Project.student_id == profile.id
    ).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")

    db.delete(proj)
    db.commit()
    return {"status": "success", "message": "Project removed"}

@app.post("/api/student/certifications")
def add_student_certification(
    req: schemas.CertificationCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.student_profile
    cert = models.Certification(
        student_id=profile.id,
        name=req.name,
        issuer=req.issuer,
        issue_date=req.issue_date or "",
        credential_url=req.credential_url or ""
    )
    db.add(cert)
    db.commit()
    return {"status": "success", "message": "Certification added", "id": cert.id}

@app.delete("/api/student/certifications/{cert_id}")
def delete_student_certification(
    cert_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.student_profile
    cert = db.query(models.Certification).filter(
        models.Certification.id == cert_id,
        models.Certification.student_id == profile.id
    ).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certification not found")

    db.delete(cert)
    db.commit()
    return {"status": "success", "message": "Certification removed"}

# ==========================================
# 3. AI RESUME ANALYZER
# ==========================================

@app.post("/api/resume/upload")
async def upload_and_analyze_resume(
    file: UploadFile = File(...),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF resume files are accepted.")

    content = await file.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds maximum 5MB limit.")

    extracted_text = extract_text_from_pdf(content)
    if not extracted_text.strip():
        extracted_text = "Experienced student software developer with skills in Python, React, SQL, and Git."

    analysis_result = parse_resume_content(extracted_text)

    # Save to student profile
    profile = current_user.student_profile
    if profile:
        profile.resume_score = float(analysis_result["score"])
        profile.resume_analysis_json = json.dumps({
            "strengths": analysis_result["strengths"],
            "missing_sections": analysis_result["missing_sections"],
            "improvement_suggestions": analysis_result["improvement_suggestions"],
            "score_breakdown": analysis_result["score_breakdown"]
        })
        db.commit()

    return {
        "status": "success",
        "filename": file.filename,
        "analysis": analysis_result
    }

@app.post("/api/resume/analyze-text")
def analyze_resume_text(
    payload: Dict[str, str],
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    text = payload.get("text", "")
    if not text.strip():
        raise HTTPException(status_code=400, detail="Please provide resume text content.")

    analysis_result = parse_resume_content(text)

    profile = current_user.student_profile
    if profile:
        profile.resume_score = float(analysis_result["score"])
        profile.resume_analysis_json = json.dumps({
            "strengths": analysis_result["strengths"],
            "missing_sections": analysis_result["missing_sections"],
            "improvement_suggestions": analysis_result["improvement_suggestions"],
            "score_breakdown": analysis_result["score_breakdown"]
        })
        db.commit()

    return {
        "status": "success",
        "analysis": analysis_result
    }

@app.post("/api/resume/save-extracted")
def save_extracted_resume_data(
    payload: Dict[str, Any],
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.student_profile
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found.")

    skills_to_add = payload.get("skills", [])
    for sk in skills_to_add:
        name = sk.get("name") if isinstance(sk, dict) else str(sk)
        if name:
            existing = db.query(models.StudentSkill).filter(
                models.StudentSkill.student_id == profile.id,
                models.StudentSkill.skill_name.ilike(name.strip())
            ).first()
            if not existing:
                prof = sk.get("proficiency", "Intermediate") if isinstance(sk, dict) else "Intermediate"
                db.add(models.StudentSkill(student_id=profile.id, skill_name=name.strip(), proficiency=prof))

    degree = payload.get("degree")
    if degree:
        profile.degree = degree
    grad_year = payload.get("graduation_year")
    if grad_year:
        try:
            profile.graduation_year = int(grad_year)
        except:
            pass

    db.commit()
    return {"status": "success", "message": "Extracted data saved to profile."}

# ==========================================
# 4. INTERNSHIPS & SEARCH / FILTERS
# ==========================================

@app.get("/api/internships")
def list_internships(
    search: Optional[str] = None,
    domain: Optional[str] = None,
    work_mode: Optional[str] = None,
    location: Optional[str] = None,
    duration: Optional[str] = None,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(models.Internship)

    if domain and domain.lower() != "all":
        query = query.filter(models.Internship.domain.ilike(f"%{domain}%"))

    if work_mode and work_mode.lower() != "all":
        query = query.filter(models.Internship.work_mode.ilike(f"%{work_mode}%"))

    if location and location.lower() != "all":
        query = query.filter(models.Internship.location.ilike(f"%{location}%"))

    if duration and duration.lower() != "all":
        query = query.filter(models.Internship.duration.ilike(f"%{duration}%"))

    if search:
        s = f"%{search.strip()}%"
        query = query.filter(
            models.Internship.title.ilike(s) |
            models.Internship.company_name.ilike(s) |
            models.Internship.required_skills.ilike(s) |
            models.Internship.description.ilike(s)
        )

    internships = query.all()

    # Get student's saved and applied ids
    saved_ids = set()
    applied_map = {}
    profile = current_user.student_profile if current_user else None

    if profile:
        saved_items = db.query(models.SavedInternship).filter(models.SavedInternship.student_id == profile.id).all()
        saved_ids = {s.internship_id for s in saved_items}

        apps = db.query(models.Application).filter(models.Application.student_id == profile.id).all()
        applied_map = {a.internship_id: a.status for a in apps}

    results = []
    for item in internships:
        match_info = {}
        if profile:
            match_info = calculate_internship_match(profile, item)

        results.append({
            "id": item.id,
            "title": item.title,
            "company_name": item.company_name,
            "logo_url": item.logo_url,
            "domain": item.domain,
            "duration": item.duration,
            "location": item.location,
            "work_mode": item.work_mode,
            "stipend": item.stipend,
            "eligibility": item.eligibility,
            "application_deadline": item.application_deadline,
            "description": item.description,
            "responsibilities": item.responsibilities,
            "required_project_experience": item.required_project_experience,
            "required_skills": [s.strip() for s in item.required_skills.split(",") if s.strip()],
            "preferred_skills": [s.strip() for s in item.preferred_skills.split(",") if s.strip()],
            "is_saved": item.id in saved_ids,
            "application_status": applied_map.get(item.id, None),
            "match_percentage": match_info.get("match_percentage", 65),
            "match_label": match_info.get("match_label", "Strong Match"),
            "match_tier": match_info.get("match_tier", "strong")
        })

    return results

@app.get("/api/internships/{internship_id}")
def get_internship_detail(
    internship_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    internship = db.query(models.Internship).filter(models.Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship listing not found")

    profile = current_user.student_profile if current_user else None
    match_info = calculate_internship_match(profile, internship) if profile else {}

    is_saved = False
    app_record = None
    if profile:
        is_saved = db.query(models.SavedInternship).filter(
            models.SavedInternship.student_id == profile.id,
            models.SavedInternship.internship_id == internship.id
        ).first() is not None

        app_record = db.query(models.Application).filter(
            models.Application.student_id == profile.id,
            models.Application.internship_id == internship.id
        ).first()

    return {
        "id": internship.id,
        "title": internship.title,
        "company_name": internship.company_name,
        "logo_url": internship.logo_url,
        "domain": internship.domain,
        "duration": internship.duration,
        "location": internship.location,
        "work_mode": internship.work_mode,
        "stipend": internship.stipend,
        "eligibility": internship.eligibility,
        "application_deadline": internship.application_deadline,
        "description": internship.description,
        "responsibilities": internship.responsibilities,
        "required_project_experience": internship.required_project_experience,
        "required_skills": [s.strip() for s in internship.required_skills.split(",") if s.strip()],
        "preferred_skills": [s.strip() for s in internship.preferred_skills.split(",") if s.strip()],
        "is_saved": is_saved,
        "application": {
            "status": app_record.status,
            "application_date": app_record.application_date,
            "interview_date": app_record.interview_date
        } if app_record else None,
        "match": match_info
    }

@app.post("/api/internships/{internship_id}/save")
def toggle_save_internship(
    internship_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.student_profile
    if not profile:
        raise HTTPException(status_code=400, detail="Student profile required")

    existing = db.query(models.SavedInternship).filter(
        models.SavedInternship.student_id == profile.id,
        models.SavedInternship.internship_id == internship_id
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        return {"status": "success", "is_saved": False, "message": "Removed from saved internships"}
    else:
        db.add(models.SavedInternship(student_id=profile.id, internship_id=internship_id))
        db.commit()
        return {"status": "success", "is_saved": True, "message": "Saved to your bookmarks"}

@app.post("/api/internships/{internship_id}/apply")
def apply_internship(
    internship_id: int,
    payload: Dict[str, Any] = {},
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.student_profile
    if not profile:
        raise HTTPException(status_code=400, detail="Student profile required to apply")

    internship = db.query(models.Internship).filter(models.Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship listing not found")

    # Prevent duplicate applications
    existing = db.query(models.Application).filter(
        models.Application.student_id == profile.id,
        models.Application.internship_id == internship_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"You have already applied for this role! Current status: {existing.status}")

    notes = payload.get("notes", "Submitted via InternPath AI")
    new_app = models.Application(
        student_id=profile.id,
        internship_id=internship_id,
        status="Applied",
        application_date=datetime.utcnow().strftime("%Y-%m-%d"),
        deadline=internship.application_deadline,
        notes=notes,
        next_action="Awaiting employer profile review"
    )
    db.add(new_app)

    # In-app notification
    db.add(models.Notification(
        user_id=current_user.id,
        title="Application Submitted!",
        message=f"You successfully applied for {internship.title} at {internship.company_name}.",
        type="status",
        link="/applications"
    ))

    db.commit()
    return {"status": "success", "message": "Application submitted successfully", "id": new_app.id}

# ==========================================
# 5. AI MATCHING & SKILL GAP EXPLAINABILITY
# ==========================================

@app.get("/api/matching/recommendations")
def get_personalized_recommendations(
    tab: Optional[str] = "best", # best, all, saved, applied
    sort_by: Optional[str] = "match", # match, deadline, stipend
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.student_profile
    if not profile:
        raise HTTPException(status_code=400, detail="Student profile required")

    internships = db.query(models.Internship).all()
    saved_ids = {s.internship_id for s in profile.saved_internships}
    applied_map = {a.internship_id: a.status for a in profile.applications}

    scored_list = []
    for item in internships:
        match_data = calculate_internship_match(profile, item)
        is_saved = item.id in saved_ids
        app_status = applied_map.get(item.id)

        # Tab filtering
        if tab == "saved" and not is_saved:
            continue
        elif tab == "applied" and not app_status:
            continue
        elif tab == "best" and match_data["match_percentage"] < 65:
            continue

        scored_list.append({
            "id": item.id,
            "title": item.title,
            "company_name": item.company_name,
            "logo_url": item.logo_url,
            "domain": item.domain,
            "duration": item.duration,
            "location": item.location,
            "work_mode": item.work_mode,
            "stipend": item.stipend,
            "eligibility": item.eligibility,
            "application_deadline": item.application_deadline,
            "required_skills": [s.strip() for s in item.required_skills.split(",") if s.strip()],
            "preferred_skills": [s.strip() for s in item.preferred_skills.split(",") if s.strip()],
            "is_saved": is_saved,
            "application_status": app_status,
            "match": match_data
        })

    # Sorting
    if sort_by == "match":
        scored_list.sort(key=lambda x: x["match"]["match_percentage"], reverse=True)
    elif sort_by == "deadline":
        scored_list.sort(key=lambda x: x["application_deadline"])
    elif sort_by == "stipend":
        scored_list.sort(key=lambda x: x["stipend"], reverse=True)

    return scored_list

@app.get("/api/matching/explain/{internship_id}")
def explain_internship_match(
    internship_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.student_profile
    if not profile:
        raise HTTPException(status_code=400, detail="Student profile required")

    internship = db.query(models.Internship).filter(models.Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship listing not found")

    match_result = calculate_internship_match(profile, internship)
    return {
        "internship": {
            "id": internship.id,
            "title": internship.title,
            "company_name": internship.company_name,
            "domain": internship.domain,
            "work_mode": internship.work_mode,
            "stipend": internship.stipend
        },
        "student": {
            "name": current_user.name,
            "preferred_domain": profile.preferred_domain,
            "preferred_role": profile.preferred_role
        },
        "match": match_result
    }

@app.get("/api/skill-gap/{internship_id}")
def get_skill_gap_analysis(
    internship_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.student_profile
    if not profile:
        raise HTTPException(status_code=400, detail="Student profile required")

    internship = db.query(models.Internship).filter(models.Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship listing not found")

    match_result = calculate_internship_match(profile, internship)
    
    # Combined skill comparison table
    comparison_table = []
    for ms in match_result["matched_skills"]:
        comparison_table.append({
            "skill": ms["skill"],
            "status": "Matched",
            "proficiency": ms.get("proficiency", "Intermediate"),
            "priority": "—",
            "importance": ms.get("importance", "Required")
        })

    for mg in match_result["missing_skills"]:
        comparison_table.append({
            "skill": mg["skill"],
            "status": "Missing",
            "proficiency": "None",
            "priority": mg.get("priority", "High"),
            "importance": mg.get("importance", "Required")
        })

    return {
        "internship_id": internship.id,
        "title": internship.title,
        "company_name": internship.company_name,
        "match_percentage": match_result["match_percentage"],
        "match_label": match_result["match_label"],
        "comparison_table": comparison_table,
        "matched_count": len(match_result["matched_skills"]),
        "missing_count": len(match_result["missing_skills"]),
        "high_priority_missing": [m["skill"] for m in match_result["missing_skills"] if m.get("priority") == "High"],
        "actionable_suggestions": match_result["suggestions"]
    }

# ==========================================
# 6. LEARNING ROADMAP
# ==========================================

@app.get("/api/roadmap")
def get_student_roadmap(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.student_profile
    if not profile:
        raise HTTPException(status_code=400, detail="Student profile required")

    roadmap = db.query(models.Roadmap).filter(models.Roadmap.student_id == profile.id).first()
    if not roadmap:
        return {"has_roadmap": False, "roadmap": None}

    tasks = []
    completed_count = 0
    for t in roadmap.tasks:
        if t.is_completed:
            completed_count += 1
        tasks.append({
            "id": t.id,
            "week_number": t.week_number,
            "skill_name": t.skill_name,
            "objective": t.objective,
            "estimated_duration": t.estimated_duration,
            "task_description": t.task_description,
            "is_completed": t.is_completed,
            "completed_at": t.completed_at.isoformat() if t.completed_at else None
        })

    total_tasks = len(tasks)
    progress_pct = round((completed_count / total_tasks * 100)) if total_tasks > 0 else 0

    return {
        "has_roadmap": True,
        "roadmap": {
            "id": roadmap.id,
            "target_role": roadmap.target_role,
            "title": roadmap.title,
            "progress_percentage": progress_pct,
            "completed_tasks": completed_count,
            "total_tasks": total_tasks,
            "tasks": tasks
        }
    }

@app.post("/api/roadmap/generate")
def generate_personalized_roadmap(
    req: schemas.RoadmapGenerateRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.student_profile
    if not profile:
        raise HTTPException(status_code=400, detail="Student profile required")

    # If internship specified, extract missing skills
    target_role = req.target_role or "Full Stack Developer"
    missing = req.missing_skills or []

    if req.internship_id:
        internship = db.query(models.Internship).filter(models.Internship.id == req.internship_id).first()
        if internship:
            target_role = internship.title
            match_res = calculate_internship_match(profile, internship)
            missing = [m["skill"] for m in match_res["missing_skills"]]

    if not missing:
        missing = ["System Architecture", "Docker", "Database Indexing", "Cloud Deployment"]

    # Delete old roadmap if exists
    old_rm = db.query(models.Roadmap).filter(models.Roadmap.student_id == profile.id).first()
    if old_rm:
        db.delete(old_rm)
        db.flush()

    new_roadmap = models.Roadmap(
        student_id=profile.id,
        internship_id=req.internship_id,
        target_role=target_role,
        title=f"4-Week Skill Acceleration: {target_role}"
    )
    db.add(new_roadmap)
    db.flush()

    # Generate 4 actionable weeks tailored to missing skills
    skill_w1 = missing[0] if len(missing) > 0 else "Core Fundamentals"
    skill_w2 = missing[1] if len(missing) > 1 else "Advanced Concepts & APIs"
    skill_w3 = missing[2] if len(missing) > 2 else "System Design & Optimization"
    skill_w4 = missing[3] if len(missing) > 3 else "Capstone Integration Project"

    tasks_to_add = [
        models.RoadmapTask(
            roadmap_id=new_roadmap.id,
            week_number=1,
            skill_name=skill_w1,
            objective=f"Master fundamental syntax, design patterns, and debugging workflows in {skill_w1}.",
            estimated_duration="6-8 hours",
            task_description=f"Complete foundational exercises in {skill_w1}, implement 3 mini-exercises, and push solutions to a GitHub learning repository."
        ),
        models.RoadmapTask(
            roadmap_id=new_roadmap.id,
            week_number=2,
            skill_name=skill_w2,
            objective=f"Develop applied proficiency in {skill_w2} by constructing end-to-end modules.",
            estimated_duration="8-10 hours",
            task_description=f"Construct a functional backend or frontend module with error boundaries, automated test fixtures, and clean architecture utilizing {skill_w2}."
        ),
        models.RoadmapTask(
            roadmap_id=new_roadmap.id,
            week_number=3,
            skill_name=skill_w3,
            objective=f"Optimize performance, caching, and scalability patterns in {skill_w3}.",
            estimated_duration="7-9 hours",
            task_description=f"Profile performance bottlenecks, implement indexing/caching, and configure continuous testing pipeline for {skill_w3}."
        ),
        models.RoadmapTask(
            roadmap_id=new_roadmap.id,
            week_number=4,
            skill_name=f"{skill_w4} & Capstone Portfolio",
            objective="Deliver a complete showcase project integrating all newly acquired skills with live deployment.",
            estimated_duration="10-12 hours",
            task_description=f"Build and deploy an end-to-end prototype highlighting {skill_w1}, {skill_w2}, and {skill_w4}. Write comprehensive README documentation and record a 2-minute demo."
        )
    ]
    db.add_all(tasks_to_add)

    # In-app notification
    db.add(models.Notification(
        user_id=current_user.id,
        title="Personalized Roadmap Generated!",
        message=f"Your new 4-week roadmap for '{target_role}' has been created. Start with Week 1 tasks.",
        type="roadmap",
        link="/roadmap"
    ))

    db.commit()
    return {"status": "success", "message": "Roadmap created successfully", "roadmap_id": new_roadmap.id}

@app.put("/api/roadmap/tasks/{task_id}/toggle")
def toggle_roadmap_task(
    task_id: int,
    req: schemas.TaskToggleRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.student_profile
    task = db.query(models.RoadmapTask).join(models.Roadmap).filter(
        models.RoadmapTask.id == task_id,
        models.Roadmap.student_id == profile.id
    ).first()

    if not task:
        raise HTTPException(status_code=404, detail="Roadmap task not found")

    task.is_completed = req.is_completed
    task.completed_at = datetime.utcnow() if req.is_completed else None
    db.commit()

    return {"status": "success", "is_completed": task.is_completed}

# ==========================================
# 7. APPLICATION TRACKER (KANBAN / TABLE)
# ==========================================

@app.get("/api/applications")
def get_student_applications(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.student_profile
    if not profile:
        raise HTTPException(status_code=400, detail="Student profile required")

    apps = db.query(models.Application).filter(models.Application.student_id == profile.id).order_by(desc(models.Application.created_at)).all()

    results = []
    for a in apps:
        internship = a.internship
        match_info = calculate_internship_match(profile, internship) if internship else {}

        results.append({
            "id": a.id,
            "internship_id": a.internship_id,
            "title": internship.title if internship else "Internship",
            "company_name": internship.company_name if internship else "Company",
            "logo_url": internship.logo_url if internship else "",
            "domain": internship.domain if internship else "",
            "location": internship.location if internship else "",
            "work_mode": internship.work_mode if internship else "",
            "stipend": internship.stipend if internship else "",
            "status": a.status,
            "application_date": a.application_date,
            "deadline": a.deadline or (internship.application_deadline if internship else ""),
            "notes": a.notes,
            "next_action": a.next_action,
            "interview_date": a.interview_date,
            "match_percentage": match_info.get("match_percentage", 75),
            "created_at": a.created_at.isoformat() if a.created_at else None,
            "updated_at": a.updated_at.isoformat() if a.updated_at else None
        })

    return results

@app.put("/api/applications/{app_id}/status")
def update_application_status(
    app_id: int,
    req: schemas.ApplicationStatusUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.student_profile
    app_record = db.query(models.Application).filter(
        models.Application.id == app_id,
        models.Application.student_id == profile.id
    ).first()

    if not app_record:
        raise HTTPException(status_code=404, detail="Application record not found")

    valid_statuses = ["Saved", "Applied", "Assessment", "Interview", "Selected", "Rejected"]
    if req.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Choose from {valid_statuses}")

    app_record.status = req.status
    if req.notes is not None:
        app_record.notes = req.notes
    if req.interview_date is not None:
        app_record.interview_date = req.interview_date
    if req.next_action is not None:
        app_record.next_action = req.next_action

    db.commit()
    return {"status": "success", "message": f"Application status updated to {req.status}"}

@app.delete("/api/applications/{app_id}")
def delete_application(
    app_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.student_profile
    app_record = db.query(models.Application).filter(
        models.Application.id == app_id,
        models.Application.student_id == profile.id
    ).first()

    if not app_record:
        raise HTTPException(status_code=404, detail="Application record not found")

    db.delete(app_record)
    db.commit()
    return {"status": "success", "message": "Application removed"}

# ==========================================
# 8. INTERNSHIP PROGRESS & WEEKLY REPORTS
# ==========================================

@app.get("/api/progress/reports")
def get_weekly_reports(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.student_profile
    if not profile:
        raise HTTPException(status_code=400, detail="Student profile required")

    reports = db.query(models.WeeklyReport).filter(
        models.WeeklyReport.student_id == profile.id
    ).order_by(desc(models.WeeklyReport.week_number)).all()

    results = []
    for r in reports:
        fb = r.feedback
        results.append({
            "id": r.id,
            "week_number": r.week_number,
            "tasks_completed": r.tasks_completed,
            "hours_worked": r.hours_worked,
            "skills_learned": r.skills_learned,
            "project_updates": r.project_updates,
            "challenges_faced": r.challenges_faced,
            "next_week_goals": r.next_week_goals,
            "evidence_links": r.evidence_links,
            "submission_date": r.submission_date,
            "status": r.status,
            "feedback": {
                "technical_score": fb.technical_score,
                "communication_score": fb.communication_score,
                "problem_solving_score": fb.problem_solving_score,
                "task_completion_score": fb.task_completion_score,
                "initiative_score": fb.initiative_score,
                "overall_score": fb.overall_score,
                "comments": fb.comments,
                "submitted_at": fb.submitted_at.isoformat() if fb.submitted_at else None,
                "mentor_name": fb.mentor.user.name if fb.mentor and fb.mentor.user else "Assigned Mentor"
            } if fb else None
        })

    return results

@app.post("/api/progress/reports")
def submit_weekly_report(
    req: schemas.WeeklyReportCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.student_profile
    if not profile:
        raise HTTPException(status_code=400, detail="Student profile required")

    # Find assigned mentor if any
    assignment = db.query(models.MentorAssignment).filter(models.MentorAssignment.student_id == profile.id).first()
    mentor_id = assignment.mentor_id if assignment else None

    # Check duplicate week submission
    existing = db.query(models.WeeklyReport).filter(
        models.WeeklyReport.student_id == profile.id,
        models.WeeklyReport.week_number == req.week_number
    ).first()
    if existing:
        existing.tasks_completed = req.tasks_completed
        existing.hours_worked = req.hours_worked
        existing.skills_learned = req.skills_learned or ""
        existing.project_updates = req.project_updates or ""
        existing.challenges_faced = req.challenges_faced or ""
        existing.next_week_goals = req.next_week_goals or ""
        existing.evidence_links = req.evidence_links or ""
        existing.status = "Submitted"
        db.commit()
        return {"status": "success", "message": f"Week {req.week_number} report updated and submitted."}

    new_report = models.WeeklyReport(
        student_id=profile.id,
        internship_id=req.internship_id,
        week_number=req.week_number,
        tasks_completed=req.tasks_completed,
        hours_worked=req.hours_worked,
        skills_learned=req.skills_learned or "",
        project_updates=req.project_updates or "",
        challenges_faced=req.challenges_faced or "",
        next_week_goals=req.next_week_goals or "",
        evidence_links=req.evidence_links or "",
        submission_date=datetime.utcnow().strftime("%Y-%m-%d"),
        mentor_id=mentor_id,
        status="Submitted"
    )
    db.add(new_report)

    # Notify mentor if assigned
    if assignment and assignment.mentor and assignment.mentor.user_id:
        db.add(models.Notification(
            user_id=assignment.mentor.user_id,
            title="Weekly Report Submitted",
            message=f"{current_user.name} submitted Week {req.week_number} progress report for your review.",
            type="report",
            link="/mentor/reports"
        ))

    db.commit()
    return {"status": "success", "message": f"Week {req.week_number} report submitted successfully!", "id": new_report.id}

@app.get("/api/progress/milestones")
def get_internship_milestones(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.student_profile
    reports = db.query(models.WeeklyReport).filter(models.WeeklyReport.student_id == profile.id).all() if profile else []
    total_hours = sum(r.hours_worked for r in reports)
    approved_reports = [r for r in reports if r.status == "Approved"]

    milestones = [
        {
            "id": "m1",
            "title": "Internship Started",
            "description": "Onboarding completed, repository cloned, environment verified.",
            "completed": True,
            "date": "Sprint 0"
        },
        {
            "id": "m2",
            "title": "First Task Completed",
            "description": "First feature branch merged into staging environment.",
            "completed": len(reports) >= 1,
            "date": "Week 1"
        },
        {
            "id": "m3",
            "title": "First Weekly Report",
            "description": "Submitted weekly progress and received mentor feedback.",
            "completed": len(approved_reports) >= 1,
            "date": "Week 1"
        },
        {
            "id": "m4",
            "title": "Midpoint Review",
            "description": "Evaluation of sprint deliverables, technical proficiency, and velocity.",
            "completed": len(reports) >= 3,
            "date": "Week 3"
        },
        {
            "id": "m5",
            "title": "Final Production Project",
            "description": "Complete production-ready module or analytics suite deployment.",
            "completed": False,
            "date": "Week 5"
        },
        {
            "id": "m6",
            "title": "Internship Completed",
            "description": "Final mentor endorsement and certificate recommendation.",
            "completed": False,
            "date": "Week 6"
        }
    ]

    return {
        "milestones": milestones,
        "total_hours_logged": total_hours,
        "reports_submitted": len(reports),
        "reports_approved": len(approved_reports),
        "overall_progress_pct": min(100, int((len(reports) / 6.0) * 100))
    }

# ==========================================
# 9. MENTOR DASHBOARD & REVIEWS
# ==========================================

@app.get("/api/mentor/dashboard")
def get_mentor_dashboard(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    mentor = current_user.mentor_profile
    if not mentor:
        raise HTTPException(status_code=403, detail="Mentor access required")

    assignments = db.query(models.MentorAssignment).filter(models.MentorAssignment.mentor_id == mentor.id).all()
    student_ids = [a.student_id for a in assignments]

    all_reports = db.query(models.WeeklyReport).filter(models.WeeklyReport.student_id.in_(student_ids)).all() if student_ids else []
    pending_reports = [r for r in all_reports if r.status == "Submitted"]
    approved_reports = [r for r in all_reports if r.status == "Approved"]

    return {
        "mentor_name": current_user.name,
        "designation": mentor.designation,
        "organization": mentor.organization,
        "stats": {
            "assigned_students": len(assignments),
            "reports_pending_review": len(pending_reports),
            "students_on_track": len(assignments) - (1 if len(pending_reports) > 1 else 0),
            "students_needing_attention": 1 if len(pending_reports) > 1 else 0,
            "total_reviews_completed": len(approved_reports)
        }
    }

@app.get("/api/mentor/students")
def get_mentor_assigned_students(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    mentor = current_user.mentor_profile
    if not mentor:
        raise HTTPException(status_code=403, detail="Mentor access required")

    assignments = db.query(models.MentorAssignment).filter(models.MentorAssignment.mentor_id == mentor.id).all()

    students_list = []
    for a in assignments:
        st = a.student
        internship = a.internship
        reports = st.weekly_reports or []
        pending_count = sum(1 for r in reports if r.status == "Submitted")

        students_list.append({
            "assignment_id": a.id,
            "student_id": st.id,
            "user_id": st.user_id,
            "name": st.user.name if st.user else "Student",
            "email": st.user.email if st.user else "",
            "college": st.college,
            "degree": st.degree,
            "department": st.department,
            "profile_pic": st.profile_pic,
            "internship_title": internship.title if internship else "Independent Track",
            "company_name": internship.company_name if internship else "Internal Cohort",
            "skills": [s.skill_name for s in (st.skills or [])[:5]],
            "total_reports": len(reports),
            "pending_reports": pending_count,
            "status": "Needs Attention" if pending_count > 0 else "On Track"
        })

    return students_list

@app.get("/api/mentor/reports")
def get_mentor_reports(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    mentor = current_user.mentor_profile
    if not mentor:
        raise HTTPException(status_code=403, detail="Mentor access required")

    assignments = db.query(models.MentorAssignment).filter(models.MentorAssignment.mentor_id == mentor.id).all()
    student_ids = [a.student_id for a in assignments]

    reports = db.query(models.WeeklyReport).filter(
        models.WeeklyReport.student_id.in_(student_ids)
    ).order_by(desc(models.WeeklyReport.id)).all() if student_ids else []

    results = []
    for r in reports:
        fb = r.feedback
        results.append({
            "id": r.id,
            "student_id": r.student_id,
            "student_name": r.student.user.name if r.student and r.student.user else "Student",
            "student_email": r.student.user.email if r.student and r.student.user else "",
            "week_number": r.week_number,
            "tasks_completed": r.tasks_completed,
            "hours_worked": r.hours_worked,
            "skills_learned": r.skills_learned,
            "project_updates": r.project_updates,
            "challenges_faced": r.challenges_faced,
            "next_week_goals": r.next_week_goals,
            "evidence_links": r.evidence_links,
            "submission_date": r.submission_date,
            "status": r.status,
            "feedback": {
                "technical_score": fb.technical_score,
                "communication_score": fb.communication_score,
                "problem_solving_score": fb.problem_solving_score,
                "task_completion_score": fb.task_completion_score,
                "initiative_score": fb.initiative_score,
                "overall_score": fb.overall_score,
                "comments": fb.comments
            } if fb else None
        })

    return results

@app.post("/api/mentor/reports/{report_id}/review")
def review_weekly_report(
    report_id: int,
    req: schemas.MentorReviewCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    mentor = current_user.mentor_profile
    if not mentor:
        raise HTTPException(status_code=403, detail="Mentor access required")

    report = db.query(models.WeeklyReport).filter(models.WeeklyReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Weekly report not found")

    report.status = req.status
    report.reviewed_at = datetime.utcnow()

    overall = round((req.technical_score + req.communication_score + req.problem_solving_score + req.task_completion_score + req.initiative_score) / 5.0, 1)

    existing_fb = db.query(models.MentorFeedback).filter(models.MentorFeedback.report_id == report.id).first()
    if existing_fb:
        existing_fb.technical_score = req.technical_score
        existing_fb.communication_score = req.communication_score
        existing_fb.problem_solving_score = req.problem_solving_score
        existing_fb.task_completion_score = req.task_completion_score
        existing_fb.initiative_score = req.initiative_score
        existing_fb.overall_score = overall
        existing_fb.comments = req.comments
        existing_fb.submitted_at = datetime.utcnow()
    else:
        new_fb = models.MentorFeedback(
            report_id=report.id,
            mentor_id=mentor.id,
            student_id=report.student_id,
            technical_score=req.technical_score,
            communication_score=req.communication_score,
            problem_solving_score=req.problem_solving_score,
            task_completion_score=req.task_completion_score,
            initiative_score=req.initiative_score,
            overall_score=overall,
            comments=req.comments
        )
        db.add(new_fb)

    # In-app notification to student
    if report.student and report.student.user_id:
        db.add(models.Notification(
            user_id=report.student.user_id,
            title=f"Week {report.week_number} Report {req.status}",
            message=f"{current_user.name} reviewed your report. Overall rating: {overall}/5.0. '{req.comments[:60]}...'",
            type="feedback",
            link="/mentor-feedback"
        ))

    db.commit()
    return {"status": "success", "message": f"Report review submitted as {req.status}"}

# ==========================================
# 10. CAREER READINESS & ANALYTICS
# ==========================================

@app.get("/api/analytics/readiness")
def get_career_readiness_index(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.student_profile
    if not profile:
        raise HTTPException(status_code=400, detail="Student profile required")

    readiness = calculate_career_readiness(profile, db)

    # Historical trend
    history_records = db.query(models.ReadinessHistory).filter(
        models.ReadinessHistory.student_id == profile.id
    ).order_by(models.ReadinessHistory.recorded_at).all()

    history = []
    for h in history_records:
        history.append({
            "date": h.recorded_at.strftime("%b %d") if h.recorded_at else "Earlier",
            "score": h.score,
            "skill_score": h.skill_score,
            "project_score": h.project_score,
            "learning_score": h.learning_score
        })

    if not history:
        history = [
            {"date": "4 Wks Ago", "score": 60, "skill_score": 20, "project_score": 15, "learning_score": 8},
            {"date": "3 Wks Ago", "score": 68, "skill_score": 24, "project_score": 18, "learning_score": 10},
            {"date": "2 Wks Ago", "score": 75, "skill_score": 27, "project_score": 20, "learning_score": 11},
            {"date": "Last Week", "score": 80, "skill_score": 29, "project_score": 22, "learning_score": 11},
            {"date": "Current", "score": readiness["readiness_index"], "skill_score": readiness["breakdown"]["skill_readiness"]["score"], "project_score": readiness["breakdown"]["project_experience"]["score"], "learning_score": readiness["breakdown"]["learning_progress"]["score"]}
        ]

    return {
        "readiness": readiness,
        "history": history
    }

@app.get("/api/analytics/dashboard")
def get_dashboard_analytics(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.student_profile
    if not profile:
        raise HTTPException(status_code=400, detail="Student profile required")

    readiness = calculate_career_readiness(profile, db)
    internships = db.query(models.Internship).all()
    apps = profile.applications or []
    reports = profile.weekly_reports or []

    # Count high matches
    high_match_count = 0
    match_distribution = {"90%+": 0, "80-89%": 0, "70-79%": 0, "<70%": 0}
    for item in internships:
        score = calculate_internship_match(profile, item)["match_percentage"]
        if score >= 90:
            match_distribution["90%+"] += 1
            high_match_count += 1
        elif score >= 80:
            match_distribution["80-89%"] += 1
            high_match_count += 1
        elif score >= 70:
            match_distribution["70-79%"] += 1
            high_match_count += 1
        else:
            match_distribution["<70%"] += 1

    # Application stage counts
    app_stages = {"Saved": 0, "Applied": 0, "Assessment": 0, "Interview": 0, "Selected": 0, "Rejected": 0}
    for a in apps:
        if a.status in app_stages:
            app_stages[a.status] += 1

    # Skill breakdown
    skills_by_prof = {"Advanced": 0, "Intermediate": 0, "Beginner": 0}
    for sk in (profile.skills or []):
        prof = sk.proficiency or "Intermediate"
        if prof in skills_by_prof:
            skills_by_prof[prof] += 1

    # Dynamic personalized quote
    pref_domain = profile.preferred_domain or "Software Development"
    skills_names = [s.skill_name for s in (profile.skills or [])]
    if "Python" in skills_names and "SQL" in skills_names:
        quote = f"Your profile is a strong match for {pref_domain} internships. Continue completing your roadmap milestones to unlock top tier 90%+ opportunities."
    else:
        quote = f"Your skills are well suited for {pref_domain}. Add missing database or cloud fundamentals to expand your high-percentage matches."

    return {
        "student_name": current_user.name,
        "career_readiness_score": readiness["readiness_index"],
        "classification": readiness["classification"],
        "total_recommended": len(internships),
        "high_matches": high_match_count,
        "applications_submitted": len(apps),
        "interviews_scheduled": app_stages["Interview"],
        "offers_selected": app_stages["Selected"],
        "skills_verified": len(profile.skills or []),
        "weekly_reports_count": len(reports),
        "personalized_recommendation": quote,
        "application_pipeline": [{"stage": k, "count": v} for k, v in app_stages.items()],
        "skills_distribution": [{"proficiency": k, "count": v} for k, v in skills_by_prof.items()],
        "match_distribution": [{"range": k, "count": v} for k, v in match_distribution.items()]
    }

# ==========================================
# 11. NOTIFICATIONS
# ==========================================

@app.get("/api/notifications")
def get_user_notifications(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    notifications = db.query(models.Notification).filter(
        models.Notification.user_id == current_user.id
    ).order_by(desc(models.Notification.created_at)).all()

    unread_count = sum(1 for n in notifications if not n.is_read)

    return {
        "unread_count": unread_count,
        "notifications": [{
            "id": n.id,
            "title": n.title,
            "message": n.message,
            "type": n.type,
            "is_read": n.is_read,
            "link": n.link,
            "created_at": n.created_at.strftime("%b %d, %H:%M") if n.created_at else ""
        } for n in notifications]
    }

@app.put("/api/notifications/{notification_id}/read")
def mark_notification_read(
    notification_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    notification = db.query(models.Notification).filter(
        models.Notification.id == notification_id,
        models.Notification.user_id == current_user.id
    ).first()

    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")

    notification.is_read = True
    db.commit()
    return {"status": "success"}

@app.put("/api/notifications/read-all")
def mark_all_notifications_read(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db.query(models.Notification).filter(
        models.Notification.user_id == current_user.id
    ).update({"is_read": True})
    db.commit()
    return {"status": "success"}

# Health check
@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "InternPath AI Core"}

# Mount Built Frontend SPA Assets
FRONTEND_DIST = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "frontend", "dist")
if os.path.exists(FRONTEND_DIST):
    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="API endpoint not found")
        file_path = os.path.join(FRONTEND_DIST, full_path)
        if full_path and os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        index_file = os.path.join(FRONTEND_DIST, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"status": "Frontend build not found"}

