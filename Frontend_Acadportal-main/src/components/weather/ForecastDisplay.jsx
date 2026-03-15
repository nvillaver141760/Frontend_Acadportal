export default function ForecastDisplay({ weather, current, forecast, wIcon }) {
  return (
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
  );
}
