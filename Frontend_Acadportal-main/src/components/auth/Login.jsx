import { useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true); setError("");
    try {
      const res = await axios.post(`${API}/login`, { email, password });
      onLogin(res.data.user, res.data.access_token);
    } catch (err) {
      if (err.response?.status === 401) setError("Invalid email or password.");
      else if (!err.response) setError("Cannot connect to server. Make sure backend is running.");
      else setError("Login failed. Please try again.");
    } finally { setLoading(false); }
  };

  const fillDemo = () => { setEmail("admin@school.edu"); setPassword("password123"); setError(""); };

  return (
    <div style={{
      minHeight:"100vh", width:"100vw", margin:0, padding:0,
      background:"linear-gradient(135deg, #020818 0%, #0a1628 40%, #0d2144 70%, #071020 100%)",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:"'Outfit','Segoe UI',sans-serif", position:"relative", overflow:"hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        @keyframes pulse-ring { 0%{transform:scale(0.8);opacity:1} 100%{transform:scale(2);opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .login-card { animation: fadeUp 0.6s ease forwards; }
        .sign-in-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(14,165,233,0.4) !important; }
        .sign-in-btn:active { transform: translateY(0); }
        .demo-btn:hover { background: rgba(56,189,248,0.12) !important; border-color: rgba(56,189,248,0.3) !important; }
        .input-field:focus { border-color: rgba(56,189,248,0.5) !important; box-shadow: 0 0 0 3px rgba(56,189,248,0.08) !important; }
        .show-pass:hover { color: #38bdf8 !important; }
        .feature-pill:hover { background: rgba(56,189,248,0.1) !important; }
      `}</style>

      {/* Background decorations */}
      <div style={{ position:"absolute", width:"700px", height:"700px", background:"radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 65%)", top:"-250px", left:"-250px", borderRadius:"50%", animation:"float 8s ease-in-out infinite" }}/>
      <div style={{ position:"absolute", width:"600px", height:"600px", background:"radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 65%)", bottom:"-200px", right:"-200px", borderRadius:"50%", animation:"float 10s ease-in-out infinite reverse" }}/>
      <div style={{ position:"absolute", width:"300px", height:"300px", background:"radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 65%)", top:"50%", right:"10%", borderRadius:"50%", animation:"float 6s ease-in-out infinite" }}/>
      {/* Grid pattern */}
      <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(56,189,248,0.025) 1px, transparent 1px),linear-gradient(90deg, rgba(56,189,248,0.025) 1px, transparent 1px)", backgroundSize:"60px 60px" }}/>

      {/* Floating orbs */}
      {[{top:"15%",left:"8%",size:8,color:"#38bdf8",delay:"0s"},{top:"70%",left:"5%",size:5,color:"#6366f1",delay:"1s"},{top:"30%",right:"6%",size:6,color:"#10b981",delay:"2s"},{top:"80%",right:"10%",size:9,color:"#38bdf8",delay:"0.5s"}].map((o,i)=>(
        <div key={i} style={{ position:"absolute", top:o.top, left:o.left, right:o.right, width:o.size, height:o.size, borderRadius:"50%", background:o.color, opacity:0.5, animation:`float ${4+i}s ease-in-out infinite`, animationDelay:o.delay }}/>
      ))}

      <div style={{ display:"flex", width:"100%", maxWidth:"1000px", gap:"60px", alignItems:"center", padding:"20px", position:"relative", zIndex:1 }}>

        {/* Left side — branding */}
        <div style={{ flex:1, display:"none" }} className="left-panel">
          <div style={{ marginBottom:"32px" }}>
            <div style={{ fontSize:"48px", fontWeight:"800", color:"#f0f9ff", letterSpacing:"-2px", lineHeight:1.1 }}>
              IT15 School<br/><span style={{ background:"linear-gradient(135deg,#38bdf8,#6366f1)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Portal</span>
            </div>
            <p style={{ color:"rgba(148,163,184,0.6)", fontSize:"16px", marginTop:"14px", lineHeight:1.6 }}>Academic Management System for IT15/L — Full-Stack Web Development Final Project</p>
          </div>
          {[["📊","Dashboard Analytics","Real-time charts & attendance data"],["👨‍🎓","Student Management","Add, edit, and track 500+ students"],["🌤","Weather Integration","Live forecast via OpenWeatherMap API"]].map(([icon,title,desc])=>(
            <div key={title} className="feature-pill" style={{ display:"flex", gap:"14px", alignItems:"flex-start", padding:"14px 16px", borderRadius:"14px", marginBottom:"10px", transition:"all 0.2s", cursor:"default", background:"rgba(56,189,248,0.03)", border:"1px solid rgba(56,189,248,0.06)" }}>
              <span style={{ fontSize:"22px" }}>{icon}</span>
              <div><div style={{ fontSize:"14px", fontWeight:"600", color:"#e2e8f0", marginBottom:"3px" }}>{title}</div><div style={{ fontSize:"12px", color:"rgba(148,163,184,0.45)" }}>{desc}</div></div>
            </div>
          ))}
        </div>

        {/* Right side — login form */}
        <div className="login-card" style={{
          flex:1, maxWidth:"440px", margin:"0 auto",
          background:"rgba(10,22,40,0.85)", backdropFilter:"blur(30px)",
          border:"1px solid rgba(56,189,248,0.12)", borderRadius:"28px",
          padding:"44px 40px",
          boxShadow:"0 0 80px rgba(56,189,248,0.06), 0 40px 80px rgba(0,0,0,0.6)",
        }}>
          {/* Logo */}
          <div style={{ textAlign:"center", marginBottom:"36px" }}>
            <div style={{ position:"relative", display:"inline-block", marginBottom:"20px" }}>
              <div style={{ position:"absolute", inset:"-8px", borderRadius:"24px", background:"linear-gradient(135deg,#0ea5e9,#6366f1)", opacity:0.2, animation:"pulse-ring 2.5s ease-out infinite" }}/>
              <div style={{ width:"76px", height:"76px", background:"linear-gradient(135deg,#0ea5e9,#6366f1)", borderRadius:"22px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"36px", boxShadow:"0 0 40px rgba(14,165,233,0.35)", position:"relative" }}>🎓</div>
            </div>
            <h1 style={{ color:"#f0f9ff", fontSize:"30px", fontWeight:"800", letterSpacing:"-0.8px", marginBottom:"6px" }}>School Portal</h1>
            <p style={{ color:"rgba(148,163,184,0.5)", fontSize:"13px" }}>IT15 Academic Management System</p>
          </div>

          {/* Status indicator */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", marginBottom:"24px", padding:"8px 16px", background:"rgba(16,185,129,0.06)", border:"1px solid rgba(16,185,129,0.12)", borderRadius:"20px" }}>
            <div style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#10b981", boxShadow:"0 0 8px #10b981" }}/>
            <span style={{ fontSize:"12px", color:"rgba(16,185,129,0.8)", fontWeight:"500" }}>System Online — Backend Connected</span>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:"14px", padding:"13px 16px", color:"#fca5a5", fontSize:"13px", marginBottom:"20px", display:"flex", alignItems:"center", gap:"10px" }}>
              <span style={{ fontSize:"16px" }}>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom:"16px" }}>
              <label style={{ color:"rgba(148,163,184,0.7)", fontSize:"12px", fontWeight:"600", display:"block", marginBottom:"8px", letterSpacing:"0.3px", textTransform:"uppercase" }}>Email Address</label>
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute", left:"14px", top:"50%", transform:"translateY(-50%)", fontSize:"16px" }}>📧</span>
                <input className="input-field" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@school.edu" required
                  style={{ width:"100%", padding:"13px 14px 13px 42px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(56,189,248,0.12)", borderRadius:"14px", color:"#e2e8f0", fontSize:"14px", outline:"none", transition:"all 0.2s", fontFamily:"'Outfit',sans-serif" }}/>
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom:"24px" }}>
              <label style={{ color:"rgba(148,163,184,0.7)", fontSize:"12px", fontWeight:"600", display:"block", marginBottom:"8px", letterSpacing:"0.3px", textTransform:"uppercase" }}>Password</label>
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute", left:"14px", top:"50%", transform:"translateY(-50%)", fontSize:"16px" }}>🔒</span>
                <input className="input-field" type={showPassword?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required
                  style={{ width:"100%", padding:"13px 44px 13px 42px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(56,189,248,0.12)", borderRadius:"14px", color:"#e2e8f0", fontSize:"14px", outline:"none", transition:"all 0.2s", fontFamily:"'Outfit',sans-serif" }}/>
                <button type="button" className="show-pass" onClick={()=>setShowPassword(!showPassword)}
                  style={{ position:"absolute", right:"14px", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"rgba(148,163,184,0.4)", cursor:"pointer", fontSize:"16px", transition:"color 0.2s", padding:0 }}>
                  {showPassword?"🙈":"👁️"}
                </button>
              </div>
            </div>

            {/* Sign in button */}
            <button type="submit" className="sign-in-btn" disabled={loading} style={{
              width:"100%", padding:"15px",
              background: loading ? "rgba(14,165,233,0.3)" : "linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%)",
              border:"none", borderRadius:"14px", color:"#fff",
              fontSize:"15px", fontWeight:"700", cursor: loading?"not-allowed":"pointer",
              boxShadow:"0 0 30px rgba(14,165,233,0.25)", transition:"all 0.2s",
              letterSpacing:"0.3px", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px",
            }}>
              {loading ? (
                <><span style={{ display:"inline-block", width:"16px", height:"16px", border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin-slow 0.7s linear infinite" }}/> Signing In...</>
              ) : "Sign In →"}
            </button>
          </form>

          {/* Demo credentials display */}
          <div style={{ marginTop:"16px", padding:"14px 16px", background:"rgba(56,189,248,0.04)", borderRadius:"12px", border:"1px solid rgba(56,189,248,0.07)" }}>
            <p style={{ color:"rgba(148,163,184,0.4)", fontSize:"11px", textAlign:"center", margin:0 }}>
              Demo: <span style={{ color:"#38bdf8", fontWeight:"600" }}>admin@school.edu</span> / <span style={{ color:"#38bdf8", fontWeight:"600" }}>password123</span>
            </p>
          </div>

          {/* Footer */}
          <p style={{ textAlign:"center", fontSize:"11px", color:"rgba(148,163,184,0.25)", marginTop:"24px" }}>
            IT15/L Integrative Programming • Final Project 2026
          </p>
        </div>
      </div>
    </div>
  );
}
