const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const { registerLimiter } = authMiddleware;
const authController = require("../controllers/auth.controller");

router.post("/register", registerLimiter, authController.register);
router.post("/login", authController.login);

module.exports = router;