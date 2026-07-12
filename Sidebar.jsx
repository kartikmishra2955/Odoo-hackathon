// src/components/Sidebar.jsx

const NAV_ITEMS = [
  {
    section: "Operations",
    items: [
      { label: "Dashboard", active: true, icon: <path d="M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z" /> },
      { label: "Asset Registry" },
      { label: "Allocation" },
      { label: "Bookings" },
      { label: "Maintenance" },
    ],
  },
  {
    section: "System",
    items: [{ label: "Organization" }, { label: "Analytics" }],
  },
];

function NavIcon({ label }) {
  // Simplified consistent icon (dot) — swap in the original per-item SVGs if needed.
  return <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-current opacity-70" />;
}

export default function Sidebar({ user }) {
  const initials =
    user?.name
      ?.split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "??";

  return (
    <aside className="sticky top-0 flex h-screen w-[236px] flex-shrink-0 flex-col border-r border-border-soft bg-panel p-4 pt-[22px]">
      <div className="flex items-center gap-2.5 px-2 pb-6 pt-1">
        <div className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-[#2E5FCC]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M4 7L12 3L20 7V17L12 21L4 17V7Z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M4 7L12 11L20 7M12 11V21" stroke="white" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <div className="font-display text-[16.5px] font-semibold tracking-tight">AssetFlow</div>
          <div className="text-[10.5px] uppercase tracking-wide text-ink-faint">Management</div>
        </div>
      </div>

      {NAV_ITEMS.map((group) => (
        <div key={group.section}>
          <div className="px-2.5 pb-2 pt-4 text-[10.5px] font-semibold uppercase tracking-wider text-ink-faint">
            {group.section}
          </div>
          {group.items.map((item) => (
            <div
              key={item.label}
              className={`relative flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-[13.5px] font-medium transition-colors ${
                item.active
                  ? "bg-accent-soft text-[#CBDBFF] before:absolute before:-left-4 before:top-2 before:bottom-2 before:w-[3px] before:rounded-r before:bg-accent"
                  : "text-ink-dim hover:bg-panel-2 hover:text-ink"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 opacity-85">
                {item.icon || <NavIcon label={item.label} />}
              </svg>
              {item.label}
            </div>
          ))}
        </div>
      ))}

      <div className="mt-auto flex items-center gap-2.5 rounded-[10px] border border-border-soft bg-panel-2 p-2.5">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-[#8B5CF6] text-[11.5px] font-bold text-white">
          {initials}
        </div>
        <div>
          <div className="text-[12.5px] font-semibold">{user?.name || "Guest"}</div>
          <div className="text-[10.5px] text-ink-faint">{user?.role || "—"}</div>
        </div>
      </div>
    </aside>
  );
}
