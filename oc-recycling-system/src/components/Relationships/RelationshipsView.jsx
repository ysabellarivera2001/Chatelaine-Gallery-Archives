import { useState } from "react";
import CenterCard from "./CenterCard";
import ConnectionCard from "./ConnectionCard";
import RelationshipSelector from "./RelationshipSelector";

function RelationshipsView({ characters, getCharacter }) {
  const [selectedId, setSelectedId] = useState(characters[0]?.id ?? 1);
  const character = getCharacter(selectedId) ?? characters[0];
  const relationships = (character?.relationships ?? [])
    .map((id) => getCharacter(id))
    .filter(Boolean);

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/10 bg-surface p-6 shadow-glow">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#ffbcb5]">Relationships</p>
            <h1 className="mt-2 font-serif text-4xl">Connection visualizer</h1>
          </div>
          <div className="w-full max-w-sm">
            <RelationshipSelector characters={characters} onChange={setSelectedId} selectedId={character?.id ?? selectedId} />
          </div>
        </div>

        {character ? (
          <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
            <CenterCard character={character} />
            {relationships.length ? (
              <div className="grid gap-4 md:grid-cols-2">
                {relationships.map((related) => (
                  <ConnectionCard key={related.id} character={related} />
                ))}
              </div>
            ) : (
              <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] px-6 py-10 text-sm text-muted">
                No relationships are stored for this character yet.
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] px-6 py-10 text-sm text-muted">
            No character selected.
          </div>
        )}
      </section>
    </div>
  );
}

export default RelationshipsView;
