const express = require("express");
const prisma = require("../prisma");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcrypt");

const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 5, // tối đa 5 lần register / IP
    message: "Too many accounts created from this IP"
});

router.post("/register", registerLimiter, async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // 1️⃣ Validate input trước
        if (!email || !password) {
            return res.status(400).json({ message: "Invalid input" });
        }

        // 2️⃣ Kiểm tra email trùng
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        // 3️⃣ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4️⃣ Tạo user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword, // 👈 quan trọng
                role: role || "USER"
            },
        });

        // 5️⃣ Không trả password về client
        res.status(201).json({
            message: "Register success",
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        if (error.code === "P2002") {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

const jwt = require('jsonwebtoken');

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1️⃣ Validate input trước
        if (!email || !password) {
            return res.status(400).json({ message: "Invalid input" });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        // 3️⃣ Kiem tra password
        const isPasswordValid = await bcrypt.compare(password, user.password);  // 👈 quan trọng

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN } // ✅ PHẢI là object
        );

        res.status(200).json({
            message: "Login success",
            token: token, // Gửi token về FE
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;