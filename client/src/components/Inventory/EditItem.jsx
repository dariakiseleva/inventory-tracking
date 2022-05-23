import React, { useState } from 'react';
import axios from "axios";
import "./../../styles/forms.css"

export default function EditItem({cities, inventory, editItem, setPage, item_id}) {

    const prevName = inventory[item_id].name
    const prevStock = inventory[item_id].stock
    const prevCity = inventory[item_id].city_id

    const [itemName, setItemName] = useState(prevName);
    const [stock, setStock] = useState(prevStock);
    const [city, setCity] = useState(prevCity);
    const [error, setError] = useState("");

    const processEditItem = () => {

        //Validate data entry
        if (!itemName || !stock ){
            setError("ERROR: Incomplete form");
            return;
        }

        const numStock = Number(stock);
        if (!Number.isInteger(numStock) || numStock <= 0) {
            setError("ERROR: Quantity must be a positive integer");
            return;
        }

        //Call to server to update the item in the database
        axios.patch(
            `/item/${item_id}`,
            {itemName, stock, city}, 
            {headers: {'content-type': 'application/json'}}
        )
        //Update local storage with new item data
        .then((res) => {
            editItem(item_id, itemName, city, stock);
            setPage("Inventory")
        })
    }

    return (
        <form className="inputForm">

            <h1>Edit item ID {item_id}</h1>

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

            <button onClick={() => processEditItem()} type="button">Save</button>

            {error && <p className="errorMessage">{error}</p>}

        </form>
    )

}