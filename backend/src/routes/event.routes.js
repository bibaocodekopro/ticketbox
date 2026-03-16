const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event.controller");

router.get("/events", eventController.getEvents);
router.get("/events/:id", eventController.getEventById);
router.get("/events/search", eventController.searchEvents);
module.exports = router;

