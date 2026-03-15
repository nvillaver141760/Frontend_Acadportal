import { useState, useEffect } from "react";
import NotificationsPanel, { SAMPLE_NOTIFICATIONS } from "../common/NotificationsPanel";
import axios from "axios";
import StudentsPage from "./StudentsPage";
import CoursesPage from "./CoursesPage";
import ProfilePage from "./ProfilePage";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
} from "recharts";

const API = "http://127.0.0.1:8000/api";
const COLORS = ["#38bdf8","#6366f1","#10b981","#f59e0b","#ec4899","#8b5cf6","#06b6d4","#f97316"];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { margin: 0; background: #020c1b; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #0a1628; }
  ::-webkit-scrollbar-thumb { background: rgba(56,189,248,0.3); border-radius: 3px; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
  @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
  .stat-card { animation: fadeUp 0.5s ease forwards; transition: transform 0.2s, box-shadow 0.2s; }
  .stat-card:hover { transform: translateY(-4px); }
  .nav-item { transition: all 0.2s; cursor: pointer; }
  .nav-item:hover { background: rgba(56,189,248,0.08) !important; color: #38bdf8 !important; }
`;

export default function Dashboard({ user, onLogout, token }) {
  const [stats, setStats] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherInput, setWeatherInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);

  useEffect(() => { fetchStats(); }, []);
  useEffect(() => { setUnreadCount(notifications.filter(n => !n.read).length); }, [notifications]);

  const fetchStats = async () => {
    setLoading(true); setError(null);
    try {
      const res = await axios.get(`${API}/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch {
      setError("Cannot connect to backend. Make sure 'php artisan serve' is running.");
    } finally { setLoading(false); }
  };

  const fetchWeather = async (city) => {
    setWeatherLoading(true); setWeatherError(null);
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=0dbc6b24344eb89c3d1a06284c7fdc89&units=metric`
      );
      setWeather(res.data);
    } catch { setWeatherError("City not found. Try another name."); }
    finally { setWeatherLoading(false); }
  };

  const wIcon = (m) => m==="Rain"?"🌧":m==="Clouds"?"☁️":m==="Clear"?"☀️":m==="Thunderstorm"?"⛈":m==="Snow"?"❄️":"🌤";
  const tip = { contentStyle:{ background:"#0a1628", border:"1px solid rgba(56,189,248,0.15)", borderRadius:"12px", color:"#e2e8f0", fontSize:"13px" }, cursor:false };

  const navItems = [
    { key:"overview", icon:"📊", label:"Overview" },
    { key:"enrollment", icon:"📈", label:"Enrollment" },
    { key:"attendance", icon:"📅", label:"Attendance" },
    { key:"weather", icon:"🌤", label:"Weather" },
    { key:"students", icon:"👨‍🎓", label:"Students" },
    { key:"courses", icon:"📚", label:"Courses" },
    { key:"profile", icon:"👤", label:"My Profile" },
  ];

  if (loading) return (
    <>
      <style>{css}</style>
      <div style={{ minHeight:"100vh", width:"100vw", background:"#020c1b", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Outfit',sans-serif", color:"#e2e8f0" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:"60px", marginBottom:"20px", animation:"pulse 1.5s infinite" }}>🎓</div>
          <p style={{ color:"#38bdf8", fontSize:"18px", fontWeight:"500" }}>Loading School Portal...</p>
          <p style={{ color:"rgba(148,163,184,0.4)", fontSize:"13px", marginTop:"8px" }}>Fetching dashboard data</p>
        </div>
      </div>
    </>
  );

  if (error) return (
    <>
      <style>{css}</style>
      <div style={{ minHeight:"100vh", width:"100vw", background:"#020c1b", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Outfit',sans-serif", color:"#e2e8f0" }}>
        <div style={{ textAlign:"center", maxWidth:"480px", padding:"30px" }}>
          <div style={{ fontSize:"50px", marginBottom:"15px" }}>❌</div>
          <p style={{ color:"#fca5a5", marginBottom:"20px", fontSize:"16px" }}>{error}</p>
          <button onClick={fetchStats} style={{ background:"linear-gradient(135deg,#0ea5e9,#6366f1)", border:"none", borderRadius:"12px", padding:"13px 28px", color:"#fff", cursor:"pointer", fontSize:"15px", fontWeight:"600" }}>Retry</button>
        </div>
      </div>
    </>
  );

  const current = weather?.list?.[0];
  const forecast = weather?.list?.filter((_,i)=>i%8===0).slice(0,5)||[];

  return (
    <>
      <style>{css}</style>
      <div style={{ display:"flex", minHeight:"100vh", width:"100vw", background:"#020c1b", fontFamily:"'Outfit',sans-serif", color:"#e2e8f0" }}>

        {/* SIDEBAR */}
        <div style={{
          width: sidebarOpen ? "260px" : "72px",
          minHeight: "100vh",
          background: "linear-gradient(180deg, #0a1628 0%, #071020 100%)",
          borderRight: "1px solid rgba(56,189,248,0.08)",
          transition: "width 0.3s ease",
          flexShrink: 0,
          display: "flex", flexDirection: "column",
          position: "relative", zIndex: 10,
        }}>
          {/* Logo */}
          <div style={{ padding: sidebarOpen ? "28px 24px 24px" : "28px 16px 24px", borderBottom: "1px solid rgba(56,189,248,0.06)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
              <div style={{
                width:"42px", height:"42px", flexShrink:0,
                background:"linear-gradient(135deg,#0ea5e9,#6366f1)",
                borderRadius:"12px", display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"22px", boxShadow:"0 0 20px rgba(14,165,233,0.25)",
              }}>🎓</div>
              {sidebarOpen && (
                <div>
                  <div style={{ fontSize:"16px", fontWeight:"700", color:"#f0f9ff", letterSpacing:"-0.3px" }}>School Portal</div>
                  <div style={{ fontSize:"11px", color:"rgba(148,163,184,0.5)" }}>IT15 System</div>
                </div>
              )}
            </div>
          </div>

          {/* Nav Items */}
          <nav style={{ padding:"16px 12px", flex:1 }}>
            {navItems.map(item => (
              <div key={item.key} className="nav-item" onClick={() => setActiveTab(item.key)} style={{
                display:"flex", alignItems:"center", gap:"12px",
                padding: sidebarOpen ? "13px 14px" : "13px",
                borderRadius:"12px", marginBottom:"4px",
                background: activeTab===item.key ? "rgba(56,189,248,0.1)" : "transparent",
                border: activeTab===item.key ? "1px solid rgba(56,189,248,0.15)" : "1px solid transparent",
                color: activeTab===item.key ? "#38bdf8" : "rgba(148,163,184,0.7)",
                fontWeight: activeTab===item.key ? "600" : "400",
                fontSize:"14px",
              }}>
                <span style={{ fontSize:"18px", flexShrink:0 }}>{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
                {sidebarOpen && activeTab===item.key && <div style={{ marginLeft:"auto", width:"6px", height:"6px", borderRadius:"50%", background:"#38bdf8" }}/>}
              </div>
            ))}
          </nav>

          {/* User */}
          <div style={{ padding:"16px 12px", borderTop:"1px solid rgba(56,189,248,0.06)" }}>
            {sidebarOpen ? (
              <div style={{ background:"rgba(56,189,248,0.05)", borderRadius:"12px", padding:"14px" }}>
                <div style={{ fontSize:"13px", fontWeight:"600", color:"#e2e8f0", marginBottom:"2px" }}>{user?.name||"Admin"}</div>
                <div style={{ fontSize:"11px", color:"rgba(148,163,184,0.5)", marginBottom:"12px" }}>{user?.email||"admin@school.edu"}</div>
                <button onClick={onLogout} style={{
                  width:"100%", padding:"9px", background:"rgba(239,68,68,0.1)",
                  border:"1px solid rgba(239,68,68,0.2)", borderRadius:"8px",
                  color:"#fca5a5", cursor:"pointer", fontSize:"13px", fontWeight:"500",
                }}>Sign Out</button>
              </div>
            ) : (
              <button onClick={onLogout} style={{ width:"100%", padding:"10px", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:"10px", color:"#fca5a5", cursor:"pointer", fontSize:"16px" }}>⏻</button>
            )}
          </div>

          {/* Toggle */}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
            position:"absolute", top:"32px", right:"-14px",
            width:"28px", height:"28px", borderRadius:"50%",
            background:"#0a1628", border:"1px solid rgba(56,189,248,0.2)",
            color:"#38bdf8", cursor:"pointer", fontSize:"12px",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>{sidebarOpen ? "◀" : "▶"}</button>
        </div>

        {/* MAIN CONTENT */}
        <div style={{ flex:1, overflow:"auto", background:"#020c1b" }}>
          {/* Top bar */}
          <div style={{
            padding:"20px 32px", borderBottom:"1px solid rgba(56,189,248,0.06)",
            background:"rgba(10,22,40,0.6)", backdropFilter:"blur(10px)",
            display:"flex", alignItems:"center", justifyContent:"space-between",
            position:"sticky", top:0, zIndex:5,
          }}>
            <div>
              <h2 style={{ fontSize:"22px", fontWeight:"700", color:"#f0f9ff", letterSpacing:"-0.3px" }}>
                {activeTab==="overview" ? "Dashboard Overview" :
                 activeTab==="enrollment" ? "Enrollment Analytics" :
                 activeTab==="attendance" ? "Attendance Tracking" : activeTab==="weather" ? "Weather Forecast" : activeTab==="students" ? "Student Management" : activeTab==="courses" ? "Course Management" : "Admin Profile"}
              </h2>
              <p style={{ fontSize:"13px", color:"rgba(148,163,184,0.5)", marginTop:"2px" }}>
                {new Date().toLocaleDateString("en", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
              </p>
            </div>
            <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
              <button onClick={()=>setShowNotifications(!showNotifications)} style={{
                position:"relative", padding:"8px 16px",
                background: showNotifications ? "rgba(56,189,248,0.15)" : "rgba(56,189,248,0.08)",
                border:"1px solid rgba(56,189,248,0.15)", borderRadius:"10px",
                color:"#38bdf8", cursor:"pointer", fontSize:"16px",
                display:"flex", alignItems:"center", gap:"8px",
              }}>
                🔔
                {unreadCount > 0 && (
                  <span style={{ position:"absolute", top:"-6px", right:"-6px", width:"20px", height:"20px", background:"linear-gradient(135deg,#ef4444,#dc2626)", borderRadius:"50%", fontSize:"11px", fontWeight:"700", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center" }}>{unreadCount}</span>
                )}
              </button>
              <div style={{
                padding:"8px 16px", background:"rgba(56,189,248,0.08)",
                border:"1px solid rgba(56,189,248,0.15)", borderRadius:"10px",
                fontSize:"13px", color:"#38bdf8", fontWeight:"500",
              }}>🟢 System Online</div>
            </div>
          </div>

          <div style={{ padding:"28px 32px" }}>

            {/* ── OVERVIEW ── */}
            {activeTab==="overview" && stats && (
              <>
                {/* Stat Cards */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:"20px", marginBottom:"28px" }}>
                  {[
                    { icon:"👨‍🎓", val:stats.total_students, lbl:"Total Students", sub:"Enrolled this year", color:"#38bdf8", delay:"0s" },
                    { icon:"✅", val:stats.active_students, lbl:"Active Students", sub:"Currently enrolled", color:"#10b981", delay:"0.1s" },
                    { icon:"📚", val:stats.total_courses, lbl:"Total Courses", sub:"Across all departments", color:"#6366f1", delay:"0.2s" },
                    { icon:"🏫", val:stats.active_courses, lbl:"Active Courses", sub:"Currently offered", color:"#f59e0b", delay:"0.3s" },
                  ].map(({icon,val,lbl,sub,color,delay}) => (
                    <div key={lbl} className="stat-card" style={{
                      background:`linear-gradient(135deg, rgba(10,22,40,0.9) 0%, rgba(7,16,32,0.9) 100%)`,
                      border:`1px solid ${color}25`,
                      borderRadius:"18px", padding:"26px",
                      animationDelay: delay,
                      boxShadow:`0 0 30px ${color}08`,
                      position:"relative", overflow:"hidden",
                    }}>
                      <div style={{ position:"absolute", top:"-20px", right:"-20px", width:"100px", height:"100px", background:`radial-gradient(circle, ${color}15 0%, transparent 70%)`, borderRadius:"50%" }}/>
                      <div style={{ fontSize:"28px", marginBottom:"14px" }}>{icon}</div>
                      <div style={{ fontSize:"42px", fontWeight:"800", color, letterSpacing:"-2px", lineHeight:1, fontFamily:"'JetBrains Mono',monospace" }}>{val}</div>
                      <div style={{ fontSize:"14px", fontWeight:"600", color:"#e2e8f0", marginTop:"8px" }}>{lbl}</div>
                      <div style={{ fontSize:"12px", color:"rgba(148,163,184,0.45)", marginTop:"3px" }}>{sub}</div>
                    </div>
                  ))}
                </div>

                {/* Charts */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px" }}>
                  <div style={{ background:"rgba(10,22,40,0.8)", border:"1px solid rgba(56,189,248,0.08)", borderRadius:"18px", padding:"26px" }}>
                    <div style={{ fontSize:"16px", fontWeight:"600", marginBottom:"6px", color:"#f0f9ff" }}>🎓 Students per Course</div>
                    <div style={{ fontSize:"12px", color:"rgba(148,163,184,0.4)", marginBottom:"22px" }}>Distribution across programs</div>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie data={stats.course_distribution} dataKey="count" nameKey="course" cx="50%" cy="50%" outerRadius={110} innerRadius={50}
                          label={({course,percent})=>`${course} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                          {stats.course_distribution.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                        </Pie>
                        <Tooltip {...tip}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div style={{ background:"rgba(10,22,40,0.8)", border:"1px solid rgba(56,189,248,0.08)", borderRadius:"18px", padding:"26px" }}>
                    <div style={{ fontSize:"16px", fontWeight:"600", marginBottom:"6px", color:"#f0f9ff" }}>📅 Monthly Enrollment</div>
                    <div style={{ fontSize:"12px", color:"rgba(148,163,184,0.4)", marginBottom:"22px" }}>Students enrolled per month</div>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={stats.enrollment_by_month} barSize={28}>
                        <defs>
                          <linearGradient id="barG" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#38bdf8"/>
                            <stop offset="100%" stopColor="#6366f1"/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,189,248,0.05)" vertical={false}/>
                        <XAxis dataKey="month" stroke="rgba(148,163,184,0.3)" tick={{fontSize:12, fill:"rgba(148,163,184,0.6)"}} axisLine={false} tickLine={false}/>
                        <YAxis stroke="rgba(148,163,184,0.3)" tick={{fontSize:12, fill:"rgba(148,163,184,0.6)"}} axisLine={false} tickLine={false}/>
                        <Tooltip {...tip}/>
                        <Bar dataKey="count" fill="url(#barG)" radius={[8,8,0,0]}/>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}

            {/* ── ENROLLMENT ── */}
            {activeTab==="enrollment" && stats && (
              <div style={{ display:"grid", gap:"20px" }}>
                <div style={{ background:"rgba(10,22,40,0.8)", border:"1px solid rgba(56,189,248,0.08)", borderRadius:"18px", padding:"26px" }}>
                  <div style={{ fontSize:"16px", fontWeight:"600", marginBottom:"6px", color:"#f0f9ff" }}>📈 Monthly Enrollment Trend</div>
                  <div style={{ fontSize:"12px", color:"rgba(148,163,184,0.4)", marginBottom:"22px" }}>Student enrollment patterns throughout the year</div>
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={stats.enrollment_by_month}>
                      <defs>
                        <linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,189,248,0.05)" vertical={false}/>
                      <XAxis dataKey="month" stroke="rgba(148,163,184,0.3)" tick={{fontSize:12,fill:"rgba(148,163,184,0.6)"}} axisLine={false} tickLine={false}/>
                      <YAxis stroke="rgba(148,163,184,0.3)" tick={{fontSize:12,fill:"rgba(148,163,184,0.6)"}} axisLine={false} tickLine={false}/>
                      <Tooltip {...tip}/>
                      <Area type="monotone" dataKey="count" stroke="#38bdf8" fill="url(#areaG)" strokeWidth={3} dot={{r:5,fill:"#38bdf8",strokeWidth:0}}/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ background:"rgba(10,22,40,0.8)", border:"1px solid rgba(56,189,248,0.08)", borderRadius:"18px", padding:"26px" }}>
                  <div style={{ fontSize:"16px", fontWeight:"600", marginBottom:"6px", color:"#f0f9ff" }}>📊 Top Courses by Enrollment</div>
                  <div style={{ fontSize:"12px", color:"rgba(148,163,184,0.4)", marginBottom:"22px" }}>Ranked by number of enrolled students</div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.course_distribution} layout="vertical" barSize={20}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,189,248,0.05)" horizontal={false}/>
                      <XAxis type="number" stroke="rgba(148,163,184,0.3)" tick={{fontSize:12,fill:"rgba(148,163,184,0.6)"}} axisLine={false} tickLine={false}/>
                      <YAxis type="category" dataKey="course" stroke="rgba(148,163,184,0.3)" tick={{fontSize:12,fill:"rgba(148,163,184,0.6)"}} axisLine={false} tickLine={false} width={80}/>
                      <Tooltip {...tip}/>
                      <Bar dataKey="count" radius={[0,8,8,0]}>
                        {stats.course_distribution.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* ── ATTENDANCE ── */}
            {activeTab==="attendance" && stats && (
              <div style={{ display:"grid", gap:"20px" }}>
                <div style={{ background:"rgba(10,22,40,0.8)", border:"1px solid rgba(56,189,248,0.08)", borderRadius:"18px", padding:"26px" }}>
                  <div style={{ fontSize:"16px", fontWeight:"600", marginBottom:"6px", color:"#f0f9ff" }}>📅 Attendance Patterns</div>
                  <div style={{ fontSize:"12px", color:"rgba(148,163,184,0.4)", marginBottom:"22px" }}>Daily present vs absent over school days</div>
                  <ResponsiveContainer width="100%" height={380}>
                    <LineChart data={stats.attendance_data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,189,248,0.05)" vertical={false}/>
                      <XAxis dataKey="date" stroke="rgba(148,163,184,0.3)" tick={{fontSize:11,fill:"rgba(148,163,184,0.6)"}} tickFormatter={d=>d?.slice(5)} axisLine={false} tickLine={false}/>
                      <YAxis stroke="rgba(148,163,184,0.3)" tick={{fontSize:12,fill:"rgba(148,163,184,0.6)"}} axisLine={false} tickLine={false}/>
                      <Tooltip {...tip} labelFormatter={l=>`Date: ${l}`}/>
                      <Line type="monotone" dataKey="present_count" stroke="#10b981" strokeWidth={3} dot={{r:6,fill:"#10b981",strokeWidth:0}} activeDot={{r:8}} name="Present"/>
                      <Line type="monotone" dataKey="absent_count" stroke="#f87171" strokeWidth={3} dot={{r:6,fill:"#f87171",strokeWidth:0}} activeDot={{r:8}} name="Absent"/>
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))", gap:"14px" }}>
                  {stats.attendance_data.map((d,i)=>(
                    <div key={i} style={{
                      background:"rgba(10,22,40,0.8)", border:"1px solid rgba(56,189,248,0.06)",
                      borderRadius:"14px", padding:"18px", textAlign:"center",
                      transition:"transform 0.2s",
                    }}>
                      <div style={{ fontSize:"11px", color:"rgba(148,163,184,0.4)", marginBottom:"10px", fontFamily:"'JetBrains Mono',monospace" }}>{d.date}</div>
                      <div style={{ fontSize:"26px", fontWeight:"800", color:"#10b981", fontFamily:"'JetBrains Mono',monospace" }}>{d.present_count}</div>
                      <div style={{ fontSize:"11px", color:"rgba(148,163,184,0.4)", marginTop:"4px" }}>Present</div>
                      <div style={{ marginTop:"10px", height:"4px", borderRadius:"2px", background:"rgba(56,189,248,0.1)", overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${(d.present_count/d.total_students*100).toFixed(0)}%`, background:"linear-gradient(90deg,#10b981,#38bdf8)", borderRadius:"2px" }}/>
                      </div>
                      <div style={{ fontSize:"10px", color:"rgba(148,163,184,0.3)", marginTop:"5px" }}>{(d.present_count/d.total_students*100).toFixed(0)}% attendance</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── WEATHER ── */}
            {activeTab==="weather" && (
              <div style={{ display:"grid", gap:"20px" }}>
                <div style={{ background:"rgba(10,22,40,0.8)", border:"1px solid rgba(56,189,248,0.08)", borderRadius:"18px", padding:"26px" }}>
                  <div style={{ fontSize:"16px", fontWeight:"600", marginBottom:"6px", color:"#f0f9ff" }}>🌤 Real-Time Weather Forecast</div>
                  <div style={{ fontSize:"12px", color:"rgba(148,163,184,0.4)", marginBottom:"22px" }}>Live weather data powered by OpenWeatherMap</div>

                  {/* Search */}
                  <div style={{ display:"flex", gap:"12px", marginBottom:"16px" }}>
                    <input value={weatherInput} onChange={e=>setWeatherInput(e.target.value)}
                      onKeyDown={e=>e.key==="Enter"&&weatherInput&&fetchWeather(weatherInput)}
                      placeholder="Search any city worldwide..."
                      style={{
                        flex:1, padding:"13px 18px",
                        background:"rgba(255,255,255,0.03)", border:"1px solid rgba(56,189,248,0.12)",
                        borderRadius:"12px", color:"#e2e8f0", fontSize:"14px", outline:"none",
                        fontFamily:"'Outfit',sans-serif",
                      }}/>
                    <button onClick={()=>weatherInput&&fetchWeather(weatherInput)} style={{
                      padding:"13px 24px", background:"linear-gradient(135deg,#0ea5e9,#6366f1)",
                      border:"none", borderRadius:"12px", color:"#fff", cursor:"pointer",
                      fontSize:"14px", fontWeight:"600", whiteSpace:"nowrap",
                      boxShadow:"0 0 20px rgba(14,165,233,0.2)",
                    }}>🔍 Search</button>
                  </div>

                  {/* Quick cities */}
                  <div style={{ display:"flex", gap:"8px", marginBottom:"24px", flexWrap:"wrap" }}>
                    {["Manila","Davao","Cebu","Makati","Quezon City","Baguio","Iloilo"].map(c=>(
                      <button key={c} onClick={()=>{setWeatherInput(c);fetchWeather(c);}} style={{
                        padding:"7px 16px", background:"rgba(56,189,248,0.06)",
                        border:"1px solid rgba(56,189,248,0.12)", borderRadius:"20px",
                        color:"rgba(148,163,184,0.7)", cursor:"pointer", fontSize:"13px",
                        transition:"all 0.2s", fontFamily:"'Outfit',sans-serif",
                      }}>{c}</button>
                    ))}
                  </div>

                  {weatherError && <p style={{ color:"#fca5a5", marginBottom:"16px", fontSize:"14px" }}>{weatherError}</p>}
                  {weatherLoading && (
                    <div style={{ textAlign:"center", padding:"40px", color:"rgba(148,163,184,0.5)" }}>
                      <div style={{ fontSize:"40px", marginBottom:"12px", animation:"pulse 1s infinite" }}>⏳</div>
                      <p>Fetching weather data...</p>
                    </div>
                  )}

                  {!weather && !weatherLoading && !weatherError && (
                    <div style={{ textAlign:"center", padding:"60px 20px" }}>
                      <div style={{ fontSize:"70px", marginBottom:"20px" }}>🌍</div>
                      <p style={{ color:"rgba(148,163,184,0.5)", fontSize:"16px" }}>Search for a city to view weather</p>
                      <p style={{ color:"rgba(148,163,184,0.3)", fontSize:"13px", marginTop:"6px" }}>Or click a quick city button above</p>
                    </div>
                  )}

                  {current && !weatherLoading && (
                    <>
                      {/* Current weather card */}
                      <div style={{
                        background:"linear-gradient(135deg, rgba(14,165,233,0.1) 0%, rgba(99,102,241,0.08) 100%)",
                        border:"1px solid rgba(56,189,248,0.15)", borderRadius:"16px",
                        padding:"28px", marginBottom:"24px",
                        display:"flex", alignItems:"center", gap:"30px", flexWrap:"wrap",
                      }}>
                        <div style={{ fontSize:"90px", lineHeight:1 }}>{wIcon(current.weather[0].main)}</div>
                        <div>
                          <div style={{ fontSize:"56px", fontWeight:"800", color:"#38bdf8", lineHeight:1, fontFamily:"'JetBrains Mono',monospace" }}>
                            {Math.round(current.main.temp)}°C
                          </div>
                          <div style={{ fontSize:"20px", color:"#f0f9ff", fontWeight:"600", margin:"8px 0 4px" }}>
                            {weather.city.name}, {weather.city.country}
                          </div>
                          <div style={{ fontSize:"14px", color:"rgba(148,163,184,0.6)", textTransform:"capitalize" }}>
                            {current.weather[0].description}
                          </div>
                        </div>
                        <div style={{ marginLeft:"auto", display:"grid", gap:"14px" }}>
                          {[
                            ["💧","Humidity",`${current.main.humidity}%`],
                            ["🌬️","Wind Speed",`${current.wind.speed} m/s`],
                            ["🌡️","Feels Like",`${Math.round(current.main.feels_like)}°C`],
                            ["👁️","Visibility",`${((current.visibility||10000)/1000).toFixed(1)} km`],
                          ].map(([icon,lbl,val])=>(
                            <div key={lbl} style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                              <span style={{ fontSize:"16px" }}>{icon}</span>
                              <span style={{ fontSize:"13px", color:"rgba(148,163,184,0.5)" }}>{lbl}:</span>
                              <span style={{ fontSize:"13px", color:"#38bdf8", fontWeight:"600", fontFamily:"'JetBrains Mono',monospace" }}>{val}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 5-day forecast */}
                      <div style={{ fontSize:"15px", fontWeight:"600", color:"#f0f9ff", marginBottom:"16px" }}>📆 5-Day Forecast</div>
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:"14px" }}>
                        {forecast.map((f,i)=>(
                          <div key={i} style={{
                            background: i===0 ? "rgba(56,189,248,0.08)" : "rgba(255,255,255,0.02)",
                            border: i===0 ? "1px solid rgba(56,189,248,0.2)" : "1px solid rgba(56,189,248,0.06)",
                            borderRadius:"14px", padding:"20px", textAlign:"center",
                          }}>
                            <div style={{ fontSize:"12px", color:"rgba(148,163,184,0.5)", marginBottom:"10px", fontWeight:"500" }}>
                              {new Date(f.dt*1000).toLocaleDateString("en",{weekday:"short",month:"short",day:"numeric"})}
                            </div>
                            <div style={{ fontSize:"38px", margin:"10px 0" }}>{wIcon(f.weather[0].main)}</div>
                            <div style={{ fontSize:"24px", fontWeight:"800", color:"#38bdf8", fontFamily:"'JetBrains Mono',monospace" }}>
                              {Math.round(f.main.temp)}°C
                            </div>
                            <div style={{ fontSize:"11px", color:"rgba(148,163,184,0.4)", marginTop:"6px", textTransform:"capitalize" }}>
                              {f.weather[0].description}
                            </div>
                            <div style={{ marginTop:"10px", display:"flex", justifyContent:"center", gap:"8px", fontSize:"11px", color:"rgba(148,163,184,0.4)" }}>
                              <span>💧{f.main.humidity}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ── STUDENTS ── */}
            {activeTab==="students" && <StudentsPage token={token} />}

            {/* ── NOTIFICATIONS ── */}


            {/* ── COURSES ── */}
            {activeTab==="courses" && <CoursesPage token={token} />}

            {/* ── PROFILE ── */}
            {activeTab==="profile" && <ProfilePage token={token} user={user} />}
          </div>
        </div>
        {/* Notifications Panel Overlay */}
        {showNotifications && (
          <>
            <div onClick={()=>setShowNotifications(false)} style={{ position:"fixed", inset:0, zIndex:199 }}/>
            <NotificationsPanel onClose={()=>setShowNotifications(false)} notifications={notifications} setNotifications={setNotifications} />
          </>
        )}
      </div>
    </>
  );
}
