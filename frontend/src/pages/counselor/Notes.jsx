import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

export default function Notes() {
  const counselorId = localStorage.getItem("user_id");

  const [students, setStudents] = useState([]);
  const [notes, setNotes] = useState([]);

  const [selectedStudent, setSelectedStudent] = useState("");
  const [noteType, setNoteType] = useState("Academic");
  const [content, setContent] = useState("");

  useEffect(() => {
    loadStudents();
    loadNotes();
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

  const loadNotes = async () => {
    const res = await axios.get(
      `${API}/counselor/notes/${counselorId}`
    );
    setNotes(res.data);
  };

  const addNote = async () => {
    if (!selectedStudent || !content) {
      alert("Please select student and enter note");
      return;
    }

    await axios.post(`${API}/counselor/notes/add`, {
      counselor_id: counselorId,
      student_id: selectedStudent,
      note_type: noteType,
      content: content
    });

    setContent("");
    setSelectedStudent("");
    setNoteType("Academic");
    loadNotes();
  };

  const badgeColor = (type) => {
    switch (type) {
      case "Academic":
        return "bg-blue-600";
      case "Career":
        return "bg-purple-600";
      case "Warning":
        return "bg-red-600";
      case "Personal":
        return "bg-green-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="space-y-14">

      <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
        Counseling Notes
      </h1>

      {/* Add Note Card */}
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-8 space-y-6">

        <div className="grid grid-cols-2 gap-6">

          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="bg-white/10 text-white p-4 rounded-xl border border-white/20 focus:outline-none"
          >
            <option value="" className="text-black">
              Select Student
            </option>
            {students.map((s) => (
              <option
                key={s.id}
                value={s.id}
                className="text-black"
              >
                {s.name} ({s.roll_no})
              </option>
            ))}
          </select>

          <select
            value={noteType}
            onChange={(e) => setNoteType(e.target.value)}
            className="bg-white/10 text-white p-4 rounded-xl border border-white/20 focus:outline-none"
          >
            <option className="text-black">Academic</option>
            <option className="text-black">Career</option>
            <option className="text-black">Personal</option>
            <option className="text-black">Warning</option>
          </select>
        </div>

        <textarea
          placeholder="Write counseling note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-white/10 p-4 rounded-xl border border-white/20 min-h-[140px] focus:outline-none"
        />

        <button
          onClick={addNote}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 py-3 rounded-xl font-semibold hover:scale-[1.02] transition duration-300 shadow-lg"
        >
          ➕ Save Note
        </button>
      </div>

      {/* Notes Timeline */}
      <div className="space-y-6">

        {notes.length === 0 && (
          <p className="text-slate-400">
            No notes added yet
          </p>
        )}

        {notes.map((n) => (
          <div
            key={n.id}
            className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 hover:scale-[1.01] transition duration-300"
          >
            <div className="flex justify-between items-center mb-3">
              <span
                className={`px-3 py-1 rounded-full text-sm ${badgeColor(
                  n.note_type
                )}`}
              >
                {n.note_type}
              </span>

              <span className="text-sm text-slate-400">
                {n.date}
              </span>
            </div>

            {/* Original Note */}
            <p className="text-slate-200 mb-4">
              {n.content}
            </p>

            {/* 🔥 Replies Section Added */}
            {n.replies && n.replies.length > 0 && (
              <div className="space-y-3 ml-4 border-l border-white/10 pl-4">
                {n.replies.map((r, idx) => (
                  <div
                    key={idx}
                    className="bg-white/10 p-3 rounded-xl"
                  >
                    <p className="text-xs text-indigo-300 mb-1">
                      {r.sender_role === "student"
                        ? "Student Reply"
                        : "Your Reply"}
                    </p>

                    <p className="text-sm text-slate-200">
                      {r.message}
                    </p>

                    {r.file_url && (
                      <a
                        href={`${API}${r.file_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 underline text-xs"
                      >
                        📎 View Attachment
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>
        ))}

      </div>

    </div>
  );
}