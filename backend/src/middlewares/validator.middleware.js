const { z } = require("zod");

const registerSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.string().optional(),
});

const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
});

const createOrderSchema = z.object({
    eventId: z.number().int().positive("Event ID is required"),
    seatIds: z.array(z.number().int().positive()).min(1, "At least one seat is required"),
});

const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        const errors = result.error.errors.map((e) => e.message);
        return res.status(400).json({ status: "error", messages: errors });
    }
    req.body = result.data;
    next();
};

module.exports = {
    registerSchema,
    loginSchema,
    createOrderSchema,
    validate,
};
