import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

const DEPARTMENTS = ["IT","CS","Education","Health","Business","Criminology","Social Sciences","Engineering","Architecture","Agriculture","Sciences"];
const emptyForm = { code:"", name:"", department:"IT", units:"3", description:"", status:"Active" };

export default function CoursesPage({ token }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/courses`, { headers: { Authorization: `Bearer ${token}` } });
      setCourses(res.data.data || res.data);
    } catch { setError("Failed to load courses."); }
    finally { setLoading(false); }
  };

  const filtered = courses.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || `${c.code} ${c.name} ${c.department}`.toLowerCase().includes(q);
    const matchDept = !filterDept || c.department === filterDept;
    return matchSearch && matchDept;
  });

  const openAdd = () => { setForm(emptyForm); setModal("add"); setError(""); };
  const openEdit = (c) => { setSelected(c); setForm({ code:c.code, name:c.name, department:c.department, units:String(c.units), description:c.description||"", status:c.status }); setModal("edit"); setError(""); };
  const openDelete = (c) => { setSelected(c); setModal("delete"); };
  const closeModal = () => { setModal(null); setSelected(null); setError(""); };

  const handleSave = async () => {
    setSaving(true); setError("");
    try {
      if (modal === "add") {
        await axios.post(`${API}/courses`, form, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.put(`${API}/courses/${selected.id}`, form, { headers: { Authorization: `Bearer ${token}` } });
      }
      await fetchCourses();
      closeModal();
    } catch (e) {
      setError(e.response?.data?.message || "Failed to save. Check all fields.");
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await axios.delete(`${API}/courses/${selected.id}`, { headers: { Authorization: `Bearer ${token}` } });
      await fetchCourses();
      closeModal();
    } catch { setError("Failed to delete course."); }
    finally { setSaving(false); }
  };

  const inp = (field, type="text", opts=null) => opts ? (
    <select value={form[field]} onChange={e=>setForm({...form,[field]:e.target.value})} style={selectStyle}>
      {opts.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
  ) : (
    <input type={type} value={form[field]} onChange={e=>setForm({...form,[field]:e.target.value})} style={inputStyle}/>
  );

  const deptColor = (d) => {
    const map = { IT:"#38bdf8", CS:"#6366f1", Education:"#10b981", Health:"#ec4899", Business:"#f59e0b", Engineering:"#f97316", Sciences:"#8b5cf6" };
    return map[d] || "#94a3b8";
  };

  return (
    <div style={{ fontFamily:"'Outfit',sans-serif", color:"#e2e8f0" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"24px" }}>
        <div>
          <h2 style={{ fontSize:"22px", fontWeight:"700", color:"#f0f9ff", letterSpacing:"-0.3px" }}>Course Management</h2>
          <p style={{ fontSize:"13px", color:"rgba(148,163,184,0.5)", marginTop:"3px" }}>{filtered.length} of {courses.length} courses</p>
        </div>
        <button onClick={openAdd} style={{ padding:"11px 22px", background:"linear-gradient(135deg,#0ea5e9,#6366f1)", border:"none", borderRadius:"12px", color:"#fff", cursor:"pointer", fontSize:"14px", fontWeight:"600", boxShadow:"0 0 20px rgba(14,165,233,0.2)" }}>+ Add Course</button>
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:"12px", marginBottom:"20px", flexWrap:"wrap" }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search course code or name..."
          style={{ flex:"1", minWidth:"220px", padding:"11px 16px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(56,189,248,0.12)", borderRadius:"10px", color:"#e2e8f0", fontSize:"14px", outline:"none", fontFamily:"'Outfit',sans-serif" }}/>
        <select value={filterDept} onChange={e=>setFilterDept(e.target.value)} style={{...selectStyle, minWidth:"160px"}}>
          <option value="">All Departments</option>
          {DEPARTMENTS.map(d=><option key={d} value={d}>{d}</option>)}
        </select>
        {(search||filterDept) && (
          <button onClick={()=>{setSearch("");setFilterDept("");}} style={{ padding:"11px 16px", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:"10px", color:"#fca5a5", cursor:"pointer", fontSize:"13px" }}>✕ Clear</button>
        )}
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div style={{ padding:"60px", textAlign:"center", color:"rgba(148,163,184,0.4)" }}>Loading courses...</div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"16px" }}>
          {filtered.length === 0 ? (
            <div style={{ gridColumn:"1/-1", padding:"50px", textAlign:"center", background:"rgba(10,22,40,0.8)", borderRadius:"16px", color:"rgba(148,163,184,0.3)" }}>No courses found</div>
          ) : filtered.map(c=>(
            <div key={c.id} style={{ background:"rgba(10,22,40,0.8)", border:"1px solid rgba(56,189,248,0.08)", borderRadius:"16px", padding:"22px", position:"relative", overflow:"hidden", transition:"transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 8px 30px ${deptColor(c.department)}15`;}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
              <div style={{ position:"absolute", top:0, right:0, width:"80px", height:"80px", background:`radial-gradient(circle, ${deptColor(c.department)}12 0%, transparent 70%)`, borderRadius:"0 16px 0 0" }}/>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"12px" }}>
                <span style={{ fontSize:"22px", fontWeight:"800", color:deptColor(c.department), fontFamily:"'JetBrains Mono',monospace", letterSpacing:"-0.5px" }}>{c.code}</span>
                <span style={{ fontSize:"11px", padding:"4px 10px", borderRadius:"20px", background: c.status==="Active"?"rgba(16,185,129,0.1)":"rgba(239,68,68,0.1)", color: c.status==="Active"?"#10b981":"#f87171", border:`1px solid ${c.status==="Active"?"rgba(16,185,129,0.2)":"rgba(239,68,68,0.2)"}`, fontWeight:"600" }}>{c.status}</span>
              </div>
              <div style={{ fontSize:"15px", fontWeight:"600", color:"#f0f9ff", marginBottom:"6px" }}>{c.name}</div>
              <div style={{ fontSize:"12px", color:"rgba(148,163,184,0.5)", marginBottom:"14px" }}>
                <span style={{ padding:"3px 10px", background:`${deptColor(c.department)}15`, color:deptColor(c.department), borderRadius:"6px", fontWeight:"500", marginRight:"8px" }}>{c.department}</span>
                {c.units} units
              </div>
              {c.description && <p style={{ fontSize:"13px", color:"rgba(148,163,184,0.4)", marginBottom:"16px", lineHeight:"1.5" }}>{c.description}</p>}
              <div style={{ display:"flex", gap:"8px", marginTop:"auto" }}>
                <button onClick={()=>openEdit(c)} style={{ flex:1, padding:"8px", background:"rgba(56,189,248,0.08)", border:"1px solid rgba(56,189,248,0.15)", borderRadius:"8px", color:"#38bdf8", cursor:"pointer", fontSize:"13px", fontWeight:"500" }}>✏️ Edit</button>
                <button onClick={()=>openDelete(c)} style={{ flex:1, padding:"8px", background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.15)", borderRadius:"8px", color:"#f87171", cursor:"pointer", fontSize:"13px", fontWeight:"500" }}>🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {(modal==="add"||modal==="edit") && (
        <div onClick={closeModal} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", backdropFilter:"blur(6px)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:"#0a1628", border:"1px solid rgba(56,189,248,0.15)", borderRadius:"20px", padding:"32px", width:"100%", maxWidth:"540px", maxHeight:"90vh", overflowY:"auto" }}>
            <h3 style={{ fontSize:"20px", fontWeight:"700", color:"#f0f9ff", marginBottom:"6px" }}>{modal==="add"?"Add New Course":"Edit Course"}</h3>
            <p style={{ fontSize:"13px", color:"rgba(148,163,184,0.4)", marginBottom:"24px" }}>Fill in the course details below</p>
            {error && <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:"10px", padding:"12px", color:"#fca5a5", fontSize:"13px", marginBottom:"18px" }}>{error}</div>}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
              <div><label style={labelStyle}>Course Code</label>{inp("code")}</div>
              <div><label style={labelStyle}>Units</label>{inp("units","number")}</div>
              <div style={{ gridColumn:"1/-1" }}><label style={labelStyle}>Course Name</label>{inp("name")}</div>
              <div><label style={labelStyle}>Department</label>{inp("department","text",DEPARTMENTS)}</div>
              <div><label style={labelStyle}>Status</label>{inp("status","text",["Active","Inactive"])}</div>
              <div style={{ gridColumn:"1/-1" }}><label style={labelStyle}>Description</label>
                <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={3}
                  style={{ ...inputStyle, resize:"vertical" }}/>
              </div>
            </div>
            <div style={{ display:"flex", gap:"12px", marginTop:"24px", justifyContent:"flex-end" }}>
              <button onClick={closeModal} style={{ padding:"11px 22px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"10px", color:"rgba(148,163,184,0.7)", cursor:"pointer", fontSize:"14px" }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{ padding:"11px 26px", background:"linear-gradient(135deg,#0ea5e9,#6366f1)", border:"none", borderRadius:"10px", color:"#fff", cursor:saving?"not-allowed":"pointer", fontSize:"14px", fontWeight:"600" }}>{saving?"Saving...":modal==="add"?"Add Course":"Save Changes"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {modal==="delete" && (
        <div onClick={closeModal} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", backdropFilter:"blur(6px)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:"#0a1628", border:"1px solid rgba(239,68,68,0.2)", borderRadius:"20px", padding:"32px", width:"100%", maxWidth:"400px", textAlign:"center" }}>
            <div style={{ fontSize:"50px", marginBottom:"16px" }}>🗑️</div>
            <h3 style={{ fontSize:"20px", fontWeight:"700", color:"#f0f9ff", marginBottom:"10px" }}>Delete Course?</h3>
            <p style={{ color:"rgba(148,163,184,0.6)", fontSize:"14px", marginBottom:"24px" }}>
              Are you sure you want to delete <strong style={{ color:"#f0f9ff" }}>{selected?.code} - {selected?.name}</strong>?
            </p>
            {error && <p style={{ color:"#fca5a5", fontSize:"13px", marginBottom:"16px" }}>{error}</p>}
            <div style={{ display:"flex", gap:"12px", justifyContent:"center" }}>
              <button onClick={closeModal} style={{ padding:"11px 24px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"10px", color:"rgba(148,163,184,0.7)", cursor:"pointer", fontSize:"14px" }}>Cancel</button>
              <button onClick={handleDelete} disabled={saving} style={{ padding:"11px 24px", background:"linear-gradient(135deg,#ef4444,#dc2626)", border:"none", borderRadius:"10px", color:"#fff", cursor:saving?"not-allowed":"pointer", fontSize:"14px", fontWeight:"600" }}>{saving?"Deleting...":"Delete"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = { width:"100%", padding:"11px 14px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(56,189,248,0.12)", borderRadius:"10px", color:"#e2e8f0", fontSize:"14px", outline:"none", boxSizing:"border-box", fontFamily:"'Outfit',sans-serif" };
const selectStyle = { padding:"11px 14px", background:"rgba(10,22,40,0.9)", border:"1px solid rgba(56,189,248,0.12)", borderRadius:"10px", color:"#e2e8f0", fontSize:"14px", outline:"none", cursor:"pointer", fontFamily:"'Outfit',sans-serif" };
const labelStyle = { fontSize:"12px", color:"rgba(148,163,184,0.6)", fontWeight:"500", display:"block", marginBottom:"7px" };
