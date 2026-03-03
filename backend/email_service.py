import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MAIL_SERVER = os.getenv("MAIL_SERVER")
MAIL_PORT = int(os.getenv("MAIL_PORT"))
MAIL_USERNAME = os.getenv("MAIL_USERNAME")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")


def send_invite_email(to_email, onboarding_link, role):
    """
    Sends onboarding email based on role (counselor / student)
    """

    # ===============================
    # Dynamic Subject & Body
    # ===============================
    if role == "counselor":
        subject = "EduPredict Counselor Onboarding"
        body = f"""
Welcome to EduPredict!

You have been invited as a Counselor.

Click the link below to activate your account:

{onboarding_link}

This link is valid for one-time use only.

Regards,
EduPredict Team
"""
    elif role == "student":
        subject = "EduPredict Student Onboarding"
        body = f"""
Welcome to EduPredict!

You have been invited as a Student.

Click the link below to activate your account:

{onboarding_link}

This link is valid for one-time use only.

Regards,
EduPredict Team
"""
    else:
        subject = "EduPredict Invitation"
        body = f"""
Welcome to EduPredict!

Click the link below to activate your account:

{onboarding_link}

Regards,
EduPredict Team
"""

    # ===============================
    # Create Email
    # ===============================
    msg = MIMEMultipart()
    msg["From"] = MAIL_USERNAME
    msg["To"] = to_email
    msg["Subject"] = subject

    msg.attach(MIMEText(body, "plain"))

    try:
        # ===============================
        # Connect to SMTP Server
        # ===============================
        server = smtplib.SMTP(MAIL_SERVER, MAIL_PORT)
        server.starttls()
        server.login(MAIL_USERNAME, MAIL_PASSWORD)
        server.sendmail(MAIL_USERNAME, to_email, msg.as_string())
        server.quit()

        return True

    except Exception as e:
        print("Email error:", e)
        return False