const mongoose = require("mongoose");

const adminSettingsSchema = new mongoose.Schema({
  adminPassword: { type: String, required: true },
  btcWalletAddress: { type: String, required: true },
  paypalDetails: {
    email: { type: String, required: true, default: "mclemoreapril7@gmail.com" },
    receiverName: { type: String, required: true, default: "April Mclemore" },
    paymentNote: { type: String, required: true, default: "Family and Friend" },
  },
});

module.exports = mongoose.model("AdminSettings", adminSettingsSchema);
