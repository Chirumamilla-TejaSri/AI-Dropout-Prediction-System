import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UploadCloud, X } from "lucide-react";

const Uploaddata = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (selectedFile) => {
    if (
      selectedFile &&
      (selectedFile.name.endsWith(".xlsx") ||
        selectedFile.name.endsWith(".csv"))
    ) {
      setFile(selectedFile);
    } else {
      alert("Please upload Excel or CSV file only");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFileChange(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/admin/upload",
        formData
      );

      localStorage.setItem(
        "predictions",
        JSON.stringify(res.data)
      );

      setLoading(false);
      navigate("/admin/predictions");

    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("Prediction failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#020617] text-white">
      
      <Sidebar />

      <div className="flex-1 p-12 flex items-center justify-center">

        <div className="w-full max-w-3xl space-y-10">

          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Upload Student Academic Data
            </h1>

            <p className="text-slate-400 text-lg">
              Upload Excel or CSV file to generate risk predictions
            </p>
          </div>

          {/* Upload Card */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="bg-white/5 backdrop-blur-2xl border border-dashed border-white/20 
                       rounded-3xl p-14 text-center shadow-2xl 
                       hover:bg-white/10 transition-all duration-300"
          >
            {!file ? (
              <>
                <UploadCloud
                  size={60}
                  className="mx-auto mb-6 text-indigo-400"
                />

                <p className="text-xl font-semibold mb-2">
                  Drag & Drop your file here
                </p>

                <p className="text-slate-400 mb-6">
                  or click to browse
                </p>

                <label className="cursor-pointer bg-gradient-to-r from-indigo-600 to-blue-600 
                                   px-8 py-3 rounded-xl shadow-lg 
                                   hover:scale-105 hover:shadow-indigo-500/40 
                                   transition duration-300">
                  Browse File
                  <input
                    type="file"
                    accept=".xlsx,.csv"
                    hidden
                    onChange={(e) =>
                      handleFileChange(e.target.files[0])
                    }
                  />
                </label>
              </>
            ) : (
              <div className="space-y-6">
                <p className="text-green-400 font-semibold text-lg">
                  {file.name}
                </p>

                <button
                  onClick={() => setFile(null)}
                  className="text-red-400 flex items-center gap-2 mx-auto 
                             hover:text-red-500 transition"
                >
                  <X size={18} />
                  Remove File
                </button>
              </div>
            )}
          </div>

          {/* Upload Button */}
          <div className="text-center">
            <button
              onClick={handleUpload}
              disabled={loading}
              className={`px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
  loading
    ? "bg-gray-600 cursor-not-allowed"
    : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:scale-105 hover:shadow-indigo-500/40 shadow-lg"
}`}
            >
              {loading ? "Processing..." : "Run Prediction"}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Uploaddata;