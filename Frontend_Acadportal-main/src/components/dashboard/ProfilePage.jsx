import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

export default function ProfilePage({ token, user }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    setLoading(true); setError(null);
    try {
      const res = await axios.get(`${API}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
    } catch {
      setError("Failed to load profile.");
    } finally { setLoading(false); }
  };

  const getInitials = (name) => {
    if (!name) return "A";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric"
    });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"80px", flexDirection:"column", gap:"16px" }}>
      <div style={{ width:"48px", height:"48px", border:"3px solid rgba(56,189,248,0.15)", borderTopColor:"#38bdf8", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>
      <p style={{ color:"rgba(148,163,184,0.5)", fontSize:"14px" }}>Loading profile...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{ textAlign:"center", padding:"60px" }}>
      <div style={{ fontSize:"48px", marginBottom:"16px" }}>⚠️</div>
      <p style={{ color:"#fca5a5", fontSize:"15px", marginBottom:"20px" }}>{error}</p>
      <button onClick={fetchProfile} style={{ padding:"10px 24px", background:"linear-gradient(135deg,#0ea5e9,#6366f1)", border:"none", borderRadius:"10px", color:"#fff", cursor:"pointer", fontSize:"14px" }}>Retry</button>
    </div>
  );

  const data = profile || user;

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.4} 50%{transform:scale(1.08);opacity:0.15} 100%{transform:scale(1);opacity:0.4} }
        .info-card { transition: transform 0.2s, box-shadow 0.2s; }
        .info-card:hover { transform: translateY(-3px); box-shadow: 0 8px 30px rgba(56,189,248,0.08) !important; }
      `}</style>

      <div style={{ maxWidth:"860px", margin:"0 auto", fontFamily:"'Outfit','Segoe UI',sans-serif", color:"#e2e8f0", animation:"fadeUp 0.5s ease" }}>

        {/* Header Banner */}
        <div style={{
          borderRadius:"24px", marginBottom:"24px", overflow:"hidden",
          background:"linear-gradient(135deg, #0a1e3d 0%, #0d2657 50%, #0a1628 100%)",
          border:"1px solid rgba(56,189,248,0.1)",
          position:"relative", padding:"40px 40px 80px",
        }}>
          {/* Decorative circles */}
          <div style={{ position:"absolute", top:"-60px", right:"-60px", width:"240px", height:"240px", borderRadius:"50%", background:"radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)" }}/>
          <div style={{ position:"absolute", bottom:"-40px", left:"30%", width:"180px", height:"180px", borderRadius:"50%", background:"radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)" }}/>
          {/* Grid */}
          <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(56,189,248,0.03) 1px, transparent 1px),linear-gradient(90deg,rgba(56,189,248,0.03) 1px,transparent 1px)", backgroundSize:"40px 40px" }}/>

          <div style={{ position:"relative", zIndex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"8px" }}>
              <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:"#10b981", boxShadow:"0 0 10px #10b981" }}/>
              <span style={{ fontSize:"12px", color:"rgba(16,185,129,0.8)", fontWeight:"600", letterSpacing:"0.5px", textTransform:"uppercase" }}>Active Account</span>
            </div>
            <h2 style={{ fontSize:"26px", fontWeight:"800", color:"#f0f9ff", letterSpacing:"-0.5px" }}>Admin Profile</h2>
            <p style={{ fontSize:"13px", color:"rgba(148,163,184,0.5)", marginTop:"4px" }}>Manage and view your account information</p>
          </div>
        </div>

        {/* Avatar + Name Card */}
        <div style={{
          background:"rgba(10,22,40,0.9)", border:"1px solid rgba(56,189,248,0.1)",
          borderRadius:"24px", padding:"36px 40px", marginBottom:"20px",
          display:"flex", alignItems:"center", gap:"32px", flexWrap:"wrap",
          position:"relative", overflow:"hidden",
          marginTop:"-56px",
        }}>
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg, rgba(14,165,233,0.03) 0%, transparent 60%)" }}/>

          {/* Avatar */}
          <div style={{ position:"relative", flexShrink:0 }}>
            <div style={{ position:"absolute", inset:"-6px", borderRadius:"50%", background:"linear-gradient(135deg,#0ea5e9,#6366f1)", opacity:0.3, animation:"pulse-ring 3s ease-in-out infinite" }}/>
            <div style={{
              width:"110px", height:"110px", borderRadius:"50%",
              background:"linear-gradient(135deg,#0ea5e9,#6366f1)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"40px", fontWeight:"800", color:"#fff",
              boxShadow:"0 0 40px rgba(14,165,233,0.3)",
              position:"relative", zIndex:1, letterSpacing:"-1px",
              border:"4px solid rgba(10,22,40,0.9)",
            }}>
              {getInitials(data?.name)}
            </div>
            {/* Online badge */}
            <div style={{
              position:"absolute", bottom:"6px", right:"6px",
              width:"20px", height:"20px", borderRadius:"50%",
              background:"#10b981", border:"3px solid #0a1628",
              boxShadow:"0 0 10px rgba(16,185,129,0.5)", zIndex:2,
            }}/>
          </div>

          {/* Name + Role */}
          <div style={{ flex:1, position:"relative", zIndex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:"12px", flexWrap:"wrap", marginBottom:"8px" }}>
              <h1 style={{ fontSize:"32px", fontWeight:"800", color:"#f0f9ff", letterSpacing:"-1px", margin:0 }}>
                {data?.name || "Admin User"}
              </h1>
              <span style={{
                padding:"5px 14px", borderRadius:"20px",
                background:"linear-gradient(135deg, rgba(14,165,233,0.15), rgba(99,102,241,0.15))",
                border:"1px solid rgba(56,189,248,0.2)",
                fontSize:"12px", fontWeight:"700", color:"#38bdf8",
                letterSpacing:"0.5px", textTransform:"uppercase",
              }}>Administrator</span>
            </div>
            <p style={{ color:"rgba(148,163,184,0.6)", fontSize:"15px", margin:"0 0 16px" }}>{data?.email}</p>
            <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
              {[["🎓","IT15 System"],["🔐","Full Access"],["📅",`Since ${formatDate(data?.created_at)}`]].map(([icon,lbl])=>(
                <span key={lbl} style={{ padding:"6px 14px", background:"rgba(56,189,248,0.06)", border:"1px solid rgba(56,189,248,0.1)", borderRadius:"20px", fontSize:"12px", color:"rgba(148,163,184,0.7)", display:"flex", alignItems:"center", gap:"6px" }}>
                  {icon} {lbl}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"20px" }}>

          {/* Full Name */}
          <div className="info-card" style={{ background:"rgba(10,22,40,0.8)", border:"1px solid rgba(56,189,248,0.08)", borderRadius:"18px", padding:"24px", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:"-20px", right:"-20px", width:"80px", height:"80px", background:"radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)", borderRadius:"50%" }}/>
            <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"16px" }}>
              <div style={{ width:"42px", height:"42px", borderRadius:"12px", background:"rgba(56,189,248,0.1)", border:"1px solid rgba(56,189,248,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px" }}>👤</div>
              <span style={{ fontSize:"12px", color:"rgba(148,163,184,0.5)", fontWeight:"600", letterSpacing:"0.5px", textTransform:"uppercase" }}>Full Name</span>
            </div>
            <p style={{ fontSize:"20px", fontWeight:"700", color:"#f0f9ff", margin:0 }}>{data?.name || "—"}</p>
          </div>

          {/* Email */}
          <div className="info-card" style={{ background:"rgba(10,22,40,0.8)", border:"1px solid rgba(56,189,248,0.08)", borderRadius:"18px", padding:"24px", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:"-20px", right:"-20px", width:"80px", height:"80px", background:"radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)", borderRadius:"50%" }}/>
            <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"16px" }}>
              <div style={{ width:"42px", height:"42px", borderRadius:"12px", background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px" }}>📧</div>
              <span style={{ fontSize:"12px", color:"rgba(148,163,184,0.5)", fontWeight:"600", letterSpacing:"0.5px", textTransform:"uppercase" }}>Email Address</span>
            </div>
            <p style={{ fontSize:"16px", fontWeight:"600", color:"#f0f9ff", margin:0, wordBreak:"break-all" }}>{data?.email || "—"}</p>
          </div>

          {/* Role */}
          <div className="info-card" style={{ background:"rgba(10,22,40,0.8)", border:"1px solid rgba(16,185,129,0.1)", borderRadius:"18px", padding:"24px", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:"-20px", right:"-20px", width:"80px", height:"80px", background:"radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)", borderRadius:"50%" }}/>
            <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"16px" }}>
              <div style={{ width:"42px", height:"42px", borderRadius:"12px", background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px" }}>🛡️</div>
              <span style={{ fontSize:"12px", color:"rgba(148,163,184,0.5)", fontWeight:"600", letterSpacing:"0.5px", textTransform:"uppercase" }}>Role</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
              <p style={{ fontSize:"20px", fontWeight:"700", color:"#10b981", margin:0 }}>Administrator</p>
              <span style={{ padding:"3px 10px", background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.2)", borderRadius:"20px", fontSize:"11px", color:"#10b981", fontWeight:"600" }}>Full Access</span>
            </div>
          </div>

          {/* Date Created */}
          <div className="info-card" style={{ background:"rgba(10,22,40,0.8)", border:"1px solid rgba(245,158,11,0.1)", borderRadius:"18px", padding:"24px", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:"-20px", right:"-20px", width:"80px", height:"80px", background:"radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)", borderRadius:"50%" }}/>
            <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"16px" }}>
              <div style={{ width:"42px", height:"42px", borderRadius:"12px", background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px" }}>📅</div>
              <span style={{ fontSize:"12px", color:"rgba(148,163,184,0.5)", fontWeight:"600", letterSpacing:"0.5px", textTransform:"uppercase" }}>Date Created</span>
            </div>
            <p style={{ fontSize:"16px", fontWeight:"700", color:"#f59e0b", margin:0 }}>{formatDate(data?.created_at)}</p>
            <p style={{ fontSize:"12px", color:"rgba(148,163,184,0.35)", margin:"4px 0 0" }}>{formatDateTime(data?.created_at)}</p>
          </div>
        </div>

        {/* Account Permissions */}
        <div style={{ background:"rgba(10,22,40,0.8)", border:"1px solid rgba(56,189,248,0.08)", borderRadius:"18px", padding:"26px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"20px" }}>
            <div style={{ width:"38px", height:"38px", borderRadius:"10px", background:"rgba(56,189,248,0.08)", border:"1px solid rgba(56,189,248,0.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px" }}>🔑</div>
            <div>
              <h3 style={{ fontSize:"15px", fontWeight:"700", color:"#f0f9ff", margin:0 }}>Account Permissions</h3>
              <p style={{ fontSize:"12px", color:"rgba(148,163,184,0.4)", margin:0 }}>Access levels granted to this account</p>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:"12px" }}>
            {[
              ["📊","Dashboard Access","View all analytics"],
              ["👨‍🎓","Student Management","Add, edit, delete"],
              ["📚","Course Management","Add, edit, delete"],
              ["📅","Attendance Records","View & manage"],
              ["🌤","Weather Module","Live forecast access"],
              ["⚙️","System Settings","Full control"],
            ].map(([icon,perm,desc])=>(
              <div key={perm} style={{ display:"flex", alignItems:"center", gap:"12px", padding:"12px 14px", background:"rgba(56,189,248,0.04)", border:"1px solid rgba(56,189,248,0.08)", borderRadius:"12px" }}>
                <span style={{ fontSize:"18px" }}>{icon}</span>
                <div>
                  <div style={{ fontSize:"13px", fontWeight:"600", color:"#e2e8f0" }}>{perm}</div>
                  <div style={{ fontSize:"11px", color:"rgba(148,163,184,0.4)" }}>{desc}</div>
                </div>
                <div style={{ marginLeft:"auto", width:"8px", height:"8px", borderRadius:"50%", background:"#10b981", flexShrink:0 }}/>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
