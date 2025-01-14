const mongoose = require("mongoose");

const btcSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    walletAddress: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Btc", btcSchema);
