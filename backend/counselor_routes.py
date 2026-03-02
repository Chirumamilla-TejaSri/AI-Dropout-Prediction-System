from flask import Blueprint, jsonify, request
from models import db, Student, Prediction, CounselingNote, Assignment, Submission
from models import Notification, CounselorProfile
from werkzeug.utils import secure_filename
from models import CounselingReply
import os

counselor_routes = Blueprint("counselor_routes", __name__)

# =========================================
# GET STUDENTS FOR LOGGED IN COUNSELOR
# =========================================
@counselor_routes.route("/counselor/students/<int:counselor_id>")
def get_students(counselor_id):
    students = Student.query.filter_by(counselor_id=counselor_id).all()

    return jsonify([
        {
            "id": s.id,
            "name": s.full_name,
            "roll_no": s.roll_no,
            "status": s.status
        }
        for s in students
    ])


# =========================================
# APPROVE STUDENT (SECURED)
# =========================================
@counselor_routes.route("/counselor/approve/<int:counselor_id>/<int:student_id>", methods=["POST"])
def approve_student(counselor_id, student_id):

    student = Student.query.get(student_id)

    if not student:
        return jsonify({"error": "Student not found"}), 404

    if student.counselor_id != counselor_id:
        return jsonify({"error": "Unauthorized"}), 403

    student.status = "approved"
    db.session.commit()

    return jsonify({"success": True})


# =========================================
# REJECT STUDENT (SECURED)
# =========================================
@counselor_routes.route("/counselor/reject/<int:counselor_id>/<int:student_id>", methods=["POST"])
def reject_student(counselor_id, student_id):

    student = Student.query.get(student_id)

    if not student:
        return jsonify({"error": "Student not found"}), 404

    if student.counselor_id != counselor_id:
        return jsonify({"error": "Unauthorized"}), 403

    student.status = "rejected"
    db.session.commit()

    return jsonify({"success": True})


# =========================================
# GET PREDICTIONS FOR COUNSELOR STUDENTS
# =========================================
@counselor_routes.route("/counselor/predictions/<int:counselor_id>")
def get_predictions(counselor_id):

    students = Student.query.filter_by(counselor_id=counselor_id).all()
    roll_numbers = [s.roll_no for s in students]

    if not roll_numbers:
        return jsonify([])

    predictions = Prediction.query.filter(
        Prediction.roll_number.in_(roll_numbers)
    ).all()

    result = []

    for p in predictions:
        result.append({
            "roll_number": p.roll_number,
            "cgpa": p.cgpa,
            "attendance": p.attendance,
            "backlogs": p.backlogs,
            "risk_level": p.risk_level
        })

    return jsonify(result)


# =========================================
# DASHBOARD SUMMARY (FIXED LOGIC)
# =========================================
@counselor_routes.route("/counselor/dashboard/<int:counselor_id>")
def counselor_dashboard(counselor_id):

    # Get all students assigned to counselor
    all_students = Student.query.filter_by(
        counselor_id=counselor_id
    ).all()

    # Only approved students count toward risk
    approved_students = [s for s in all_students if s.status == "approved"]

    total_students = len(approved_students)
    approved = len(approved_students)
    pending = len([s for s in all_students if s.status == "pending"])

    roll_numbers = [s.roll_no for s in approved_students]

    if not roll_numbers:
        return jsonify({
            "total": total_students,
            "approved": approved,
            "pending": pending,
            "high": 0,
            "medium": 0,
            "low": 0
        })

    predictions = Prediction.query.filter(
        Prediction.roll_number.in_(roll_numbers)
    ).all()

    high = len([p for p in predictions if "High" in p.risk_level])
    medium = len([p for p in predictions if "Medium" in p.risk_level])
    low = len([p for p in predictions if "Low" in p.risk_level])

    return jsonify({
        "total": total_students,
        "approved": approved,
        "pending": pending,
        "high": high,
        "medium": medium,
        "low": low
    })


# =========================================
# GET STUDENTS WITH RISK
# =========================================
@counselor_routes.route("/counselor/students-with-risk/<int:counselor_id>")
def get_students_with_risk(counselor_id):

    students = Student.query.filter_by(
        counselor_id=counselor_id
    ).all()

    result = []

    for s in students:

        prediction = Prediction.query.filter_by(
            roll_number=s.roll_no
        ).first()

        result.append({
            "id": s.id,
            "name": s.full_name,
            "roll_no": s.roll_no,
            "semester": s.semester,
            "status": s.status,
            "risk_level": prediction.risk_level if prediction else "N/A",
            "cgpa": prediction.cgpa if prediction else None,
            "attendance": prediction.attendance if prediction else None,
            "backlogs": prediction.backlogs if prediction else None
        })

    return jsonify(result)


# =========================================
# CREATE ASSIGNMENT
# =========================================
from models import AssignmentStudent
import os

@counselor_routes.route("/counselor/assignments/create", methods=["POST"])
def create_assignment():

    title = request.form.get("title")
    description = request.form.get("description")
    deadline = request.form.get("deadline")
    counselor_id = request.form.get("counselor_id")
    student_ids = request.form.getlist("student_ids")

    file = request.files.get("file")

    file_path = None
    if file:
        import os
        upload_folder = os.getenv("UPLOAD_FOLDER", "uploads")
        os.makedirs(upload_folder, exist_ok=True)

        filename = secure_filename(file.filename)
        file_path = os.path.join(upload_folder, filename)

        file.save(file_path)

        # IMPORTANT: store only relative public path
        file_path = f"/uploads/{filename}"

    assignment = Assignment(
        counselor_id=counselor_id,
        title=title,
        description=description,
        deadline=deadline,
        file_url=file_path
    )

    db.session.add(assignment)
    db.session.flush()

    # 👇 GET COUNSELOR NAME
    profile = CounselorProfile.query.filter_by(user_id=counselor_id).first()
    counselor_name = profile.full_name if profile else "Your Counselor"

    # Map selected students + ADD NOTIFICATION
    for student_id in student_ids:

        mapping = AssignmentStudent(
            assignment_id=assignment.id,
            student_id=student_id
        )
        db.session.add(mapping)

        # 🔔 Notification added
        notification = Notification(
            student_id=student_id,
            counselor_id=counselor_id,
            type="assignment",
            message=f"{counselor_name} assigned '{title}'."
        )
        db.session.add(notification)

    db.session.commit()

    return jsonify({"success": True})


# =========================================
# GET ASSIGNMENTS FOR COUNSELOR
# =========================================
@counselor_routes.route("/counselor/assignments/<int:counselor_id>")
def get_assignments(counselor_id):

    assignments = Assignment.query.filter_by(
        counselor_id=counselor_id
    ).all()

    return jsonify([
    {
        "id": a.id,
        "title": a.title,
        "description": a.description,
        "deadline": a.deadline,
        "file_url": a.file_url,   
        "created_at": a.created_at.strftime("%Y-%m-%d") if a.created_at else None
    }
    for a in assignments
])

# =========================================
# DELETE ASSIGNMENT
# =========================================
@counselor_routes.route("/counselor/assignments/delete/<int:assignment_id>", methods=["DELETE"])
def delete_assignment(assignment_id):

    assignment = Assignment.query.get(assignment_id)

    if not assignment:
        return jsonify({"error": "Assignment not found"}), 404

    # delete related submissions
    Submission.query.filter_by(assignment_id=assignment_id).delete()

    # delete mapping
    AssignmentStudent.query.filter_by(assignment_id=assignment_id).delete()

    db.session.delete(assignment)
    db.session.commit()

    return jsonify({"success": True})
# =========================================
# GET SUBMISSIONS FOR AN ASSIGNMENT
# =========================================
@counselor_routes.route("/counselor/assignments/<int:assignment_id>/submissions")
def get_submissions(assignment_id):

    submissions = Submission.query.filter_by(
        assignment_id=assignment_id
    ).all()

    return jsonify([
        {
            "id": s.id,
            "student_id": s.student_id,
            "file_url": s.file_url,
            "status": s.status,
            "feedback": s.feedback,
            "submitted_at": s.submitted_at.strftime("%Y-%m-%d")
        }
        for s in submissions
    ])


# =========================================
# STUDENT SUBMIT ASSIGNMENT
# =========================================
@counselor_routes.route("/assignments/submit", methods=["POST"])
def submit_assignment():
    data = request.json

    existing = Submission.query.filter_by(
        assignment_id=data["assignment_id"],
        student_id=data["student_id"]
    ).first()

    if existing:
        existing.file_url = data["file_url"]
        existing.status = "resubmitted"
        existing.feedback = None
        db.session.commit()
        return jsonify({"message": "Resubmitted successfully"})

    submission = Submission(
        assignment_id=data["assignment_id"],
        student_id=data["student_id"],
        file_url=data["file_url"],
        status="submitted"
    )

    db.session.add(submission)
    db.session.commit()

    return jsonify({"message": "Submitted successfully"})


# =========================================
# REVIEW SUBMISSION
# =========================================
@counselor_routes.route("/counselor/submissions/review/<int:submission_id>", methods=["POST"])
def review_submission(submission_id):
    data = request.json

    submission = Submission.query.get(submission_id)

    if not submission:
        return jsonify({"error": "Submission not found"}), 404

    submission.status = data["status"]
    submission.feedback = data.get("feedback")

    # 👇 Get counselor name
    profile = CounselorProfile.query.filter_by(
        user_id=submission.assignment.counselor_id
    ).first()

    counselor_name = profile.full_name if profile else "Your Counselor"

    # 🔔 Add notification
    notification = Notification(
        student_id=submission.student_id,
        counselor_id=submission.assignment.counselor_id,
        type="submission",
        message=f"{counselor_name} reviewed your submission."
    )

    db.session.add(notification)
    db.session.commit()

    return jsonify({"success": True})


# =========================================
# ADD COUNSELING NOTE
# =========================================
@counselor_routes.route("/counselor/notes/add", methods=["POST"])
def add_note():
    data = request.json

    note = CounselingNote(
        counselor_id=data["counselor_id"],
        student_id=data["student_id"],
        note_type=data.get("note_type"),
        content=data["content"]
    )

    db.session.add(note)
    db.session.flush()

    # 👇 Get counselor name
    profile = CounselorProfile.query.filter_by(
        user_id=data["counselor_id"]
    ).first()

    counselor_name = profile.full_name if profile else "Your Counselor"

    # 🔔 Add notification
    notification = Notification(
        student_id=data["student_id"],
        counselor_id=data["counselor_id"],
        type="counseling",
        message=f"{counselor_name} added a {data.get('note_type')} counseling note."
    )

    db.session.add(notification)
    db.session.commit()

    return jsonify({"success": True})


# =========================================
# GET NOTES FOR COUNSELOR
# =========================================
@counselor_routes.route("/counselor/notes/<int:counselor_id>")
def get_notes(counselor_id):

    notes = CounselingNote.query.filter_by(
        counselor_id=counselor_id
    ).order_by(CounselingNote.created_at.desc()).all()

    result = []

    for n in notes:

        replies = CounselingReply.query.filter_by(
            note_id=n.id
        ).order_by(CounselingReply.created_at.asc()).all()

        result.append({
            "id": n.id,
            "student_id": n.student_id,
            "note_type": n.note_type,
            "content": n.content,
            "date": n.created_at.strftime("%Y-%m-%d"),
            "replies": [
                {
                    "sender_role": r.sender_role,
                    "message": r.message,
                    "file_url": r.file_url,
                    "created_at": r.created_at.strftime("%Y-%m-%d")
                }
                for r in replies
            ]
        })

    return jsonify(result)
# =========================================
# COUNSELOR NOTIFICATIONS COUNT
# =========================================
@counselor_routes.route("/counselor/notifications/<int:counselor_id>")
def counselor_notifications(counselor_id):

    pending_students = Student.query.filter_by(
        counselor_id=counselor_id,
        status="pending"
    ).count()

    submissions = Submission.query.join(Assignment).filter(
        Assignment.counselor_id == counselor_id,
        Submission.status.in_(["submitted", "resubmitted"])
    ).count()

    return jsonify({
        "pending_approvals": pending_students,
        "pending_submissions": submissions
    })
# =========================================
# GENERATE RISK SUMMARY PDF
# =========================================
@counselor_routes.route("/counselor/report/pdf/<int:counselor_id>")
def generate_pdf_report(counselor_id):

    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
    from reportlab.lib.styles import getSampleStyleSheet
    from reportlab.lib import colors
    from reportlab.platypus import Table
    from reportlab.lib.pagesizes import letter
    import os

    file_path = f"report_{counselor_id}.pdf"
    doc = SimpleDocTemplate(file_path, pagesize=letter)
    elements = []
    styles = getSampleStyleSheet()

    students = Student.query.filter_by(
        counselor_id=counselor_id,
        status="approved"
    ).all()

    data = [["Name", "Roll No", "Semester", "Status"]]

    for s in students:
        data.append([
            s.full_name,
            s.roll_no,
            s.semester,
            s.status
        ])

    table = Table(data)
    elements.append(Paragraph("Student Risk Report", styles["Title"]))
    elements.append(Spacer(1, 20))
    elements.append(table)

    doc.build(elements)

    return jsonify({"file": file_path})
# =========================================
# GET NOTES FOR STUDENT
# =========================================
@counselor_routes.route("/student/notes/<int:student_id>")
def get_student_notes(student_id):

    notes = CounselingNote.query.filter_by(
        student_id=student_id
    ).order_by(CounselingNote.created_at.desc()).all()

    return jsonify([
        {
            "id": n.id,
            "note_type": n.note_type,
            "content": n.content,
            "date": n.created_at.strftime("%Y-%m-%d")
        }
        for n in notes
    ])
# =========================================
# GET FILTERED RISK REPORT
# =========================================
@counselor_routes.route("/counselor/report/<int:counselor_id>")
def get_risk_report(counselor_id):

    risk_filter = request.args.get("risk")  # High / Medium / Low

    students = Student.query.filter_by(
        counselor_id=counselor_id,
        status="approved"
    ).all()

    result = []

    for s in students:
        prediction = Prediction.query.filter_by(
            roll_number=s.roll_no
        ).first()

        if not prediction:
            continue

        if risk_filter and risk_filter != "All":
            if risk_filter not in prediction.risk_level:
                continue

        result.append({
            "name": s.full_name,
            "roll_no": s.roll_no,
            "risk_level": prediction.risk_level,
            "cgpa": prediction.cgpa,
            "attendance": prediction.attendance
        })

    return jsonify(result)
# =========================================
# UPDATE COUNSELOR PROFILE
# =========================================
@counselor_routes.route("/counselor/profile/update/<int:counselor_id>", methods=["POST"])
def update_counselor_profile(counselor_id):

    data = request.json

    profile = CounselorProfile.query.filter_by(
        user_id=counselor_id
    ).first()

    if not profile:
        return jsonify({"error": "Profile not found"}), 404

    profile.full_name = data.get("full_name", profile.full_name)
    profile.phone = data.get("phone", profile.phone)

    db.session.commit()

    return jsonify({"success": True})
# =========================================
# GET COUNSELOR PROFILE
# =========================================
@counselor_routes.route("/counselor/profile/<int:counselor_id>")
def get_counselor_profile(counselor_id):

    from models import User  # make sure User is imported

    profile = CounselorProfile.query.filter_by(
        user_id=counselor_id
    ).first()

    user = User.query.get(counselor_id)

    if not profile or not user:
        return jsonify({"error": "Profile not found"}), 404

    return jsonify({
        "full_name": profile.full_name,
        "branch": profile.branch,
        "phone": profile.phone,
        "employee_id": profile.employee_id
    })