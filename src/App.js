import { useState, useEffect } from "react";
import "./App.css";
import { fetchWeather, selectAllWeather } from "./redux/WeatherSlice";
import { useDispatch, useSelector } from "react-redux";

function App() {
  const dispatch = useDispatch();
  const weatherData = useSelector(selectAllWeather);
  const loading = useSelector((state) => state.weather.loading);
  const error = useSelector((state) => state.weather.error);
  const [city, setCity] = useState("İstanbul");

  useEffect(() => {
    dispatch(fetchWeather(city));
  }, [city, dispatch]);

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  return (
    <div className="App">
      <h1>Türkiye Hava Durumu</h1>
      <select onChange={handleCityChange} value={city}>
        <option value="İstanbul">İstanbul</option>
        <option value="Ankara">Ankara</option>
        <option value="İzmir">İzmir</option>
        <option value="Bursa">Bursa</option>
        <option value="Bursa">Adana</option>
      </select>
      {loading === "pending" && <p>Yükleniyor...</p>}
      {error && <p>Bir hata oluştu: {error}</p>}
      {loading === "succeeded" && weatherData.length > 0 && (
        <div>
          <h2>{city} Hava Durumu</h2>
            {weatherData.map((weather) => (
              <div key={weather.dt} className="weather-card">
                <h3>{new Date(weather.dt * 1000).toLocaleDateString()}</h3>
                <p>Durum: {weather.weather[0].description}</p>
                <p>Sıcaklık: {weather.main.temp}°C</p>
                <img
                  src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                  alt={weather.weather[0].description}
                />
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default App;
