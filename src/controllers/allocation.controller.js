const service = require("../services/allocation.service");

async function allocateAsset(req, res) {
  try {
    const allocation = await service.allocateAsset(req.body);

    res.status(201).json({
      success: true,
      message: "Asset allocated successfully",
      data: allocation,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  allocateAsset,
};