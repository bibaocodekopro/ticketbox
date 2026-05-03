// Centralized API response helper
// Usage: return res.success(res, data, "OK") or return res.error(res, "msg", 400)

const success = (res, data, message = "OK") => {
    return res.json({ status: "success", message, data });
};

const error = (res, message = "Error", statusCode = 500) => {
    return res.status(statusCode).json({ status: "error", message });
};

const health = async (req, res) => {
    const prisma = require("../config/prisma");
    try {
        await prisma.$queryRaw`SELECT 1`;
        return res.json({ status: "success", message: "Service is healthy", db: "connected" });
    } catch (error) {
        return res.status(503).json({ status: "error", message: "Database connection failed", db: "disconnected" });
    }
};

module.exports = { success, error, health };
