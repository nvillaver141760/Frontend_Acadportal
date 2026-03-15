import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight:"100vh", background:"#020c1b", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Outfit',sans-serif", color:"#e2e8f0" }}>
          <div style={{ textAlign:"center", maxWidth:"480px", padding:"30px" }}>
            <div style={{ fontSize:"50px", marginBottom:"15px" }}>❌</div>
            <h2 style={{ color:"#f0f9ff", marginBottom:"10px" }}>Something went wrong</h2>
            <p style={{ color:"rgba(148,163,184,0.6)", marginBottom:"20px" }}>{this.state.error?.message}</p>
            <button onClick={()=>window.location.reload()} style={{ padding:"10px 24px", background:"linear-gradient(135deg,#0ea5e9,#6366f1)", border:"none", borderRadius:"10px", color:"#fff", cursor:"pointer", fontSize:"14px" }}>Reload Page</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
