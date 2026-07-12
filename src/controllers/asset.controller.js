const assetService = require("../services/asset.service");
const assetSchema = require("../validations/asset.validation");

// Create Asset
async function createAsset(req, res) {
    try {
        const validatedData = assetSchema.parse(req.body);

        const asset = await assetService.createAsset(validatedData);

        return res.status(201).json({
            success: true,
            message: "Asset created successfully",
            data: asset,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

// Get All Assets
async function getAllAssets(req, res) {
    try {
        const assets = await assetService.getAllAssets();

        return res.status(200).json({
            success: true,
            count: assets.length,
            data: assets,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// Get Asset By ID
async function getAssetById(req, res) {
    try {
        const asset = await assetService.getAssetById(req.params.id);

        if (!asset) {
            return res.status(404).json({
                success: false,
                message: "Asset not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: asset,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

module.exports = {
    createAsset,
    getAllAssets,
    getAssetById,
};