const express = require('express');
const request = require('request');
const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get("/inventory/all", (req, res) => {

    const key = "056c9e3befa23c30af5c596b579c5ede";

    const lat = "43.651070";
    const lon = "-79.347015";


    request(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`, (error, response, body) => {
        const weatherData = JSON.parse(body);

        const temp = Math.round(weatherData.main.temp);
        const feelsLike = Math.round(weatherData.main.feels_like);
        const description = weatherData.weather[0].description;

        const currentWeather = `${temp}°C, feels like ${feelsLike}°C, ${description}`;


        const inventoryData = {
            1454543: {
                id: 1454543,
                name: "Plastic broom",
                stock: 456,
                shipped: 12,
                city: "Montreal",
                weather: currentWeather
            },
            1454546: {
                id: 1453,
                name: "Plastic flower",
                stock: 4656,
                shipped: 162,
                city: "Toronto",
                weather: currentWeather
            }
        }


        res.json(inventoryData)
    })
    
})


app.get("*", (req, res) => {
    res.json(null);
})


app.listen(5000, () => {
    console.log("Server listening on port 5000");
})