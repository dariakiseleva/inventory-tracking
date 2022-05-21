import "./header-styles.scss";

export default function Header ({setPage}){
    return (
        <div id="app-header">
            <a onClick={() => setPage("Inventory")} className="header-link">All inventory</a>
            <a onClick={() => setPage("NewItem")} className="header-link">Create new item</a>
            <a onClick={() => setPage("Shipments")} className="header-link">All shipments</a>
            <a onClick={() => setPage("NewShipment")} className="header-link">Create new shipment</a>
        </div>
    );
}