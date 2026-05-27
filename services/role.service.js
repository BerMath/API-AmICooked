const {promisePool: db} = require('../config/database');

async function getUserRole(userId) {
    const [user] = await db.query('SELECT role FROM Users WHERE id = ?', [userId]);
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

