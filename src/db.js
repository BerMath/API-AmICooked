const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "db",        // nom du service docker
  user: "root",
  password: "root",
  database: "appdb"
});

connection.connect(err => {
  if (err) {
    console.error("DB error:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

module.exports = connection;
