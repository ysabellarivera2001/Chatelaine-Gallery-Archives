function FilterBar({ filtersApi }) {
  const { filters, setFilter, clearFilters, mbtiOptions, enneagramOptions } = filtersApi;

  return (
    <section className="rounded-[28px] border border-white/10 bg-surface p-5 shadow-glow">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#eed495]">Filters</p>
          <h2 className="mt-2 font-serif text-3xl">Narrow the cast</h2>
        </div>
        <button
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
          onClick={clearFilters}
          type="button"
        >
          Clear filters
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <label className="grid gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.18em] text-muted">Search</span>
          <input
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none ring-0 placeholder:text-muted"
            onChange={(event) => setFilter("query", event.target.value)}
            placeholder="Name, vibe, backstory..."
            value={filters.query}
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.18em] text-muted">MBTI</span>
          <select
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
            onChange={(event) => setFilter("mbti", event.target.value)}
            value={filters.mbti}
          >
            <option value="">All MBTI</option>
            {mbtiOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.18em] text-muted">Enneagram</span>
          <select
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
            onChange={(event) => setFilter("enneagram", event.target.value)}
            value={filters.enneagram}
          >
            <option value="">All enneagrams</option>
            {enneagramOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.18em] text-muted">Group</span>
          <select
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
            onChange={(event) => setFilter("group", event.target.value)}
            value={filters.group}
          >
            <option value="">All groups</option>
            {[1, 2, 3, 4, 5].map((group) => (
              <option key={group} value={group}>
                Group {group}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.18em] text-muted">Status</span>
          <select
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
            onChange={(event) => setFilter("status", event.target.value)}
            value={filters.status}
          >
            <option value="">All statuses</option>
            <option value="excel">Excel</option>
            <option value="discord">Discord</option>
            <option value="tumblr">Tumblr</option>
            <option value="ao3">AO3</option>
          </select>
        </label>
      </div>
    </section>
  );
}

export default FilterBar;
