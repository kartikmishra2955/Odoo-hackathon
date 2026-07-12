// src/lib/deriveDashboard.js
import { getAssets } from "../api/assets";
import { getAllocations } from "../api/allocation";
import { getBookings } from "../api/booking";
import { rankAssetsByRisk } from "./ari";

/**
 * Fetches raw data from the real backend and derives everything the
 * dashboard needs. This is the client-side aggregation Member 4 owns,
 * since there's no /dashboard/* endpoint in the contract.
 */
export async function loadDashboardData() {
  const [assets, allocations, bookings] = await Promise.all([
    getAssets(),
    getAllocations(),
    getBookings(),
  ]);

  return {
    kpis: buildKpis(assets, allocations, bookings),
    overdue: buildOverdue(allocations, assets),
    risk: buildTopRisk(assets),
    utilization: buildUtilization(allocations),
    riskDistribution: buildRiskDistribution(assets),
    activity: buildRecentActivity(assets, allocations),
  };
}

function buildKpis(assets, allocations, bookings) {
  const available = assets.filter((a) => a.status === "available").length;
  const allocated = assets.filter((a) => a.status === "allocated").length;
  const maintenance = assets.filter((a) => a.status === "maintenance").length;
  const activeBookings = bookings.filter((b) => b.status === "confirmed").length;
  const overdueCount = allocations.filter((a) => isOverdue(a)).length;
  const upcomingReturns = allocations.filter((a) => isDueSoon(a, 7)).length;

  return [
    { label: "Assets Available", value: available, trend: { direction: "flat", label: "live" } },
    { label: "Allocated", value: allocated, trend: { direction: "flat", label: "live" } },
    { label: "Maintenance", value: maintenance, trend: { direction: maintenance > 0 ? "down" : "flat", label: "live" } },
    { label: "Active Bookings", value: activeBookings, trend: { direction: "flat", label: "live" } },
    { label: "Overdue Returns", value: overdueCount, trend: { direction: overdueCount > 0 ? "down" : "flat", label: "live" } },
    { label: "Upcoming Returns", value: upcomingReturns, trend: { direction: "flat", label: "next 7 days" } },
  ];
}

function isOverdue(allocation) {
  return !allocation.returnedAt && allocation.dueDate && new Date(allocation.dueDate) < new Date();
}

function isDueSoon(allocation, withinDays) {
  if (allocation.returnedAt || !allocation.dueDate) return false;
  const days = (new Date(allocation.dueDate) - Date.now()) / (1000 * 60 * 60 * 24);
  return days >= 0 && days <= withinDays;
}

function buildOverdue(allocations, assets) {
  const assetById = Object.fromEntries(assets.map((a) => [a.id, a]));
  return allocations
    .filter(isOverdue)
    .map((a) => {
      const asset = assetById[a.assetId];
      const daysLate = Math.floor((Date.now() - new Date(a.dueDate)) / (1000 * 60 * 60 * 24));
      return {
        id: a.id,
        assetName: asset?.name || "Unknown asset",
        assetTag: asset?.tag || "—",
        holder: a.userName || a.userId,
        daysLate,
      };
    })
    .sort((a, b) => b.daysLate - a.daysLate);
}

function buildTopRisk(assets) {
  return rankAssetsByRisk(assets)
    .slice(0, 5)
    .map(({ asset, ari }) => ({
      id: asset.id,
      tag: asset.tag,
      name: asset.name,
      department: asset.department,
      score: ari.score,
      tier: ari.priority,
      reasons: ari.reasons,
      recommendation: ari.recommendation,
    }));
}

function buildUtilization(allocations) {
  // Rough weekly allocation rate over the last 8 weeks, derived from
  // allocation start/end dates. Refine once real historical data exists.
  const weeks = 8;
  const now = Date.now();
  const buckets = Array.from({ length: weeks }, () => 0);

  allocations.forEach((a) => {
    const start = new Date(a.assignedAt).getTime();
    const weeksAgo = Math.floor((now - start) / (7 * 24 * 60 * 60 * 1000));
    if (weeksAgo >= 0 && weeksAgo < weeks) {
      buckets[weeks - 1 - weeksAgo] += 1;
    }
  });

  return { points: buckets.map((count, i) => ({ week: i, allocationRate: count })) };
}

function buildRiskDistribution(assets) {
  const ranked = rankAssetsByRisk(assets);
  const counts = { stable: 0, monitor: 0, critical: 0 };
  ranked.forEach(({ ari }) => counts[ari.priority]++);
  return { ...counts, total: assets.length };
}

function buildRecentActivity(assets, allocations) {
  return [...allocations]
    .sort((a, b) => new Date(b.assignedAt) - new Date(a.assignedAt))
    .slice(0, 5)
    .map((a) => {
      const asset = assets.find((x) => x.id === a.assetId);
      return {
        id: a.id,
        assetTag: asset?.tag || "—",
        assetName: asset?.name || "Unknown asset",
        category: asset?.category || "—",
        status: asset?.status || "allocated",
        holder: a.returnedAt ? null : a.userName || a.userId,
      };
    });
}
