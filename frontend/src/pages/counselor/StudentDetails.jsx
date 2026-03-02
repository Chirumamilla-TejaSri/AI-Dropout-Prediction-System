import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const API = "http://localhost:5000";

export default function StudentDetails() {
  const { studentId } = useParams();
  const counselorId = localStorage.getItem("user_id");

  const [student, setStudent] = useState(null);
  const [notes, setNotes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    loadStudent();
    loadNotes();
    loadAssignments();
  }, []);

  const loadStudent = () => {
    axios
      .get(`${API}/counselor/students-with-risk/${counselorId}`)
      .then((res) => {
        const found = res.data.find(
          (s) => s.id === parseInt(studentId)
        );
        setStudent(found);
      });
  };

  const loadNotes = () => {
    axios
      .get(`${API}/counselor/notes/${counselorId}`)
      .then((res) => {
        const studentNotes = res.data.filter(
          (n) => n.student_id === parseInt(studentId)
        );
        setNotes(studentNotes);
      });
  };

  const loadAssignments = async () => {
    const res = await axios.get(
      `${API}/counselor/assignments/${counselorId}`
    );
    setAssignments(res.data);

    // Load submissions for each assignment
    const allSubs = [];

    for (let assignment of res.data) {
      const subRes = await axios.get(
        `${API}/counselor/assignments/${assignment.id}/submissions`
      );

      const studentSub = subRes.data.find(
        (s) => s.student_id === parseInt(studentId)
      );

      if (studentSub) {
        allSubs.push({
          ...studentSub,
          assignment_title: assignment.title
        });
      }
    }

    setSubmissions(allSubs);
  };

  const addNote = async () => {
    if (!newNote) return;

    await axios.post(`${API}/counselor/notes/add`, {
      counselor_id: counselorId,
      student_id: studentId,
      note_type: "academic",
      content: newNote
    });

    setNewNote("");
    loadNotes();
  };

  const reviewSubmission = async (id, status) => {
    await axios.post(
      `${API}/counselor/submissions/review/${id}`,
      { status }
    );
    loadAssignments();
  };

  if (!student) return <p>Loading...</p>;

  return (
    <div className="space-y-10">

      <h1 className="text-3xl font-bold">{student.name}</h1>

      {/* Academic Summary */}
      <div className="grid grid-cols-3 gap-6">
        <Card label="Roll No" value={student.roll_no} />
        <Card label="Semester" value={student.semester} />
        <Card label="Risk Level" value={student.risk_level} />
        <Card label="CGPA" value={student.cgpa || "N/A"} />
        <Card label="Attendance" value={student.attendance || "N/A"} />
        <Card label="Backlogs" value={student.backlogs || 0} />
      </div>

      {/* Counseling Notes */}
      <Section title="Counseling Notes">
        {notes.map((n) => (
          <NoteCard key={n.id} note={n} />
        ))}

        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write counseling note..."
          className="w-full bg-white/10 p-3 rounded-lg border border-white/20 mt-4"
        />
        <button
          onClick={addNote}
          className="mt-3 bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Add Note
        </button>
      </Section>

      {/* Assignments Section */}
      <Section title="Assignments & Submissions">

        {submissions.length === 0 && (
          <p className="text-slate-400">
            No submissions yet
          </p>
        )}

        {submissions.map((sub) => (
          <div
            key={sub.id}
            className="bg-white/10 p-4 rounded-xl flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">
                {sub.assignment_title}
              </p>
              <p className="text-sm text-slate-400">
                Status: {sub.status}
              </p>
            </div>

            {sub.status !== "approved" && (
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    reviewSubmission(sub.id, "approved")
                  }
                  className="bg-green-600 px-3 py-1 rounded"
                >
                  Approve
                </button>

                <button
                  onClick={() =>
                    reviewSubmission(sub.id, "needs_correction")
                  }
                  className="bg-yellow-600 px-3 py-1 rounded"
                >
                  Needs Correction
                </button>
              </div>
            )}
          </div>
        ))}

      </Section>

    </div>
  );
}

function Card({ label, value }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
      <p className="text-slate-400 text-sm">{label}</p>
      <h2 className="text-xl font-bold mt-2">{value}</h2>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function NoteCard({ note }) {
  return (
    <div className="bg-white/10 p-4 rounded-xl">
      <p>{note.content}</p>
      <p className="text-xs text-slate-400 mt-2">
        {note.date}
      </p>
    </div>
  );
}