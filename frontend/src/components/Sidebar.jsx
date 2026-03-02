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
    <div className="w-64 min-h-screen p-8 
                    bg-white/5 backdrop-blur-2xl 
                    border-r border-white/10 
                    shadow-2xl">

      <h2 className="text-2xl font-bold mb-12 
                     bg-gradient-to-r from-indigo-400 to-purple-500 
                     bg-clip-text text-transparent">
        Admin Panel
      </h2>

      <div className="space-y-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-3 rounded-xl 
               transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30"
                  : "text-slate-400 hover:bg-white/10 hover:text-white hover:shadow-md"
              }`
            }
          >
            {item.icon}
            <span className="text-sm font-medium">
              {item.name}
            </span>
          </NavLink>
        ))}
      </div>

    </div>
  );
};

export default Sidebar;