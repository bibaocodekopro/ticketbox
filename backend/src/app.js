require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require("./routes/auth.routes");

// Cấu hình CORS chi tiết - ĐÂY LÀ PHẦN QUAN TRỌNG CẦN SỬA
app.use(cors({
    origin: 'http://localhost:5173',  // Chỉ định chính xác frontend URL (Vue default port)
    credentials: true,                 // Cho phép gửi/nhận cookie
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// Route test
app.get('/', (req, res) => {
    res.json({ message: "TicketBox API running 🚀" });
});

// Routes
app.use("/api", authRoutes);

module.exports = app;