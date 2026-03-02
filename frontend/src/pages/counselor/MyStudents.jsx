import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000";

export default function MyStudents() {
  const counselorId = localStorage.getItem("user_id");
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!counselorId) return;

    axios
      .get(`${API}/counselor/students-with-risk/${counselorId}`)
      .then((res) => {
        const approvedStudents = res.data.filter(
          (s) => s.status === "approved"
        );
        setStudents(approvedStudents);
      })
      .catch((err) => console.error(err));
  }, [counselorId]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Students</h1>

      {students.length === 0 && (
        <p className="text-slate-400">
          No approved students yet
        </p>
      )}

      {students.map((s) => (
        <div
          key={s.id}
          onClick={() => navigate(`/counselor/student/${s.id}`)}
          className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 
                     flex justify-between items-center cursor-pointer 
                     hover:bg-white/10 transition duration-200"
        >
          {/* Left Section */}
          <div>
            <p className="font-semibold text-lg">{s.name}</p>
            <p className="text-slate-400 text-sm">
              {s.roll_no} • Semester {s.semester}
            </p>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <RiskBadge level={s.risk_level} />
          </div>
        </div>
      ))}
    </div>
  );
}

function RiskBadge({ level }) {
  let color = "bg-green-600";

  if (level === "High Risk") color = "bg-red-600";
  else if (level === "Medium Risk") color = "bg-yellow-600";

  return (
    <span
      className={`${color} px-3 py-1 rounded-full text-sm font-semibold`}
    >
      {level}
    </span>
  );
}