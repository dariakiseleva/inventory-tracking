const express = require('express');
const axios = require('axios');

require('dotenv').config({ path: './.env' })


const app = express();

//Database
const db = require("./database.js")

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(express.json());

//ACTUAL ROUTES
app.get("/inventory/items", (req, res) => {
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

//CREATE NEW ITEM
app.post("/inventory/items", (req, res) => {

    const {itemName, city, stock} = req.body;
    const query = "INSERT INTO inventory_item (name, city_id, stock) VALUES (?,?,?) returning id";
    db.all(query, [itemName, city, stock], (error, returning) => {
        res.status(200).json(returning[0]);
    })    
});


//CHANGE ITEM DATA
app.patch("/inventory/item/:id", (req, res) => {
    const id = req.params.id;
    const {itemName, city, stock} = req.body;
    const query = `UPDATE inventory_item SET name="${itemName}", city_id=${city}, stock=${stock} WHERE id=${id}`;
    db.all(query, () => {
        res.status(200).json({})
    })    
})


//DELETE ITEM
app.delete("/inventory/item/:id", (req, res) => {
    const id = req.params.id;
    const query = `DELETE FROM inventory_item WHERE id=${id};`
    db.all(query, (err) => {
        return res.status(200).json({});
    });
})


app.get("/cities/", (req, res) => {
    const query = "select * from city"
    db.all(query, (err, rows) => {

        //Create an array of promises for the processed result of weather API calls for each city
        const weatherPromises = rows.map(city => {
            const key = process.env.WEATHER_API_KEY;
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