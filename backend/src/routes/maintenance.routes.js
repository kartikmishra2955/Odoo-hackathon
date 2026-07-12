const express = require("express");
const router = express.Router();

const {
  createMaintenanceRequest,
  getAllMaintenanceRequests,
  getMaintenanceById,
  approveMaintenance,
  rejectMaintenance,
  startMaintenance,
  resolveMaintenance
} = require("../controllers/maintenance.controller");

router.post("/", createMaintenanceRequest);
router.get("/", getAllMaintenanceRequests);
router.get("/:id", getMaintenanceById);

router.put("/:id/approve", approveMaintenance);
router.put("/:id/reject", rejectMaintenance);
router.put("/:id/start", startMaintenance);
router.put("/:id/resolve", resolveMaintenance);

module.exports = router;