import React, {useState, useEffect} from "react";
import axios from 'axios';

import './App.scss';

import Header from "./components/Header"
import Inventory from "./components/Inventory"
import NewItem from "./components/Inventory/NewItem"
import Shipments from "./components/Shipments"
import NewShipment from "./components/Shipments/NewShipment"


function App() {

  const [page, setPage] = useState("Inventory");

  //---------- TEST
  const [data, setData] = useState("No data");

  useEffect(() => {
    axios.get("/")
    .then(newData => {
      setData(newData.data.message)
    })
    .catch(error => setData(error.message))
  }, [])

  //-----------

  return (
    <div className="App">
    
      <Header setPage={setPage} />

      {data}

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
