import "./inventory-styles.scss"


const inventoryData = {
    1454543: {
        id: 1454543,
        name: "Plastic broom",
        stock: 456,
        shipped: 12,
        city: "Montreal",
        weather: "sunny"
    },
    1454546: {
        id: 1453,
        name: "Plastic flower",
        stock: 4656,
        shipped: 162,
        city: "Toronto",
        weather: "cloudy"
    }
}

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


export default function Inventory () {
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