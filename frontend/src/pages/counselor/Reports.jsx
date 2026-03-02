import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

export default function Reports() {

  const counselorId = localStorage.getItem("user_id");

  const [students, setStudents] = useState([]);
  const [riskFilter, setRiskFilter] = useState("All");

  useEffect(() => {
    loadReport();
  }, [riskFilter]);

  const loadReport = async () => {
    const res = await axios.get(
      `${API}/counselor/report/${counselorId}?risk=${riskFilter}`
    );
    setStudents(res.data);
  };

  const downloadCSV = () => {
    const csvRows = [
      ["Name", "Roll No", "Risk Level", "CGPA", "Attendance"],
      ...students.map((s) => [
        s.name,
        s.roll_no,
        s.risk_level,
        s.cgpa,
        s.attendance
      ])
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvRows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");

    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "risk_report.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="space-y-14">

      <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
        Risk Reports
      </h1>

      {/* Filter Card */}
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 flex justify-between items-center">

        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="bg-white/10 text-white p-3 rounded-xl border border-white/20"
        >
          <option className="text-black">All</option>
          <option className="text-black">High</option>
          <option className="text-black">Medium</option>
          <option className="text-black">Low</option>
        </select>

        <button
          onClick={downloadCSV}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2 rounded-xl"
        >
          ⬇ Download CSV
        </button>

      </div>

      {/* Table */}
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6">

        <table className="w-full text-left">
          <thead className="border-b border-white/10 text-slate-400">
            <tr>
              <th className="py-3">Name</th>
              <th>Roll No</th>
              <th>Risk</th>
              <th>CGPA</th>
              <th>Attendance</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s, index) => (
              <tr key={index} className="border-b border-white/5">
                <td className="py-3">{s.name}</td>
                <td>{s.roll_no}</td>
                <td>{s.risk_level}</td>
                <td>{s.cgpa}</td>
                <td>{s.attendance}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  );
}