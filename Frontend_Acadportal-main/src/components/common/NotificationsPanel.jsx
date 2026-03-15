

const SAMPLE_NOTIFICATIONS = [
  { id:1, type:"info", icon:"📢", title:"System Update", message:"School Portal has been updated to the latest version.", time:"Just now", read:false },
  { id:2, type:"success", icon:"✅", title:"New Student Enrolled", message:"500 students have been successfully seeded into the database.", time:"2 hours ago", read:false },
  { id:3, type:"warning", icon:"⚠️", title:"Attendance Reminder", message:"Please update attendance records for this week.", time:"Yesterday", read:false },
  { id:4, type:"info", icon:"🌤", title:"Weather Alert", message:"Typhoon signal may affect school operations tomorrow.", time:"2 days ago", read:true },
  { id:5, type:"success", icon:"🎓", title:"Course Updated", message:"BSIT curriculum has been updated for AY 2026.", time:"3 days ago", read:true },
  { id:6, type:"info", icon:"📅", title:"Upcoming Holiday", message:"No classes on March 20 due to local holiday.", time:"4 days ago", read:true },
];

const typeColor = (t) => t==="success"?"#10b981":t==="warning"?"#f59e0b":"#38bdf8";

export { SAMPLE_NOTIFICATIONS };

export default function NotificationsPanel({ onClose, notifications = [], setNotifications }) {
  const unread = notifications.filter(n => !n.read).length;

  const markRead = (id) => {
    setNotifications(notifications.map(n => n.id===id ? {...n, read:true} : n));
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({...n, read:true})));
  };

  const deleteNotif = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div style={{
      position:"fixed", top:"70px", right:"20px", zIndex:200,
      width:"380px", maxHeight:"520px",
      background:"#0a1628", border:"1px solid rgba(56,189,248,0.15)",
      borderRadius:"20px", boxShadow:"0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(56,189,248,0.06)",
      display:"flex", flexDirection:"column", overflow:"hidden",
      fontFamily:"'Outfit','Segoe UI',sans-serif",
      animation:"slideDown 0.2s ease",
    }}>
      <style>{`@keyframes slideDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }`}</style>

      {/* Header */}
      <div style={{ padding:"18px 20px", borderBottom:"1px solid rgba(56,189,248,0.08)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <span style={{ fontSize:"18px" }}>🔔</span>
          <div>
            <h3 style={{ fontSize:"15px", fontWeight:"700", color:"#f0f9ff", margin:0 }}>Notifications</h3>
            <p style={{ fontSize:"11px", color:"rgba(148,163,184,0.4)", margin:0 }}>{unread} unread</p>
          </div>
        </div>
        <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
          {unread > 0 && (
            <button onClick={markAllRead} style={{ padding:"5px 12px", background:"rgba(56,189,248,0.08)", border:"1px solid rgba(56,189,248,0.12)", borderRadius:"8px", color:"#38bdf8", cursor:"pointer", fontSize:"11px", fontWeight:"600" }}>
              Mark all read
            </button>
          )}
          <button onClick={onClose} style={{ width:"28px", height:"28px", background:"rgba(255,255,255,0.05)", border:"none", borderRadius:"8px", color:"rgba(148,163,184,0.6)", cursor:"pointer", fontSize:"14px", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>
      </div>

      {/* List */}
      <div style={{ overflowY:"auto", flex:1 }}>
        {notifications.length === 0 ? (
          <div style={{ padding:"50px 20px", textAlign:"center" }}>
            <div style={{ fontSize:"40px", marginBottom:"12px" }}>🔕</div>
            <p style={{ color:"rgba(148,163,184,0.3)", fontSize:"14px" }}>No notifications</p>
          </div>
        ) : notifications.map(n => (
          <div key={n.id} onClick={()=>markRead(n.id)} style={{
            padding:"14px 20px", borderBottom:"1px solid rgba(56,189,248,0.05)",
            background: n.read ? "transparent" : "rgba(56,189,248,0.03)",
            cursor:"pointer", transition:"background 0.2s", display:"flex", gap:"12px", alignItems:"flex-start",
          }}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(56,189,248,0.05)"}
            onMouseLeave={e=>e.currentTarget.style.background=n.read?"transparent":"rgba(56,189,248,0.03)"}
          >
            {/* Icon */}
            <div style={{ width:"38px", height:"38px", borderRadius:"10px", background:`${typeColor(n.type)}12`, border:`1px solid ${typeColor(n.type)}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", flexShrink:0 }}>{n.icon}</div>

            {/* Content */}
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"8px", marginBottom:"4px" }}>
                <span style={{ fontSize:"13px", fontWeight: n.read?"500":"700", color: n.read?"rgba(148,163,184,0.7)":"#f0f9ff" }}>{n.title}</span>
                {!n.read && <div style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#38bdf8", flexShrink:0, marginTop:"3px" }}/>}
              </div>
              <p style={{ fontSize:"12px", color:"rgba(148,163,184,0.45)", margin:"0 0 6px", lineHeight:1.4 }}>{n.message}</p>
              <span style={{ fontSize:"11px", color:"rgba(148,163,184,0.3)" }}>{n.time}</span>
            </div>

            {/* Delete */}
            <button onClick={e=>{e.stopPropagation();deleteNotif(n.id);}} style={{ background:"none", border:"none", color:"rgba(148,163,184,0.2)", cursor:"pointer", fontSize:"14px", padding:"2px", flexShrink:0, transition:"color 0.2s" }}
              onMouseEnter={e=>e.currentTarget.style.color="#f87171"}
              onMouseLeave={e=>e.currentTarget.style.color="rgba(148,163,184,0.2)"}
            >✕</button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding:"12px 20px", borderTop:"1px solid rgba(56,189,248,0.06)", textAlign:"center" }}>
        <span style={{ fontSize:"12px", color:"rgba(148,163,184,0.3)" }}>IT15 School Portal Notifications</span>
      </div>
    </div>
  );
}
