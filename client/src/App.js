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

  const [state, setState] = useState({inventory: {}, cities: {}});

  useEffect(() => {
    //Make several API calls and update the state at the same time
    Promise.all([
      axios.get('http://localhost:5000/inventory/items'),
      axios.get('http://localhost:5000/cities'),
    ])
    .then((all) => {
      setState(prev => ({
        ...prev, 
        inventory: all[0].data, 
        cities: all[1].data
      }))
    })
  }, []);
  

  return (
    <div className="App">
    
      <Header setPage={setPage} />

      <main>
        {page==="Inventory" && <Inventory cities={state.cities} inventory={state.inventory}/>}
        {page==="NewItem" && <NewItem />}
        {page==="Shipments" && <Shipments />}
        {page==="NewShipment" && <NewShipment />}
      </main>

    </div>
  );
}

export default App;
