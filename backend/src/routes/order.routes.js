const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// All order routes require authentication
router.use(authMiddleware.requireAuth);

router.post("/orders", orderController.createOrder);
router.get("/orders", orderController.getOrders);
router.get("/orders/:id", orderController.getOrderById);
router.post("/orders/:id/pay", orderController.payOrder);
router.delete("/orders/:id", orderController.cancelOrder);

module.exports = router;
