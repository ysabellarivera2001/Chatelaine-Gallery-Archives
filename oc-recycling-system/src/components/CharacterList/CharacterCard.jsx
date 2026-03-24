import { Link } from "react-router-dom";

function CharacterCard({ character }) {
  return (
    <article
      className="rounded-[28px] border border-white/10 bg-surface p-5 shadow-glow"
      style={{ borderLeft: `4px solid ${character.colorHex}` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">{character.name}</h3>
          <p className="mt-1 text-sm text-muted">{character.pronouns}</p>
        </div>
        <span className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-xs text-muted">
          Group {character.group}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="h-4 w-4 rounded-full border border-white/20" style={{ backgroundColor: character.colorHex }} />
        <p className="text-sm text-muted">
          {character.colorName} / {character.personality}
        </p>
      </div>

      <p className="mt-4 max-h-[4.5rem] overflow-hidden text-sm leading-6 text-muted">{character.backstory}</p>

      <Link
        className="mt-5 inline-flex rounded-full px-4 py-2 text-sm font-semibold text-black"
        style={{ backgroundColor: character.colorHex }}
        to={`/profile/${character.id}`}
      >
        View Profile
      </Link>
    </article>
  );
}

export default CharacterCard;
