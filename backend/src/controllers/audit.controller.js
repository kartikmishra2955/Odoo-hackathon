const {
  createAudit,
  getAllAudits,
  getAuditById,
  startAudit,
  closeAudit,
} = require("../services/audit.service");

const createAuditRequest = async (req, res) => {
  const data = await createAudit(req.body);

  res.status(201).json({
    success: true,
    message: "Audit created successfully",
    data,
  });
};

const getAllAuditRequests = async (req, res) => {
  const data = await getAllAudits();

  res.status(200).json({
    success: true,
    message: "All audits fetched successfully",
    data,
  });
};

const getAuditRequestById = async (req, res) => {
  const data = await getAuditById(req.params.id);

  res.status(200).json({
    success: true,
    data,
  });
};

const startAuditRequest = async (req, res) => {
  const data = await startAudit(req.params.id);

  res.status(200).json({
    success: true,
    message: "Audit started successfully",
    data,
  });
};

const closeAuditRequest = async (req, res) => {
  const data = await closeAudit(req.params.id);

  res.status(200).json({
    success: true,
    message: "Audit closed successfully",
    data,
  });
};

module.exports = {
  createAuditRequest,
  getAllAuditRequests,
  getAuditRequestById,
  startAuditRequest,
  closeAuditRequest,
};