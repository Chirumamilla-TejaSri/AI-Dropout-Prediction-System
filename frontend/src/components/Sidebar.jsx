import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  BarChart,
  Users,
  Settings
} from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <LayoutDashboard size={18} />
    },
    {
      name: "Upload Data",
      path: "/admin/upload",
      icon: <Upload size={18} />
    },
    {
      name: "Predictions",
      path: "/admin/predictions",
      icon: <BarChart size={18} />
    },
    {
      name: "Counselors",
      path: "/admin/counselors",
      icon: <Users size={18} />
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: <Settings size={18} />
    }
  ];

  return (
    <div className="w-64 min-h-screen p-6 bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col">
      <h2 className="text-2xl font-bold mb-10">Admin</h2>

      <nav className="flex flex-col gap-4 text-sm">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-white/10 text-slate-300"
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
