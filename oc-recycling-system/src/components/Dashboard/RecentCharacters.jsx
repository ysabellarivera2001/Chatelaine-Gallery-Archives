import { Link } from "react-router-dom";

function RecentCharacters({ characters }) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-surface p-6 shadow-glow">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#eed495]">Recent Characters</p>
          <h2 className="mt-2 font-serif text-3xl">Fast access by group order</h2>
        </div>
        <Link className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10" to="/list">
          Open List
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {characters.map((character) => (
          <Link
            key={character.id}
            to={`/profile/${character.id}`}
            className="rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:-translate-y-0.5 hover:bg-white/10"
            style={{ borderLeft: `4px solid ${character.colorHex}` }}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">{character.name}</h3>
                <p className="text-sm text-muted">{character.pronouns}</p>
              </div>
              <span
                className="inline-flex h-4 w-4 rounded-full border border-white/20"
                style={{ backgroundColor: character.colorHex }}
              />
            </div>
            <p className="mt-4 text-sm text-muted">{character.personality}</p>
            <p className="mt-2 text-sm text-muted">Group {character.group}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default RecentCharacters;
