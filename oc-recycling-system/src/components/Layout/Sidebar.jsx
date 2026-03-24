import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", meta: "Home" },
  { to: "/list", label: "Master List", meta: "Search + filters" },
  { to: "/relationships", label: "Relationships", meta: "Connections" },
  { to: "/tracker", label: "Progress Tracker", meta: "Kanban board" },
  { to: "/manage", label: "Manage Archive", meta: "CRUD + backup" }
];

function Sidebar({ totalCharacters }) {
  return (
    <aside className="border-b border-white/5 bg-black/20 p-5 backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:border-white/5">
      <div className="rounded-3xl border border-white/10 bg-surface/90 p-5 shadow-glow">
        <h1 className="font-serif text-2xl">OC Recycling System</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          A local-first archive for color-coded characters, relationship threads, and progress tracking.
        </p>
      </div>

      <nav className="mt-5 grid gap-2" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex items-center justify-between rounded-2xl border px-4 py-3 transition ${
                isActive
                  ? "border-white/20 bg-white/10 text-white shadow-glow"
                  : "border-transparent bg-white/[0.03] text-text hover:border-white/10 hover:bg-white/[0.06]"
              }`
            }
          >
            <span>{item.label}</span>
            <span className="text-xs uppercase tracking-[0.18em] text-muted">{item.meta}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-5">
        <p className="text-xs uppercase tracking-[0.18em] text-[#eed495]">Archive Notes</p>
        <p className="mt-3 text-sm leading-6 text-muted">
          Everything stays in your browser through localStorage. Export a JSON backup whenever you want a restore
          point.
        </p>
        <p className="mt-4 text-sm text-text">{totalCharacters} characters currently loaded.</p>
      </div>
    </aside>
  );
}

export default Sidebar;
