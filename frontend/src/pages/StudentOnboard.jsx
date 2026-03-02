import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const GOOGLE_CLIENT_ID =
  "186185088047-7u42cksaogehbmvfuricjt4t19d7tg48.apps.googleusercontent.com";

export default function StudentOnboard() {
  const { token } = useParams();

  const [email, setEmail] = useState("");
  const [credential, setCredential] = useState("");
  const [counselors, setCounselors] = useState([]);

  const [form, setForm] = useState({
    full_name: "",
    roll_no: "",
    branch: "",
    semester: "",
    counselor_id: ""
  });

  // =============================
  // Load token + counselors + Google
  // =============================
  useEffect(() => {
    axios
      .get(`http://localhost:5000/onboard/student/${token}`)
      .then(res => setEmail(res.data.email))
      .catch(() => alert("Invalid or expired link"));

    axios
      .get("http://localhost:5000/counselors")
      .then(res => setCounselors(res.data));

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: res => setCredential(res.credential)
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleBtn"),
        { theme: "outline", size: "large" }
      );
    };
    document.body.appendChild(script);
  }, [token]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // =============================
  // Submit student onboarding
  // =============================
  const submitForm = async () => {
    if (!credential) {
      alert("Please sign in with Google first");
      return;
    }

    if (!form.counselor_id) {
      alert("Please select a counselor");
      return;
    }

    try {
      await axios.post("http://localhost:5000/onboard/student/complete", {
        token,
        credential,
        ...form
      });

      alert("Submitted successfully! Waiting for counselor approval.");
      window.location.href = "/login";

    } catch (err) {
      alert(err.response?.data?.error || "Submission failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Student Onboarding</h1>

        <p style={styles.email}>{email}</p>

        <input
          style={styles.input}
          name="full_name"
          placeholder="Full Name"
          onChange={handleChange}
        />

        <input
          style={styles.input}
          name="roll_no"
          placeholder="Roll Number"
          onChange={handleChange}
        />

        <input
          style={styles.input}
          name="branch"
          placeholder="Branch"
          onChange={handleChange}
        />

        <input
          style={styles.input}
          name="semester"
          placeholder="Semester"
          onChange={handleChange}
        />

        <select
          style={styles.input}
          name="counselor_id"
          onChange={handleChange}
        >
          <option value="">Select Counselor</option>
          {counselors.map(c => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.branch})
            </option>
          ))}
        </select>

        <div id="googleBtn" style={{ margin: "14px 0" }}></div>

        <button style={styles.button} onClick={submitForm}>
          Submit
        </button>
      </div>
    </div>
  );
}

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
    width: "420px",
    padding: "40px",
    borderRadius: "18px",
    background: "rgba(15,23,42,0.85)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
    backdropFilter: "blur(20px)",
    color: "#e5e7eb",
    border: "1px solid rgba(148,163,184,0.2)"
  },
  title: {
    fontSize: "26px",
    fontWeight: "800",
    marginBottom: "10px",
    textAlign: "center"
  },
  email: {
    textAlign: "center",
    color: "#60a5fa",
    marginBottom: "18px",
    fontWeight: "600"
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
  }
};