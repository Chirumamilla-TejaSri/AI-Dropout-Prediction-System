import React from "react";
import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPage from "./pages/ForgotPage";

import AdminDashboard from "./pages/AdminDashboard";
import CounselorDashboard from "./pages/CounselorDashboard";
import StudentDashboard from "./pages/StudentDashboard";

import Reportspage from "./pages/Reportspage";
import Counselorspage from "./pages/Counselorspage";
import Settingspage from "./pages/Settingspage";
import Uploaddata from "./pages/Uploaddata";
import Predictionspage from "./pages/Predictionspage";


import CounselorOnboard from "./pages/CounselorOnboard";
import StudentPreOnboard from "./pages/StudentPreOnboard";
import StudentOnboard from "./pages/StudentOnboard";

import CounselorLayout from "./components/CounselorLayout";
import Dashboard from "./pages/counselor/Dashboard";
import MyStudents from "./pages/counselor/MyStudents";
import Approvals from "./pages/counselor/Approvals";
import Assignments from "./pages/counselor/Assignments";
import Notes from "./pages/counselor/Notes";
import Reports from "./pages/counselor/Reports";
import Settings from "./pages/counselor/Settings";
import StudentDetails from "./pages/counselor/StudentDetails";


function App() {
  return (
    <Routes>

      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/forgot" element={<ForgotPage />} />

      {/* Dashboards */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/student" element={<StudentDashboard />} />
      
      {/* Admin Panel Pages */}
      <Route path="/admin/upload" element={<Uploaddata />} />
      <Route path="/admin/predictions" element={<Predictionspage />} />
      <Route path="/admin/counselors" element={<Counselorspage />} />
      <Route path="/admin/reports" element={<Reportspage />} />
      <Route path="/admin/settings" element={<Settingspage />} />

      {/* Onboarding */}
      <Route path="/onboard/counselor/:token" element={<CounselorOnboard />} />
      <Route path="/student-onboard" element={<StudentPreOnboard />} />
      <Route path="/onboard/student/:token" element={<StudentOnboard />} />
      <Route path="/counselor" element={<CounselorLayout />}>


      <Route path="dashboard" element={<Dashboard />} />
      <Route path="students" element={<MyStudents />} />
      <Route path="approvals" element={<Approvals />} />
      <Route path="assignments" element={<Assignments />} />
      <Route path="notes" element={<Notes />} />
      <Route path="reports" element={<Reports />} />
      <Route path="settings" element={<Settings />} />
      <Route path="student/:studentId" element={<StudentDetails />} />
    </Route>

    </Routes>
    
  );
}

export default App;