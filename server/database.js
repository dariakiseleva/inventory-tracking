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

        db.run(`CREATE TABLE inventory_item (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            city_id INTEGER, 
            stock INTEGER, 
            shipped INTEGER DEFAULT 0
            )`,
        (err) => {
            if(!err){
                const insert_item = db.prepare("INSERT INTO inventory_item (name, city_id, stock) VALUES (?,?,?)");
                insert_item.run(["Ghost-PLAS-GRN", "0", "3455"]);
                insert_item.run(["Zealot-ALUM-RED", "0", "567"]);
                insert_item.run(["Ghost-PLAS-GRN", "1", "90"]);
                insert_item.run(["Tennis-RACK-TUN", "2", "6"]);
                insert_item.run(["Ruler-PLTF-GNN", "3", "5"]);
                insert_item.run(["Pencil-TYR-BLU", "4", "4"]);
            }

        });  

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