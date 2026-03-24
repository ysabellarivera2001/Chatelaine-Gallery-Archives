import CharacterCard from "./CharacterCard";
import FilterBar from "./FilterBar";

function CharacterList({ filtersApi }) {
  const { filteredCharacters } = filtersApi;

  return (
    <div className="space-y-6">
      <FilterBar filtersApi={filtersApi} />

      <section className="rounded-[28px] border border-white/10 bg-surface p-5 shadow-glow">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#ffbcb5]">Master List</p>
            <h2 className="mt-2 font-serif text-3xl">Every character in one place</h2>
          </div>
          <p className="text-sm text-muted">{filteredCharacters.length} results</p>
        </div>

        {filteredCharacters.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredCharacters.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-10 text-sm text-muted">
            No characters match the current filters.
          </div>
        )}
      </section>
    </div>
  );
}

export default CharacterList;
