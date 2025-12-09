const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const EventLog = require("../models/EventLog");

router.get("/", async (req, res) => {
  const events = await Event.find().populate("profiles");
  res.json(events);
});

router.get("/:id", async (req, res) => {
  const event = await Event.findById(req.params.id).populate("profiles");
  if (!event) {
    return res.status(404).json({ message: "Not found" })
  };
  res.json(event);
});

router.get("/:id/logs", async (req, res) => {
  const id = req.params.id;
  const logs = await EventLog.find({ eventId: id }).sort({
    timestampUTC: -1,
  });
  res.json(logs);
});

router.post("/", async (req, res) => {
  const { profiles, eventTimezone, startUTC, endUTC } = req.body;

  if (!profiles || !eventTimezone || !startUTC || !endUTC) {
    return res.status(400).json({ message: "Missing fields" });
  }

  if (new Date(endUTC) < new Date(startUTC)) {
    return res.status(400).json({ message: "end must be after start" });
  }

  const event = new Event({
    profiles,
    eventTimezone,
    startUTC: new Date(startUTC),
    endUTC: new Date(endUTC),
    createdAtUTC: new Date(),
    updatedAtUTC: new Date(),
  });

  await event.save();
  res.status(201).json(await event.populate("profiles"));
});

router.put("/:id", async (req, res) => {
  const { profiles, eventTimezone, startUTC, endUTC, changedBy } = req.body;
  const event = await Event.findById(req.params.id);
  if (!event) {
    return res.status(404).json({ message: "Not found" })
  };

  const prev = {
    profiles: event.profiles,
    eventTimezone: event.eventTimezone,
    startUTC: event.startUTC,
    endUTC: event.endUTC,
  };

  event.profiles = profiles || event.profiles;
  event.eventTimezone = eventTimezone || event.eventTimezone;
  event.startUTC = startUTC ? new Date(startUTC) : event.startUTC;
  event.endUTC = endUTC ? new Date(endUTC) : event.endUTC;
  event.updatedAtUTC = new Date();

  await event.save();

  const next = {
    profiles: event.profiles,
    eventTimezone: event.eventTimezone,
    startUTC: event.startUTC,
    endUTC: event.endUTC,
  };

  const log = new EventLog({
    eventId: event._id,
    changedBy: changedBy,
    prev,
    next,
    timestampUTC: new Date(),
  });
  await log.save();

  res.json(await event.populate("profiles"));
});


module.exports = router;
