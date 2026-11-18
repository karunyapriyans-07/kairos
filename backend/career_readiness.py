from typing import Dict, Any

def calculate_career_readiness(student_profile, db_session=None) -> Dict[str, Any]:
    """
    Calculate the InternPath Career Readiness Index out of 100:
      - Skill Readiness: 35%
      - Project Experience: 25%
      - Resume Quality: 15%
      - Learning Progress: 15%
      - Application Engagement: 10%
    """
    skills = student_profile.skills or []
    projects = student_profile.projects or []
    applications = student_profile.applications or []
    roadmaps = student_profile.roadmaps or []

    # 1. Skill Readiness (35% max)
    # Factor in number of skills and proficiency levels (Advanced=1.0, Intermediate=0.8, Beginner=0.5)
    skill_pts = 0.0
    for sk in skills:
        prof = (sk.proficiency or "Intermediate").lower()
        if prof == "advanced":
            skill_pts += 5.0
        elif prof == "intermediate":
            skill_pts += 3.5
        else:
            skill_pts += 2.0
    skill_score = min(35.0, round(skill_pts, 1))

    # 2. Project Experience (25% max)
    # Number of projects and their completeness
    proj_pts = 0.0
    for proj in projects:
        # Base points for each project
        p_val = 8.0
        if proj.tech_stack: p_val += 2.0
        if proj.github_url or proj.live_url: p_val += 2.5
        proj_pts += p_val
    proj_score = min(25.0, round(proj_pts, 1))

    # 3. Resume Quality (15% max)
    # Derived from student_profile.resume_score (0-100) scaled to 15
    r_score = getattr(student_profile, "resume_score", 75.0) or 75.0
    resume_score_weighted = round((r_score / 100.0) * 15.0, 1)

    # 4. Learning Progress (15% max)
    # Completed tasks across roadmaps
    total_tasks = 0
    completed_tasks = 0
    for rm in roadmaps:
        for t in rm.tasks:
            total_tasks += 1
            if t.is_completed:
                completed_tasks += 1

    if total_tasks > 0:
        completion_ratio = completed_tasks / total_tasks
        learning_score = round(completion_ratio * 15.0, 1)
    else:
        # If no roadmap exists yet, provide default baseline
        learning_score = 6.0

    # 5. Application Engagement (10% max)
    # Applications submitted, interviews scheduled, notes taken
    app_pts = min(10.0, len(applications) * 2.5)
    # Bonus if student reached interview or assessment
    if any(a.status in ["Assessment", "Interview", "Selected"] for a in applications):
        app_pts = min(10.0, app_pts + 3.0)
    app_score = round(app_pts, 1)

    # Total Index (0 - 100)
    total = round(skill_score + proj_score + resume_score_weighted + learning_score + app_score)
    total = max(10, min(100, total))

    # Classification
    if total >= 90:
        tier = "Highly Prepared"
        tier_color = "emerald"
        tier_desc = "Outstanding candidate profile ready for top-tier competitive internships."
    elif total >= 75:
        tier = "Strong Candidate"
        tier_color = "indigo"
        tier_desc = "Competitive candidate with solid portfolio, verified skills, and clear roadmap."
    elif total >= 60:
        tier = "Internship Ready"
        tier_color = "blue"
        tier_desc = "Meets prerequisite criteria for entry-level and junior internship positions."
    elif total >= 40:
        tier = "Developing"
        tier_color = "amber"
        tier_desc = "Gaining foundational momentum; completing roadmaps will unlock higher match tiers."
    else:
        tier = "Building Foundations"
        tier_color = "rose"
        tier_desc = "Starting your journey; add skills, projects, and analyze your resume to accelerate."

    # Actionable Improvement Steps
    actions = []
    if skill_score < 28.0:
        actions.append({"category": "Skills", "action": f"Add and verify at least 2 advanced skills in your core tech stack (+{round(35.0 - skill_score, 1)} pts possible)."})
    if proj_score < 20.0:
        actions.append({"category": "Projects", "action": f"Add a comprehensive full-stack or domain project with GitHub repository and live demo (+{round(25.0 - proj_score, 1)} pts possible)."})
    if resume_score_weighted < 12.0:
        actions.append({"category": "Resume", "action": "Run the AI Resume Analyzer and implement recommendations to push resume score above 85 (+3.0 pts possible)."})
    if learning_score < 11.0:
        actions.append({"category": "Learning Roadmap", "action": "Complete outstanding weekly learning roadmap tasks to boost consistency (+4.5 pts possible)."})
    if app_score < 8.0:
        actions.append({"category": "Applications", "action": "Discover and apply to at least 2 high-matching internship opportunities."})

    return {
        "readiness_index": total,
        "classification": tier,
        "classification_color": tier_color,
        "description": tier_desc,
        "breakdown": {
            "skill_readiness": {
                "score": skill_score,
                "max": 35.0,
                "weight": "35%",
                "percentage": round((skill_score / 35.0) * 100, 1)
            },
            "project_experience": {
                "score": proj_score,
                "max": 25.0,
                "weight": "25%",
                "percentage": round((proj_score / 25.0) * 100, 1)
            },
            "resume_quality": {
                "score": resume_score_weighted,
                "max": 15.0,
                "weight": "15%",
                "percentage": round((resume_score_weighted / 15.0) * 100, 1)
            },
            "learning_progress": {
                "score": learning_score,
                "max": 15.0,
                "weight": "15%",
                "percentage": round((learning_score / 15.0) * 100, 1)
            },
            "application_engagement": {
                "score": app_score,
                "max": 10.0,
                "weight": "10%",
                "percentage": round((app_score / 10.0) * 100, 1)
            }
        },
        "stats": {
            "total_skills": len(skills),
            "advanced_skills": sum(1 for s in skills if (s.proficiency or "").lower() == "advanced"),
            "total_projects": len(projects),
            "completed_tasks": completed_tasks,
            "total_tasks": total_tasks,
            "active_applications": len(applications)
        },
        "action_plan": actions,
        "disclaimer": "InternPath Career Readiness Index is an algorithmic estimation based on platform portfolio activity and does not constitute an official industry accreditation."
    }
