const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  country: { type: String, required: true },
  paypalEmail: { type: String, required: true },
  receiverName: { type: String, required: true },
  paymentNote: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", paymentSchema);
