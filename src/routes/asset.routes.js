const express = require("express");

const router = express.Router();

const assetController = require("../controllers/asset.controller");

router.post("/", assetController.createAsset);

router.get("/", assetController.getAllAssets);

router.get("/:id", assetController.getAssetById);

module.exports = router;