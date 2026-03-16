const app = require('./src/app');
const prisma = require('./src/config/prisma');

const PORT = process.env.PORT || 8000;

async function startServer() {
    try {
        await prisma.$connect();
        console.log("✅ Database connected");

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });

    } catch (err) {
        console.error("❌ Database connection failed:", err);
        process.exit(1);
    }
}

startServer();