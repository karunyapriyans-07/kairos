import hashlib
from datetime import datetime, timedelta
from database import SessionLocal, engine, Base
import models

def hash_password(password: str) -> str:
    """Deterministic hash with salt for demo stability."""
    salt = "internpath_secure_salt_2026"
    return hashlib.sha256((password + salt).encode('utf-8')).hexdigest()

def verify_password(plain_password: str, hashed: str) -> bool:
    return hash_password(plain_password) == hashed

SAMPLE_INTERNSHIPS = [
    # 1. AI / Machine Learning
    {
        "title": "AI Research & NLP Intern",
        "company_name": "CogniTech AI Labs",
        "logo_url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=60",
        "domain": "AI / Machine Learning",
        "work_mode": "Remote",
        "location": "Bangalore / Remote",
        "duration": "6 Months",
        "stipend": "₹35,000 / month",
        "eligibility": "Pre-final or Final year B.Tech/M.Tech in CS, AI, or Data Science with strong math foundation",
        "application_deadline": "2026-12-25",
        "description": "Join our applied research group developing transformer-based document summarization and retrieval-augmented generation (RAG) agents.",
        "responsibilities": "Design and benchmark fine-tuning pipelines using PyTorch and HuggingFace. Evaluate hallucination metrics and build API endpoints for prototype integration.",
        "required_project_experience": "At least one project involving NLP, embeddings, or LLM agents with code available on GitHub.",
        "required_skills": "Python, Machine Learning, PyTorch, NLP",
        "preferred_skills": "Docker, FastAPI, Git, Transformers"
    },
    {
        "title": "Computer Vision & Edge AI Intern",
        "company_name": "Visionary Robotics",
        "logo_url": "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=120&auto=format&fit=crop&q=60",
        "domain": "AI / Machine Learning",
        "work_mode": "Hybrid",
        "location": "Hyderabad, India",
        "duration": "3 Months",
        "stipend": "₹30,000 / month",
        "eligibility": "B.Tech/B.E in CS, Electronics, or AI graduating in 2025 or 2026",
        "application_deadline": "2026-12-30",
        "description": "Build high-throughput object detection and semantic segmentation pipelines for autonomous drones and industrial monitoring systems.",
        "responsibilities": "Optimize YOLO and OpenCV models for edge deployment. Label and augment synthetic datasets; run real-time inference tests.",
        "required_project_experience": "Demonstrated hands-on experience training custom OpenCV / PyTorch models.",
        "required_skills": "Python, OpenCV, Machine Learning, Deep Learning",
        "preferred_skills": "C++, Linux, Git, TensorRT"
    },
    {
        "title": "Generative AI Systems Intern",
        "company_name": "DeepMind Innovations",
        "logo_url": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=120&auto=format&fit=crop&q=60",
        "domain": "AI / Machine Learning",
        "work_mode": "Remote",
        "location": "Remote, India",
        "duration": "6 Months",
        "stipend": "₹40,000 / month",
        "eligibility": "Students with demonstrable GitHub contributions in generative AI or machine learning models",
        "application_deadline": "2027-01-15",
        "description": "Work directly with core engineering to construct multimodal agents, vector database indexing, and low-latency inference pipelines.",
        "responsibilities": "Implement LangChain/LlamaIndex orchestrations, benchmark vector embedding databases, write unit tests and documentation.",
        "required_project_experience": "Production or prototype AI bot with vector database search integration.",
        "required_skills": "Python, Machine Learning, REST API, Git",
        "preferred_skills": "FastAPI, PostgreSQL, Redis, Docker"
    },

    # 2. Python Development
    {
        "title": "Backend Python Developer Intern",
        "company_name": "ScaleData Systems",
        "logo_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&auto=format&fit=crop&q=60",
        "domain": "Python Development",
        "work_mode": "Remote",
        "location": "Pune / Remote",
        "duration": "3-6 Months",
        "stipend": "₹28,000 / month",
        "eligibility": "B.Tech / MCA students with strong object-oriented programming concepts",
        "application_deadline": "2026-12-20",
        "description": "Construct high-volume asynchronous APIs and backend microservices serving millions of analytics requests daily.",
        "responsibilities": "Develop modular FastAPI and Django endpoints. Write automated test suites, optimize PostgreSQL database queries, and integrate message brokers.",
        "required_project_experience": "CRUD web application or API backend built using Python and relational databases.",
        "required_skills": "Python, SQL, REST API, FastAPI",
        "preferred_skills": "Docker, PostgreSQL, Git, Redis"
    },
    {
        "title": "Python Cloud Automation Intern",
        "company_name": "InfraCloud Networks",
        "logo_url": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=120&auto=format&fit=crop&q=60",
        "domain": "Python Development",
        "work_mode": "Hybrid",
        "location": "Bangalore, India",
        "duration": "3 Months",
        "stipend": "₹26,000 / month",
        "eligibility": "2025/2026 Batch CS/IT students interested in automation and infrastructure",
        "application_deadline": "2026-12-28",
        "description": "Automate cloud provisioning scripts and server health telemetry using Python, boto3, and Linux automation tools.",
        "responsibilities": "Create automated CLI tools and alert monitors in Python. Write infrastructure health checks and parse multi-cloud telemetry logs.",
        "required_project_experience": "Automation scripts or tooling created using Python standard library or third-party APIs.",
        "required_skills": "Python, Linux, Git, Bash",
        "preferred_skills": "AWS, Docker, SQL, CI/CD"
    },
    {
        "title": "Python & Django Web Intern",
        "company_name": "FinTech Nexus",
        "logo_url": "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=120&auto=format&fit=crop&q=60",
        "domain": "Python Development",
        "work_mode": "Remote",
        "location": "Mumbai / Remote",
        "duration": "6 Months",
        "stipend": "₹30,000 / month",
        "eligibility": "Students familiar with full-stack web concepts and relational database schema design",
        "application_deadline": "2027-01-10",
        "description": "Develop secure financial verification portals and reporting dashboards utilizing Django ORM and PostgreSQL.",
        "responsibilities": "Build authentication flows, permission controls, and RESTful serializer endpoints. Collaborate with frontend engineers.",
        "required_project_experience": "Deployed full-stack Django or Flask project with authentication and database storage.",
        "required_skills": "Python, Django, SQL, HTML",
        "preferred_skills": "PostgreSQL, JavaScript, Git, CSS"
    },

    # 3. Web Development
    {
        "title": "Full Stack Web Developer Intern",
        "company_name": "PixelCraft Studios",
        "logo_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=120&auto=format&fit=crop&q=60",
        "domain": "Web Development",
        "work_mode": "Remote",
        "location": "Remote, India",
        "duration": "3-6 Months",
        "stipend": "₹25,000 / month",
        "eligibility": "Proficiency in JavaScript/TypeScript and modern UI component architecture",
        "application_deadline": "2026-12-18",
        "description": "Create responsive web applications, interactive portals, and seamless client-server integrations.",
        "responsibilities": "Build UI components in React and connect them with Node.js/Express backend services. Implement state management and responsive CSS.",
        "required_project_experience": "At least one full-stack web application hosted online with code on GitHub.",
        "required_skills": "React, JavaScript, HTML, CSS, Node.js",
        "preferred_skills": "TypeScript, Tailwind CSS, Git, MongoDB"
    },
    {
        "title": "Frontend React.js Specialist Intern",
        "company_name": "Nova UI Technologies",
        "logo_url": "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=120&auto=format&fit=crop&q=60",
        "domain": "Web Development",
        "work_mode": "Hybrid",
        "location": "Gurgaon, India",
        "duration": "3 Months",
        "stipend": "₹24,000 / month",
        "eligibility": "Students with passion for slick UI animations, accessibility, and modern frontend tools",
        "application_deadline": "2026-12-22",
        "description": "Craft high-performance user interfaces and responsive dashboards for enterprise SaaS clients.",
        "responsibilities": "Translate Figma designs into pixel-perfect React components. Optimize bundle sizes and maintain accessible UI design standards.",
        "required_project_experience": "React portfolio with clean UI, responsive layouts, and API integrations.",
        "required_skills": "React, JavaScript, CSS, HTML",
        "preferred_skills": "Tailwind CSS, Redux, REST API, Git"
    },
    {
        "title": "Next.js & Cloud App Intern",
        "company_name": "HyperGrowth Web Labs",
        "logo_url": "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=120&auto=format&fit=crop&q=60",
        "domain": "Web Development",
        "work_mode": "Remote",
        "location": "Remote, India",
        "duration": "6 Months",
        "stipend": "₹32,000 / month",
        "eligibility": "Strong grounding in modern React 18, Server Components, and SSR architectures",
        "application_deadline": "2027-01-05",
        "description": "Develop high-speed Jamstack web portals and e-commerce platforms using Next.js and Tailwind CSS.",
        "responsibilities": "Implement server-side rendering, dynamic routing, and caching. Integrate Stripe payments and Supabase databases.",
        "required_project_experience": "Next.js web project deployed on Vercel or Netlify.",
        "required_skills": "React, Next.js, TypeScript, JavaScript",
        "preferred_skills": "Tailwind CSS, PostgreSQL, REST API, Git"
    },

    # 4. Data Analytics
    {
        "title": "Business & Data Analyst Intern",
        "company_name": "MetroMetrics Analytics",
        "logo_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=120&auto=format&fit=crop&q=60",
        "domain": "Data Analytics",
        "work_mode": "Remote",
        "location": "Chennai / Remote",
        "duration": "3 Months",
        "stipend": "₹22,000 / month",
        "eligibility": "Students pursuing B.Tech, B.Sc, or MBA with strong quantitative problem-solving skills",
        "application_deadline": "2026-12-19",
        "description": "Analyze complex commercial datasets to unearth market patterns, customer churn rates, and growth opportunities.",
        "responsibilities": "Write complex SQL queries, build interactive dashboards in Power BI, and extract insights from raw corporate data.",
        "required_project_experience": "Business case study or analytics report using SQL and visualization tools.",
        "required_skills": "SQL, Excel, Power BI, Data Analytics",
        "preferred_skills": "Python, Tableau, Statistics, Pandas"
    },
    {
        "title": "Data Insights & BI Intern",
        "company_name": "Vantage Global Insights",
        "logo_url": "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=120&auto=format&fit=crop&q=60",
        "domain": "Data Analytics",
        "work_mode": "Hybrid",
        "location": "Bangalore, India",
        "duration": "6 Months",
        "stipend": "₹28,000 / month",
        "eligibility": "Proficiency in statistical methods, data cleaning, and dashboard construction",
        "application_deadline": "2027-01-12",
        "description": "Transform transactional records into strategic executive dashboards and automated KPI tracking reports.",
        "responsibilities": "Clean and harmonize multi-source data using Python/Pandas. Construct automated Tableau and Power BI visual decks.",
        "required_project_experience": "Hands-on data cleaning and dashboard building project using real-world public datasets.",
        "required_skills": "SQL, Python, Pandas, Power BI",
        "preferred_skills": "Tableau, Excel, Statistics, Machine Learning"
    },
    {
        "title": "Quantitative Analytics Intern",
        "company_name": "Apex Capital Research",
        "logo_url": "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=120&auto=format&fit=crop&q=60",
        "domain": "Data Analytics",
        "work_mode": "Remote",
        "location": "Mumbai / Remote",
        "duration": "3 Months",
        "stipend": "₹30,000 / month",
        "eligibility": "Strong background in statistics, linear algebra, and data wrangling",
        "application_deadline": "2026-12-31",
        "description": "Model financial and operational risk indicators using probability distributions and predictive regressions.",
        "responsibilities": "Conduct exploratory data analysis on time-series records. Validate hypothesis testing and automate analytical charts.",
        "required_project_experience": "Statistical modeling or exploratory data analysis notebook.",
        "required_skills": "Python, SQL, Statistics, Excel",
        "preferred_skills": "NumPy, Pandas, Scikit-Learn, Power BI"
    },

    # 5. UI/UX Design
    {
        "title": "UI/UX Product Design Intern",
        "company_name": "Prism Design Labs",
        "logo_url": "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=120&auto=format&fit=crop&q=60",
        "domain": "UI/UX Design",
        "work_mode": "Remote",
        "location": "Remote, India",
        "duration": "3 Months",
        "stipend": "₹20,000 / month",
        "eligibility": "Design portfolio demonstrating user research, wireframes, and interactive prototypes",
        "application_deadline": "2026-12-24",
        "description": "Design elegant mobile and web product interfaces with high accessibility and modern aesthetic clarity.",
        "responsibilities": "Conduct user journey mapping, design wireframes and high-fidelity prototypes in Figma, and build component libraries.",
        "required_project_experience": "Figma case study covering user research to finished interactive prototypes.",
        "required_skills": "UI/UX Design, Figma, HTML, CSS",
        "preferred_skills": "Design Systems, User Research, Prototyping"
    },
    {
        "title": "Design Systems & Figma Intern",
        "company_name": "Aura Interactive",
        "logo_url": "https://images.unsplash.com/photo-1576153192396-180ecef2a715?w=120&auto=format&fit=crop&q=60",
        "domain": "UI/UX Design",
        "work_mode": "Hybrid",
        "location": "Bangalore, India",
        "duration": "6 Months",
        "stipend": "₹25,000 / month",
        "eligibility": "Students experienced in component tokenization and cross-functional handoff to developers",
        "application_deadline": "2027-01-20",
        "description": "Maintain and expand unified design systems for multiple web and native mobile apps.",
        "responsibilities": "Organize variant sets, auto-layout components, and token variables in Figma. Work with frontend React devs.",
        "required_project_experience": "Figma design system project with tokens and reusable responsive components.",
        "required_skills": "UI/UX Design, Figma, CSS",
        "preferred_skills": "React, Prototyping, Wireframing"
    },

    # 6. Cybersecurity
    {
        "title": "Cyber Threat Intelligence Intern",
        "company_name": "Sentinel Cyber Defense",
        "logo_url": "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=120&auto=format&fit=crop&q=60",
        "domain": "Cybersecurity",
        "work_mode": "Remote",
        "location": "Delhi / Remote",
        "duration": "3 Months",
        "stipend": "₹25,000 / month",
        "eligibility": "Knowledge of networking protocols, OWASP Top 10 vulnerabilities, and security audit tools",
        "application_deadline": "2026-12-29",
        "description": "Monitor attack surfaces, triage potential security incidents, and assist in penetration vulnerability assessments.",
        "responsibilities": "Analyze firewall logs, investigate SIEM alerts, identify phishing vectors, and produce vulnerability reports.",
        "required_project_experience": "Capture The Flag (CTF) participation or vulnerability report writeups.",
        "required_skills": "Cybersecurity, Linux, Python, Bash",
        "preferred_skills": "Git, Wireshark, Docker, SQL"
    },
    {
        "title": "Application Security Intern",
        "company_name": "SecureNet Labs",
        "logo_url": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=120&auto=format&fit=crop&q=60",
        "domain": "Cybersecurity",
        "work_mode": "Hybrid",
        "location": "Pune, India",
        "duration": "6 Months",
        "stipend": "₹30,000 / month",
        "eligibility": "Familiarity with static code analysis (SAST) and web API penetration testing",
        "application_deadline": "2027-01-08",
        "description": "Audit web backend architectures for SQL injection, CSRF, and broken access controls.",
        "responsibilities": "Conduct automated code audits, construct proof-of-concept exploits in sandbox environments, and guide fixes.",
        "required_project_experience": "Security audit of an open-source web application or secure code implementation project.",
        "required_skills": "Cybersecurity, Python, SQL, Linux",
        "preferred_skills": "REST API, Git, Docker, Java"
    },

    # 7. Java Development
    {
        "title": "Enterprise Java Developer Intern",
        "company_name": "GlobalFin Technology",
        "logo_url": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=60",
        "domain": "Java Development",
        "work_mode": "Hybrid",
        "location": "Hyderabad, India",
        "duration": "6 Months",
        "stipend": "₹28,000 / month",
        "eligibility": "Strong foundation in Core Java (multithreading, collections, OOP, exception handling)",
        "application_deadline": "2026-12-27",
        "description": "Build high-reliability core banking microservices with Spring Boot and relational database clusters.",
        "responsibilities": "Develop modular REST controllers, implement database transactions with Hibernate/JPA, and write JUnit unit tests.",
        "required_project_experience": "Java project implementing OOP and relational database connection (JDBC/Hibernate).",
        "required_skills": "Java, SQL, Spring Boot, Git",
        "preferred_skills": "PostgreSQL, Docker, REST API, Linux"
    },
    {
        "title": "Spring Boot Microservices Intern",
        "company_name": "OmniServices Cloud",
        "logo_url": "https://images.unsplash.com/photo-1554774853-719586f82d77?w=120&auto=format&fit=crop&q=60",
        "domain": "Java Development",
        "work_mode": "Remote",
        "location": "Remote, India",
        "duration": "3 Months",
        "stipend": "₹25,000 / month",
        "eligibility": "Pre-final or Final year CS/IT students with Spring Framework foundations",
        "application_deadline": "2027-01-14",
        "description": "Design decoupled cloud microservices for real-time order processing and inventory notifications.",
        "responsibilities": "Configure service discovery, API gateways, and asynchronous Kafka messaging endpoints.",
        "required_project_experience": "Spring Boot application with REST APIs and database persistence.",
        "required_skills": "Java, Spring Boot, SQL, REST API",
        "preferred_skills": "Docker, Git, PostgreSQL, Kafka"
    },

    # 8. Cloud Computing
    {
        "title": "Cloud DevOps Engineer Intern",
        "company_name": "CloudScale Infrastructure",
        "logo_url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=120&auto=format&fit=crop&q=60",
        "domain": "Cloud Computing",
        "work_mode": "Remote",
        "location": "Bangalore / Remote",
        "duration": "6 Months",
        "stipend": "₹32,000 / month",
        "eligibility": "Hands-on experience with Linux environments, containerization, and cloud primitives",
        "application_deadline": "2026-12-30",
        "description": "Deploy automated CI/CD build pipelines and manage containerized cluster workloads in Kubernetes and AWS.",
        "responsibilities": "Write Dockerfiles, build GitHub Actions automation workflows, and monitor cluster resources.",
        "required_project_experience": "Containerized application deployed to AWS, GCP, or a virtual private server.",
        "required_skills": "Docker, Linux, AWS, Git",
        "preferred_skills": "Kubernetes, Python, CI/CD, Bash"
    },
    {
        "title": "AWS Solutions Architecture Intern",
        "company_name": "SkyHigh Technologies",
        "logo_url": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=120&auto=format&fit=crop&q=60",
        "domain": "Cloud Computing",
        "work_mode": "Hybrid",
        "location": "Chennai, India",
        "duration": "3 Months",
        "stipend": "₹27,000 / month",
        "eligibility": "Knowledge of AWS foundational services: EC2, S3, RDS, Lambda, and IAM policies",
        "application_deadline": "2027-01-18",
        "description": "Assist lead cloud architects in sizing serverless architectures and auditing cost-effective cloud infrastructure.",
        "responsibilities": "Configure cloud infrastructure templates, evaluate serverless event triggers, and generate architecture diagrams.",
        "required_project_experience": "Cloud deployment project using AWS services or Terraform.",
        "required_skills": "AWS, Cloud Computing, Linux, Git",
        "preferred_skills": "Python, Docker, SQL, Terraform"
    }
]

def seed_database(db):
    """Seed sample data into database."""
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)

    # Check if data already seeded
    existing_user = db.query(models.User).filter(models.User.email == "student@internpath.demo").first()
    if existing_user:
        print("Database already contains seed data. Skipping re-seed.")
        return

    print("Seeding database with realistic hackathon demo records...")

    # 1. Create Student A (Software / Web & Python Developer)
    student_a_user = models.User(
        email="student@internpath.demo",
        password_hash=hash_password("Student123!"),
        role="student",
        name="Aarav Sharma"
    )
    db.add(student_a_user)
    db.flush()

    student_a_profile = models.StudentProfile(
        user_id=student_a_user.id,
        college="Indian Institute of Information Technology",
        degree="B.Tech",
        department="Computer Science & Engineering",
        graduation_year=2025,
        preferred_role="Full Stack Developer",
        preferred_domain="Web Development",
        location_preference="Remote / Hybrid",
        internship_duration="3-6 Months",
        availability="Immediate (Full-time)",
        about_me="Passionate full-stack developer eager to design resilient distributed systems, fast modern web applications, and intuitive AI-assisted developer workflows.",
        profile_pic="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        resume_score=84.0,
        resume_analysis_json='{"strengths": ["Strong React and Python proficiency", "High project completeness with GitHub links", "Cloud fundamentals verified"], "missing_sections": ["Docker deployment metrics", "Unit testing code coverage"]}'
    )
    db.add(student_a_profile)
    db.flush()

    # Skills for Student A
    skills_a = [
        ("Python", "Advanced"),
        ("React", "Advanced"),
        ("JavaScript", "Advanced"),
        ("SQL", "Intermediate"),
        ("Node.js", "Intermediate"),
        ("HTML", "Advanced"),
        ("CSS", "Advanced"),
        ("Git", "Advanced"),
        ("FastAPI", "Intermediate"),
        ("Docker", "Beginner")
    ]
    for s_name, prof in skills_a:
        db.add(models.StudentSkill(student_id=student_a_profile.id, skill_name=s_name, proficiency=prof))

    # Projects for Student A
    db.add(models.Project(
        student_id=student_a_profile.id,
        title="Microservices E-Commerce Cloud Suite",
        description="Engineered a resilient e-commerce checkout and product catalog with JWT authentication, Redis caching, and Stripe payment webhooks.",
        tech_stack="React, Node.js, Express, MongoDB, Redis",
        github_url="https://github.com/aarav-dev/ecommerce-cloud",
        live_url="https://ecommerce-cloud-demo.vercel.app"
    ))
    db.add(models.Project(
        student_id=student_a_profile.id,
        title="AI Resume Vector Matcher",
        description="Built an intelligent job description matcher extracting skills with TF-IDF and calculating cosine similarity rankings for candidates.",
        tech_stack="Python, FastAPI, SQLite, React, Scikit-Learn",
        github_url="https://github.com/aarav-dev/ai-resume-matcher",
        live_url="https://resume-matcher.onrender.com"
    ))

    # Certifications for Student A
    db.add(models.Certification(
        student_id=student_a_profile.id,
        name="Meta Front-End Developer Professional Certificate",
        issuer="Meta / Coursera",
        issue_date="2024-05",
        credential_url="https://coursera.org/verify/meta-frontend"
    ))
    db.add(models.Certification(
        student_id=student_a_profile.id,
        name="AWS Certified Cloud Practitioner",
        issuer="Amazon Web Services",
        issue_date="2024-09",
        credential_url="https://aws.amazon.com/verification"
    ))

    # 2. Create Student B (Data Analytics / AI & Machine Learning profile)
    student_b_user = models.User(
        email="student2@internpath.demo",
        password_hash=hash_password("Student123!"),
        role="student",
        name="Priya Patel"
    )
    db.add(student_b_user)
    db.flush()

    student_b_profile = models.StudentProfile(
        user_id=student_b_user.id,
        college="National Institute of Technology",
        degree="B.Tech",
        department="Data Science & Artificial Intelligence",
        graduation_year=2025,
        preferred_role="Data Analyst & AI Intern",
        preferred_domain="Data Analytics",
        location_preference="Remote",
        internship_duration="6 Months",
        availability="Immediate (Full-time)",
        about_me="Data analytics student passionate about transforming raw business transactions into actionable predictive insights, statistical models, and executive dashboards.",
        profile_pic="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        resume_score=88.0,
        resume_analysis_json='{"strengths": ["Advanced SQL and statistical modeling", "Interactive Power BI & Tableau dashboards", "Machine learning classification pipelines"], "missing_sections": ["Cloud data warehouse (Snowflake) exposure"]}'
    )
    db.add(student_b_profile)
    db.flush()

    # Skills for Student B
    skills_b = [
        ("Python", "Advanced"),
        ("SQL", "Advanced"),
        ("Data Analytics", "Advanced"),
        ("Power BI", "Intermediate"),
        ("Excel", "Advanced"),
        ("Pandas", "Advanced"),
        ("Machine Learning", "Intermediate"),
        ("Statistics", "Advanced"),
        ("Tableau", "Beginner")
    ]
    for s_name, prof in skills_b:
        db.add(models.StudentSkill(student_id=student_b_profile.id, skill_name=s_name, proficiency=prof))

    # Projects for Student B
    db.add(models.Project(
        student_id=student_b_profile.id,
        title="Telecom Customer Churn Predictor",
        description="Analyzed 75,000 telco records with exploratory data analysis, built XGBoost classification pipeline achieving 89% AUC, and deployed interactive Streamlit dashboard.",
        tech_stack="Python, Pandas, Scikit-Learn, Streamlit, SQL",
        github_url="https://github.com/priyapatel-data/churn-predictor",
        live_url="https://churn-predictor.streamlit.app"
    ))
    db.add(models.Project(
        student_id=student_b_profile.id,
        title="Hospital Patient Flow & Bed Allocation Dashboard",
        description="Constructed an enterprise Power BI visual analytics suite tracking average length of stay, triage metrics, and bed utilization rates across 5 hospital wards.",
        tech_stack="SQL, Power BI, Excel, DAX",
        github_url="https://github.com/priyapatel-data/hospital-bi-analytics",
        live_url=""
    ))

    # Certifications for Student B
    db.add(models.Certification(
        student_id=student_b_profile.id,
        name="Google Data Analytics Professional Certificate",
        issuer="Google / Coursera",
        issue_date="2024-04",
        credential_url="https://coursera.org/verify/google-data"
    ))

    # 3. Create Mentor
    mentor_user = models.User(
        email="mentor@internpath.demo",
        password_hash=hash_password("Mentor123!"),
        role="mentor",
        name="Dr. Rajesh Kumar"
    )
    db.add(mentor_user)
    db.flush()

    mentor_profile = models.MentorProfile(
        user_id=mentor_user.id,
        designation="Principal Staff Engineer & Industry Mentor",
        organization="Nexus Dynamics",
        department="Engineering & Innovation",
        expertise="Full Stack Web, Python Architecture, Data Engineering & System Design",
        bio="Guiding promising students through real-world software engineering practices, agile milestones, and production architecture."
    )
    db.add(mentor_profile)
    db.flush()

    # 4. Seed 20 Realistic Internships
    created_internships = []
    for item in SAMPLE_INTERNSHIPS:
        internship = models.Internship(**item)
        db.add(internship)
        created_internships.append(internship)
    db.flush()

    # 5. Create Mentor Assignments
    # Assign mentor to Student A on Internship #7 (Full Stack Web Developer Intern)
    db.add(models.MentorAssignment(
        mentor_id=mentor_profile.id,
        student_id=student_a_profile.id,
        internship_id=created_internships[6].id # Full Stack Web Developer Intern
    ))
    # Assign mentor to Student B on Internship #10 (Business & Data Analyst Intern)
    db.add(models.MentorAssignment(
        mentor_id=mentor_profile.id,
        student_id=student_b_profile.id,
        internship_id=created_internships[9].id # Business & Data Analyst Intern
    ))

    # 6. Applications for Student A
    # Application 1: Selected / In Progress (Full Stack Web Developer Intern)
    app1 = models.Application(
        student_id=student_a_profile.id,
        internship_id=created_internships[6].id,
        status="Selected",
        application_date="2026-10-15",
        deadline=created_internships[6].application_deadline,
        notes="Offer accepted! Started internship on sprint tasks under Dr. Rajesh Kumar.",
        next_action="Submit Week 3 progress report"
    )
    # Application 2: Interview scheduled
    app2 = models.Application(
        student_id=student_a_profile.id,
        internship_id=created_internships[3].id, # Backend Python Developer Intern
        status="Interview",
        application_date="2026-11-02",
        deadline=created_internships[3].application_deadline,
        notes="Cleared coding round (scored 100%). System design interview scheduled.",
        interview_date="2026-11-24",
        next_action="Prepare microservices & database indexing concepts"
    )
    # Application 3: Assessment
    app3 = models.Application(
        student_id=student_a_profile.id,
        internship_id=created_internships[7].id, # Frontend React Specialist Intern
        status="Assessment",
        application_date="2026-11-10",
        deadline=created_internships[7].application_deadline,
        notes="Take-home challenge received: build an accessible dashboard widget.",
        next_action="Submit GitHub repo by Friday"
    )
    # Application 4: Applied
    app4 = models.Application(
        student_id=student_a_profile.id,
        internship_id=created_internships[8].id, # Next.js & Cloud App Intern
        status="Applied",
        application_date="2026-11-14",
        deadline=created_internships[8].application_deadline,
        notes="Application submitted via InternPath with 85% match score.",
        next_action="Awaiting recruiter profile review"
    )
    db.add_all([app1, app2, app3, app4])

    # Saved Internships for Student A
    db.add(models.SavedInternship(student_id=student_a_profile.id, internship_id=created_internships[0].id))
    db.add(models.SavedInternship(student_id=student_a_profile.id, internship_id=created_internships[4].id))

    # Applications for Student B
    db.add(models.Application(
        student_id=student_b_profile.id,
        internship_id=created_internships[9].id, # Business & Data Analyst Intern
        status="Selected",
        application_date="2026-10-20",
        deadline=created_internships[9].application_deadline,
        notes="Started 3-month Data Analytics internship. Working on weekly SQL ETL tasks.",
        next_action="Deliver weekly analytics report"
    ))
    db.add(models.Application(
        student_id=student_b_profile.id,
        internship_id=created_internships[0].id, # AI Research & NLP Intern
        status="Interview",
        application_date="2026-11-05",
        deadline=created_internships[0].application_deadline,
        notes="Technical round on PyTorch and model metrics.",
        interview_date="2026-11-26",
        next_action="Review RAG & vector embeddings"
    ))

    # 7. Roadmap & Tasks for Student A
    roadmap_a = models.Roadmap(
        student_id=student_a_profile.id,
        internship_id=created_internships[3].id, # Target: Backend Python Developer
        target_role="Backend Python & Cloud Engineer",
        title="4-Week Python Backend Mastery Roadmap"
    )
    db.add(roadmap_a)
    db.flush()

    tasks_a = [
        models.RoadmapTask(
            roadmap_id=roadmap_a.id,
            week_number=1,
            skill_name="FastAPI & Async Python",
            objective="Master asynchronous request lifecycles, Pydantic schemas, and dependency injection.",
            estimated_duration="6 hours",
            task_description="Build a CRUD REST API with dependency injection, JWT authentication, and automatic Swagger docs.",
            is_completed=True,
            completed_at=datetime.utcnow() - timedelta(days=14)
        ),
        models.RoadmapTask(
            roadmap_id=roadmap_a.id,
            week_number=2,
            skill_name="SQL Database Optimization",
            objective="Learn query execution plans, B-tree indexes, and composite constraints.",
            estimated_duration="8 hours",
            task_description="Profile slow PostgreSQL queries using EXPLAIN ANALYZE and add indexing to reduce latency by 60%.",
            is_completed=True,
            completed_at=datetime.utcnow() - timedelta(days=7)
        ),
        models.RoadmapTask(
            roadmap_id=roadmap_a.id,
            week_number=3,
            skill_name="Docker Containerization",
            objective="Package Python services with multi-stage Docker builds and Docker Compose.",
            estimated_duration="7 hours",
            task_description="Create optimized alpine Dockerfiles for FastAPI and SQLite/Postgres with health check configs.",
            is_completed=False
        ),
        models.RoadmapTask(
            roadmap_id=roadmap_a.id,
            week_number=4,
            skill_name="Redis Caching & Celery Workers",
            objective="Implement caching for high-read endpoints and background task queues.",
            estimated_duration="8 hours",
            task_description="Integrate Redis cache-aside strategy and asynchronous email delivery worker with retry logic.",
            is_completed=False
        )
    ]
    db.add_all(tasks_a)

    # 8. Weekly Progress Reports & Mentor Feedback for Student A
    # Week 1 Report (Approved with Feedback)
    report_w1 = models.WeeklyReport(
        student_id=student_a_profile.id,
        internship_id=created_internships[6].id,
        week_number=1,
        tasks_completed="Set up local development container; fixed navigation state bug in React navbar; wrote unit test specs for authentication reducer.",
        hours_worked=22.5,
        skills_learned="React Context API, Jest component testing, Git feature branch workflow",
        project_updates="Merged PR #12 fixing header responsiveness across mobile devices.",
        challenges_faced="Initial merge conflicts in shared layout css, resolved with mentor guidance.",
        next_week_goals="Begin building user settings modal and profile image upload pipeline.",
        evidence_links="https://github.com/aarav-dev/internship-work/pull/12",
        submission_date=(datetime.utcnow() - timedelta(days=14)).strftime("%Y-%m-%d"),
        mentor_id=mentor_profile.id,
        status="Approved",
        reviewed_at=datetime.utcnow() - timedelta(days=12)
    )
    db.add(report_w1)
    db.flush()

    feedback_w1 = models.MentorFeedback(
        report_id=report_w1.id,
        mentor_id=mentor_profile.id,
        student_id=student_a_profile.id,
        technical_score=4,
        communication_score=5,
        problem_solving_score=4,
        task_completion_score=5,
        initiative_score=4,
        overall_score=4.4,
        comments="Excellent start to the internship, Aarav! Clear commit messages and proactive communication during the daily standup. Keep up this momentum.",
        submitted_at=datetime.utcnow() - timedelta(days=12)
    )
    db.add(feedback_w1)

    # Week 2 Report (Approved with Feedback)
    report_w2 = models.WeeklyReport(
        student_id=student_a_profile.id,
        internship_id=created_internships[6].id,
        week_number=2,
        tasks_completed="Implemented user profile picture upload with client-side preview and secure validation; integrated toast notifications for success/error handling.",
        hours_worked=21.0,
        skills_learned="File API in modern browsers, FormData handling, Tailwind CSS animations",
        project_updates="Completed Sprint 1 milestone ahead of schedule. Deployed staging preview build.",
        challenges_faced="Handling non-standard image MIME types, solved by adding strict whitelist verification.",
        next_week_goals="Develop application tracking Kanban view and connect status update drag hooks.",
        evidence_links="https://github.com/aarav-dev/internship-work/pull/18",
        submission_date=(datetime.utcnow() - timedelta(days=7)).strftime("%Y-%m-%d"),
        mentor_id=mentor_profile.id,
        status="Approved",
        reviewed_at=datetime.utcnow() - timedelta(days=5)
    )
    db.add(report_w2)
    db.flush()

    feedback_w2 = models.MentorFeedback(
        report_id=report_w2.id,
        mentor_id=mentor_profile.id,
        student_id=student_a_profile.id,
        technical_score=5,
        communication_score=4,
        problem_solving_score=5,
        task_completion_score=5,
        initiative_score=5,
        overall_score=4.8,
        comments="Impressive work on the file upload validation security checks. Demonstrates mature production awareness beyond a junior level.",
        submitted_at=datetime.utcnow() - timedelta(days=5)
    )
    db.add(feedback_w2)

    # Week 3 Report (Submitted, Pending Review for Mentor Demo!)
    report_w3 = models.WeeklyReport(
        student_id=student_a_profile.id,
        internship_id=created_internships[6].id,
        week_number=3,
        tasks_completed="Constructed interactive Kanban board component; connected REST API endpoints for drag-and-drop status changes; added local state optimistic updates.",
        hours_worked=24.0,
        skills_learned="Optimistic UI updates, Drag-and-Drop HTML5 APIs, Recharts data visualization",
        project_updates="PR #24 ready for mentor review. Staging testing passed without regressions.",
        challenges_faced="Ensuring smooth drop animations without layout reflow glitches.",
        next_week_goals="Integrate analytics charts and weekly summary export functionality.",
        evidence_links="https://github.com/aarav-dev/internship-work/pull/24",
        submission_date=datetime.utcnow().strftime("%Y-%m-%d"),
        mentor_id=mentor_profile.id,
        status="Submitted"
    )
    db.add(report_w3)

    # 9. Readiness History for Student A (for trend charts)
    now = datetime.utcnow()
    history_points = [
        (now - timedelta(days=28), 58.0, 18.0, 12.0, 10.0, 12.0, 6.0),
        (now - timedelta(days=21), 64.0, 22.0, 14.0, 11.0, 11.0, 6.0),
        (now - timedelta(days=14), 72.0, 25.0, 18.0, 12.0, 11.0, 6.0),
        (now - timedelta(days=7), 78.0, 28.0, 20.0, 12.6, 11.4, 6.0),
        (now, 83.0, 30.5, 22.5, 12.6, 11.4, 6.0)
    ]
    for recorded_at, total, s_s, p_s, r_s, l_s, a_s in history_points:
        db.add(models.ReadinessHistory(
            student_id=student_a_profile.id,
            score=total,
            skill_score=s_s,
            project_score=p_s,
            resume_score=r_s,
            learning_score=l_s,
            application_score=a_s,
            recorded_at=recorded_at
        ))

    # 10. Notifications for Student A
    notifications_a = [
        models.Notification(
            user_id=student_a_user.id,
            title="Interview Scheduled!",
            message="Your technical interview for Backend Python Developer Intern at ScaleData Systems is set for Nov 24.",
            type="deadline",
            is_read=False,
            link="/applications"
        ),
        models.Notification(
            user_id=student_a_user.id,
            title="Mentor Feedback Received",
            message="Dr. Rajesh Kumar reviewed your Week 2 Progress Report with an overall score of 4.8 / 5.0.",
            type="feedback",
            is_read=False,
            link="/mentor-feedback"
        ),
        models.Notification(
            user_id=student_a_user.id,
            title="Roadmap Milestone Pending",
            message="Week 3 Task 'Docker Containerization' is scheduled for completion this week.",
            type="roadmap",
            is_read=True,
            link="/roadmap"
        ),
        models.Notification(
            user_id=student_a_user.id,
            title="New High-Match Internship",
            message="A new 92% match opportunity 'Full Stack Web Developer Intern' at PixelCraft Studios is available.",
            type="match",
            is_read=False,
            link="/internships"
        )
    ]
    db.add_all(notifications_a)

    # Notifications for Mentor
    notifications_mentor = [
        models.Notification(
            user_id=mentor_user.id,
            title="Weekly Report Submitted",
            message="Aarav Sharma submitted Week 3 Progress Report for review and feedback.",
            type="report",
            is_read=False,
            link="/mentor/reports"
        ),
        models.Notification(
            user_id=mentor_user.id,
            title="New Student Assigned",
            message="Priya Patel has been assigned to your mentorship cohort for Data Analytics.",
            type="info",
            is_read=True,
            link="/mentor/students"
        )
    ]
    db.add_all(notifications_mentor)

    db.commit()
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    db = SessionLocal()
    seed_database(db)
    db.close()
