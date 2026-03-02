from flask import Blueprint, jsonify, request
from models import db, Student, Prediction, CounselingNote, AssignmentStudent, Assignment, Submission
from models import Notification, CounselingReply
import os

student_routes = Blueprint("student_routes", __name__)

# =========================================
# STUDENT DASHBOARD
# =========================================
@student_routes.route("/student/dashboard/<int:user_id>", methods=["GET"])
def student_dashboard(user_id):

    student = Student.query.filter_by(user_id=user_id).first()

    if not student:
        return jsonify({"error": "Student not found"}), 404

    prediction = Prediction.query.filter_by(
        roll_number=student.roll_no
    ).first()

    # 🔹 Get counseling notes
    notes = CounselingNote.query.filter_by(
        student_id=student.id
    ).order_by(CounselingNote.created_at.desc()).all()

    notes_data = []

    for n in notes:

        # 🔥 GET REPLIES FOR EACH NOTE
        replies = CounselingReply.query.filter_by(
            note_id=n.id
        ).order_by(CounselingReply.created_at.asc()).all()

        notes_data.append({
            "id": n.id,
            "note": n.content,
            "note_type": n.note_type,
            "created_at": n.created_at,
            "replies": [
                {
                    "id": r.id,
                    "sender_role": r.sender_role,
                    "message": r.message,
                    "file_url": r.file_url,
                    "created_at": r.created_at
                }
                for r in replies
            ]
        })

    # 🔹 Get assignments
    assignment_links = AssignmentStudent.query.filter_by(
        student_id=student.id
    ).all()

    assignments_data = []

    for link in assignment_links:
        assignment = Assignment.query.get(link.assignment_id)

        if assignment:

            submission = Submission.query.filter_by(
                assignment_id=assignment.id,
                student_id=student.id
            ).first()

            assignments_data.append({
                "id": assignment.id,
                "title": assignment.title,
                "description": assignment.description,
                "deadline": assignment.deadline,
                "file_url": assignment.file_url,
                "status": submission.status if submission else "not_submitted"
            })

    return jsonify({
        "profile": {
            "id": student.id,
            "name": student.full_name,
            "branch": student.branch,
            "semester": student.semester,
            "roll_no": student.roll_no
        },
        "prediction": {
            "cgpa": prediction.cgpa if prediction else None,
            "attendance": prediction.attendance if prediction else None,
            "backlogs": prediction.backlogs if prediction else None,
            "risk_level": prediction.risk_level if prediction else None
        },
        "notes": notes_data,
        "assignments": assignments_data
    })


# =========================================
# STUDENT REPLY TO COUNSELING NOTE
# =========================================
@student_routes.route("/student/notes/reply", methods=["POST"])
def reply_to_note():

    note_id = request.form.get("note_id")
    student_id = request.form.get("student_id")
    message = request.form.get("message")

    file = request.files.get("file")
    file_path = None

    if file:
        import os
        from werkzeug.utils import secure_filename

        import os
        upload_folder = os.getenv("UPLOAD_FOLDER", "uploads")
        os.makedirs(upload_folder, exist_ok=True)

        filename = secure_filename(file.filename)
        full_path = os.path.join(upload_folder, filename)
        file.save(full_path)

        file_path = f"/uploads/{filename}"

    reply = CounselingReply(
        note_id=note_id,
        sender_role="student",
        message=message,
        file_url=file_path
    )

    db.session.add(reply)

    # 🔔 Notify counselor
    note = CounselingNote.query.get(note_id)

    notification = Notification(
        counselor_id=note.counselor_id,
        student_id=student_id,
        type="counseling_reply",
        message="Student replied to your counseling note."
    )

    db.session.add(notification)
    db.session.commit()

    return jsonify({"success": True})


# =========================================
# UPDATE STUDENT PROFILE
# =========================================
@student_routes.route("/student/profile/update/<int:user_id>", methods=["POST"])
def update_student_profile(user_id):

    student = Student.query.filter_by(user_id=user_id).first()

    if not student:
        return jsonify({"error": "Student not found"}), 404

    data = request.json

    student.semester = data.get("semester", student.semester)

    db.session.commit()

    return jsonify({"success": True})


# =========================================
# GET NOTIFICATION COUNT
# =========================================
@student_routes.route("/student/notifications/<int:user_id>")
def get_student_notifications(user_id):

    student = Student.query.filter_by(user_id=user_id).first()

    if not student:
        return jsonify({"error": "Student not found"}), 404

    count = Notification.query.filter_by(
        student_id=student.id,
        is_read=False
    ).count()

    return jsonify({"count": count})


# =========================================
# GET NOTIFICATION LIST
# =========================================
@student_routes.route("/student/notifications/list/<int:user_id>")
def get_notification_list(user_id):

    student = Student.query.filter_by(user_id=user_id).first()

    if not student:
        return jsonify({"error": "Student not found"}), 404

    notifications = Notification.query.filter_by(
        student_id=student.id
    ).order_by(Notification.created_at.desc()).all()

    return jsonify([
        {
            "id": n.id,
            "type": n.type,
            "message": n.message,
            "is_read": n.is_read,
            "created_at": n.created_at
        }
        for n in notifications
    ])


# =========================================
# MARK NOTIFICATION AS READ
# =========================================
@student_routes.route("/student/notifications/read/<int:notification_id>", methods=["POST"])
def mark_notification_read(notification_id):

    notification = Notification.query.get(notification_id)

    if not notification:
        return jsonify({"error": "Not found"}), 404

    notification.is_read = True
    db.session.commit()

    return jsonify({"success": True})