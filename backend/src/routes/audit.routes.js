const express = require("express");

const router = express.Router();

router.post("/");
router.get("/");
router.get("/:id");

router.post("/:id/assign");
router.post("/:id/verify");
router.post("/:id/close");

module.exports = router;