import { useEffect, useMemo, useState } from "react";
import Sidebar from "./Sidebar";
import { loadDashboardData } from "./deriveDashboard";

const DEMO_MODE = true;
const DEMO = {
  kpis: [
    { label: "Assets Available", value: 142, trend: { direction: "up", label: "↑ 6 this week" } },
    { label: "Allocated", value: 96, trend: { direction: "flat", label: "steady" } },
    { label: "Maintenance Today", value: 4, trend: { direction: "down", label: "↑ 2 vs avg" } },
    { label: "Active Bookings", value: 18, trend: { direction: "up", label: "↑ 3 today" } },
    { label: "Pending Transfers", value: 5, trend: { direction: "flat", label: "awaiting approval" } },
    { label: "Upcoming Returns", value: 11, trend: { direction: "flat", label: "next 7 days" } },
  ],
  overdue: [
    { id: 1, assetName: "Sony Alpha A7 IV Kit", assetTag: "CAM-1104", holder: "Marcus Chen", daysLate: 4 },
    { id: 2, assetName: 'MacBook Pro 16" M3 Max', assetTag: "LAP-0301", holder: "Hannah Lee", daysLate: 2 },
    { id: 3, assetName: "Wacom Cintiq Pro 27", assetTag: "PRN-0044", holder: "Sarah Jenkins", daysLate: 2 },
    { id: 4, assetName: 'iPad Pro 12.9"', assetTag: "TAB-0087", holder: "Diego Alvarez", daysLate: 1 },
  ],
  risk: [
    { id: 1, tag: "HVA-04", name: "Industrial HVAC Unit 04", department: "Facilities", score: 88, tier: "critical" },
    { id: 2, tag: "VEH-03", name: "Tesla Model 3 · Fleet 03", department: "Logistics", score: 81, tier: "critical" },
    { id: 3, tag: "SRV-04", name: "Server Rack #4", department: "IT Systems", score: 62, tier: "monitor" },
    { id: 4, tag: "MON-21", name: 'Dell UltraSharp 32" 4K', department: "Design", score: 54, tier: "monitor" },
    { id: 5, tag: "FUR-08", name: "Executive Desk · Oak", department: "Executive", score: 18, tier: "stable" },
  ],
  utilization: { points: [110, 95, 100, 75, 80, 55, 60, 40].map((v, i) => ({ week: i, allocationRate: 160 - v })) },
  riskDistribution: { stable: 238, monitor: 68, critical: 34, total: 340 },
  activity: [
    { id: 1, assetTag: "LAP-0248", assetName: 'MacBook Pro 14" M3', category: "IT Equipment", status: "allocated", holder: "Marcus Chen" },
    { id: 2, assetTag: "MON-9921", assetName: 'Dell UltraSharp 32" 4K', category: "IT Equipment", status: "allocated", holder: "Dominic Toretto" },
    { id: 3, assetTag: "CHA-0012", assetName: "Herman Miller Aeron", category: "Furniture", status: "available", holder: null },
    { id: 4, assetTag: "VEH-0031", assetName: "Tesla Model 3 · Fleet 03", category: "Vehicle", status: "maintenance", holder: null },
    { id: 5, assetTag: "SRV-0492", assetName: "Server Rack #4", category: "Infrastructure", status: "allocated", holder: "Jordan Miller" },
  ],
  assets: [
    { id: 1, tag: "LAP-0248", name: 'MacBook Pro 14" M3', category: "IT Equipment", status: "allocated", department: "Product", location: "HQ-03" },
    { id: 2, tag: "MON-9921", name: 'Dell UltraSharp 32" 4K', category: "Displays", status: "available", department: "Design", location: "Studio A" },
    { id: 3, tag: "VEH-0031", name: "Tesla Model 3 · Fleet 03", category: "Vehicle", status: "maintenance", department: "Logistics", location: "Garage B" },
    { id: 4, tag: "CHA-0012", name: "Herman Miller Aeron", category: "Furniture", status: "allocated", department: "Executive", location: "Boardroom" },
    { id: 5, tag: "SRV-0492", name: "Server Rack #4", category: "Infrastructure", status: "available", department: "IT", location: "Data Center" },
  ],
  allocation: {
    asset: { tag: "LAP-0248", name: 'MacBook Pro 14" M3', holder: "Marcus Chen", department: "Product", location: "HQ-03" },
    currentHolder: "Marcus Chen",
    conflict: true,
    timeline: [
      { title: "Allocated", date: "May 14, 2026", detail: "Assigned to Marcus Chen" },
      { title: "Maintenance", date: "Jun 02, 2026", detail: "Battery check completed" },
      { title: "Transfer request", date: "Jun 08, 2026", detail: "Pending approval by Operations" },
    ],
  },
};

export default function Dashboard({ user }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("dashboard");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await loadDashboardData();
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          if (DEMO_MODE) {
            setData(DEMO);
            setError(`Using demo data (API error: ${err.message})`);
          } else {
            setError(err.message || "Failed to load dashboard data.");
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const pageConfig = {
    dashboard: { title: "Operations Overview", subtitle: "Real-time asset and allocation pulse across your org" },
    registry: { title: "Asset Registry", subtitle: "Search, filter, and inspect every tracked asset" },
    allocation: { title: "Allocation & Transfer", subtitle: "Resolve hand-offs, conflicts, and return workflows" },
  }[view];

  return (
    <div className="flex min-h-screen bg-bg font-sans text-ink">
      <Sidebar user={user} activeView={view} onNavigate={setView} />

      <main className="min-w-0 flex-1 p-6 px-8 pb-12">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">AssetFlow ERP</p>
            <h1 className="font-display text-[23px] font-semibold tracking-tight">{pageConfig.title}</h1>
            <p className="mt-1 text-[13px] text-ink-dim">{pageConfig.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="rounded-[9px] border border-border-soft bg-panel-2 px-3.5 py-2 text-[12px] font-semibold text-ink-dim">Export report</button>
            <button className="flex items-center gap-1.5 rounded-[9px] bg-accent px-4 py-2.5 text-[13px] font-semibold text-white shadow-[0_1px_0_rgba(255,255,255,.15)_inset,0_6px_16px_-6px_rgba(76,140,255,.55)] transition-transform hover:-translate-y-px">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
              Register Asset
            </button>
          </div>
        </div>

        {error && <div className="mb-5 rounded-lg border border-monitor/25 bg-monitor-soft px-3.5 py-2.5 text-[12px] text-monitor">{error}</div>}

        {loading ? (
          <div className="py-20 text-center text-[13px] text-ink-dim">Loading AssetFlow workspace…</div>
        ) : (
          data && (
            <>
              {view === "dashboard" && <DashboardView data={data} />}
              {view === "registry" && <AssetRegistryView assets={data.assets} />}
              {view === "allocation" && <AllocationTransferView allocation={data.allocation} />}
            </>
          )
        )}
      </main>
    </div>
  );
}

function DashboardView({ data }) {
  return (
    <>
      <KpiRow kpis={data.kpis} />
      <div className="mb-4 grid grid-cols-1 items-start gap-4 lg:grid-cols-[1.35fr_1fr]">
        <OverduePanel items={data.overdue} />
        <RiskPanel items={data.risk} />
      </div>
      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]">
        <UtilizationChart points={data.utilization.points} />
        <RiskDonut distribution={data.riskDistribution} />
      </div>
      <ActivityTable rows={data.activity} />
    </>
  );
}

function AssetRegistryView({ assets }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [department, setDepartment] = useState("all");

  const filtered = useMemo(() => {
    return assets.filter((asset) => {
      const matchesQuery = [asset.tag, asset.name, asset.category, asset.location].join(" ").toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === "all" || asset.status === status;
      const matchesDepartment = department === "all" || asset.department === department;
      return matchesQuery && matchesStatus && matchesDepartment;
    });
  }, [assets, query, status, department]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border-soft bg-panel p-[18px]">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[14.5px] font-semibold">Registry overview</div>
            <div className="mt-1 text-[11.5px] text-ink-faint">Filter by department, status, and asset name</div>
          </div>
          <div className="flex flex-wrap gap-2">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search assets" className="rounded-lg border border-border-soft bg-panel-2 px-3 py-2 text-[12px] text-ink outline-none placeholder:text-ink-faint" />
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-border-soft bg-panel-2 px-3 py-2 text-[12px] text-ink">
              <option value="all">All statuses</option>
              <option value="available">Available</option>
              <option value="allocated">Allocated</option>
              <option value="maintenance">Maintenance</option>
            </select>
            <select value={department} onChange={(e) => setDepartment(e.target.value)} className="rounded-lg border border-border-soft bg-panel-2 px-3 py-2 text-[12px] text-ink">
              <option value="all">All departments</option>
              <option value="Product">Product</option>
              <option value="Design">Design</option>
              <option value="Logistics">Logistics</option>
              <option value="Executive">Executive</option>
              <option value="IT">IT</option>
            </select>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg border border-border-soft">
          <table className="min-w-full border-collapse text-left text-[12px]">
            <thead className="bg-panel-2 text-[10.5px] uppercase tracking-wide text-ink-faint">
              <tr>
                <th className="px-3 py-2.5">Asset Tag</th>
                <th className="px-3 py-2.5">Name</th>
                <th className="px-3 py-2.5">Category</th>
                <th className="px-3 py-2.5">Status</th>
                <th className="px-3 py-2.5">Department</th>
                <th className="px-3 py-2.5">Location</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((asset) => (
                <tr key={asset.id} className="border-t border-border-soft bg-panel/70">
                  <td className="px-3 py-2.5 font-mono text-[11px] font-semibold text-accent">{asset.tag}</td>
                  <td className="px-3 py-2.5 font-semibold">{asset.name}</td>
                  <td className="px-3 py-2.5 text-ink-dim">{asset.category}</td>
                  <td className="px-3 py-2.5"><StatusPill status={asset.status} /></td>
                  <td className="px-3 py-2.5 text-ink-dim">{asset.department}</td>
                  <td className="px-3 py-2.5 text-ink-dim">{asset.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl border border-border-soft bg-panel p-[18px]">
          <div className="mb-3 text-[14.5px] font-semibold">Asset detail preview</div>
          <div className="rounded-lg border border-border-soft bg-panel-2 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="font-semibold">{filtered[0]?.name || "Select an asset"}</div>
                <div className="mt-1 text-[12px] text-ink-dim">{filtered[0]?.tag || "No asset selected"}</div>
              </div>
              <StatusPill status={filtered[0]?.status || "available"} />
            </div>
            <div className="grid gap-2 text-[12px] text-ink-dim sm:grid-cols-2">
              <div>Department: <span className="font-semibold text-ink">{filtered[0]?.department || "—"}</span></div>
              <div>Location: <span className="font-semibold text-ink">{filtered[0]?.location || "—"}</span></div>
              <div>Category: <span className="font-semibold text-ink">{filtered[0]?.category || "—"}</span></div>
              <div>Allocation history: <span className="font-semibold text-ink">3 records</span></div>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border-soft bg-panel p-[18px]">
          <div className="mb-3 text-[14.5px] font-semibold">Maintenance timeline</div>
          <div className="space-y-3">
            {[
              { title: "Battery health review", date: "Jun 03", state: "Resolved" },
              { title: "Screen calibration", date: "May 20", state: "Approved" },
              { title: "Docking port inspection", date: "Apr 12", state: "Pending" },
            ].map((item) => (
              <div key={item.title} className="flex items-center justify-between rounded-lg border border-border-soft bg-panel-2 px-3 py-2.5">
                <div>
                  <div className="text-[12px] font-semibold">{item.title}</div>
                  <div className="text-[11px] text-ink-faint">{item.date}</div>
                </div>
                <span className="rounded-full bg-accent-soft px-2 py-1 text-[10px] font-semibold text-accent">{item.state}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AllocationTransferView({ allocation }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-xl border border-border-soft bg-panel p-[18px]">
        <div className="mb-4 text-[14.5px] font-semibold">Active allocation</div>
        <div className="rounded-lg border border-border-soft bg-panel-2 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="font-semibold">{allocation.asset.name}</div>
              <div className="mt-1 text-[12px] text-ink-dim">{allocation.asset.tag} · {allocation.asset.department}</div>
            </div>
            <span className="rounded-full bg-monitor-soft px-2.5 py-1 text-[10px] font-semibold text-monitor">Held</span>
          </div>
          <div className="mb-3 rounded-lg border border-border-soft bg-panel p-3 text-[12px] text-ink-dim">
            <div className="mb-1.5 font-semibold text-ink">Current holder</div>
            <div>{allocation.currentHolder}</div>
            <div className="mt-1">Location: {allocation.asset.location}</div>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 rounded-lg bg-accent px-3 py-2 text-[12px] font-semibold text-white">Allocate</button>
            <button className="flex-1 rounded-lg border border-border-soft bg-panel px-3 py-2 text-[12px] font-semibold text-ink">Transfer request</button>
          </div>
        </div>
        <div className="mt-4 rounded-lg border border-critical/25 bg-critical-soft p-3 text-[12px] text-critical">Currently held by {allocation.currentHolder}. The transfer path is intentionally surfaced as a conflict state rather than a dead-end.</div>
      </div>

      <div className="rounded-xl border border-border-soft bg-panel p-[18px]">
        <div className="mb-4 text-[14.5px] font-semibold">Timeline & hand-off flow</div>
        <div className="space-y-3">
          {allocation.timeline.map((item, idx) => (
            <div key={item.title} className="flex gap-3 rounded-lg border border-border-soft bg-panel-2 p-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-[11px] font-semibold text-accent">{idx + 1}</div>
              <div>
                <div className="text-[12px] font-semibold">{item.title}</div>
                <div className="mt-1 text-[11px] text-ink-dim">{item.date}</div>
                <div className="mt-1 text-[12px] text-ink">{item.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    available: "bg-stable-soft text-stable",
    allocated: "bg-accent-soft text-[#8FB4FF]",
    maintenance: "bg-monitor-soft text-monitor",
  };
  const label = { available: "Available", allocated: "Allocated", maintenance: "Maintenance" }[status] || "Unknown";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${map[status] || "bg-panel-2 text-ink-dim"}`}>{label}</span>;
}

function KpiRow({ kpis }) {
  const trendColor = { up: "text-stable", down: "text-critical", flat: "text-ink-faint" };
  return (
    <div className="mb-5.5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {kpis.map((kpi) => (
        <div key={kpi.label} className="relative overflow-hidden rounded-xl border border-border-soft bg-panel p-4 pb-3.5">
          <div className="mb-2 text-[11px] font-medium text-ink-dim">{kpi.label}</div>
          <div className="font-display text-[26px] font-semibold">{kpi.value}</div>
          <div className={`mt-1.5 text-[10.5px] font-semibold ${trendColor[kpi.trend.direction]}`}>{kpi.trend.label}</div>
        </div>
      ))}
    </div>
  );
}

function OverduePanel({ items }) {
  return (
    <Panel title="Overdue Returns" subtitle="Assets past the expected return date" link="Review all →">
      {items.map((item, i) => (
        <div key={item.id} className={`flex items-center justify-between py-2.5 ${i !== 0 ? "border-t border-border-soft" : ""}`}>
          <div className="flex min-w-0 items-center gap-3">
            <span className="h-[7px] w-[7px] flex-shrink-0 rounded-full bg-critical shadow-[0_0_0_3px_rgba(241,84,62,.13)]" />
            <div>
              <div className="text-[13px] font-semibold">{item.assetName}</div>
              <div className="mt-0.5 font-mono text-[11px] text-ink-faint">{item.assetTag} · {item.holder}</div>
            </div>
          </div>
          <span className="flex-shrink-0 whitespace-nowrap rounded-full bg-critical-soft px-2.5 py-1 text-[10.5px] font-bold text-critical">{item.daysLate}d late</span>
        </div>
      ))}
    </Panel>
  );
}

const TIER_COLOR = { critical: "text-critical", monitor: "text-monitor", stable: "text-stable" };
const TIER_BAR = { critical: "bg-critical", monitor: "bg-monitor", stable: "bg-stable" };

function RiskPanel({ items }) {
  return (
    <Panel title="Top Risk Assets" subtitle="Ranked by Asset Risk Index (ARI)" link="Full report →">
      {items.map((item, i) => {
        const barsOn = Math.round((item.score / 100) * 5);
        return (
          <div key={item.id} className={`flex items-center gap-2.5 py-2.5 ${i !== 0 ? "border-t border-border-soft" : ""}`}>
            <span className="w-10 flex-shrink-0 rounded-md border border-border bg-panel-2 px-1.5 py-0.5 text-center font-mono text-[10px] font-semibold text-ink-dim">{item.tag}</span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12.5px] font-semibold">{item.name}</div>
              <div className="mt-px truncate text-[10.5px] text-ink-faint">{item.department}</div>
            </div>
            <div className="flex h-4 flex-shrink-0 items-end gap-[2.5px]">
              {[5, 8, 11, 14, 16].map((h, idx) => (
                <span key={idx} style={{ height: `${h}px` }} className={`w-[3.5px] rounded-sm ${idx < barsOn ? TIER_BAR[item.tier] : "bg-border"}`} />
              ))}
            </div>
            <div className={`w-[26px] flex-shrink-0 text-right font-mono text-[12px] font-semibold ${TIER_COLOR[item.tier]}`}>{item.score}</div>
          </div>
        );
      })}
    </Panel>
  );
}

function UtilizationChart({ points }) {
  const w = 560;
  const h = 160;
  const max = Math.max(...points.map((p) => p.allocationRate));
  const min = Math.min(...points.map((p) => p.allocationRate));
  const range = Math.max(max - min, 1);
  const step = w / (points.length - 1);
  const coords = points.map((p, i) => {
    const x = i * step;
    const y = h - 20 - ((p.allocationRate - min) / range) * (h - 40);
    return [x, y];
  });
  const line = coords.map(([x, y]) => `${x},${y}`).join(" ");
  const area = `M0,${h} ` + coords.map(([x, y]) => `L${x},${y}`).join(" ") + ` L${w},${h} Z`;
  const last = coords[coords.length - 1];

  return (
    <div className="rounded-xl border border-border-soft bg-panel p-[18px] pb-1.5">
      <div className="mb-1 text-[14.5px] font-semibold">Asset Utilization — Last 8 Weeks</div>
      <div className="mb-3.5 text-[11.5px] text-ink-faint">Allocated vs. available capacity</div>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="160" preserveAspectRatio="none">
        <defs>
          <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4C8CFF" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#4C8CFF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g stroke="#232A35" strokeWidth="1">
          <line x1="0" y1="20" x2={w} y2="20" />
          <line x1="0" y1="60" x2={w} y2="60" />
          <line x1="0" y1="100" x2={w} y2="100" />
          <line x1="0" y1="140" x2={w} y2="140" />
        </g>
        <path d={area} fill="url(#fillGrad)" />
        <polyline points={line} fill="none" stroke="#4C8CFF" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={last[0]} cy={last[1]} r="4" fill="#4C8CFF" />
      </svg>
      <div className="mt-2.5 flex flex-wrap gap-4 pb-2">
        <div className="flex items-center gap-1.5 text-[11px] text-ink-dim"><span className="h-2 w-2 rounded-sm bg-accent" /> Allocation rate</div>
      </div>
    </div>
  );
}

function RiskDonut({ distribution }) {
  const { stable, monitor, critical, total } = distribution;
  const circumference = 339.3;
  const stablePct = stable / total;
  const monitorPct = monitor / total;
  const criticalPct = critical / total;

  return (
    <div className="rounded-xl border border-border-soft bg-panel p-[18px] pb-1.5">
      <div className="mb-1 text-[14.5px] font-semibold">Risk Distribution</div>
      <div className="mb-3.5 text-[11.5px] text-ink-faint">Across all tracked assets</div>
      <div className="relative flex justify-center py-1.5">
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r="54" fill="none" stroke="#232A35" strokeWidth="16" />
          <circle cx="70" cy="70" r="54" fill="none" stroke="#35C48A" strokeWidth="16" strokeDasharray={`${circumference * stablePct} ${circumference}`} transform="rotate(-90 70 70)" strokeLinecap="round" />
          <circle cx="70" cy="70" r="54" fill="none" stroke="#F2B33D" strokeWidth="16" strokeDasharray={`${circumference * monitorPct} ${circumference}`} strokeDashoffset={-circumference * stablePct} transform="rotate(-90 70 70)" strokeLinecap="round" />
          <circle cx="70" cy="70" r="54" fill="none" stroke="#F1543E" strokeWidth="16" strokeDasharray={`${circumference * criticalPct} ${circumference}`} strokeDashoffset={-circumference * (stablePct + monitorPct)} transform="rotate(-90 70 70)" strokeLinecap="round" />
        </svg>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="font-display text-[22px] font-bold">{stable}</div>
          <div className="text-[9.5px] uppercase tracking-wide text-ink-faint">Stable</div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        <LegendDot color="bg-stable" label={`Stable · ${Math.round(stablePct * 100)}%`} />
        <LegendDot color="bg-monitor" label={`Monitor · ${Math.round(monitorPct * 100)}%`} />
        <LegendDot color="bg-critical" label={`Critical · ${Math.round(criticalPct * 100)}%`} />
      </div>
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-ink-dim">
      <span className={`h-2 w-2 rounded-sm ${color}`} />
      {label}
    </div>
  );
}

const STATUS_STYLE = {
  allocated: "bg-accent-soft text-[#8FB4FF]",
  available: "bg-stable-soft text-stable",
  maintenance: "bg-monitor-soft text-monitor",
  reserved: "bg-[rgba(139,146,164,.15)] text-ink-dim",
};
const STATUS_LABEL = {
  allocated: "Allocated",
  available: "Available",
  maintenance: "Under Maintenance",
  reserved: "Reserved",
};

function ActivityTable({ rows }) {
  return (
    <div className="rounded-xl border border-border-soft bg-panel p-[18px]">
      <div className="flex items-baseline justify-between">
        <div className="text-[14.5px] font-semibold">Recent Asset Activity</div>
        <div className="cursor-pointer text-[11.5px] font-semibold text-accent">View registry →</div>
      </div>
      <div className="mb-3.5 mt-1 text-[11.5px] text-ink-faint">Latest allocations &amp; status changes</div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {['Asset', 'Category', 'Status', 'Holder'].map((h) => (
              <th key={h} className="border-b border-border-soft px-2.5 py-2 text-left text-[10.5px] font-semibold uppercase tracking-wide text-ink-faint">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="border-b border-border-soft px-2.5 py-2.5 text-[12.5px] last:border-0">
                <span className="mr-1.5 inline-flex items-center gap-1.5 rounded-md border border-border bg-panel-2 py-1 pl-1.5 pr-2 font-mono text-[11px] font-semibold before:h-[5px] before:w-[5px] before:rounded-full before:border before:border-border before:bg-bg">{row.assetTag}</span>
                {row.assetName}
              </td>
              <td className="border-b border-border-soft px-2.5 py-2.5 text-[12.5px]">{row.category}</td>
              <td className="border-b border-border-soft px-2.5 py-2.5 text-[12.5px]">
                <span className={`inline-block rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${STATUS_STYLE[row.status]}`}>{STATUS_LABEL[row.status]}</span>
              </td>
              <td className="border-b border-border-soft px-2.5 py-2.5 text-[12.5px] text-ink-dim last:border-0">{row.holder ? row.holder : <span className="italic text-ink-faint">Unassigned</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Panel({ title, subtitle, link, children }) {
  return (
    <div className="rounded-xl border border-border-soft bg-panel p-[18px] pb-2">
      <div className="mb-1 flex items-baseline justify-between">
        <div className="text-[14.5px] font-semibold">{title}</div>
        <div className="cursor-pointer text-[11.5px] font-semibold text-accent">{link}</div>
      </div>
      <div className="mb-3.5 text-[11.5px] text-ink-faint">{subtitle}</div>
      {children}
    </div>
  );
}
