# InternPath AI — Weighted Matching & Career Readiness Mathematics

InternPath AI replaces generic opaque heuristics with transparent, fully explainable scoring algorithms implemented in Python on the backend.

---

## 1. 5-Vector Weighted Compatibility Matching Algorithm

The compatibility score between a candidate profile and an internship opportunity is defined as:

$$\text{Match Percentage} = W_{\text{skill}} + W_{\text{project}} + W_{\text{domain}} + W_{\text{eligibility}} + W_{\text{availability}}$$

Where the maximum point allocations are:

| Criteria Vector | Max Weight | Evaluation Factors |
| :--- | :---: | :--- |
| **Technical Skill Overlap** | **45%** | Required & preferred skill matches scaled by candidate proficiency (Advanced: 1.0, Intermediate: 0.85, Beginner: 0.65). |
| **Project Experience** | **20%** | Overlap between project tech stacks, repository artifacts, and required domain experience. |
| **Domain Interest** | **15%** | Candidate `preferred_domain` and `preferred_role` alignment with internship classification. |
| **Academic Eligibility** | **10%** | Degree, department, and graduation year compliance with posting prerequisites. |
| **Availability & Work Mode** | **10%** | Candidate timeline availability (Immediate/Part-time) vs internship format (Remote/Hybrid/Onsite). |
| **Total Compatibility** | **100%** | Comprehensive multi-factor ranking. |

### Classification Tiers:
- **$\ge 80\%$**: Excellent Match
- **$65\% - 79\%$**: Strong Match
- **$50\% - 64\%$**: Moderate Match
- **$< 50\%$**: Low Match

### Explainability Engine ("Why This Match?"):
Every match calculation produces an exact numerical point breakdown alongside a dynamically constructed explanation:
> *"You are a 95% match because you have React, JavaScript, CSS, HTML and relevant hands-on project experience. Your domain interest in Web Development aligns with this Web Development position. Tailwind CSS, Redux, REST API are your main missing skills."*

---

## 2. Career Readiness Index (CRI)

The Career Readiness Index provides students with an objective, transparent benchmark of their overall employability across 5 core dimensions:

$$\text{CRI} = S_{\text{skills}} + P_{\text{projects}} + R_{\text{resume}} + L_{\text{learning}} + A_{\text{applications}}$$

| Component | Max Points | Measurement Method |
| :--- | :---: | :--- |
| **Skill Readiness** | **35 pts** | Cumulative verified skills weighted by level (Advanced = 5.0, Intermediate = 3.5, Beginner = 2.0). |
| **Project Experience** | **25 pts** | Number of completed projects with tech stacks, GitHub repositories, and live demo URLs. |
| **Resume Quality** | **15 pts** | Normalized AI resume parser score evaluating structure, impact verbs, and technical taxonomy. |
| **Learning Progress** | **15 pts** | Completion percentage of assigned 4-week roadmap milestones and tasks. |
| **Application Engagement** | **10 pts** | Active submissions, interview stages, and timeline discipline. |
| **Total Index** | **100 pts** | Transparent Career Readiness Index. |

### Readiness Classification Scale:
- **90 – 100**: Highly Prepared
- **75 – 89**: Strong Candidate
- **60 – 74**: Internship Ready
- **40 – 59**: Developing
- **0 – 39**: Building Foundations
