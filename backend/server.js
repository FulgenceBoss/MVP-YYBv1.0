const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const initScheduledJobs = require("./services/cronService");

// Route files
const authRoutes = require("./routes/auth");
const savingsRoutes = require("./routes/savings");
const analyticsRoutes = require("./routes/analytics");
const userRoutes = require("./routes/user");

// Load env vars from root .env file
dotenv.config();

const app = express();

// Middlewares
app.use(express.json()); // Body parser
app.use(cors()); // Enable CORS
app.use(helmet()); // Set security headers

// Use morgan for logging, but only in development environment
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount routers
app.use("/api/auth", authRoutes);
app.use("/api/savings", savingsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB Connected...");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      );
      // Initialize CRON jobs only after the server is successfully running
      initScheduledJobs();
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
};

startServer();
