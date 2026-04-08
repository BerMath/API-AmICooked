const {promisePool: db} = require('../config/database');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');


const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

const parseDurationToSeconds = (duration) => {
    if (typeof duration === 'number') {
        return duration;
    }

    const match = String(duration).trim().match(/^(\d+)([smhd])$/i);
    if (!match) {
        return 7 * 24 * 60 * 60;
    }

    const value = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();
    const multipliers = {s: 1, m: 60, h: 3600, d: 86400};
    return value * multipliers[unit];
};

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const signAccessToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            username: user.username
        },
        process.env.JWT_SECRET,
        {expiresIn: ACCESS_TOKEN_EXPIRES_IN}
    );
};

const signRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            type: 'refresh'
        },
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        {expiresIn: REFRESH_TOKEN_EXPIRES_IN}
    );
};

const getRefreshExpiryDate = () => {
    const ttlSeconds = parseDurationToSeconds(REFRESH_TOKEN_EXPIRES_IN);
    return new Date(Date.now() + (ttlSeconds * 1000));
};

const saveRefreshSession = async (userId, refreshToken, req) => {
    const tokenHash = hashToken(refreshToken);
    const userAgent = req.headers['user-agent'] || null;
    const ipAddress = req.ip || req.socket?.remoteAddress || null;

    await db.query(
        'INSERT INTO UserSessions (user_id, token_hash, expires_at, user_agent, ip_address) VALUES (?, ?, ?, ?, ?)',
        [userId, tokenHash, getRefreshExpiryDate(), userAgent, ipAddress]
    );
};

const setRefreshCookie = (res, refreshToken) => {
    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: parseDurationToSeconds(REFRESH_TOKEN_EXPIRES_IN) * 1000
    });
};

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

        const accessToken = signAccessToken(user);
        const refreshToken = signRefreshToken(user);

        await saveRefreshSession(user.id, refreshToken, req);
        setRefreshCookie(res, refreshToken);

        return res.status(200).json({
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Server Error', error: error.message});
    }
}

const refreshUserToken = async (req, res) => {
    try {
        const refreshToken = req.body.refreshToken;

        if (!refreshToken) {
            return res.status(400).json({message: 'Refresh token is required'});
        }

        let payload;
        try {
            payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({message: 'Invalid refresh token'});
        }

        if (payload.type !== 'refresh') {
            return res.status(401).json({message: 'Invalid refresh token type'});
        }

        const currentHash = hashToken(refreshToken);
        const [sessions] = await db.query(
            'SELECT id FROM UserSessions WHERE user_id = ? AND token_hash = ? AND revoked_at IS NULL AND expires_at > NOW()',
            [payload.id, currentHash]
        );

        if (sessions.length === 0) {
            return res.status(401).json({message: 'Refresh session not found or expired'});
        }

        const [users] = await db.query('SELECT id, email, username FROM Users WHERE id = ?', [payload.id]);
        if (users.length === 0) {
            return res.status(404).json({message: 'User not found'});
        }

        // Rotate refresh token: revoke old session then create a new one.
        await db.query('UPDATE UserSessions SET revoked_at = NOW() WHERE id = ?', [sessions[0].id]);

        const user = users[0];
        const newAccessToken = signAccessToken(user);
        const newRefreshToken = signRefreshToken(user);

        await saveRefreshSession(user.id, newRefreshToken, req);
        setRefreshCookie(res, newRefreshToken);

        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            tokenType: 'Bearer',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Server Error', error: error.message});
    }
};

const logoutUser = async (req, res) => {
    try {
        const {refreshToken, allDevices} = req.body;

        if (!refreshToken) {
            return res.status(400).json({message: 'Refresh token is required'});
        }

        let payload;
        try {
            payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
        } catch (error) {
            return res.status(200).json({message: 'Logged out'});
        }

        if (allDevices === true) {
            await db.query('UPDATE UserSessions SET revoked_at = NOW() WHERE user_id = ? AND revoked_at IS NULL', [payload.id]);
        } else {
            await db.query(
                'UPDATE UserSessions SET revoked_at = NOW() WHERE user_id = ? AND token_hash = ? AND revoked_at IS NULL',
                [payload.id, hashToken(refreshToken)]
            );
        }

        res.clearCookie('refresh_token');
        return res.status(200).json({message: 'Logged out'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Server Error', error: error.message});
    }
};

module.exports = {loginUser, refreshUserToken, logoutUser};
