const express = require("express");

const router = express.Router();

const controller = require("../controllers/allocation.controller");

router.post("/", controller.allocateAsset);

module.exports = router;