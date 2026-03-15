import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";

export default function App() {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  const handleLogin = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", accessToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          user ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />
        }/>
        <Route path="/dashboard" element={
          user ? <Dashboard user={user} token={token} onLogout={handleLogout} /> : <Navigate to="/login" />
        }/>
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />}/>
      </Routes>
    </BrowserRouter>
  );
}
