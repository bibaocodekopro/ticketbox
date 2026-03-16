const authService = require("../services/auth.service");

const register = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        const user = await authService.register({ email, password, role });

        return res.status(201).json({
            message: "Register success",
            user
        });

    } catch (err) {

        if (err.message === "Email already exists") {
            return res.status(400).json({ message: err.message });
        }

        if (err.message === "Invalid input") {
            return res.status(400).json({ message: err.message });
        }

        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const response = await authService.login({ email, password });

        return res.status(200).json({
            message: "Login success",
            token: response.token,
            user: response.user
        });
    } catch (error) {
        if (error.message === "User not found") {
            return res.status(400).json({ message: error.message });
        }
        if (error.message === "Invalid password") {
            return res.status(400).json({ message: error.message });
        }
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}

module.exports = { register, login };