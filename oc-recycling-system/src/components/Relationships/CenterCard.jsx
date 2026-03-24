import { Link } from "react-router-dom";

function CenterCard({ character }) {
  return (
    <article
      className="rounded-[28px] border border-white/10 bg-surface p-6 shadow-glow"
      style={{ borderLeft: `4px solid ${character.colorHex}` }}
    >
      <p className="text-xs uppercase tracking-[0.2em]" style={{ color: character.colorHex }}>
        Selected
      </p>
      <h2 className="mt-3 font-serif text-3xl">{character.name}</h2>
      <p className="mt-2 text-sm text-muted">
        {character.pronouns} / {character.personality}
      </p>
      <p className="mt-4 text-sm leading-6 text-muted">{character.backstory}</p>
      <Link
        className="mt-5 inline-flex rounded-full px-4 py-2 text-sm font-semibold text-black"
        style={{ backgroundColor: character.colorHex }}
        to={`/profile/${character.id}`}
      >
        View profile
      </Link>
    </article>
  );
}

export default CenterCard;
