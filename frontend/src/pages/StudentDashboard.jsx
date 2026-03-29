import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Bell,
  LayoutDashboard,
  BookOpen,
  FileText,
  UserCircle
} from "lucide-react";

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
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 to-indigo-950 text-white">

      {/* SIDEBAR */}
      <div className="w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col">
        <div>
          <h1 className="text-2xl font-bold mb-10">Student</h1>

          <nav className="flex flex-col gap-4 text-sm">
            <SidebarItem
              label="Dashboard"
              icon={<LayoutDashboard size={18} />}
              active={activeTab === "dashboard"}
              onClick={() => setActiveTab("dashboard")}
            />
            <SidebarItem
              label="Counseling"
              icon={<BookOpen size={18} />}
              active={activeTab === "counseling"}
              onClick={() => setActiveTab("counseling")}
            />
            <SidebarItem
              label="Assignments"
              icon={<FileText size={18} />}
              active={activeTab === "assignments"}
              onClick={() => setActiveTab("assignments")}
            />
            <SidebarItem
              label="Profile"
              icon={<UserCircle size={18} />}
              active={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
            />
          </nav>
        </div>

        <div className="h-32 bg-gradient-to-t from-slate-700/30 blur-2xl rounded-full"></div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOP NAV */}
        <div className="flex justify-end items-center p-6 border-b border-white/10">

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
              className="relative bg-white/10 p-2 rounded-full hover:bg-indigo-600 transition cursor-pointer"
            >
              <Bell size={18} className="text-indigo-400" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-[10px] px-1.5 rounded-full">
                  {notificationCount}
                </span>
              )}
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-72 bg-slate-900 border border-white/10 rounded-2xl shadow-xl z-50 max-h-80 overflow-y-auto">
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

        </div>

        <div className="p-10 overflow-y-auto">
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
    </div>
  );
}

/* SIDEBAR ITEM */
function SidebarItem({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl transition flex items-center gap-3 ${
        active
          ? "bg-indigo-600 text-white"
          : "hover:bg-white/10 text-slate-300"
      }`}
    >
      {icon}
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
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent inline-block">
        Welcome, {profile.name}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
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
              <span className="bg-indigo-600/30 px-3 py-1 rounded-full text-sm">
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
                className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 px-4 py-2 rounded-xl"
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

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");
    localStorage.removeItem("admin_branch");
    window.location.href = "/login";
  };

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
      <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent inline-block mb-6">
        Profile Settings
      </h2>

      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-10 space-y-8">

        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center overflow-hidden text-2xl font-bold">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span>
                {profile.name.charAt(0)}
              </span>
            )}
          </div>

          <div>
            <p className="text-xl font-semibold">
              {profile.name}
            </p>
            <p className="text-slate-400">
              {profile.roll_no}
            </p>
          </div>

        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="text-sm text-slate-400">Full Name</label>
            <input value={profile.name} disabled className="w-full bg-white/10 p-3 rounded-xl border border-white/20 text-slate-300 mt-2" />
          </div>

          <div>
            <label className="text-sm text-slate-400">Semester</label>
            <input value={semester} onChange={(e) => setSemester(e.target.value)} className="w-full bg-white/10 p-3 rounded-xl border border-white/20 mt-2" />
          </div>

          <div>
            <label className="text-sm text-slate-400">Branch</label>
            <input value={profile.branch} disabled className="w-full bg-white/5 p-3 rounded-xl border border-white/10 text-slate-400 mt-2" />
          </div>

          <div>
            <label className="text-sm text-slate-400">Roll Number</label>
            <input value={profile.roll_no} disabled className="w-full bg-white/5 p-3 rounded-xl border border-white/10 text-slate-400 mt-2" />
          </div>
        </div>

        <button
          onClick={saveProfile}
          disabled={saving}
          className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 py-3 rounded-xl font-semibold hover:scale-[1.02] transition duration-300 shadow-lg disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

      </div>

      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-10 space-y-4">
        <h2 className="text-2xl font-semibold">
          Logout
        </h2>
        <p className="text-slate-400">
          Sign out of the student dashboard on this device.
        </p>
        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-3 rounded-xl font-semibold hover:scale-[1.02] transition duration-300 shadow-lg"
        >
          Logout
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



