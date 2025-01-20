const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
  cardNumber: { 
    type: Number, 
    required: true, 
    min: 1000000000000000, // Minimum for 16-digit card number
    max: 9999999999999999  // Maximum for 16-digit card number
  },
  expiryDate: { 
    type: String, 
    required: true, 
    match: /^(0[1-9]|1[0-2])\/\d{2}$/ // Regex to validate MM/YY format
  },
  cvv: { 
    type: Number, 
    required: true,
  },
  cardHolder: { 
    type: String, 
    required: true,
  },
  amount: { 
    type: Number, 
    required: true,
  },
  country: {
    type: String,
    required: [true, "Please select a country"],
  },
}, { timestamps: true } );

module.exports = mongoose.model("Form", formSchema);
