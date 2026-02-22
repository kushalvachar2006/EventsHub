const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const { errorHandler } = require("./middleware/errorMiddleware");

// Load env vars
dotenv.config();

// Import Routes
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const studentRoutes = require("./routes/studentRoutes");
const hostRoutes = require("./routes/hostRoutes");
const adminRoutes = require("./routes/adminRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: false }));

// Routes
app.get("/api", (req, res) => {
  res.send("Welcome to the Event Management API");
})
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes); // Public & Host
app.use("/api/student", studentRoutes); // Protected Student
app.use("/api/host", hostRoutes); // Protected Host
app.use("/api/admin", adminRoutes); // Protected Admin
app.use("/api/notifications", notificationRoutes); // Protected Notifications

// Error Handler
app.use(errorHandler);

// Database Connection
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log(err));
