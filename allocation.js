// src/api/allocation.js
import { api } from "./client";

/**
 * GET /allocation
 * Returns active + historical allocation records:
 * { id, assetId, userId, assignedAt, dueDate, returnedAt, status: "active"|"overdue"|"returned" }
 * The dashboard's "Overdue Returns" panel is derived by filtering
 * status === "overdue" (dueDate < now && !returnedAt) client-side.
 */
export function getAllocations(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return api.get(`/allocation${qs ? `?${qs}` : ""}`);
}

export function createAllocation({ assetId, userId, dueDate }) {
  return api.post("/allocation", { assetId, userId, dueDate });
}

export function returnAsset(allocationId) {
  return api.patch(`/allocation/${allocationId}`, { returnedAt: new Date().toISOString() });
}
