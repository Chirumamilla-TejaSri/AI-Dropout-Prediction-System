from flask import Blueprint, request, jsonify
from models import Student, User
from email_service import send_email

meeting_bp = Blueprint("meeting", __name__)

@meeting_bp.route("/schedule_meeting", methods=["POST"])
def schedule_meeting():
    data = request.json

    student_ids = data.get("student_ids")
    date = data.get("date")
    time = data.get("time")
    link = data.get("meeting_link")

    if not student_ids or not date or not time or not link:
        return jsonify({"error": "All fields required"}), 400

    try:
        for sid in student_ids:
            student = Student.query.get(sid)

            if not student:
                continue

            user = User.query.get(student.user_id)
            counselor = User.query.get(student.counselor_id)

            if not user or not counselor:
                continue

            send_email(
                to=user.email,
                subject="Counseling Session Scheduled",
                body=f"""
Hello {student.full_name},

Your counseling session is scheduled.

Date: {date}
Time: {time}

Meeting Link: {link}

For queries contact your counselor:
{counselor.email}
"""
            )

        return jsonify({"success": True})

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": "Failed to send emails"}), 500