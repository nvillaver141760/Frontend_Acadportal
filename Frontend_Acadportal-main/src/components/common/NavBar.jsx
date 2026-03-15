export default function NavBar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, user, onLogout, unreadCount, setShowNotifications }) {
  const navItems = [
    { key:"overview",    icon:"📊", label:"Overview"    },
    { key:"enrollment",  icon:"📈", label:"Enrollment"  },
    { key:"attendance",  icon:"📅", label:"Attendance"  },
    { key:"weather",     icon:"🌤", label:"Weather"     },
    { key:"students",    icon:"👨‍🎓", label:"Students"    },
    { key:"courses",     icon:"📚", label:"Courses"     },
    { key:"profile",     icon:"👤", label:"My Profile"  },
  ];

  return (
    <aside style={{
      width: sidebarOpen ? "200px" : "72px", minHeight:"100vh",
      background:"linear-gradient(180deg,#0a1628 0%,#071020 100%)",
      borderRight:"1px solid rgba(56,189,248,0.08)",
      display:"flex", flexDirection:"column",
      transition:"width 0.3s ease", overflow:"hidden", flexShrink:0,
    }}>
      {/* Logo */}
      <div style={{ padding:"20px 16px", borderBottom:"1px solid rgba(56,189,248,0.06)", display:"flex", alignItems:"center", gap:"12px" }}>
        <div style={{ width:"38px", height:"38px", borderRadius:"12px", background:"linear-gradient(135deg,#0ea5e9,#6366f1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px", flexShrink:0 }}>🎓</div>
        {sidebarOpen && (
          <div>
            <div style={{ fontSize:"14px", fontWeight:"800", color:"#f0f9ff", letterSpacing:"-0.3px" }}>School Portal</div>
            <div style={{ fontSize:"10px", color:"rgba(148,163,184,0.4)" }}>IT15 System</div>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ padding:"12px 10px", flex:1 }}>
        {sidebarOpen && <div style={{ fontSize:"10px", color:"rgba(148,163,184,0.3)", fontWeight:"600", letterSpacing:"0.8px", padding:"0 6px", marginBottom:"8px" }}>NAVIGATION</div>}
        {navItems.map(item => (
          <div key={item.key} className="nav-item" onClick={()=>setActiveTab(item.key)} style={{
            display:"flex", alignItems:"center", gap:"12px", padding:"10px", borderRadius:"10px", marginBottom:"4px", cursor:"pointer",
            background: activeTab===item.key ? "rgba(56,189,248,0.1)" : "transparent",
            color: activeTab===item.key ? "#38bdf8" : "rgba(148,163,184,0.6)",
            border: activeTab===item.key ? "1px solid rgba(56,189,248,0.15)" : "1px solid transparent",
            position:"relative",
          }}>
            <span style={{ fontSize:"18px", flexShrink:0 }}>{item.icon}</span>
            {sidebarOpen && <span style={{ fontSize:"13px", fontWeight: activeTab===item.key ? "600" : "500", whiteSpace:"nowrap" }}>{item.label}</span>}
            {activeTab===item.key && <div style={{ position:"absolute", right:0, top:"50%", transform:"translateY(-50%)", width:"3px", height:"20px", background:"#38bdf8", borderRadius:"3px 0 0 3px" }}/>}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding:"12px 10px", borderTop:"1px solid rgba(56,189,248,0.06)" }}>
        <button onClick={onLogout} style={{ width:"100%", padding:"10px", background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.15)", borderRadius:"10px", color:"#f87171", cursor:"pointer", fontSize:"13px", fontWeight:"600", display:"flex", alignItems:"center", justifyContent: sidebarOpen ? "flex-start" : "center", gap:"8px" }}>
          <span>🚪</span>{sidebarOpen && "Sign Out"}
        </button>
        {sidebarOpen && user && (
          <div style={{ marginTop:"12px", padding:"10px", background:"rgba(56,189,248,0.04)", borderRadius:"10px" }}>
            <div style={{ fontSize:"12px", fontWeight:"600", color:"#e2e8f0" }}>{user.name}</div>
            <div style={{ fontSize:"11px", color:"rgba(148,163,184,0.4)", marginTop:"2px" }}>{user.email}</div>
          </div>
        )}
      </div>
    </aside>
  );
}
