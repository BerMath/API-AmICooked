const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env. DB_HOST,
  user: process.env. DB_USER,
  password:  process.env.DB_PASSWORD,
  database: process.env. DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();

// Fonction pour tester la connexion avec retry
const testConnection = async (retries = 5, delay = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await promisePool.getConnection();
      console.log('Connected to MySQL database successfully!');
      connection.release();
      return true;
    } catch (error) {
      console.log(`Connection attempt ${i + 1}/${retries} failed...`);
      if (i < retries - 1) {
        console.log(`⏳ Retrying in ${delay/1000}s...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('Unable to connect to MySQL:', error.message);
        throw error;
      }
    }
  }
};

module.exports = { promisePool, testConnection };