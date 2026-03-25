const {promisePool: db} = require('../config/database');
const bcrypt = require("bcrypt");


const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({message: 'Email and password are required'});
        }

        const query = 'SELECT * FROM Users WHERE email = ?';
        const [rows] = await db.query(query, [email]);

        if (!rows || rows.length === 0) {
            return res.status(404).json({message: 'User Not Found'});
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({message: 'Login failed'});
        }

        return res.status(200).json({message: 'Login successful'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Server Error', error: error.message});
    }
}

module.exports = {loginUser};