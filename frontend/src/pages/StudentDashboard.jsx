import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bell } from "lucide-react";

const API = "http://localhost:5000";

export default function StudentDashboard() {
  const userId = localStorage.getItem("user_id");

  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profileImage, setProfileImage] = useState(null);

  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`${API}/student/dashboard/${userId}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));

    axios
      .get(`${API}/student/notifications/${userId}`)
      .then((res) => setNotificationCount(res.data.count))
      .catch((err) => console.error(err));

    axios
      .get(`${API}/student/notifications/list/${userId}`)
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error(err));

  }, [userId]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Loading...
      </div>
    );
  }

  const { profile, prediction, notes, assignments } = data;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">

      {/* SIDEBAR */}
      <div className="w-64 bg-black/40 backdrop-blur-2xl border-r border-white/10 p-6 flex flex-col justify-between">

        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent mb-8">
            Student Panel
          </h1>

          <SidebarItem label="Dashboard" active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} />
          <SidebarItem label="Counseling" active={activeTab === "counseling"} onClick={() => setActiveTab("counseling")} />
          <SidebarItem label="Assignments" active={activeTab === "assignments"} onClick={() => setActiveTab("assignments")} />
          <SidebarItem label="Profile" active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
        </div>

        <div className="h-32 bg-gradient-to-t from-violet-600/30 blur-2xl rounded-full"></div>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-8 overflow-y-auto">

        {/* TOP NAV */}
        <div className="flex justify-end items-center gap-6 mb-8">

          {/* NOTIFICATION */}
          <div className="relative">
            <div
              onClick={async () => {
  const newState = !dropdownOpen;
        setDropdownOpen(newState);

        if (!dropdownOpen) {
          for (const n of notifications) {
            if (!n.is_read) {
              await axios.post(
                `${API}/student/notifications/read/${n.id}`
              );
            }
          }

          setNotificationCount(0);

          const res = await axios.get(
            `${API}/student/notifications/list/${userId}`
          );
          setNotifications(res.data);
        }
      }}
              className="relative bg-indigo-600/30 p-2 rounded-full hover:bg-indigo-600 transition cursor-pointer"
            >
              <Bell size={18} className="text-indigo-300" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-[10px] px-1.5 rounded-full">
                  {notificationCount}
                </span>
              )}
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-72 bg-[#1e1b4b] border border-white/10 rounded-2xl shadow-xl z-50 max-h-80 overflow-y-auto">
                <div className="p-3 border-b border-white/10 font-semibold">
                  Notifications
                </div>

                {notifications.length === 0 ? (
                  <div className="p-3 text-sm text-slate-400">
                    No notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 text-sm border-b border-white/5 ${
                        !n.is_read ? "bg-white/5" : ""
                      }`}
                    >
                      {n.message}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* PROFILE */}
          <div
            onClick={() => setActiveTab("profile")}
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center font-bold">
              {profile.name.charAt(0)}
            </div>
            <span className="text-sm">{profile.name}</span>
          </div>

        </div>

        {/* TABS */}
        {activeTab === "dashboard" && (
          <DashboardSection profile={profile} prediction={prediction} />
        )}

        {activeTab === "counseling" && (
          <CounselingSection notes={notes} profile={profile} />
        )}

        {activeTab === "assignments" && (
          <AssignmentSection assignments={assignments} />
        )}

        {activeTab === "profile" && (
          <ProfileSection
            profile={profile}
            profileImage={profileImage}
            setProfileImage={setProfileImage}
          />
        )}
      </div>
    </div>
  );
}

/* SIDEBAR ITEM */
function SidebarItem({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl mb-3 transition-all duration-300 ${
        active
          ? "bg-gradient-to-r from-violet-600 to-purple-600 shadow-lg"
          : "hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}

/* DASHBOARD */
function DashboardSection({ profile, prediction }) {

  let riskStyle = "bg-gray-600";
  if (prediction?.risk_level?.includes("High")) {
    riskStyle = "bg-red-600 shadow-red-500/40";
  } else if (prediction?.risk_level?.includes("Medium")) {
    riskStyle = "bg-yellow-500 shadow-yellow-400/40";
  } else if (prediction?.risk_level?.includes("Low")) {
    riskStyle = "bg-green-600 shadow-green-500/40";
  }

  return (
    <>
      <h2 className="text-3xl font-bold mb-6">
        Welcome back, {profile.name}
      </h2>

      <div className="grid grid-cols-4 gap-6">
        <StatCard label="CGPA" value={prediction?.cgpa ?? "N/A"} />
        <StatCard label="Attendance" value={prediction?.attendance ?? "N/A"} />
        <StatCard label="Backlogs" value={prediction?.backlogs ?? 0} />

        <div className={`rounded-3xl p-6 shadow-lg ${riskStyle}`}>
          <p className="text-sm">Risk Level</p>
          <h2 className="text-2xl font-bold">
            {prediction?.risk_level ?? "N/A"}
          </h2>
        </div>
      </div>
    </>
  );
}

/* COUNSELING WITH REPLIES */
function CounselingSection({ notes, profile }) {

  const userId = localStorage.getItem("user_id");
  const [replyText, setReplyText] = useState({});
  const [replyFile, setReplyFile] = useState({});

  const handleReply = async (noteId) => {
    const formData = new FormData();
    formData.append("note_id", noteId);
    formData.append("student_id", profile.id);
    formData.append("message", replyText[noteId] || "");

    if (replyFile[noteId]) {
      formData.append("file", replyFile[noteId]);
    }

    await axios.post(`${API}/student/notes/reply`, formData);
    alert("Reply sent successfully ✅");
    window.location.reload();
  };

  return (
    <>
      <h2 className="text-3xl font-bold mb-6">
        Counseling Notes
      </h2>

      {notes.length === 0 && (
        <p className="text-slate-400">No counseling notes yet.</p>
      )}

      <div className="space-y-6">
        {notes.map((n, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">

            <div className="flex justify-between mb-2">
              <span className="bg-violet-600/30 px-3 py-1 rounded-full text-sm">
                {n.note_type}
              </span>
              <span className="text-slate-400 text-sm">
                {new Date(n.created_at).toLocaleDateString()}
              </span>
            </div>

            <p className="mb-4">{n.note}</p>

            {n.replies?.map((r, idx) => (
              <div key={idx} className="ml-4 mb-3 p-3 bg-white/10 rounded-xl">
                <p className="text-xs text-indigo-300 mb-1">
                  {r.sender_role === "student" ? "You" : "Counselor"}
                </p>
                <p>{r.message}</p>

                {r.file_url && (
                  <a
                    href={`${API}${r.file_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 underline text-xs"
                  >
                    📎 View Attachment
                  </a>
                )}
              </div>
            ))}

            <div className="mt-4 space-y-3">
              <textarea
                placeholder="Write a reply..."
                value={replyText[n.id] || ""}
                onChange={(e) =>
                  setReplyText({ ...replyText, [n.id]: e.target.value })
                }
                className="w-full bg-white/10 p-3 rounded-xl border border-white/20"
              />

              <input
                type="file"
                onChange={(e) =>
                  setReplyFile({ ...replyFile, [n.id]: e.target.files[0] })
                }
                className="text-sm"
              />

              <button
                onClick={() => handleReply(n.id)}
                className="bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2 rounded-xl"
              >
                Send Reply
              </button>
            </div>

          </div>
        ))}
      </div>
    </>
  );
}

/* ASSIGNMENTS */
function AssignmentSection({ assignments }) {
  return (
    <>
      <h2 className="text-3xl font-bold mb-6">
        Assignments
      </h2>

      {assignments.length === 0 && (
        <p className="text-slate-400">No assignments assigned.</p>
      )}

      <div className="grid grid-cols-2 gap-6">
        {assignments.map((a, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <h3 className="text-lg font-semibold">{a.title}</h3>
            <p className="text-sm text-slate-400 mt-1">
              Deadline: {a.deadline}
            </p>
            <p className="text-sm mt-3">{a.description}</p>

            {a.file_url && (
              <a
                href={`${API}${a.file_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-indigo-400 underline text-sm"
              >
                📎 Download Attachment
              </a>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

/* PROFILE & STATCARD remain unchanged */
function ProfileSection({ profile, profileImage, setProfileImage }) {
  const [semester, setSemester] = useState(profile.semester);
  const [saving, setSaving] = useState(false);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) setProfileImage(URL.createObjectURL(file));
  };

  const removePhoto = () => setProfileImage(null);

  const saveProfile = async () => {
    setSaving(true);
    await axios.post(
      `${API}/student/profile/update/${localStorage.getItem("user_id")}`,
      { semester }
    );
    setSaving(false);
    alert("Profile updated successfully ✅");
  };

  return (
    <>
      <h2 className="text-3xl font-bold mb-6">Profile</h2>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-8">

        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center overflow-hidden">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold">
                {profile.name.charAt(0)}
              </span>
            )}
          </div>

          <div className="flex gap-3">
            <label className="bg-violet-600 px-4 py-2 rounded-xl cursor-pointer hover:bg-violet-700 transition">
              Upload
              <input type="file" className="hidden" onChange={handleUpload} />
            </label>

            {profileImage && (
              <button
                onClick={removePhoto}
                className="bg-red-600 px-4 py-2 rounded-xl hover:bg-red-700 transition"
              >
                Remove
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-400">Name</label>
            <input value={profile.name} disabled className="w-full bg-white/10 p-3 rounded-xl border border-white/20 text-slate-400 mt-1" />
          </div>

          <div>
            <label className="text-sm text-slate-400">Semester</label>
            <input value={semester} onChange={(e) => setSemester(e.target.value)} className="w-full bg-white/10 p-3 rounded-xl border border-white/20 mt-1" />
          </div>

          <div>
            <label className="text-sm text-slate-400">Branch</label>
            <input value={profile.branch} disabled className="w-full bg-white/10 p-3 rounded-xl border border-white/20 text-slate-400 mt-1" />
          </div>
        </div>

        <button
          onClick={saveProfile}
          disabled={saving}
          className="w-full bg-gradient-to-r from-violet-600 to-purple-600 py-3 rounded-xl font-semibold hover:scale-[1.02] transition"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

      </div>
    </>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-lg hover:scale-105 transition duration-300">
      <p className="text-slate-400 text-sm">{label}</p>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
}