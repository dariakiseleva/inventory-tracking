var sqlite3 = require('sqlite3').verbose()

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')

        //If tables do not already exist, create them and add sample data

        //INVENTORY ITEMS
        db.run(`CREATE TABLE item (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            city_id INTEGER, 
            stock INTEGER, 
            shipped INTEGER DEFAULT 0
            )`,
        (err) => {
            if(!err){
                const insert_item = db.prepare("INSERT INTO item (name, city_id, stock) VALUES (?,?,?)");
                insert_item.run(["Ghost-PLAS-GRN", "0", "3455"]);
                insert_item.run(["Zealot-ALUM-RED", "0", "567"]);
                insert_item.run(["Ghost-PLAS-GRN", "1", "90"]);
                insert_item.run(["Tennis-RACK-TUN", "2", "6"]);
                insert_item.run(["Ruler-PLTF-GNN", "3", "5"]);
                insert_item.run(["Pencil-TYR-BLU", "4", "4"]);
            }

        });  


        //SHIPMENTS
        db.run(`CREATE TABLE shipment (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            created DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
        (err) => {
            if(!err){
                const insert_shipment = db.prepare("INSERT INTO shipment DEFAULT VALUES");
                //Create 3 shipments
                insert_shipment.run();
                insert_shipment.run();
                insert_shipment.run();
            }

        });  

        //SHIPMENT ITEMS
        db.run(`CREATE TABLE shipment_item (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            shipment_id INTEGER,
            item_id INTEGER,
            quantity INTEGER,
            FOREIGN KEY(shipment_id) REFERENCES shipment(id),
            FOREIGN KEY(item_id) REFERENCES inventory_item(id)
            )`,
        (err) => {
            if(!err){
                const insert_shipment_item = db.prepare("INSERT INTO shipment_item (shipment_id, item_id, quantity) VALUES (?,?,?)");
                //Create 3 shipments
                insert_shipment_item.run([1, 1, 2]);
                insert_shipment_item.run([2, 2, 3]);
                insert_shipment_item.run([3, 3, 4]);
            }

        });  

        //CITIES
        db.run(`CREATE TABLE city (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            latitude REAL, 
            longitude REAL
            )`,
        (err) => {
            if(!err){
                const insert_city = db.prepare("INSERT INTO city (name, latitude, longitude) VALUES (?,?,?)");
                insert_city.run(["Toronto, ON, Canada", "43.651070", "-79.347015"]);
                insert_city.run(["Montréal, QC, Canada", "45.630001", "-73.519997"])
                insert_city.run(["Trois-Rivières, QC, Canada", "46.349998", "-72.550003"])
                insert_city.run(["Tobermory, ON, Canada", "45.249999", "-81.666664"])
                insert_city.run(["Victoria, BC, Canada", "48.407326", "-123.329773"])
            }

        });  
    }
});


module.exports = db