const express = require("express");
const prisma = require("../prisma");

const router = express.Router();

router.get("/venues", async (req, res) => {
    const now = new Date();

    const venues = await prisma.venue.findMany({
        include: {
            _count: {
                select: {
                    events: {
                        where: {
                            startTime: {
                                gte: now   // 👈 chỉ lấy event tương lai
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

    res.json(result);
});

router.get("/venues/:id/events", async (req, res) => {
    const { id } = req.params;
    const { limit = 5, offset = 0 } = req.query;

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

    res.json(events);
});

module.exports = router;    