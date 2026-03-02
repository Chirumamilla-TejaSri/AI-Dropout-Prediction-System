from flask import Flask, request, jsonify
from flask_cors import CORS
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from models import db, User, Student
from admin_routes import admin_routes
from onboarding_routes import onboarding_routes
from counselor_routes import counselor_routes
from flask_migrate import Migrate
from student_routes import student_routes
from flask import send_from_directory
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
CORS(app)

# =========================
# Database Config
# =========================

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
migrate = Migrate(app, db)

app.register_blueprint(admin_routes)
app.register_blueprint(onboarding_routes)
app.register_blueprint(counselor_routes)
app.register_blueprint(student_routes)

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")


@app.route("/")
def home():
    return "Backend running successfully"


# =========================
# GOOGLE LOGIN
# =========================
@app.route("/auth/google", methods=["POST"])
def google_auth():
    try:
        data = request.json
        credential = data.get("credential")
        selected_role = data.get("role")

        if not credential or not selected_role:
            return jsonify({
                "success": False,
                "error": "Missing credentials"
            }), 400

        token_info = id_token.verify_oauth2_token(
            credential,
            google_requests.Request(),
            GOOGLE_CLIENT_ID,
            clock_skew_in_seconds=10
        )

        email = token_info["email"]
        oauth_id = token_info["sub"]

        # 🔥 Find user in DB
        user = User.query.filter_by(email=email).first()

        if not user:
            return jsonify({
                "success": False,
                "error": "Not authorized. Contact administrator."
            }), 403

        # 🔥 Role check
        if user.role != selected_role:
            return jsonify({
                "success": False,
                "error": "Invalid role selected"
            }), 403

        # 🔥 Student approval check
        if user.role == "student":
            student = Student.query.filter_by(user_id=user.id).first()
            if not student or student.status != "approved":
                return jsonify({
                    "success": False,
                    "error": "Waiting for counselor approval"
                }), 403

        # 🔥 Update oauth id
        user.oauth_id = oauth_id
        db.session.commit()

        return jsonify({
            "success": True,
            "role": user.role,
            "user_id": user.id
        })

    except Exception as e:
        print("GOOGLE LOGIN ERROR:", e)
        return jsonify({
            "success": False,
            "error": "Invalid Google token"
        }), 401




@app.route('/uploads/<path:filename>')
def serve_upload(filename):
    return send_from_directory(
        os.path.join(os.getcwd(), "uploads"),
        filename
    )
if __name__ == "__main__":
    app.run(debug=False)