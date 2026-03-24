import { useEffect, useMemo, useState } from "react";
import { loadCharacters, normalizeCharacters, parsePersonality, saveCharacters } from "../data/seed";
import { validateCharacter } from "../utils/validation";

function syncRelationships(characters) {
  const validIds = new Set(characters.map((character) => character.id));

  return characters.map((character) => ({
    ...character,
    relationships: character.relationships.filter((id) => validIds.has(id) && id !== character.id).slice(0, 4)
  }));
}

export function useCharacters() {
  const [characters, setCharacters] = useState(() => loadCharacters());
  const [loading] = useState(false);

  useEffect(() => {
    saveCharacters(characters);
  }, [characters]);

  return useMemo(() => {
    const getCharacter = (id) => characters.find((character) => character.id === Number(id));

    const addCharacter = (character) => {
      const nextId = characters.reduce((max, item) => Math.max(max, item.id), 0) + 1;
      const personality = String(character.personality ?? "").trim();
      const parsed = parsePersonality(personality);
      const nextCharacter = {
        ...character,
        id: nextId,
        personality,
        mbti: parsed.mbti,
        enneagram: parsed.enneagram
      };

      const errors = validateCharacter(nextCharacter, [...characters.map((item) => item.id), nextId]);
      if (errors.length) {
        throw new Error(errors.join("\n"));
      }

      setCharacters((current) => syncRelationships([...current, nextCharacter]));
      return nextCharacter;
    };

    const updateCharacter = (id, updates) => {
      const personality = String(updates.personality ?? "").trim();
      const parsed = parsePersonality(personality);
      const updated = {
        ...updates,
        id: Number(id),
        personality,
        mbti: parsed.mbti,
        enneagram: parsed.enneagram
      };

      const errors = validateCharacter(updated, characters.map((item) => item.id));
      if (errors.length) {
        throw new Error(errors.join("\n"));
      }

      setCharacters((current) =>
        syncRelationships(current.map((character) => (character.id === Number(id) ? updated : character)))
      );
      return updated;
    };

    const deleteCharacter = (id) => {
      setCharacters((current) =>
        current
          .filter((character) => character.id !== Number(id))
          .map((character) => ({
            ...character,
            relationships: character.relationships.filter((relationshipId) => relationshipId !== Number(id))
          }))
      );
    };

    const exportData = () => JSON.stringify(characters, null, 2);

    const importData = (json) => {
      const parsed = typeof json === "string" ? JSON.parse(json) : json;
      const normalized = syncRelationships(normalizeCharacters(parsed));
      setCharacters(normalized);
      return normalized;
    };

    return {
      characters,
      loading,
      getCharacter,
      addCharacter,
      updateCharacter,
      deleteCharacter,
      exportData,
      importData
    };
  }, [characters, loading]);
}
