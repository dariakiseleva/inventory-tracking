import React, {useState, Fragment, useEffect} from "react";
import "./../../styles/forms.css";
import ItemSelector from "./ItemSelector";
import ItemModifier from "./ItemModifier";
import axios from "axios";

export default function NewShipment({inventory, cities, setPage, createShipment}) {

    const [city, setCity] = useState("");
    const [availableItems, setAvailableItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState({});
    const [error, setError] = useState([]);


    //When new city is chosen, update item choices as well as clear selections already made
    useEffect(() => {

        const newAvailableItems = []
        for (let id of Object.keys(inventory)){
            if (inventory[id].city_id == city && inventory[id].in_inventory===1 && inventory[id].stock > 0) {
                newAvailableItems.push(id)
            }
        }
        setAvailableItems(newAvailableItems);
        setSelectedItems({});

    }, [city])


    //When an item is selected
    const processAddItem = (id) => {

        //If an item was chosen, remove it from selection options
        setAvailableItems(prev => {
            let updated = [...prev]
            updated.splice(updated.indexOf(id), 1);
            return updated;
        })

        //Add id to selected items
        setSelectedItems(prev => {
            let updated = {...prev}
            updated[id] = {id, quant: 1};
            return(updated);
        })
    }

    //When Delete button is pressed on item
    const processDeleteItem = (id) => {
        setAvailableItems(prev => [...prev, id])
        setSelectedItems(prev => {
            let updated = {...prev}
            delete updated[id]
            return updated
        })
    }

    //When quantity of item is changed
    const processChangeQuant = (id, quant) => {
        setSelectedItems(prev => {
            let updated = {...prev}
            updated[id].quant = quant;
            return updated;
        })
    }

    const processCreateShipment = () => {
        //Double check valid quantities, return and display error if invalid
        for (let id of Object.keys(selectedItems)){
            let noError =  true;
            const quant = selectedItems[id].quant;
            if (quant <= 0 || quant > inventory[id].stock || !Number.isInteger(quant)){
                setError("ERROR: Ensure valid quantities")
                noError = false;
                return
            }
            if (noError) setError("");
        }

        const shipmentItemData = Object.values(selectedItems).map(item => {
            const itemData = {...item}
            itemData.stock = inventory[item.id].stock - item.quant;
            itemData.shipped = inventory[item.id].shipped + item.quant;
            return itemData;
        })
        
        //Database call
        axios.post("/shipments", {city, shipmentItemData})
        .then((res) => {
            const {shipmentID, created} = res.data
            createShipment(shipmentID, created, city, shipmentItemData)
            setPage("Shipments")  
        })
    }


    return (
            <form className="inputForm">
            <h1>Create a new shipment</h1>
            {/* CITY SELECTOR */}
            <label>Select a city from which to ship</label>
            <select 
                required
                value={city} 
                onChange={(event) => setCity(event.target.value)}
            >
                <option value="" disabled>Select a city</option>
                {Object.values(cities).map(cityOption => {
                    return (
                        <option key={cityOption.id} value={cityOption.id}>{cityOption.name}</option>
                    )
                })}
            </select>

            {/* ITEMS SELECTOR */}
            {city && 
            <Fragment>
                <br />
                <label>Select items available in stock in this city</label>
                <ItemSelector 
                    availableItems={availableItems} 
                    inventory={inventory} 
                    processAddItem={processAddItem}
                />        
            </Fragment>
            }



            {/* ITEMS MODIFIER */}
            {(city && Object.keys(selectedItems).length > 0) && 

                <Fragment>
                <br/><br/>
                <label>Modify quantity or remove item from shipment</label>
                <ItemModifier
                    selectedItems={selectedItems}
                    inventory={inventory}
                    processChangeQuant={processChangeQuant}
                    processDeleteItem={processDeleteItem}
                />
                </Fragment>
            }

            {/* SUBMIT BUTTON */}
            {(city && Object.keys(selectedItems).length > 0) && 
                <button type="button" onClick={processCreateShipment}>Create</button>
            }

            {/* ERROR MESSAGE */}
            <p className="errorMessage">{error}</p>

        </form>
    );
}