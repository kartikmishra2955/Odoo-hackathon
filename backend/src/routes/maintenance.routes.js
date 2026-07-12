const express = require("express");

const router = express.Router();

// Create maintenance request
router.post("/");

// Get all maintenance requests
router.get("/");

// Get maintenance by id
router.get("/:id");

// Approve maintenance request
router.put("/:id/approve");

// Reject maintenance request
router.put("/:id/reject");

// Start maintenance work
router.put("/:id/start");

// Resolve maintenance request
router.put("/:id/resolve");

module.exports = router;