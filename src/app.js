require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const ariRoutes = require("./routes/ari.routes");
const assetRoutes = require("./routes/asset.routes");
const allocationRoutes = require("./routes/allocation.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const app = express();
const bookingRoutes = require("./routes/booking.routes");
// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Health Check
app.get("/", (req, res) => {
    res.json({
        message: "AssetFlow Backend Running 🚀",
    });
});

// Routes
app.use("/api/assets", assetRoutes);
app.use("/api/allocations", allocationRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ari", ariRoutes);
// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

module.exports = app;