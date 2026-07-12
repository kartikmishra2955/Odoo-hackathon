const assetRepository = require("../repositories/asset.repository");
const generateAssetTag = require("../utils/assetTagGenerator");

async function createAsset(assetData) {

    // Create asset first
    const asset = await assetRepository.createAsset({
        ...assetData,
        assetTag: "TEMP"
    });

    // Generate Asset Tag
    const assetTag = generateAssetTag(asset.id);

    // Update asset with generated tag
    const updatedAsset = await assetRepository.updateAsset(asset.id, {
        assetTag
    });

    return updatedAsset;
}
const getAllAssets = () => assetRepository.getAllAssets();

const getAssetById = (id) =>
    assetRepository.getAssetById(Number(id));
module.exports = {
    createAsset,
    getAllAssets,
    getAssetById
};