function BackupPanel({ onExport, onImport }) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-surface p-5 shadow-glow">
      <p className="text-xs uppercase tracking-[0.2em] text-[#eed495]">Backup</p>
      <h2 className="mt-2 font-serif text-2xl">Import or export data</h2>
      <p className="mt-3 text-sm leading-6 text-muted">
        Export the current archive as JSON, or replace it entirely by importing a validated backup file.
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black"
          onClick={onExport}
          type="button"
        >
          Export JSON
        </button>
        <label className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
          Import JSON
          <input accept="application/json" className="hidden" onChange={onImport} type="file" />
        </label>
      </div>
    </section>
  );
}

export default BackupPanel;
