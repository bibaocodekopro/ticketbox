const express = require("express");
const prisma = require("../prisma");

const router = express.Router();

// Lấy danh sách event (kèm venue, giá thấp nhất từ seat)
router.get("/events", async (req, res) => {
  try {
    const { venue, limit = 10, offset = 0 } = req.query;
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

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

// Lấy chi tiết 1 event
router.get("/events/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
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

    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch event detail" });
  }
});

module.exports = router;

