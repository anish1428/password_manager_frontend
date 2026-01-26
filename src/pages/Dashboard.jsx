import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import SectionList from "../components/SectionList";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { logout, token } = useAuth();
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/sections");
      setSections(res.data);
    } catch (error) {
      console.error("Failed to load sections:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="layout">
      <motion.div
        className="left"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          style={{
            background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
            padding: "30px",
            borderRadius: "20px",
            border: "1px solid #475569",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
            marginBottom: "20px",
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.h2
            style={{
              marginBottom: "10px",
              background: "linear-gradient(135deg, #818cf8 0%, #ec4899 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            🗂️ Your Sections
          </motion.h2>
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>
            Organize your passwords into sections
          </p>
        </motion.div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <div className="spinner" style={{ margin: "0 auto" }}></div>
            <p style={{ marginTop: "10px", color: "#94a3b8" }}>Loading sections...</p>
          </div>
        ) : (
          <SectionList sections={sections} refresh={loadSections} />
        )}

        <motion.div
          style={{
            marginTop: "30px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            to="/bin"
            style={{
              padding: "12px 20px",
              background: "linear-gradient(135deg, #334155 0%, #475569 100%)",
              borderRadius: "12px",
              textAlign: "center",
              border: "1px solid #475569",
              transition: "all 0.3s ease",
              display: "block",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateX(5px)";
              e.target.style.borderColor = "#6366f1";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateX(0)";
              e.target.style.borderColor = "#475569";
            }}
          >
            🗑️ Bin (Deleted Passwords)
          </Link>

          <Link
            to="/profile"
            style={{
              padding: "12px 20px",
              background: "linear-gradient(135deg, #334155 0%, #475569 100%)",
              borderRadius: "12px",
              textAlign: "center",
              border: "1px solid #475569",
              transition: "all 0.3s ease",
              display: "block",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateX(5px)";
              e.target.style.borderColor = "#6366f1";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateX(0)";
              e.target.style.borderColor = "#475569";
            }}
          >
            👤 Profile Settings
          </Link>

          <motion.button
            onClick={handleLogout}
            className="danger"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ width: "100%" }}
          >
            🚪 Logout
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
