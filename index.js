const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const AUTHOR = "Grzegorz Łukomski";

console.log(`Start: ${new Date().toISOString()}, Author: ${AUTHOR}, Port: ${PORT}`);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/pogoda', async (req, res) => {
    const { country, city } = req.body;
    const weatherData = await getWeather(city, country);
    if (weatherData) {
        const weather = `W ${weatherData.name} jest ${weatherData.main.temp}°C i ${weatherData.weather[0].description}`;
        res.send(`
            <h1>Aktualna pogoda</h1>
            <p>${weather}</p>
            <a href="/">Wróć</a>
        `);
    } else {
        res.send("Nie udało się pobrać pogody!");
    }
});


const fetch = require('node-fetch');

async function getWeather(city, country) {
    const apiKey = "63a538d69d6d1f43c15e7be6d82e222f\n";
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
