const express = require('express');
const router = express.Router();
const axios = require('axios');
const Weather = require('../models/Weather');
// const { predictWeather } = require('../ai/Predictor');
require('dotenv').config();

const API_KEY = process.env.API_KEY;


// Get current weather data for a city
router.get('/current/:city', async (req, res) => {
    try {
        const city = req.params.city;
        if (!city) return res.status(400).json({ error: 'City parameter is required' });

        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
        );

        const data = response.data;
        if (!data || !data.main) {
            return res.status(404).json({ error: 'Weather data not found' });
        }

        // Save weather data in MongoDB
        const newWeather = new Weather({
            city: data.name,
            temperature: data.main.temp,
            weather: data.weather[0].description,
            humidity: data.main.humidity,
            wind: data.wind.speed
        });

        await newWeather.save();
        res.json(newWeather);
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        res.status(500).json({ error: 'Failed to fetch weather data.' });
    }
});

// Predict future temperature based on historical data
router.get('/predict/:city', async (req, res) => {
    const {city} = req.params;
    try {
        // Get current weather from OpenWeatherMap API
        const weatherResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        if (!weatherResponse.data || !weatherResponse.data.main) {
            return res.status(400).json({ error: "Could not fetch weather data" });
        }

        // Extract current temperature
        const currentTemp = weatherResponse.data.main.temp;
        const weatherCondition = weatherResponse.data.weather[0].description;

        // 🔹 Basic prediction logic: Add/subtract random small variation
        const predictedTemp = (currentTemp + (Math.random() * 4 - 2)).toFixed(1); // ±2°C variation

        res.json({
            city: city,
            prediction: {
                temperature: predictedTemp,
                condition: weatherCondition, // Assume same condition
            }
        });

    } catch (error) {
        console.error("Weather Prediction Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Unable to generate weather prediction" });
    }
});

module.exports = router;
