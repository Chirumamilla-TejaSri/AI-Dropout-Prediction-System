import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

const Predictionspage = () => {
  const predictions =
    JSON.parse(localStorage.getItem("predictions")) || [];

  const [selectedRisk, setSelectedRisk] = useState("All");

  const filteredData =
    selectedRisk === "All"
      ? predictions
      : predictions.filter((p) =>
          p.risk_level.includes(selectedRisk)
        );

  const total = predictions.length;
  const highRisk = predictions.filter((p) =>
    p.risk_level.includes("High")
  ).length;
  const mediumRisk = predictions.filter((p) =>
    p.risk_level.includes("Medium")
  ).length;
  const lowRisk = predictions.filter((p) =>
    p.risk_level.includes("Low")
  ).length;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0b1120] to-[#111827] text-white">
      <Sidebar />

      <div className="flex-1 p-10 space-y-10">

        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent">
            Prediction Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            Student Risk Analysis Overview
          </p>
        </div>

        {/* Summary Cards */}
        {total > 0 && (
          <div className="grid grid-cols-4 gap-8">
            <Card title="Total Students" value={total} />
            <Card title="High Risk" value={highRisk} color="red" />
            <Card title="Medium Risk" value={mediumRisk} color="yellow" />
            <Card title="Low Risk" value={lowRisk} color="green" />
          </div>
        )}

        {/* Risk Filter Toggle */}
        {total > 0 && (
          <div className="flex gap-4">
            {["All", "High", "Medium", "Low"].map((risk) => (
              <button
                key={risk}
                onClick={() => setSelectedRisk(risk)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedRisk === risk
                    ? "bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg shadow-indigo-500/30"
                    : "bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10"
                }`}
              >
                {risk}
              </button>
            ))}
          </div>
        )}

        {/* Table */}
        {filteredData.length === 0 ? (
          <p className="text-gray-400">
            No students found for selected filter.
          </p>
        ) : (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="max-h-[500px] overflow-y-auto">
              <table className="w-full text-left">
                <thead className="text-gray-300 border-b border-white/10 bg-white/5 backdrop-blur-lg sticky top-0">
                  <tr>
                    <th className="py-4 px-6">Roll Number</th>
                    <th>CGPA</th>
                    <th>Attendance</th>
                    <th>Backlogs</th>
                    <th>Risk Level</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredData.map((student, index) => (
                    <tr
                      key={index}
                      className="border-b border-white/5 hover:bg-white/5 transition duration-300"
                    >
                      <td className="py-4 px-6 font-semibold">
                        {student.roll_number}
                      </td>

                      <td>{student.cgpa}</td>
                      <td>{student.attendance}%</td>
                      <td>{student.backlogs}</td>

                      <td>
                        <RiskBadge level={student.risk_level} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Card = ({ title, value, color }) => {
  const colorMap = {
    red: "text-red-400",
    yellow: "text-yellow-400",
    green: "text-green-400",
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:scale-105 transition duration-300 shadow-xl">
      <p className="text-gray-400 text-sm mb-2">{title}</p>
      <h2 className={`text-4xl font-bold ${colorMap[color] || "text-white"}`}>
        {value}
      </h2>
    </div>
  );
};

const RiskBadge = ({ level }) => {
  let style = "bg-green-500/20 text-green-400";

  if (level.includes("High"))
    style = "bg-red-500/20 text-red-400";
  else if (level.includes("Medium"))
    style = "bg-yellow-500/20 text-yellow-400";

  return (
    <span className={`px-4 py-1 rounded-full text-sm font-medium ${style}`}>
      {level}
    </span>
  );
};

export default Predictionspage;