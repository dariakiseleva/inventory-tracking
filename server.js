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

//GET ITEMS IN INVENTORY
app.get("/items", (req, res) => {
    const query = "SELECT * FROM item"
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
app.post("/items", (req, res) => {

    const {itemName, city, stock} = req.body;
    const query = "INSERT INTO item (name, city_id, stock) VALUES (?,?,?) returning id";
    db.all(query, [itemName, city, stock], (error, returning) => {
        res.status(200).json(returning[0]);
    })    
});

//CHANGE ITEM DATA
app.patch("/item/:id", (req, res) => {
    const id = req.params.id;
    const {itemName, city, stock} = req.body;
    const query = `UPDATE item SET name="${itemName}", city_id=${city}, stock=${stock} WHERE id=${id}`;
    db.all(query, () => {
        res.status(200).json({})
    })    
})

//DELETE ITEM
app.delete("/item/:id", (req, res) => {
    const id = req.params.id;
    const query = `UPDATE item SET in_inventory=0 WHERE id=${id}`;
    db.all(query, (err) => {
        return res.status(200).json({});
    });
})


//GET CITIES
app.get("/cities", (req, res) => {
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

app.get("/shipments", (req, res) => {

    const query = "SELECT shipment_id, item_id, created, quantity, city_id FROM shipment JOIN shipment_item ON shipment.id=shipment_item.shipment_id"

    db.all(query, (err, rows) => {
        const shipments = {}

        //Rearrange data so that shipment items are in an array
        for (let row of rows) {
            //Create shipment if it doesn't exist yet
            if (!shipments[row.shipment_id]) {
                shipments[row.shipment_id] = {
                    id: row.shipment_id,
                    created: row.created,
                    city_id: row.city_id,
                    shipmentItems: []
                }
            }
            //Add shipment item information into the relevant shipments
            shipments[row.shipment_id].shipmentItems.push({id: row.item_id, quantity: row.quantity})
        }
    
        res.status(200).json(shipments);

    });
})


app.post("/shipments", (req, res) => {

    //Helper function - add each shipment item
    const addShipmentItem = (itemID, shipmentID, quant) => {
        const query = "INSERT INTO shipment_item (item_id, shipment_id, quantity) VALUES (?, ?, ?)"
        db.all(query, [itemID, shipmentID, quant]);
    }

    const updateInventory = (id, stock, shipped) => {
        const query = "UPDATE item SET stock=?, shipped=? WHERE id=?"
        db.all(query, [stock, shipped, id]);
    }

    //Helper function - update inventory item data

    const {shipmentItemData, city} = req.body;

    const query = "INSERT INTO shipment (city_id) VALUES (?) RETURNING id, created";
    db.all(query, [city], (err, rows) => {

        const shipmentID = rows[0].id
        const created = rows[0].created

        for (let item of shipmentItemData) {
            addShipmentItem(item.id, shipmentID, item.quant);
            updateInventory(item.id, item.stock, item.shipped)
        }
        


        res.status(200).json({shipmentID, created});
    })

})

// Default response for any other request
app.use((req, res) => {
    res.status(404);
});


app.listen(5000, () => {
    console.log("Server listening on port 5000");
})