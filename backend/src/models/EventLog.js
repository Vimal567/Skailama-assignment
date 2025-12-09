const mongoose = require('mongoose');

const EventLogSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event', required: true
  },
  changedBy: {
    type: String
  },
  prev: {
    type: mongoose.Schema.Types.Mixed
  },
  next: {
    type: mongoose.Schema.Types.Mixed
  },
  timestampUTC: {
    type: Date,
    default: () => new Date()
  }
});


module.exports = mongoose.model('EventLog', EventLogSchema);