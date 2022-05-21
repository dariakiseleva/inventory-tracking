import React, {useState} from "react";


import './App.scss';

import Header from "./components/Header"
import Inventory from "./components/Inventory"
import NewItem from "./components/Inventory/NewItem"
import Shipments from "./components/Shipments"
import NewShipment from "./components/Shipments/NewShipment"

function App() {

  const [page, setPage] = useState("Inventory");

  return (
    <div className="App">
    
      <Header setPage={setPage} />

      <main>
        {page==="Inventory" && <Inventory />}
        {page==="NewItem" && <NewItem />}
        {page==="Shipments" && <Shipments />}
        {page==="NewShipment" && <NewShipment />}
      </main>

    </div>
  );
}

export default App;
