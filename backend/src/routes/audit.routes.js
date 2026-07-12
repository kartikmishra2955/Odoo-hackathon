const express = require("express");
const router = express.Router();

const {
  createAuditRequest,
  getAllAuditRequests,
  getAuditRequestById,
  startAuditRequest,
  closeAuditRequest,
} = require("../controllers/audit.controller");

router.post("/", createAuditRequest);

router.get("/", getAllAuditRequests);

router.get("/:id", getAuditRequestById);

router.put("/:id/start", startAuditRequest);

router.put("/:id/close", closeAuditRequest);

module.exports = router;