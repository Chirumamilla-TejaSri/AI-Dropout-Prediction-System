const API_BASE = "http://localhost:5000";

export const googleAuthLogin = async ({ credential, role }) => {
  const res = await fetch(`${API_BASE}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential, role }), // ✅ role included
  });

  return res.json();
};
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

export const getAdminDashboardStats = () =>
  API.get("/admin/dashboard-stats");