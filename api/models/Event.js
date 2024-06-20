const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  participants: { type: Number, default: 0 },
  ticketsSold: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
});

const EventModel = mongoose.model('Event', eventSchema);
module.exports = EventModel;
