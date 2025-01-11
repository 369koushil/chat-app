const jwt = require('jsonwebtoken');
const redisService = require('../services/redis.service');

const authUser = async (req, res, next) => {
    try {
        // Retrieve token from headers or cookies
        const token = req.headers.authorization?.split(" ")[1] || req.cookies?.token;
        console.log('Received token:', token);

        if (!token) {
            return res.status(401).json({ error: "Token is required" });
        }

        // Check if token is blacklisted in Redis
        const isBlacklisted = await redisService.redisClient.get(token);
        console.log('Is token blacklisted:', isBlacklisted);

        if (isBlacklisted) {
            res.cookie('token', '', { httpOnly: true });
            return res.status(401).json({ msg: "Token is expired or invalid" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.SECRET);
        console.log('Decoded token:', decoded);

        // Attach user information to request
        req.user = decoded.email;
        next();
    } catch (err) {
        console.error('Token verification error:', err.message);
        res.status(401).json({ error: "Invalid or expired token" });
    }
};

module.exports = {
    authUser
};
