// ReportsPage.jsx - Reports generation and download
import React, { useState } from "react";
import { FileText, Download, BarChart3, Users, AlertTriangle, CheckCircle, Calendar, Filter, FileDown } from "lucide-react";
import { getOrdinal } from "./styles";

const ReportsPage = ({ data }) => {
  const [selectedReport, setSelectedReport] = useState("summary");
  const [filterYear, setFilterYear] = useState("All Years");
  const [filterRisk, setFilterRisk] = useState("All Risks");
  const [generatedAt] = useState(new Date().toLocaleString());

  if (data.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 40px", background: "rgba(30, 41, 59, 0.6)", backdropFilter: "blur(20px)", borderRadius: "20px", border: "1px solid rgba(148, 163, 184, 0.1)", position: "relative", zIndex: 1 }}>
        <FileText size={56} color="#3b82f6" style={{ marginBottom: "24px", opacity: 0.7 }} />
        <h3 style={{ fontSize: "24px", fontWeight: "800", color: "#fff", marginBottom: "12px" }}>No Reports Available</h3>
        <p style={{ fontSize: "15px", color: "#94a3b8", fontWeight: "600" }}>Upload student data to generate reports</p>
      </div>
    );
  }

  const high = data.filter(d => d.risk_level === "High Risk");
  const medium = data.filter(d => d.risk_level === "Medium Risk");
  const low = data.filter(d => d.risk_level === "Low Risk");

  const filteredData = data.filter(s => {
    const yearMatch = filterYear === "All Years" || (s.Year && `${s.Year}${getOrdinal(s.Year)} Year` === filterYear);
    const riskMatch = filterRisk === "All Risks" || s.risk_level === filterRisk;
    return yearMatch && riskMatch;
  });

  const avgAttendance = filteredData.length > 0 ? (filteredData.reduce((sum, s) => sum + (parseFloat(s.attendance) || 0), 0) / filteredData.length).toFixed(1) : 0;
  const avgCGPA = filteredData.length > 0 ? (filteredData.reduce((sum, s) => sum + (parseFloat(s.cgpa) || 0), 0) / filteredData.length).toFixed(2) : 0;
  const avgBacklogs = filteredData.length > 0 ? (filteredData.reduce((sum, s) => sum + (parseInt(s.backlogs) || 0), 0) / filteredData.length).toFixed(1) : 0;

  const reportTypes = [
    { id: "summary", label: "Summary Report", icon: <BarChart3 size={18} />, desc: "Overview of all risk statistics" },
    { id: "highrisk", label: "High Risk Report", icon: <AlertTriangle size={18} />, desc: `${high.length} students needing intervention` },
    { id: "yearwise", label: "Year-wise Report", icon: <Users size={18} />, desc: "Breakdown by academic year" },
    { id: "full", label: "Full Student Report", icon: <FileText size={18} />, desc: `All ${data.length} student records` }
  ];

  const exportToCSV = (dataToExport, filename) => {
    const headers = ["Student Name", "Roll Number", "Year", "Attendance (%)", "CGPA", "Backlogs", "Risk Level"];
    const csvData = dataToExport.map(student => [
      student.name || "N/A", student.roll_number || "N/A",
      student.Year ? `${student.Year}${getOrdinal(student.Year)} Year` : "N/A",
      student.attendance || "N/A", student.cgpa || "N/A",
      student.backlogs !== undefined ? student.backlogs : "N/A", student.risk_level || "Unknown"
    ]);
    const csvContent = [headers.join(","), ...csvData.map(row => row.map(cell => `"${cell}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = (dataToExport, title) => {
    const pw = window.open("", "", "width=900,height=700");
    const tableRows = dataToExport.map(s => `
      <tr>
        <td>${s.name || "N/A"}</td>
        <td>${s.roll_number || "N/A"}</td>
        <td>${s.Year ? `${s.Year}${getOrdinal(s.Year)} Year` : "N/A"}</td>
        <td>${s.attendance ? s.attendance + "%" : "N/A"}</td>
        <td>${s.cgpa || "N/A"}</td>
        <td>${s.backlogs !== undefined ? s.backlogs : "N/A"}</td>
        <td class="${s.risk_level === "High Risk" ? "high" : s.risk_level === "Medium Risk" ? "medium" : "low"}">${s.risk_level?.replace(" Risk", "") || "N/A"}</td>
      </tr>`).join("");

    pw.document.write(`
      <!DOCTYPE html><html><head><title>${title}</title><style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', sans-serif; background: #fff; color: #1e293b; padding: 40px; }
        .header { background: linear-gradient(135deg, #0f172a, #1e293b); color: #fff; padding: 30px; border-radius: 12px; margin-bottom: 30px; }
        .header h1 { font-size: 28px; font-weight: 900; letter-spacing: -1px; margin-bottom: 6px; }
        .header p { color: #94a3b8; font-size: 14px; font-weight: 600; }
        .stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 30px; }
        .stat-card { padding: 18px; border-radius: 12px; border: 1px solid #e2e8f0; }
        .stat-card .val { font-size: 32px; font-weight: 900; color: #1e293b; letter-spacing: -1px; }
        .stat-card .lbl { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        thead tr { background: #f1f5f9; }
        th { padding: 12px 14px; font-weight: 800; text-align: left; color: #475569; text-transform: uppercase; font-size: 10px; letter-spacing: 1px; }
        td { padding: 11px 14px; border-bottom: 1px solid #e2e8f0; color: #334155; font-weight: 600; }
        tr:hover td { background: #f8fafc; }
        .high { color: #dc2626; font-weight: 800; }
        .medium { color: #d97706; font-weight: 800; }
        .low { color: #059669; font-weight: 800; }
        .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #94a3b8; padding-top: 20px; border-top: 1px solid #e2e8f0; }
        @media print { body { padding: 20px; } }
      </style></head><body>
      <div class="header">
        <h1>EduPredict AI — ${title}</h1>
        <p>Generated on ${new Date().toLocaleString()} · ${dataToExport.length} students · EduPredict AI Platform</p>
      </div>
      <div class="stats">
        <div class="stat-card"><div class="val">${dataToExport.length}</div><div class="lbl">Total Students</div></div>
        <div class="stat-card"><div class="val" style="color:#dc2626">${dataToExport.filter(s => s.risk_level === "High Risk").length}</div><div class="lbl">High Risk</div></div>
        <div class="stat-card"><div class="val" style="color:#d97706">${dataToExport.filter(s => s.risk_level === "Medium Risk").length}</div><div class="lbl">Medium Risk</div></div>
        <div class="stat-card"><div class="val" style="color:#059669">${dataToExport.filter(s => s.risk_level === "Low Risk").length}</div><div class="lbl">Low Risk</div></div>
      </div>
      <table><thead><tr><th>Student Name</th><th>Roll No.</th><th>Year</th><th>Attendance</th><th>CGPA</th><th>Backlogs</th><th>Risk</th></tr></thead>
      <tbody>${tableRows}</tbody></table>
      <div class="footer">EduPredict AI Platform · Student Dropout Prediction System · Confidential Report</div>
      </body></html>`);
    pw.document.close();
    setTimeout(() => pw.print(), 300);
  };

  const getReportData = () => {
    if (selectedReport === "highrisk") return high;
    if (selectedReport === "full") return filteredData;
    return filteredData;
  };

  const yearGroups = [1, 2, 3].map(y => ({
    year: y,
    students: data.filter(s => s.Year === y),
    high: data.filter(s => s.Year === y && s.risk_level === "High Risk").length,
    medium: data.filter(s => s.Year === y && s.risk_level === "Medium Risk").length,
    low: data.filter(s => s.Year === y && s.risk_level === "Low Risk").length
  })).filter(g => g.students.length > 0);

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2.5fr", gap: "24px" }}>
        {/* Left: Report selector */}
        <div>
          <div style={{ background: "rgba(30, 41, 59, 0.6)", backdropFilter: "blur(20px)", borderRadius: "16px", padding: "20px", border: "1px solid rgba(148, 163, 184, 0.1)", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "800", color: "#fff", margin: "0 0 16px 0" }}>Report Type</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {reportTypes.map(rt => (
                <div key={rt.id} onClick={() => setSelectedReport(rt.id)} style={{ padding: "14px 16px", borderRadius: "12px", cursor: "pointer", transition: "all 0.2s", background: selectedReport === rt.id ? "rgba(59, 130, 246, 0.15)" : "rgba(15, 23, 42, 0.5)", border: selectedReport === rt.id ? "1px solid rgba(59, 130, 246, 0.4)" : "1px solid rgba(148, 163, 184, 0.1)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                    <span style={{ color: selectedReport === rt.id ? "#60a5fa" : "#64748b" }}>{rt.icon}</span>
                    <span style={{ fontSize: "14px", fontWeight: "700", color: selectedReport === rt.id ? "#fff" : "#cbd5e1" }}>{rt.label}</span>
                  </div>
                  <p style={{ fontSize: "11px", color: "#64748b", margin: 0, fontWeight: "600", paddingLeft: "28px" }}>{rt.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div style={{ background: "rgba(30, 41, 59, 0.6)", backdropFilter: "blur(20px)", borderRadius: "16px", padding: "20px", border: "1px solid rgba(148, 163, 184, 0.1)" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "800", color: "#fff", margin: "0 0 14px 0", display: "flex", alignItems: "center", gap: "8px" }}><Filter size={15} /> Filters</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <label style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "6px" }}>Academic Year</label>
                <select value={filterYear} onChange={e => setFilterYear(e.target.value)} style={{ width: "100%", padding: "10px 12px", background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: "10px", fontSize: "13px", color: "#cbd5e1", outline: "none", fontWeight: "700", cursor: "pointer" }}>
                  <option>All Years</option>
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "6px" }}>Risk Level</label>
                <select value={filterRisk} onChange={e => setFilterRisk(e.target.value)} style={{ width: "100%", padding: "10px 12px", background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: "10px", fontSize: "13px", color: "#cbd5e1", outline: "none", fontWeight: "700", cursor: "pointer" }}>
                  <option>All Risks</option>
                  <option>High Risk</option>
                  <option>Medium Risk</option>
                  <option>Low Risk</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Report Preview */}
        <div style={{ background: "rgba(30, 41, 59, 0.6)", backdropFilter: "blur(20px)", borderRadius: "16px", padding: "28px", border: "1px solid rgba(148, 163, 184, 0.1)" }}>
          {/* Report Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <div style={{ padding: "8px", background: "rgba(59, 130, 246, 0.1)", borderRadius: "10px", color: "#60a5fa" }}>
                  {reportTypes.find(r => r.id === selectedReport)?.icon}
                </div>
                <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#fff", margin: 0 }}>{reportTypes.find(r => r.id === selectedReport)?.label}</h2>
              </div>
              <p style={{ fontSize: "13px", color: "#64748b", margin: 0, fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
                <Calendar size={13} /> Generated: {generatedAt} · {getReportData().length} students
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => exportToCSV(getReportData(), selectedReport)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px", background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", color: "#fff", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 14px rgba(16, 185, 129, 0.4)" }}>
                <Download size={15} /> CSV
              </button>
              <button onClick={() => exportToPDF(getReportData(), reportTypes.find(r => r.id === selectedReport)?.label)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px", background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", color: "#fff", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 14px rgba(59, 130, 246, 0.4)" }}>
                <FileDown size={15} /> PDF
              </button>
            </div>
          </div>

          {/* Summary stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
            {[
              { label: "Students", value: filteredData.length, color: "#3b82f6" },
              { label: "High Risk", value: filteredData.filter(s => s.risk_level === "High Risk").length, color: "#ef4444" },
              { label: "Avg. Attendance", value: `${avgAttendance}%`, color: "#10b981" },
              { label: "Avg. CGPA", value: avgCGPA, color: "#8b5cf6" }
            ].map((s, i) => (
              <div key={i} style={{ padding: "14px", background: "rgba(15, 23, 42, 0.5)", borderRadius: "12px", border: "1px solid rgba(148, 163, 184, 0.1)", textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: "900", color: s.color, letterSpacing: "-0.5px" }}>{s.value}</div>
                <div style={{ fontSize: "11px", color: "#64748b", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Year-wise breakdown for yearwise report */}
          {selectedReport === "yearwise" && (
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "800", color: "#fff", margin: "0 0 14px 0" }}>Year-wise Breakdown</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {yearGroups.map(g => (
                  <div key={g.year} style={{ padding: "16px 20px", background: "rgba(15, 23, 42, 0.5)", borderRadius: "12px", border: "1px solid rgba(148, 163, 184, 0.1)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                      <span style={{ fontSize: "15px", fontWeight: "800", color: "#fff" }}>{g.year}{getOrdinal(g.year)} Year</span>
                      <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "700" }}>{g.students.length} students</span>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {[{ label: "High", val: g.high, color: "#ef4444" }, { label: "Medium", val: g.medium, color: "#f59e0b" }, { label: "Low", val: g.low, color: "#10b981" }].map(r => (
                        <div key={r.label} style={{ flex: 1, padding: "10px", background: `${r.color}10`, borderRadius: "8px", border: `1px solid ${r.color}20`, textAlign: "center" }}>
                          <div style={{ fontSize: "20px", fontWeight: "900", color: r.color }}>{r.val}</div>
                          <div style={{ fontSize: "11px", color: "#64748b", fontWeight: "700" }}>{r.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Table Preview */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "800", color: "#fff", margin: 0 }}>
                {selectedReport === "highrisk" ? "High Risk Students" : "Student Records"} Preview
              </h3>
              <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Showing {Math.min(20, getReportData().length)} of {getReportData().length}</span>
            </div>
            <div style={{ overflowX: "auto", borderRadius: "12px", border: "1px solid rgba(148, 163, 184, 0.1)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "rgba(15, 23, 42, 0.6)", borderBottom: "1px solid rgba(148, 163, 184, 0.2)" }}>
                    {["Student", "Roll No.", "Year", "Attendance", "CGPA", "Backlogs", "Risk"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", fontSize: "10px", fontWeight: "800", color: "#94a3b8", textAlign: "left", textTransform: "uppercase", letterSpacing: "1px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {getReportData().slice(0, 20).map((s, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(148, 163, 184, 0.08)", background: i % 2 === 0 ? "rgba(15, 23, 42, 0.3)" : "transparent" }}>
                      <td style={{ padding: "12px 16px", fontSize: "13px", fontWeight: "700", color: "#fff" }}>{s.name || "N/A"}</td>
                      <td style={{ padding: "12px 16px", fontSize: "12px", fontWeight: "700", color: "#94a3b8", fontFamily: "monospace" }}>{s.roll_number || "N/A"}</td>
                      <td style={{ padding: "12px 16px", fontSize: "12px", color: "#60a5fa", fontWeight: "700" }}>{s.Year ? `${s.Year}${getOrdinal(s.Year)}` : "N/A"}</td>
                      <td style={{ padding: "12px 16px", fontSize: "13px", color: s.attendance >= 75 ? "#10b981" : s.attendance >= 50 ? "#f59e0b" : "#ef4444", fontWeight: "700" }}>{s.attendance ? `${s.attendance}%` : "N/A"}</td>
                      <td style={{ padding: "12px 16px", fontSize: "13px", color: "#34d399", fontWeight: "800" }}>{s.cgpa || "N/A"}</td>
                      <td style={{ padding: "12px 16px", fontSize: "13px", color: s.backlogs > 2 ? "#ef4444" : s.backlogs > 0 ? "#f59e0b" : "#10b981", fontWeight: "700" }}>{s.backlogs !== undefined ? s.backlogs : "N/A"}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", background: s.risk_level === "High Risk" ? "rgba(239,68,68,0.15)" : s.risk_level === "Medium Risk" ? "rgba(245,158,11,0.15)" : "rgba(16,185,129,0.15)", color: s.risk_level === "High Risk" ? "#ef4444" : s.risk_level === "Medium Risk" ? "#f59e0b" : "#10b981" }}>
                          {s.risk_level?.replace(" Risk", "") || "N/A"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;