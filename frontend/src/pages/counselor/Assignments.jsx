import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

export default function Assignments() {
  const counselorId = localStorage.getItem("user_id");

  // Create form states
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [file, setFile] = useState(null);

  // Assignment display states
  const [assignments, setAssignments] = useState([]);
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  // NEW: show only 5 toggle
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    loadStudents();
    loadAssignments();
  }, []);

  const loadStudents = async () => {
    const res = await axios.get(
      `${API}/counselor/students-with-risk/${counselorId}`
    );
    const approved = res.data.filter(
      (s) => s.status === "approved"
    );
    setStudents(approved);
  };

  const loadAssignments = async () => {
    const res = await axios.get(
      `${API}/counselor/assignments/${counselorId}`
    );
    setAssignments(res.data);
  };

  const openSubmissions = async (assignmentId) => {
    const res = await axios.get(
      `${API}/counselor/assignments/${assignmentId}/submissions`
    );
    setSubmissions(res.data);
    setActiveAssignment(assignmentId);
  };

  const handleCheckbox = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
    );
  };

  const createAssignment = async () => {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("deadline", deadline);
    formData.append("counselor_id", counselorId);

    if (file) {
      formData.append("file", file);
    }

    selectedStudents.forEach((id) =>
      formData.append("student_ids", id)
    );

    await axios.post(
      `${API}/counselor/assignments/create`,
      formData
    );

    alert("Assignment Created Successfully 🚀");

    setTitle("");
    setDescription("");
    setDeadline("");
    setFile(null);
    setSelectedStudents([]);

    loadAssignments();
  };

  const deleteAssignment = async (id) => {
    await axios.delete(
      `${API}/counselor/assignments/delete/${id}`
    );
    loadAssignments();
  };

  return (
    <div className="space-y-14">

      {/* CREATE ASSIGNMENT */}
      <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
        Create Assignment
      </h1>

      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-8 space-y-6">

        <input
          placeholder="Assignment Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-white/10 p-4 rounded-xl border border-white/20"
        />

        <textarea
          placeholder="Assignment Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-white/10 p-4 rounded-xl border border-white/20 min-h-[120px]"
        />

        <div className="grid grid-cols-2 gap-6">
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="bg-white/10 p-3 rounded-xl border border-white/20"
          />

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="bg-white/10 p-3 rounded-xl border border-white/20"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {students.map((s) => (
            <div
              key={s.id}
              className={`p-4 rounded-xl border cursor-pointer ${
                selectedStudents.includes(s.id)
                  ? "bg-indigo-600/30 border-indigo-500"
                  : "bg-white/5 border-white/10"
              }`}
              onClick={() => handleCheckbox(s.id)}
            >
              <p>{s.name}</p>
              <p className="text-xs text-slate-400">
                {s.roll_no}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={createAssignment}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 py-3 rounded-xl"
        >
          🚀 Create Assignment
        </button>
      </div>

      {/* ASSIGNMENT LIST */}
      <h2 className="text-2xl font-bold">
        Created Assignments
      </h2>

      <div className="space-y-6">
        {(showAll ? assignments : assignments.slice(0, 5)).map((a) => (
          <div
            key={a.id}
            className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 flex justify-between items-center"
          >
            <div>
              <p className="text-lg font-semibold">
                {a.title}
              </p>
              <p className="text-slate-400 text-sm">
                Deadline: {a.deadline}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => openSubmissions(a.id)}
                className="bg-indigo-600 px-4 py-2 rounded-xl"
              >
                View
              </button>

              <button
                onClick={() => deleteAssignment(a.id)}
                className="bg-red-500/20 border border-red-500/40 text-red-400 px-4 py-2 rounded-xl hover:bg-red-500/40 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {assignments.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-indigo-400 hover:underline mt-4"
        >
          {showAll ? "Show Less" : "View All"}
        </button>
      )}

    </div>
  );
}