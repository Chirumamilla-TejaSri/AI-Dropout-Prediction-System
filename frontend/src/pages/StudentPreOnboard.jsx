import React, { useState } from "react";
import axios from "axios";

export default function StudentPreOnboard() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const sendLink = async () => {
    try {
      await axios.post("http://127.0.0.1:5000/student/send-invite", { email });
      setMsg("Onboarding link sent to your email 📩");
    } catch (err) {
      setMsg(err.response?.data?.error || "Failed to send link");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-black">
      <div className="bg-white/5 backdrop-blur-xl p-10 rounded-2xl border border-white/10 w-[400px] shadow-2xl">

        <h2 className="text-white text-2xl font-bold text-center mb-6">
          Student Onboarding
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 rounded-lg bg-black/40 border border-white/10 text-white mb-4"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <button
          onClick={sendLink}
          className="w-full p-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold"
        >
          Send Onboarding Link
        </button>

        {msg && (
          <p className="text-center text-slate-400 mt-4">
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}