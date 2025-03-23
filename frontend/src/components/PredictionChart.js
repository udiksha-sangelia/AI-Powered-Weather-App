import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend);

const PredictionChart = ({ data }) => {
    if (!data || data.length === 0) {
        return <p>No forecast data available.</p>;
    }

    const forecastLabels = data.map((entry) =>
        new Date(entry.dt_txt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
    );
    const forecastTemps = data.map((entry) => entry.main.temp);

    const chartData = {
        labels: forecastLabels,
        datasets: [
            {
                label: "Temperature Forecast (°C)",
                data: forecastTemps,
                borderColor: "blue",
                fill: false,
                tension: 0.4, // Makes the line slightly curved for better readability
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: "top",
            },
            tooltip: {
                enabled: true,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Date",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Temperature (°C)",
                },
            },
        },
    };

    return (
        <div className="chart-container">
            <h3>5-Day Temperature Forecast</h3>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default PredictionChart;
