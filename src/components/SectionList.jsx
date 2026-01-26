import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Modal from "./Modal";
import EditSection from "./EditSection";

export default function SectionList({ sections, refresh }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [edit, setEdit] = useState(null);
  const [loading, setLoading] = useState(false);

  const add = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await api.post("/api/sections", { name });
      setName("");
      refresh();
    } catch (error) {
      console.error("Failed to add section:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      add();
    }
  };

  return (
    <div>
      <AnimatePresence mode="popLayout">
        {sections.map((s, index) => (
          <motion.div
            key={s.id}
            className="item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20, scale: 0.9 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate(`/section/${s.id}`)}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "20px" }}>📁</span>
              {s.name}
            </span>

            <motion.button
              className="secondary"
              onClick={(e) => {
                e.stopPropagation();
                setEdit(s);
              }}
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              style={{
                padding: "6px 12px",
                fontSize: "16px",
                minWidth: "40px",
              }}
            >
              ✏️
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div
        style={{ marginTop: "20px" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input
            placeholder="New section name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{ flex: 1 }}
          />
          <motion.button
            onClick={add}
            disabled={loading || !name.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ minWidth: "100px" }}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ width: "16px", height: "16px", borderWidth: "2px" }}></span>
                Adding...
              </>
            ) : (
              "➕ Add"
            )}
          </motion.button>
        </div>
      </motion.div>

      {edit && (
        <Modal onClose={() => setEdit(null)}>
          <EditSection
            section={edit}
            onSuccess={() => {
              setEdit(null);
              refresh();
            }}
          />
        </Modal>
      )}
    </div>
  );
}
