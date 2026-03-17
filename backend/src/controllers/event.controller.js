const eventService = require("../services/event.service");

const getEvents = async (req, res) => {
    try {
        const { venue, limit = 10, offset = 0 } = req.query;
        const events = await eventService.getEvents({ venue, limit, offset });
        return res.json(events);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch events" });
    }
}

const getEventById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const event = await eventService.getEventById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        return res.json(event);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch event detail" });
    }
}

const searchEvents = async (req, res) => {
    try {
        const { q, limit = 10, offset = 0 } = req.query;
        const events = await eventService.searchEvents(q,  limit, offset );
        return res.json(events);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to search events" });
    }
}

module.exports = { getEvents, getEventById, searchEvents };