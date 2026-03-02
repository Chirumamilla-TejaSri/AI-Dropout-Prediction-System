import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000";

export default function CounselorDashboard() {
  const counselorId = localStorage.getItem("user_id");

  const [summary, setSummary] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    high: 0,
    medium: 0,
    low: 0,
  });

  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    if (!counselorId) return;

    try {
      const res = await axios.get(
        `${API_BASE}/counselor/dashboard/${counselorId}`
      );
      setSummary(res.data);
    } catch (err) {
      console.error("Failed loading dashboard", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [counselorId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-indigo-950 p-10 text-white">
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

      {loading && <p className="text-slate-400">Loading dashboard...</p>}

      {!loading && (
        <>
          {/* Top Summary Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <Card title="Total Students" value={summary.total} />
            <Card title="Approved" value={summary.approved} />
            <Card title="Pending Approvals" value={summary.pending} />
          </div>

          {/* Risk Cards */}
          <div className="grid grid-cols-3 gap-6">
            <Card title="High Risk" value={summary.high} color="red" />
            <Card title="Medium Risk" value={summary.medium} color="yellow" />
            <Card title="Low Risk" value={summary.low} color="green" />
          </div>
        </>
      )}
    </div>
  );
}

/* Reusable Card Component */
function Card({ title, value, color }) {
  let colorClass = "text-white";

  if (color === "red") colorClass = "text-red-500";
  if (color === "yellow") colorClass = "text-yellow-400";
  if (color === "green") colorClass = "text-green-400";

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
      <h2 className="text-slate-400 text-sm mb-2">{title}</h2>
      <p className={`text-3xl font-bold ${colorClass}`}>{value}</p>
    </div>
  );
}