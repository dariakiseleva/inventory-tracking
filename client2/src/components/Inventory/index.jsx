import "./inventory-styles.scss"
import React, {useEffect, useState} from "react";
import axios from 'axios';



export default function Inventory () {

    const [inventoryData, setInventoryData] = useState({});

    useEffect(() => {
        axios.get("/inventory/all")
        .then(res => {
            setInventoryData(res.data)
        })

    }, [])


    const inventoryRows = Object.values(inventoryData).map(item => {
        return (
            <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.stock}</td>
                <td>{item.shipped}</td>
                <td>{item.city}</td>
                <td>{item.weather}</td>
                <td>Edit</td>
                <td>Delete</td>
            </tr>
        )
    });



    return (
            <table>
                <tbody>
                <tr className="header-row">
                    <th>ID</th>
                    <th>Name</th>
                    <th>Quantity in stock</th>
                    <th>Quantity shipped</th>
                    <th>City</th>
                    <th>Weather in city</th>
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>

                {inventoryRows}

                </tbody>

            </table>
    )
}