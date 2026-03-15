import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  .row-hover:hover { background: rgba(56,189,248,0.04) !important; }
  .btn-hover:hover { opacity: 0.85; transform: translateY(-1px); }
  .modal-overlay { animation: fadeIn 0.2s ease; }
  .modal-box { animation: fadeUp 0.25s ease; }
`;

const COURSES = ["BSIT","BSCS","BSIS","BSED","BEED","BSN","BSBA","BSACCT","BSCRIM","BSPSYCH","BSCE","BSEE","BSME","BSARCH","BSFM","BSAG","BSHRM","BSTM","BSMATH","BSPHY"];
const STATUSES = ["Active","Inactive","Graduated","Dropped"];
const YEARS = ["1","2","3","4"];

const emptyForm = { first_name:"", last_name:"", email:"", gender:"Male", course:"BSIT", year_level:"1", status:"Active", address:"", phone:"", enrollment_date:"" };

export default function StudentsPage({ token }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null); // null | 'add' | 'edit' | 'delete'
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const PER_PAGE = 15;

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/students`, { headers: { Authorization: `Bearer ${token}` } });
      setStudents(res.data.data || res.data);
    } catch { setError("Failed to load students."); }
    finally { setLoading(false); }
  };

  const filtered = students.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !q || `${s.first_name} ${s.last_name} ${s.email} ${s.student_id}`.toLowerCase().includes(q);
    const matchCourse = !filterCourse || s.course === filterCourse;
    const matchStatus = !filterStatus || s.status === filterStatus;
    const matchYear = !filterYear || String(s.year_level) === filterYear;
    return matchSearch && matchCourse && matchStatus && matchYear;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  const openAdd = () => { setForm(emptyForm); setModal("add"); setError(""); };
  const openEdit = (s) => { setSelected(s); setForm({ first_name:s.first_name, last_name:s.last_name, email:s.email, gender:s.gender, course:s.course, year_level:String(s.year_level), status:s.status, address:s.address||"", phone:s.phone||"", enrollment_date:s.enrollment_date||"" }); setModal("edit"); setError(""); };
  const openDelete = (s) => { setSelected(s); setModal("delete"); };
  const closeModal = () => { setModal(null); setSelected(null); setError(""); };

  const handleSave = async () => {
    setSaving(true); setError("");
    try {
      if (modal === "add") {
        await axios.post(`${API}/students`, form, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.put(`${API}/students/${selected.id}`, form, { headers: { Authorization: `Bearer ${token}` } });
      }
      await fetchStudents();
      closeModal();
    } catch (e) {
      setError(e.response?.data?.message || "Failed to save. Check all fields.");
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await axios.delete(`${API}/students/${selected.id}`, { headers: { Authorization: `Bearer ${token}` } });
      await fetchStudents();
      closeModal();
    } catch { setError("Failed to delete student."); }
    finally { setSaving(false); }
  };

  const inp = (field, type="text", opts=null) => opts ? (
    <select value={form[field]} onChange={e=>setForm({...form,[field]:e.target.value})} style={selectStyle}>
      {opts.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
  ) : (
    <input type={type} value={form[field]} onChange={e=>setForm({...form,[field]:e.target.value}) } style={inputStyle} required/>
  );

  const statusColor = (s) => s==="Active"?"#10b981":s==="Graduated"?"#38bdf8":s==="Dropped"?"#f87171":"#f59e0b";

  return (
    <>
      <style>{css}</style>
      <div style={{ fontFamily:"'Outfit',sans-serif", color:"#e2e8f0" }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"24px" }}>
          <div>
            <h2 style={{ fontSize:"22px", fontWeight:"700", color:"#f0f9ff", letterSpacing:"-0.3px" }}>Student Management</h2>
            <p style={{ fontSize:"13px", color:"rgba(148,163,184,0.5)", marginTop:"3px" }}>
              {filtered.length} of {students.length} students
            </p>
          </div>
          <button className="btn-hover" onClick={openAdd} style={{
            padding:"11px 22px", background:"linear-gradient(135deg,#0ea5e9,#6366f1)",
            border:"none", borderRadius:"12px", color:"#fff", cursor:"pointer",
            fontSize:"14px", fontWeight:"600", transition:"all 0.2s",
            boxShadow:"0 0 20px rgba(14,165,233,0.2)",
          }}>+ Add Student</button>
        </div>

        {/* Filters */}
        <div style={{ display:"flex", gap:"12px", marginBottom:"20px", flexWrap:"wrap" }}>
          <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="🔍 Search name, email, ID..."
            style={{ flex:"1", minWidth:"220px", padding:"11px 16px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(56,189,248,0.12)", borderRadius:"10px", color:"#e2e8f0", fontSize:"14px", outline:"none", fontFamily:"'Outfit',sans-serif" }}/>
          <select value={filterCourse} onChange={e=>{setFilterCourse(e.target.value);setPage(1);}} style={{...selectStyle, minWidth:"130px"}}>
            <option value="">All Courses</option>
            {COURSES.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filterStatus} onChange={e=>{setFilterStatus(e.target.value);setPage(1);}} style={{...selectStyle, minWidth:"130px"}}>
            <option value="">All Status</option>
            {STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterYear} onChange={e=>{setFilterYear(e.target.value);setPage(1);}} style={{...selectStyle, minWidth:"110px"}}>
            <option value="">All Years</option>
            {YEARS.map(y=><option key={y} value={y}>Year {y}</option>)}
          </select>
          {(search||filterCourse||filterStatus||filterYear) && (
            <button onClick={()=>{setSearch("");setFilterCourse("");setFilterStatus("");setFilterYear("");setPage(1);}} style={{ padding:"11px 16px", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:"10px", color:"#fca5a5", cursor:"pointer", fontSize:"13px" }}>✕ Clear</button>
          )}
        </div>

        {/* Table */}
        <div style={{ background:"rgba(10,22,40,0.8)", border:"1px solid rgba(56,189,248,0.08)", borderRadius:"18px", overflow:"hidden" }}>
          {loading ? (
            <div style={{ padding:"60px", textAlign:"center", color:"rgba(148,163,184,0.4)" }}>Loading students...</div>
          ) : (
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ borderBottom:"1px solid rgba(56,189,248,0.08)" }}>
                    {["Student ID","Name","Email","Course","Year","Status","Actions"].map(h=>(
                      <th key={h} style={{ padding:"14px 18px", textAlign:"left", fontSize:"12px", fontWeight:"600", color:"rgba(148,163,184,0.5)", letterSpacing:"0.5px", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr><td colSpan={7} style={{ padding:"50px", textAlign:"center", color:"rgba(148,163,184,0.3)", fontSize:"15px" }}>No students found</td></tr>
                  ) : paginated.map((s,i)=>(
                    <tr key={s.id} className="row-hover" style={{ borderBottom:"1px solid rgba(56,189,248,0.04)", background: i%2===0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                      <td style={{ padding:"13px 18px", fontSize:"13px", color:"rgba(148,163,184,0.5)", fontFamily:"'JetBrains Mono',monospace" }}>{s.student_id}</td>
                      <td style={{ padding:"13px 18px", fontSize:"14px", fontWeight:"500", color:"#f0f9ff", whiteSpace:"nowrap" }}>{s.first_name} {s.last_name}</td>
                      <td style={{ padding:"13px 18px", fontSize:"13px", color:"rgba(148,163,184,0.6)" }}>{s.email}</td>
                      <td style={{ padding:"13px 18px" }}>
                        <span style={{ fontSize:"12px", fontWeight:"600", padding:"4px 10px", borderRadius:"6px", background:"rgba(56,189,248,0.08)", color:"#38bdf8" }}>{s.course}</span>
                      </td>
                      <td style={{ padding:"13px 18px", fontSize:"13px", color:"rgba(148,163,184,0.6)", textAlign:"center" }}>{s.year_level}</td>
                      <td style={{ padding:"13px 18px" }}>
                        <span style={{ fontSize:"12px", fontWeight:"600", padding:"4px 12px", borderRadius:"20px", background:`${statusColor(s.status)}18`, color:statusColor(s.status), border:`1px solid ${statusColor(s.status)}30` }}>{s.status}</span>
                      </td>
                      <td style={{ padding:"13px 18px" }}>
                        <div style={{ display:"flex", gap:"8px" }}>
                          <button onClick={()=>openEdit(s)} style={{ padding:"6px 14px", background:"rgba(56,189,248,0.08)", border:"1px solid rgba(56,189,248,0.15)", borderRadius:"8px", color:"#38bdf8", cursor:"pointer", fontSize:"13px", fontWeight:"500" }}>Edit</button>
                          <button onClick={()=>openDelete(s)} style={{ padding:"6px 14px", background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.15)", borderRadius:"8px", color:"#f87171", cursor:"pointer", fontSize:"13px", fontWeight:"500" }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display:"flex", justifyContent:"center", gap:"8px", marginTop:"20px", alignItems:"center" }}>
            <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{ padding:"8px 16px", background:"rgba(56,189,248,0.08)", border:"1px solid rgba(56,189,248,0.12)", borderRadius:"8px", color: page===1?"rgba(148,163,184,0.3)":"#38bdf8", cursor: page===1?"not-allowed":"pointer", fontSize:"13px" }}>← Prev</button>
            {Array.from({length:Math.min(5,totalPages)},(_,i)=>{
              let p = page <= 3 ? i+1 : page-2+i;
              if(p > totalPages) return null;
              return <button key={p} onClick={()=>setPage(p)} style={{ padding:"8px 14px", background: p===page?"linear-gradient(135deg,#0ea5e9,#6366f1)":"rgba(56,189,248,0.08)", border:"none", borderRadius:"8px", color: p===page?"#fff":"rgba(148,163,184,0.6)", cursor:"pointer", fontSize:"13px", fontWeight: p===page?"600":"400" }}>{p}</button>;
            })}
            <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} style={{ padding:"8px 16px", background:"rgba(56,189,248,0.08)", border:"1px solid rgba(56,189,248,0.12)", borderRadius:"8px", color: page===totalPages?"rgba(148,163,184,0.3)":"#38bdf8", cursor: page===totalPages?"not-allowed":"pointer", fontSize:"13px" }}>Next →</button>
            <span style={{ fontSize:"13px", color:"rgba(148,163,184,0.4)", marginLeft:"8px" }}>Page {page} of {totalPages}</span>
          </div>
        )}

        {/* Add/Edit Modal */}
        {(modal==="add"||modal==="edit") && (
          <div className="modal-overlay" onClick={closeModal} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", backdropFilter:"blur(6px)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
            <div className="modal-box" onClick={e=>e.stopPropagation()} style={{ background:"#0a1628", border:"1px solid rgba(56,189,248,0.15)", borderRadius:"20px", padding:"32px", width:"100%", maxWidth:"600px", maxHeight:"90vh", overflowY:"auto" }}>
              <h3 style={{ fontSize:"20px", fontWeight:"700", color:"#f0f9ff", marginBottom:"6px" }}>{modal==="add"?"Add New Student":"Edit Student"}</h3>
              <p style={{ fontSize:"13px", color:"rgba(148,163,184,0.4)", marginBottom:"24px" }}>{modal==="add"?"Fill in student details below":"Update student information"}</p>
              {error && <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:"10px", padding:"12px", color:"#fca5a5", fontSize:"13px", marginBottom:"18px" }}>{error}</div>}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
                {[["first_name","First Name"],["last_name","Last Name"]].map(([f,l])=>(
                  <div key={f}><label style={labelStyle}>{l}</label>{inp(f)}</div>
                ))}
                <div style={{ gridColumn:"1/-1" }}><label style={labelStyle}>Email</label>{inp("email","email")}</div>
                <div><label style={labelStyle}>Gender</label>{inp("gender","text",["Male","Female"])}</div>
                <div><label style={labelStyle}>Course</label>{inp("course","text",COURSES)}</div>
                <div><label style={labelStyle}>Year Level</label>{inp("year_level","text",YEARS)}</div>
                <div><label style={labelStyle}>Status</label>{inp("status","text",STATUSES)}</div>
                <div><label style={labelStyle}>Phone</label>{inp("phone","tel")}</div>
                <div><label style={labelStyle}>Enrollment Date</label>{inp("enrollment_date","date")}</div>
                <div style={{ gridColumn:"1/-1" }}><label style={labelStyle}>Address</label>{inp("address")}</div>
              </div>
              <div style={{ display:"flex", gap:"12px", marginTop:"24px", justifyContent:"flex-end" }}>
                <button onClick={closeModal} style={{ padding:"11px 22px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"10px", color:"rgba(148,163,184,0.7)", cursor:"pointer", fontSize:"14px" }}>Cancel</button>
                <button onClick={handleSave} disabled={saving} style={{ padding:"11px 26px", background:"linear-gradient(135deg,#0ea5e9,#6366f1)", border:"none", borderRadius:"10px", color:"#fff", cursor:saving?"not-allowed":"pointer", fontSize:"14px", fontWeight:"600" }}>{saving?"Saving...":modal==="add"?"Add Student":"Save Changes"}</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {modal==="delete" && (
          <div className="modal-overlay" onClick={closeModal} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", backdropFilter:"blur(6px)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div className="modal-box" onClick={e=>e.stopPropagation()} style={{ background:"#0a1628", border:"1px solid rgba(239,68,68,0.2)", borderRadius:"20px", padding:"32px", width:"100%", maxWidth:"420px", textAlign:"center" }}>
              <div style={{ fontSize:"50px", marginBottom:"16px" }}>🗑️</div>
              <h3 style={{ fontSize:"20px", fontWeight:"700", color:"#f0f9ff", marginBottom:"10px" }}>Delete Student?</h3>
              <p style={{ color:"rgba(148,163,184,0.6)", fontSize:"14px", marginBottom:"24px" }}>
                Are you sure you want to delete <strong style={{ color:"#f0f9ff" }}>{selected?.first_name} {selected?.last_name}</strong>? This cannot be undone.
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
    </>
  );
}

const inputStyle = { width:"100%", padding:"11px 14px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(56,189,248,0.12)", borderRadius:"10px", color:"#e2e8f0", fontSize:"14px", outline:"none", boxSizing:"border-box", fontFamily:"'Outfit',sans-serif" };
const selectStyle = { padding:"11px 14px", background:"rgba(10,22,40,0.9)", border:"1px solid rgba(56,189,248,0.12)", borderRadius:"10px", color:"#e2e8f0", fontSize:"14px", outline:"none", cursor:"pointer", fontFamily:"'Outfit',sans-serif" };
const labelStyle = { fontSize:"12px", color:"rgba(148,163,184,0.6)", fontWeight:"500", display:"block", marginBottom:"7px" };
