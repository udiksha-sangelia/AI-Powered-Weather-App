const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const weatherRoutes = require('./routes/weatherRoutes');

dotenv.config();

const app = express();
app.use(cors({ origin: "https://ai-powered-weather-app.vercel.app", credentials: true }));
app.use(express.json());

app.use('/api/weather', weatherRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
