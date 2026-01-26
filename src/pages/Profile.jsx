import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profile, setProfile] = useState({ username: "", email: "" });
  const [loading, setLoading] = useState(true);

  const [pwd, setPwd] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCode, setDeleteCode] = useState("");
  const [userEnteredCode, setUserEnteredCode] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/profile");
      setProfile(res.data);
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!profile.username.trim() || !profile.email.trim()) {
      setErr("Username and email are required");
      return;
    }
    setUpdating(true);
    setErr("");
    setMsg("");
    try {
      await api.put("/api/profile", profile);
      setMsg("Profile updated successfully!");
      setTimeout(() => setMsg(""), 3000);
    } catch (error) {
      setErr(error.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const changePassword = async () => {
    if (!pwd.oldPassword || !pwd.newPassword || !pwd.confirmPassword) {
      setErr("All fields are required");
      return;
    }

    if (pwd.newPassword !== pwd.confirmPassword) {
      setErr("New passwords do not match");
      return;
    }

    if (pwd.newPassword.length < 6) {
      setErr("New password must be at least 6 characters");
      return;
    }

    setChangingPwd(true);
    setErr("");
    setMsg("");

    try {
      await api.put("/api/profile/password", {
        oldPassword: pwd.oldPassword,
        newPassword: pwd.newPassword,
      });

      setMsg("Password changed successfully!");
      setPwd({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => {
        setShowPwdModal(false);
        setMsg("");
      }, 2000);
    } catch (error) {
      setErr(error.response?.data?.message || "Old password is incorrect");
    } finally {
      setChangingPwd(false);
    }
  };

  const generateRandomCode = () => {
    const numbers = "0123456789";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const allChars = numbers + uppercase + lowercase;
    
    let code = "";
    // Ensure at least one of each type
    code += numbers[Math.floor(Math.random() * numbers.length)];
    code += uppercase[Math.floor(Math.random() * uppercase.length)];
    code += lowercase[Math.floor(Math.random() * lowercase.length)];
    
    // Fill the rest randomly (total length 8)
    for (let i = 3; i < 8; i++) {
      code += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the code
    return code.split("").sort(() => Math.random() - 0.5).join("");
  };

  const handleOpenDeleteModal = () => {
    const code = generateRandomCode();
    setDeleteCode(code);
    setUserEnteredCode("");
    setShowDeleteModal(true);
    setErr("");
  };

  const handleDeleteAccount = async () => {
    if (userEnteredCode !== deleteCode) {
      setErr("The code you entered does not match. Please try again.");
      return;
    }

    setDeleting(true);
    setErr("");

    try {
      await api.delete("/api/profile/me", {
        params: { confirm: "DELETE" }
      });
      
      // Logout and redirect to login
      logout();
      navigate("/login");
    } catch (error) {
      setErr(error.response?.data?.message || "Failed to delete account. Please try again.");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="spinner" style={{ width: "40px", height: "40px", borderWidth: "4px" }}></div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", padding: "30px", maxWidth: "600px", margin: "0 auto" }}>
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
        className="box"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          👤 Profile Settings
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h4 style={{ marginTop: "30px", marginBottom: "15px" }}>Basic Information</h4>

          <input
            value={profile.username}
            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
            placeholder="Username"
          />

          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            placeholder="Email"
          />

          <motion.button
            onClick={updateProfile}
            disabled={updating}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ width: "100%", marginTop: "10px" }}
          >
            {updating ? (
              <>
                <span className="spinner" style={{ width: "16px", height: "16px", borderWidth: "2px" }}></span>
                Updating...
              </>
            ) : (
              "💾 Update Profile"
            )}
          </motion.button>
        </motion.div>

        <motion.hr
          style={{
            border: "none",
            borderTop: "1px solid #475569",
            margin: "30px 0",
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5 }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h4 style={{ marginBottom: "15px" }}>Security</h4>

          <motion.button
            onClick={() => setShowPwdModal(true)}
            className="secondary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ width: "100%", marginBottom: "12px" }}
          >
            🔐 Change Password
          </motion.button>
        </motion.div>

        <motion.hr
          style={{
            border: "none",
            borderTop: "1px solid #475569",
            margin: "30px 0",
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7 }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h4 style={{ marginBottom: "15px", color: "#ef4444" }}>Danger Zone</h4>

          <motion.button
            onClick={handleOpenDeleteModal}
            className="danger"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ width: "100%" }}
          >
            🗑️ Delete My Account
          </motion.button>
        </motion.div>

        {msg && (
          <motion.p
            className="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {msg}
          </motion.p>
        )}
        {err && (
          <motion.p
            className="error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {err}
          </motion.p>
        )}

        {showPwdModal && (
          <Modal onClose={() => {
            setShowPwdModal(false);
            setPwd({ oldPassword: "", newPassword: "", confirmPassword: "" });
            setErr("");
          }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h3>🔐 Change Password</h3>

              <input
                type="password"
                placeholder="Current password"
                value={pwd.oldPassword}
                onChange={(e) => setPwd({ ...pwd, oldPassword: e.target.value })}
                autoFocus
              />

              <input
                type="password"
                placeholder="New password"
                value={pwd.newPassword}
                onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })}
              />

              <input
                type="password"
                placeholder="Confirm new password"
                value={pwd.confirmPassword}
                onChange={(e) => setPwd({ ...pwd, confirmPassword: e.target.value })}
                onKeyPress={(e) => e.key === "Enter" && changePassword()}
              />

              {err && <p className="error" style={{ marginTop: "10px" }}>{err}</p>}
              {msg && <p className="success" style={{ marginTop: "10px" }}>{msg}</p>}

              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <motion.button
                  onClick={changePassword}
                  disabled={changingPwd}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ flex: 1 }}
                >
                  {changingPwd ? (
                    <>
                      <span className="spinner" style={{ width: "16px", height: "16px", borderWidth: "2px" }}></span>
                      Changing...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </motion.button>
                <motion.button
                  className="secondary"
                  onClick={() => {
                    setShowPwdModal(false);
                    setPwd({ oldPassword: "", newPassword: "", confirmPassword: "" });
                    setErr("");
                  }}
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

        {showDeleteModal && (
          <Modal onClose={() => {
            setShowDeleteModal(false);
            setUserEnteredCode("");
            setDeleteCode("");
            setErr("");
          }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h3 style={{ color: "#ef4444", marginBottom: "20px" }}>⚠️ Delete My Account</h3>
              
              <p style={{ marginBottom: "20px", color: "#cbd5e1", lineHeight: "1.6" }}>
                This action cannot be undone. This will permanently delete your account and all your data.
              </p>

              <div style={{
                background: "#0f172a",
                padding: "20px",
                borderRadius: "12px",
                border: "2px solid #ef4444",
                marginBottom: "20px",
                textAlign: "center"
              }}>
                <p style={{ color: "#94a3b8", marginBottom: "10px", fontSize: "14px" }}>
                  Please type the following code to confirm:
                </p>
                <code style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  letterSpacing: "4px",
                  color: "#f1f5f9",
                  fontFamily: "monospace",
                  display: "block",
                  padding: "10px",
                  background: "#1e293b",
                  borderRadius: "8px",
                  border: "1px solid #334155"
                }}>
                  {deleteCode}
                </code>
              </div>

              <input
                type="text"
                placeholder="Enter the code above"
                value={userEnteredCode}
                onChange={(e) => {
                  setUserEnteredCode(e.target.value);
                  setErr("");
                }}
                onKeyPress={(e) => e.key === "Enter" && handleDeleteAccount()}
                autoFocus
                style={{
                  width: "100%",
                  marginBottom: "10px",
                  letterSpacing: "2px",
                  fontFamily: "monospace"
                }}
              />

              {err && <p className="error" style={{ marginTop: "10px", marginBottom: "10px" }}>{err}</p>}

              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <motion.button
                  className="danger"
                  onClick={handleDeleteAccount}
                  disabled={deleting || userEnteredCode !== deleteCode}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ flex: 1, opacity: (deleting || userEnteredCode !== deleteCode) ? 0.5 : 1 }}
                >
                  {deleting ? (
                    <>
                      <span className="spinner" style={{ width: "16px", height: "16px", borderWidth: "2px", display: "inline-block", marginRight: "6px" }}></span>
                      Deleting...
                    </>
                  ) : (
                    "Confirm Delete"
                  )}
                </motion.button>
                <motion.button
                  className="secondary"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setUserEnteredCode("");
                    setDeleteCode("");
                    setErr("");
                  }}
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
