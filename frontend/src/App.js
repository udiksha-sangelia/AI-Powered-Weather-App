import React, { useState } from 'react';
import WeatherDisplay from './components/WeatherDisplay';
import PredictionChart from './components/PredictionChart';

function App() {
    const [setWeatherData] = useState(null);
    const [prediction, setPrediction] = useState(null);

    return (
        <div className="App">
            <WeatherDisplay setWeatherData={setWeatherData} setPrediction={setPrediction} />
            {prediction && <PredictionChart prediction={prediction} />}
        </div>
    );
}

export default App;
