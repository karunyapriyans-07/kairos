import re
from typing import Dict, Any, List

def normalize_skill(skill: str) -> str:
    """Normalize skill string for accurate comparison."""
    s = skill.lower().strip()
    # common abbreviations & normalizations
    mappings = {
        "react.js": "react",
        "reactjs": "react",
        "node.js": "nodejs",
        "node js": "nodejs",
        "vue.js": "vue",
        "vuejs": "vue",
        "next.js": "nextjs",
        "ml": "machine learning",
        "ai": "artificial intelligence",
        "ts": "typescript",
        "js": "javascript",
        "py": "python",
        "k8s": "kubernetes",
        "postgres": "postgresql",
        "mongo": "mongodb",
        "aws cloud": "aws"
    }
    return mappings.get(s, s)

def calculate_internship_match(student_profile, internship) -> Dict[str, Any]:
    """
    Calculate weighted match between a student and an internship.
    Formula:
      Skill Match — 45%
      Project Experience — 20%
      Domain Interest — 15%
      Eligibility — 10%
      Availability — 10%
      Total = 100%
    """
    # 1. Prepare student data
    student_skills_dict = {}
    for sk in (student_profile.skills or []):
        norm = normalize_skill(sk.skill_name)
        prof = (sk.proficiency or "Intermediate").lower()
        multiplier = 1.0 if prof == "advanced" else (0.85 if prof == "intermediate" else 0.65)
        student_skills_dict[norm] = {
            "name": sk.skill_name,
            "proficiency": sk.proficiency or "Intermediate",
            "weight": multiplier
        }

    student_projects = student_profile.projects or []
    student_domain = (student_profile.preferred_domain or "").lower()
    student_role = (student_profile.preferred_role or "").lower()
    student_grad_year = student_profile.graduation_year or 2025
    student_degree = (student_profile.degree or "").lower()

    # 2. Prepare internship requirements
    req_skills_raw = [s.strip() for s in (internship.required_skills or "").split(",") if s.strip()]
    pref_skills_raw = [s.strip() for s in (internship.preferred_skills or "").split(",") if s.strip()]
    
    req_norm = [normalize_skill(s) for s in req_skills_raw]
    pref_norm = [normalize_skill(s) for s in pref_skills_raw]
    
    internship_domain = (internship.domain or "").lower()
    internship_title = (internship.title or "").lower()

    # --- CATEGORY 1: SKILL MATCH (45%) ---
    matched_skills = []
    missing_skills = []
    skill_earned_points = 0.0

    if req_skills_raw:
        points_per_req = 38.0 / len(req_skills_raw)
        for original, norm in zip(req_skills_raw, req_norm):
            if norm in student_skills_dict:
                item = student_skills_dict[norm]
                score_contrib = points_per_req * item["weight"]
                skill_earned_points += score_contrib
                matched_skills.append({
                    "skill": original,
                    "proficiency": item["proficiency"],
                    "status": "Matched",
                    "importance": "Required"
                })
            else:
                missing_skills.append({
                    "skill": original,
                    "status": "Missing",
                    "importance": "Required",
                    "priority": "High"
                })

        # Preferred skills bonus (up to 7 points)
        if pref_skills_raw:
            pts_per_pref = 7.0 / len(pref_skills_raw)
            for original, norm in zip(pref_skills_raw, pref_norm):
                if norm in student_skills_dict:
                    item = student_skills_dict[norm]
                    skill_earned_points += pts_per_pref * item["weight"]
                    matched_skills.append({
                        "skill": original,
                        "proficiency": item["proficiency"],
                        "status": "Matched",
                        "importance": "Preferred"
                    })
                else:
                    missing_skills.append({
                        "skill": original,
                        "status": "Missing",
                        "importance": "Preferred",
                        "priority": "Medium"
                    })
    else:
        skill_earned_points = 35.0

    skill_score = min(45.0, round(skill_earned_points, 1))

    # --- CATEGORY 2: PROJECT EXPERIENCE (20%) ---
    project_earned_points = 0.0
    relevant_projects_count = 0

    combined_internship_text = f"{internship_title} {internship_domain} {internship.description} {internship.required_project_experience}".lower()

    for proj in student_projects:
        proj_text = f"{proj.title} {proj.description} {proj.tech_stack}".lower()
        # Check overlaps
        overlap = False
        for sk in req_norm:
            if sk in proj_text:
                overlap = True
                break
        if not overlap:
            for word in internship_domain.split():
                if len(word) > 2 and word in proj_text:
                    overlap = True
                    break
        if overlap:
            relevant_projects_count += 1

    if relevant_projects_count >= 2:
        project_earned_points = 20.0
    elif relevant_projects_count == 1:
        project_earned_points = 14.0
    elif len(student_projects) > 0:
        project_earned_points = 8.0
    else:
        project_earned_points = 4.0

    project_score = min(20.0, round(project_earned_points, 1))

    # --- CATEGORY 3: DOMAIN INTEREST (15%) ---
    domain_score = 5.0
    if student_domain in internship_domain or internship_domain in student_domain:
        domain_score = 15.0
    elif any(d in internship_title for d in [student_domain, student_role]):
        domain_score = 14.0
    elif ("web" in student_domain and "web" in internship_domain) or \
         ("ai" in student_domain and ("ai" in internship_domain or "data" in internship_domain)) or \
         ("data" in student_domain and ("data" in internship_domain or "analytics" in internship_domain)) or \
         ("python" in student_role and "python" in internship_title):
        domain_score = 12.0
    elif len(student_domain) > 0:
        domain_score = 7.0

    # --- CATEGORY 4: ELIGIBILITY (10%) ---
    eligibility_score = 8.0
    elig_text = (internship.eligibility or "").lower()
    if str(student_grad_year) in elig_text or "final" in elig_text or "pre-final" in elig_text or "students" in elig_text:
        eligibility_score = 10.0
    elif "b.tech" in elig_text or "cs" in elig_text or "it" in elig_text:
        eligibility_score = 9.0

    # --- CATEGORY 5: AVAILABILITY (10%) ---
    availability_score = 9.0
    student_avail = (student_profile.availability or "").lower()
    internship_mode = (internship.work_mode or "").lower()
    if "immediate" in student_avail or "full-time" in student_avail:
        availability_score = 10.0
    elif "remote" in internship_mode and "remote" in (student_profile.location_preference or "").lower():
        availability_score = 10.0

    # TOTAL SCORE
    total = round(skill_score + project_score + domain_score + eligibility_score + availability_score)
    total = max(15, min(99, total))

    # Match Label
    if total >= 80:
        match_label = "Excellent Match"
        match_tier = "excellent"
    elif total >= 65:
        match_label = "Strong Match"
        match_tier = "strong"
    elif total >= 50:
        match_label = "Moderate Match"
        match_tier = "moderate"
    else:
        match_label = "Low Match"
        match_tier = "low"

    # Explainable reasons
    reasons = []
    if skill_score >= 32:
        reasons.append(f"Strong overlap on {len(matched_skills)} core technical skills required by {internship.company_name}.")
    elif skill_score >= 20:
        reasons.append(f"Solid foundational skills matching {len(matched_skills)} criteria with minor gaps.")
    else:
        reasons.append("Opportunity to bridge key technical skills needed for this role.")

    if project_score >= 14:
        reasons.append(f"Your hands-on project portfolio demonstrates applied competency in relevant technologies.")
    
    if domain_score >= 12:
        reasons.append(f"Your career preference for '{student_profile.preferred_domain}' directly matches this opportunity.")

    if availability_score >= 9:
        reasons.append("Your work mode and availability schedule seamlessly fit the internship timeline.")

    # Practical suggestions to improve match
    suggestions = []
    high_missing = [m["skill"] for m in missing_skills if m.get("priority") == "High"]
    if high_missing:
        suggestions.append(f"Focus on mastering {', '.join(high_missing[:3])} to raise your match score by up to {min(20, len(high_missing)*6)}%.")
    
    if project_score < 18:
        suggestions.append(f"Build a showcase project highlighting {internship.domain} concepts and push it to GitHub.")
    
    if any(m["proficiency"] == "Beginner" for m in matched_skills):
        beg_skills = [m["skill"] for m in matched_skills if m["proficiency"] == "Beginner"]
        suggestions.append(f"Level up proficiency from Beginner to Intermediate in {', '.join(beg_skills[:2])}.")

    if not suggestions:
        suggestions.append("Your profile is exceptionally well-aligned! Polish your technical interview answers and submit early.")

    # Natural Language Summary Explanation
    matched_names = [m["skill"] for m in matched_skills[:4]]
    missing_names = [m["skill"] for m in missing_skills[:3]]

    matched_phrase = f"you have {', '.join(matched_names)}" if matched_names else "you have transferable foundational knowledge"
    project_phrase = "and relevant hands-on project experience" if project_score >= 14 else "with initial project groundwork"
    missing_phrase = f"{', '.join(missing_names)} are your main missing skills" if missing_names else "no critical skill gaps identified"

    explanation_text = (
        f"You are a {total}% match because {matched_phrase} {project_phrase}. "
        f"Your domain interest in {student_profile.preferred_domain or 'tech'} aligns with this {internship.domain} position. "
        f"{missing_phrase}."
    )

    return {
        "internship_id": internship.id,
        "match_percentage": total,
        "match_label": match_label,
        "match_tier": match_tier,
        "breakdown": {
            "skill_match": {
                "score": skill_score,
                "max": 45.0,
                "percentage": round((skill_score / 45.0) * 100, 1),
                "weight": "45%"
            },
            "project_experience": {
                "score": project_score,
                "max": 20.0,
                "percentage": round((project_score / 20.0) * 100, 1),
                "weight": "20%"
            },
            "domain_interest": {
                "score": domain_score,
                "max": 15.0,
                "percentage": round((domain_score / 15.0) * 100, 1),
                "weight": "15%"
            },
            "eligibility": {
                "score": eligibility_score,
                "max": 10.0,
                "percentage": round((eligibility_score / 10.0) * 100, 1),
                "weight": "10%"
            },
            "availability": {
                "score": availability_score,
                "max": 10.0,
                "percentage": round((availability_score / 10.0) * 100, 1),
                "weight": "10%"
            }
        },
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "eligibility_status": "Eligible" if eligibility_score >= 8 else "Conditional Review",
        "reasons": reasons,
        "suggestions": suggestions,
        "explanation": explanation_text
    }
