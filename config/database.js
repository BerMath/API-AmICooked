const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
});

// Fonction pour tester la connexion avec retry
const testConnection = async (retries = 10, delay = 5000) => {
    for (let i = 0; i < retries; i++) {
        try {
            const client = await pool.connect();
            console.log('Connected to PostgreSQL database successfully!');
            client.release();
            return true;
        } catch (error) {
            console.log(`Connection attempt ${i + 1}/${retries} failed...`);
            if (i < retries - 1) {
                console.log(`⏳ Retrying in ${delay / 1000}s...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error('Unable to connect to PostgreSQL:', error.message);
                throw error;
            }
        }
    }
};

module.exports = { pool: pool, testConnection };