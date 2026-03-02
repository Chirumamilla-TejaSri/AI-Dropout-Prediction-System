from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    role = db.Column(db.String(20), nullable=False)
    oauth_id = db.Column(db.String(200), nullable=False)
    branch = db.Column(db.String(50))  # ← ADD THIS
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class CounselorInvite(db.Model):
    __tablename__ = "counselor_invites"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    token = db.Column(db.String(200), unique=True, nullable=False)
    used = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class CounselorProfile(db.Model):
    __tablename__ = "counselor_profiles"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), unique=True)

    full_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    branch = db.Column(db.String(50), nullable=False)
    employee_id = db.Column(db.String(50))

    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Student(db.Model):
    __tablename__ = "students"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), unique=True)
    full_name = db.Column(db.String(100), nullable=False)
    roll_no = db.Column(db.String(50), unique=True, nullable=False)
    branch = db.Column(db.String(50), nullable=False)
    semester = db.Column(db.String(20), nullable=False)
    counselor_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    status = db.Column(db.String(20), default="pending")
    created_at = db.Column(db.DateTime)
    
class StudentInvite(db.Model):
    __tablename__ = "student_invites"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    token = db.Column(db.String(200), unique=True, nullable=False)
    used = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
from datetime import datetime

class Prediction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    roll_number = db.Column(db.String(100))
    cgpa = db.Column(db.Float)
    attendance = db.Column(db.Float)
    backlogs = db.Column(db.Integer)
    risk_level = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
# =========================================
# ASSIGNMENT MODEL
# =========================================
class Assignment(db.Model):
    __tablename__ = "assignments"

    id = db.Column(db.Integer, primary_key=True)
    counselor_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    deadline = db.Column(db.String(50))
    file_url = db.Column(db.String(300))  # 👈 ADD THIS
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
class AssignmentStudent(db.Model):
    __tablename__ = "assignment_students"

    id = db.Column(db.Integer, primary_key=True)
    assignment_id = db.Column(db.Integer, db.ForeignKey("assignments.id"))
    student_id = db.Column(db.Integer, db.ForeignKey("students.id"))

# =========================================
# ASSIGNMENT SUBMISSION MODEL
# =========================================
class Submission(db.Model):
    __tablename__ = "submissions"

    id = db.Column(db.Integer, primary_key=True)
    assignment_id = db.Column(db.Integer, db.ForeignKey("assignments.id"))
    student_id = db.Column(db.Integer, db.ForeignKey("students.id"))
    file_url = db.Column(db.String(300))
    status = db.Column(db.String(50), default="submitted")
    feedback = db.Column(db.Text)
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
# =========================================
# COUNSELING NOTES MODEL
# =========================================
class CounselingNote(db.Model):
    __tablename__ = "counseling_notes"

    id = db.Column(db.Integer, primary_key=True)
    counselor_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    student_id = db.Column(db.Integer, db.ForeignKey("students.id"))
    note_type = db.Column(db.String(50))  # academic / behavioral / career
    content = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
# =========================================
# NOTIFICATION MODEL
# =========================================
class Notification(db.Model):
    __tablename__ = "notifications"

    id = db.Column(db.Integer, primary_key=True)

    student_id = db.Column(db.Integer, db.ForeignKey("students.id"))
    counselor_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    type = db.Column(db.String(50))  # assignment / counseling / submission

    message = db.Column(db.Text)

    is_read = db.Column(db.Boolean, default=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
# =========================================
# COUNSELING REPLIES MODEL (NEW - SAFE)
# =========================================
class CounselingReply(db.Model):
    __tablename__ = "counseling_replies"

    id = db.Column(db.Integer, primary_key=True)
    note_id = db.Column(db.Integer, db.ForeignKey("counseling_notes.id"))
    sender_role = db.Column(db.String(20))  # student / counselor
    message = db.Column(db.Text)
    file_url = db.Column(db.String(300))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)