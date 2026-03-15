import axios from "axios";

const WEATHER_API_KEY = "0dbc6b24344eb89c3d1a06284c7fdc89";
const WEATHER_BASE    = "https://api.openweathermap.org/data/2.5";

export const weatherApi = {
  getForecast: (city) =>
    axios.get(`${WEATHER_BASE}/forecast?q=${city}&appid=${WEATHER_API_KEY}&units=metric`),

  getCurrent: (city) =>
    axios.get(`${WEATHER_BASE}/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`),
};

export default weatherApi;
