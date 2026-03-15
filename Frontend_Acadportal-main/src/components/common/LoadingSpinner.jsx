export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
      <div style={{ minHeight:"100vh", width:"100vw", background:"#020c1b", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Outfit',sans-serif", color:"#e2e8f0" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:"60px", marginBottom:"20px", animation:"pulse 1.5s infinite" }}>🎓</div>
          <p style={{ color:"#38bdf8", fontSize:"18px", fontWeight:"500" }}>{message}</p>
          <div style={{ width:"40px", height:"40px", border:"3px solid rgba(56,189,248,0.15)", borderTopColor:"#38bdf8", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"16px auto 0" }}/>
        </div>
      </div>
    </>
  );
}
