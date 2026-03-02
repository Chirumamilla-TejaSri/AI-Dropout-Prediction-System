import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CheckCircle,
  FileText,
  BookOpen,
  BarChart3,
  Settings,
  Bell
} from "lucide-react";

export default function CounselorLayout() {

  const counselorId = localStorage.getItem("user_id");
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState({
    pending_approvals: 0,
    pending_submissions: 0
  });

  const [notificationList, setNotificationList] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const loadNotifications = () => {
    axios
      .get(`http://localhost:5000/counselor/notifications/${counselorId}`)
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error(err));
  };

  const loadNotificationList = () => {
    axios
      .get(`http://localhost:5000/counselor/notifications/list/${counselorId}`)
      .then((res) => setNotificationList(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (!counselorId) return;
    loadNotifications();
    loadNotificationList();
  }, [counselorId]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 to-indigo-950 text-white">

      {/* Sidebar */}
      <div className="w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col">

        <h2 className="text-2xl font-bold mb-10">Counselor</h2>

        <nav className="flex flex-col gap-4 text-sm">

          <SidebarItem to="/counselor/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <SidebarItem to="/counselor/students" icon={<Users size={18} />} label="My Students" />

          <SidebarItem
            to="/counselor/approvals"
            icon={<CheckCircle size={18} />}
            label="Approvals"
            badge={notifications.pending_approvals}
          />

          <SidebarItem
            to="/counselor/assignments"
            icon={<FileText size={18} />}
            label="Assignments"
            badge={notifications.pending_submissions}
          />

          <SidebarItem to="/counselor/notes" icon={<BookOpen size={18} />} label="Counseling Notes" />
          <SidebarItem to="/counselor/reports" icon={<BarChart3 size={18} />} label="Reports" />
          <SidebarItem to="/counselor/settings" icon={<Settings size={18} />} label="Settings" />

        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}
        <div className="flex justify-end items-center p-6 border-b border-white/10 relative">

          <div className="relative">

            {/* Bell Icon */}
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="relative p-2 rounded-full bg-white/10 hover:bg-indigo-600 transition"
            >
              <Bell size={22} className="text-indigo-400" />

              {(notifications.pending_approvals + notifications.pending_submissions) > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs px-2 py-0.5 rounded-full">
                  {notifications.pending_approvals + notifications.pending_submissions}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-white/10 rounded-xl shadow-xl max-h-96 overflow-y-auto z-50">

                <div className="p-4 border-b border-white/10 font-semibold">
                  Notifications
                </div>

                {notificationList.length === 0 ? (
                  <div className="p-4 text-sm text-slate-400">
                    No notifications
                  </div>
                ) : (
                  notificationList.map((n) => (
                    <div
                      key={n.id}
                      className={`p-4 text-sm border-b border-white/5 cursor-pointer hover:bg-white/10 ${
                        !n.is_read ? "bg-white/5" : ""
                      }`}
                      onClick={() => {
                        navigate("/counselor/notes");
                        setDropdownOpen(false);
                      }}
                    >
                      {n.message}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Page Content */}
        <div className="p-10">
          <Outlet />
        </div>

      </div>
    </div>
  );
}

function SidebarItem({ to, icon, label, badge }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center justify-between px-4 py-3 rounded-xl transition ${
          isActive
            ? "bg-indigo-600 text-white"
            : "hover:bg-white/10 text-slate-300"
        }`
      }
    >
      <div className="flex items-center gap-3">
        {icon}
        {label}
      </div>

      {badge > 0 && (
        <span className="bg-red-500 text-xs px-2 py-1 rounded-full animate-pulse">
          {badge}
        </span>
      )}
    </NavLink>
  );
}