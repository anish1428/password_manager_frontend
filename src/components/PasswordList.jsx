import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import Modal from "./Modal";
import EditPassword from "./EditPassword";

export default function PasswordList({ passwords, refresh }) {
  const [show, setShow] = useState({});
  const [toDelete, setToDelete] = useState(null);
  const [edit, setEdit] = useState(null);
  const [copied, setCopied] = useState(null);

  const confirmDelete = async () => {
    try {
      await api.delete(`/api/passwords/${toDelete.id}`);
      setToDelete(null);
      refresh();
    } catch (error) {
      console.error("Failed to delete password:", error);
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

  if (passwords.length === 0) {
    return (
      <motion.div
        style={{
          textAlign: "center",
          padding: "60px 20px",
          color: "#94a3b8",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div style={{ fontSize: "64px", marginBottom: "20px" }}>🔒</div>
        <h3>No passwords yet</h3>
        <p>Add your first password to get started!</p>
      </motion.div>
    );
  }

  return (
    <div>
      <AnimatePresence mode="popLayout">
        {passwords.map((p, index) => (
          <motion.div
            key={p.id}
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ marginBottom: "8px", color: "#f1f5f9", fontSize: "20px" }}>
                  {p.title}
                </h3>
                <p style={{ color: "#94a3b8", marginBottom: "12px", fontSize: "14px" }}>
                  👤 {p.usernameOrEmail}
                </p>
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
                className="secondary"
                onClick={() => setEdit(p)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ fontSize: "12px", padding: "8px 16px" }}
              >
                ✏️ Edit
              </motion.button>

              <motion.button
                className="danger"
                onClick={() => setToDelete(p)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ fontSize: "12px", padding: "8px 16px" }}
              >
                🗑️ Delete
              </motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {edit && (
        <Modal onClose={() => setEdit(null)}>
          <EditPassword
            data={edit}
            onSuccess={() => {
              setEdit(null);
              refresh();
            }}
          />
        </Modal>
      )}

      {toDelete && (
        <Modal onClose={() => setToDelete(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 style={{ marginBottom: "20px" }}>⚠️ Confirm Delete</h3>
            <p style={{ marginBottom: "20px", color: "#cbd5e1" }}>
              Are you sure you want to delete <b style={{ color: "#f1f5f9" }}>{toDelete.title}</b>?
              <br />
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                This action cannot be undone.
              </span>
            </p>

            <div style={{ display: "flex", gap: "10px" }}>
              <motion.button
                className="danger"
                onClick={confirmDelete}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ flex: 1 }}
              >
                Yes, Delete
              </motion.button>
              <motion.button
                className="secondary"
                onClick={() => setToDelete(null)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ flex: 1 }}
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </Modal>
      )}
    </div>
  );
}
