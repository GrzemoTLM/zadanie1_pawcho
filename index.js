require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;
const AUTHOR = "Grzegorz Łukomski";

console.log(`Start: ${new Date().toISOString()}, Author: ${AUTHOR}, Port: ${PORT}`);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

function getWeatherIcon(condition) {
    switch (condition.toLowerCase()) {
        case 'clear':
            return '☀️';
        case 'clouds':
            return '☁️';
        case 'rain':
        case 'drizzle':
            return '🌧️';
        case 'thunderstorm':
            return '⛈️';
        case 'snow':
            return '❄️';
        case 'mist':
        case 'fog':
        case 'haze':
            return '🌫️';
        default:
            return '🌈';
    }
}

app.post('/pogoda', async (req, res) => {
    const { country, city } = req.body;
    const weatherData = await getWeather(city, country);

    if (weatherData) {
        const sunrise = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
        const sunset = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });

        const icon = getWeatherIcon(weatherData.weather[0].main);

        const weather = `
            W ${weatherData.name} jest ${weatherData.main.temp}°C ${icon} ${weatherData.weather[0].description}.<br>
            Odczuwalna: ${weatherData.main.feels_like}°C.<br>
            Ciśnienie: ${weatherData.main.pressure} hPa.<br>
            Wilgotność: ${weatherData.main.humidity}%.<br>
            Wiatr: ${weatherData.wind.speed} m/s.<br>
            Wschód słońca: ${sunrise}.<br>
            Zachód słońca: ${sunset}.
        `;

        res.send(`
            <!DOCTYPE html>
            <html lang="pl">
            <head>
                <meta charset="UTF-8">
                <title>Aktualna pogoda</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body class="bg-light">
                <div class="container py-5">
                    <h1 class="text-center mb-4">Aktualna pogoda</h1>
                    <div class="card shadow-sm p-4">
                        <p class="fs-4">${weather}</p>
                    </div>
                    <div class="text-center mt-4">
                        <a href="/" class="btn btn-outline-primary">Wróć</a>
                    </div>
                </div>
            </body>
            </html>
        `);
    } else {
        res.send(`
            <!DOCTYPE html>
            <html lang="pl">
            <head>
                <meta charset="UTF-8">
                <title>Błąd</title>
            </head>
            <body>
                <h1>Nie udało się pobrać pogody!</h1>
                <a href="/">Wróć</a>
            </body>
            </html>
        `);
    }
});

async function getWeather(city, country) {
    const apiKey = process.env.API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(`Pogoda w ${data.name}: ${data.main.temp}°C, ${data.weather[0].description}`);
        return data;
    } catch (error) {
        console.error("Błąd pobierania pogody:", error);
        return null;
    }
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
