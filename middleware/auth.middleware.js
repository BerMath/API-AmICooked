const jwt = require('jsonwebtoken');
const {hasRequiredRole} = require('../services/role.service');

function requireAuth(req, res, next) {
    const authHeader = req.headers['Authorization'] || req.headers['authorization'] || req.headers['access-token'];

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({error: 'Missing Token'});
    }

    const token = authHeader.slice(7);

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({error: 'Token expired'});
        }
        return res.status(401).json({error: 'Unauthorized'});
    }
}

function requireRoleOrSameUser(roleMin) {
    return async (req, res, next) => {
        try {
            const hasRole = await hasRequiredRole({
                userId: req.user?.id,
                roleMin,
            });

            if (hasRole || parseInt(req.params.id) === req.user?.id) {
                next();
                return;
            }

            return res.status(403).json({error: 'Forbidden'});
        } catch (error) {
            console.error('Role verification failed:', error.message);
            return res.status(502).json({error: 'Role verification service unavailable'});
        }
    };
}

function requireRole(roleMin) {
    return async (req, res, next) => {
        try {
            const hasRole = await hasRequiredRole({
                userId: req.user?.id,
                roleMin,
            });

            if (!hasRole) {
                return res.status(403).json({error: 'Forbidden'});
            }

            next();
        } catch (error) {
            console.error('Role verification failed:', error.message);
            return res.status(502).json({error: 'Role verification service unavailable'});
        }
    };
}

function sameUser() {
    return async (req, res, next) => {
        try {
            if (!(parseInt(req.params.id) === req.user?.id)) {
                return res.status(403).json({error: 'Forbidden'});
            }
            next();
        } catch (error) {
            console.error('Role verification failed:', error.message);
            return res.status(502).json({error: 'Forbidden'});
        }
    }
}

module.exports = {requireAuth, requireRoleOrSameUser, requireRole, sameUser};