const {pool: db} = require('../config/database');
const bcrypt = require("bcrypt");
const {getUserRole} = require("../services/role.service");

// Get all users
const getUsers = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

// Retrieve user info by an id
const getUserById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        const users = result.rows;

        if (users.length === 0) {
            return res.status(404).json({message: 'User not found'});
        }

        res.json(users[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

const createUser = async (req, res) => {
    try {
        const {id, username, email, password} = req.body;

        if (!username) {
            return res.status(400).json({message: 'Username is required'});
        }

        const date = new Date();
        const actualTimeStamp = date.toISOString().split('T')[0] + ' '
            + date.toTimeString().split(' ')[0];

        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (username, email, created_at, updated_at, password) VALUES ($1, $2, $3, $4, $5) RETURNING id';
        const result = await db.query(query, [username, email, actualTimeStamp, actualTimeStamp, hashedPassword]);

        const newUser = {
            username: username,
            email: email,
            created_at: actualTimeStamp,
            updated_at: actualTimeStamp,
            password: hashedPassword,
        };

        const userId = result.rows[0].id;

        res.status(201).json(newUser); // 201 = Created
    } catch (error) {
        console.error(error);

        // Handle duplicated email error
        if (error.code === '23505') {
            return res.status(409).json({message: 'This email or username already exists'});
        }

        res.status(500).json({message: 'Server error', error: error.message});
    }
};

// Edit a user's information by an id
const updateUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        let {username, email, password, oldPassword} = req.body;

        username = username ?? null
        email = email ?? null;
        password = password ?? null;

        if (password !== undefined && password !== null) {
            const result = await db.query('SELECT password FROM users WHERE id = $1', [id]);
            const users = result.rows;
            if (users.length === 0) {
                return res.status(404).json({message: 'User not found'});
            }

            const isPasswordValid = await bcrypt.compare(oldPassword, users[0].password);
            if (!isPasswordValid) {
                return res.status(401).json({message: 'Invalid old password'});
            }

            password = await bcrypt.hash(password, 10);
        }

        const date = new Date();
        const actualTimeStamp = date.toISOString().split('T')[0] + ' '
            + date.toTimeString().split(' ')[0];

        const query = 'UPDATE users SET username = COALESCE($1, username), email = COALESCE($2, email), password = COALESCE($3, password), updated_at = $4 WHERE id = $5';
        const updateResult = await db.query(query, [username, email, password, actualTimeStamp, id]);

        if (updateResult.rowCount === 0) {
            return res.status(404).json({message: 'User not found'});
        }

        // Get the updated user
        const result2 = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        res.json(result2.rows[0]);
    } catch (error) {
        console.error(error);

        // Handle duplicated email error
        if (error.code === '23505') {
            return res.status(409).json({message: 'This email or username already exists'}); // 409 = Conflict
        }

        res.status(500).json({message: 'Server error', error: error.message});
    }
};

const updateUserXp = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        let {xp} = req.body;
        let lvl = null;

        if (xp === undefined) {
            return res.status(400).json({message: 'XP is required'});
        }

        const result = await db.query('SELECT XP, LVL FROM users WHERE id = $1', [id]);
        const existingXpAndLevelAmount = result.rows;

        if (existingXpAndLevelAmount.length === 0) {
            return res.status(404).json({message: 'User not found'});
        }

        const currentXP = existingXpAndLevelAmount[0].xp;
        const currentLVL = existingXpAndLevelAmount[0].lvl;

        if (currentXP + xp > 100) {
            lvl = currentLVL + 1;
            xp = currentXP + xp - 100;
        } else {
            xp = currentXP + xp;
        }

        const query = 'UPDATE users SET XP = COALESCE($1, XP), LVL = COALESCE($2, LVL) WHERE id = $3';
        await db.query(query, [xp, lvl, id]);

        res.status(200).json({message: `User updated successfully, actual lvl ${lvl !== null ? lvl : currentLVL}, actual xp ${xp}`});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
}

// Delete a user by an id
const deleteUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await db.query('DELETE FROM users WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({message: 'User not found'});
        }

        res.status(204).send(); // 204 = No Content
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

const promoteUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        let userRole = await getUserRole(id);

        if (userRole > 1) {
            return res.status(400).json({message: 'User is already an admin'});
        }

        const result = await db.query('UPDATE users SET role = $1 WHERE id = $2', [userRole+1,id]);

        if (result.rowCount === 0) {
            return res.status(404).json({message: 'User not found'});
        }

        res.status(200).json({message: 'User promoted successfully'});

    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
}

const demoteUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        let userRole = await getUserRole(id);

        if (userRole === null) {
            return res.status(404).json({message: 'User not found'});
        }

        if (userRole === 0) {
            return res.status(400).json({message: 'You cannot demote a user with the role of user'});
        }

        const result = await db.query('UPDATE users SET role = $1 WHERE id = $2', [userRole-1,id]);

        if (result.rowCount === 0) {
            return res.status(404).json({message: 'User not found'});
        }

        res.status(200).json({message: 'User demoted successfully'});

    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    updateUserXp,
    deleteUser,
    promoteUser,
    demoteUser
};