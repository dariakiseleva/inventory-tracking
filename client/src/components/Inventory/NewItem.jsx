import React, { useState } from 'react';
import axios from "axios";


export default function NewItem({cities, createItem, setPage}) {

    const [itemName, setItemName] = useState("");
    const [stock, setStock] = useState("");
    const [city, setCity] = useState("");
    const [error, setError] = useState("");

    const processCreateItem = () => {

        //Validate data entry

        console.log(itemName, stock, city)

        if (!itemName || !stock || !city) {
            setError("ERROR: Incomplete form");
            return;
        }

        const numStock = Number(stock);
        if (!Number.isInteger(numStock) || numStock <= 0) {
            setError("ERROR: Quantity must be a positive integer");
            return;
        }


        //Call to server to update the database and return the id of the new item
        axios.post(
            '/inventory/items', 
            {itemName, stock, city}, 
            {headers: {'content-type': 'application/json'}}
        )
        //Update local storage with new item
        .then((res) => {
            const inserted_id = res.data.id
            createItem(inserted_id, itemName, city, stock);
            setPage("Inventory")
        })
    }

    return (
        <form className="inputForm">

            <h1>Create a new inventory item</h1>

            <label>Item name</label>
            <input 
                type="text"
                required 
                placeholder ="Enter item name" 
                value={itemName}
                onChange={(event) => setItemName(event.target.value)}
                onInvalid={e => e.target.setCustomValidity('Please enter the item name')}
            />

            <label>Quantity in stock</label>
            <input 
                type="number"
                required 
                value={stock}
                placeholder ="Enter a number"
                min="0"
                max="100000"
                onChange={(event) => setStock(event.target.value)} 
                onInvalid={e => e.target.setCustomValidity('Please enter a quantity')}
            />

            <label>City</label>
            <select 
                required
                value={city} 
                onChange={(event) => setCity(event.target.value)}
                onInvalid={e => e.target.setCustomValidity('Please select a city')}
            >
                <option value="" disabled>Select a city</option>

                {Object.values(cities).map(cityOption => {
                    return (
                        <option key={cityOption.id} value={cityOption.id}>{cityOption.name}</option>
                    )
                })}
            </select>

            <button onClick={() => processCreateItem()} type="button">Submit</button>

            {error && <p className="errorMessage">{error}</p>}

        </form>
    )

}