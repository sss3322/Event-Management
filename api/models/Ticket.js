const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  userid: { type: String, required: true }, // Assuming this is the user ID related to the ticket
  eventid: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true }, // Reference to the Event model
  ticketDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    eventname: { type: String, required: true },
    eventdate: { type: Date, required: true },
    eventtime: { type: String, required: true },
    ticketprice: { type: Number, required: true },
    qr: { type: String, required: true },
  },
  count: { type: Number, default: 0 },
});

const TicketModel = mongoose.model('Ticket', ticketSchema);

module.exports = TicketModel;
