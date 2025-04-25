const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const AUTHOR = "Grzegorz Nowak";

console.log(`Start: ${new Date().toISOString()}, Author: ${AUTHOR}, Port: ${PORT}`);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/pogoda', (req, res) => {
    const { country, city } = req.body;
    const weather = `Słonecznie w ${city}, 21°C`;

    res.send(`
        <h1>Pogoda</h1>
        <p>${weather}</p>
        <a href="/">Wróć</a>
    `);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
