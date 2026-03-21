import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

export default function Approvals() {
  const counselorId = localStorage.getItem("user_id");
  const [students, setStudents] = useState([]);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  const openRejectDialog = (studentId) => {
    setRejectingId(studentId);
    setRejectReason("");
  };

  const closeRejectDialog = () => {
    setRejectingId(null);
    setRejectReason("");
    setSubmitting(false);
  };

  const rejectStudent = async () => {
    const reason = rejectReason.trim();

    if (!reason) {
      alert("Please enter a reason for rejection");
      return;
    }

    setSubmitting(true);

    try {
      await axios.post(
        `${API}/counselor/reject/${counselorId}/${rejectingId}`,
        { reason }
      );
      closeRejectDialog();
      loadStudents();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to reject student");
      setSubmitting(false);
    }
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
              onClick={() => openRejectDialog(s.id)}
              className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Reject
            </button>
          </div>
        </div>
      ))}

      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-white">
              Reject Student
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Enter the reason for rejection. This will be shown when the student tries to sign in with Google.
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={5}
              placeholder="Enter rejection reason"
              className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white outline-none placeholder:text-slate-500"
            />

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={closeRejectDialog}
                disabled={submitting}
                className="rounded-lg border border-white/10 px-4 py-2 text-slate-300 hover:bg-white/5 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={rejectStudent}
                disabled={submitting}
                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {submitting ? "Rejecting..." : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
