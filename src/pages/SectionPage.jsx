import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import PasswordList from "../components/PasswordList";
import AddPassword from "../components/AddPassword";
import Modal from "../components/Modal";

export default function SectionPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [passwords, setPasswords] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sectionName, setSectionName] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadPasswords = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/passwords/section/${id}`);
      setPasswords(res.data);
      
      // Try to get section name
      try {
        const sectionRes = await api.get(`/api/sections/${id}`);
        setSectionName(sectionRes.data.name);
      } catch {}
    } catch (error) {
      console.error("Failed to load passwords:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value) => {
    setSearch(value);

    if (value.trim() === "") {
      loadPasswords();
    } else {
      try {
        const res = await api.get(`/api/passwords/search?q=${value}`);
        setPasswords(res.data);
      } catch (error) {
        console.error("Search failed:", error);
      }
    }
  };

  const handleDeleteSection = async () => {
    try {
      setDeleting(true);
      await api.delete(`/api/sections/${id}`);
      navigate("/");
    } catch (error) {
      console.error("Failed to delete section:", error);
      alert("Failed to delete section. Please try again.");
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  useEffect(() => {
    loadPasswords();
  }, [id]);

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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <h2 style={{ marginBottom: "10px" }}>
                🔐 {sectionName || "Passwords"}
              </h2>
              <p style={{ color: "#94a3b8", fontSize: "14px" }}>
                Manage your passwords in this section
              </p>
            </div>
            <motion.button
              className="danger"
              onClick={() => setShowDeleteConfirm(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ 
                fontSize: "12px", 
                padding: "8px 16px",
                marginLeft: "15px"
              }}
            >
              🗑️ Delete Section
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          style={{ marginBottom: "20px" }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <input
            placeholder="🔍 Search passwords..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              fontSize: "16px",
              padding: "14px 18px",
            }}
          />
        </motion.div>

        <motion.div
          style={{ marginBottom: "20px" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            onClick={() => setShowAdd(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ width: "100%", fontSize: "16px", padding: "14px" }}
          >
            ➕ Add New Password
          </motion.button>
        </motion.div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div className="spinner" style={{ margin: "0 auto", width: "40px", height: "40px", borderWidth: "4px" }}></div>
            <p style={{ marginTop: "20px", color: "#94a3b8" }}>Loading passwords...</p>
          </div>
        ) : (
          <PasswordList passwords={passwords} refresh={loadPasswords} />
        )}

        {showAdd && (
          <Modal onClose={() => setShowAdd(false)}>
            <AddPassword
              sectionId={id}
              onSuccess={() => {
                setShowAdd(false);
                loadPasswords();
              }}
            />
          </Modal>
        )}

        {showDeleteConfirm && (
          <Modal onClose={() => setShowDeleteConfirm(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h3 style={{ marginBottom: "20px" }}>⚠️ Confirm Delete Section</h3>
              <p style={{ marginBottom: "20px", color: "#cbd5e1" }}>
                Are you sure you want to delete the section <b style={{ color: "#f1f5f9" }}>{sectionName || "this section"}</b>?
                <br />
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                  This will permanently delete the section and all passwords in it. This action cannot be undone.
                </span>
              </p>

              <div style={{ display: "flex", gap: "10px" }}>
                <motion.button
                  className="danger"
                  onClick={handleDeleteSection}
                  disabled={deleting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ flex: 1 }}
                >
                  {deleting ? (
                    <>
                      <span className="spinner" style={{ width: "12px", height: "12px", borderWidth: "2px", display: "inline-block", marginRight: "6px" }}></span>
                      Deleting...
                    </>
                  ) : (
                    "Yes, Delete Section"
                  )}
                </motion.button>
                <motion.button
                  className="secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
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
      </motion.div>
    </div>
  );
}
