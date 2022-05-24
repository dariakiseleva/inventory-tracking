
import React from 'react';
import "./../../styles/tables.css";


export default function ItemModifier({selectedItems, inventory, processChangeQuant, processDeleteItem}){

    const itemRows = Object.values(selectedItems).map(item => {

        return(
            <tr key={item.id} className="header-row">
                <td>{item.id}</td>
                <td>{inventory[item.id].name}</td>
                <td>{inventory[item.id].stock}</td>
                <td>
                    <input 
                        className="shipmentQuantModifier"
                        type="number"
                        value={item.quant}
                        onChange={(event) => {

                            const input = parseFloat(event.target.value);
                            processChangeQuant(item.id, input)
                            if (input <=0 || input > inventory[item.id].stock || !Number.isInteger(input)){
                                event.target.classList.add('warning-form');
                            } else {
                                event.target.classList.remove('warning-form');
                            }

                        }}
                    />
                </td>
                <td><a className="deleteLink" onClick={()=> processDeleteItem(item.id)}>Remove</a></td>
            </tr>
        )
    })

    return (

        <table>
            <tbody>
            <tr className="header-row">
                <th>Item ID</th>
                <th>Name</th>
                <th>In stock</th>
                <th>Quantity</th>
                <th>Remove</th>
            </tr>
            {itemRows}
            </tbody>

        </table>
    )
}

