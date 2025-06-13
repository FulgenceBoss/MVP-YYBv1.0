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

// Load env vars from root .env file
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middlewares
app.use(express.json()); // Body parser
app.use(cors()); // Enable CORS
app.use(helmet()); // Set security headers
app.use(morgan("dev")); // Log HTTP requests

// Mount routers
app.use("/api/auth", authRoutes);
app.use("/api/savings", savingsRoutes);

// Initialize CRON jobs
initScheduledJobs();

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
