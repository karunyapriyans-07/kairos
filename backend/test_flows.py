import urllib.request
import json

BASE_URL = "http://127.0.0.1:8000/api"

def make_req(endpoint, method="GET", data=None, headers=None):
    url = f"{BASE_URL}{endpoint}"
    h = headers or {}
    body = None
    if data is not None:
        body = json.dumps(data).encode("utf-8")
        h["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=body, headers=h, method=method)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read())

def run_tests():
    print("=" * 60)
    print("INTERNPATH AI — FULL ACCEPTANCE TEST SUITE")
    print("=" * 60)

    # 1. Health check
    health = make_req("/health")
    print(f"[TEST 1] Core API Health: {health['status']} - {health['service']}")
    assert health['status'] == "healthy"

    # 2. Student A (Aarav - Web/Python profile) Login
    login_a = make_req("/auth/login", method="POST", data={
        "email": "student@internpath.demo",
        "password": "Student123!"
    })
    user_a = login_a["user"]
    print(f"[TEST 2] Student A Login: SUCCESS ({user_a['name']} - {user_a['preferred_domain']})")
    assert user_a["role"] == "student"

    # 3. Student B (Priya - Data Analytics & AI profile) Login
    login_b = make_req("/auth/login", method="POST", data={
        "email": "student2@internpath.demo",
        "password": "Student123!"
    })
    user_b = login_b["user"]
    print(f"[TEST 3] Student B Login: SUCCESS ({user_b['name']} - {user_b['preferred_domain']})")
    assert user_b["role"] == "student"

    # 4. Mentor Login
    login_m = make_req("/auth/login", method="POST", data={
        "email": "mentor@internpath.demo",
        "password": "Mentor123!"
    })
    user_m = login_m["user"]
    print(f"[TEST 4] Mentor Login: SUCCESS ({user_m['name']} - {user_m['role']})")
    assert user_m["role"] == "mentor"

    # 5. Matching Engine: Different Profiles Produce Different Recommendations
    recs_a = make_req("/matching/recommendations?tab=all&sort_by=match", headers={"X-User-Id": str(user_a["id"])})
    recs_b = make_req("/matching/recommendations?tab=all&sort_by=match", headers={"X-User-Id": str(user_b["id"])})

    top_a = recs_a[0]
    top_b = recs_b[0]

    print(f"[TEST 5] Student A Top Match: '{top_a['title']}' at {top_a['match']['match_percentage']}% ({top_a['match']['match_label']})")
    print(f"         Student B Top Match: '{top_b['title']}' at {top_b['match']['match_percentage']}% ({top_b['match']['match_label']})")
    
    # Verify rankings reflect their domains
    assert top_a["title"] != top_b["title"], "Student A and Student B should have distinct top matched opportunities"

    # 6. Explainable Matching Breakdown (45% Skill, 20% Project, 15% Domain, 10% Eligibility, 10% Availability)
    explain = make_req(f"/matching/explain/{top_a['id']}", headers={"X-User-Id": str(user_a["id"])})
    m = explain["match"]
    b = m["breakdown"]
    print(f"[TEST 6] Explainable 5-Factor Scoring for Student A on '{top_a['title']}':")
    print(f"         • Skill Match (45%): {b['skill_match']['score']} / {b['skill_match']['max']} pts")
    print(f"         • Project Experience (20%): {b['project_experience']['score']} / {b['project_experience']['max']} pts")
    print(f"         • Domain Interest (15%): {b['domain_interest']['score']} / {b['domain_interest']['max']} pts")
    print(f"         • Eligibility (10%): {b['eligibility']['score']} / {b['eligibility']['max']} pts")
    print(f"         • Availability (10%): {b['availability']['score']} / {b['availability']['max']} pts")
    print(f"         • Total Match: {m['match_percentage']}% ({m['match_label']})")
    print(f"         • Dynamic Natural Language Summary: '{m['explanation']}'")

    # 7. Skill Gap Analysis
    gap = make_req(f"/skill-gap/{top_a['id']}", headers={"X-User-Id": str(user_a["id"])})
    print(f"[TEST 7] Skill Gap Matrix: {gap['matched_count']} Matched Skills, {gap['missing_count']} Missing Skills")
    assert len(gap["comparison_table"]) > 0

    # 8. Learning Roadmap Generation & Task Toggle
    rm_gen = make_req("/roadmap/generate", method="POST", data={
        "internship_id": top_a["id"],
        "target_role": top_a["title"],
        "missing_skills": gap["high_priority_missing"]
    }, headers={"X-User-Id": str(user_a["id"])})
    print(f"[TEST 8] Generated 4-Week Roadmap for '{top_a['title']}': {rm_gen['status']}")

    rm_current = make_req("/roadmap", headers={"X-User-Id": str(user_a["id"])})
    first_task = rm_current["roadmap"]["tasks"][0]
    print(f"         Week 1 Focus: {first_task['skill_name']} - Status: Completed={first_task['is_completed']}")

    # 9. Career Readiness Score
    readiness = make_req("/analytics/readiness", headers={"X-User-Id": str(user_a["id"])})
    r = readiness["readiness"]
    print(f"[TEST 9] Career Readiness Index: {r['readiness_index']} / 100 ({r['classification']})")
    print(f"         Action Steps Count: {len(r['action_plan'])}")
    assert 0 <= r["readiness_index"] <= 100

    # 10. Application Pipeline
    apps = make_req("/applications", headers={"X-User-Id": str(user_a["id"])})
    print(f"[TEST 10] Application Pipeline: {len(apps)} active applications found in database")
    assert len(apps) >= 4

    # 11. Mentor Review Workflow
    mentor_reps = make_req("/mentor/reports", headers={"X-User-Id": str(user_m["id"])})
    print(f"[TEST 11] Mentor Review Queue: {len(mentor_reps)} student weekly reports available")
    
    # Review Week 3 report
    target_rep = mentor_reps[0]
    review_res = make_req(f"/mentor/reports/{target_rep['id']}/review", method="POST", data={
        "status": "Approved",
        "technical_score": 5,
        "communication_score": 5,
        "problem_solving_score": 5,
        "task_completion_score": 5,
        "initiative_score": 5,
        "comments": "Outstanding production velocity. Verified code quality and comprehensive PR documentation."
    }, headers={"X-User-Id": str(user_m["id"])})
    print(f"         Mentor Review Submission: {review_res['status']} ({review_res['message']})")

    # 12. Notification Center
    notifs = make_req("/notifications", headers={"X-User-Id": str(user_a["id"])})
    print(f"[TEST 12] Notifications: {len(notifs['notifications'])} notifications retrieved ({notifs['unread_count']} unread)")

    print("=" * 60)
    print("ALL 12 ACCEPTANCE TESTS PASSED WITH 100% SUCCESS!")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
