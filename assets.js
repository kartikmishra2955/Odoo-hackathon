// src/api/assets.js
import { api } from "./client";

/**
 * GET /assets
 * Expected asset shape (confirm exact fields with Member 1/2):
 * {
 *   id, tag, name, category, department, status,          // core
 *   holder: { id, name } | null,
 *   value, valueTier,                                       // "low"|"mid"|"high"|"critical"
 *   condition,                                               // "excellent"|"good"|"fair"|"poor"
 *   lastAuditDate,                                           // ISO date
 *   lastMaintenanceDate, maintenanceIntervalDays,            // for overdue calc
 *   usageHoursPerWeek,                                       // or usageFrequency enum
 *   warrantyExpiry,                                          // ISO date
 *   transferCount,
 *   qrCode, imageUrl,
 * }
 */
export function getAssets(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return api.get(`/assets${qs ? `?${qs}` : ""}`);
}

export function getAsset(id) {
  return api.get(`/assets/${id}`);
}

export function createAsset(payload) {
  return api.post("/assets", payload);
}

export function updateAsset(id, payload) {
  return api.patch(`/assets/${id}`, payload);
}

export function deleteAsset(id) {
  return api.delete(`/assets/${id}`);
}
