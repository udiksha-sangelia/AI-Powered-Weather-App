const mongoose = require('mongoose');

const WeatherSchema = new mongoose.Schema({
    city: { 
        type: String, 
        required: true, 
        trim: true 
    },
    temperature: { 
        type: Number, 
        required: true 
    },
    weather: { 
        type: String, 
        required: true, 
        trim: true 
    },
    humidity: { 
        type: Number, 
        required: true, 
        min: 0, 
        max: 100 
    },
    wind: { 
        type: Number, 
        required: true, 
        min: 0 
    },
    date: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Weather', WeatherSchema);
