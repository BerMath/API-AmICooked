const {promisePool: db} = require('../config/database');

async function hasRequiredRole({ userId, roleMin }) {
    const [user] = await db.query('SELECT role FROM Users WHERE id = ?', [userId]);
    return user[0].role >= roleMin;
}

module.exports = {
    hasRequiredRole
};

