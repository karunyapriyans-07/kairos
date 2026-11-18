import re
from typing import Dict, Any, List
import io
import pypdf

# Comprehensive taxonomy of technical skills and programming languages
TECH_SKILLS_TAXONOMY = {
    "Languages": [
        "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "C", "Go", "Golang",
        "Rust", "PHP", "Ruby", "Kotlin", "Swift", "Dart", "R", "SQL", "HTML", "CSS", "Bash"
    ],
    "Frameworks & Libraries": [
        "React", "React.js", "Node.js", "Express", "Next.js", "Vue", "Angular", "FastAPI",
        "Django", "Flask", "Spring Boot", "ASP.NET", "Tailwind CSS", "Bootstrap", "Redux",
        "PyTorch", "TensorFlow", "Keras", "Scikit-Learn", "Pandas", "NumPy", "OpenCV",
        "GraphQL", "REST API", "Prisma", "SQLAlchemy", "Hibernate"
    ],
    "Databases & Cloud": [
        "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Firebase", "DynamoDB",
        "AWS", "Azure", "Google Cloud", "GCP", "Docker", "Kubernetes", "Git", "GitHub",
        "CI/CD", "Linux", "Nginx", "Kafka", "RabbitMQ", "Elasticsearch"
    ],
    "Domains & Methodologies": [
        "Machine Learning", "Deep Learning", "Artificial Intelligence", "Data Science",
        "Data Analytics", "Cybersecurity", "Computer Vision", "NLP", "Natural Language Processing",
        "Cloud Computing", "DevOps", "Microservices", "System Design", "Agile", "Scrum",
        "UI/UX Design", "Figma", "Power BI", "Tableau", "Excel"
    ]
}

ALL_SKILLS_FLAT = [skill for cat in TECH_SKILLS_TAXONOMY.values() for skill in cat]

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract raw text from PDF bytes using pypdf."""
    text = ""
    try:
        reader = pypdf.PdfReader(io.BytesIO(file_bytes))
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
    except Exception as e:
        print(f"PDF extraction error: {e}")
    return text

def parse_resume_content(text: str) -> Dict[str, Any]:
    """Parse resume text and extract skills, education, projects, certifications, and calculate score."""
    clean_text = text.replace("\r", " ")
    lower_text = clean_text.lower()

    # 1. Extract Skills
    extracted_skills = []
    found_skill_names = set()

    for category, skills in TECH_SKILLS_TAXONOMY.items():
        for skill in skills:
            # Word boundary matching
            pattern = r'\b' + re.escape(skill.lower()) + r'\b'
            if re.search(pattern, lower_text):
                if skill.lower() not in found_skill_names:
                    found_skill_names.add(skill.lower())
                    extracted_skills.append({
                        "name": skill,
                        "category": category,
                        "proficiency": "Intermediate" # Default initial
                    })

    # 2. Extract Contact Info & Links
    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', clean_text)
    phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', clean_text)
    github_match = re.search(r'github\.com/[\w\d-]+', clean_text, re.IGNORECASE)
    linkedin_match = re.search(r'linkedin\.com/in/[\w\d-]+', clean_text, re.IGNORECASE)

    # 3. Extract Education
    degrees_found = []
    for deg in ["B.Tech", "B.E", "B.S", "B.Sc", "M.Tech", "M.S", "MCA", "BCA", "Bachelor of Technology", "Bachelor of Science"]:
        if re.search(r'\b' + re.escape(deg.lower()) + r'\b', lower_text):
            degrees_found.append(deg)

    grad_year_match = re.search(r'\b(202[3-9]|2030)\b', clean_text)
    grad_year = int(grad_year_match.group(1)) if grad_year_match else 2025

    # 4. Extract Project hints
    projects_found = []
    project_sections = re.findall(r'(?:project[s]?|academic projects)[:\n\r]+(.*?)(?=\n[A-Z][a-z]+|\Z)', clean_text, re.DOTALL | re.IGNORECASE)
    if project_sections:
        # Extract potential bullet points or lines
        lines = [line.strip("- •*").strip() for line in project_sections[0].split("\n") if len(line.strip()) > 15]
        for idx, line in enumerate(lines[:4]):
            title = line[:50]
            projects_found.append({
                "title": f"Project {idx+1}: {title}...",
                "description": line,
                "tech_stack": ", ".join([s["name"] for s in extracted_skills[:3]]) if extracted_skills else "Python, SQL"
            })
    else:
        # Fallback project detection
        if "project" in lower_text:
            projects_found.append({
                "title": "Full-Stack Web & AI Application",
                "description": "Designed and deployed responsive web application with backend API integration.",
                "tech_stack": "React, Python, SQLite"
            })

    # 5. Extract Certifications
    certifications_found = []
    for cert_keyword in ["AWS Certified", "Google Cloud Certified", "DeepLearning.AI", "Meta Front-End", "Oracle Certified", "HackerRank", "Coursera", "Udemy"]:
        if re.search(r'\b' + re.escape(cert_keyword.lower()) + r'\b', lower_text):
            certifications_found.append({
                "name": cert_keyword,
                "issuer": "Authorized Certification Body",
                "issue_date": "2024"
            })

    # 6. Calculate Transparent Resume Score (out of 100)
    # Skills: max 25
    skill_pts = min(25.0, len(extracted_skills) * 2.5)
    
    # Projects: max 20
    proj_pts = 20.0 if len(projects_found) >= 2 else (12.0 if len(projects_found) == 1 else 5.0)
    
    # Experience / Action verbs: max 20
    action_verbs = ["built", "developed", "implemented", "designed", "engineered", "optimized", "managed", "created", "led"]
    verb_count = sum(1 for v in action_verbs if v in lower_text)
    exp_pts = min(20.0, verb_count * 2.5 + (8.0 if "intern" in lower_text or "experience" in lower_text else 3.0))

    # Certifications: max 15
    cert_pts = min(15.0, len(certifications_found) * 7.5 + (5.0 if "certificate" in lower_text or "course" in lower_text else 0.0))

    # Education completeness: max 10
    edu_pts = 10.0 if degrees_found and grad_year_match else (6.0 if degrees_found or grad_year_match else 3.0)

    # Resume structure & contact: max 10
    struct_pts = 0.0
    if email_match: struct_pts += 3.0
    if github_match or "github" in lower_text: struct_pts += 3.0
    if linkedin_match or "linkedin" in lower_text: struct_pts += 2.0
    if phone_match: struct_pts += 2.0

    total_score = round(min(100.0, max(20.0, skill_pts + proj_pts + exp_pts + cert_pts + edu_pts + struct_pts)))

    # Strengths
    strengths = []
    if len(extracted_skills) >= 6:
        strengths.append(f"Strong technical skill breadth: detected {len(extracted_skills)} industry-standard skills.")
    if github_match or "github" in lower_text:
        strengths.append("Contains GitHub repository links demonstrating open-source code artifacts.")
    if projects_found:
        strengths.append("Project section includes concrete technical implementations and tech stack references.")
    if degrees_found:
        strengths.append(f"Clear degree qualification indicated: {degrees_found[0]}.")

    # Missing Sections & Warnings
    missing_sections = []
    if not github_match and "github" not in lower_text:
        missing_sections.append("GitHub Profile Link missing")
    if not linkedin_match and "linkedin" not in lower_text:
        missing_sections.append("LinkedIn Profile Link missing")
    if not certifications_found:
        missing_sections.append("Industry Certifications missing")
    if not any(char.isdigit() and "%" in clean_text for char in clean_text):
        missing_sections.append("Quantifiable metrics (e.g. 'improved performance by 25%') missing")

    # Actionable Improvement Suggestions
    improvement_suggestions = []
    if missing_sections:
        improvement_suggestions.append(f"Add missing profile elements: {', '.join(missing_sections[:2])}.")
    if skill_pts < 20:
        improvement_suggestions.append("Enrich your technical skills section with databases, cloud platforms, and developer tooling (Docker, Git).")
    if proj_pts < 18:
        improvement_suggestions.append("Detail at least 2 in-depth project entries with technologies used, architecture, and live demo links.")
    improvement_suggestions.append("Use strong action verbs (e.g. 'Engineered', 'Optimized', 'Deployed') at the beginning of each bullet point.")

    return {
        "score": total_score,
        "score_breakdown": {
            "skills": {"score": round(skill_pts, 1), "max": 25.0, "label": "Technical Skills"},
            "projects": {"score": round(proj_pts, 1), "max": 20.0, "label": "Project Evidence"},
            "experience": {"score": round(exp_pts, 1), "max": 20.0, "label": "Experience & Impact"},
            "certifications": {"score": round(cert_pts, 1), "max": 15.0, "label": "Certifications"},
            "education": {"score": round(edu_pts, 1), "max": 10.0, "label": "Education Completeness"},
            "structure": {"score": round(struct_pts, 1), "max": 10.0, "label": "Structure & Links"}
        },
        "extracted_skills": extracted_skills,
        "degrees": degrees_found or ["B.Tech"],
        "graduation_year": grad_year,
        "email": email_match.group(0) if email_match else "",
        "phone": phone_match.group(0) if phone_match else "",
        "github": github_match.group(0) if github_match else "",
        "linkedin": linkedin_match.group(0) if linkedin_match else "",
        "projects_found": projects_found,
        "certifications_found": certifications_found,
        "strengths": strengths,
        "missing_sections": missing_sections,
        "improvement_suggestions": improvement_suggestions,
        "extracted_text_preview": clean_text[:400] + "..." if len(clean_text) > 400 else clean_text
    }
