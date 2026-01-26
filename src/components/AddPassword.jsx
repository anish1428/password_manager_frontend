import { useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";

export default function AddPassword({ sectionId, onSuccess }) {
  const [form, setForm] = useState({
    title: "",
    usernameOrEmail: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getStrength = (pwd) => {
    if (!pwd) return { text: "", level: 0, color: "#94a3b8" };
    if (
      pwd.length >= 12 &&
      /[A-Z]/.test(pwd) &&
      /[0-9]/.test(pwd) &&
      /[^A-Za-z0-9]/.test(pwd)
    ) {
      return { text: "Strong 💪", level: 3, color: "#10b981" };
    }
    if (pwd.length >= 8 && (/[A-Z]/.test(pwd) || /[0-9]/.test(pwd))) {
      return { text: "Medium 🙂", level: 2, color: "#f59e0b" };
    }
    if (pwd.length >= 6) {
      return { text: "Weak ⚠️", level: 1, color: "#ef4444" };
    }
    return { text: "Very Weak", level: 0, color: "#ef4444" };
  };

  const strength = getStrength(form.password);

  const submit = async () => {
    if (!form.title.trim() || !form.password.trim()) {
      setError("Title and password are required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.post("/api/passwords", { ...form, sectionId });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h3>➕ Add New Password</h3>

      <input
        placeholder="Title (e.g., Gmail, Facebook)"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        autoFocus
      />

      <input
        placeholder="Username or Email"
        value={form.usernameOrEmail}
        onChange={(e) => setForm({ ...form, usernameOrEmail: e.target.value })}
      />

      <input
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      {form.password && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          style={{ marginBottom: "15px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <span style={{ fontSize: "14px", color: "#94a3b8" }}>Strength:</span>
            <span style={{ color: strength.color, fontWeight: "600" }}>{strength.text}</span>
          </div>
          <div
            style={{
              height: "6px",
              background: "#334155",
              borderRadius: "3px",
              overflow: "hidden",
            }}
          >
            <motion.div
              style={{
                height: "100%",
                background: `linear-gradient(90deg, ${strength.color} 0%, ${strength.color}dd 100%)`,
                width: `${(strength.level / 3) * 100}%`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${(strength.level / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      )}

      {error && <p className="error">{error}</p>}

      <motion.button
        onClick={submit}
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{ width: "100%", marginTop: "10px" }}
      >
        {loading ? (
          <>
            <span className="spinner" style={{ width: "16px", height: "16px", borderWidth: "2px" }}></span>
            Saving...
          </>
        ) : (
          "💾 Save Password"
        )}
      </motion.button>
    </motion.div>
  );
}
