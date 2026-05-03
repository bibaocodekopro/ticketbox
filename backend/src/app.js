require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require("./routes/auth.routes");
const eventRoutes = require("./routes/event.routes");
const venueRoutes = require("./routes/venue.routes");
const orderRoutes = require("./routes/order.routes");
const { health } = require("./utils/response");

// CORS - open for development
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// Health check
app.get('/health', health);

// Route test
app.get('/', (req, res) => {
    res.json({ message: "TicketBox API running 🚀" });
});

// Routes
app.use("/api", authRoutes);
app.use("/api", eventRoutes);
app.use("/api", venueRoutes);
app.use("/api", orderRoutes);

module.exports = app;
