// src/lib/ari.js
//
// Asset Risk Index (ARI) engine.
// Runs entirely client-side against raw asset fields — no backend
// "risk score" endpoint required. If Member 1/2 don't have all these
// fields on /assets yet, flag it: audits, maintenance history, and
// warranty data need to exist somewhere for this to be real (not stubbed).

const WEIGHTS = {
  auditRecency: 0.15,
  maintenanceOverdue: 0.2,
  usageFrequency: 0.15,
  condition: 0.2,
  warrantyStatus: 0.15,
  transferCount: 0.1,
  valueTier: 0.05,
};

const DAY = 24 * 60 * 60 * 1000;

function daysSince(dateStr) {
  if (!dateStr) return null;
  return (Date.now() - new Date(dateStr).getTime()) / DAY;
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  return (new Date(dateStr).getTime() - Date.now()) / DAY;
}

function clamp01(n) {
  return Math.max(0, Math.min(1, n));
}

// --- individual factor scorers, each returns 0 (no risk) to 1 (max risk) ---

function scoreAuditRecency(asset) {
  const days = daysSince(asset.lastAuditDate);
  if (days === null) return 0.8; // never audited = high risk, but not asserted as fact if unknown
  // 0 risk at 0 days, max risk at 180+ days since last audit
  return clamp01(days / 180);
}

function scoreMaintenanceOverdue(asset) {
  const interval = asset.maintenanceIntervalDays;
  const lastDone = daysSince(asset.lastMaintenanceDate);
  if (!interval || lastDone === null) return 0.3; // unknown maintenance history = moderate default
  const overdueRatio = lastDone / interval;
  // 0 risk if within interval, ramps to 1 at 2x interval overdue
  return clamp01((overdueRatio - 1) / 1);
}

function scoreUsageFrequency(asset) {
  // Accepts either a numeric usageHoursPerWeek or an enum usageFrequency
  if (typeof asset.usageHoursPerWeek === "number") {
    return clamp01(asset.usageHoursPerWeek / 60); // 60+ hrs/week = max wear risk
  }
  const map = { low: 0.15, medium: 0.5, high: 0.85, constant: 1 };
  return map[asset.usageFrequency] ?? 0.3;
}

function scoreCondition(asset) {
  const map = { excellent: 0, good: 0.25, fair: 0.6, poor: 1 };
  return map[asset.condition] ?? 0.3;
}

function scoreWarrantyStatus(asset) {
  const days = daysUntil(asset.warrantyExpiry);
  if (days === null) return 0.3; // no warranty on file — moderate, not asserted as expired
  if (days <= 0) return 1; // already expired
  if (days <= 30) return 0.7; // expiring soon
  if (days <= 90) return 0.4;
  return 0.1;
}

function scoreTransferCount(asset) {
  const count = asset.transferCount ?? 0;
  // 0 transfers = 0 risk, 5+ transfers = max risk (handling/instability proxy)
  return clamp01(count / 5);
}

function scoreValueTier(asset) {
  const map = { low: 0.1, mid: 0.4, high: 0.7, critical: 1 };
  return map[asset.valueTier] ?? 0.3;
}

const FACTORS = [
  { key: "auditRecency", label: "Audit overdue", score: scoreAuditRecency },
  { key: "maintenanceOverdue", label: "Maintenance overdue", score: scoreMaintenanceOverdue },
  { key: "usageFrequency", label: "Used frequently", score: scoreUsageFrequency },
  { key: "condition", label: "Poor condition", score: scoreCondition },
  { key: "warrantyStatus", label: "Warranty expired/expiring", score: scoreWarrantyStatus },
  { key: "transferCount", label: "Frequently transferred", score: scoreTransferCount },
  { key: "valueTier", label: "High asset value", score: scoreValueTier },
];

function priorityFor(score) {
  if (score >= 75) return "critical";
  if (score >= 45) return "monitor";
  return "stable";
}

function recommendationFor(topFactorKey, priority) {
  if (priority === "stable") return "No action needed";
  const map = {
    auditRecency: "Schedule an asset audit",
    maintenanceOverdue: "Schedule preventive maintenance",
    usageFrequency: "Review usage load / consider rotation",
    condition: "Inspect asset condition and consider replacement",
    warrantyStatus: "Renew or replace before warranty gap",
    transferCount: "Review handling and assignment history",
    valueTier: "Prioritize in next audit cycle given asset value",
  };
  return map[topFactorKey] || "Review asset";
}

/**
 * Compute the ARI for a single asset.
 * @param {object} asset - raw asset record from /assets
 * @returns {{ score: number, priority: "critical"|"monitor"|"stable", reasons: string[], recommendation: string }}
 */
export function calculateARI(asset) {
  const factorScores = FACTORS.map((f) => ({
    key: f.key,
    label: f.label,
    value: f.score(asset),
    weighted: f.score(asset) * WEIGHTS[f.key],
  }));

  const rawScore = factorScores.reduce((sum, f) => sum + f.weighted, 0);
  const score = Math.round(rawScore * 100);
  const priority = priorityFor(score);

  // Top contributing factors (only ones meaningfully elevated) drive the reasons/recommendation
  const significant = factorScores
    .filter((f) => f.value >= 0.5)
    .sort((a, b) => b.weighted - a.weighted);

  const reasons = significant.slice(0, 3).map((f) => f.label);
  const topFactor = significant[0]?.key;
  const recommendation = recommendationFor(topFactor, priority);

  return { score, priority, reasons, recommendation };
}

/**
 * Compute ARI for a list of assets and return them sorted by score descending.
 */
export function rankAssetsByRisk(assets) {
  return assets
    .map((asset) => ({ asset, ari: calculateARI(asset) }))
    .sort((a, b) => b.ari.score - a.ari.score);
}
