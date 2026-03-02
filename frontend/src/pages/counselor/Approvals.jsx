import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

export default function Approvals() {
  const counselorId = localStorage.getItem("user_id");
  const [students, setStudents] = useState([]);

  const loadStudents = () => {
    axios
      .get(`${API}/counselor/students-with-risk/${counselorId}`)
      .then((res) => {
        const pending = res.data.filter(
          (s) => s.status === "pending"
        );
        setStudents(pending);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const approveStudent = async (studentId) => {
    await axios.post(
      `${API}/counselor/approve/${counselorId}/${studentId}`
    );
    loadStudents();
  };

  const rejectStudent = async (studentId) => {
    await axios.post(
      `${API}/counselor/reject/${counselorId}/${studentId}`
    );
    loadStudents();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Approvals</h1>

      {students.length === 0 && (
        <p className="text-slate-400">
          No pending approvals
        </p>
      )}

      {students.map((s) => (
        <div
          key={s.id}
          className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">{s.name}</p>
            <p className="text-slate-400 text-sm">
              {s.roll_no}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => approveStudent(s.id)}
              className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Accept
            </button>

            <button
              onClick={() => rejectStudent(s.id)}
              className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}