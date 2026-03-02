import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-black border border-white/10 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Google OAuth Enabled</h1>
        <p className="text-slate-400 mb-6">
          Password signup is removed. Use Google Sign-In for authentication.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center justify-center px-5 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}
