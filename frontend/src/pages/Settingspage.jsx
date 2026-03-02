import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

const Settingspage = () => {
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const clearPredictions = () => {
    localStorage.removeItem("predictions");
    alert("Stored predictions cleared");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0b1120] to-[#111827] text-white">
      <Sidebar />

      <div className="flex-1 p-10 space-y-12">

        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-gray-400 mt-2">
            Manage system preferences and configurations
          </p>
        </div>

        {/* Profile Section */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6 shadow-xl">
          <h2 className="text-2xl font-semibold">
            Admin Profile
          </h2>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="text-gray-400 text-sm">
                Full Name
              </label>
              <input
                type="text"
                defaultValue="Admin User"
                className="w-full mt-2 p-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm">
                Email
              </label>
              <input
                type="email"
                value="tejasrichirumamilla@gmail.com"
                readOnly
                className="w-full mt-2 p-3 rounded-xl bg-white/10 border border-white/20 text-gray-400"
              />
            </div>
          </div>

          <button className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition shadow-lg shadow-indigo-500/30">
            Save Changes
          </button>
        </div>

        {/* Preferences Section */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-8 shadow-xl">
          <h2 className="text-2xl font-semibold">
            System Preferences
          </h2>

          <Toggle
            label="Email Notifications"
            enabled={notifications}
            setEnabled={setNotifications}
          />

          <Toggle
            label="Auto Save Predictions"
            enabled={autoSave}
            setEnabled={setAutoSave}
          />

          <Toggle
            label="Dark Mode"
            enabled={darkMode}
            setEnabled={setDarkMode}
          />
        </div>

        {/* Storage Section (Clean Version of Danger Zone) */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6 shadow-xl">
          <h2 className="text-2xl font-semibold">
            Storage Management
          </h2>

          <p className="text-gray-400 text-sm">
            Clear locally stored prediction data if needed.
          </p>

          <button
            onClick={clearPredictions}
            className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-3 rounded-xl hover:scale-105 transition shadow-lg"
          >
            Clear Stored Predictions
          </button>
        </div>

      </div>
    </div>
  );
};

const Toggle = ({ label, enabled, setEnabled }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-lg">{label}</span>

      <button
        onClick={() => setEnabled(!enabled)}
        className={`w-14 h-7 flex items-center rounded-full p-1 transition duration-300 ${
          enabled
            ? "bg-gradient-to-r from-indigo-600 to-blue-600"
            : "bg-gray-600"
        }`}
      >
        <div
          className={`bg-white w-5 h-5 rounded-full shadow-md transform transition duration-300 ${
            enabled ? "translate-x-7" : ""
          }`}
        />
      </button>
    </div>
  );
};

export default Settingspage;