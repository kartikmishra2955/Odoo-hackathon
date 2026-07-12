// src/api/transfer.js
import { api } from "./client";

/**
 * GET /transfer
 * { id, assetId, fromDepartment, toDepartment, requestedBy, status: "pending"|"approved"|"rejected", createdAt }
 */
export function getTransfers(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return api.get(`/transfer${qs ? `?${qs}` : ""}`);
}

export function createTransfer({ assetId, toDepartment, reason }) {
  return api.post("/transfer", { assetId, toDepartment, reason });
}

export function updateTransferStatus(id, status) {
  return api.patch(`/transfer/${id}`, { status });
}
