import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export default function Modal({ children, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={overlay}
      >
        <motion.div
          className="modal-content"
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          style={modal}
        >
          <button className="modal-close" onClick={onClose} style={closeBtn}>
            ✖
          </button>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(15, 23, 42, 0.8)",
  backdropFilter: "blur(8px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modal = {
  background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
  padding: "32px",
  borderRadius: "20px",
  minWidth: "400px",
  maxWidth: "90vw",
  maxHeight: "90vh",
  overflow: "auto",
  border: "1px solid #475569",
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
  position: "relative",
};

const closeBtn = {
  position: "absolute",
  top: "16px",
  right: "16px",
  border: "none",
  background: "rgba(239, 68, 68, 0.1)",
  fontSize: "24px",
  cursor: "pointer",
  color: "#cbd5e1",
  width: "36px",
  height: "36px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "8px",
  transition: "all 0.2s ease",
};
