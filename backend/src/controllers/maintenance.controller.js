const {
  createMaintenance,
  getAllMaintenance,
  getMaintenanceById: getMaintenanceByIdService,
  approveMaintenance: approveMaintenanceService,
  rejectMaintenance: rejectMaintenanceService,
  startMaintenance: startMaintenanceService,
  resolveMaintenance: resolveMaintenanceService,
} = require("../services/maintenance.service");

const createMaintenanceRequest = async (req, res) => {
  const data = await createMaintenance(req.body);

  res.status(201).json({
    success: true,
    message: "Maintenance request created successfully",
    data,
  });
};

const getAllMaintenanceRequests = async (req, res) => {
  const data = await getAllMaintenance();

  res.status(200).json({
    success: true,
    message: "All maintenance requests fetched successfully",
    data,
  });
};

const getMaintenanceById = async (req, res) => {
  const data = await getMaintenanceByIdService(req.params.id);

  res.status(200).json({
    success: true,
    data,
  });
};

const approveMaintenance = async (req, res) => {
  const data = await approveMaintenanceService(req.params.id);

  res.status(200).json({
    success: true,
    message: "Maintenance request approved",
    data,
  });
};

const rejectMaintenance = async (req, res) => {
  const data = await rejectMaintenanceService(req.params.id);

  res.status(200).json({
    success: true,
    message: "Maintenance request rejected",
    data,
  });
};

const startMaintenance = async (req, res) => {
  const data = await startMaintenanceService(req.params.id);

  res.status(200).json({
    success: true,
    message: "Maintenance started",
    data,
  });
};

const resolveMaintenance = async (req, res) => {
  const data = await resolveMaintenanceService(req.params.id);

  res.status(200).json({
    success: true,
    message: "Maintenance resolved",
    data,
  });
};

module.exports = {
  createMaintenanceRequest,
  getAllMaintenanceRequests,
  getMaintenanceById,
  approveMaintenance,
  rejectMaintenance,
  startMaintenance,
  resolveMaintenance,
};