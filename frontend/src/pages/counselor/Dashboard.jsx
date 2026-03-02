import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000";

export default function Dashboard() {
  const counselorId = localStorage.getItem("user_id");
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API}/counselor/dashboard/${counselorId}`)
      .then((res) => setStats(res.data));

    axios
      .get(`${API}/counselor/activity/${counselorId}`)
      .then((res) => setActivities(res.data));
  }, [counselorId]);

  if (!stats) return <p>Loading...</p>;

  const totalRisk = stats.high + stats.medium + stats.low;

  const riskData = [
    { name: "High", value: stats.high },
    { name: "Medium", value: stats.medium },
    { name: "Low", value: stats.low }
  ];

  const COLORS = ["#ef4444", "#f59e0b", "#22c55e"];

  const percent = (v) =>
    totalRisk === 0 ? 0 : Math.round((v / totalRisk) * 100);

  return (
    <div className="space-y-14">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Counselor Dashboard
          </h1>
          <p className="text-slate-400 mt-2">
            Monitor academic performance & risk levels
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/counselor/assignments")}
            className="bg-indigo-600 px-5 py-2 rounded-xl hover:scale-105 transition"
          >
            + Create Assignment
          </button>

          <button
            onClick={() => navigate("/counselor/approvals")}
            className="bg-white/10 px-5 py-2 rounded-xl border border-white/20 hover:bg-white/20 transition"
          >
            View Approvals
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-6">
        <StatCard label="Total Students" value={stats.total} />
        <StatCard label="Approved" value={stats.approved} />
        <StatCard label="Pending" value={stats.pending} />
      </div>

      {/* ANALYTICS */}
      <div className="grid grid-cols-2 gap-8">

        {/* Donut Chart */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 h-96">
          <h2 className="text-xl font-semibold mb-6">
            Risk Distribution
          </h2>

          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={riskData}
                dataKey="value"
                innerRadius={70}
                outerRadius={120}
                paddingAngle={5}
              >
                {riskData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Bars */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 space-y-6">
          <h2 className="text-xl font-semibold">
            Risk Breakdown
          </h2>

          <RiskBar
            label="High Risk"
            value={stats.high}
            percent={percent(stats.high)}
            color="bg-red-500"
          />
          <RiskBar
            label="Medium Risk"
            value={stats.medium}
            percent={percent(stats.medium)}
            color="bg-yellow-500"
          />
          <RiskBar
            label="Low Risk"
            value={stats.low}
            percent={percent(stats.low)}
            color="bg-green-500"
          />
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 space-y-4">
        <h2 className="text-xl font-semibold">
          Recent Activity
        </h2>

        {activities.length === 0 && (
          <p className="text-slate-400">
            No recent activity
          </p>
        )}

        {activities.map((a, i) => (
          <div
            key={i}
            className="bg-white/10 p-4 rounded-xl hover:bg-white/20 transition"
          >
            {a.message}
          </div>
        ))}
      </div>

    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 
                    rounded-3xl p-8 shadow-xl hover:scale-[1.02] transition">
      <p className="text-slate-400 text-sm">{label}</p>
      <h2 className="text-4xl font-bold mt-2">{value}</h2>
    </div>
  );
}

function RiskBar({ label, value, percent, color }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>{value} ({percent}%)</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-3">
        <div
          className={`${color} h-3 rounded-full transition-all duration-700`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}