const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");

const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Too many accounts created from this IP",
});

const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ status: "error", message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default-secret");
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ status: "error", message: "Invalid or expired token" });
    }
};

const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "ADMIN") {
        return res.status(403).json({ status: "error", message: "Admin access required" });
    }
    next();
};

module.exports = {
    registerLimiter,
    requireAuth,
    requireAdmin,
};
