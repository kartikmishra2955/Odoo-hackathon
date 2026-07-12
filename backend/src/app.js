const express = require("express");
const cors = require("cors");

const maintenanceRoutes = require("./routes/maintenance.routes");
const auditRoutes = require("./routes/audit.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/audit", auditRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "AssetFlow Backend Running Successfully"
    });
});

module.exports = app;