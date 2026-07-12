const express = require("express");

const router = express.Router();

const controller = require("../controllers/ari.controller");

router.get("/", controller.getRisk);

module.exports = router;