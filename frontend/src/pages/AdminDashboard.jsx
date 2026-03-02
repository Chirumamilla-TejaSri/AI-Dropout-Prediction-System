import React from "react";
import Sidebar from "../components/Sidebar";
import { BarChart3, Upload, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#020617] text-white">
      
      <Sidebar />

      <div className="flex-1 p-12">

        {/* Header */}
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
          Welcome to Admin Dashboard 👩‍💻
        </h1>

        <p className="text-slate-400 mb-12 text-lg">
          Manage your academic risk monitoring system from here.
        </p>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

          {/* Upload Card */}
          <div
            onClick={() => navigate("/admin/upload")}
            className="relative cursor-pointer bg-white/5 backdrop-blur-2xl border border-white/10 
                       rounded-3xl p-8 shadow-2xl hover:scale-[1.03] 
                       hover:shadow-indigo-500/30 transition-all duration-300"
          >
            <Upload className="mb-6 text-indigo-400" size={34} />
            <h2 className="text-2xl font-semibold mb-3">
              Upload Student Data
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Upload academic records to generate predictions.
            </p>
          </div>

          {/* Predictions Card */}
          <div
            onClick={() => navigate("/admin/predictions")}
            className="relative cursor-pointer bg-white/5 backdrop-blur-2xl border border-white/10 
                       rounded-3xl p-8 shadow-2xl hover:scale-[1.03] 
                       hover:shadow-green-500/30 transition-all duration-300"
          >
            <BarChart3 className="mb-6 text-green-400" size={34} />
            <h2 className="text-2xl font-semibold mb-3">
              View Predictions
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Analyze student risk levels and trends.
            </p>
          </div>

          {/* Counselors Card */}
          <div
            onClick={() => navigate("/admin/counselors")}
            className="relative cursor-pointer bg-white/5 backdrop-blur-2xl border border-white/10 
                       rounded-3xl p-8 shadow-2xl hover:scale-[1.03] 
                       hover:shadow-purple-500/30 transition-all duration-300"
          >
            <Users className="mb-6 text-purple-400" size={34} />
            <h2 className="text-2xl font-semibold mb-3">
              Manage Counselors
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Invite and manage counselor accounts.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;