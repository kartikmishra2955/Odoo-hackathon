const prisma = require("../prisma/prismaClient");

const createAsset = (data) =>
    prisma.asset.create({ data });

const updateAsset = (id, data) =>
    prisma.asset.update({
        where: { id },
        data,
    });

const getAllAssets = () =>
    prisma.asset.findMany({
        include: {
            category: true,
        },
    });

const getAssetById = (id) =>
    prisma.asset.findUnique({
        where: { id },
        include: {
            category: true,
        },
    });

module.exports = {
    createAsset,
    updateAsset,
    getAllAssets,
    getAssetById,
};