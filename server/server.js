require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");

// =========================================
// ENVIRONMENT VALIDATION
// =========================================

const requiredEnv = [
  "MONGO_URI",
  "JWT_SECRET",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(
      `Missing required environment variable: ${key}`
    );
  }
}

// =========================================
// APP
// =========================================

const app = express();

const PORT = process.env.PORT || 5000;

// =========================================
// DATABASE
// =========================================

connectDB();

// =========================================
// MIDDLEWARE
// =========================================

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:5173",

    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());

// =========================================
// ROOT
// =========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ZANHOD API is running",
  });
});

// =========================================
// HEALTH CHECK
// =========================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    service: "ZANHOD API",
    status: "healthy",
  });
});

// =========================================
// ROUTES
// =========================================

app.use("/api/orders", orderRoutes);

app.use("/api/admin", adminRoutes);

// =========================================
// START SERVER
// =========================================

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `ZANHOD server running on port ${PORT}`
  );
});
