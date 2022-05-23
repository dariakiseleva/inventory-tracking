import "./../../styles/tables.css"
import React from "react";
import axios from "axios";


export default function Inventory ({inventory, cities, deleteItem, setPage, selectItemToEdit}) {

    //Process item deletion - first in the database, then locally to re-render
    const processDeleteItem = (id) => {
        axios.delete(`/item/${id}`)
        .then(() => {
            deleteItem(id);
        })
    }

    //When the Edit link is clicked on an item
    const processClickEdit = (id) => {
        selectItemToEdit(id);
        setPage("EditItem");
    }


    //Generate a table row for each inventory item
    const inventoryRows = Object.values(inventory).map(item => {
        return (
            <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.stock}</td>
                <td>{item.shipped}</td>
                <td>{cities[item.city_id].name}</td> 
                <td>{cities[item.city_id].weather}</td>
                <td><a className="editLink" onClick={() => processClickEdit(item.id)}>Edit</a></td>
                <td><a className="deleteLink" onClick={() => processDeleteItem(item.id)}>Delete</a></td>
            </tr>
        )
    });

    //Render content
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