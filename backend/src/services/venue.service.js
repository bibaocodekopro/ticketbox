const prisma = require("../config/prisma");
const getVenues = async () => {
    const now = new Date();
    try {
        const venues = await prisma.venue.findMany({
            include: {
                _count: {
                    select: {
                        events: {
                            where: {
                                startTime: {
                                    gte: now   // 👈 chỉ lý event tương lai
                                }
                            }
                        }
                    }
                }
            }
        });

        const result = venues.map(v => ({
            id: v.id,
            name: v.name,
            eventCount: v._count.events
        }));
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
const getEventsByVenueId = async (id, limit, offset) => {
    try {
        const now = new Date();
        const events = await prisma.event.findMany({
            where: {
                venueId: Number(id),
                startTime: { gte: now }
            },
            take: Number(limit),
            skip: Number(offset),
            orderBy: { startTime: "asc" }
        });

        return events;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

module.exports = {
    getVenues,
    getEventsByVenueId
};