import React, { useState } from 'react';
import axios from 'axios';
import "../styles/weatherDisplay.css";

const WeatherDisplay = ({ setWeatherData }) => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    console.log("Weather state before rendering:", weather);
    const getWeatherEmoji = (description) => {
        if (!description || typeof description !== "string") return "🌍";
        const lowerDesc = description.toLowerCase();
        if (lowerDesc.includes("clear")) return "☀️";
        if (lowerDesc.includes("cloud")) return "☁️";
        if (lowerDesc.includes("rain")) return "🌧️";
        if (lowerDesc.includes("thunderstorm")) return "⛈️";
        if (lowerDesc.includes("drizzle")) return "🌦️";
        if (lowerDesc.includes("snow")) return "❄️";
        if (lowerDesc.includes("fog") || lowerDesc.includes("mist") || lowerDesc.includes("smoke")) return "🌫️";
        return "🌍";
    };

    const fetchWeather = async () => {
        if (!city.trim()) return; // Prevent empty requests
        setLoading(true);
        setError(null);

        try {
            console.log("Fetching weather for:", city);
            setWeather(null);
            // Fetch current weather
            const response = await axios.get(`http://localhost:5000/api/weather/current/${encodeURIComponent(city)}`);
            console.log("Weather Data:", response.data);
            setWeather(response.data || null);
            if (setWeatherData) setWeatherData(response.data);

            // Fetch weather prediction
            const predictionResponse = await axios.get(`http://localhost:5000/api/weather/predict/${encodeURIComponent(city)}`);
            console.log("Prediction Data:", predictionResponse.data);

            if (predictionResponse.data && predictionResponse.data.prediction) {
                setPrediction(predictionResponse.data.prediction);
            } else {
                console.warn("Prediction data is missing or incomplete.");
                setPrediction(null);
            }

            setCity('');

        } catch (error) {
            console.error("Error fetching weather:", error?.response?.data || error.message);
            setWeather(null);
            setError(error?.response?.data?.error || "An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    console.log("Weather state:", weather);  // 🔍 Add here to debug


    return (
        <div className='weather-container'>
            <h1>AI Weather App</h1>
            <input 
                type="text" 
                value={city} 
                onChange={(e) => setCity(e.target.value)} 
                placeholder="Enter city" 
                className="weather-input"
            />
            <button onClick={fetchWeather} className="weather-button">Get Weather</button>

            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}

            {weather && weather.city ? (
                <div className="weather-details">
                    <h2>{weather.city || "Unknown Location"}</h2>
                    <p>Temperature: {weather.main?.temp ?? weather.temperature ?? "N/A"}°C</p>
                    <p>Weather: {weather.weather} {getWeatherEmoji(weather.weather)}</p>
                    <p>Humidity: {weather.main?.humidity ?? weather.humidity ?? "N/A"}%</p>
                    <p>Wind Speed: {weather.wind ?? "Data Unavailable"} /ms</p>
                </div>
                ) : weather === null ?    (
                    <p>Loading or No Data Available...</p>
            ) : null }
            
            {prediction ? (
                <div className="weather-prediction">
                    <h2>Weather Prediction</h2>
                    <p>Predicted Temperature: {prediction.temperature ?? "N/A"}°C</p>
                    <p>Predicted Condition: {prediction.condition ?? "Unknown"} {getWeatherEmoji(prediction.condition)}</p>
                </div>
            ) : (
                <p>Prediction not available...</p>
            )}
        </div>
    );
}

export default WeatherDisplay;
