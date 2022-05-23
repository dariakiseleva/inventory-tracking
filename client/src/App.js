import React, {useState, useEffect} from "react";
import axios from 'axios';

import './styles/index.css';

import Header from "./components/Header"
import Inventory from "./components/Inventory"
import NewItem from "./components/Inventory/NewItem"
import EditItem from "./components/Inventory/EditItem"
import Shipments from "./components/Shipments"
import NewShipment from "./components/Shipments/NewShipment"


function App() {

  const [page, setPage] = useState("Inventory");

  const [state, setState] = useState({inventory: {}, cities: {}, itemToEdit: -1});

  const selectItemToEdit = (id) => {
    setState(prev => {
      const newState = {...prev, itemToEdit: id};
      return newState;     
    });
  }


  //Delete item in local storage
  const deleteItem = (id) => {
    setState(prev => {
      const newState = {...prev};
      delete newState.inventory[id];
      return newState;      
    })
  }

  //Create item in local storage
  const createItem = (id, name, city_id, stock) => {
    setState(prev => {
      const newState = {...prev};
      newState.inventory[id] = {id: id, name: name, city_id: city_id, stock: stock, shipped: 0}
      return newState;      
    })
  }

  //Create item in local storage
  const editItem = (id, name, city_id, stock) => {
    setState(prev => {
      const updatedItem = {...prev.inventory[id], name: name, city_id: city_id, stock: stock}
      const newState = {...prev};
      newState.inventory[id] = updatedItem;
      return newState;      
    })
  }

  //Make several API calls and update the state at the same time
  useEffect(() => {
    Promise.all([
      axios.get('/items'),
      axios.get('/cities'),
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
        {page==="Inventory" && 
          <Inventory 
            deleteItem={deleteItem} 
            cities={state.cities} 
            inventory={state.inventory}
            setPage={setPage}
            selectItemToEdit={selectItemToEdit}
          />
        }
        {page==="NewItem" && 
          <NewItem 
            cities={state.cities} 
            createItem={createItem} 
            setPage={setPage}
          />
        }

        {page==="EditItem" && 
          <EditItem 
            editItem={editItem} 
            setPage={setPage}
            item_id={state.itemToEdit}
            cities={state.cities} 
            inventory={state.inventory}
          />
        }
        
       

        {page==="Shipments" && <Shipments />}
        {page==="NewShipment" && <NewShipment />}

      </main>

    </div>
  );
}

export default App;
