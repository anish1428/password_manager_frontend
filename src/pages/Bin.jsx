import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Modal from "../components/Modal";

export default function Bin() {
  const navigate = useNavigate();
  const [deletedPasswords, setDeletedPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState({});
  const [copied, setCopied] = useState(null);
  const [recovering, setRecovering] = useState(null);

  const loadDeletedPasswords = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/passwords/deletedPasswords");
      setDeletedPasswords(res.data);
    } catch (error) {
      console.error("Failed to load deleted passwords:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecover = async (passwordId) => {
    try {
      setRecovering(passwordId);
      await api.put(`/api/passwords/recover/${passwordId}`);
      // Remove the recovered password from the list
      setDeletedPasswords(deletedPasswords.filter(p => p.id !== passwordId));
      setRecovering(null);
    } catch (error) {
      console.error("Failed to recover password:", error);
      alert("Failed to recover password. Please try again.");
      setRecovering(null);
    }
  };

  const copy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      alert("Failed to copy to clipboard");
    }
  };

  useEffect(() => {
    loadDeletedPasswords();
  }, []);

  return (
    <div className="layout">
      <motion.div
        style={{ flex: 1 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.button
          onClick={() => navigate("/")}
          className="secondary"
          whileHover={{ scale: 1.02, x: -5 }}
          whileTap={{ scale: 0.98 }}
          style={{ marginBottom: "20px" }}
        >
          ⬅️ Back to Dashboard
        </motion.button>

        <motion.div
          style={{
            background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
            padding: "30px",
            borderRadius: "20px",
            border: "1px solid #475569",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
            marginBottom: "30px",
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 style={{ marginBottom: "10px" }}>
            🗑️ Deleted Passwords (Bin)
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>
            Recover deleted passwords or view them here
          </p>
        </motion.div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div className="spinner" style={{ margin: "0 auto", width: "40px", height: "40px", borderWidth: "4px" }}></div>
            <p style={{ marginTop: "20px", color: "#94a3b8" }}>Loading deleted passwords...</p>
          </div>
        ) : deletedPasswords.length === 0 ? (
          <motion.div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#94a3b8",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div style={{ fontSize: "64px", marginBottom: "20px" }}>🗑️</div>
            <h3>Bin is empty</h3>
            <p>No deleted passwords to recover</p>
          </motion.div>
        ) : (
          <div>
            <AnimatePresence mode="popLayout">
              {deletedPasswords.map((p, index) => (
                <motion.div
                  key={p.id}
                  className="card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  style={{ opacity: recovering === p.id ? 0.6 : 1 }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ marginBottom: "8px", color: "#f1f5f9", fontSize: "20px" }}>
                        {p.title}
                      </h3>
                      <p style={{ color: "#94a3b8", marginBottom: "12px", fontSize: "14px" }}>
                        👤 {p.usernameOrEmail}
                      </p>
                      {p.sectionName && (
                        <p style={{ color: "#64748b", marginBottom: "12px", fontSize: "12px" }}>
                          📁 Section: {p.sectionName}
                        </p>
                      )}
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                        <code
                          style={{
                            background: "#0f172a",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            fontFamily: "monospace",
                            fontSize: "14px",
                            color: show[p.id] ? "#10b981" : "#cbd5e1",
                            letterSpacing: "2px",
                            flex: 1,
                            border: "1px solid #334155",
                          }}
                        >
                          {show[p.id] ? p.password : "••••••••••••"}
                        </code>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <motion.button
                      className="secondary"
                      onClick={() => setShow({ ...show, [p.id]: !show[p.id] })}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{ fontSize: "12px", padding: "8px 16px" }}
                    >
                      {show[p.id] ? "👁️ Hide" : "👁️ Show"}
                    </motion.button>

                    <motion.button
                      className={copied === p.id ? "success" : "secondary"}
                      onClick={() => copy(p.password, p.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{ fontSize: "12px", padding: "8px 16px" }}
                    >
                      {copied === p.id ? "✓ Copied!" : "📋 Copy"}
                    </motion.button>

                    <motion.button
                      className="success"
                      onClick={() => handleRecover(p.id)}
                      disabled={recovering === p.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{ fontSize: "12px", padding: "8px 16px" }}
                    >
                      {recovering === p.id ? (
                        <>
                          <span className="spinner" style={{ width: "12px", height: "12px", borderWidth: "2px", display: "inline-block", marginRight: "6px" }}></span>
                          Recovering...
                        </>
                      ) : (
                        "♻️ Recover"
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}
