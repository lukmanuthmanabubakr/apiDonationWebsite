// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const cookieParser = require("cookie-parser");

// const formRoutes = require("./routes/formRoutes");

// const app = express();
// const PORT = process.env.PORT || 2002;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());
// app.use(cookieParser());
// app.use(express.static("public"));

// // Routes
// app.use("/form", formRoutes);

// app.get("/", (req, res) => {
//   res.send("Home Page");
// });


// // Database Connection
// mongoose.connect(process.env.MONGO_DB_URL)
//   .then(() => {
//     app.listen(PORT, () => console.log(`Server running on ${PORT}`));
//   })
//   .catch((err) => console.error("Database connection error:", err));

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const countriesRoutes = require("./routes/countriesRoutes");


const formRoutes = require("./routes/formRoutes");


const app = express();
app.use("/api", countriesRoutes);
const PORT = process.env.PORT || 2002;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies
app.use(express.static("public")); // Serve static files

// Routes
app.use("/form", formRoutes);

// Base Route
app.get("/", (req, res) => {
  res.send("Home Page");
});

// Database Connection
mongoose
  .connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true, // Ensure compatibility with older MongoDB URIs
    useUnifiedTopology: true, // Optimize connection handling
  })
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("Database connection error:", err.message);
  });
