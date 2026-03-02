import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const GOOGLE_CLIENT_ID =
  "186185088047-7u42cksaogehbmvfuricjt4t19d7tg48.apps.googleusercontent.com";

const CounselorOnboard = () => {
  const { token } = useParams();
  const googleBtnRef = useRef(null);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [credential, setCredential] = useState("");

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    branch: "",
    employee_id: ""
  });

  // =============================
  // Verify invite
  // =============================
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/onboard/counselor/${token}`)
      .then(res => setEmail(res.data.email))
      .catch(() => setError("Invalid or expired onboarding link"))
      .finally(() => setLoading(false));
  }, [token]);

  // =============================
  // Load Google Button (Fixed)
  // =============================
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (!window.google || !googleBtnRef.current) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (res) => {
          setCredential(res.credential);
          alert("Google authenticated successfully ✅");
        }
      });

      window.google.accounts.id.renderButton(
        googleBtnRef.current,
        { theme: "outline", size: "large", width: 320 }
      );
    };

    document.body.appendChild(script);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // =============================
  // Submit onboarding
  // =============================
  const submitForm = async () => {
    if (!form.full_name || !form.phone || !form.branch) {
      alert("Please fill all mandatory fields");
      return;
    }

    if (!credential) {
      alert("Please sign in with Google using the invited email");
      return;
    }

    try {
      await axios.post(
        "http://127.0.0.1:5000/onboard/counselor/complete",
        {
          token,
          credential,
          ...form
        }
      );

      alert("Onboarding completed successfully 🎉");
      window.location.href = "/login";
    } catch (err) {
      alert(err.response?.data?.error || "Onboarding failed. Try again.");
    }
  };

  if (loading) return <div style={styles.center}>Verifying invitation...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Counselor Onboarding</h1>
        <p style={styles.subtitle}>Welcome to EduPredict AI Platform</p>

        <div style={styles.emailBox}>{email}</div>

        {/* Mandatory Fields */}
        <input
          name="full_name"
          placeholder="FULL NAME *"
          value={form.full_name}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          name="phone"
          placeholder="PHONE *"
          value={form.phone}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          name="branch"
          placeholder="BRANCH *"
          value={form.branch}
          onChange={handleChange}
          style={styles.input}
          required
        />

        {/* Optional Field */}
        <input
          name="employee_id"
          placeholder="EMPLOYEE ID (Optional)"
          value={form.employee_id}
          onChange={handleChange}
          style={styles.input}
        />

        <div ref={googleBtnRef} style={{ marginBottom: "12px" }}></div>

        <button style={styles.button} onClick={submitForm}>
          Complete Onboarding
        </button>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "radial-gradient(circle at top, #1e293b, #020617)",
    fontFamily: "Segoe UI, sans-serif"
  },
  card: {
    width: "380px",
    padding: "40px",
    borderRadius: "18px",
    background: "rgba(15,23,42,0.85)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
    backdropFilter: "blur(20px)",
    color: "#e5e7eb",
    border: "1px solid rgba(148,163,184,0.2)"
  },
  title: {
    fontSize: "28px",
    fontWeight: "800",
    marginBottom: "6px",
    textAlign: "center"
  },
  subtitle: {
    textAlign: "center",
    color: "#94a3b8",
    marginBottom: "25px"
  },
  emailBox: {
    background: "rgba(59,130,246,0.15)",
    padding: "10px",
    borderRadius: "10px",
    textAlign: "center",
    fontWeight: "600",
    color: "#60a5fa",
    marginBottom: "20px"
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid rgba(148,163,184,0.3)",
    background: "rgba(2,6,23,0.7)",
    color: "#fff",
    marginBottom: "14px",
    outline: "none",
    fontSize: "14px"
  },
  button: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg,#3b82f6,#2563eb)",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "10px",
    fontSize: "15px"
  },
  center: { color: "#fff", fontSize: "18px" },
  error: { color: "#ef4444", fontSize: "18px", textAlign: "center" }
};

export default CounselorOnboard;