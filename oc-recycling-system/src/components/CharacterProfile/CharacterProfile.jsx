import { Link, useParams } from "react-router-dom";
import AppearancePanel from "./AppearancePanel";

const statusFields = [
  ["Excel", "excelStatus"],
  ["Discord", "discordStatus"],
  ["Tumblr", "tumblrStatus"],
  ["AO3", "ao3Status"]
];

function CharacterProfile({ characters, getCharacter }) {
  const { id } = useParams();
  const character = getCharacter(id);

  if (!character) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-surface p-8 shadow-glow">
        <h2 className="font-serif text-3xl">Character not found</h2>
        <p className="mt-3 text-sm text-muted">The selected profile does not exist in the current archive.</p>
        <Link className="mt-5 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-black" to="/list">
          Back to list
        </Link>
      </div>
    );
  }

  const relationships = character.relationships
    .map((relationshipId) => characters.find((item) => item.id === relationshipId))
    .filter(Boolean);

  return (
    <div className="space-y-6">
      <section
        className="rounded-[32px] border border-white/10 bg-surface/95 p-6 shadow-glow"
        style={{ borderLeft: `4px solid ${character.colorHex}` }}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em]" style={{ color: character.colorHex }}>
              Character Profile
            </p>
            <h1 className="mt-3 font-serif text-4xl">{character.name}</h1>
            <p className="mt-2 text-lg text-muted">
              {character.pronouns} / {character.personality} / Group {character.group}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-muted">{character.colorName}</span>
            <Link
              className="rounded-full px-5 py-2 text-sm font-semibold text-black"
              style={{ backgroundColor: character.colorHex }}
              to={`/manage?id=${character.id}`}
            >
              Edit in Manage
            </Link>
          </div>
        </div>

        <p className="mt-6 max-w-3xl text-sm leading-7 text-muted">{character.backstory}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          {statusFields.map(([label, field]) => (
            <span
              key={field}
              className={`rounded-full border px-4 py-2 text-sm ${character[field] ? "text-black" : "text-muted"}`}
              style={{
                backgroundColor: character[field] ? character.colorHex : "rgba(255,255,255,0.03)",
                borderColor: character[field] ? character.colorHex : "rgba(255,255,255,0.1)"
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </section>

      <AppearancePanel appearance={character.appearance} />

      <section className="rounded-[28px] border border-white/10 bg-surface p-6 shadow-glow">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#eed495]">Relationships</p>
            <h2 className="mt-2 font-serif text-3xl">Connected characters</h2>
          </div>
          <Link className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10" to="/relationships">
            Open visualizer
          </Link>
        </div>

        {relationships.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {relationships.map((related) => (
              <Link
                key={related.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:-translate-y-0.5 hover:bg-white/10"
                style={{ borderLeft: `4px solid ${related.colorHex}` }}
                to={`/profile/${related.id}`}
              >
                <h3 className="text-lg font-semibold">{related.name}</h3>
                <p className="mt-1 text-sm text-muted">{related.personality}</p>
                <p className="mt-3 text-sm text-muted">{related.colorName}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-10 text-sm text-muted">
            No seeded relationships yet for this character.
          </div>
        )}
      </section>
    </div>
  );
}

export default CharacterProfile;
