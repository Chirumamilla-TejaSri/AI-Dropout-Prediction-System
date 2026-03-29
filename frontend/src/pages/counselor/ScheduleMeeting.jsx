
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ScheduleMeeting() {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const [form, setForm] = useState({
    date: "",
    time: "",
    meeting_link: ""
  });

  // fetch students
  useEffect(() => {
    const counselorId = localStorage.getItem("user_id");

    axios
      .get(`http://localhost:5000/counselor/students-with-risk/${counselorId}`)
      .then(res => setStudents(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (id) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter(s => s !== id));
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
  };

  const handleSubmit = async () => {
    if (selectedStudents.length === 0) {
      alert("Select at least one student");
      return;
    }

    if (!form.date || !form.time || !form.meeting_link) {
      alert("Fill all fields");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/schedule_meeting",
        {
          student_ids: selectedStudents,
          ...form
        }
      );

      alert("Emails sent successfully 🎉");

      // reset form
      setSelectedStudents([]);
      setForm({
        date: "",
        time: "",
        meeting_link: ""
      });

    } catch (err) {
      alert(err.response?.data?.error || "Error sending emails");
    }
  };

  return (
    <div className="p-8 text-white">

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-6">
        Schedule Counseling Session
      </h1>

      {/* CARD */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 
                      rounded-3xl p-8 shadow-xl space-y-6 max-w-2xl">

        {/* STUDENTS */}
        <div>
          <h2 className="text-lg font-semibold mb-3">
            Select Students
          </h2>

          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {students.length === 0 && (
              <p className="text-slate-400">No students found</p>
            )}

            {students.map((s) => (
              <label
                key={s.id}
                className="flex items-center gap-3 bg-white/5 px-4 py-3 rounded-xl 
                           border border-white/10 hover:bg-white/10 transition cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(s.id)}
                  onChange={() => handleCheckbox(s.id)}
                  className="accent-indigo-500"
                />
                <span>{s.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* DATE + TIME */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="p-3 rounded-xl bg-white/5 border border-white/10 
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            className="p-3 rounded-xl bg-white/5 border border-white/10 
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* MEETING LINK */}
        <input
          name="meeting_link"
          value={form.meeting_link}
          placeholder="Paste Meeting Link (Google Meet / Zoom)"
          onChange={handleChange}
          className="w-full p-3 rounded-xl bg-white/5 border border-white/10 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 
                     transition font-semibold shadow-lg shadow-indigo-500/30"
        >
          Schedule & Send 🚀
        </button>

      </div>
    </div>
  );
}