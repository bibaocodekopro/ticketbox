const venueService = require("../services/venue.service");

const getVenues = async (req, res) => {
    try {
        const venues = await venueService.getVenues();
        return res.json(venues);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch venues" });
    }
}

const getEventsByVenueId = async (req, res) => {
    const { id } = req.params;
    const { limit = 5, offset = 0 } = req.query;
    try {
        const events = await venueService.getEventsByVenueId(id, limit, offset);
        return res.json(events);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch venue detail" });
    }
}
module.exports = { getVenues, getEventsByVenueId };