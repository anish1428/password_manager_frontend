import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import { useAuth } from "./auth/AuthContext";
import SectionPage from "./pages/SectionPage";
import Bin from "./pages/Bin";
import "./App.css";

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/section/:id" element={
  <PrivateRoute><SectionPage /></PrivateRoute>
} />
        <Route path="/bin" element={<PrivateRoute><Bin /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
