const prisma = require("../prisma/prismaClient");
const repo = require("../repositories/allocation.repository");

async function allocateAsset(data) {
  const assetId = Number(data.assetId);

  const asset = await prisma.asset.findUnique({
    where: {
      id: assetId,
    },
  });

  if (!asset) {
    throw new Error("Asset not found");
  }

  const activeAllocation = await repo.getActiveAllocation(assetId);

  if (activeAllocation) {
    throw new Error("Asset is already allocated");
  }

  const allocation = await repo.createAllocation({
    assetId,
    employeeName: data.employeeName,
    employeeId: data.employeeId,
    department: data.department,
    expectedReturnDate: data.expectedReturnDate
      ? new Date(data.expectedReturnDate)
      : null,
  });

  await prisma.asset.update({
    where: {
      id: assetId,
    },
    data: {
      status: "ALLOCATED",
    },
  });

  return allocation;
}

module.exports = {
  allocateAsset,
};