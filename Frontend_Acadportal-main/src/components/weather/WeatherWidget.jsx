import { useState } from "react";
import axios from "axios";
import ForecastDisplay from "./ForecastDisplay";

const API_KEY = "0dbc6b24344eb89c3d1a06284c7fdc89";

const wIcon = (m) => m==="Rain"?"🌧":m==="Clouds"?"☁️":m==="Clear"?"☀️":m==="Thunderstorm"?"⛈":m==="Snow"?"❄️":"🌤";

export default function WeatherWidget() {
  const [weather, setWeather]           = useState(null);
  const [weatherInput, setWeatherInput] = useState("");
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);

  const fetchWeather = async (city) => {
    setWeatherLoading(true); setWeatherError(null);
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(res.data);
    } catch { setWeatherError("City not found. Try another name."); }
    finally { setWeatherLoading(false); }
  };

  const current  = weather?.list?.[0];
  const forecast = weather?.list?.filter((_,i)=>i%8===0).slice(0,5) || [];

  return (
    <div style={{ fontFamily:"'Outfit',sans-serif", color:"#e2e8f0" }}>
      <div style={{ fontSize:"16px", fontWeight:"600", marginBottom:"6px", color:"#f0f9ff" }}>🌤 Real-Time Weather Forecast</div>
      <div style={{ fontSize:"12px", color:"rgba(148,163,184,0.4)", marginBottom:"22px" }}>Live weather data powered by OpenWeatherMap</div>

      {/* Search */}
      <div style={{ display:"flex", gap:"12px", marginBottom:"16px" }}>
        <input value={weatherInput} onChange={e=>setWeatherInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&weatherInput&&fetchWeather(weatherInput)}
          placeholder="Enter city name..." style={{ flex:1, padding:"12px 16px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(56,189,248,0.15)", borderRadius:"12px", color:"#e2e8f0", fontSize:"14px", outline:"none", fontFamily:"'Outfit',sans-serif" }}/>
        <button onClick={()=>weatherInput&&fetchWeather(weatherInput)} style={{ padding:"12px 24px", background:"linear-gradient(135deg,#0ea5e9,#6366f1)", border:"none", borderRadius:"12px", color:"#fff", cursor:"pointer", fontSize:"14px", fontWeight:"600" }}>
          🔍 Search
        </button>
      </div>

      {/* Quick city pills */}
      <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"20px" }}>
        {["Manila","Davao","Cebu","Makati","Quezon City","Baguio","Iloilo"].map(c=>(
          <button key={c} onClick={()=>{setWeatherInput(c);fetchWeather(c);}} style={{ padding:"6px 14px", background:"rgba(56,189,248,0.06)", border:"1px solid rgba(56,189,248,0.12)", borderRadius:"20px", color:"rgba(148,163,184,0.7)", cursor:"pointer", fontSize:"12px", fontWeight:"500" }}>{c}</button>
        ))}
      </div>

      {weatherError && <p style={{ color:"#fca5a5", marginBottom:"16px", fontSize:"14px" }}>{weatherError}</p>}

      {weatherLoading && (
        <div style={{ textAlign:"center", padding:"40px", color:"rgba(148,163,184,0.5)" }}>
          <p>Fetching weather data...</p>
        </div>
      )}

      {!weather && !weatherLoading && !weatherError && (
        <div style={{ textAlign:"center", padding:"50px 0" }}>
          <div style={{ fontSize:"60px", marginBottom:"16px" }}>🌍</div>
          <p style={{ color:"rgba(148,163,184,0.5)", fontSize:"16px" }}>Search for a city to view weather</p>
        </div>
      )}

      {current && !weatherLoading && (
        <ForecastDisplay weather={weather} current={current} forecast={forecast} wIcon={wIcon} />
      )}
    </div>
  );
}
