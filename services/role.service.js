const {pool: db} = require('../config/database');

async function getUserRole(userId) {
    const result = await db.query('SELECT role FROM users WHERE id = $1', [userId]);
    const user = result.rows;
    if (user.length === 0) {
        return null
    }
    return user[0].role;
}

async function hasRequiredRole({userId, roleMin}) {
    return await getUserRole(userId) >= roleMin;
}

module.exports = {
    hasRequiredRole,
    getUserRole
};

