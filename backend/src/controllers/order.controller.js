const prisma = require("../config/prisma");
const { success, error } = require("../utils/response");

const createOrder = async (req, res) => {
    try {
        const { eventId, seatIds } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return error(res, "Unauthorized", 401);
        }

        // Transaction: lock seats + create order
        const result = await prisma.$transaction(async (tx) => {
            const seats = await tx.seat.findMany({
                where: {
                    id: { in: seatIds },
                    eventId: eventId,
                },
            });

            if (seats.length !== seatIds.length) {
                throw new Error("One or more seats not found");
            }

            const unavailable = seats.filter((s) => s.status !== "AVAILABLE");
            if (unavailable.length > 0) {
                throw new Error("One or more seats are not available");
            }

            const totalAmount = seats.reduce((sum, s) => sum + s.price, 0);

            const order = await tx.order.create({
                data: {
                    totalAmount,
                    userId,
                    items: {
                        create: seatIds.map((seatId) => ({
                            seatId,
                            price: seats.find((s) => s.id === seatId).price,
                        })),
                    },
                },
                include: { items: true },
            });

            await tx.seat.updateMany({
                where: { id: { in: seatIds } },
                data: { status: "RESERVED" },
            });

            return order;
        });

        return success(res, result, "Order created, seats reserved");
    } catch (err) {
        console.error("Create order error:", err);
        return error(res, err.message || "Failed to create order", 400);
    }
};

const payOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        const order = await prisma.order.findUnique({
            where: { id: Number(id) },
            include: { items: true },
        });

        if (!order) return error(res, "Order not found", 404);
        if (order.userId !== userId) return error(res, "Forbidden", 403);
        if (order.status !== "PENDING") return error(res, "Order cannot be paid", 400);

        await prisma.$transaction(async (tx) => {
            await tx.order.update({ where: { id: Number(id) }, data: { status: "PAID" } });
            const seatIds = order.items.map((item) => item.seatId);
            await tx.seat.updateMany({ where: { id: { in: seatIds } }, data: { status: "SOLD" } });
            await tx.payment.create({
                data: { orderId: order.id, amount: order.totalAmount, status: "SUCCESS", paidAt: new Date() },
            });
        });

        return success(res, null, "Payment successful");
    } catch (err) {
        console.error("Pay order error:", err);
        return error(res, "Payment failed", 500);
    }
};

const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        const order = await prisma.order.findUnique({
            where: { id: Number(id) },
            include: { items: true },
        });

        if (!order) return error(res, "Order not found", 404);
        if (order.userId !== userId) return error(res, "Forbidden", 403);
        if (order.status !== "PENDING") return error(res, "Only pending orders can be cancelled", 400);

        await prisma.$transaction(async (tx) => {
            const seatIds = order.items.map((item) => item.seatId);
            await tx.seat.updateMany({ where: { id: { in: seatIds } }, data: { status: "AVAILABLE" } });
            await tx.order.update({ where: { id: Number(id) }, data: { status: "CANCELLED" } });
        });

        return success(res, null, "Order cancelled, seats released");
    } catch (err) {
        console.error("Cancel order error:", err);
        return error(res, "Failed to cancel order", 500);
    }
};

const getOrders = async (req, res) => {
    try {
        const userId = req.user?.id;
        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                items: { include: { seat: { include: { event: { include: { venue: true } } } } } },
                payment: true,
            },
            orderBy: { createdAt: "desc" },
        });
        return success(res, orders, "Orders retrieved");
    } catch (err) {
        console.error("Get orders error:", err);
        return error(res, "Failed to get orders", 500);
    }
};

const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const order = await prisma.order.findUnique({
            where: { id: Number(id) },
            include: {
                items: { include: { seat: { include: { event: { include: { venue: true } } } } } },
                payment: true,
            },
        });

        if (!order) return error(res, "Order not found", 404);
        if (order.userId !== userId) return error(res, "Forbidden", 403);
        return success(res, order, "Order retrieved");
    } catch (err) {
        console.error("Get order error:", err);
        return error(res, "Failed to get order", 500);
    }
};

module.exports = { createOrder, payOrder, cancelOrder, getOrders, getOrderById };
