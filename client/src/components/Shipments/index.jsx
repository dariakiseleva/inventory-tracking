// import "./shipment-styles.css"
import React, { Fragment } from "react";
import axios from "axios";
import "./../../styles/tables.css"

export default function Shipments ({inventory, cities, shipments}) {

    //Generate a table row for each inventory item
    const shipmentRows = Object.values(shipments).map(shipment => {

        //Rows of subtable listing items in the shipment
        const shipmentItemRows = shipment.shipmentItems.map((shipmentItem) => {

            console.log(shipmentItem);

            return (
                <tr key={shipmentItem.id}>
                    <td>{shipmentItem.id}</td>                    
                    <td>{inventory[shipmentItem.id].name}</td>
                    <td>{shipmentItem.quantity}</td>
                    <td>{shipmentItem.id===1 ? "No longer in inventory" : "-"}</td>
                </tr>
            )
        })

        return (
            <tr key={shipment.id}>
                <td>{shipment.id}</td>
                <td>{cities[shipment.city_id].name}</td>
                <td>
                    <table className="innerTable">
                        <tbody>
                            <tr>
                                <th>Item ID</th>
                                <th>Name</th>
                                <th>Quantity in shipment</th>
                                <th>Note</th>
                            </tr>
                            {shipmentItemRows}
                        </tbody>
                    </table>
                </td>
                <td>{shipment.created}</td>
            </tr>
        )
    });


    return (
        <Fragment>
        <h1>Shipments</h1>
        <table>
            <tbody>
            <tr className="header-row">
                <th>Shipment ID</th>
                <th>Shipment from</th>
                <th>Items</th>
                <th>Time created</th>
            </tr>

            {shipmentRows}

            </tbody>

        </table>
        </Fragment>
    )
}