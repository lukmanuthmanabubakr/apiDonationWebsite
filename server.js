require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const countriesRoutes = require("./routes/countriesRoutes");
const formRoutes = require("./routes/formRoutes");


const app = express();

// Define PORT from environment variable or default to 2002
const PORT = process.env.PORT;

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies
app.use(express.static("public")); 

app.use(cors({
  origin: process.env.FRONTEND_URL, // Allow requests from the frontend URL
  credentials: true,
}));
// Serve static files

// Routes
app.use("/api", countriesRoutes);
app.use("/form", formRoutes);

// Base Route
app.get("/", (req, res) => {
  res.send("Home Page");
});

// Database Connection
mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("Database connection error:", err.message);
  });
