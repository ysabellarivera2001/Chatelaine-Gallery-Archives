function RelationshipSelector({ characters, selectedId, onChange }) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="text-xs uppercase tracking-[0.18em] text-muted">Choose a character</span>
      <select
        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
        onChange={(event) => onChange(Number(event.target.value))}
        value={selectedId}
      >
        {characters.map((character) => (
          <option key={character.id} value={character.id}>
            {character.name}
          </option>
        ))}
      </select>
    </label>
  );
}

export default RelationshipSelector;
