import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { UserPlus, Upload, X } from "lucide-react";

const Counselorspage = () => {
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [email, setEmail] = useState("");

  const [bulkFile, setBulkFile] = useState(null);

  useEffect(() => {
    fetchCounselors();
  }, []);

  const fetchCounselors = async () => {
    try {
      const adminId = localStorage.getItem("user_id");

      const res = await axios.get(
        `http://localhost:5000/admin/counselors/${adminId}`
      );

      setCounselors(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!email) return alert("Enter email");

    try {
      await axios.post("http://localhost:5000/admin/invite-counselor", {
        email: email,
      });

      alert("Invite sent successfully");
      setEmail("");
      setShowInviteModal(false);
    } catch (error) {
      console.error(error);
      alert("Error sending invite");
    }
  };

  const handleBulkInvite = async () => {
    if (!bulkFile) return alert("Upload a file");

    const formData = new FormData();
    formData.append("file", bulkFile);

    try {
      await axios.post(
        "http://localhost:5000/admin/bulk-invite",
        formData
      );

      alert("Bulk invites sent");
      setBulkFile(null);
    } catch (error) {
      console.error(error);
      alert("Bulk invite failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0b1120] to-[#111827] text-white">
      <Sidebar />

      <div className="flex-1 p-10 space-y-10">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent">
              Counselors
            </h1>
            <p className="text-gray-400 mt-2">
              Manage academic counselors
            </p>
          </div>

          <div className="flex gap-4">

            {/* Bulk Invite */}
            <div className="flex flex-col items-end">
              <label className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition cursor-pointer shadow-lg">
                <Upload size={18} />
                Bulk Invite
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  hidden
                  onChange={(e) =>
                    setBulkFile(e.target.files[0])
                  }
                />
              </label>

              {bulkFile && (
                <button
                  onClick={handleBulkInvite}
                  className="mt-2 text-sm text-indigo-400 hover:underline"
                >
                  Send Bulk Invites
                </button>
              )}
            </div>

            {/* Single Invite */}
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2 rounded-xl hover:scale-105 transition shadow-lg shadow-indigo-500/30"
            >
              <UserPlus size={18} />
              Invite Counselor
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-gray-400">Loading counselors...</p>
        ) : (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-gray-300 border-b border-white/10 bg-white/5 sticky top-0 backdrop-blur-lg">
                  <tr>
                    <th className="py-4 px-6">Name</th>
                    <th>Email</th>
                    <th>Branch</th>
                    <th>Phone</th>
                    <th>Employee ID</th>
                    <th>Joined</th>
                  </tr>
                </thead>

                <tbody>
                  {counselors.map((counselor) => (
                    <tr
                      key={counselor.id}
                      className="border-b border-white/5 hover:bg-white/5 transition duration-300"
                    >
                      <td className="py-4 px-6 font-semibold">
                        {counselor.name}
                      </td>
                      <td>{counselor.email}</td>
                      <td>{counselor.department}</td>
                      <td>{counselor.phone}</td>
                      <td>{counselor.employee_id}</td>
                      <td>{counselor.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-2xl w-96 shadow-2xl">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">
                Invite Counselor
              </h2>
              <X
                className="cursor-pointer hover:text-red-400 transition"
                onClick={() => setShowInviteModal(false)}
              />
            </div>

            <input
              type="email"
              placeholder="Enter counselor email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              onClick={handleInvite}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 py-3 rounded-xl font-semibold hover:scale-105 transition shadow-lg shadow-indigo-500/30"
            >
              Send Invite
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Counselorspage;