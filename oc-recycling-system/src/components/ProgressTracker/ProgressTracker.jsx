import { Link } from "react-router-dom";

const columns = [
  ["Excel", "excelStatus"],
  ["Discord", "discordStatus"],
  ["Tumblr", "tumblrStatus"],
  ["AO3", "ao3Status"]
];

function ProgressTracker({ characters }) {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/10 bg-surface p-6 shadow-glow">
        <p className="text-xs uppercase tracking-[0.2em] text-[#ffbcb5]">Progress Tracker</p>
        <h1 className="mt-2 font-serif text-4xl">Status board</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          Each column only shows characters with that milestone flag set to true.
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        {columns.map(([label, field]) => {
          const items = characters.filter((character) => character[field]);

          return (
            <article key={field} className="rounded-[28px] border border-white/10 bg-surface p-5 shadow-glow">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="font-serif text-2xl">{label}</h2>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted">{items.length}</span>
              </div>

              {items.length ? (
                <div className="space-y-3">
                  {items.map((character) => (
                    <Link
                      key={character.id}
                      className="block rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
                      style={{ borderLeft: `4px solid ${character.colorHex}` }}
                      to={`/profile/${character.id}`}
                    >
                      <h3 className="text-base font-semibold">{character.name}</h3>
                      <p className="mt-1 text-sm text-muted">{character.personality}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-6 text-sm text-muted">
                  No characters in this column yet.
                </div>
              )}
            </article>
          );
        })}
      </section>
    </div>
  );
}

export default ProgressTracker;
