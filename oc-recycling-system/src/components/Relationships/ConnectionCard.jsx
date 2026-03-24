import { Link } from "react-router-dom";

function ConnectionCard({ character }) {
  return (
    <Link
      className="rounded-[28px] border border-white/10 bg-surface p-5 shadow-glow transition hover:-translate-y-0.5"
      style={{ borderLeft: `4px solid ${character.colorHex}` }}
      to={`/profile/${character.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold">{character.name}</h3>
          <p className="mt-1 text-sm text-muted">{character.pronouns}</p>
        </div>
        <span className="h-4 w-4 rounded-full border border-white/20" style={{ backgroundColor: character.colorHex }} />
      </div>
      <p className="mt-4 text-sm text-muted">{character.personality}</p>
      <p className="mt-2 text-sm text-muted">{character.colorName}</p>
    </Link>
  );
}

export default ConnectionCard;
