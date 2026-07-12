const createMaintenance = async (data) => {
  return {
    id: "MNT-001",
    ...data,
    status: "PENDING"
  };
};

const getAllMaintenance = async () => {
  return [];
};

const getMaintenanceById = async (id) => {
  return {
    id,
    assetId: "AF-001",
    priority: "HIGH",
    status: "PENDING"
  };
};

const approveMaintenance = async (id) => {
  return {
    id,
    status: "APPROVED"
  };
};

const rejectMaintenance = async (id) => {
  return {
    id,
    status: "REJECTED"
  };
};

const startMaintenance = async (id) => {
  return {
    id,
    status: "IN_PROGRESS"
  };
};

const resolveMaintenance = async (id) => {
  return {
    id,
    status: "RESOLVED"
  };
};

module.exports = {
  createMaintenance,
  getAllMaintenance,
  getMaintenanceById,
  approveMaintenance,
  rejectMaintenance,
  startMaintenance,
  resolveMaintenance,
};