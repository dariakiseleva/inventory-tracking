const express = require('express');
const request = require('request');
const axios = require('axios');


const app = express();

//Database
const db = require("./database.js")

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


//DRAFTS
app.get("/inventory/all/test", (req, res) => {

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



//ACTUAL ROUTES
app.get("/inventory/items", (req, res, next) => {
    const query = "select * from inventory_item"
    db.all(query, (err, rows) => {

        //Rearrange the data as an object with item IDs as keys
        const inventoryObject = {}
        rows.forEach(row => {
            inventoryObject[row.id] = row;
        })

        if (err) {
          return res.status(400).json({"error":err.message});
        }
        
        return res.json(inventoryObject)
      });
});


app.get("/cities/", (req, res, next) => {
    const query = "select * from city"
    db.all(query, (err, rows) => {


        //Create an array of promises for the processed result of weather API calls for each city
        const weatherPromises = rows.map(city => {
            const key = "056c9e3befa23c30af5c596b579c5ede";
            const lat = city.latitude;
            const lon = city.longitude;

            return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`)
            .then(res => {
                const weatherData = res.data;
                const temp = Math.round(weatherData.main.temp);
                const feelsLike = Math.round(weatherData.main.feels_like);
                const description = weatherData.weather[0].description;
                const currentWeather = `${temp}°C, feels like ${feelsLike}°C, ${description}`;
                return currentWeather;
            })
        })


        const cityObject = {}

        //After all API calls resolve, rearrange data into an object indexed by ID and add the weather data
        Promise.all(weatherPromises)
        .then(weatherAnswers => {
            for (let cityIndex in rows) {
                const cityData = rows[cityIndex];
                cityObject[cityIndex] = {id: cityIndex, name: cityData.name};
                cityObject[cityIndex].id = cityIndex;
                cityObject[cityIndex].weather = weatherAnswers[cityIndex];
            }

            //Return an object indexed by city ID
            return res.json(cityObject)
        })

      });
});



// Default response for any other request
app.use((req, res) => {
    res.status(404);
});


app.listen(5000, () => {
    console.log("Server listening on port 5000");
})