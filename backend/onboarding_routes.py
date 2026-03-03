from flask import Blueprint, jsonify, request
from models import db, CounselorInvite, User, CounselorProfile, Student, StudentInvite
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import secrets
from email_service import send_invite_email
import os

onboarding_routes = Blueprint("onboarding_routes", __name__)

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")


# ======================================================
# VERIFY COUNSELOR INVITE
# ======================================================
@onboarding_routes.route("/onboard/counselor/<token>")
def verify_token(token):
    invite = CounselorInvite.query.filter_by(token=token, used=False).first()
    if not invite:
        return jsonify({"error": "Invalid or expired token"}), 400
    return jsonify({"email": invite.email})


# ======================================================
# COMPLETE COUNSELOR ONBOARDING
# ======================================================
@onboarding_routes.route("/onboard/counselor/complete", methods=["POST"])
def complete_onboarding():
    data = request.json

    invite = CounselorInvite.query.filter_by(token=data["token"], used=False).first()
    if not invite:
        return jsonify({"error": "Invalid or expired token"}), 400

    try:
        token_info = id_token.verify_oauth2_token(
            data["credential"],
            google_requests.Request(),
            GOOGLE_CLIENT_ID
        )
    except Exception:
        return jsonify({"error": "Invalid Google token"}), 401

    email = token_info["email"]

    if email != invite.email:
        return jsonify({"error": "Email mismatch"}), 403

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Already onboarded"}), 400

    try:
        user = User(
    email=email,
    role="counselor",
    oauth_id=token_info["sub"],
    branch=data["branch"]   # 👈 ADD THIS
)
        db.session.add(user)
        db.session.flush()

        profile = CounselorProfile(
            user_id=user.id,
            full_name=data["full_name"],
            phone=data["phone"],
            branch=data["branch"],
            employee_id=data.get("employee_id")
        )

        db.session.add(profile)

        invite.used = True
        db.session.commit()

        return jsonify({"success": True})

    except Exception:
        db.session.rollback()
        return jsonify({"error": "Database error"}), 500


# ======================================================
# GET COUNSELORS FOR STUDENT DROPDOWN
# ======================================================
@onboarding_routes.route("/counselors")
def get_counselors():
    counselors = (
        db.session.query(User, CounselorProfile)
        .join(CounselorProfile, User.id == CounselorProfile.user_id)
        .filter(User.role == "counselor")
        .all()
    )

    return jsonify([
        {
            "id": u.id,
            "name": p.full_name,
            "branch": p.branch
        }
        for u, p in counselors
    ])


# ======================================================
# SEND STUDENT INVITE (ONE TIME ONLY)
# ======================================================
@onboarding_routes.route("/student/send-invite", methods=["POST"])
def send_student_invite():
    email = request.json.get("email")

    if not email:
        return jsonify({"error": "Email required"}), 400

    # already onboarded → no invite
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Student already onboarded"}), 400

    # existing active invite → block resend
    existing = StudentInvite.query.filter_by(email=email, used=False).first()
    if existing:
        return jsonify({"error": "Invite already sent"}), 400

    token = secrets.token_urlsafe(32)

    invite = StudentInvite(email=email, token=token)
    db.session.add(invite)
    db.session.commit()

    import os
    link = f"{os.getenv('FRONTEND_URL')}/onboard/student/{token}"
    send_invite_email(email, link, "student")

    return jsonify({"success": True})


# ======================================================
# VERIFY STUDENT INVITE
# ======================================================
@onboarding_routes.route("/onboard/student/<token>")
def verify_student_token(token):
    invite = StudentInvite.query.filter_by(token=token, used=False).first()
    if not invite:
        return jsonify({"error": "Invalid or expired token"}), 400
    return jsonify({"email": invite.email})


# ======================================================
# COMPLETE STUDENT ONBOARDING
# ======================================================
@onboarding_routes.route("/onboard/student/complete", methods=["POST"])
def complete_student_onboarding():
    data = request.json

    invite = StudentInvite.query.filter_by(token=data["token"], used=False).first()
    if not invite:
        return jsonify({"error": "Invalid or expired token"}), 400

    try:
        token_info = id_token.verify_oauth2_token(
            data["credential"],
            google_requests.Request(),
            GOOGLE_CLIENT_ID
        )
    except Exception:
        return jsonify({"error": "Invalid Google token"}), 401

    email = token_info["email"]

    if email != invite.email:
        return jsonify({"error": "Email mismatch"}), 403

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Already onboarded"}), 400

    try:
        user = User(
    email=email,
    role="student",
    oauth_id=token_info["sub"],
    branch=data["branch"]   # ADD THIS
)

        db.session.add(user)
        db.session.flush()

        student = Student(
            user_id=user.id,
            full_name=data["full_name"],
            roll_no=data["roll_no"],
            branch=data["branch"],
            semester=data["semester"],
            counselor_id=data["counselor_id"],
            status="pending"
        )

        db.session.add(student)

        invite.used = True
        db.session.commit()

        return jsonify({"success": True})

    except Exception:
        db.session.rollback()
        return jsonify({"error": "Database error"}), 500
@onboarding_routes.route("/student/status/<email>")
def student_status(email):
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"exists": False})

    student = Student.query.filter_by(user_id=user.id).first()
    if not student:
        return jsonify({"exists": False})

    return jsonify({
        "exists": True,
        "status": student.status
    })