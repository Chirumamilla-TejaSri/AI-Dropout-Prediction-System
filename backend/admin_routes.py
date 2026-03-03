import secrets
import pandas as pd
from flask import Blueprint, request, jsonify
from models import db, CounselorInvite
import os
from email_service import send_invite_email

admin_routes = Blueprint("admin_routes", __name__)

# ==================================================
# Create invite safely
# ==================================================
def create_invite(email):
    existing = CounselorInvite.query.filter_by(email=email, used=False).first()
    if existing:
        return None

    token = secrets.token_urlsafe(32)

    invite = CounselorInvite(
        email=email,
        token=token,
        used=False
    )

    db.session.add(invite)

    import os
    link = f"{os.getenv('FRONTEND_URL')}/onboard/counselor/{token}"
    send_invite_email(email, link, "counselor")

    return link


# ==================================================
# Single invite
# ==================================================
@admin_routes.route("/admin/invite-counselor", methods=["POST"])
def invite_counselor():
    email = request.json.get("email")

    if not email:
        return jsonify({"error": "Email required"}), 400

    link = create_invite(email)

    if not link:
        return jsonify({"error": "Already invited"}), 400

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Invite sent"
    })


# ==================================================
# Bulk invite
# ==================================================
@admin_routes.route("/admin/bulk-invite", methods=["POST"])
def bulk_invite():
    file = request.files.get("file")

    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    if file.filename.endswith(".xlsx"):
        df = pd.read_excel(file)
    elif file.filename.endswith(".csv"):
        df = pd.read_csv(file)
    else:
        return jsonify({"error": "Upload Excel or CSV file"}), 400

    if "email" not in df.columns:
        return jsonify({"error": "File must contain 'email' column"}), 400

    invited = 0
    skipped = 0

    for email in df["email"]:
        if not email:
            continue

        link = create_invite(str(email))

        if link:
            invited += 1
        else:
            skipped += 1

    db.session.commit()

    return jsonify({
        "success": True,
        "invited": invited,
        "skipped": skipped
    })


# ==================================================
# Upload student academic data + Predict Risk
# ==================================================
@admin_routes.route("/admin/upload", methods=["POST"])
def upload_and_predict():
    import pickle
    import numpy as np
    from models import Prediction

    file = request.files.get("file")

    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    if file.filename.endswith(".xlsx"):
        df = pd.read_excel(file)
    elif file.filename.endswith(".csv"):
        df = pd.read_csv(file)
    else:
        return jsonify({"error": "Upload Excel or CSV file"}), 400

    model = pickle.load(open("risk_model.pkl", "rb"))
    encoder = pickle.load(open("label_encoder.pkl", "rb"))

    Prediction.query.delete()
    db.session.commit()

    results = []

    sgpa_cols = sorted([col for col in df.columns if "SGPA" in col])
    backlog_cols = sorted([col for col in df.columns if "Backlog" in col])

    for _, row in df.iterrows():

        # ✅ MATCH TRAINING LOGIC
        # Use all except last semester as past
        past_sgpas = row[sgpa_cols[:-1]]
        past_backlogs = row[backlog_cols[:-1]]

        # Last semester treated as "next semester"
        next_sgpa = row[sgpa_cols[-1]]
        next_backlog = row[backlog_cols[-1]]

        past_cgpa = past_sgpas.mean()
        last_sgpa = past_sgpas.iloc[-1]

        sgpa_trend = (
            past_sgpas.iloc[-1] - past_sgpas.iloc[-2]
            if len(past_sgpas) > 1 else 0
        )

        total_backlog = past_backlogs.sum()

        backlog_trend = (
            past_backlogs.iloc[-1] - past_backlogs.iloc[-2]
            if len(past_backlogs) > 1 else 0
        )

        attendance = row["Attendance"]

        features = np.array([[past_cgpa,
                              last_sgpa,
                              sgpa_trend,
                              total_backlog,
                              backlog_trend,
                              attendance]])

        prediction = model.predict(features)
        risk_label = encoder.inverse_transform(prediction)[0]

        roll_number = str(row.get("HallTicket")).upper()

        new_prediction = Prediction(
            roll_number=roll_number,
            cgpa=round(past_cgpa, 2),
            attendance=attendance,
            backlogs=int(total_backlog),
            risk_level=risk_label + " Risk"
        )

        db.session.add(new_prediction)

        results.append({
            "roll_number": roll_number,
            "cgpa": round(past_cgpa, 2),
            "attendance": attendance,
            "backlogs": int(total_backlog),
            "risk_level": risk_label + " Risk"
        })

    db.session.commit()

    return jsonify(results)


# ==================================================
# Get Counselors
# ==================================================
@admin_routes.route("/admin/counselors/<int:admin_id>", methods=["GET"])
def get_counselors(admin_id):

    from models import CounselorProfile, User

    admin = User.query.get(admin_id)

    if not admin or admin.role != "admin":
        return jsonify({"error": "Admin not found"}), 404

    counselors = CounselorProfile.query.filter_by(
        branch=admin.branch
    ).all()

    data = []

    for c in counselors:
        user = User.query.get(c.user_id)

        data.append({
            "id": c.id,
            "name": c.full_name,
            "email": user.email if user else "N/A",
            "department": c.branch,
            "phone": c.phone,
            "employee_id": c.employee_id,
            "joined": c.created_at.strftime("%Y-%m-%d") if c.created_at else "-"
        })

    return jsonify(data)


@admin_routes.route("/admin/test", methods=["GET"])
def test_route():
    return jsonify({"message": "Test route works"})