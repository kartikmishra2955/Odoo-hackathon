const prisma = require("../prisma/prismaClient");

const createAllocation = (data) => {
  return prisma.allocation.create({
    data,
  });
};

const getActiveAllocation = (assetId) => {
  return prisma.allocation.findFirst({
    where: {
      assetId: Number(assetId),
      status: "ACTIVE",
    },
  });
};

module.exports = {
  createAllocation,
  getActiveAllocation,
};