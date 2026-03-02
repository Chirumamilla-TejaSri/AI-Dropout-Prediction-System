import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

export default function Settings() {

  const counselorId = localStorage.getItem("user_id");

  const [profile, setProfile] = useState({
    full_name: "",
    branch: "",
    phone: "",
    employee_id: ""
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
  if (counselorId) {
    loadProfile();
  }
}, [counselorId]);

  const loadProfile = async () => {
    const res = await axios.get(
      `${API}/counselor/profile/${counselorId}`
    );
    setProfile(res.data);
  };

  const updateProfile = async () => {
    if (!profile.full_name.trim()) {
      alert("Name cannot be empty");
      return;
    }

    setLoading(true);

    await axios.post(
      `${API}/counselor/profile/update/${counselorId}`,
      {
        full_name: profile.full_name,
        phone: profile.phone
      }
    );

    setLoading(false);
    setSuccess(true);

    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-14">

      <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
        Profile Settings
      </h1>

      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-10 space-y-8">

        {/* Avatar */}
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-2xl font-bold">
            {profile.full_name
              ? profile.full_name.charAt(0).toUpperCase()
              : "C"}
          </div>

          <div>
            <p className="text-xl font-semibold">
              {profile.full_name}
            </p>
            <p className="text-slate-400">
              {profile.email}
            </p>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="grid grid-cols-2 gap-8">

          {/* Full Name */}
          <div>
            <label className="text-sm text-slate-400">
              Full Name
            </label>
            <input
              value={profile.full_name}
              onChange={(e) =>
                setProfile({ ...profile, full_name: e.target.value })
              }
              className="w-full bg-white/10 p-3 rounded-xl border border-white/20 focus:outline-none mt-2"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm text-slate-400">
              Phone
            </label>
            <input
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              className="w-full bg-white/10 p-3 rounded-xl border border-white/20 focus:outline-none mt-2"
            />
          </div>

          {/* Branch (Locked) */}
          <div>
            <label className="text-sm text-slate-400">
              Branch
            </label>
            <input
              value={profile.branch}
              disabled
              className="w-full bg-white/5 p-3 rounded-xl border border-white/10 text-slate-400 mt-2"
            />
          </div>

          {/* Employee ID (Locked) */}
          <div>
            <label className="text-sm text-slate-400">
              Employee ID
            </label>
            <input
              value={profile.employee_id || ""}
              disabled
              className="w-full bg-white/5 p-3 rounded-xl border border-white/10 text-slate-400 mt-2"
            />
          </div>

        </div>

        {/* Save Button */}
        <button
          onClick={updateProfile}
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 py-3 rounded-xl font-semibold hover:scale-[1.02] transition duration-300 shadow-lg disabled:opacity-50"
        >
          {loading ? "Updating..." : "💾 Save Changes"}
        </button>

        {success && (
          <p className="text-green-400 text-center">
            Profile updated successfully ✅
          </p>
        )}

      </div>

    </div>
  );
}