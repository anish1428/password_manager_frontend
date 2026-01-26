import { useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";

export default function EditSection({ section, onSuccess }) {
  const [name, setName] = useState(section.name);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = async () => {
    if (!name.trim()) {
      setError("Section name cannot be empty");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.put(`/api/sections/${section.id}`, { name });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update section");
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
      <h3>Edit Section</h3>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Section name"
        onKeyPress={(e) => e.key === "Enter" && update()}
        autoFocus
      />
      {error && <p className="error">{error}</p>}
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <motion.button
          onClick={update}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{ flex: 1 }}
        >
          {loading ? (
            <>
              <span className="spinner" style={{ width: "16px", height: "16px", borderWidth: "2px" }}></span>
              Updating...
            </>
          ) : (
            "Update"
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
