const express = require("express");
const router = express.Router();
const venueController = require("../controllers/venue.controller");

router.get("/venues", venueController.getVenues);
router.get("/venues/:id/events", venueController.getEventsByVenueId);

module.exports = router;    