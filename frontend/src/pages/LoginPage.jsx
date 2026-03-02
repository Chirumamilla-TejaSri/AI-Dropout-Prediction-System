import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { googleAuthLogin } from "../services/api";
import { LogIn, UserCircle } from "lucide-react";

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "186185088047-7u42cksaogehbmvfuricjt4t19d7tg48.apps.googleusercontent.com";

console.log("USING CLIENT ID:", GOOGLE_CLIENT_ID);

export default function LoginPage() {
  const navigate = useNavigate();
  const buttonRef = useRef(null);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("student");

  // =============================
  // Load Google button
  // =============================
  useEffect(() => {
    let script = document.getElementById("google-identity-script");

    if (!script) {
      script = document.createElement("script");
      script.id = "google-identity-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGoogleButton;
      document.body.appendChild(script);
    } else {
      initGoogleButton();
    }
  }, [role]);

  const initGoogleButton = () => {
    if (!window.google || !buttonRef.current) return;

    buttonRef.current.innerHTML = "";

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      width: 320,
    });
  };

  // =============================
  // Google login handler
  // =============================
  const handleGoogleResponse = async (response) => {
    if (!response?.credential) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await googleAuthLogin({
        credential: response.credential,
        role,
      });

      if (!res.success) {
        setError(res.error);
        return;
      }

      localStorage.setItem("user_id", res.user_id);
      localStorage.setItem("role", res.role);

      // ✅ ONLY ADDITION STARTS HERE
      if (res.role === "admin") {
        localStorage.setItem("admin_branch", res.branch);
        navigate("/admin");
      } else if (res.role === "counselor") {
        navigate("/counselor");
      } else {
        navigate("/student");
      }
      // ✅ ONLY ADDITION ENDS HERE

    } catch {
      setError("Server error");
    } finally {
      setIsLoading(false);
    }
  };

  const goStudentOnboard = () => {
    navigate("/student-onboard");
  };

  const roles = [
    { value: "student", label: "Student" },
    { value: "counselor", label: "Mentor" },
    { value: "admin", label: "Admin" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-black p-4">
      <div className="relative w-full max-w-md rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(99,102,241,0.25)] p-10">

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/50">
            <LogIn className="text-white w-8 h-8" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Welcome Back
        </h1>
        <p className="text-slate-400 text-center mb-8">
          Login to EduPredict AI Platform
        </p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {roles.map((r) => (
            <button
              key={r.value}
              onClick={() => setRole(r.value)}
              className={`p-4 rounded-xl border transition-all duration-300 ${
                role === r.value
                  ? "border-indigo-500 bg-indigo-500/15 shadow-lg shadow-indigo-500/30 scale-105"
                  : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
              }`}
            >
              <UserCircle
                className={`mx-auto mb-2 ${
                  role === r.value ? "text-indigo-400" : "text-slate-500"
                }`}
              />
              <p
                className={`text-sm font-medium ${
                  role === r.value ? "text-white" : "text-slate-400"
                }`}
              >
                {r.label}
              </p>
            </button>
          ))}
        </div>

        <div className="flex justify-center mb-4">
          <div ref={buttonRef} />
        </div>

        {role === "student" && (
          <button
            onClick={goStudentOnboard}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold"
          >
            Complete Student Onboarding
          </button>
        )}

        {isLoading && (
          <p className="text-center text-slate-400 animate-pulse">
            Signing you in...
          </p>
        )}

        {error && (
          <p className="text-center text-red-400 mt-2">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

