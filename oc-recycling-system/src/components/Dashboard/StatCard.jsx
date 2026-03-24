function StatCard({ label, value, accent }) {
  return (
    <article
      className="rounded-3xl border border-white/10 bg-surface p-5 shadow-glow"
      style={{ borderLeft: `4px solid ${accent}` }}
    >
      <p className="text-xs uppercase tracking-[0.18em] text-muted">{label}</p>
      <p className="mt-4 text-4xl font-semibold text-white">{value}</p>
    </article>
  );
}

export default StatCard;
