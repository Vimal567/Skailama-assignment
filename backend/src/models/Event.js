const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  profiles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },
  ],
  eventTimezone: {
    type: String,
    required: true,
  },
  startUTC: {
    type: Date,
    required: true,
  },
  endUTC: {
    type: Date,
    required: true,
  },
  createdAtUTC: {
    type: Date,
    default: () => new Date(),
  },
  updatedAtUTC: {
    type: Date,
    default: () => new Date(),
  },
});

module.exports = mongoose.model("Event", EventSchema);