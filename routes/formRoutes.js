const express = require("express");
const { submitForm, getFormData, btcWalletAddress, editBtcWalletAddress, seedAdminSettings } = require("../controllers/formController");

const router = express.Router();

// Route for form submission
router.post("/submit-form", submitForm);
router.post("/submit-btc", btcWalletAddress);

// Route to fetch form data for the admin dashboard
router.get("/get-form-data", getFormData);
router.post("/edit-btc-wallet-address", editBtcWalletAddress);
// Route to seed initial admin settings (only use this once)
router.post("/seed-admin-settings", seedAdminSettings);



module.exports = router;
