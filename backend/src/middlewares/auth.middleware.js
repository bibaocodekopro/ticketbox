const rateLimit = require("express-rate-limit");

const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 5, // tối đa 5 lần register / IP
    message: "Too many accounts created from this IP"
});

module.exports = {
    registerLimiter
};
