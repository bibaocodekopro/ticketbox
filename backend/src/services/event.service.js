const prisma = require("../config/prisma");

const getEvents = async ({ venue, limit, offset }) => {
    try {
        const events = await prisma.event.findMany({
            where: venue ? { venue } : {},
            include: {
                venue: true,
                seats: true,
            },
            take: Number(limit),
            skip: Number(offset),
            orderBy: {
                startTime: "asc",
            },
        });

        const data = events.map((e) => {
            const minPrice =
                e.seats && e.seats.length
                    ? Math.min(...e.seats.map((s) => Number(s.price)))
                    : null;

            return {
                id: e.id,
                title: e.title,
                description: e.description,
                date: e.startTime,
                venue: e.venue?.name || "",
                city: e.venue?.location || "",
                category: "Live Music",
                priceFrom: minPrice,
                cover: e.image,
            };
        });
        return data;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch events");
    }
};

const getEventById = async (id) => {
    try {
        const e = await prisma.event.findUnique({
            where: { id },
            include: {
                venue: true,
                seats: true,
            },
        });

        if (!e) {
            return null;
        }

        const minPrice =
            e.seats && e.seats.length
                ? Math.min(...e.seats.map((s) => Number(s.price)))
                : null;

        const event = {
            id: e.id,
            title: e.title,
            description: e.description,
            date: e.startTime,
            venue: e.venue?.name || "",
            city: e.venue?.location || "",
            category: "Live Music",
            priceFrom: minPrice,
            cover: e.image,
            ticketTiers: [
                {
                    name: "Ghế tiêu chuẩn",
                    price: minPrice,
                    available: e.seats?.length || 0,
                },
            ],
        };

        return event;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch event detail");
    }
};

const searchEvents = async (q, limit = 10, offset = 0) => {
    try {
        const events = await prisma.event.findMany({
            where: {
                title: {
                    contains: q,
                },
            },
            include: {
                venue: true,
                seats: true,
            },
            take: Number(limit),
            skip: Number(offset),
            orderBy: {
                startTime: "asc",
            },
        });

        const data = events.map((e) => {
            const minPrice =
                e.seats && e.seats.length
                    ? Math.min(...e.seats.map((s) => Number(s.price)))
                    : null;

            return {
                id: e.id,
                title: e.title,
                image: e.image,
                location: e.venue?.location || "",
                venue: e.venue?.name || "",
                priceFrom: minPrice,
            };
        });

        return data;
    } catch (error) {
        console.error("Search error:", error);
        throw new Error("Failed to search events");
    }
};

module.exports = { getEvents, getEventById, searchEvents };
