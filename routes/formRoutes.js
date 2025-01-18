const express = require("express");
const {
  submitForm,
  getFormData,
  btcWalletAddress,
  editBtcWalletAddress,
  seedAdminSettings,
  paypalPayment,
  editPaypalDetails,
  getAdminPaymentDetails,
} = require("../controllers/formController");

const router = express.Router();

// Route for form submission
router.post("/submit-form", submitForm);
router.post("/submit-btc", btcWalletAddress);

// Route to fetch form data for the admin dashboard
router.get("/get-form-data", getFormData);
router.post("/edit-btc-wallet-address", editBtcWalletAddress);
router.post("/paypal-payment", paypalPayment);

// Route for admin to edit PayPal payment details
router.post("/edit-paypal-details", editPaypalDetails);
// Route to seed initial admin settings (only use this once)
router.post("/seed-admin-settings", seedAdminSettings);

// Route for random users to view admin payment details
router.get("/get-admin-payment-details", getAdminPaymentDetails);


module.exports = router;
