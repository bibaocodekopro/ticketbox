
const prisma = require("../config/prisma");
const { Client } = require("@elastic/elasticsearch");
const es = new Client({
    node: "http://localhost:9200",
});
const getEvents = async ({ venue, limit, offset }) => {
    try {
        const events = await prisma.event.findMany({
            where: venue ? { venue } : {},
            include: {
                venue: true,
                seat: true,
            },
            take: Number(limit),
            skip: Number(offset),
            orderBy: {
                startTime: "asc",
            },
        });

        const data = events.map((e) => {
            const minPrice =
                e.seat && e.seat.length
                    ? Math.min(...e.seat.map((s) => Number(s.price)))
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
                seat: true,
            },
        });

        if (!e) {
            return res.status(404).json({ message: "Event not found" });
        }

        const minPrice =
            e.seat && e.seat.length
                ? Math.min(...e.seat.map((s) => Number(s.price)))
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
                    available: e.seat?.length || 0,
                },
            ],
        };

        return res.json(event);
    } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch events");
    }
}

const searchEvents = async (q) => {
    try {
        const result = await es.search({
            index: "events",
            query: {
                match: {
                    title: q
                }
            }
        });

        const events = result.hits.hits.map(hit => ({
            id: hit._id,
            ...hit._source
        }));

        return events;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch events" });
    }
}
module.exports = { getEvents, getEventById, searchEvents };