// styles.js - All shared styles for EduPredict AI Platform

export const COLORS = {
  High: "#ef4444",
  Medium: "#f59e0b",
  Low: "#10b981"
};

export const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    background: "#0f172a",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    position: "relative",
    overflow: "hidden"
  },
  persistenceIndicator: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    background: "rgba(16, 185, 129, 0.1)",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    borderRadius: "12px",
    marginBottom: "20px",
    fontSize: "12px",
    color: "#34d399",
    fontWeight: "600",
    position: "relative",
    zIndex: 1
  },
  persistenceDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#10b981",
    boxShadow: "0 0 10px rgba(16, 185, 129, 0.6)"
  },
  existingDataNotice: {
    marginTop: "24px",
    padding: "16px 20px",
    background: "rgba(16, 185, 129, 0.1)",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    borderRadius: "12px",
    display: "flex",
    gap: "14px",
    alignItems: "flex-start"
  },
  noticeTitle: { fontSize: "14px", fontWeight: "700", color: "#34d399", marginBottom: "4px" },
  noticeText: { fontSize: "13px", color: "#94a3b8", fontWeight: "600" },
  navBadge: {
    padding: "2px 8px",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "#fff",
    borderRadius: "10px",
    fontSize: "11px",
    fontWeight: "800",
    marginLeft: "auto",
    boxShadow: "0 2px 8px rgba(59, 130, 246, 0.4)"
  },
  sidebar: {
    width: "280px",
    background: "rgba(15, 23, 42, 0.95)",
    backdropFilter: "blur(40px)",
    padding: "28px 0",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid rgba(148, 163, 184, 0.1)",
    boxShadow: "8px 0 32px rgba(0,0,0,0.3)",
    position: "relative",
    zIndex: 10
  },
  sidebarGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "300px",
    background: "radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
    pointerEvents: "none"
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "0 24px",
    marginBottom: "40px"
  },
  logoIcon: {
    width: "44px",
    height: "44px",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 24px rgba(59, 130, 246, 0.4)"
  },
  logoText: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#fff",
    letterSpacing: "-0.5px",
    display: "block"
  },
  logoSubtext: {
    fontSize: "10px",
    fontWeight: "600",
    color: "#64748b",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    display: "block",
    marginTop: "2px"
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    padding: "0 18px",
    flex: 1
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "14px 18px",
    color: "#94a3b8",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    fontSize: "14px",
    fontWeight: "600",
    position: "relative",
    userSelect: "none"
  },
  navItemActive: {
    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 100%)",
    color: "#fff",
    boxShadow: "0 4px 16px rgba(59, 130, 246, 0.2)"
  },
  navItemHover: {
    background: "rgba(51, 65, 85, 0.4)",
    color: "#e2e8f0",
    transform: "translateX(3px)"
  },
  navItemGlow: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%)",
    borderRadius: "12px",
    pointerEvents: "none"
  },
  navIcon: { display: "flex", flexShrink: 0 },
  navLabel: { flex: 1 },
  activeIndicator: {
    width: "3px",
    height: "24px",
    background: "linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)",
    borderRadius: "2px 0 0 2px",
    position: "absolute",
    right: "0",
    boxShadow: "0 0 14px rgba(59, 130, 246, 0.8)"
  },
  main: {
    flex: 1,
    padding: "28px",
    overflowY: "auto",
    background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    position: "relative"
  },
  mainGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "600px",
    background: "radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
    pointerEvents: "none"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
    background: "rgba(30, 41, 59, 0.6)",
    backdropFilter: "blur(20px)",
    padding: "20px 28px",
    borderRadius: "18px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    position: "relative",
    zIndex: 1
  },
  headerLeft: { display: "flex", alignItems: "center", gap: "18px" },
  title: {
    fontSize: "32px",
    fontWeight: "800",
    background: "linear-gradient(135deg, #fff 0%, #cbd5e1 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: 0,
    letterSpacing: "-1px",
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  titleBadge: {
    fontSize: "11px",
    fontWeight: "700",
    padding: "4px 10px",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "#fff",
    borderRadius: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    WebkitBackgroundClip: "initial",
    WebkitTextFillColor: "initial",
    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)"
  },
  subtitle: {
    fontSize: "14px",
    color: "#94a3b8",
    margin: "6px 0 0 0",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  userSection: { display: "flex", alignItems: "center", gap: "14px" },
  notificationBtn: {
    position: "relative",
    background: "rgba(30, 41, 59, 0.8)",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    borderRadius: "12px",
    width: "44px",
    height: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.3s",
    color: "#cbd5e1"
  },
  notificationBadge: {
    position: "absolute",
    top: "7px",
    right: "7px",
    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    color: "#fff",
    fontSize: "10px",
    minWidth: "18px",
    height: "18px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    border: "2px solid rgba(30, 41, 59, 0.8)",
    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.5)"
  },
  avatarSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "8px 16px 8px 8px",
    background: "rgba(30, 41, 59, 0.8)",
    borderRadius: "12px",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    cursor: "pointer",
    transition: "all 0.3s"
  },
  avatar: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "15px",
    boxShadow: "0 8px 24px rgba(59, 130, 246, 0.4)",
    position: "relative"
  },
  userInfo: { display: "flex", flexDirection: "column", gap: "3px" },
  userName: { fontSize: "14px", fontWeight: "700", color: "#fff", lineHeight: 1 },
  userRole: { fontSize: "11px", color: "#64748b", lineHeight: 1, fontWeight: "600" },
  uploadSection: { position: "relative", zIndex: 1 },
  uploadBox: {
    background: "rgba(30, 41, 59, 0.6)",
    backdropFilter: "blur(20px)",
    border: "3px dashed rgba(148, 163, 184, 0.3)",
    borderRadius: "20px",
    padding: "70px 50px",
    textAlign: "center",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    position: "relative",
    overflow: "hidden"
  },
  uploadBoxActive: {
    borderColor: "rgba(59, 130, 246, 0.6)",
    background: "rgba(37, 99, 235, 0.1)",
    boxShadow: "0 12px 48px rgba(59, 130, 246, 0.3)",
    transform: "scale(1.01)"
  },
  uploadIconWrapper: {
    display: "inline-flex",
    padding: "28px",
    background: "rgba(37, 99, 235, 0.1)",
    borderRadius: "20px",
    marginBottom: "24px",
    position: "relative"
  },
  uploadTitle: {
    fontSize: "26px",
    fontWeight: "800",
    color: "#fff",
    margin: "14px 0 10px 0",
    letterSpacing: "-0.5px"
  },
  uploadSubtitle: {
    fontSize: "15px",
    color: "#94a3b8",
    margin: "0 0 32px 0",
    fontWeight: "600"
  },
  browseButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    padding: "16px 32px",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "#fff",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    border: "none",
    transition: "all 0.3s",
    boxShadow: "0 8px 24px rgba(59, 130, 246, 0.4)",
    position: "relative",
    overflow: "hidden"
  },
  fileInfo: {
    marginTop: "32px",
    padding: "20px",
    background: "rgba(15, 23, 42, 0.6)",
    borderRadius: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid rgba(148, 163, 184, 0.2)"
  },
  fileDetails: { display: "flex", alignItems: "center", gap: "14px" },
  fileIconWrapper: {
    width: "52px",
    height: "52px",
    borderRadius: "12px",
    background: "rgba(37, 99, 235, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(59, 130, 246, 0.3)"
  },
  fileName: { fontSize: "15px", fontWeight: "700", color: "#fff", marginBottom: "4px" },
  fileSize: { fontSize: "13px", color: "#94a3b8", fontWeight: "600" },
  uploadButton: {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    transition: "all 0.3s",
    boxShadow: "0 6px 20px rgba(16, 185, 129, 0.4)"
  },
  clearButton: {
    padding: "12px 20px",
    background: "rgba(239, 68, 68, 0.1)",
    color: "#ef4444",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "10px",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    transition: "all 0.3s"
  },
  spinner: { animation: "spin 1s linear infinite" },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 40px",
    background: "rgba(30, 41, 59, 0.6)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    border: "1px solid rgba(148, 163, 184, 0.1)",
    position: "relative",
    zIndex: 1
  },
  emptyStateTitle: { fontSize: "24px", fontWeight: "800", color: "#fff", marginBottom: "12px" },
  emptyStateText: { fontSize: "15px", color: "#94a3b8", marginBottom: "32px", fontWeight: "600" },
  emptyStateButton: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 28px",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 8px 24px rgba(59, 130, 246, 0.4)",
    transition: "all 0.3s"
  },
  cardRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    marginBottom: "32px",
    position: "relative",
    zIndex: 1
  },
  summaryCard: {
    padding: "24px",
    borderRadius: "18px",
    position: "relative",
    overflow: "hidden",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    border: "1px solid rgba(255,255,255,0.1)"
  },
  cardContent: { position: "relative", zIndex: 1 },
  cardIconWrapper: {
    display: "inline-flex",
    padding: "12px",
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(10px)",
    borderRadius: "14px",
    marginBottom: "14px",
    color: "#fff",
    boxShadow: "0 6px 20px rgba(0,0,0,0.2)"
  },
  cardTitle: {
    fontSize: "13px",
    fontWeight: "700",
    margin: "0 0 14px 0",
    color: "#fff",
    opacity: 0.95,
    letterSpacing: "0.5px",
    textTransform: "uppercase"
  },
  cardCount: {
    fontSize: "48px",
    fontWeight: "900",
    margin: "0 0 10px 0",
    color: "#fff",
    lineHeight: 1,
    textShadow: "0 4px 16px rgba(0,0,0,0.3)",
    letterSpacing: "-1.5px",
    transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
  },
  cardStats: { display: "flex", alignItems: "baseline", gap: "10px" },
  cardPercentage: { fontSize: "22px", fontWeight: "800", color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,0.2)" },
  cardTotal: { fontSize: "13px", color: "rgba(255,255,255,0.85)", fontWeight: "600" },
  chartRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1.5fr",
    gap: "20px",
    marginBottom: "32px",
    position: "relative",
    zIndex: 1
  },
  chartBox: {
    background: "rgba(30, 41, 59, 0.6)",
    backdropFilter: "blur(20px)",
    padding: "28px",
    borderRadius: "18px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    border: "1px solid rgba(148, 163, 184, 0.1)"
  },
  chartHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },
  chartTitle: { fontSize: "18px", fontWeight: "800", color: "#fff", margin: 0, letterSpacing: "-0.3px" },
  chartBadge: {
    padding: "5px 12px",
    background: "rgba(59, 130, 246, 0.15)",
    color: "#60a5fa",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    border: "1px solid rgba(59, 130, 246, 0.3)"
  },
  legend: {
    display: "flex",
    justifyContent: "center",
    gap: "28px",
    marginTop: "20px",
    flexWrap: "wrap"
  },
  legendItem: { display: "flex", alignItems: "center", gap: "10px" },
  legendDot: { width: "14px", height: "14px", borderRadius: "50%", flexShrink: 0 },
  legendLabel: { fontSize: "13px", color: "#cbd5e1", fontWeight: "600" },
  legendStats: { fontSize: "11px", color: "#64748b", fontWeight: "700" },
  trendSection: { marginBottom: "32px", position: "relative", zIndex: 1 },
  tableSection: {
    background: "rgba(30, 41, 59, 0.6)",
    backdropFilter: "blur(20px)",
    borderRadius: "18px",
    padding: "28px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    border: "1px solid rgba(148, 163, 184, 0.1)",
    position: "relative",
    zIndex: 1
  },
  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "24px"
  },
  tableTitle: { fontSize: "20px", fontWeight: "800", color: "#fff", margin: "0 0 5px 0", letterSpacing: "-0.3px" },
  tableSubtitle: { fontSize: "13px", color: "#94a3b8", fontWeight: "600", margin: 0 },
  tableControls: { display: "flex", gap: "12px", position: "relative" },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 16px",
    background: "rgba(15, 23, 42, 0.6)",
    borderRadius: "12px",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    minWidth: "280px"
  },
  searchInput: { border: "none", background: "transparent", outline: "none", fontSize: "13px", flex: 1, color: "#fff", fontWeight: "600" },
  filterSelect: {
    padding: "10px 16px",
    background: "rgba(15, 23, 42, 0.6)",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    borderRadius: "12px",
    fontSize: "13px",
    cursor: "pointer",
    outline: "none",
    fontWeight: "700",
    color: "#cbd5e1"
  },
  exportContainer: { position: "relative" },
  downloadBtn: {
    padding: "10px 20px",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    fontWeight: "700",
    boxShadow: "0 4px 16px rgba(59, 130, 246, 0.4)",
    transition: "all 0.3s"
  },
  exportMenu: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    background: "rgba(15, 23, 42, 0.98)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    borderRadius: "12px",
    boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
    zIndex: 100,
    minWidth: "200px",
    overflow: "hidden"
  },
  exportMenuItem: {
    width: "100%",
    padding: "14px 18px",
    background: "transparent",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "13px",
    fontWeight: "600",
    transition: "all 0.2s",
    textAlign: "left",
    borderBottom: "1px solid rgba(148, 163, 184, 0.1)"
  },
  exportMenuTitle: { fontSize: "13px", fontWeight: "700", color: "#fff", marginBottom: "2px" },
  exportMenuDesc: { fontSize: "11px", color: "#94a3b8", fontWeight: "600" },
  clearDataBtn: {
    padding: "10px 20px",
    background: "rgba(239, 68, 68, 0.1)",
    color: "#ef4444",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    fontWeight: "700"
  },
  tableWrapper: { overflowX: "auto", borderRadius: "14px", border: "1px solid rgba(148, 163, 184, 0.1)" },
  table: { width: "100%", borderCollapse: "collapse" },
  tableHeadRow: {
    background: "rgba(15, 23, 42, 0.6)",
    backdropFilter: "blur(10px)",
    borderBottom: "2px solid rgba(148, 163, 184, 0.2)"
  },
  th: { textAlign: "left", padding: "16px 20px", fontSize: "10px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" },
  tableRow: { borderBottom: "1px solid rgba(148, 163, 184, 0.1)", transition: "all 0.3s", background: "rgba(15, 23, 42, 0.3)" },
  tableRowHover: { background: "rgba(30, 41, 59, 0.6)", transform: "scale(1.005)" },
  td: { padding: "16px 20px", fontSize: "13px", color: "#fff", fontWeight: "600" },
  tdGray: { padding: "16px 20px", fontSize: "13px", color: "#cbd5e1", fontWeight: "600" },
  studentName: { display: "flex", alignItems: "center", gap: "12px", fontWeight: "700" },
  studentAvatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "15px",
    fontWeight: "800",
    flexShrink: 0,
    boxShadow: "0 4px 12px rgba(139, 92, 246, 0.4)"
  },
  rollNumber: { fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", fontWeight: "700" },
  yearBadge: {
    padding: "5px 10px",
    background: "rgba(59, 130, 246, 0.1)",
    color: "#60a5fa",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "700",
    border: "1px solid rgba(59, 130, 246, 0.3)"
  },
  attendanceCell: { display: "flex", flexDirection: "column", gap: "6px" },
  attendanceText: { fontWeight: "700", fontSize: "13px" },
  attendanceBarWrapper: { width: "100%", height: "5px", background: "rgba(15, 23, 42, 0.6)", borderRadius: "3px", overflow: "hidden" },
  attendanceBar: { height: "100%", borderRadius: "3px", transition: "all 0.4s" },
  cgpaBadge: {
    padding: "5px 12px",
    background: "rgba(16, 185, 129, 0.1)",
    color: "#34d399",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "800",
    border: "1px solid rgba(16, 185, 129, 0.3)"
  },
  noData: { padding: "60px", textAlign: "center" },
  noDataContent: { display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" },
  noDataText: { fontSize: "17px", fontWeight: "700", color: "#cbd5e1" },
  noDataSubtext: { fontSize: "13px", color: "#64748b", fontWeight: "600" },
  pagination: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "24px",
    padding: "18px 0 0 0",
    borderTop: "1px solid rgba(148, 163, 184, 0.1)"
  },
  paginationBtn: {
    padding: "8px 18px",
    background: "rgba(59, 130, 246, 0.1)",
    border: "1px solid rgba(59, 130, 246, 0.3)",
    borderRadius: "10px",
    color: "#60a5fa",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer"
  },
  paginationInfo: { fontSize: "13px", color: "#94a3b8", fontWeight: "600" }
};

export const getRiskBadgeStyle = (risk) => {
  const baseStyle = {
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px"
  };
  if (risk === "High Risk") return { ...baseStyle, background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)", color: "#dc2626", border: "1px solid #fca5a5" };
  if (risk === "Medium Risk") return { ...baseStyle, background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)", color: "#d97706", border: "1px solid #fcd34d" };
  return { ...baseStyle, background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)", color: "#059669", border: "1px solid #6ee7b7" };
};

export const getBacklogStyle = (count) => {
  const baseStyle = { padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "700" };
  if (count === 0) return { ...baseStyle, background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)", color: "#059669" };
  if (count <= 2) return { ...baseStyle, background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)", color: "#d97706" };
  return { ...baseStyle, background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)", color: "#dc2626" };
};

export const getOrdinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
};

export const STORAGE_KEYS = {
  DATA: 'edupredict_student_data',
  ACTIVE_NAV: 'edupredict_active_nav',
  SEARCH_TERM: 'edupredict_search_term',
  FILTER_RISK: 'edupredict_filter_risk'
};