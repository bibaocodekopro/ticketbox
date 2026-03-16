const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const register = async ({ email, password, role }) => {

    if (!email || !password) {
        throw new Error("Invalid input");
    }

    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            role: role || "USER"
        }
    });

    return {
        id: user.id,
        email: user.email,
        role: user.role
    };
};

const login = async ({ email, password }) => {
    if (!email || !password) {
        throw new Error("Invalid input");
    }

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error("Invalid password");
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
    return {
        token: token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role
        }
    }
};

module.exports = { register, login };