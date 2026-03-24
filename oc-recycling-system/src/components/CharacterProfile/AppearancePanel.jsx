function AppearancePanel({ appearance }) {
  const fields = [
    ["Height", appearance.height],
    ["Body Type", appearance.bodyType],
    ["Hair", appearance.hair],
    ["Eyes", appearance.eyes],
    ["Skin", appearance.skin]
  ];

  return (
    <section className="rounded-[28px] border border-white/10 bg-surface p-6 shadow-glow">
      <p className="text-xs uppercase tracking-[0.2em] text-[#eed495]">Appearance</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {fields.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">{label}</p>
            <p className="mt-2 text-sm">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AppearancePanel;
