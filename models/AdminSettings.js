const mongoose = require("mongoose");

const adminSettingsSchema = new mongoose.Schema({
  btcWalletAddress: {
    type: String,
    required: true,
  },
  adminPassword: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("AdminSettings", adminSettingsSchema);
