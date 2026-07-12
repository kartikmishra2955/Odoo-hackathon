const createAudit = async (data) => {
  return {
    id: "AUD-001",
    ...data,
    status: "OPEN",
  };
};

const getAllAudits = async () => {
  return [
    {
      id: "AUD-001",
      assetId: "ASSET-101",
      auditor: "Anand",
      status: "OPEN",
    },
  ];
};

const getAuditById = async (id) => {
  return {
    id,
    assetId: "ASSET-101",
    auditor: "Anand",
    status: "OPEN",
  };
};

const startAudit = async (id) => {
  return {
    id,
    status: "IN_PROGRESS",
  };
};

const closeAudit = async (id) => {
  return {
    id,
    status: "CLOSED",
  };
};

module.exports = {
  createAudit,
  getAllAudits,
  getAuditById,
  startAudit,
  closeAudit,
};