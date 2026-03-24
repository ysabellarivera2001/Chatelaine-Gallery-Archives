function CharacterSelector({ characters, selectedId, onSelect, onCreateNew }) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-surface p-5 shadow-glow">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#eed495]">Characters</p>
          <h2 className="mt-2 font-serif text-2xl">Select to edit</h2>
        </div>
        <button
          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black"
          onClick={onCreateNew}
          type="button"
        >
          New
        </button>
      </div>

      <div className="max-h-[720px] space-y-3 overflow-auto pr-1">
        {characters.map((character) => {
          const active = selectedId === character.id;
          return (
            <button
              key={character.id}
              className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                active ? "border-white/20 bg-white/10" : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
              onClick={() => onSelect(character.id)}
              style={{ borderLeft: `4px solid ${character.colorHex}` }}
              type="button"
            >
              <p className="font-semibold">{character.name}</p>
              <p className="mt-1 text-sm text-muted">
                {character.personality} / Group {character.group}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default CharacterSelector;
